import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Public — find session by shareToken (used for join links) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  const { shareToken } = await params;
  const session = await prisma.session.findUnique({
    where: { shareToken },
    include: {
      members: true,
      bills: { include: { shares: true, items: true } },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const meMember = session.members.find((m) => m.isMe);
  return NextResponse.json({
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
      shares: b.shares.map((s) => ({ memberId: s.memberId, amount: s.amount })),
      items: b.items.map((i) => ({ name: i.name, price: i.price, sharers: i.sharers })),
    })),
  });
}
