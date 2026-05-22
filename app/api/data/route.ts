import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [wallets, categories, transactions, budgets, ownSessions, joinedMembers] = await Promise.all([
    prisma.wallet.findMany({ where: { userId: user.id } }),
    prisma.category.findMany({ where: { userId: user.id } }),
    prisma.transaction.findMany({ where: { userId: user.id } }),
    prisma.budget.findMany({ where: { userId: user.id } }),
    // Sessions the user created
    prisma.session.findMany({
      where: { userId: user.id },
      include: { members: true, bills: { include: { shares: true, items: true } } },
    }),
    // Sessions the user joined (as a linked member)
    prisma.member.findMany({
      where: { linkedUserId: user.id },
      include: {
        session: {
          include: { members: true, bills: { include: { shares: true, items: true } } },
        },
      },
    }),
  ]);

  // Merge own + joined sessions (deduplicate by id)
  const joinedSessions = joinedMembers.map((m) => m.session).filter(Boolean);
  const allSessionIds = new Set(ownSessions.map((s) => s.id));
  const merged = [
    ...ownSessions,
    ...joinedSessions.filter((s) => s && !allSessionIds.has(s.id)),
  ].filter((s): s is NonNullable<typeof s> => Boolean(s));

  function formatSession(s: (typeof merged)[number]) {
    // isMe = created by this user OR linkedUserId === user.id
    const userId = user!.id;
    const meMember = s.members.find((m) => m.isMe || m.linkedUserId === userId);
    return {
      id: s.id,
      name: s.name,
      emoji: s.emoji,
      color: s.color,
      currency: s.currency,
      status: s.status,
      shareToken: s.shareToken,
      createdAt: s.createdAt.toISOString(),
      myId: meMember?.id ?? "",
      members: s.members.map((m) => ({
        id: m.id,
        name: m.name,
        color: m.color,
        isMe: m.isMe || m.linkedUserId === userId,
      })),
      bills: s.bills.map((b) => ({
        id: b.id, name: b.name, icon: b.icon, color: b.color, total: b.total, mode: b.mode,
        paidBy: (() => { try { return JSON.parse(b.paidBy); } catch { return b.paidBy; } })(),
        shares: b.shares.map((sh) => ({ memberId: sh.memberId, amount: sh.amount })),
        items: b.items.map((it) => ({ name: it.name, price: it.price, sharers: it.sharers })),
      })),
    };
  }

  return NextResponse.json({
    wallets: wallets.map((w) => ({ id: w.id, name: w.name, balance: w.balance, color: w.color, icon: w.icon })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon, color: c.color, type: c.type })),
    transactions: transactions.map((t) => ({
      id: t.id, type: t.type, amount: t.amount, walletId: t.walletId,
      categoryId: t.categoryId, toWalletId: t.toWalletId,
      note: t.note ?? "", date: t.date.toISOString(), status: t.status,
    })),
    budgets: budgets.map((b) => ({ id: b.id, categoryId: b.categoryId, limit: b.limit })),
    sessions: merged.map(formatSession),
  });
}
