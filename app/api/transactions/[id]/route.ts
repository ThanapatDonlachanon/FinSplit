import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const txn = await prisma.transaction.findUnique({ where: { id } });
  if (!txn || txn.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      type: body.type ?? txn.type,
      amount: body.amount ?? txn.amount,
      walletId: body.walletId ?? txn.walletId,
      categoryId: body.categoryId !== undefined ? (body.categoryId || null) : txn.categoryId,
      toWalletId: body.toWalletId !== undefined ? (body.toWalletId || null) : txn.toWalletId,
      note: body.note ?? txn.note,
      date: body.date ? new Date(body.date) : txn.date,
      status: body.status ?? txn.status,
    },
  });

  return NextResponse.json({
    id: updated.id, type: updated.type, amount: updated.amount,
    walletId: updated.walletId, categoryId: updated.categoryId,
    toWalletId: updated.toWalletId, note: updated.note ?? "",
    date: updated.date.toISOString(), status: updated.status,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const txn = await prisma.transaction.findUnique({ where: { id } });
  if (!txn || txn.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });
  return NextResponse.json({});
}
