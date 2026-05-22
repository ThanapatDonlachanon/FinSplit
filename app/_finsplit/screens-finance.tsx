"use client";

import React from "react";
import { Theme, CITRUS, MINT, BERRY, OCEAN } from "./themes";
import { useL, catName, type Lang } from "./labels";
import { Ic, Sticker, Avatar } from "./icons";
import {
  Button, IconButton, Card, Input, Chip, Money, Header,
  BottomSheet, Progress, EmptyState, StickerScene, Field,
} from "./ui";
import type { AppState, Nav, Transaction, TxType, Wallet } from "./types";

type SetState = React.Dispatch<React.SetStateAction<AppState>>;

export function HomeScreen({ t, state, nav }: { t: Theme; state: AppState; nav: Nav }) {
  const L = useL();
  const totalBalance = state.wallets.reduce((s, w) => s + w.balance, 0);
  const txns = state.transactions.filter((tx) => tx.status !== "draft");
  const drafts = state.transactions.filter((tx) => tx.status === "draft");
  const hasData = state.wallets.length > 0;

  const now = new Date();
  const thisMonth = txns.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const income = thisMonth.filter((tx) => tx.type === "income").reduce((s, x) => s + x.amount, 0);
  const expense = thisMonth.filter((tx) => tx.type === "expense").reduce((s, x) => s + x.amount, 0);

  return (
    <div style={{ paddingBottom: 12 }}>
      <div style={{
        padding: "20px 20px 16px",
        background: t.bg,
        position: "relative", overflow: "hidden",
      }}>
        <Sticker.Squiggle color={t.primary} size={60} rotate={10} style={{ position: "absolute", top: 10, right: 90, opacity: 0.5 }} />
        <Sticker.Star color={t.amber} size={18} style={{ position: "absolute", top: 18, right: 60, transform: "rotate(15deg)" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 700, color: t.ink, letterSpacing: -0.5 }}>{L.homeHi}, {state.user?.username || ""} 👋</div>
          </div>
          <IconButton t={t} icon={<Ic.Bell size={20} color={t.ink} />} kind="surface" />
        </div>
      </div>

      <div style={{ padding: "4px 20px 16px" }}>
        <Card t={t} padding={20} accent={t.primary} style={{ color: "#fff", position: "relative", overflow: "hidden" }}>
          <Sticker.Burst color="rgba(255,255,255,0.18)" size={80} style={{ position: "absolute", top: -10, right: -10 }} />
          <div style={{ fontFamily: t.fontBody, fontSize: 12, opacity: 0.85, marginBottom: 6 }}>{L.homeNetWorth}</div>
          {hasData ? (
            <Money t={t} amount={totalBalance} size={36} color="#fff" />
          ) : (
            <div style={{ fontFamily: t.fontDisplay, fontSize: 28, fontWeight: 700, opacity: 0.65 }}>฿ — — —</div>
          )}
          <div style={{ display: "flex", gap: 14, marginTop: 14, fontFamily: t.fontBody, fontSize: 12, opacity: 0.9 }}>
            <div>
              <div style={{ opacity: 0.75, fontSize: 11, marginBottom: 2 }}>{L.homeMoIn}</div>
              <div style={{ fontFamily: t.fontNum, fontSize: 16, fontWeight: 600 }}>+฿{income.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ opacity: 0.75, fontSize: 11, marginBottom: 2 }}>{L.homeMoOut}</div>
              <div style={{ fontFamily: t.fontNum, fontSize: 16, fontWeight: 600 }}>−฿{expense.toLocaleString()}</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {([
          { id: "expense" as TxType, label: L.expense, icon: <Ic.Minus size={20} color={t.rose} />, color: t.rose },
          { id: "income" as TxType, label: L.income, icon: <Ic.Plus size={20} color={t.emerald} />, color: t.emerald },
          { id: "transfer" as TxType, label: L.transfer, icon: <Ic.Arrow size={20} color={t.sky} />, color: t.sky },
        ]).map((a) => (
          <Card key={a.id} t={t} padding={12} depth={0}
            onClick={() => nav.openAddTxn(a.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: a.color + "22",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{a.icon}</div>
            <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 12, color: t.ink }}>{a.label}</div>
          </Card>
        ))}
      </div>

      {drafts.length > 0 && (
        <div style={{ padding: "0 20px 16px" }}>
          <Card t={t} padding={14} accent={t.amber + "33"} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: t.amber,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Ic.Sparkle size={18} color={"#fff"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 14, color: t.ink }}>{drafts.length} {L.drafts1}</div>
              <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, marginTop: 1 }}>{L.drafts2}</div>
            </div>
            <Ic.ChevR size={18} color={t.ink} />
          </Card>
        </div>
      )}

      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 16, color: t.ink, letterSpacing: -0.3 }}>{L.recent}</div>
          {txns.length > 0 && (
            <button style={{ background: "transparent", border: "none", color: t.primary, cursor: "pointer", fontFamily: t.fontBody, fontWeight: 600, fontSize: 12 }}>{L.all}</button>
          )}
        </div>
        {txns.length === 0 ? (
          <EmptyState
            t={t}
            sticker={<StickerScene t={t} kind="wallet" />}
            title={L.emptyTxnT}
            subtitle={L.emptyTxnS}
            ctaLabel={L.emptyTxnCta}
            onCta={() => nav.openAddTxn("expense")}
          />
        ) : (
          <Card t={t} padding={0}>
            {txns.slice(0, 6).map((tx, i) => (
              <TxnRow key={tx.id} t={t} tx={tx} state={state} isLast={i === Math.min(5, txns.length - 1)} onEdit={(id) => nav.editTxn(id)} />
            ))}
          </Card>
        )}
      </div>

      {expense > 0 && (
        <div style={{ padding: "0 20px 32px" }}>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 16, color: t.ink, marginBottom: 10, letterSpacing: -0.3 }}>{L.byCategory}</div>
          <Card t={t} padding={16}>
            <CategoryBreakdown t={t} state={state} txns={thisMonth.filter((tx) => tx.type === "expense")} />
          </Card>
        </div>
      )}
    </div>
  );
}

function TxnRow({
  t, tx, state, isLast, onEdit,
}: { t: Theme; tx: Transaction; state: AppState; isLast: boolean; onEdit: (id: string) => void }) {
  const L = useL();
  const cat = state.categories.find((c) => c.id === tx.categoryId) || { id: "", name: "—", icon: "💰", color: t.inkMuted, type: "both" as const };
  const catLabel = catName(cat, L);
  const wallet = state.wallets.find((w) => w.id === tx.walletId) || { name: "—" };
  const isIncome = tx.type === "income";
  return (
    <div onClick={() => onEdit(tx.id)} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderBottom: isLast ? "none" : `1px solid ${t.hairline}`,
      cursor: "pointer",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: t.cornerSm,
        background: cat.color + "22",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.note || catLabel}</div>
        <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkMuted, marginTop: 2 }}>{wallet.name} · {catLabel}</div>
      </div>
      <Money t={t} amount={isIncome ? tx.amount : -tx.amount} size={16} sign color={isIncome ? t.emerald : t.ink} />
    </div>
  );
}

function CategoryBreakdown({ t, state, txns }: { t: Theme; state: AppState; txns: Transaction[] }) {
  const L = useL();
  const byCat: Record<string, number> = {};
  txns.forEach((tx) => { byCat[tx.categoryId] = (byCat[tx.categoryId] || 0) + tx.amount; });
  const total = Object.values(byCat).reduce((a, b) => a + b, 0) || 1;
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sorted.map(([cid, amt]) => {
        const cat = state.categories.find((c) => c.id === cid) || { id: "", name: "—", color: t.inkMuted, icon: "•", type: "both" as const };
        const pct = (amt / total) * 100;
        return (
          <div key={cid}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                <span style={{ fontFamily: t.fontBody, fontSize: 13, fontWeight: 600, color: t.ink }}>{catName(cat, L)}</span>
              </div>
              <div style={{ fontFamily: t.fontNum, fontSize: 13, fontWeight: 600, color: t.ink }}>฿{amt.toLocaleString()}</div>
            </div>
            <Progress t={t} value={pct} color={cat.color} height={6} />
          </div>
        );
      })}
    </div>
  );
}

export function WalletsScreen({ t, state, nav }: { t: Theme; state: AppState; nav: Nav }) {
  const L = useL();
  const total = state.wallets.reduce((s, w) => s + w.balance, 0);
  return (
    <div style={{ paddingBottom: 12 }}>
      <Header t={t} title={L.walletsT} subtitle={L.walletsSub} big actions={
        <IconButton t={t} icon={<Ic.Search size={20} color={t.ink} />} />
      } />
      {state.wallets.length === 0 ? (
        <EmptyState
          t={t}
          sticker={<StickerScene t={t} kind="wallet" />}
          title={L.emptyWalletT}
          subtitle={L.emptyWalletS}
          ctaLabel={L.emptyWalletCta}
          onCta={() => nav.openAddWallet()}
        />
      ) : (
        <>
          <div style={{ padding: "0 20px 16px" }}>
            <Card t={t} padding={16}>
              <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, marginBottom: 4 }}>{L.walletsTotal}</div>
              <Money t={t} amount={total} size={28} />
            </Card>
          </div>
          <div style={{ padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {state.wallets.map((w) => (
              <Card key={w.id} t={t} padding={16} onClick={() => nav.editWallet(w.id)}
                style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: t.cornerSm,
                  background: w.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>{w.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 15, color: t.ink, letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                </div>
                <Money t={t} amount={w.balance} size={16} />
              </Card>
            ))}
            <button onClick={() => nav.openAddWallet()} style={{
              background: "transparent",
              border: `2px dashed ${t.inkMuted}`,
              borderRadius: t.cornerMd,
              padding: 16,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              color: t.inkSoft, fontFamily: t.fontBody, fontWeight: 600, fontSize: 14,
            }}>
              <Ic.Plus size={18} color={t.inkSoft} /> {L.addWallet}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function AddWalletSheet({
  t, state, setState, open, onClose, editId,
}: {
  t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void; editId?: string;
}) {
  const L = useL();
  const editing = editId ? state.wallets.find((w) => w.id === editId) : null;
  const [name, setName] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [colorIdx, setColorIdx] = React.useState(0);
  const [icon, setIcon] = React.useState("💵");
  const [confirmDel, setConfirmDel] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setBalance(String(editing.balance));
      const idx = t.swatches.findIndex((c) => c === editing.color);
      setColorIdx(idx >= 0 ? idx : 0);
      setIcon(editing.icon || "💵");
    } else {
      setName(""); setBalance(""); setColorIdx(0); setIcon("💵");
    }
    setConfirmDel(false);
  }, [open, editId]); // eslint-disable-line react-hooks/exhaustive-deps

  const icons = ["💵", "🏦", "💳", "📱", "🐷", "💰", "⭐", "🌟", "🎯", "🍀"];

  const save = () => {
    if (editing) {
      setState((s) => ({
        ...s,
        wallets: s.wallets.map((w) => w.id === editing.id ? {
          ...w,
          name: name || w.name,
          balance: parseFloat(balance) || 0,
          color: t.swatches[colorIdx],
          icon,
        } : w),
      }));
    } else {
      const newWallet: Wallet = {
        id: "w" + Date.now(),
        name: name || L.walletNameP || "กระเป๋าใหม่",
        balance: parseFloat(balance) || 0,
        color: t.swatches[colorIdx],
        icon,
      };
      setState((s) => ({ ...s, wallets: [...s.wallets, newWallet] }));
    }
    onClose();
  };

  const del = () => {
    if (!editing) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    setState((s) => ({
      ...s,
      wallets: s.wallets.filter((w) => w.id !== editing.id),
      transactions: s.transactions.filter((tx) => tx.walletId !== editing.id),
    }));
    onClose();
  };

  return (
    <BottomSheet t={t} open={open} onClose={onClose} title={editing ? L.editWalletT : L.createWalletT} maxHeight="90%">
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field t={t} label="ชื่อกระเป๋า · Name">
          <Input t={t} value={name} onChange={(e) => setName(e.target.value)} placeholder={L.walletNameP} autoFocus />
        </Field>
        <Field t={t} label={editing ? "ยอดคงเหลือ · Balance" : "ยอดเริ่มต้น · Opening balance"}>
          <Input t={t} value={balance} onChange={(e) => setBalance(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00" prefix="฿" fontSize={20} fontFamily={t.fontNum} align="right" />
        </Field>
        <Field t={t} label="สี · Color">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {t.swatches.map((c, i) => (
              <button key={i} onClick={() => setColorIdx(i)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: c, cursor: "pointer",
                  border: colorIdx === i ? `3px solid ${t.ink}` : "none",
                }} />
            ))}
          </div>
        </Field>
        <Field t={t} label="ไอคอน · Icon">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {icons.map((ic) => (
              <button key={ic} onClick={() => setIcon(ic)}
                style={{
                  width: 38, height: 38, borderRadius: t.cornerSm,
                  background: icon === ic ? t.primary + "22" : t.surfaceAlt,
                  border: `1px solid ${icon === ic ? t.primary : t.hairline}`,
                  cursor: "pointer", fontSize: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{ic}</button>
            ))}
          </div>
        </Field>
        <Button t={t} fullWidth onClick={save}>{editing ? L.update : L.saveWallet}</Button>
        {editing && (
          <Button t={t} kind="danger" fullWidth onClick={del} icon={<Ic.Trash size={16} color="#fff" />}>
            {confirmDel ? L.confirmDelete : L.deleteWord}
          </Button>
        )}
      </div>
    </BottomSheet>
  );
}

export function AddTxnSheet({
  t, state, setState, open, onClose, defaultType, editId, onNoWallets,
}: {
  t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void;
  defaultType?: TxType; editId?: string; onNoWallets: () => void;
}) {
  const L = useL();
  const editing = editId ? state.transactions.find((x) => x.id === editId) : null;
  const [type, setType] = React.useState<TxType>(defaultType || "expense");
  const [amount, setAmount] = React.useState("");
  const [walletId, setWalletId] = React.useState<string | null>(null);
  const [toWalletId, setToWalletId] = React.useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");
  const [confirmDel, setConfirmDel] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (editing) {
      setType(editing.type);
      setAmount(String(editing.amount));
      setWalletId(editing.walletId);
      setToWalletId(editing.toWalletId);
      setCategoryId(editing.categoryId);
      setNote(editing.note || "");
    } else {
      const t0 = defaultType || "expense";
      setType(t0);
      setAmount(""); setNote("");
      setWalletId(state.wallets[0]?.id || null);
      setToWalletId(state.wallets[1]?.id);
      setCategoryId(t0 === "transfer" ? null : state.categories.filter((c) => c.type === t0 || c.type === "both")[0]?.id || null);
    }
    setConfirmDel(false);
  }, [open, defaultType, editId]); // eslint-disable-line react-hooks/exhaustive-deps

  const cats = state.categories.filter((c) => c.type === type || c.type === "both");

  const save = () => {
    const amt = parseFloat(amount);
    const isTransfer = type === "transfer";
    if (!amt || !walletId) return;
    if (!isTransfer && !categoryId) return;
    if (isTransfer && (!toWalletId || walletId === toWalletId)) return;

    if (editing) {
      setState((s) => {
        const oldTx = s.transactions.find((x) => x.id === editing.id);
        const wallets = s.wallets.map((w) => {
          let bal = w.balance;
          if (oldTx && oldTx.status !== "draft") {
            if (oldTx.type === "transfer") {
              if (w.id === oldTx.walletId) bal += oldTx.amount;
              if (w.id === oldTx.toWalletId) bal -= oldTx.amount;
            } else {
              if (w.id === oldTx.walletId) bal -= oldTx.type === "income" ? oldTx.amount : -oldTx.amount;
            }
          }
          if (isTransfer) {
            if (w.id === walletId) bal -= amt;
            if (w.id === toWalletId) bal += amt;
          } else {
            if (w.id === walletId) bal += type === "income" ? amt : -amt;
          }
          return { ...w, balance: bal };
        });
        return {
          ...s, wallets,
          transactions: s.transactions.map((tx) => tx.id === editing.id ? {
            ...tx, type, amount: amt, walletId, ...(isTransfer ? { toWalletId } : {}), categoryId: isTransfer ? null : categoryId, note: note.trim(),
          } : tx),
        };
      });
    } else {
      const tx: Transaction = {
        id: "tx" + Date.now(),
        type, amount: amt, walletId, toWalletId: isTransfer ? toWalletId : undefined, categoryId: isTransfer ? null : categoryId,
        note: note.trim(), date: new Date().toISOString(),
        status: "confirmed",
      };
      setState((s) => {
        const wallets = s.wallets.map((w) => {
          if (isTransfer) {
            if (w.id === walletId) return { ...w, balance: w.balance - amt };
            if (w.id === toWalletId) return { ...w, balance: w.balance + amt };
          } else {
            if (w.id === walletId) return { ...w, balance: w.balance + (type === "income" ? amt : -amt) };
          }
          return w;
        });
        return { ...s, wallets, transactions: [tx, ...s.transactions] };
      });
    }
    onClose();
  };

  const del = () => {
    if (!editing) return;
    if (!confirmDel) { setConfirmDel(true); return; }
    setState((s) => {
      const oldTx = s.transactions.find((x) => x.id === editing.id);
      const wallets = s.wallets.map((w) => {
        if (oldTx && oldTx.status !== "draft") {
          if (oldTx.type === "transfer") {
            if (w.id === oldTx.walletId) return { ...w, balance: w.balance + oldTx.amount };
            if (w.id === oldTx.toWalletId) return { ...w, balance: w.balance - oldTx.amount };
          } else {
            if (w.id === oldTx.walletId) return { ...w, balance: w.balance - (oldTx.type === "income" ? oldTx.amount : -oldTx.amount) };
          }
        }
        return w;
      });
      return { ...s, wallets, transactions: s.transactions.filter((x) => x.id !== editing.id) };
    });
    onClose();
  };

  if (open && state.wallets.length === 0 && !editing) {
    return (
      <BottomSheet t={t} open={open} onClose={onClose} title={L.expense}>
        <div style={{ padding: "0 20px 24px" }}>
          <EmptyState
            t={t}
            sticker={<StickerScene t={t} kind="wallet" />}
            title={L.noWalletT}
            subtitle={L.noWalletS}
            ctaLabel={L.noWalletCta}
            onCta={() => { onClose(); setTimeout(onNoWallets, 100); }}
          />
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet t={t} open={open} onClose={onClose} title={editing ? L.editTxnT : undefined} maxHeight="92%">
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          display: "flex",
          background: t.surfaceAlt,
          borderRadius: 999,
          padding: 4,
        }}>
          {([
            { id: "expense" as TxType, label: L.expense, color: t.rose },
            { id: "income" as TxType, label: L.income, color: t.emerald },
            { id: "transfer" as TxType, label: L.transfer, color: t.sky },
          ]).map((opt) => (
            <button key={opt.id} onClick={() => setType(opt.id)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 999,
                background: type === opt.id ? opt.color : "transparent",
                color: type === opt.id ? "#fff" : t.inkSoft,
                border: "none", cursor: "pointer",
                fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 13,
              }}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, marginBottom: 8 }}>{L.amount}</div>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6,
          fontFamily: t.fontNum, fontWeight: 700,
        }}>
          <span style={{ fontSize: 28, color: t.inkSoft }}>฿</span>
          <input
            type="text" value={amount} autoFocus={!editing}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="0"
            style={{
              border: "none", outline: "none", background: "transparent",
              fontFamily: t.fontNum, fontSize: 52, fontWeight: 700,
              color: t.ink, textAlign: "center", width: "60%",
              letterSpacing: -2,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {type === "transfer" ? (
          <>
            <Field t={t} label={L.from}>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {state.wallets.map((w) => (
                  <button key={w.id} onClick={() => setWalletId(w.id)}
                    style={{
                      background: walletId === w.id ? w.color : t.surface,
                      color: walletId === w.id ? "#fff" : t.ink,
                      border: `1px solid ${t.hairline}`,
                      borderRadius: t.cornerSm,
                      padding: "8px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                      fontFamily: t.fontBody, fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                    <span style={{ fontSize: 14 }}>{w.icon}</span>{w.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field t={t} label={L.to}>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {state.wallets.map((w) => (
                  <button key={w.id} onClick={() => setToWalletId(w.id)}
                    style={{
                      background: toWalletId === w.id ? w.color : t.surface,
                      color: toWalletId === w.id ? "#fff" : t.ink,
                      border: `1px solid ${t.hairline}`,
                      borderRadius: t.cornerSm,
                      padding: "8px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                      fontFamily: t.fontBody, fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                    <span style={{ fontSize: 14 }}>{w.icon}</span>{w.name}
                  </button>
                ))}
              </div>
            </Field>
          </>
        ) : (
          <>
            <Field t={t} label="กระเป๋า · Wallet">
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {state.wallets.map((w) => (
                  <button key={w.id} onClick={() => setWalletId(w.id)}
                    style={{
                      background: walletId === w.id ? w.color : t.surface,
                      color: walletId === w.id ? "#fff" : t.ink,
                      border: `1px solid ${t.hairline}`,
                      borderRadius: t.cornerSm,
                      padding: "8px 12px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6,
                      fontFamily: t.fontBody, fontWeight: 600, fontSize: 12, flexShrink: 0,
                    }}>
                    <span style={{ fontSize: 14 }}>{w.icon}</span>{w.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field t={t} label="หมวด · Category">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {cats.map((c) => {
                  const active = categoryId === c.id;
                  return (
                    <button key={c.id} onClick={() => setCategoryId(c.id)}
                      style={{
                        background: active ? c.color : t.surface,
                        border: `1px solid ${active ? c.color : t.hairline}`,
                        borderRadius: t.cornerSm,
                        padding: "10px 4px", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        fontFamily: t.fontBody, fontSize: 11, fontWeight: 600,
                        color: active ? "#fff" : t.ink,
                      }}>
                      <span style={{ fontSize: 18 }}>{c.icon}</span>{catName(c, L)}
                    </button>
                  );
                })}
              </div>
            </Field>
          </>
        )}

        <Field t={t} label="โน๊ต · Note (optional)">
          <Input t={t} value={note} onChange={(e) => setNote(e.target.value)} placeholder="เช่น กาแฟเช้า" />
        </Field>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Chip t={t} icon={<Ic.Camera size={14} color={t.inkSoft} />}>{L.attachReceipt}</Chip>
          <Chip t={t} icon={<Ic.Calendar size={14} color={t.inkSoft} />}>{L.today}</Chip>
          <Chip t={t} icon={<Ic.Tag size={14} color={t.inkSoft} />}>{L.tag}</Chip>
        </div>

        <Button t={t} fullWidth onClick={save} disabled={type === "transfer" ? (!amount || !walletId || !toWalletId || walletId === toWalletId) : (!amount || !walletId || !categoryId)}>{editing ? L.update : L.save}</Button>
        {editing && (
          <Button t={t} kind="danger" fullWidth onClick={del} icon={<Ic.Trash size={16} color="#fff" />}>
            {confirmDel ? L.confirmDelete : L.deleteWord}
          </Button>
        )}
      </div>
    </BottomSheet>
  );
}

export function BudgetScreen({ t, state, nav }: { t: Theme; state: AppState; nav: Nav }) {
  const L = useL();
  return (
    <div style={{ paddingBottom: 12 }}>
      <Header t={t} title={L.budgetT} subtitle={L.budgetSub} big actions={
        state.budgets.length > 0 ? <IconButton t={t} icon={<Ic.Plus size={20} color={t.ink} />} kind="surface" /> : null
      } />
      {state.budgets.length === 0 ? (
        <EmptyState
          t={t}
          sticker={<StickerScene t={t} kind="budget" />}
          title={L.emptyBudgetT}
          subtitle={L.emptyBudgetS}
          ctaLabel={L.emptyBudgetCta}
          onCta={() => nav.openAddBudget()}
        />
      ) : (
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {state.budgets.map((b) => {
            const cat = state.categories.find((c) => c.id === b.categoryId);
            const spent = state.transactions
              .filter((tx) => tx.categoryId === b.categoryId && tx.type === "expense" && tx.status === "confirmed")
              .reduce((s, tx) => s + tx.amount, 0);
            const pct = (spent / b.limit) * 100;
            const over = pct > 100;
            return (
              <Card key={b.id} t={t} padding={16}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{cat?.icon}</span>
                    <span style={{ fontFamily: t.fontDisplay, fontWeight: 600, fontSize: 15, color: t.ink }}>{cat?.name}</span>
                  </div>
                  <span style={{ fontFamily: t.fontNum, fontSize: 13, fontWeight: 600, color: over ? t.rose : t.ink }}>
                    ฿{spent.toLocaleString()} / ฿{b.limit.toLocaleString()}
                  </span>
                </div>
                <Progress t={t} value={pct} color={over ? t.rose : cat?.color} />
                <div style={{ fontFamily: t.fontBody, fontSize: 11, color: over ? t.rose : t.inkSoft, marginTop: 6 }}>
                  {over ? `${L.budgetOver} ${Math.round(pct - 100)}%` : `${L.budgetLeft} ฿${(b.limit - spent).toLocaleString()}`}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProfileScreen({
  t, state, setState, nav, themeId, lang,
}: { t: Theme; state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>>; nav: Nav; themeId: string; lang: Lang }) {
  const L = useL();
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [editUsername, setEditUsername] = React.useState(state.user?.username || "");

  const allThemes = [
    { id: "citrus", name: "Citrus", th: "ส้มสด", colors: [CITRUS.primary, CITRUS.amber, CITRUS.rose] },
    { id: "mint",   name: "Mint",   th: "มินต์",  colors: [MINT.primary, MINT.amber, MINT.rose] },
    { id: "berry",  name: "Berry",  th: "เบอร์รี่", colors: [BERRY.primary, BERRY.amber, BERRY.sky] },
    { id: "ocean",  name: "Ocean",  th: "ทะเล",  colors: [OCEAN.primary, OCEAN.emerald, OCEAN.sky] },
  ];

  const handleSaveUsername = () => {
    if (editUsername.trim()) {
      setState((s) => ({ ...s, user: s.user ? { ...s.user, username: editUsername.trim() } : null }));
      setIsEditingUsername(false);
    }
  };

  const handleCancelEdit = () => {
    setEditUsername(state.user?.username || "");
    setIsEditingUsername(false);
  };

  React.useEffect(() => {
    if (isEditingUsername) {
      setEditUsername(state.user?.username || "");
    }
  }, [isEditingUsername, state.user?.username]);

  return (
    <div>
      <Header t={t} title={L.profileT} subtitle={L.profileSub} big />
      <div style={{ padding: "0 20px" }}>
        {isEditingUsername ? (
          <Card t={t} padding={20} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <div style={{ position: "relative", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: t.surface }}>
                <button onClick={() => nav.openEmojiPicker()}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer", fontSize: 48, padding: 0,
                    borderRadius: "50%", transition: "all .2s",
                    width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `rgba(0,0,0,0.1)`)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  title="Change emoji"
                >
                  {state.user?.emoji || "😊"}
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.inkSoft, marginBottom: 6 }}>{L.usernameField}</div>
                <Input
                  t={t}
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value.slice(0, 30))}
                  placeholder={L.usernamePlaceholder}
                  autoFocus
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button t={t} kind="ghost" onClick={handleCancelEdit} style={{ flex: 1 }}>
                {L.cancel}
              </Button>
              <Button t={t} onClick={handleSaveUsername} disabled={!editUsername.trim() || editUsername === state.user?.username} style={{ flex: 1 }}>
                {L.save}
              </Button>
            </div>
          </Card>
        ) : (
          <Card t={t} padding={20} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, position: "relative" }}>
            <div style={{ position: "relative", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: t.surface }}>
              <button onClick={() => nav.openEmojiPicker()}
                style={{
                  background: "transparent", border: "none", cursor: "pointer", fontSize: 48, padding: 0,
                  borderRadius: "50%", transition: "all .2s",
                  width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `rgba(0,0,0,0.1)`)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                title="Change emoji"
              >
                {state.user?.emoji || "😊"}
              </button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 17, color: t.ink, letterSpacing: -0.3 }}>{state.user?.username || "User"}</div>
            </div>
            <button onClick={() => setIsEditingUsername(true)}
              style={{
                background: t.primary, border: "none", cursor: "pointer", padding: "8px 14px",
                borderRadius: t.cornerMd, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", color: "#fff", fontFamily: t.fontBody, fontWeight: 600, fontSize: 13,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Edit
            </button>
          </Card>
        )}

        <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, padding: "6px 4px 8px" }}>
          {L.linkedAccountsT}
        </div>
        <Card t={t} padding={0} style={{ marginBottom: 16 }}>
          {(state.user?.linkedAccounts || []).length === 0 ? (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontFamily: t.fontBody, fontSize: 13, color: t.inkSoft, marginBottom: 12 }}>{L.noLinkedAccounts}</div>
              <button onClick={() => nav.openLinkAccount()}
                style={{
                  padding: "10px 16px", background: t.primary, color: "#fff", border: "none",
                  borderRadius: t.cornerMd, cursor: "pointer", fontFamily: t.fontBody, fontWeight: 600, fontSize: 13,
                }}>
                {L.linkAccount}
              </button>
            </div>
          ) : (
            <>
              {(state.user?.linkedAccounts || []).map((acc, i, arr) => (
                <div key={acc.id} style={{
                  padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: i === arr.length - 1 ? "none" : `1px solid ${t.hairline}`,
                }}>
                  <span style={{ fontSize: 20 }}>{acc.provider === "line" ? "🟢" : "📘"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>
                      {acc.provider === "line" ? "LINE" : "Google"}
                    </div>
                    <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkMuted, marginTop: 1 }}>{acc.name}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => nav.openLinkAccount()}
                style={{
                  padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                  width: "100%", background: "transparent", border: "none", cursor: "pointer",
                }}>
                <span style={{ fontSize: 20 }}>➕</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.primary }}>{L.linkAnotherAccount}</div>
                </div>
              </button>
            </>
          )}
        </Card>

        <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, padding: "6px 4px 8px" }}>
          {L.settingsHd}
        </div>

        <Card t={t} padding={16} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>{L.themeLbl}</div>
            <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft }}>{allThemes.find((th) => th.id === themeId)?.name}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {allThemes.map((th) => {
              const active = themeId === th.id;
              return (
                <button key={th.id} onClick={() => nav.setTheme(th.id)}
                  style={{
                    background: t.surfaceAlt,
                    border: `2px solid ${active ? t.primary : t.hairline}`,
                    borderRadius: t.cornerSm,
                    padding: "10px 6px",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  }}>
                  <div style={{ display: "flex", gap: 2 }}>
                    {th.colors.map((c, i) => (
                      <div key={i} style={{
                        width: 14, height: 14, borderRadius: "50%",
                        background: c,
                        marginLeft: i === 0 ? 0 : -4,
                      }} />
                    ))}
                  </div>
                  <div style={{ fontFamily: t.fontBody, fontSize: 10, fontWeight: 600, color: t.ink, lineHeight: 1.1, textAlign: "center" }}>
                    {lang === "th" ? th.th : th.name}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card t={t} padding={16} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>{L.languageLbl}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {([{ id: "th" as Lang, label: "ไทย", sub: "TH" }, { id: "en" as Lang, label: "English", sub: "EN" }]).map((opt) => {
              const active = lang === opt.id;
              return (
                <button key={opt.id} onClick={() => nav.setLang(opt.id)}
                  style={{
                    flex: 1,
                    background: active ? t.primary : t.surface,
                    color: active ? "#fff" : t.ink,
                    border: `1px solid ${active ? t.primary : t.hairline}`,
                    borderRadius: t.cornerSm,
                    padding: "12px 0",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    fontFamily: t.fontDisplay, fontWeight: 600,
                  }}>
                  <span style={{ fontSize: 15 }}>{opt.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <div style={{ fontFamily: t.fontBody, fontSize: 10, color: t.inkSoft, fontWeight: 700, letterSpacing: 0.5, padding: "6px 4px 8px" }}>
          {L.moreHd}
        </div>
        <Card t={t} padding={0}>
          {[
            { label: L.menuCategories, sub: L.menuCategoriesS, icon: "🏷️" },
            { label: L.menuCurrency,   sub: L.menuCurrencyS,   icon: "💱" },
            { label: L.menuImport,     sub: L.menuImportS,     icon: "📄" },
            { label: L.menuNotifs,     sub: L.menuNotifsS,     icon: "🔔" },
            { label: L.menuHelp,       sub: L.menuHelpS,       icon: "💬" },
          ].map((it, i, arr) => (
            <div key={it.label} style={{
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: i === arr.length - 1 ? "none" : `1px solid ${t.hairline}`,
            }}>
              <span style={{ fontSize: 20 }}>{it.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.fontBody, fontWeight: 600, fontSize: 14, color: t.ink }}>{it.label}</div>
                <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkMuted, marginTop: 1 }}>{it.sub}</div>
              </div>
              <Ic.ChevR size={16} color={t.inkMuted} />
            </div>
          ))}
        </Card>

        <Button t={t} kind="danger" fullWidth style={{ marginTop: 24, marginBottom: 20 }} onClick={() => nav.logout()}>
          {L.logout}
        </Button>
      </div>
    </div>
  );
}

export function EditUsernameSheet({
  t, state, setState, open, onClose,
}: { t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void }) {
  const L = useL();
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    if (open) setUsername(state.user?.username || "");
  }, [open, state.user?.username]);

  const handleSave = () => {
    if (username.trim() && state.user) {
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, username } : null,
      }));
      onClose();
    }
  };

  return (
    <BottomSheet t={t} open={open} onClose={onClose} title={L.editUsername}>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontFamily: t.fontBody, fontSize: 13, color: t.ink, marginBottom: 8, fontWeight: 600 }}>
            {L.usernameField}
          </div>
          <Input
            t={t}
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 30))}
            placeholder={L.usernamePlaceholder}
            autoFocus
          />
        </div>
        <Button t={t} fullWidth onClick={handleSave} disabled={!username.trim() || username === state.user?.username}>
          {L.save}
        </Button>
      </div>
    </BottomSheet>
  );
}

const EMOJI_LIST = [
  "😀", "😊", "😎", "🤩", "😍", "🥰", "😂", "😭", "🤔", "🤷",
  "😴", "🤗", "🌟", "⭐", "✨", "🔥", "💯", "👍", "🙌", "💪",
  "🎉", "🎊", "🎈", "🎯", "🏆", "🎵", "🎸", "🎤", "🎬", "📚",
];

export function EmojiPickerSheet({
  t, state, setState, open, onClose,
}: { t: Theme; state: AppState; setState: SetState; open: boolean; onClose: () => void }) {
  const L = useL();
  const [selected, setSelected] = React.useState("");

  React.useEffect(() => {
    if (open) setSelected(state.user?.emoji || "😊");
  }, [open, state.user?.emoji]);

  const handleSave = () => {
    if (state.user) {
      setState((s) => ({
        ...s,
        user: s.user ? { ...s.user, emoji: selected } : null,
      }));
      onClose();
    }
  };

  return (
    <BottomSheet t={t} open={open} onClose={onClose} title={L.emojiPickerT}>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          padding: "16px", background: t.surface, borderRadius: t.cornerMd,
        }}>
          <div style={{ fontSize: 48 }}>{selected}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelected(emoji)}
              style={{
                fontSize: 28,
                padding: "8px",
                background: selected === emoji ? t.primary : t.surface,
                border: `2px solid ${selected === emoji ? t.primary : t.hairline}`,
                borderRadius: t.cornerSm,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <Button t={t} fullWidth onClick={handleSave}>
          {L.save}
        </Button>
      </div>
    </BottomSheet>
  );
}
