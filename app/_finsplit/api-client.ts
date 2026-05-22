"use client";

import type { Wallet, Transaction, Category, Budget, Session, Member, Bill } from "./types";

const BASE = "";

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export const api = {
  async upsertUser(lineAccessToken: string): Promise<{ apiToken: string; user: { id: string; username: string; emoji: string; linkedAccounts: { provider: string; id: string; name: string }[] } }> {
    const res = await fetch(`${BASE}/api/users/upsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineAccessToken }),
    });
    return handleResponse(res);
  },

  async loadData(token: string): Promise<{ wallets: Wallet[]; categories: Category[]; transactions: Transaction[]; budgets: Budget[]; sessions: Session[] }> {
    const res = await fetch(`${BASE}/api/data`, {
      headers: authHeaders(token),
    });
    return handleResponse(res);
  },

  async createWallet(token: string, wallet: Wallet): Promise<Wallet> {
    const res = await fetch(`${BASE}/api/wallets`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(wallet),
    });
    return handleResponse(res);
  },

  async updateWallet(token: string, id: string, data: Partial<Wallet>): Promise<Wallet> {
    const res = await fetch(`${BASE}/api/wallets/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteWallet(token: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/wallets/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async createTransaction(token: string, txn: Transaction): Promise<Transaction> {
    const res = await fetch(`${BASE}/api/transactions`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(txn),
    });
    return handleResponse(res);
  },

  async updateTransaction(token: string, id: string, data: Partial<Transaction>): Promise<Transaction> {
    const res = await fetch(`${BASE}/api/transactions/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteTransaction(token: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/transactions/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async createCategory(token: string, cat: Category): Promise<Category> {
    const res = await fetch(`${BASE}/api/categories`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(cat),
    });
    return handleResponse(res);
  },

  async updateCategory(token: string, id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${BASE}/api/categories/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteCategory(token: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/categories/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async createBudget(token: string, budget: Budget): Promise<Budget> {
    const res = await fetch(`${BASE}/api/budgets`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(budget),
    });
    return handleResponse(res);
  },

  async updateBudget(token: string, id: string, data: Partial<Budget>): Promise<Budget> {
    const res = await fetch(`${BASE}/api/budgets/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteBudget(token: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/budgets/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async createSession(token: string, session: Session): Promise<Session> {
    const res = await fetch(`${BASE}/api/sessions`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(session),
    });
    return handleResponse(res);
  },

  async updateSession(token: string, id: string, data: Partial<Session>): Promise<Session> {
    const res = await fetch(`${BASE}/api/sessions/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteSession(token: string, id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/sessions/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async addMember(token: string, sessionId: string, member: Member): Promise<Member> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/members`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(member),
    });
    return handleResponse(res);
  },

  async deleteMember(token: string, sessionId: string, memberId: string): Promise<void> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/members/${memberId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  async createBill(token: string, sessionId: string, bill: Bill): Promise<Bill> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/bills`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(bill),
    });
    return handleResponse(res);
  },

  async updateBill(token: string, sessionId: string, billId: string, bill: Bill): Promise<Bill> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/bills/${billId}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(bill),
    });
    return handleResponse(res);
  },

  async deleteBill(token: string, sessionId: string, billId: string): Promise<void> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/bills/${billId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    await handleResponse(res);
  },

  /** Fetch a session by its shareToken — no auth required */
  async getSessionByToken(shareToken: string): Promise<Session> {
    const res = await fetch(`${BASE}/api/sessions/token/${shareToken}`);
    return handleResponse(res);
  },

  /** Join a session as a new member linked to the current user */
  async joinSession(token: string, sessionId: string, member: Member): Promise<Member> {
    const res = await fetch(`${BASE}/api/sessions/${sessionId}/members`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(member),
    });
    return handleResponse(res);
  },
};
