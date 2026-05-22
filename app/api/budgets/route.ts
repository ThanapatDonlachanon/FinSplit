import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, categoryId, limit } = body as { id: string; categoryId: string; limit: number };

  const budget = await prisma.budget.create({
    data: { id, categoryId, limit, userId: user.id },
  });

  return NextResponse.json({ id: budget.id, categoryId: budget.categoryId, limit: budget.limit });
}
