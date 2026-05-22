"use client";

import React from "react";
import { Theme } from "./themes";
import { useL, useLang } from "./labels";
import { Ic, Sticker, Avatar } from "./icons";
import {
  Button, IconButton, Card, Input, Money, Header,
  BottomSheet, EmptyState, StickerScene, Field,
} from "./ui";
import { modeShort } from "./labels";
import type { AppState, Nav, Bill, BillMode, Member, Session, BillShare } from "./types";

type SetState = React.Dispatch<React.SetStateAction<AppState>>;

export function minimizeTransfers(balances: Record<string, number>): { from: string; to: string; amount: number }[] {
  const eps = 0.01;
  const entries = Object.entries(balances)
    .map(([id, v]) => ({ id, v: Math.round(v * 100) / 100 }))
    .filter((x) => Math.abs(x.v) > eps);
  const transfers: { from: string; to: string; amount: number }[] = [];
  while (entries.length > 1) {
    entries.sort((a, b) => a.v - b.v);
    const debtor = entries[0];
    const creditor = entries[entries.length - 1];
    if (Math.abs(debtor.v) < eps || creditor.v < eps) break;
    const amt = Math.min(-debtor.v, creditor.v);
    transfers.push({ from: debtor.id, to: creditor.id, amount: Math.round(amt * 100) / 100 });
    debtor.v += amt; creditor.v -= amt;
    if (Math.abs(debtor.v) < eps) entries.shift();
    if (Math.abs(creditor.v) < eps) entries.pop();
  }
  return transfers;
}

export function computeBalances(session: Session): Record<string, number> {
  const bal: Record<string, number> = {};
  session.members.forEach((m) => { bal[m.id] = 0; });
  session.bills.forEach((bill) => {
    if (Array.isArray(bill.paidBy)) {
      bill.paidBy.forEach((p) => { bal[p.memberId] = (bal[p.memberId] || 0) + p.amount; });
    } else {
      bal[bill.paidBy] = (bal[bill.paidBy] || 0) + bill.total;
    }
    bill.shares.forEach((s) => { bal[s.memberId] = (bal[s.memberId] || 0) - s.amount; });
  });
  return bal;
}

export function GroupsScreen({ t, state, nav }: { t: Theme; state: AppState; nav: Nav }) {
  const L = useL();
  return (
    <div style={{ paddingBottom: 12 }}>
      <Header t={t} title={L.groupsT} subtitle={L.groupsSub} big actions={
        state.sessions.length > 0 ? (
          <IconButton t={t} icon={<Ic.Plus size={20} color="#fff" />} kind="primary" onClick={() => nav.openCreateSession()} />
        ) : null
      } />
      {state.sessions.length === 0 ? (
        <EmptyState
          t={t}
          sticker={<StickerScene t={t} kind="group" />}
          title={L.emptyGroupT}
          subtitle={L.emptyGroupS}
          ctaLabel={L.emptyGroupCta}
          onCta={() => nav.openCreateSession()}
          secondaryLabel={L.haveInvite}
          onSecondary={() => { /* deep-link join — placeholder */ }}
        />
      ) : (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {state.sessions.map((s) => {
            const bal = computeBalances(s);
            const myNet = bal[s.myId] || 0;
            return (
              <Card key={s.id} t={t} padding={16} onClick={() => nav.openSession(s.id)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: t.cornerSm,
                    background: s.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, flexShrink: 0,
                  }}>{s.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 16, color: t.ink, letterSpacing: -0.3 }}>{s.name}</div>
                      <StatusBadge t={t} status={s.status} />
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                      {s.members.slice(0, 4).map((m, i) => (
                        <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                          <Avatar name={m.name} color={m.color} size={22} border={`2px solid ${t.surface}`} />
                        </div>
                      ))}
                      {s.members.length > 4 && (
                        <span style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft, marginLeft: 4 }}>+{s.members.length - 4}</span>
                      )}
                      <span style={{ marginLeft: "auto", fontFamily: t.fontBody, fontSize: 11, color: t.inkMuted }}>
                        {s.bills.length} {L.bills}
                      </span>
                    </div>
                    {s.bills.length > 0 && (
                      <div style={{
                        marginTop: 10, padding: "8px 10px",
                        background: myNet === 0 ? t.surfaceAlt : myNet > 0 ? t.emerald + "1a" : t.rose + "1a",
                        borderRadius: t.cornerSm,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                      }}>
                        <span style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft }}>
                          {myNet > 0.01 ? L.youOwed : myNet < -0.01 ? L.youOwe : L.settledYou}
                        </span>
                        {Math.abs(myNet) > 0.01 && <Money t={t} amount={Math.abs(myNet)} size={14} color={myNet > 0 ? t.emerald : t.rose} />}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ t, status }: { t: Theme; status: string }) {
  const conf = ({
    active: { label: "Active", bg: t.emerald, fg: "#fff" },
    settling: { label: "Settling", bg: t.amber, fg: t.ink },
    closed: { label: "Closed", bg: t.inkMuted, fg: "#fff" },
  } as Record<string, { label: string; bg: string; fg: string }>)[status] || { label: status, bg: t.inkMuted, fg: "#fff" };
  return (
    <span style={{
      background: conf.bg, color: conf.fg,
      fontFamily: t.fontBody, fontSize: 9, fontWeight: 700,
      padding: "3px 7px", borderRadius: 999,
      letterSpacing: 0.5, textTransform: "uppercase",
    }}>{conf.label}</span>
  );
}

export function CreateSessionSheet({
  t, state, setState, open, onClose, onDone,
}: {
  t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void; onDone: (id: string) => void;
}) {
  const L = useL();
  const lang = useLang();
  const [name, setName] = React.useState("");
  const [emoji, setEmoji] = React.useState("🌴");
  const [colorIdx, setColorIdx] = React.useState(0);
  const [members, setMembers] = React.useState<{ id: string; name: string; isMe?: boolean; colorIdx: number }[]>([
    { id: "me", name: lang === "en" ? "You" : "คุณ", isMe: true, colorIdx: 0 },
  ]);
  const [adding, setAdding] = React.useState("");
  const [share, setShare] = React.useState(false);
  const [createdId, setCreatedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setName(""); setEmoji("🌴"); setColorIdx(0);
      setMembers([{ id: "me", name: lang === "en" ? "You" : "คุณ", isMe: true, colorIdx: 0 }]);
      setAdding(""); setShare(false); setCreatedId(null);
    }
  }, [open, lang]);

  const emojis = ["🌴", "🍜", "🎉", "🏖️", "🍰", "🎬", "🛒", "✈️", "🎁", "🍻"];

  const addMember = () => {
    const n = adding.trim();
    if (!n) return;
    setMembers((ms) => [...ms, { id: "u" + Date.now(), name: n, colorIdx: ms.length % t.swatches.length }]);
    setAdding("");
  };

  const create = () => {
    const id = "sess" + Date.now();
    const session: Session = {
      id,
      name: name || (lang === "en" ? "Untitled group" : "กลุ่มไม่มีชื่อ"),
      emoji,
      color: t.swatches[colorIdx],
      myId: "me",
      members: members.map((m) => ({ id: m.id, name: m.name, isMe: m.isMe, color: t.swatches[m.colorIdx] })),
      bills: [],
      status: "active",
      currency: "THB",
      shareToken: "fs-" + Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, sessions: [session, ...s.sessions] }));
    setCreatedId(id);
    setShare(true);
  };

  if (share && createdId) {
    const fallback: Session = {
      id: createdId, name, emoji, color: t.swatches[colorIdx],
      myId: "me",
      members: members.map((m) => ({ id: m.id, name: m.name, isMe: m.isMe, color: t.swatches[m.colorIdx] })),
      bills: [], status: "active", currency: "THB", shareToken: "fs-abc123", createdAt: new Date().toISOString(),
    };
    return (
      <BottomSheet t={t} open={open} onClose={() => { onClose(); onDone(createdId); }} maxHeight="80%">
        <ShareLinkContent t={t} session={state.sessions.find((s) => s.id === createdId) || fallback}
          onClose={() => { onClose(); onDone(createdId); }} />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet t={t} open={open} onClose={onClose} title={L.createGroupT} maxHeight="92%">
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field t={t} label={L.groupNameLbl}>
          <Input t={t} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.groupNameP} autoFocus />
        </Field>
        <Field t={t} label={L.emojiLbl}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {emojis.map((e) => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{
                  width: 40, height: 40, borderRadius: t.cornerSm,
                  background: emoji === e ? t.primary + "22" : t.surfaceAlt,
                  border: `1px solid ${emoji === e ? t.primary : t.hairline}`,
                  cursor: "pointer", fontSize: 20,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{e}</button>
            ))}
          </div>
        </Field>
        <Field t={t} label={L.colorLbl}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {t.swatches.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: c, cursor: "pointer",
                  border: colorIdx === i ? `3px solid ${t.ink}` : "none",
                }} />
            ))}
          </div>
        </Field>

        <Field t={t} label={`${L.memberCount} · ${members.length}`}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {members.map((m) => (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px",
                background: t.surface,
                border: `1px solid ${t.hairline}`,
                borderRadius: t.cornerSm,
              }}>
                <Avatar name={m.name} color={t.swatches[m.colorIdx]} size={28} />
                <span style={{ flex: 1, fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>
                  {m.name} {m.isMe && <span style={{ fontSize: 10, color: t.inkMuted, fontWeight: 500, marginLeft: 4 }}>({L.you})</span>}
                </span>
                {!m.isMe && (
                  <button onClick={() => setMembers((ms) => ms.filter((x) => x.id !== m.id))}
                    style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
                    <Ic.Close size={16} color={t.inkMuted} />
                  </button>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <Input t={t} value={adding} onChange={(e) => setAdding(e.target.value)}
                placeholder={L.friendNameP}
                style={{ flex: 1 }} />
              <Button t={t} kind="secondary" onClick={addMember} icon={<Ic.Plus size={16} color={t.ink} />}>{L.add}</Button>
            </div>
          </div>
        </Field>

        <Button t={t} fullWidth onClick={create} disabled={!name || members.length < 2}>
          {L.createInvite}
        </Button>
      </div>
    </BottomSheet>
  );
}

function ShareLinkContent({ t, session, onClose }: { t: Theme; session: Session; onClose: () => void }) {
  const L = useL();
  const [copied, setCopied] = React.useState(false);
  const url = `finsplit.app/s/${session.shareToken}`;
  return (
    <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
      <StickerScene t={t} kind="done" />
      <div>
        <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 22, color: t.ink, letterSpacing: -0.5 }}>{L.groupCreated}</div>
        <div style={{ fontFamily: t.fontBody, fontSize: 13, color: t.inkSoft, marginTop: 4 }}>{L.sendLink}</div>
      </div>
      <Card t={t} padding={14} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            flex: 1, fontFamily: t.fontNum, fontSize: 13, color: t.ink,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{url}</div>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            style={{
              background: copied ? t.emerald : t.primary, color: "#fff",
              border: "none",
              borderRadius: t.cornerSm,
              padding: "8px 12px", cursor: "pointer",
              fontFamily: t.fontBody, fontWeight: 600, fontSize: 12,
              display: "flex", alignItems: "center", gap: 4,
            }}>
            {copied ? <><Ic.Check size={14} color="#fff" /> {L.copied}</> : <><Ic.Copy size={14} color="#fff" /> {L.copy}</>}
          </button>
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10, width: "100%" }}>
        <Button t={t} kind="secondary" fullWidth icon={<Ic.Share size={16} color={t.ink} />}>{L.share}</Button>
        <Button t={t} fullWidth onClick={onClose}>{L.startNow}</Button>
      </div>
    </div>
  );
}

export function SessionScreen({
  t, state, nav, sessionId,
}: { t: Theme; state: AppState; nav: Nav; sessionId: string }) {
  const L = useL();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return null;
  const balances = computeBalances(session);
  const myNet = balances[session.myId] || 0;
  const hasBills = session.bills.length > 0;

  return (
    <div style={{ paddingBottom: 12 }}>
      <div style={{
        padding: "10px 20px 20px",
        background: session.color,
        color: "#fff",
        position: "relative", overflow: "hidden",
      }}>
        <Sticker.Burst color="rgba(255,255,255,0.18)" size={70} style={{ position: "absolute", top: -10, right: -10 }} />
        <Sticker.Confetti color="rgba(255,255,255,0.35)" size={70} style={{ position: "absolute", bottom: -10, left: 60 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={nav.backToGroups} style={{ background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.ChevL size={20} color="#fff" />
          </button>
          <button style={{ background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.Share size={18} color="#fff" />
          </button>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: t.cornerMd,
            background: "rgba(255,255,255,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, flexShrink: 0,
          }}>{session.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>{session.name}</div>
            <div style={{ fontFamily: t.fontBody, fontSize: 12, opacity: 0.85, marginTop: 2 }}>{session.members.length} {L.membersWord} · {session.bills.length} {L.bills}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(255,255,255,0.18)", borderRadius: t.cornerMd, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {hasBills ? (
            <>
              <div>
                <div style={{ fontFamily: t.fontBody, fontSize: 11, opacity: 0.9 }}>
                  {myNet > 0.01 ? L.youWillReceive : myNet < -0.01 ? L.youMustPay : L.youSettled}
                </div>
                {Math.abs(myNet) > 0.01 ? (
                  <Money t={t} amount={Math.abs(myNet)} size={26} color="#fff" />
                ) : (
                  <div style={{ fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 700 }}>{L.settledBadge}</div>
                )}
              </div>
              <Button t={t} kind="accent" onClick={nav.openSettle}>{L.viewSettle}</Button>
            </>
          ) : (
            <div style={{ fontFamily: t.fontBody, fontSize: 13, opacity: 0.95 }}>{L.noBillsYet}</div>
          )}
        </div>
      </div>

      <div style={{ padding: "14px 20px 4px", display: "flex", gap: 8, overflowX: "auto" }}>
        {session.members.map((m) => {
          const net = balances[m.id] || 0;
          return (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px 6px 6px",
              background: t.surface,
              border: `1px solid ${t.hairline}`,
              borderRadius: 999,
              flexShrink: 0,
            }}>
              <Avatar name={m.name} color={m.color} size={24} />
              <div>
                <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 11, color: t.ink, lineHeight: 1 }}>{m.name}</div>
                <div style={{
                  fontFamily: t.fontNum, fontWeight: 600, fontSize: 11,
                  color: Math.abs(net) < 0.01 ? t.inkMuted : net > 0 ? t.emerald : t.rose,
                  lineHeight: 1, marginTop: 2,
                }}>
                  {Math.abs(net) < 0.01 ? "✓" : (net > 0 ? "+" : "−") + "฿" + Math.round(Math.abs(net)).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 16, color: t.ink }}>{L.billsHere}</div>
          <Button t={t} kind="primary" onClick={() => nav.openAddBill(session.id)} icon={<Ic.Plus size={16} color="#fff" />} style={{ padding: "8px 14px", fontSize: 13 }}>{L.addBill}</Button>
        </div>
        {!hasBills ? (
          <EmptyState
            t={t}
            sticker={<StickerScene t={t} kind="group" />}
            title={L.noBillT}
            subtitle={L.noBillS}
            ctaLabel={L.noBillCta}
            onCta={() => nav.openAddBill(session.id)}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {session.bills.map((bill) => <BillCard key={bill.id} t={t} bill={bill} session={session} onEdit={(id) => nav.editBill(session.id, id)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function BillCard({
  t, bill, session, onEdit,
}: { t: Theme; bill: Bill; session: Session; onEdit: (id: string) => void }) {
  const L = useL();
  const payers = Array.isArray(bill.paidBy)
    ? bill.paidBy.map((p) => session.members.find((m) => m.id === p.memberId)).filter((m): m is Member => Boolean(m))
    : [session.members.find((m) => m.id === bill.paidBy)].filter((m): m is Member => Boolean(m));
  const modeLabel = modeShort(bill.mode, L);
  return (
    <Card t={t} padding={14} onClick={() => onEdit(bill.id)}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: t.cornerSm,
          background: bill.color || t.amber + "33",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>{bill.icon || "🧾"}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 15, color: t.ink, letterSpacing: -0.2 }}>{bill.name}</div>
            <Money t={t} amount={bill.total} size={15} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span style={{
              fontFamily: t.fontBody, fontSize: 10, fontWeight: 700,
              background: t.surfaceAlt, color: t.inkSoft,
              padding: "2px 7px", borderRadius: 999,
            }}>{modeLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {payers.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                  <Avatar name={p.name} color={p.color} size={18} border={`1.5px solid ${t.surface}`} />
                </div>
              ))}
              <span style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft, marginLeft: 4 }}>{L.paidWord}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AddBillSheet({
  t, state, setState, open, onClose, sessionId, editId,
}: {
  t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void;
  sessionId?: string; editId?: string;
}) {
  const L = useL();
  const session = sessionId ? state.sessions.find((s) => s.id === sessionId) : undefined;
  const editing: Bill | null = (editId && session ? session.bills.find((b) => b.id === editId) : null) ?? null;
  const [mode, setMode] = React.useState<BillMode | null>(null);
  React.useEffect(() => {
    if (!open) return;
    setMode(editing ? editing.mode : null);
  }, [open, editId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!session) return null;

  const close = () => { setMode(null); onClose(); };
  const back = () => (editing ? close() : setMode(null));

  return (
    <BottomSheet t={t} open={open} onClose={close} title={mode === null ? L.pickModeT : undefined} maxHeight="94%">
      {mode === null && <ModePicker t={t} onPick={setMode} />}
      {mode === "equal" && <EqualMode t={t} session={session} setState={setState} onBack={back} onSave={close} editing={editing} />}
      {mode === "item" && <ItemMode t={t} session={session} setState={setState} onBack={back} onSave={close} editing={editing} />}
      {mode === "custom" && <CustomMode t={t} session={session} setState={setState} onBack={back} onSave={close} editing={editing} />}
    </BottomSheet>
  );
}

function ModePicker({ t, onPick }: { t: Theme; onPick: (m: BillMode) => void }) {
  const L = useL();
  const modes: { id: BillMode; name: string; desc: string; icon: string; color: string }[] = [
    { id: "equal",  name: L.modeEqualN,  desc: L.modeEqualD,  icon: "🟰", color: t.primary },
    { id: "item",   name: L.modeItemN,   desc: L.modeItemD,   icon: "📋", color: t.amber },
    { id: "custom", name: L.modeCustomN, desc: L.modeCustomD, icon: "⚖️", color: t.sky },
  ];
  return (
    <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
      {modes.map((m) => (
        <Card key={m.id} t={t} padding={14} onClick={() => onPick(m.id)}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: t.cornerSm,
              background: m.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, color: "#fff", flexShrink: 0,
            }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 15, color: t.ink }}>{m.name}</div>
              <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft, marginTop: 2 }}>{m.desc}</div>
            </div>
            <Ic.ChevR size={18} color={t.inkMuted} />
          </div>
        </Card>
      ))}
    </div>
  );
}

type ModeProps = {
  t: Theme; session: Session; setState: SetState;
  onBack: () => void; onSave: () => void; editing: Bill | null;
};

function EqualMode({ t, session, setState, onBack, onSave, editing }: ModeProps) {
  const L = useL();
  const lang = useLang();
  const [name, setName] = React.useState(editing?.name || "");
  const [amount, setAmount] = React.useState(editing ? String(editing.total) : "");
  const [payer, setPayer] = React.useState<string>(editing ? (Array.isArray(editing.paidBy) ? editing.paidBy[0]?.memberId : editing.paidBy) : session.myId);
  const [included, setIncluded] = React.useState<string[]>(editing ? editing.shares.map((s) => s.memberId) : session.members.map((m) => m.id));
  const [confirmDel, setConfirmDel] = React.useState(false);
  const amt = parseFloat(amount) || 0;
  const perPerson = included.length > 0 ? amt / included.length : 0;

  const save = () => {
    if (!amt || included.length === 0) return;
    const data: Omit<Bill, "id"> = {
      mode: "equal",
      name: name || (lang === "en" ? "New bill" : "บิลใหม่"),
      total: amt,
      paidBy: payer,
      shares: included.map((id) => ({ memberId: id, amount: amt / included.length })),
      icon: "🟰", color: t.primary + "33",
    };
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : {
        ...x,
        bills: editing
          ? x.bills.map((b) => b.id === editing.id ? { ...b, ...data } : b)
          : [...x.bills, { id: "b" + Date.now(), ...data }],
      }),
    }));
    onSave();
  };

  const del = () => {
    if (!editing) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : { ...x, bills: x.bills.filter((b) => b.id !== editing.id) }),
    }));
    onSave();
  };

  return (
    <SubSheet t={t} title={editing ? L.editBillT : L.modeEqualN} onBack={onBack}>
      <Field t={t} label={L.billNameLbl}><Input t={t} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.billNameP1} autoFocus={!editing} /></Field>
      <AmountInput t={t} value={amount} onChange={setAmount} />
      <PayerPicker t={t} session={session} value={payer} onChange={setPayer} />
      <Field t={t} label={`${L.whoJoined} · ${included.length}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {session.members.map((m) => {
            const on = included.includes(m.id);
            return (
              <button key={m.id}
                onClick={() => setIncluded((ids) => on ? ids.filter((i) => i !== m.id) : [...ids, m.id])}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: on ? t.primary + "15" : t.surfaceAlt,
                  border: `1px solid ${on ? t.primary : t.hairline}`,
                  borderRadius: t.cornerSm, cursor: "pointer",
                }}>
                <Checkbox t={t} on={on} />
                <Avatar name={m.name} color={m.color} size={24} />
                <span style={{ flex: 1, textAlign: "left", fontFamily: t.fontBody, fontWeight: 600, fontSize: 13, color: t.ink }}>{m.name}</span>
                {on && <span style={{ fontFamily: t.fontNum, fontWeight: 600, fontSize: 13, color: t.ink }}>฿{perPerson.toFixed(2)}</span>}
              </button>
            );
          })}
        </div>
      </Field>
      <Preview t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: t.fontBody, fontSize: 13, color: t.inkSoft }}>{L.perPerson}</span>
          <Money t={t} amount={perPerson} size={22} />
        </div>
      </Preview>
      <Button t={t} fullWidth onClick={save} disabled={!amt || included.length === 0}>{editing ? L.update : L.saveBill}</Button>
      {editing && (
        <Button t={t} kind="danger" fullWidth onClick={del} icon={<Ic.Trash size={16} color="#fff" />}>
          {confirmDel ? L.confirmDelete : L.deleteWord}
        </Button>
      )}
    </SubSheet>
  );
}

function ItemMode({ t, session, setState, onBack, onSave, editing }: ModeProps) {
  const L = useL();
  const lang = useLang();
  const [name, setName] = React.useState(editing?.name || "");
  const [payer, setPayer] = React.useState<string>(editing ? (Array.isArray(editing.paidBy) ? editing.paidBy[0]?.memberId : editing.paidBy) : session.myId);
  const [items, setItems] = React.useState<{ id: string; name: string; price: string; sharers: string[] }[]>(
    editing?.items?.length
      ? editing.items.map((it, i) => ({ id: "i" + i, name: it.name || "", price: String(it.price ?? ""), sharers: it.sharers || [] }))
      : [{ id: "i1", name: "", price: "", sharers: [] }],
  );
  const [confirmDel, setConfirmDel] = React.useState(false);

  const total = items.reduce((s, it) => s + (parseFloat(it.price) || 0), 0);

  const perMember: Record<string, number> = {};
  session.members.forEach((m) => { perMember[m.id] = 0; });
  items.forEach((it) => {
    const price = parseFloat(it.price) || 0;
    if (price > 0 && it.sharers.length > 0) {
      const each = price / it.sharers.length;
      it.sharers.forEach((id) => { perMember[id] = (perMember[id] || 0) + each; });
    }
  });

  const update = (id: string, patch: Partial<{ name: string; price: string; sharers: string[] }>) =>
    setItems((its) => its.map((x) => x.id === id ? { ...x, ...patch } : x));
  const remove = (id: string) => setItems((its) => its.filter((x) => x.id !== id));
  const add = () => setItems((its) => [...its, { id: "i" + Date.now(), name: "", price: "", sharers: [] }]);

  const save = () => {
    if (!total) return;
    const shares: BillShare[] = Object.entries(perMember).filter(([, v]) => v > 0).map(([id, v]) => ({ memberId: id, amount: v }));
    const data: Omit<Bill, "id"> = {
      mode: "item", name: name || (lang === "en" ? "New bill" : "บิลใหม่"), total,
      paidBy: payer, shares,
      items: items.filter((it) => parseFloat(it.price) > 0).map((it) => ({ name: it.name, price: parseFloat(it.price), sharers: it.sharers })),
      icon: "📋", color: t.amber + "33",
    };
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : {
        ...x,
        bills: editing
          ? x.bills.map((b) => b.id === editing.id ? { ...b, ...data } : b)
          : [...x.bills, { id: "b" + Date.now(), ...data }],
      }),
    }));
    onSave();
  };

  const del = () => {
    if (!editing) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : { ...x, bills: x.bills.filter((b) => b.id !== editing.id) }),
    }));
    onSave();
  };

  return (
    <SubSheet t={t} title={editing ? L.editBillT : L.modeItemN} onBack={onBack}>
      <Field t={t} label={L.billNameLbl}><Input t={t} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.billNameP2} autoFocus={!editing} /></Field>
      <PayerPicker t={t} session={session} value={payer} onChange={setPayer} />
      <Field t={t} label={L.items}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => (
            <Card key={it.id} t={t} padding={12} depth={0}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <Input t={t} value={it.name} onChange={(e) => update(it.id, { name: e.target.value })} placeholder={L.itemNameP} style={{ flex: 1 }} />
                <Input t={t} value={it.price} onChange={(e) => update(it.id, { price: e.target.value.replace(/[^\d.]/g, "") })} placeholder="0" prefix="฿" fontFamily={t.fontNum} align="right" style={{ width: 110 }} />
                {items.length > 1 && (
                  <IconButton t={t} icon={<Ic.Trash size={14} color={t.rose} />} size={32} onClick={() => remove(it.id)} />
                )}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {session.members.map((m) => {
                  const on = it.sharers.includes(m.id);
                  return (
                    <button key={m.id}
                      onClick={() => update(it.id, { sharers: on ? it.sharers.filter((i) => i !== m.id) : [...it.sharers, m.id] })}
                      style={{
                        display: "flex", alignItems: "center", gap: 5, padding: "4px 8px 4px 4px",
                        background: on ? m.color : "transparent",
                        color: on ? "#fff" : t.ink,
                        border: `1px solid ${on ? m.color : t.hairline}`,
                        borderRadius: 999, cursor: "pointer",
                        fontFamily: t.fontBody, fontSize: 11, fontWeight: 600,
                      }}>
                      <Avatar name={m.name} color={on ? "#fff" : m.color} size={18} ink={on ? m.color : "#fff"} />
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </Card>
          ))}
          <button onClick={add} style={{
            background: "transparent", border: `2px dashed ${t.inkMuted}`,
            borderRadius: t.cornerSm, padding: 10, cursor: "pointer",
            color: t.inkSoft, fontFamily: t.fontBody, fontWeight: 600, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Ic.Plus size={14} color={t.inkSoft} /> {L.addItem}
          </button>
        </div>
      </Field>
      <Preview t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: t.fontBody, fontSize: 13, color: t.inkSoft }}>{L.total}</span>
          <Money t={t} amount={total} size={18} />
        </div>
        <div style={{ borderTop: `1px solid ${t.hairline}`, paddingTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {session.members.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft }}>{m.name}</span>
              <span style={{ fontFamily: t.fontNum, fontWeight: 600, fontSize: 13, color: perMember[m.id] > 0 ? t.ink : t.inkMuted }}>฿{(perMember[m.id] || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Preview>
      <Button t={t} fullWidth onClick={save} disabled={!total}>{editing ? L.update : L.saveBill}</Button>
      {editing && (
        <Button t={t} kind="danger" fullWidth onClick={del} icon={<Ic.Trash size={16} color="#fff" />}>
          {confirmDel ? L.confirmDelete : L.deleteWord}
        </Button>
      )}
    </SubSheet>
  );
}

function CustomMode({ t, session, setState, onBack, onSave, editing }: ModeProps) {
  const L = useL();
  const lang = useLang();
  const [name, setName] = React.useState(editing?.name || "");
  const [amount, setAmount] = React.useState(editing ? String(editing.total) : "");
  const [payer, setPayer] = React.useState<string>(editing ? (Array.isArray(editing.paidBy) ? editing.paidBy[0]?.memberId : editing.paidBy) : session.myId);
  const [unit, setUnit] = React.useState<"percent" | "amount">("percent");
  const [confirmDel, setConfirmDel] = React.useState(false);
  const [weights, setWeights] = React.useState<Record<string, string>>(() => {
    if (editing) {
      const t2 = editing.total || 1;
      return Object.fromEntries(session.members.map((m) => {
        const share = editing.shares.find((s) => s.memberId === m.id)?.amount || 0;
        return [m.id, ((share / t2) * 100).toFixed(1)];
      }));
    }
    const each = 100 / session.members.length;
    return Object.fromEntries(session.members.map((m) => [m.id, each.toFixed(1)]));
  });

  const amt = parseFloat(amount) || 0;
  const updW = (id: string, v: string) => setWeights((w) => ({ ...w, [id]: v.replace(/[^\d.]/g, "") }));

  const shares: Record<string, number> = {};
  let sumValid = false;
  let sumNote = "";
  if (unit === "percent") {
    const totalPct = Object.values(weights).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    session.members.forEach((m) => { shares[m.id] = amt * ((parseFloat(weights[m.id]) || 0) / 100); });
    sumValid = Math.abs(totalPct - 100) < 0.5;
    sumNote = `${L.sumLabel} ${totalPct.toFixed(1)}% / 100%`;
  } else {
    session.members.forEach((m) => { shares[m.id] = parseFloat(weights[m.id]) || 0; });
    const totalAmt = Object.values(shares).reduce((s, v) => s + v, 0);
    sumValid = Math.abs(totalAmt - amt) < 0.01;
    sumNote = `${L.sumLabel} ฿${totalAmt.toFixed(2)} / ฿${amt.toFixed(2)}`;
  }

  const save = () => {
    if (!amt || !sumValid) return;
    const data: Omit<Bill, "id"> = {
      mode: "custom", name: name || (lang === "en" ? "New bill" : "บิลใหม่"), total: amt,
      paidBy: payer,
      shares: session.members.map((m) => ({ memberId: m.id, amount: shares[m.id] || 0 })).filter((s) => s.amount > 0),
      icon: "⚖️", color: t.sky + "33",
    };
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : {
        ...x,
        bills: editing
          ? x.bills.map((b) => b.id === editing.id ? { ...b, ...data } : b)
          : [...x.bills, { id: "b" + Date.now(), ...data }],
      }),
    }));
    onSave();
  };

  const del = () => {
    if (!editing) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((x) => x.id !== session.id ? x : { ...x, bills: x.bills.filter((b) => b.id !== editing.id) }),
    }));
    onSave();
  };

  return (
    <SubSheet t={t} title={editing ? L.editBillT : L.modeCustomN} onBack={onBack}>
      <Field t={t} label={L.billNameLbl}><Input t={t} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.billNameP4} autoFocus={!editing} /></Field>
      <AmountInput t={t} value={amount} onChange={setAmount} />
      <PayerPicker t={t} session={session} value={payer} onChange={setPayer} />
      <Field t={t} label={L.unit}>
        <div style={{ display: "flex", gap: 8 }}>
          {([{ id: "percent" as const, label: L.unitPct }, { id: "amount" as const, label: L.unitAmt }]).map((o) => (
            <button key={o.id} onClick={() => setUnit(o.id)}
              style={{
                flex: 1, padding: "10px 0",
                background: unit === o.id ? t.primary : t.surface,
                color: unit === o.id ? "#fff" : t.ink,
                border: `1px solid ${t.hairline}`,
                borderRadius: t.cornerSm, cursor: "pointer",
                fontFamily: t.fontBody, fontSize: 13, fontWeight: 600,
              }}>{o.label}</button>
          ))}
        </div>
      </Field>
      <Field t={t} label={L.weights}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {session.members.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={m.name} color={m.color} size={28} />
              <span style={{ flex: 1, fontFamily: t.fontBody, fontWeight: 600, fontSize: 13, color: t.ink }}>{m.name}</span>
              <span style={{ fontFamily: t.fontNum, fontSize: 12, color: t.inkSoft, minWidth: 60, textAlign: "right" }}>
                {unit === "percent" ? `≈ ฿${(shares[m.id] || 0).toFixed(0)}` : ""}
              </span>
              <Input t={t} value={weights[m.id]} onChange={(e) => updW(m.id, e.target.value)} placeholder="0"
                suffix={unit === "percent" ? "%" : "฿"} align="right" fontFamily={t.fontNum} style={{ width: 100 }} />
            </div>
          ))}
        </div>
      </Field>
      <Preview t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: t.fontBody, fontSize: 13, color: sumValid ? t.emerald : t.rose, fontWeight: 600 }}>
            {sumValid ? "✓ " : "⚠ "}{sumNote}
          </span>
        </div>
      </Preview>
      <Button t={t} fullWidth onClick={save} disabled={!amt || !sumValid}>{editing ? L.update : L.saveBill}</Button>
      {editing && (
        <Button t={t} kind="danger" fullWidth onClick={del} icon={<Ic.Trash size={16} color="#fff" />}>
          {confirmDel ? L.confirmDelete : L.deleteWord}
        </Button>
      )}
    </SubSheet>
  );
}

function SubSheet({ t, title, onBack, children }: { t: Theme; title: string; onBack: () => void; children?: React.ReactNode }) {
  return (
    <>
      <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "center", gap: 6 }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, marginLeft: -4, display: "flex" }}>
          <Ic.ChevL size={22} color={t.ink} />
        </button>
        <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 20, color: t.ink, letterSpacing: -0.5 }}>{title}</div>
      </div>
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </>
  );
}

function AmountInput({ t, value, onChange }: { t: Theme; value: string; onChange: (s: string) => void }) {
  const L = useL();
  return (
    <div>
      <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft, fontWeight: 600, marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>{L.totalAmt}</div>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 6,
        padding: "14px 16px",
        background: t.surface,
        border: `1px solid ${t.hairline}`,
        borderRadius: t.cornerSm,
      }}>
        <span style={{ fontFamily: t.fontNum, fontSize: 20, color: t.inkSoft, fontWeight: 600 }}>฿</span>
        <input value={value} onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00"
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: t.fontNum, fontSize: 28, fontWeight: 700, color: t.ink,
            textAlign: "right", letterSpacing: -0.5,
          }} />
      </div>
    </div>
  );
}

function PayerPicker({ t, session, value, onChange }: { t: Theme; session: Session; value: string; onChange: (v: string) => void }) {
  const L = useL();
  return (
    <Field t={t} label={L.paidBy}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {session.members.map((m) => {
          const on = value === m.id;
          return (
            <button key={m.id} onClick={() => onChange(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "4px 10px 4px 4px",
                background: on ? m.color : "transparent",
                color: on ? "#fff" : t.ink,
                border: `1px solid ${on ? m.color : t.hairline}`,
                borderRadius: 999, cursor: "pointer",
                fontFamily: t.fontBody, fontSize: 12, fontWeight: 600,
              }}>
              <Avatar name={m.name} color={on ? "#fff" : m.color} size={20} ink={on ? m.color : "#fff"} />
              {m.name}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function Preview({ t, children }: { t: Theme; children?: React.ReactNode }) {
  return (
    <Card t={t} padding={14} accent={t.surfaceAlt} depth={0}>
      <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Preview</div>
      {children}
    </Card>
  );
}

function Checkbox({ t, on }: { t: Theme; on: boolean }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 6,
      background: on ? t.primary : t.surface,
      border: `2px solid ${on ? t.primary : t.inkMuted}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>{on && <Ic.Check size={14} color="#fff" />}</div>
  );
}

export function SettlementScreen({
  t, state, nav, sessionId,
}: { t: Theme; state: AppState; nav: Nav; sessionId: string }) {
  const L = useL();
  const session = state.sessions.find((s) => s.id === sessionId);
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({});
  if (!session) return null;
  const bal = computeBalances(session);
  const transfers = minimizeTransfers(bal);
  const allDone = transfers.length > 0 && transfers.every((_, i) => completed[i]);

  return (
    <div style={{ paddingBottom: 12 }}>
      <Header t={t} title={L.settleT} subtitle={L.settleSub} big onBack={() => nav.backToSession(sessionId)} actions={
        <IconButton t={t} icon={<Ic.Share size={18} color={t.ink} />} kind="surface" />
      } />

      <div style={{ padding: "0 20px 16px" }}>
        <Card t={t} padding={16} accent={t.bgAlt}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Sticker.Star color={t.primary} size={20} />
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 14, color: t.ink }}>{L.reducedTo} {transfers.length} {L.transfersWord}</div>
          </div>
          <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, lineHeight: 1.5 }}>
            {session.bills.length} {L.bills} · {session.members.length} {L.membersWord} · {L.reducedDesc}
          </div>
        </Card>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{L.netBalance}</div>
        <Card t={t} padding={0}>
          {session.members.map((m, i) => {
            const net = bal[m.id] || 0;
            const sign = Math.abs(net) < 0.01 ? "zero" : net > 0 ? "pos" : "neg";
            return (
              <div key={m.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px",
                borderBottom: i === session.members.length - 1 ? "none" : `1px solid ${t.hairline}`,
              }}>
                <Avatar name={m.name} color={m.color} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>{m.name}{m.isMe && <span style={{ fontSize: 10, color: t.inkMuted, marginLeft: 4 }}>({L.you})</span>}</div>
                  <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkMuted, marginTop: 1 }}>
                    {sign === "zero" ? L.noTransfer : sign === "pos" ? L.willReceive : L.willPay}
                  </div>
                </div>
                <Money t={t} amount={Math.abs(net)} size={14} color={sign === "pos" ? t.emerald : sign === "neg" ? t.rose : t.inkMuted} sign={sign !== "zero"} />
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{L.transfersHead}</div>
        {transfers.length === 0 ? (
          <Card t={t} padding={20} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 16, color: t.ink }}>{L.allSettled}</div>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {transfers.map((tr, i) => {
              const from = session.members.find((m) => m.id === tr.from)!;
              const to = session.members.find((m) => m.id === tr.to)!;
              const done = completed[i];
              return (
                <Card key={i} t={t} padding={14} style={{ opacity: done ? 0.5 : 1, transition: "opacity .2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <Avatar name={from.name} color={from.color} size={32} />
                      <div style={{ flexShrink: 0 }}>
                        <Sticker.Squiggle color={t.ink} size={28} />
                      </div>
                      <Avatar name={to.name} color={to.color} size={32} />
                      <div style={{ marginLeft: 4, minWidth: 0 }}>
                        <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 12, color: t.ink, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {from.name} → {to.name}
                        </div>
                        <Money t={t} amount={tr.amount} size={15} />
                      </div>
                    </div>
                    <button onClick={() => setCompleted((c) => ({ ...c, [i]: !c[i] }))}
                      style={{
                        background: done ? t.emerald : "transparent",
                        color: done ? "#fff" : t.ink,
                        border: `1.5px solid ${done ? t.emerald : t.hairline}`,
                        borderRadius: 999, padding: "6px 12px", cursor: "pointer",
                        fontFamily: t.fontBody, fontSize: 11, fontWeight: 700,
                        display: "flex", alignItems: "center", gap: 4,
                        flexShrink: 0,
                      }}>
                      {done ? <><Ic.Check size={12} color="#fff" /> {L.paidAlready}</> : L.paidAlready}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {allDone && (
        <div style={{ padding: "0 20px 20px" }}>
          <Card t={t} padding={20} style={{ textAlign: "center" }} accent={t.emerald + "15"}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <Sticker.Burst color={t.emerald} size={40} />
            </div>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 18, color: t.ink, letterSpacing: -0.3 }}>{L.closedT}</div>
            <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, marginTop: 4, marginBottom: 12 }}>{L.closedS}</div>
            <Button t={t} fullWidth onClick={() => nav.backToSession(sessionId)}>{L.done}</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
