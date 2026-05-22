import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; billId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId, billId } = await params;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, icon, color, total, mode, paidBy, shares, items } = body as {
    name: string; icon: string; color: string; total: number; mode: string;
    paidBy: string | { memberId: string; amount: number }[];
    shares: { memberId: string; amount: number }[];
    items?: { name: string; price: number; sharers: string[] }[];
  };

  const bill = await prisma.$transaction(async (tx) => {
    // Delete old shares and items
    await tx.billShare.deleteMany({ where: { billId } });
    await tx.billItem.deleteMany({ where: { billId } });

    const updated = await tx.bill.update({
      where: { id: billId },
      data: {
        name,
        icon,
        color,
        total,
        mode,
        paidBy: JSON.stringify(paidBy),
        shares: {
          create: (shares || []).map((s) => ({ memberId: s.memberId, amount: s.amount })),
        },
        items: {
          create: (items || []).map((it) => ({ name: it.name, price: it.price, sharers: it.sharers })),
        },
      },
      include: { shares: true, items: true },
    });
    return updated;
  });

  return NextResponse.json({
    id: bill.id, name: bill.name, icon: bill.icon, color: bill.color,
    total: bill.total, mode: bill.mode,
    paidBy: (() => { try { return JSON.parse(bill.paidBy); } catch { return bill.paidBy; } })(),
    shares: bill.shares.map((s) => ({ memberId: s.memberId, amount: s.amount })),
    items: bill.items.map((it) => ({ name: it.name, price: it.price, sharers: it.sharers })),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; billId: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId, billId } = await params;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.bill.delete({ where: { id: billId } });
  return NextResponse.json({});
}
