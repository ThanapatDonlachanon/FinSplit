import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, name, balance, color, icon } = body as {
    id: string; name: string; balance: number; color: string; icon: string;
  };

  const wallet = await prisma.wallet.create({
    data: { id, name, balance, color, icon, userId: user.id },
  });

  return NextResponse.json({
    id: wallet.id, name: wallet.name, balance: wallet.balance,
    color: wallet.color, icon: wallet.icon,
  });
}
