import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, type, amount, walletId, categoryId, toWalletId, note, date, status } = body as {
    id: string; type: string; amount: number; walletId: string;
    categoryId: string | null; toWalletId?: string; note: string;
    date: string; status: string;
  };

  const txn = await prisma.transaction.create({
    data: {
      id,
      type,
      amount,
      walletId,
      categoryId: categoryId || null,
      toWalletId: toWalletId || null,
      note: note ?? "",
      date: new Date(date),
      status: status ?? "confirmed",
      userId: user.id,
    },
  });

  return NextResponse.json({
    id: txn.id, type: txn.type, amount: txn.amount, walletId: txn.walletId,
    categoryId: txn.categoryId, toWalletId: txn.toWalletId,
    note: txn.note ?? "", date: txn.date.toISOString(), status: txn.status,
  });
}
