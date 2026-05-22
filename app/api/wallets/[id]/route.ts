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
  const wallet = await prisma.wallet.findUnique({ where: { id } });
  if (!wallet || wallet.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.wallet.update({
    where: { id },
    data: {
      name: body.name ?? wallet.name,
      balance: body.balance ?? wallet.balance,
      color: body.color ?? wallet.color,
      icon: body.icon ?? wallet.icon,
    },
  });

  return NextResponse.json({
    id: updated.id, name: updated.name, balance: updated.balance,
    color: updated.color, icon: updated.icon,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const wallet = await prisma.wallet.findUnique({ where: { id } });
  if (!wallet || wallet.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.wallet.delete({ where: { id } });
  return NextResponse.json({});
}
