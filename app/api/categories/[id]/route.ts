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
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat || cat.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: body.name ?? cat.name,
      icon: body.icon ?? cat.icon,
      color: body.color ?? cat.color,
      type: body.type ?? cat.type,
    },
  });

  return NextResponse.json({ id: updated.id, name: updated.name, icon: updated.icon, color: updated.color, type: updated.type });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat || cat.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({});
}
