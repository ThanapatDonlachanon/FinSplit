import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, name, icon, color, type } = body as {
    id: string; name: string; icon: string; color: string; type: string;
  };

  const cat = await prisma.category.create({
    data: { id, name, icon, color, type, userId: user.id },
  });

  return NextResponse.json({ id: cat.id, name: cat.name, icon: cat.icon, color: cat.color, type: cat.type });
}
