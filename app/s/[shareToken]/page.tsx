"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/_finsplit/api-client";
import type { Session } from "@/app/_finsplit/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID ?? "";

export default function JoinPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState<"loading" | "preview" | "joining" | "joined" | "error">("loading");

  const apiToken = typeof window !== "undefined" ? localStorage.getItem("finsplit-api-token") : null;

  React.useEffect(() => {
    if (!shareToken) return;
    api.getSessionByToken(shareToken)
      .then((s) => { setSession(s); setStatus("preview"); })
      .catch(() => { setError("ไม่พบกลุ่มนี้"); setStatus("error"); });
  }, [shareToken]);

  const join = async () => {
    if (!session || !apiToken) return;
    setStatus("joining");
    try {
      // Check if already a member (linkedUserId already exists)
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("finsplit-v1") : null;
      const userObj = savedUser ? JSON.parse(savedUser).user : null;
      const username = userObj?.username ?? "ผู้ร่วมกลุ่ม";

      const memberId = "m" + Date.now();
      const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#3b82f6", "#8b5cf6", "#06b6d4"];
      const color = colors[session.members.length % colors.length];

      await api.joinSession(apiToken, session.id, {
        id: memberId,
        name: username,
        color,
        isMe: false,
        // linkedUserId is set server-side from the auth token
      } as Parameters<typeof api.joinSession>[2]);

      setStatus("joined");
      // Redirect to LIFF with shareToken so the main app can pick it up
      setTimeout(() => {
        if (LIFF_ID) {
          window.location.href = `https://liff.line.me/${LIFF_ID}?shareToken=${shareToken}`;
        } else {
          router.push(`/?shareToken=${shareToken}`);
        }
      }, 1200);
    } catch (e) {
      console.error(e);
      setError("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
      setStatus("preview");
    }
  };

  const openInLine = () => {
    if (LIFF_ID) {
      window.location.href = `https://liff.line.me/${LIFF_ID}?shareToken=${shareToken}`;
    }
  };

  if (status === "loading") return <Splash emoji="⏳" text="กำลังโหลด..." />;
  if (status === "error") return <Splash emoji="😕" text={error} />;
  if (status === "joined") return <Splash emoji="🎉" text="เข้าร่วมแล้ว! กำลังเปิดแอป..." />;
  if (!session) return null;

  const isLoggedIn = Boolean(apiToken);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f5f0e8",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        maxWidth: 380,
        width: "100%",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        textAlign: "center",
      }}>
        {/* Session banner */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: session.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 16px",
        }}>{session.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{session.name}</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
          {session.members.length} คน · {session.bills.length} บิล
        </div>

        {/* Member list */}
        <div style={{
          background: "#f8f8f8", borderRadius: 12,
          padding: "12px 16px", marginBottom: 24, textAlign: "left",
        }}>
          {session.members.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: m.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
              }}>{m.name[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 14, color: "#333", fontWeight: 600 }}>{m.name}</span>
              {m.isMe && <span style={{ fontSize: 11, color: "#888", marginLeft: "auto" }}>เจ้าของกลุ่ม</span>}
            </div>
          ))}
        </div>

        {isLoggedIn ? (
          <button onClick={join} disabled={status === "joining"} style={{
            width: "100%", padding: "14px 0", background: "#3b82f6",
            color: "#fff", border: "none", borderRadius: 14,
            fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12,
          }}>
            {status === "joining" ? "กำลังเข้าร่วม..." : "เข้าร่วมกลุ่ม"}
          </button>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              ต้องเข้าสู่ระบบก่อนจึงจะเข้าร่วมได้
            </div>
            <button onClick={openInLine} style={{
              width: "100%", padding: "14px 0", background: "#00B900",
              color: "#fff", border: "none", borderRadius: 14,
              fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 12,
            }}>
              เปิดใน LINE
            </button>
          </>
        )}

        <button onClick={() => router.push("/")} style={{
          width: "100%", padding: "12px 0", background: "transparent",
          color: "#888", border: "1px solid #e5e5e5", borderRadius: 14,
          fontSize: 14, cursor: "pointer",
        }}>
          เปิดแอป FinSplit
        </button>

        {error && <div style={{ marginTop: 12, fontSize: 13, color: "#ef4444" }}>{error}</div>}
      </div>
    </div>
  );
}

function Splash({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      background: "#f5f0e8",
    }}>
      <div style={{ fontSize: 48 }}>{emoji}</div>
      <div style={{ fontSize: 16, color: "#666", fontFamily: "system-ui, sans-serif" }}>{text}</div>
    </div>
  );
}
