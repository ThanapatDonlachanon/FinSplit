import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function formatSession(session: Awaited<ReturnType<typeof prisma.session.findUnique>> & {
  members: { id: string; name: string; color: string; isMe: boolean }[];
  bills: {
    id: string; name: string; icon: string; color: string; total: number; mode: string; paidBy: string;
    shares: { memberId: string; amount: number }[];
    items: { name: string; price: number; sharers: string[] }[];
  }[];
}) {
  if (!session) return null;
  const meMember = session.members.find((m) => m.isMe);
  return {
    id: session.id,
    name: session.name,
    emoji: session.emoji,
    color: session.color,
    currency: session.currency,
    status: session.status,
    shareToken: session.shareToken,
    createdAt: session.createdAt.toISOString(),
    myId: meMember?.id ?? "",
    members: session.members.map((m) => ({ id: m.id, name: m.name, color: m.color, isMe: m.isMe })),
    bills: session.bills.map((b) => ({
      id: b.id, name: b.name, icon: b.icon, color: b.color, total: b.total, mode: b.mode,
      paidBy: (() => { try { return JSON.parse(b.paidBy); } catch { return b.paidBy; } })(),
      shares: b.shares.map((sh) => ({ memberId: sh.memberId, amount: sh.amount })),
      items: b.items.map((it) => ({ name: it.name, price: it.price, sharers: it.sharers })),
    })),
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      members: true,
      bills: { include: { shares: true, items: true } },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(formatSession(session as Parameters<typeof formatSession>[0]));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.session.update({
    where: { id },
    data: {
      name: body.name ?? session.name,
      emoji: body.emoji ?? session.emoji,
      color: body.color ?? session.color,
      status: body.status ?? session.status,
      currency: body.currency ?? session.currency,
    },
    include: {
      members: true,
      bills: { include: { shares: true, items: true } },
    },
  });

  return NextResponse.json(formatSession(updated as Parameters<typeof formatSession>[0]));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.session.delete({ where: { id } });
  return NextResponse.json({});
}
