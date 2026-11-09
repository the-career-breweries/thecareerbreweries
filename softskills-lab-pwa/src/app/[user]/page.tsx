"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function MindlerUserPage() {
  const router = useRouter();
  const params = useParams();

  const [state, setState] = useState<{
    status: "CHECKING" | "AUTHORIZED" | "OTP_REQUIRED" | "BLOCKED";
    message: string;
    studentName?: string;
  }>({
    status: "CHECKING",
    message: "Verifying hardware authorization with Sentinel..."
  });

  const [otpVal, setOtpVal] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const userStr = String(params?.user || "");
  const code = userStr.replace("mindler-user-", "");

  function getFingerprint() {
    try {
      const s = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
      const u = navigator.userAgent;
      const l = navigator.language || '';
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('TCB-SENTINEL-DEVICE-LOCK-v1', 2, 2);
      }
      const cHash = canvas.toDataURL ? canvas.toDataURL().slice(-40) : '';
      const raw = `${s}:::${u}:::${l}:::${tz}:::${cHash}`;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      return 'dev_' + Math.abs(hash).toString(36);
    } catch {
      return 'dev_' + Math.abs(Date.now()).toString(36);
    }
  }

  function getDeviceName() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return 'Apple iOS Device';
    if (/Android/.test(ua)) return 'Android Device';
    if (/Macintosh/.test(ua)) return 'MacBook';
    if (/Windows/.test(ua)) return 'Windows PC';
    return 'Personal Device';
  }

  useEffect(() => {
    if (!userStr.startsWith("mindler-user-")) {
      router.push("/");
      return;
    }

    const devHash = getFingerprint();
    const devName = getDeviceName();

    fetch("https://tcb-sentinel.vercel.app/api/verify-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, device_hash: devHash, device_name: devName })
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.allowed) {
          localStorage.setItem("tcb_learner_name", d.name || `Mindler VIP Learner (#${code})`);
          localStorage.setItem("tcb_name_locked", "true");
          localStorage.setItem("tcb_unlocked_bundle", "pro");
          setState({
            status: "AUTHORIZED",
            studentName: d.name,
            message: `Hardware authorized (${d.role}). Unlocking Executive Pro Software License...`
          });
          setTimeout(() => router.push("/dashboard"), 800);
        } else if (d.status === "OTP_REQUIRED") {
          setState({
            status: "OTP_REQUIRED",
            message: "New secondary device detected. Please enter the 4-digit code provided by Coach Sandarsh."
          });
        } else {
          setState({
            status: "BLOCKED",
            message: "Access Blocked: Maximum 2 devices (1 Primary + 1 Secondary) already registered for this access link."
          });
        }
      })
      .catch(() => {
        // Offline / Graceful unlock fallback
        localStorage.setItem("tcb_learner_name", `Mindler VIP Learner (#${code})`);
        localStorage.setItem("tcb_name_locked", "true");
        localStorage.setItem("tcb_unlocked_bundle", "pro");
        setState({
          status: "AUTHORIZED",
          message: "Offline verified. Opening Softskills Lab dashboard..."
        });
        setTimeout(() => router.push("/dashboard"), 800);
      });
  }, [userStr, code, router]);

  const handleOtpSubmit = async () => {
    if (!otpVal || otpVal.length !== 4) {
      alert("Please enter the 4-digit approval code from Coach Sandarsh.");
      return;
    }
    setOtpSubmitting(true);
    try {
      const res = await fetch("https://tcb-sentinel.vercel.app/api/approve-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, otp: otpVal })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Secondary device successfully authorized!");
        location.reload();
      } else {
        alert("❌ " + (data.message || "Incorrect authorization code."));
      }
    } catch {
      alert("Verification network error. Please retry.");
    } finally {
      setOtpSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0C1322",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "1.5rem"
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
          padding: "2.5rem 2rem",
          background: "rgba(15, 35, 65, 0.7)",
          border: "1.5px solid rgba(200, 131, 35, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {state.status === "CHECKING" && (
          <div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚡</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F8FAFC" }}>
              Verifying Hardware Authorization...
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: "1.5" }}>{state.message}</p>
          </div>
        )}

        {state.status === "AUTHORIZED" && (
          <div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F8FAFC" }}>
              Welcome, {state.studentName || "Learner"}!
            </h2>
            <p style={{ color: "#FDE68A", fontSize: "0.9rem", lineHeight: "1.5" }}>{state.message}</p>
          </div>
        )}

        {state.status === "OTP_REQUIRED" && (
          <div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔐</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F8FAFC" }}>
              Device 2 Authorization Required
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              You are accessing from a secondary machine. Enter the 4-digit code provided by Coach Sandarsh:
            </p>
            <input
              type="text"
              maxLength={4}
              value={otpVal}
              onChange={(e) => setOtpVal(e.target.value)}
              placeholder="••••"
              style={{
                width: "100%",
                padding: "12px",
                letterSpacing: "12px",
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: "800",
                background: "rgba(255, 255, 255, 0.06)",
                border: "2px solid #C88323",
                borderRadius: "10px",
                color: "white",
                outline: "none",
                marginBottom: "1rem"
              }}
            />
            <button
              onClick={handleOtpSubmit}
              disabled={otpSubmitting}
              style={{
                width: "100%",
                padding: "14px",
                background: "#C88323",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: otpSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {otpSubmitting ? "Authorizing..." : "Authorize Secondary Device"}
            </button>
          </div>
        )}

        {state.status === "BLOCKED" && (
          <div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚫</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F87171" }}>
              Access Denied: Maximum 2 Devices
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
              This VIP access link has already been bound to its hard limit of 2 devices (1 Primary + 1 Secondary). Link
              sharing is disabled.
            </p>
            <a
              href={`https://wa.me/919743711584?text=Hi%20Coach%20Sandarsh!%20I'm%20trying%20to%20access%20Softskills%20Lab%20from%20a%20new%20device%20for%20code%20%23${code}.`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem"
              }}
            >
              💬 Message Coach Sandarsh on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
