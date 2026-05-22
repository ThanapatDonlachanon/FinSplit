import { prisma } from "./prisma";
import type { NextRequest } from "next/server";
import type { User } from "@prisma/client";

export async function getAuthUser(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  try {
    const user = await prisma.user.findUnique({ where: { apiToken: token } });
    return user;
  } catch {
    return null;
  }
}
