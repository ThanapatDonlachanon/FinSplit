import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, name, emoji, color, currency, shareToken, myId } = body as {
    id: string; name: string; emoji: string; color: string;
    currency: string; shareToken: string; myId: string;
  };

  const session = await prisma.session.create({
    data: {
      id,
      name,
      emoji,
      color,
      currency: currency || "THB",
      shareToken,
      userId: user.id,
      members: {
        create: {
          id: myId,
          name: user.username,
          color: "#6366f1",
          isMe: true,
        },
      },
    },
    include: {
      members: true,
      bills: { include: { shares: true, items: true } },
    },
  });

  const meMember = session.members.find((m) => m.isMe);
  return NextResponse.json({
    id: session.id,
    name: session.name,
    emoji: session.emoji,
    color: session.color,
    currency: session.currency,
    status: session.status,
    shareToken: session.shareToken,
    createdAt: session.createdAt.toISOString(),
    myId: meMember?.id ?? "",
    members: session.members.map((m) => ({
      id: m.id, name: m.name, color: m.color, isMe: m.isMe,
    })),
    bills: [],
  });
}
