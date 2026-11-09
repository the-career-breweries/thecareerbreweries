"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function MindlerUserPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const userStr = String(params?.user || "");
    if (userStr.startsWith("mindler-user-")) {
      const code = userStr.replace("mindler-user-", "");
      if (typeof window !== "undefined") {
        localStorage.setItem("tcb_learner_name", `Mindler VIP Learner (#${code})`);
        localStorage.setItem("tcb_name_locked", "true");
        localStorage.setItem("tcb_unlocked_bundle", "pro");
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    } else {
      router.push("/");
    }
  }, [params, router]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0C1322",
      color: "white",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F8FAFC" }}>
          Activating Mindler VIP Pro Pass...
        </h2>
        <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: "1.5" }}>
          Unlocking Track A, Track B Executive Precision, and the Crisis Playbook.
        </p>
      </div>
    </div>
  );
}
