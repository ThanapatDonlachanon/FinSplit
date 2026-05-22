import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId } = await params;
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { id, name, color, isMe } = body as {
    id: string; name: string; color: string; isMe?: boolean;
  };

  const member = await prisma.member.create({
    data: { id, name, color, isMe: isMe ?? false, sessionId },
  });

  return NextResponse.json({ id: member.id, name: member.name, color: member.color, isMe: member.isMe });
}
