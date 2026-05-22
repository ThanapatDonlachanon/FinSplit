"use client";

import React from "react";
import { Button, Input, Field, Header, BottomSheet } from "./ui";
import { useL } from "./labels";
import type { Theme } from "./themes";

export function LoginScreen({
  t,
}: {
  t: Theme;
}) {
  const L = useL();

  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${appUrl}/auth/line/callback`;
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem("line_state", state);

    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=profile&state=${state}`;
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${appUrl}/auth/google/callback`;
    const scope = "openid email profile";
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem("google_state", state);

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;
  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "40px 24px 50px",
      justifyContent: "center",
      gap: 32,
    }}>
      <div style={{ textAlign: "center", gap: 16, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontSize: 48,
          lineHeight: 1,
          marginBottom: 8,
        }}>💰</div>
        <div style={{
          fontFamily: t.fontDisplay,
          fontSize: 28,
          fontWeight: 700,
          color: t.ink,
          letterSpacing: -0.5,
          lineHeight: 1.2,
        }}>{L.loginT}</div>
        <div style={{
          fontFamily: t.fontBody,
          fontSize: 15,
          color: t.inkSoft,
          lineHeight: 1.5,
        }}>{L.loginS}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Button
          t={t}
          fullWidth
          onClick={handleLineLogin}
          style={{
            background: "#00B900",
            border: "none",
            color: "white",
            fontWeight: 600,
          }}
        >
          {L.loginLine}
        </Button>
        <Button
          t={t}
          fullWidth
          onClick={handleGoogleLogin}
          style={{
            background: "#fff",
            border: `1px solid ${t.hairline}`,
            color: t.ink,
            fontWeight: 600,
          }}
        >
          {L.loginGoogle}
        </Button>
      </div>
    </div>
  );
}

export function UsernamePromptScreen({
  t,
  emoji,
  onConfirm,
}: {
  t: Theme;
  emoji: string;
  onConfirm: (username: string) => void;
}) {
  const L = useL();
  const [username, setUsername] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleConfirm = () => {
    if (username.trim()) {
      onConfirm(username.trim());
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "40px 24px 50px",
      justifyContent: "center",
      gap: 32,
    }}>
      <div style={{ textAlign: "center", gap: 16, display: "flex", flexDirection: "column" }}>
        <div style={{
          fontSize: 48,
          lineHeight: 1,
          marginBottom: 8,
        }}>{emoji}</div>
        <div style={{
          fontFamily: t.fontDisplay,
          fontSize: 28,
          fontWeight: 700,
          color: t.ink,
          letterSpacing: -0.5,
          lineHeight: 1.2,
        }}>{L.usernamePromptT}</div>
        <div style={{
          fontFamily: t.fontBody,
          fontSize: 15,
          color: t.inkSoft,
          lineHeight: 1.5,
        }}>{L.usernamePromptS}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          t={t}
          value={username}
          onChange={(e) => setUsername(e.target.value.slice(0, 30))}
          placeholder={L.usernamePlaceholder}
          autoFocus
        />
        <Button
          t={t}
          fullWidth
          onClick={handleConfirm}
          disabled={!username.trim() || submitted}
        >
          {L.usernameConfirm}
        </Button>
      </div>
    </div>
  );
}

export function EditUsernameSheet({
  t,
  username,
  open,
  onClose,
  onSave,
}: {
  t: Theme;
  username: string;
  open: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
}) {
  const L = useL();
  const [value, setValue] = React.useState(username);

  React.useEffect(() => {
    if (open) setValue(username);
  }, [open, username]);

  const handleSave = () => {
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  };

  return (
    <BottomSheet t={t} open={open} onClose={onClose}>
      <Header t={t} title={L.editUsername} onBack={onClose} />
      <div style={{ padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Field t={t} label={L.usernamePlaceholder}>
          <Input
            t={t}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, 30))}
            placeholder={L.usernamePlaceholder}
            autoFocus
          />
        </Field>
        <Button t={t} fullWidth onClick={handleSave} disabled={!value.trim()}>
          {L.save}
        </Button>
      </div>
    </BottomSheet>
  );
}

const EMOJI_PRESET = [
  "😀", "😃", "😄", "😁", "🥰", "😍", "😘", "😊",
  "🤗", "😎", "🥸", "😏", "😌", "😴", "😪", "🤤",
  "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨",
  "🦁", "🐶", "🐕", "🐩", "🦮", "🐈", "🐓", "🦅",
  "🦆", "🦢", "🦉", "🦞", "🐙", "🦑", "🦐", "🐢",
];

export function EmojiPickerSheet({
  t,
  emoji,
  open,
  onClose,
  onSelect,
}: {
  t: Theme;
  emoji: string;
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}) {
  const L = useL();

  return (
    <BottomSheet t={t} open={open} onClose={onClose}>
      <Header t={t} title={L.emojiPickerT} onBack={onClose} />
      <div style={{ padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 8,
        }}>
          {EMOJI_PRESET.map((e) => (
            <button
              key={e}
              onClick={() => {
                onSelect(e);
                onClose();
              }}
              style={{
                background: emoji === e ? t.primary : t.surface,
                border: `2px solid ${emoji === e ? t.primary : t.hairline}`,
                borderRadius: 8,
                fontSize: 32,
                padding: 8,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

export function LinkAccountSheet({
  t,
  linkedAccounts,
  open,
  onClose,
  onLinkLine,
  onLinkGoogle,
}: {
  t: Theme;
  linkedAccounts: Array<{ provider: "line" | "google"; id: string; name: string }>;
  open: boolean;
  onClose: () => void;
  onLinkLine: () => void;
  onLinkGoogle: () => void;
}) {
  const L = useL();
  const lineLinked = linkedAccounts.some((a) => a.provider === "line");
  const googleLinked = linkedAccounts.some((a) => a.provider === "google");

  const handleLinkLine = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${appUrl}/auth/line/callback`;
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem("line_state", state);
    sessionStorage.setItem("auth_mode", "link");

    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=profile&state=${state}`;
  };

  const handleLinkGoogle = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${appUrl}/auth/google/callback`;
    const scope = "openid email profile";
    const state = Math.random().toString(36).substring(7);

    sessionStorage.setItem("google_state", state);
    sessionStorage.setItem("auth_mode", "link");

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&state=${state}`;
  };

  return (
    <BottomSheet t={t} open={open} onClose={onClose}>
      <Header t={t} title={L.linkAccount} onBack={onClose} />
      <div style={{ padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Button
          t={t}
          fullWidth
          disabled={lineLinked}
          onClick={lineLinked ? onClose : handleLinkLine}
          style={{
            background: lineLinked ? t.inkMuted : "#00B900",
            color: lineLinked ? t.ink : "white",
          }}
        >
          {lineLinked ? "✓ LINE " + L.linked : L.loginLine}
        </Button>
        <Button
          t={t}
          fullWidth
          disabled={googleLinked}
          onClick={googleLinked ? onClose : handleLinkGoogle}
          style={{
            background: googleLinked ? t.surface : "white",
            color: googleLinked ? t.ink : t.ink,
            border: `1px solid ${googleLinked ? t.hairline : t.hairline}`,
          }}
        >
          {googleLinked ? "✓ Google " + L.linked : L.loginGoogle}
        </Button>
      </div>
    </BottomSheet>
  );
}
