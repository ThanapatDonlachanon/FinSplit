"use client";

import React from "react";

type IconProps = { size?: number; color?: string; filled?: boolean };
type DirIconProps = IconProps & { dir?: "right" | "up" | "down" | "left" };

export const Ic = {
  Home: ({ size = 22, color = "currentColor", filled = false }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Wallet: ({ size = 22, color = "currentColor", filled = false }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="17" cy="13" r="1.5" fill={color} />
    </svg>
  ),
  Group: ({ size = 22, color = "currentColor", filled = false }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M14 20c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
    </svg>
  ),
  Profile: ({ size = 22, color = "currentColor", filled = false }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  ),
  Plus: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  ChevR: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  ChevL: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  ),
  Close: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Check: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  Camera: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7l1.5-2.5h3L15 7" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  Calendar: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  ),
  Tag: ({ size = 16, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <circle cx="7.5" cy="7.5" r="1" fill={color} />
    </svg>
  ),
  Arrow: ({ size = 18, color = "currentColor", dir = "right" }: DirIconProps) => {
    const rot = ({ right: 0, up: -90, down: 90, left: 180 } as const)[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  },
  Search: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  ),
  Sparkle: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
    </svg>
  ),
  Share: ({ size = 20, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.5 10.5l7-4M8.5 13.5l7 4" />
    </svg>
  ),
  Copy: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
    </svg>
  ),
  Trash: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6" />
    </svg>
  ),
  Bell: ({ size = 22, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  Minus: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  ),
};

type StickerProps = { color?: string; size?: number; style?: React.CSSProperties };
type SquiggleProps = StickerProps & { rotate?: number };

export const Sticker = {
  Squiggle: ({ color = "#000", size = 60, rotate = 0, style = {} }: SquiggleProps) => (
    <svg width={size} height={size / 3} viewBox="0 0 60 20" style={{ transform: `rotate(${rotate}deg)`, ...style }}>
      <path d="M2 10 Q 10 0, 18 10 T 34 10 T 50 10 T 66 10" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  Star: ({ color = "#000", size = 24, style = {} }: StickerProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 1 L14 9 L22 11 L14 13 L12 22 L10 13 L2 11 L10 9 z" />
    </svg>
  ),
  Burst: ({ color = "#000", size = 40, style = {} }: StickerProps) => (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
      <g fill={color}>
        <circle cx="20" cy="20" r="6" />
        <path d="M20 0 L22 13 L18 13 z" />
        <path d="M20 40 L22 27 L18 27 z" />
        <path d="M0 20 L13 22 L13 18 z" />
        <path d="M40 20 L27 22 L27 18 z" />
        <path d="M6 6 L17 16 L16 17 L6 7 z" />
        <path d="M34 34 L23 24 L24 23 L34 33 z" />
        <path d="M34 6 L23 17 L24 18 L33 7 z" />
        <path d="M6 34 L17 23 L18 24 L7 34 z" />
      </g>
    </svg>
  ),
  Confetti: ({ color = "#000", size = 60, style = {} }: StickerProps) => (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
      <g fill={color}>
        <rect x="10" y="10" width="6" height="2" transform="rotate(20 13 11)" />
        <rect x="40" y="8" width="4" height="2" transform="rotate(-30 42 9)" />
        <rect x="50" y="40" width="6" height="2" transform="rotate(45 53 41)" />
        <rect x="5" y="48" width="5" height="2" transform="rotate(-15 7 49)" />
        <circle cx="20" cy="30" r="1.5" />
        <circle cx="48" cy="25" r="1.2" />
        <circle cx="35" cy="50" r="1.5" />
      </g>
    </svg>
  ),
  Blob: ({ color = "#000", size = 80, style = {} }: StickerProps) => (
    <svg width={size} height={size} viewBox="0 0 80 80" style={style}>
      <path d="M40 5 Q 65 5 70 30 Q 80 50 60 65 Q 40 78 25 70 Q 5 60 8 35 Q 12 10 40 5 z" fill={color} />
    </svg>
  ),
  Diamond: ({ color = "#000", size = 24, style = {} }: StickerProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 1 L23 12 L12 23 L1 12 z" />
    </svg>
  ),
};

export function Avatar({
  name = "?", color = "#f97316", size = 36, ink = "#fff", border,
}: { name?: string; color?: string; size?: number; ink?: string; border?: string | null }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: ink,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700,
      fontSize: size * 0.4, letterSpacing: -0.3, flexShrink: 0,
      border: border || "none",
    }}>{initials}</div>
  );
}
