"use client";

/**
 * LIFF (LINE Front-end Framework) utilities
 * LIFF ID: 2010162333-ZVAcYwUz  (from https://liff.line.me/2010162333-ZVAcYwUz)
 *
 * This module handles:
 * - Initializing LIFF SDK
 * - Detecting whether the app is running inside LINE app
 * - Auto-login when opened via LINE
 * - Getting LINE profile (userId, displayName, pictureUrl)
 * - Getting LIFF context (group ID when opened from a group chat)
 */

export type LiffProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export type LiffContext = {
  type: "utou" | "room" | "group" | "square_chat" | "external" | "none";
  groupId?: string;
  roomId?: string;
  utouId?: string;
};

export type LiffState =
  | { status: "loading" }
  | { status: "unavailable" }           // Not in LINE / LIFF not supported
  | { status: "ready"; inClient: boolean; loggedIn: boolean }
  | { status: "profile"; profile: LiffProfile; context: LiffContext | null };

let _initialized = false;
let _initPromise: Promise<void> | null = null;

export async function initLiff(): Promise<void> {
  if (_initialized) return;
  if (_initPromise) return _initPromise;

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) {
    console.warn("[LIFF] NEXT_PUBLIC_LIFF_ID is not set");
    return;
  }

  _initPromise = (async () => {
    try {
      const liff = (await import("@line/liff")).default;
      await liff.init({ liffId });
      _initialized = true;
    } catch (err) {
      console.warn("[LIFF] init failed:", err);
    }
  })();

  return _initPromise;
}

export async function getLiff() {
  if (!_initialized) await initLiff();
  const liff = (await import("@line/liff")).default;
  return liff;
}

/** Returns true when running inside the LINE app WebView */
export async function isInLineClient(): Promise<boolean> {
  try {
    const liff = await getLiff();
    return liff.isInClient();
  } catch {
    return false;
  }
}

/**
 * Try to get LINE profile.
 * - If inside LINE and already logged in → return profile immediately
 * - If inside LINE but not logged in → call liff.login() (redirects, never returns)
 * - If outside LINE → return null (fall back to OAuth login screen)
 */
export async function liffAutoLogin(): Promise<LiffProfile | null> {
  try {
    const liff = await getLiff();

    if (!liff.isInClient()) return null;   // opened in browser

    if (!liff.isLoggedIn()) {
      liff.login();                         // redirect inside LINE — never returns
      return null;
    }

    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (err) {
    console.warn("[LIFF] autoLogin failed:", err);
    return null;
  }
}

/**
 * Get the LIFF context — tells us if the user opened the app from a group chat.
 * Returns null when not in LIFF or context is unavailable.
 */
export async function getLiffContext(): Promise<LiffContext | null> {
  try {
    const liff = await getLiff();
    if (!liff.isInClient()) return null;
    const ctx = liff.getContext();
    if (!ctx) return null;
    return ctx as LiffContext;
  } catch {
    return null;
  }
}

export async function getLiffAccessToken(): Promise<string | null> {
  try {
    const liff = await getLiff();
    if (!liff.isInClient() || !liff.isLoggedIn()) return null;
    return liff.getAccessToken();
  } catch { return null; }
}

/** Close the LIFF window (only works inside LINE) */
export async function closeLiff() {
  try {
    const liff = await getLiff();
    if (liff.isInClient()) liff.closeWindow();
  } catch { /* ignore */ }
}
