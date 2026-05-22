"use client";

import React from "react";
import { Theme, cardBorder, cardShadow } from "./themes";
import { Ic, Sticker } from "./icons";
import { useL } from "./labels";

type ButtonKind = "primary" | "secondary" | "ghost" | "danger" | "accent";

export function Button({
  t, kind = "primary", icon, children, onClick, fullWidth = false, disabled = false, style = {},
}: {
  t: Theme;
  kind?: ButtonKind;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const variants: Record<ButtonKind, { bg: string; fg: string; border: string }> = {
    primary: { bg: t.primary, fg: "#fff", border: "transparent" },
    secondary: { bg: t.surface, fg: t.ink, border: t.hairline },
    ghost: { bg: "transparent", fg: t.ink, border: "transparent" },
    danger: { bg: t.rose, fg: "#fff", border: "transparent" },
    accent: { bg: t.amber, fg: t.ink, border: "transparent" },
  };
  const v = variants[kind] || variants.primary;
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{
        background: v.bg, color: v.fg,
        border: `${kind === "secondary" ? 1 : 0}px solid ${v.border}`,
        borderRadius: t.cornerMd,
        padding: "14px 20px",
        fontFamily: t.fontDisplay,
        fontWeight: 600, fontSize: 16,
        letterSpacing: -0.2,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        width: fullWidth ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "transform .08s",
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translate(1px,1px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {icon}{children}
    </button>
  );
}

export function IconButton({
  t, icon, onClick, kind = "ghost", size = 40, ariaLabel,
}: {
  t: Theme;
  icon: React.ReactNode;
  onClick?: () => void;
  kind?: "ghost" | "primary" | "surface";
  size?: number;
  ariaLabel?: string;
}) {
  const bg = kind === "primary" ? t.primary : kind === "surface" ? t.surface : "transparent";
  const fg = kind === "primary" ? "#fff" : t.ink;
  return (
    <button onClick={onClick} aria-label={ariaLabel}
      style={{
        width: size, height: size,
        background: bg, color: fg,
        border: kind === "surface" ? `1px solid ${t.hairline}` : "none",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}>{icon}</button>
  );
}

export function Card({
  t, children, padding = 16, style = {}, accent, onClick, depth = 1,
}: {
  t: Theme;
  children?: React.ReactNode;
  padding?: number;
  style?: React.CSSProperties;
  accent?: string;
  onClick?: () => void;
  depth?: 0 | 1 | 2;
}) {
  return (
    <div onClick={onClick}
      style={{
        background: accent || t.surface,
        borderRadius: t.cornerMd,
        border: cardBorder(t),
        boxShadow: cardShadow(t, depth),
        padding,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        ...style,
      }}>{children}</div>
  );
}

export function Input({
  t, value, onChange, placeholder, type = "text", prefix, suffix, autoFocus,
  fontSize = 16, fontFamily, align = "left", style = {},
}: {
  t: Theme;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  autoFocus?: boolean;
  fontSize?: number;
  fontFamily?: string;
  align?: "left" | "right" | "center";
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: t.surface,
      borderRadius: t.cornerSm,
      border: `1px solid ${t.hairline}`,
      padding: "12px 14px",
      ...style,
    }}>
      {prefix && <span style={{ color: t.inkSoft, fontFamily: t.fontBody, fontSize }}>{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          color: t.ink, fontSize, textAlign: align,
          fontFamily: fontFamily || t.fontBody, fontWeight: 500,
          width: "100%", minWidth: 0,
        }}
      />
      {suffix && <span style={{ color: t.inkSoft, fontFamily: t.fontBody, fontSize }}>{suffix}</span>}
    </div>
  );
}

export function Chip({
  t, children, active, onClick, color, icon,
}: {
  t: Theme;
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
  icon?: React.ReactNode;
}) {
  const bg = active ? color || t.primary : t.surface;
  const fg = active ? "#fff" : t.ink;
  return (
    <button onClick={onClick} style={{
      background: bg, color: fg,
      border: `1px solid ${active ? bg : t.hairline}`,
      borderRadius: 999,
      padding: "8px 14px",
      fontFamily: t.fontBody,
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: -0.1,
      cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      flexShrink: 0,
    }}>{icon}{children}</button>
  );
}

export function Money({
  t, amount, currency = "฿", size = 36, color, sign = false, mute = false,
}: {
  t: Theme;
  amount: number;
  currency?: string;
  size?: number;
  color?: string;
  sign?: boolean;
  mute?: boolean;
}) {
  const negative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [intPart, decPart] = formatted.split(".");
  return (
    <span style={{
      fontFamily: t.fontNum, fontWeight: 700,
      color: color || (negative ? t.rose : t.ink),
      fontSize: size, letterSpacing: -1.5,
      lineHeight: 1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
    }}>
      {sign && (negative ? "−" : "+")}
      <span style={{ fontSize: size * 0.55, marginRight: 2, opacity: 0.7, fontWeight: 600 }}>{currency}</span>
      {intPart}
      <span style={{ fontSize: size * 0.55, opacity: mute ? 0.4 : 0.7, fontWeight: 600 }}>.{decPart}</span>
    </span>
  );
}

export function TabBar({
  t, current, onTabChange, onAdd,
}: {
  t: Theme;
  current: string;
  onTabChange: (id: string) => void;
  onAdd: () => void;
}) {
  const L = useL();
  const items = [
    { id: "home", icon: Ic.Home, label: L.tabHome },
    { id: "wallets", icon: Ic.Wallet, label: L.tabWallets },
    { id: "add", icon: Ic.Plus, isFab: true as const, label: "" },
    { id: "groups", icon: Ic.Group, label: L.tabGroups },
    { id: "profile", icon: Ic.Profile, label: L.tabProfile },
  ];
  return (
    <div style={{
      background: t.surface,
      borderTop: `1px solid ${t.hairline}`,
      paddingTop: 8, paddingBottom: 24,
      display: "flex", justifyContent: "space-around", alignItems: "flex-start",
      position: "relative", zIndex: 5,
    }}>
      {items.map((it) => {
        if (it.isFab) {
          return (
            <button key={it.id} onClick={onAdd}
              style={{
                width: 56, height: 56,
                marginTop: -22,
                background: t.primary, color: "#fff",
                border: "none",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: `0 6px 16px ${t.primary}66`,
              }}>
              <Ic.Plus size={26} color="#fff" />
            </button>
          );
        }
        const Icon = it.icon;
        const isActive = current === it.id;
        return (
          <button key={it.id} onClick={() => onTabChange(it.id)}
            style={{
              flex: 1,
              background: "transparent", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "6px 0",
              color: isActive ? t.primary : t.inkMuted,
              fontFamily: t.fontBody, fontWeight: 600, fontSize: 10,
              letterSpacing: -0.1,
            }}>
            <Icon size={22} color={isActive ? t.primary : t.inkMuted} filled={isActive} />
            <span style={{ fontSize: 10 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Header({
  t, title, subtitle, onBack, actions, accent, big = false,
}: {
  t: Theme;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  accent?: string;
  big?: boolean;
}) {
  return (
    <div style={{
      padding: big ? "14px 20px 0" : "12px 20px",
      background: accent || "transparent",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 36 }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "transparent", border: "none", cursor: "pointer",
            padding: 6, marginLeft: -6, display: "flex",
          }}>
            <Ic.ChevL size={24} color={t.ink} />
          </button>
        )}
        {!big && (
          <div style={{ flex: 1, fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 17, color: t.ink, letterSpacing: -0.3 }}>
            {title}
          </div>
        )}
        {big && <div style={{ flex: 1 }} />}
        <div style={{ display: "flex", gap: 6 }}>{actions}</div>
      </div>
      {big && (
        <div style={{ padding: "8px 0 12px" }}>
          <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 32, color: t.ink, letterSpacing: -1, lineHeight: 1.05 }}>{title}</div>
          {subtitle && <div style={{ fontFamily: t.fontBody, color: t.inkSoft, fontSize: 14, marginTop: 4 }}>{subtitle}</div>}
        </div>
      )}
    </div>
  );
}

export function BottomSheet({
  t, open, onClose, children, title, maxHeight = "85%",
}: {
  t: Theme;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
  maxHeight?: string;
}) {
  if (!open) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.4)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          background: t.surface,
          borderTopLeftRadius: t.cornerLg,
          borderTopRightRadius: t.cornerLg,
          maxHeight,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "fsSlideUp 0.25s cubic-bezier(.2,.7,.3,1)",
        }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, background: t.hairline, borderRadius: 2 }} />
        </div>
        {title && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 20px 12px",
          }}>
            <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 20, color: t.ink, letterSpacing: -0.5 }}>{title}</div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <Ic.Close size={22} color={t.inkSoft} />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

export function Progress({ t, value, color, height = 8 }: { t: Theme; value: number; color?: string; height?: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{
      height,
      background: t.surfaceAlt,
      borderRadius: 999, overflow: "hidden",
    }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: color || t.primary,
        transition: "width .35s",
      }} />
    </div>
  );
}

export function EmptyState({
  t, sticker, title, subtitle, ctaLabel, onCta, secondaryLabel, onSecondary,
}: {
  t: Theme;
  sticker?: React.ReactNode;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", padding: "20px 24px 24px", gap: 16,
    }}>
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 4 }}>
        {sticker}
      </div>
      <div>
        <div style={{ fontFamily: t.fontDisplay, fontWeight: 700, fontSize: 22, color: t.ink, letterSpacing: -0.5, marginBottom: 6, whiteSpace: "pre-line" }}>{title}</div>
        <div style={{ fontFamily: t.fontBody, color: t.inkSoft, fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-line" }}>{subtitle}</div>
      </div>
      {ctaLabel && <Button t={t} onClick={onCta} icon={<Ic.Plus size={18} color="#fff" />}>{ctaLabel}</Button>}
      {secondaryLabel && (
        <button onClick={onSecondary} style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: t.inkSoft, fontFamily: t.fontBody, fontSize: 13, fontWeight: 600,
          textDecoration: "underline", textDecorationThickness: 1.5, textUnderlineOffset: 4,
        }}>{secondaryLabel}</button>
      )}
    </div>
  );
}

export function StickerScene({ t, kind = "wallet" }: { t: Theme; kind?: "wallet" | "group" | "budget" | "welcome" | "done" }) {
  const c1 = t.primary, c2 = t.amber, c3 = t.rose, c4 = t.sky, ink = t.ink;
  if (kind === "wallet") {
    return (
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <Sticker.Blob color={c2} size={140} style={{ position: "absolute", top: 0, left: 0, opacity: 0.7 }} />
        <div style={{
          position: "absolute", top: 32, left: 18,
          width: 104, height: 76,
          background: c1, borderRadius: 14,
          boxShadow: `0 6px 18px ${c1}55`,
        }}>
          <div style={{ position: "absolute", right: 12, top: 30, width: 18, height: 18, borderRadius: "50%", background: c3 }} />
          <div style={{ position: "absolute", left: 12, top: 12, width: 40, height: 6, background: "#fff", borderRadius: 3, opacity: 0.5 }} />
        </div>
        <Sticker.Star color={c3} size={26} style={{ position: "absolute", top: 4, right: 10 }} />
        <Sticker.Squiggle color={ink} size={50} rotate={20} style={{ position: "absolute", bottom: 8, left: 10 }} />
      </div>
    );
  }
  if (kind === "group") {
    return (
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <Sticker.Blob color={c4} size={140} style={{ position: "absolute", top: 0, left: 0, opacity: 0.5 }} />
        {[{ x: 18, y: 30, c: c1 }, { x: 60, y: 18, c: c2 }, { x: 50, y: 70, c: c3 }, { x: 92, y: 56, c: c4 }].map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: p.x, top: p.y,
            width: 36, height: 36, borderRadius: "50%",
            background: p.c,
            boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
          }} />
        ))}
        <Sticker.Star color={c2} size={20} style={{ position: "absolute", top: 0, right: 22 }} />
        <Sticker.Burst color={ink} size={26} style={{ position: "absolute", bottom: 4, right: 8 }} />
      </div>
    );
  }
  if (kind === "budget") {
    return (
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <Sticker.Blob color={c3} size={140} style={{ position: "absolute", top: 0, left: 0, opacity: 0.4 }} />
        {[40, 70, 100].map((h, i) => (
          <div key={i} style={{
            position: "absolute",
            left: 24 + i * 30, bottom: 26,
            width: 22, height: h,
            background: [c1, c2, c4][i],
            borderRadius: 4,
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          }} />
        ))}
        <Sticker.Confetti color={ink} size={40} style={{ position: "absolute", top: 0, left: 0 }} />
      </div>
    );
  }
  if (kind === "welcome") {
    return (
      <div style={{ position: "relative", width: 200, height: 160 }}>
        <Sticker.Blob color={c2} size={120} style={{ position: "absolute", top: 30, left: 40, opacity: 0.7 }} />
        <Sticker.Star color={c3} size={36} style={{ position: "absolute", top: 6, left: 14, transform: "rotate(-15deg)" }} />
        <Sticker.Diamond color={c4} size={26} style={{ position: "absolute", top: 20, right: 24, transform: "rotate(20deg)" }} />
        <div style={{
          position: "absolute", left: 60, top: 50,
          width: 80, height: 80, borderRadius: "50%",
          background: c1,
          boxShadow: `0 8px 24px ${c1}66`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: t.fontDisplay, fontSize: 36, color: "#fff", fontWeight: 700,
        }}>฿</div>
        <Sticker.Squiggle color={ink} size={60} rotate={15} style={{ position: "absolute", bottom: 0, right: 0 }} />
        <Sticker.Burst color={c3} size={28} style={{ position: "absolute", bottom: 10, left: 16 }} />
      </div>
    );
  }
  if (kind === "done") {
    return (
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <Sticker.Blob color={t.emerald} size={140} style={{ position: "absolute", top: 0, left: 0, opacity: 0.7 }} />
        <div style={{
          position: "absolute", top: 38, left: 38,
          width: 64, height: 64, borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ic.Check size={32} color={t.emerald} />
        </div>
        <Sticker.Confetti color={c1} size={60} style={{ position: "absolute", top: 0, left: 0 }} />
        <Sticker.Confetti color={c3} size={60} style={{ position: "absolute", bottom: 0, right: 0, transform: "rotate(180deg)" }} />
        <Sticker.Star color={c2} size={20} style={{ position: "absolute", top: 10, right: 16 }} />
      </div>
    );
  }
  return null;
}

export function Field({ t, label, children }: { t: Theme; label: string; children?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.inkSoft, fontWeight: 600, marginBottom: 6, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
      {children}
    </div>
  );
}
