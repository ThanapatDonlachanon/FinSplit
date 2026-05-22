// FinSplit theme tokens — 4 playful color sets, all soft drop shadows.

export type Theme = {
  id: string;
  name: string;
  bg: string; bgAlt: string;
  surface: string; surfaceAlt: string;
  ink: string; inkSoft: string; inkMuted: string;
  hairline: string;
  primary: string; primary2: string;
  amber: string;
  rose: string; rosePale: string;
  sky: string;
  emerald: string;
  swatches: string[];
  cornerLg: number; cornerMd: number; cornerSm: number;
  shadowStyle: "soft" | "hard";
  borderWidth: number;
  fontDisplay: string;
  fontBody: string;
  fontNum: string;
  stickerStyle: "blob" | "sharp";
};

const sharedFonts = {
  fontDisplay: 'var(--font-grotesk), var(--font-plex-thai), "Space Grotesk", "IBM Plex Sans Thai", system-ui',
  fontBody: 'var(--font-plex-thai), var(--font-grotesk), "IBM Plex Sans Thai", "Space Grotesk", system-ui',
  fontNum: 'var(--font-grotesk), var(--font-jb-mono), "Space Grotesk", "JetBrains Mono", monospace',
} as const;

export const CITRUS: Theme = {
  id: "citrus",
  name: "Citrus Carnival",
  bg: "#fff7ed", bgAlt: "#fef3c7",
  surface: "#ffffff", surfaceAlt: "#fafaf9",
  ink: "#1c1917", inkSoft: "#57534e", inkMuted: "#a8a29e",
  hairline: "#e7e5e4",
  primary: "#ea580c", primary2: "#fb923c",
  amber: "#f59e0b",
  rose: "#e11d48", rosePale: "#fda4af",
  sky: "#0284c7",
  emerald: "#059669",
  swatches: ["#f97316", "#f59e0b", "#eab308", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e"],
  cornerLg: 28, cornerMd: 18, cornerSm: 12,
  shadowStyle: "soft", borderWidth: 0,
  ...sharedFonts,
  stickerStyle: "blob",
};

export const MINT: Theme = {
  id: "mint",
  name: "Mint Confetti",
  bg: "#ecfdf5", bgAlt: "#cffafe",
  surface: "#ffffff", surfaceAlt: "#f0fdfa",
  ink: "#0f172a", inkSoft: "#475569", inkMuted: "#94a3b8",
  hairline: "#d1fae5",
  primary: "#059669", primary2: "#34d399",
  amber: "#facc15",
  rose: "#a855f7", rosePale: "#d8b4fe",
  sky: "#0ea5e9",
  emerald: "#10b981",
  swatches: ["#10b981", "#06b6d4", "#0ea5e9", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e", "#f97316", "#facc15"],
  cornerLg: 24, cornerMd: 16, cornerSm: 10,
  shadowStyle: "soft", borderWidth: 0,
  ...sharedFonts,
  stickerStyle: "blob",
};

export const BERRY: Theme = {
  id: "berry",
  name: "Berry Pop",
  bg: "#fdf2f8", bgAlt: "#fae8ff",
  surface: "#ffffff", surfaceAlt: "#fdf4ff",
  ink: "#3b0764", inkSoft: "#6b21a8", inkMuted: "#c084fc",
  hairline: "#f5d0fe",
  primary: "#db2777", primary2: "#f472b6",
  amber: "#facc15",
  rose: "#e11d48", rosePale: "#fda4af",
  sky: "#8b5cf6",
  emerald: "#10b981",
  swatches: ["#db2777", "#e11d48", "#f97316", "#facc15", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"],
  cornerLg: 24, cornerMd: 16, cornerSm: 10,
  shadowStyle: "soft", borderWidth: 0,
  ...sharedFonts,
  stickerStyle: "blob",
};

export const OCEAN: Theme = {
  id: "ocean",
  name: "Ocean Splash",
  bg: "#eff6ff", bgAlt: "#cffafe",
  surface: "#ffffff", surfaceAlt: "#f0f9ff",
  ink: "#0c4a6e", inkSoft: "#0369a1", inkMuted: "#7dd3fc",
  hairline: "#bae6fd",
  primary: "#0284c7", primary2: "#38bdf8",
  amber: "#fb923c",
  rose: "#f43f5e", rosePale: "#fda4af",
  sky: "#6366f1",
  emerald: "#06b6d4",
  swatches: ["#0284c7", "#06b6d4", "#14b8a6", "#10b981", "#84cc16", "#facc15", "#fb923c", "#f43f5e", "#8b5cf6", "#6366f1"],
  cornerLg: 22, cornerMd: 14, cornerSm: 10,
  shadowStyle: "soft", borderWidth: 0,
  ...sharedFonts,
  stickerStyle: "sharp",
};

export const THEMES: Record<string, Theme> = { citrus: CITRUS, mint: MINT, berry: BERRY, ocean: OCEAN };
export const THEME_ORDER = ["citrus", "mint", "berry", "ocean"] as const;
export type ThemeId = (typeof THEME_ORDER)[number];

export function cardShadow(t: Theme, depth: 0 | 1 | 2 = 1): string {
  if (t.shadowStyle === "hard") {
    const o = depth === 0 ? "2px 2px" : depth === 1 ? "4px 4px" : "6px 6px";
    return `${o} 0 ${t.ink}`;
  }
  return depth === 0
    ? "0 1px 2px rgba(28,25,23,0.05)"
    : depth === 1
    ? "0 4px 16px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.04)"
    : "0 12px 32px rgba(28,25,23,0.12), 0 4px 12px rgba(28,25,23,0.06)";
}

export function cardBorder(t: Theme): string {
  return t.borderWidth ? `${t.borderWidth}px solid ${t.ink}` : "none";
}
