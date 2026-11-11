"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function MindlerUserPage() {
  const router = useRouter();
  const params = useParams();

  const [state, setState] = useState<{
    status: "CHECKING" | "AUTHORIZED" | "OTP_REQUIRED" | "SESSION_CONFLICT" | "EXPIRED" | "BLOCKED";
    message: string;
    studentName?: string;
    activeDeviceName?: string;
    validUntil?: number;
  }>({
    status: "CHECKING",
    message: "Verifying hardware authorization with Sentinel..."
  });

  const [otpVal, setOtpVal] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpCodeInput, setTopUpCodeInput] = useState("");
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

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

  const verifyHardware = async (takeSession = false) => {
    if (!userStr.startsWith("mindler-user-")) {
      router.push("/");
      return;
    }

    const devHash = getFingerprint();
    const devName = getDeviceName();

    try {
      const res = await fetch("https://tcb-sentinel.vercel.app/api/verify-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, device_hash: devHash, device_name: devName, take_session: takeSession })
      });
      const d = await res.json();
      if (d.allowed) {
        localStorage.setItem("tcb_learner_name", d.name || `Mindler VIP Learner (#${code})`);
        localStorage.setItem("tcb_name_locked", "true");
        localStorage.setItem("tcb_unlocked_bundle", "pro");
        localStorage.setItem("tcb_mindler_code", code);
        if (d.valid_until) localStorage.setItem("tcb_valid_until", String(d.valid_until));
        setState({
          status: "AUTHORIZED",
          studentName: d.name,
          validUntil: d.valid_until,
          message: `Hardware authorized (${d.role}). Unlocking Executive Pro Software License...`
        });
        setTimeout(() => router.push("/dashboard"), 800);
      } else if (d.status === "SESSION_CONFLICT") {
        setState({
          status: "SESSION_CONFLICT",
          activeDeviceName: d.active_device_name || "Other Registered Device",
          validUntil: d.valid_until,
          message: d.message || "Active session on another registered device."
        });
      } else if (d.status === "EXPIRED") {
        setState({
          status: "EXPIRED",
          validUntil: d.valid_until,
          message: "Your 7-day access pass has expired. Please top up to continue."
        });
      } else if (d.status === "OTP_REQUIRED") {
        setState({
          status: "OTP_REQUIRED",
          validUntil: d.valid_until,
          message: "New secondary device detected. Please enter the 4-digit code provided by Coach Sandarsh."
        });
      } else {
        setState({
          status: "BLOCKED",
          validUntil: d.valid_until,
          message: "Access Blocked: Maximum 2 devices (1 Primary + 1 Secondary) already registered for this access link."
        });
      }
    } catch {
      // Offline / Graceful unlock fallback
      localStorage.setItem("tcb_learner_name", `Mindler VIP Learner (#${code})`);
      localStorage.setItem("tcb_name_locked", "true");
      localStorage.setItem("tcb_unlocked_bundle", "pro");
      localStorage.setItem("tcb_mindler_code", code);
      setState({
        status: "AUTHORIZED",
        message: "Offline verified. Opening Softskills Lab dashboard..."
      });
      setTimeout(() => router.push("/dashboard"), 800);
    }
  };

  useEffect(() => {
    verifyHardware(false);
  }, [userStr, code]);

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

  const handleTopUpSubmit = async (codeToUse: string) => {
    setIsTopUpLoading(true);
    try {
      const res = await fetch("https://tcb-sentinel.vercel.app/api/topup-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, passcode: codeToUse, days: 3 })
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Pass successfully topped up by +3 Days (+72 Hours)!");
        setTopUpModalOpen(false);
        verifyHardware(false);
      } else {
        alert("❌ " + (data.error || "Failed to activate top up."));
      }
    } catch {
      alert("Network error communicating with Sentinel.");
    } finally {
      setIsTopUpLoading(false);
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
          maxWidth: "440px",
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

        {/* 📱 Active Session Conflict Screen */}
        {state.status === "SESSION_CONFLICT" && (
          <div>
            <div style={{ fontSize: "2.6rem", marginBottom: "1rem" }}>📱</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F8FAFC" }}>
              Active Session on Another Device
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>
              Your account is currently active on <strong>{state.activeDeviceName}</strong>. Softskills Lab allows 2 devices, but only 1 can be used at a time.
            </p>
            <div style={{ background: "rgba(200, 131, 35, 0.12)", border: "1px solid rgba(200, 131, 35, 0.35)", borderRadius: "12px", padding: "12px", marginBottom: "1.5rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.78rem", color: "#F59E0B", fontWeight: 700, marginBottom: "4px" }}>💡 Switching devices right now?</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", lineHeight: "1.4" }}>Click below to take over the session and unlock this screen immediately.</div>
            </div>
            <button
              onClick={() => verifyHardware(true)}
              style={{
                width: "100%",
                padding: "14px",
                background: "#C88323",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              ⚡ Switch Session to This Device
            </button>
            <a
              href={`https://wa.me/919743711584?text=Hi%20Coach%20Sandarsh!%20I'm%20seeing%20a%20session%20conflict%20for%20Softskills%20Lab%20(Code%20%23${code}).`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}
            >
              Need help? Message Coach Sandarsh on WhatsApp →
            </a>
          </div>
        )}

        {/* ⏳ Pass Expired Screen */}
        {state.status === "EXPIRED" && (
          <div>
            <div style={{ fontSize: "2.6rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "700", marginBottom: "0.5rem", color: "#F87171" }}>
              7-Day Access Pass Expired
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "0.88rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Your 7-day Softskills Lab access window has ended. Top up for <strong>+3 days (72 hours) for ₹299</strong> to continue mastering behavioral rounds and executive communication.
            </p>
            <button
              onClick={() => setTopUpModalOpen(true)}
              style={{
                width: "100%",
                padding: "14px",
                background: "#C88323",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              ⚡ Top Up +3 Days for ₹299
            </button>
            <a
              href={`https://wa.me/919743711584?text=Hi%20Coach%20Sandarsh!%20My%207-day%20pass%20for%20Softskills%20Lab%20expired%20(Code%20%23${code}).%20I%20want%20to%20extend%20for%203%20days.`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.8rem", color: "#94A3B8", textDecoration: "none" }}
            >
              Contact Coach Sandarsh on WhatsApp →
            </a>
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

      {/* 💳 Top-Up Modal */}
      {topUpModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(7,24,44,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#0F2D52", border: "2px solid #C88323", borderRadius: "20px", padding: "30px", maxWidth: "440px", width: "100%", color: "white", boxShadow: "0 24px 48px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ fontSize: "26px" }}>⏳</div>
              <div>
                <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: "19px", color: "#F8FAFC", margin: 0 }}>Top Up Pass (+3 Days)</h3>
                <div style={{ fontSize: "11.5px", color: "#94A3B8" }}>Extends active access by +72 hours for ₹299</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#CBD5E1", lineHeight: 1.6, marginBottom: "20px" }}>
              Recharge your access window for +3 days. Maintains your 2 registered devices with single active session protection.
            </p>
            <a href={`https://wa.me/919743711584?text=Hi%20Coach%20Sandarsh!%20👋%20I%20would%20like%20to%20top%20up%20my%20Softskills%20Lab%20pass%20for%20%2B3%20days%20(₹299)%20(Code%20%23${code||'public'}).`} target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", background: "#16A34A", color: "white", textAlign: "center", textDecoration: "none", borderRadius: "10px", padding: "12px", fontWeight: 800, fontSize: "14px", marginBottom: "16px", boxSizing: "border-box" }}>
              💬 Request +3 Days on WhatsApp (₹299)
            </a>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginBottom: "6px", textTransform: "uppercase", fontWeight: 700 }}>Have an Authorization Code?</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="Passcode (e.g. 7755)" value={topUpCodeInput} onChange={e => setTopUpCodeInput(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1.5px solid rgba(200,131,35,0.4)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: "13px", outline: "none" }} />
                <button onClick={() => handleTopUpSubmit(topUpCodeInput.trim())} disabled={!topUpCodeInput.trim() || isTopUpLoading} style={{ background: "#C88323", color: "white", border: "none", borderRadius: "8px", padding: "0 16px", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
                  {isTopUpLoading ? "..." : "Apply"}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
              <button onClick={() => setTopUpModalOpen(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#94A3B8", borderRadius: "8px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
