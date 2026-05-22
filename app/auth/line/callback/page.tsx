"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LineCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        console.error("OAuth error:", error);
        alert("Login failed: " + error);
        router.push("/");
        return;
      }

      if (!code) {
        alert("No authorization code received");
        router.push("/");
        return;
      }

      // Verify state for CSRF protection
      const storedState = sessionStorage.getItem("line_state");
      if (state !== storedState) {
        alert("State mismatch - possible CSRF attack");
        router.push("/");
        return;
      }

      sessionStorage.removeItem("line_state");

      try {
        const res = await fetch("/api/auth/line", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Authentication failed");
        }

        const user = await res.json();
        const authMode = sessionStorage.getItem("auth_mode");
        sessionStorage.removeItem("auth_mode");

        if (authMode === "link") {
          // Linking existing account
          sessionStorage.setItem("line_linked_account", JSON.stringify({
            id: user.id,
            name: user.name,
            provider: "line",
          }));
        } else {
          // First-time login
          sessionStorage.setItem("line_auth_user", JSON.stringify({
            id: user.id,
            name: user.name,
            provider: "line",
          }));
        }

        router.push("/");
      } catch (error) {
        console.error("Auth failed:", error);
        alert("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
        router.push("/");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ fontSize: 24, fontWeight: 600 }}>Loading...</div>
      <div style={{ fontSize: 14, color: "#666" }}>Completing sign in with LINE</div>
    </div>
  );
}
