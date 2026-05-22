import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  { name: "food", icon: "🍜", color: "#f97316", type: "expense" },
  { name: "transport", icon: "🚗", color: "#3b82f6", type: "expense" },
  { name: "shop", icon: "🛍️", color: "#ec4899", type: "expense" },
  { name: "fun", icon: "🎮", color: "#8b5cf6", type: "expense" },
  { name: "health", icon: "💊", color: "#10b981", type: "expense" },
  { name: "bills", icon: "📄", color: "#f59e0b", type: "expense" },
  { name: "salary", icon: "💰", color: "#10b981", type: "income" },
  { name: "freelance", icon: "💼", color: "#06b6d4", type: "income" },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineAccessToken, username, emoji } = body as {
      lineAccessToken: string;
      username?: string;
      emoji?: string;
    };

    if (!lineAccessToken) {
      return NextResponse.json({ error: "lineAccessToken required" }, { status: 400 });
    }

    // Verify LINE token
    const lineRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${lineAccessToken}` },
    });
    if (!lineRes.ok) {
      return NextResponse.json({ error: "Invalid LINE access token" }, { status: 401 });
    }
    const lineProfile = await lineRes.json() as { userId: string; displayName: string };

    // Find existing linked account
    const existingLinkedAccount = await prisma.linkedAccount.findFirst({
      where: { provider: "line", providerUserId: lineProfile.userId },
      include: { user: { include: { linkedAccounts: true } } },
    });

    if (existingLinkedAccount) {
      // Existing user - ensure they have an apiToken
      let user = existingLinkedAccount.user;
      if (!user.apiToken) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { apiToken: crypto.randomUUID() },
          include: { linkedAccounts: true },
        });
      }
      return NextResponse.json({
        apiToken: user.apiToken,
        user: {
          id: user.id,
          username: user.username,
          emoji: user.emoji,
          linkedAccounts: user.linkedAccounts.map((a) => ({
            provider: a.provider,
            id: a.providerUserId,
            name: a.name,
          })),
        },
      });
    }

    // New user
    const apiToken = crypto.randomUUID();
    const newUser = await prisma.user.create({
      data: {
        username: username || lineProfile.displayName,
        emoji: emoji || "😊",
        apiToken,
        linkedAccounts: {
          create: {
            provider: "line",
            providerUserId: lineProfile.userId,
            name: lineProfile.displayName,
          },
        },
        categories: {
          create: DEFAULT_CATEGORIES.map((cat) => ({
            id: cat.name,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            type: cat.type,
          })),
        },
      },
      include: { linkedAccounts: true },
    });

    return NextResponse.json({
      apiToken: newUser.apiToken,
      user: {
        id: newUser.id,
        username: newUser.username,
        emoji: newUser.emoji,
        linkedAccounts: newUser.linkedAccounts.map((a) => ({
          provider: a.provider,
          id: a.providerUserId,
          name: a.name,
        })),
      },
    });
  } catch (err) {
    console.error("[upsert]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
