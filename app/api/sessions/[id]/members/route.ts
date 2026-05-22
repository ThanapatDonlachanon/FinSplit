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
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { id, name, color, isMe, linkedUserId } = body as {
    id: string; name: string; color: string; isMe?: boolean; linkedUserId?: string;
  };

  // joinSession: anyone with a valid token can add themselves as a member
  // Regular addMember: only session owner can add others
  const isJoin = linkedUserId === user.id;
  if (!isJoin && session.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check if this user already joined
  if (linkedUserId) {
    const existing = await prisma.member.findFirst({ where: { sessionId, linkedUserId } });
    if (existing) {
      return NextResponse.json({ id: existing.id, name: existing.name, color: existing.color, isMe: existing.isMe });
    }
  }

  const member = await prisma.member.create({
    data: { id, name, color, isMe: isMe ?? false, sessionId, linkedUserId: linkedUserId ?? null },
  });

  return NextResponse.json({ id: member.id, name: member.name, color: member.color, isMe: member.isMe });
}
