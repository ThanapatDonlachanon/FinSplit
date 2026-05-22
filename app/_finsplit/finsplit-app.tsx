"use client";

import React from "react";
import { THEMES } from "./themes";
import { LangProvider, useL, type Lang } from "./labels";
import { Button } from "./ui";
import { StickerScene } from "./ui";
import { Sticker } from "./icons";
import { TabBar } from "./ui";
import type { AppState, Category, Nav, TabId, TxType, User } from "./types";
import { initLiff, liffAutoLogin, getLiffAccessToken } from "./liff-utils";
import { api } from "./api-client";
import {
  HomeScreen, WalletsScreen, BudgetScreen, ProfileScreen,
  AddWalletSheet, AddTxnSheet, EditUsernameSheet, EmojiPickerSheet,
} from "./screens-finance";
import {
  GroupsScreen, CreateSessionSheet, SessionScreen, AddBillSheet, SettlementScreen,
} from "./screens-split";
import { LoginScreen, UsernamePromptScreen, LinkAccountSheet } from "./screens-auth";

const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "อาหาร", icon: "🍜", color: "#f97316", type: "expense" },
  { id: "transport", name: "คมนาคม", icon: "🚗", color: "#3b82f6", type: "expense" },
  { id: "shop", name: "ช้อปปิ้ง", icon: "🛍️", color: "#ec4899", type: "expense" },
  { id: "fun", name: "บันเทิง", icon: "🎮", color: "#8b5cf6", type: "expense" },
  { id: "health", name: "สุขภาพ", icon: "💊", color: "#10b981", type: "expense" },
  { id: "bills", name: "บิล", icon: "📄", color: "#f59e0b", type: "expense" },
  { id: "salary", name: "เงินเดือน", icon: "💰", color: "#10b981", type: "income" },
  { id: "freelance", name: "ฟรีแลนซ์", icon: "💼", color: "#06b6d4", type: "income" },
];

function makeFreshState(): AppState {
  return {
    user: null,
    onboarded: false,
    wallets: [],
    categories: DEFAULT_CATEGORIES,
    transactions: [],
    budgets: [],
    sessions: [],
    tab: "home",
    route: { name: "login" },
    sheet: null,
  };
}

function Onboarding({ t, onDone }: { t: ReturnType<typeof getTheme>; onDone: () => void }) {
  const L = useL();
  const [step, setStep] = React.useState(0);
  const steps = [
    { kind: "welcome" as const, title: L.onbWelcomeT, subtitle: L.onbWelcomeS, cta: L.onbGetStarted },
    { kind: "wallet" as const, title: L.onbWalletT, subtitle: L.onbWalletS, cta: L.next },
    { kind: "group" as const, title: L.onbSplitT, subtitle: L.onbSplitS, cta: L.onbStartUsing },
  ];
  const s = steps[step];
  return (
    <div style={{
      background: t.bg, height: "100%",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      <Sticker.Confetti color={t.primary} size={120} style={{ position: "absolute", top: 80, right: -20, opacity: 0.6 }} />
      <Sticker.Confetti color={t.amber} size={120} style={{ position: "absolute", bottom: 200, left: -30, opacity: 0.6, transform: "rotate(120deg)" }} />
      <div style={{ padding: "60px 24px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 24, position: "relative", zIndex: 1 }}>
        <div className="fs-pop" key={step} style={{ display: "flex", justifyContent: "center" }}>
          <StickerScene t={t} kind={s.kind} />
        </div>
        <div className="fs-fade" key={"t" + step}>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 30, color: t.ink, letterSpacing: -1, marginBottom: 12, lineHeight: 1.1 }}>{s.title}</div>
          <div style={{ fontFamily: t.fontBody, fontSize: 15, color: t.inkSoft, lineHeight: 1.5, maxWidth: 300, margin: "0 auto", whiteSpace: "pre-line" }}>{s.subtitle}</div>
        </div>
      </div>
      <div style={{ padding: "0 24px 50px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 4,
              background: i === step ? t.primary : t.inkMuted,
              transition: "width .2s",
            }} />
          ))}
        </div>
        <Button t={t} fullWidth onClick={() => (step < steps.length - 1 ? setStep(step + 1) : onDone())}>
          {s.cta}
        </Button>
        {step < steps.length - 1 && (
          <button onClick={onDone} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.inkSoft, fontFamily: t.fontBody, fontSize: 13, fontWeight: 600 }}>
            {L.skip}
          </button>
        )}
      </div>
    </div>
  );
}

function getTheme(id: string) { return THEMES[id] || THEMES.citrus; }

function ThemeWrap({ t, dense, children }: { t: ReturnType<typeof getTheme>; dense: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: t.bg,
      color: t.ink,
      fontFamily: t.fontBody,
      fontSize: dense ? 13 : 14,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>{children}</div>
  );
}

function ScrollArea({ children }: { children: React.ReactNode }) {
  return <div className="fs-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>{children}</div>;
}

function Sheets({
  t, state, setState, closeSheet, nav,
}: {
  t: ReturnType<typeof getTheme>;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  closeSheet: () => void;
  nav: Nav;
}) {
  const sh = state.sheet;
  return (
    <>
      <AddWalletSheet t={t} state={state} setState={setState}
        open={sh?.kind === "addWallet"} onClose={closeSheet}
        editId={sh?.kind === "addWallet" ? sh.editId : undefined} />
      <AddTxnSheet t={t} state={state} setState={setState}
        open={sh?.kind === "addTxn"} onClose={closeSheet}
        defaultType={sh?.kind === "addTxn" ? sh.defaultType : undefined}
        editId={sh?.kind === "addTxn" ? sh.editId : undefined}
        onNoWallets={() => nav.openAddWallet()} />
      <CreateSessionSheet t={t} state={state} setState={setState}
        open={sh?.kind === "createSession"} onClose={closeSheet}
        onDone={(id) => setState((s) => ({ ...s, route: { name: "session", id } }))} />
      <AddBillSheet t={t} state={state} setState={setState}
        open={sh?.kind === "addBill"}
        sessionId={sh?.kind === "addBill" ? sh.sessionId : undefined}
        editId={sh?.kind === "addBill" ? sh.editId : undefined}
        onClose={closeSheet} />
      <EditUsernameSheet t={t} state={state} setState={setState}
        open={sh?.kind === "editUsername"} onClose={closeSheet} />
      <EmojiPickerSheet t={t} state={state} setState={setState}
        open={sh?.kind === "emojiPicker"} onClose={closeSheet} />
      <LinkAccountSheet
        t={t}
        linkedAccounts={state.user?.linkedAccounts || []}
        open={sh?.kind === "linkAccount"}
        onClose={closeSheet}
        onLinkLine={() => {
          setState((s) => ({
            ...s,
            user: s.user ? {
              ...s.user,
              linkedAccounts: [...(s.user.linkedAccounts || []), { provider: "line", id: "line_" + Date.now(), name: "LINE User" }],
            } : null,
          }));
          closeSheet();
        }}
        onLinkGoogle={() => {
          setState((s) => ({
            ...s,
            user: s.user ? {
              ...s.user,
              linkedAccounts: [...(s.user.linkedAccounts || []), { provider: "google", id: "google_" + Date.now(), name: "Google User" }],
            } : null,
          }));
          closeSheet();
        }}
      />
    </>
  );
}

const STORAGE_KEY = "finsplit-v1";

type StoredPrefs = { themeId: string; lang: Lang; user: User | null; onboarded: boolean };

function loadPrefs(): StoredPrefs {
  if (typeof window === "undefined") return { themeId: "citrus", lang: "th", user: null, onboarded: false };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredPrefs>;
      return {
        themeId: parsed.themeId && THEMES[parsed.themeId] ? parsed.themeId : "citrus",
        lang: parsed.lang === "en" ? "en" : "th",
        user: parsed.user || null,
        onboarded: parsed.onboarded === true,
      };
    }
  } catch { /* ignore */ }
  return { themeId: "citrus", lang: "th", user: null, onboarded: false };
}

async function syncDiff(prev: AppState, next: AppState, token: string) {
  function diffById<T extends { id: string }>(prevArr: T[], nextArr: T[]) {
    const added = nextArr.filter(n => !prevArr.find(p => p.id === n.id));
    const updated = nextArr.filter(n => {
      const p = prevArr.find(p => p.id === n.id);
      return p && JSON.stringify(p) !== JSON.stringify(n);
    });
    const deletedIds = prevArr.filter(p => !nextArr.find(n => n.id === p.id)).map(p => p.id);
    return { added, updated, deletedIds };
  }

  const w = diffById(prev.wallets, next.wallets);
  for (const x of w.added) await api.createWallet(token, x).catch(console.error);
  for (const x of w.updated) await api.updateWallet(token, x.id, x).catch(console.error);
  for (const id of w.deletedIds) await api.deleteWallet(token, id).catch(console.error);

  const tr = diffById(prev.transactions, next.transactions);
  for (const x of tr.added) await api.createTransaction(token, x).catch(console.error);
  for (const x of tr.updated) await api.updateTransaction(token, x.id, x).catch(console.error);
  for (const id of tr.deletedIds) await api.deleteTransaction(token, id).catch(console.error);

  const defaultCatIds = new Set(["food", "transport", "shop", "fun", "health", "bills", "salary", "freelance"]);
  const userCats = { prev: prev.categories.filter(c => !defaultCatIds.has(c.id)), next: next.categories.filter(c => !defaultCatIds.has(c.id)) };
  const cat = diffById(userCats.prev, userCats.next);
  for (const x of cat.added) await api.createCategory(token, x).catch(console.error);
  for (const x of cat.updated) await api.updateCategory(token, x.id, x).catch(console.error);
  for (const id of cat.deletedIds) await api.deleteCategory(token, id).catch(console.error);

  const bu = diffById(prev.budgets, next.budgets);
  for (const x of bu.added) await api.createBudget(token, x).catch(console.error);
  for (const x of bu.updated) await api.updateBudget(token, x.id, x).catch(console.error);
  for (const id of bu.deletedIds) await api.deleteBudget(token, id).catch(console.error);

  const sess = diffById(prev.sessions, next.sessions);
  for (const s of sess.added) {
    await api.createSession(token, s).catch(console.error);
    for (const m of s.members.filter(m => !m.isMe)) await api.addMember(token, s.id, m).catch(console.error);
    for (const b of s.bills) await api.createBill(token, s.id, b).catch(console.error);
  }
  for (const s of sess.updated) {
    const old = prev.sessions.find(x => x.id === s.id)!;
    await api.updateSession(token, s.id, s).catch(console.error);
    const mn = diffById(old.members, s.members);
    for (const m of mn.added) await api.addMember(token, s.id, m).catch(console.error);
    for (const id of mn.deletedIds) await api.deleteMember(token, s.id, id).catch(console.error);
    const bl = diffById(old.bills, s.bills);
    for (const b of bl.added) await api.createBill(token, s.id, b).catch(console.error);
    for (const b of bl.updated) await api.updateBill(token, s.id, b.id, b).catch(console.error);
    for (const id of bl.deletedIds) await api.deleteBill(token, s.id, id).catch(console.error);
  }
  for (const id of sess.deletedIds) await api.deleteSession(token, id).catch(console.error);
}

export default function FinSplitApp() {
  const [themeId, setThemeId] = React.useState<string>("citrus");
  const [lang, setLang] = React.useState<Lang>("th");
  const [state, _setState] = React.useState<AppState>(() => makeFreshState());
  const t = getTheme(themeId);

  const [apiToken, setApiToken] = React.useState<string | null>(null);
  const apiTokenRef = React.useRef<string | null>(null);
  React.useEffect(() => { apiTokenRef.current = apiToken; }, [apiToken]);

  const prevStateRef = React.useRef<AppState | null>(null);

  const setState = React.useCallback((updater: React.SetStateAction<AppState>) => {
    _setState(prev => {
      const next = typeof updater === "function" ? (updater as (s: AppState) => AppState)(prev) : updater;
      if (apiTokenRef.current && prevStateRef.current) {
        syncDiff(prevStateRef.current, next, apiTokenRef.current).catch(console.error);
      }
      prevStateRef.current = next;
      return next;
    });
  }, []);

  // ── LIFF init: runs first, auto-login when opened inside LINE ────────────
  React.useEffect(() => {
    initLiff().then(async () => {
      const profile = await liffAutoLogin();
      if (!profile) return; // not in LINE, fall through to normal flow

      setState((s) => {
        const prefs = loadPrefs();

        // Returning user: same LINE account already saved locally
        if (
          prefs.user &&
          prefs.user.linkedAccounts.some(
            (a) => a.provider === "line" && a.id === profile.userId
          )
        ) {
          return {
            ...s,
            user: prefs.user,
            onboarded: prefs.onboarded,
            route: prefs.onboarded ? { name: "tab" } : { name: "usernamePrompt" },
          };
        }

        // New user: pre-fill with LINE display name (user can still edit it)
        return {
          ...s,
          user: {
            id: profile.userId,
            username: profile.displayName,
            emoji: "😊",
            linkedAccounts: [
              { provider: "line", id: profile.userId, name: profile.displayName },
            ],
          },
          route: { name: "usernamePrompt" },
        };
      });

      // Get LINE access token and upsert user to DB
      const accessToken = await getLiffAccessToken();
      if (accessToken) {
        try {
          const result = await api.upsertUser(accessToken);
          setApiToken(result.apiToken);
          apiTokenRef.current = result.apiToken;
          if (typeof window !== "undefined") {
            localStorage.setItem("finsplit-api-token", result.apiToken);
          }
          // Load all data from DB
          const data = await api.loadData(result.apiToken);
          prevStateRef.current = { ...makeFreshState(), ...data };
          setState(s => ({
            ...s,
            ...data,
            user: s.user, // keep user as set above
          }));
        } catch (e) {
          console.error("[DB] upsert failed", e);
        }
      }
    });
  }, []);

  // ── Local prefs + OAuth callback results ─────────────────────────────────
  React.useEffect(() => {
    // Restore saved API token and load data from DB
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("finsplit-api-token") : null;
    if (savedToken) {
      setApiToken(savedToken);
      apiTokenRef.current = savedToken;
      api.loadData(savedToken).then(data => {
        prevStateRef.current = { ...makeFreshState(), ...data };
        setState(s => {
          if (s.user) return { ...s, ...data }; // user already set by LIFF
          return s; // wait for LIFF
        });
      }).catch(console.error);
    }

    const p = loadPrefs();
    setThemeId(p.themeId);
    setLang(p.lang);
    if (p.user) {
      setState((s) => {
        // Don't overwrite if LIFF already set a user
        if (s.user) return s;
        return { ...s, user: p.user, onboarded: p.onboarded };
      });
    }

    // Check for OAuth callback results
    if (typeof window !== "undefined") {
      const googleUser = sessionStorage.getItem("google_auth_user");
      const lineUser = sessionStorage.getItem("line_auth_user");
      const googleLinked = sessionStorage.getItem("google_linked_account");
      const lineLinked = sessionStorage.getItem("line_linked_account");

      // Handle linked accounts (adding to existing user)
      if (googleLinked) {
        const account = JSON.parse(googleLinked);
        sessionStorage.removeItem("google_linked_account");
        setState((s) => ({
          ...s,
          user: s.user ? {
            ...s.user,
            linkedAccounts: [
              ...s.user.linkedAccounts.filter((a) => a.provider !== "google"),
              { provider: "google", id: account.id, name: account.name },
            ],
          } : null,
          sheet: null,
        }));
      } else if (lineLinked) {
        const account = JSON.parse(lineLinked);
        sessionStorage.removeItem("line_linked_account");
        setState((s) => ({
          ...s,
          user: s.user ? {
            ...s.user,
            linkedAccounts: [
              ...s.user.linkedAccounts.filter((a) => a.provider !== "line"),
              { provider: "line", id: account.id, name: account.name },
            ],
          } : null,
          sheet: null,
        }));
      } else if (googleUser) {
        const user = JSON.parse(googleUser);
        sessionStorage.removeItem("google_auth_user");
        setState((s) => ({
          ...s,
          user: {
            id: user.id,
            username: "",
            emoji: "😊",
            linkedAccounts: [{ provider: "google", id: user.id, name: user.name }],
          },
          route: { name: "usernamePrompt" },
        }));
      } else if (lineUser) {
        const user = JSON.parse(lineUser);
        sessionStorage.removeItem("line_auth_user");
        setState((s) => ({
          ...s,
          user: {
            id: user.id,
            username: "",
            emoji: "😊",
            linkedAccounts: [{ provider: "line", id: user.id, name: user.name }],
          },
          route: { name: "usernamePrompt" },
        }));
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId, lang, user: state.user, onboarded: state.onboarded })); } catch { /* ignore */ }
  }, [themeId, lang, state.user, state.onboarded]);

  const nav = React.useMemo<Nav>(() => ({
    openAddWallet: () => setState((s) => ({ ...s, sheet: { kind: "addWallet" } })),
    editWallet: (id) => setState((s) => ({ ...s, sheet: { kind: "addWallet", editId: id } })),
    openAddTxn: (type: TxType) => setState((s) => ({ ...s, sheet: { kind: "addTxn", defaultType: type } })),
    editTxn: (id) => setState((s) => ({ ...s, sheet: { kind: "addTxn", editId: id } })),
    openAddBudget: () => { /* not yet implemented */ },
    openCreateSession: () => setState((s) => ({ ...s, sheet: { kind: "createSession" } })),
    openSession: (id) => setState((s) => ({ ...s, route: { name: "session", id } })),
    openAddBill: (sessionId) => setState((s) => ({ ...s, sheet: { kind: "addBill", sessionId } })),
    editBill: (sessionId, billId) => setState((s) => ({ ...s, sheet: { kind: "addBill", sessionId, editId: billId } })),
    openSettle: () => setState((s) => (s.route.name === "session" ? { ...s, route: { name: "settle", id: s.route.id } } : s)),
    backToGroups: () => setState((s) => ({ ...s, route: { name: "tab" }, tab: "groups" })),
    backToSession: (id) => setState((s) => ({ ...s, route: { name: "session", id } })),
    setTheme: (id) => setThemeId(id),
    setLang: (l) => setLang(l),
    logout: () => setState((s) => ({ ...s, user: null, route: { name: "login" } })),
    openEditUsername: () => setState((s) => ({ ...s, sheet: { kind: "editUsername" } })),
    openEmojiPicker: () => setState((s) => ({ ...s, sheet: { kind: "emojiPicker" } })),
    openLinkAccount: () => setState((s) => ({ ...s, sheet: { kind: "linkAccount" } })),
  }), [setState]);

  const closeSheet = React.useCallback(() => setState((s) => ({ ...s, sheet: null })), [setState]);

  if (!state.user) {
    return (
      <LangProvider lang={lang}>
        <ThemeWrap t={t} dense={false}>
          <LoginScreen t={t} />
        </ThemeWrap>
      </LangProvider>
    );
  }

  if (state.route.name === "usernamePrompt") {
    return (
      <LangProvider lang={lang}>
        <ThemeWrap t={t} dense={false}>
          <UsernamePromptScreen
            t={t}
            emoji={state.user?.emoji || "😊"}
            onConfirm={(username) => {
              setState((s) => ({
                ...s,
                user: s.user ? { ...s.user, username } : null,
                route: { name: "tab" },
                onboarded: true,
              }));
            }}
          />
        </ThemeWrap>
      </LangProvider>
    );
  }

  if (!state.onboarded) {
    return (
      <LangProvider lang={lang}>
        <ThemeWrap t={t} dense={false}>
          <Onboarding t={t} onDone={() => setState((s) => ({ ...s, onboarded: true }))} />
        </ThemeWrap>
      </LangProvider>
    );
  }

  if (state.route.name === "session") {
    const sid = state.route.id;
    return (
      <LangProvider lang={lang}>
        <ThemeWrap t={t} dense={false}>
          <ScrollArea>
            <SessionScreen t={t} state={state} nav={nav} sessionId={sid} />
          </ScrollArea>
          <Sheets t={t} state={state} setState={setState} closeSheet={closeSheet} nav={nav} />
        </ThemeWrap>
      </LangProvider>
    );
  }
  if (state.route.name === "settle") {
    const sid = state.route.id;
    return (
      <LangProvider lang={lang}>
        <ThemeWrap t={t} dense={false}>
          <ScrollArea>
            <SettlementScreen t={t} state={state} nav={nav} sessionId={sid} />
          </ScrollArea>
          <Sheets t={t} state={state} setState={setState} closeSheet={closeSheet} nav={nav} />
        </ThemeWrap>
      </LangProvider>
    );
  }

  const renderTab = () => {
    switch (state.tab) {
      case "wallets": return <WalletsScreen t={t} state={state} nav={nav} />;
      case "groups": return <GroupsScreen t={t} state={state} nav={nav} />;
      case "budget": return <BudgetScreen t={t} state={state} nav={nav} />;
      case "profile": return <ProfileScreen t={t} state={state} setState={setState} nav={nav} themeId={themeId} lang={lang} />;
      case "home":
      default: return <HomeScreen t={t} state={state} nav={nav} />;
    }
  };

  return (
    <LangProvider lang={lang}>
      <ThemeWrap t={t} dense={false}>
        <ScrollArea>
          {renderTab()}
        </ScrollArea>
        <TabBar t={t} current={state.tab}
          onTabChange={(tab) => setState((s) => ({ ...s, tab: tab as TabId }))}
          onAdd={() => {
            if (state.tab === "groups") nav.openCreateSession();
            else nav.openAddTxn("expense");
          }}
        />
        <Sheets t={t} state={state} setState={setState} closeSheet={closeSheet} nav={nav} />
      </ThemeWrap>
    </LangProvider>
  );
}
