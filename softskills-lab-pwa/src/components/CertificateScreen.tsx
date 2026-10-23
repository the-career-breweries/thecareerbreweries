"use client";

import React, { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { TRACK_A_MODULES } from '@/data/trackAModules';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  ArrowLeft,
  Lock,
  Printer,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function CertificateScreen() {
  const [mounted, setMounted] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [credentialId, setCredentialId] = useState('TCB-2026-SL-8492');
  const [issueDate, setIssueDate] = useState('');
  const [overallPct, setOverallPct] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setIssueDate(
      now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    );

    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      const total = TRACK_A_MODULES.reduce((acc, m) => acc + (savedProgress[m.id] || 0), 0);
      const pct = Math.round(total / TRACK_A_MODULES.length);
      setOverallPct(pct);

      const savedName = localStorage.getItem('tcb_learner_name') || '';
      const savedLock = localStorage.getItem('tcb_name_locked') === 'true';
      if (savedName && savedLock) {
        setLearnerName(savedName);
        setIsNameLocked(true);
      }

      let savedCred = localStorage.getItem('tcb_credential_id');
      if (!savedCred) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        savedCred = `TCB-2026-SL-${rand}`;
        localStorage.setItem('tcb_credential_id', savedCred);
      }
      setCredentialId(savedCred);
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const email = data.user.email || '';
          setUserEmail(email);
          const meta = data.user.user_metadata || {};

          const uidClean = data.user.id.replace(/-/g, '').substring(0, 6).toUpperCase();
          const detCred = `TCB-2026-${uidClean}`;
          setCredentialId(detCred);
          localStorage.setItem('tcb_credential_id', detCred);

          if (meta.full_name && meta.name_locked) {
            setLearnerName(meta.full_name);
            setIsNameLocked(true);
            localStorage.setItem('tcb_learner_name', meta.full_name);
            localStorage.setItem('tcb_name_locked', 'true');
          } else if (meta.full_name) {
            setNameInput(meta.full_name);
          }
        }
      });
    }
  }, []);

  const handlePermanentLockName = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim();
    if (clean.length < 3) return;

    setLocking(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcb_learner_name', clean);
      localStorage.setItem('tcb_name_locked', 'true');
    }

    try {
      if (supabase) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.auth.updateUser({
            data: {
              full_name: clean,
              name_locked: true,
              credential_id: credentialId,
              workshop_completion_pct: overallPct
            }
          });
          await supabase.from('profiles').upsert({
            id: userData.user.id,
            email: userData.user.email,
            full_name: clean,
            workshop_completion_pct: overallPct
          });
        }
      }
    } catch {
      // Fallback to localStorage lock
    } finally {
      setLearnerName(clean);
      setIsNameLocked(true);
      setLocking(false);
    }
  };

  const getVerifyUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return `${origin}/verify/${encodeURIComponent(credentialId)}?name=${encodeURIComponent(
      learnerName
    )}&track=Track+A+-+Campus+to+Corporate`;
  };

  const handleCopyVerifyLink = () => {
    navigator.clipboard.writeText(getVerifyUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToLinkedIn = () => {
    const now = new Date();
    const certName = 'Campus to Corporate Softskills Lab (3-Days Workshop & Certification)';
    const orgName = 'The Career Breweries';
    const verifyUrl = getVerifyUrl();

    const linkedInUrl =
      `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
      `&name=${encodeURIComponent(certName)}` +
      `&organizationName=${encodeURIComponent(orgName)}` +
      `&issueYear=${now.getFullYear()}` +
      `&issueMonth=${now.getMonth() + 1}` +
      `&certId=${encodeURIComponent(credentialId)}` +
      `&certUrl=${encodeURIComponent(verifyUrl)}`;

    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
  };

  if (!mounted) return null;

  // 1. Strict 100% Completion Gate
  if (overallPct < 100) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans relative">
        <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
        <main className="max-w-lg w-full glass-panel rounded-2xl p-8 border border-outline-variant text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-outline">
            <Lock size={30} />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-secondary">
            Strict 100% Mastery Requirement
          </span>
          <h1 className="text-2xl font-bold text-on-surface">
            Certificate Locked ({overallPct}% Complete)
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Official credentials from <strong>The Career Breweries</strong> are strictly issued only to learners who complete <strong>100% of the 3-Days Workshop &amp; Lab Modules</strong>.
          </p>
          <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <Link
            href="/dashboard"
            className="w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all"
          >
            Return to Dashboard &amp; Finish Remaining Modules
          </Link>
        </main>
      </div>
    );
  }

  // 2. Anti-Fraud One-Time Permanent Name Lock (For accounts created prior to sign-up name field)
  if (!isNameLocked) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans relative">
        <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
        <main className="max-w-lg w-full glass-panel rounded-2xl p-8 border-2 border-primary shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-3 text-primary">
            <ShieldCheck size={28} />
            <div>
              <span className="text-xs font-mono uppercase tracking-widest block">
                Anti-Forgery Credential Security
              </span>
              <h1 className="text-xl font-bold text-on-surface">
                Permanent Legal Name Verification
              </h1>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-on-surface leading-relaxed flex items-start gap-2.5">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Important: One-Time Permanent Lock.</strong> To prevent unauthorized sharing or resale of certificates, your certificate will be permanently bound to the legal name you enter below and your registered account{userEmail ? ` (${userEmail})` : ''}. <strong>Once issued, this name can never be edited or changed.</strong>
            </div>
          </div>

          <form onSubmit={handlePermanentLockName} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                Your Full Legal Name (As on Government / College ID)
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g., S D Sandarsh"
                className="w-full bg-input border border-outline-variant rounded-xl px-4 py-3 text-base font-bold text-on-surface focus:border-primary outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={locking || nameInput.trim().length < 3}
              className="w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {locking ? 'Locking Identity in Supabase...' : 'Lock Name Permanently & Issue Certificate'}
            </button>
          </form>

          <Link
            href="/dashboard"
            className="text-center text-xs text-on-surface-variant hover:text-primary"
          >
            ← Cancel &amp; Return to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=4A3528&bgcolor=FCF5ED&data=${encodeURIComponent(
    getVerifyUrl()
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans relative">
      {/* Print-only stylesheet so clicking Print/Save PDF exports ONLY the certificate */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #tcb-printable-certificate, #tcb-printable-certificate * {
            visibility: visible;
          }
          #tcb-printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 32px;
            box-shadow: none !important;
            background: #FCF5ED !important;
            color: #4A3528 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed top-4 right-4 z-50 no-print"><ThemeToggle /></div>

      <main className="w-full max-w-5xl mx-auto flex flex-col gap-6 my-4">
        {/* Top Action & Control Bar (Hidden when printing) */}
        <div className="no-print flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Learning Dashboard
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={14} />
              100% Workshop Completion Verified
            </span>
          </div>

          {/* Read-Only Locked Identity Bar + Export Actions */}
          <div className="glass-panel rounded-2xl p-5 border border-outline-variant flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 text-primary border border-primary/30">
                <Lock size={18} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-secondary block font-semibold">
                  Identity-Locked Credential (Non-Transferable)
                </span>
                <p className="text-sm font-bold text-on-surface">
                  Permanently Issued to: <span className="text-primary">{learnerName}</span>
                  {userEmail ? <span className="text-xs font-normal text-on-surface-variant ml-1.5">({userEmail})</span> : null}
                </p>
              </div>
            </div>

            {/* Action Buttons: LinkedIn (#3), Verify Link (#2), Print PDF */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleAddToLinkedIn}
                className="px-4 py-3 rounded-xl bg-[#0A66C2] text-white font-bold text-xs md:text-sm hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ExternalLink size={16} />
                Add to LinkedIn Profile
              </button>

              <button
                type="button"
                onClick={handleCopyVerifyLink}
                className="px-4 py-3 rounded-xl bg-surface-variant text-on-surface border border-outline-variant font-bold text-xs md:text-sm hover:bg-primary/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copiedLink ? 'Verification URL Copied!' : 'Copy Verify URL'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs md:text-sm hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer size={16} />
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>

        {/* OFFICIAL PRINTABLE CERTIFICATE CANVAS */}
        <div
          id="tcb-printable-certificate"
          className="w-full rounded-2xl bg-[#FCF5ED] text-[#4A3528] p-6 md:p-12 shadow-2xl border-4 border-[#885A3A] relative overflow-hidden"
        >
          {/* Decorative Inner Heritage Frame */}
          <div className="border-2 border-[#C48F65] rounded-xl p-6 md:p-10 relative flex flex-col items-center text-center">
            {/* Corner Accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#885A3A]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#885A3A]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#885A3A]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#885A3A]" />

            {/* Top Crest & Brand Header */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/tcb-logo.png"
                alt="The Career Breweries Crest"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-contain mb-3 border border-[#D9CDBF] shadow-sm"
              />
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#885A3A] font-bold">
                The Career Breweries • Softskills Lab
              </span>
              <h1 className="text-2xl md:text-4xl font-serif font-extrabold tracking-tight text-[#4A3528] mt-2">
                CERTIFICATE OF COMPLETION
              </h1>
              <div className="w-28 h-0.5 bg-[#885A3A] my-3" />
              <p className="text-xs md:text-sm uppercase tracking-widest text-[#725D50] font-semibold">
                3-Days Workshop &amp; Campus-to-Corporate Executive Lab
              </p>
            </div>

            {/* Recipient Section */}
            <p className="text-sm italic text-[#725D50] mb-2">
              This is to proudly certify that
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#885A3A] tracking-wide border-b-2 border-[#D9CDBF] pb-3 px-8 mb-5">
              {learnerName}
            </h2>
            <p className="text-xs md:text-sm text-[#4A3528] max-w-2xl leading-relaxed mb-6">
              has successfully completed <strong>100% of the Track A: Campus to Corporate Softskills Lab</strong> and demonstrated applied proficiency across all five core communication and interview frameworks:
            </p>

            {/* 5 Verified Frameworks Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mb-8">
              {[
                '1. P-P-F Personal Pitch',
                '2. Google X-Y-Z Resume Mastery',
                '3. P.R.E.P. GD Leadership',
                '4. B.L.U.F. Corporate Email',
                '5. S.T.A.R.+L Behavioral Method'
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3EBE1] text-[#4A3528] border border-[#C48F65]"
                >
                  ✓ {pill}
                </span>
              ))}
            </div>

            {/* Footer: Date + QR Code (#2) + Real Signature */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-end gap-6 pt-6 border-t border-[#D9CDBF] text-left">
              {/* Left: Credential Metadata */}
              <div className="flex flex-col gap-1 text-center md:text-left">
                <span className="text-[11px] uppercase tracking-wider text-[#725D50] font-mono">
                  Date of Issuance
                </span>
                <span className="text-sm font-bold text-[#4A3528]">{issueDate}</span>
                <span className="text-[11px] uppercase tracking-wider text-[#725D50] font-mono mt-2">
                  Credential ID
                </span>
                <span className="text-xs font-mono font-bold text-[#885A3A]">
                  {credentialId}
                </span>
                <Link
                  href={`/verify/${encodeURIComponent(credentialId)}?name=${encodeURIComponent(learnerName)}`}
                  className="text-[11px] text-[#885A3A] underline no-print mt-0.5"
                >
                  Verify Live Credential →
                </Link>
              </div>

              {/* Center: Scannable QR Code Verification */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-2 rounded-xl bg-white border border-[#D9CDBF] shadow-sm">
                  <img
                    src={qrSvgUrl}
                    alt="Credential Verification QR"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <span className="text-[10px] font-mono text-[#725D50] mt-1.5 uppercase tracking-wider">
                  Scan to Verify • 100% Score
                </span>
              </div>

              {/* Right: Official Handwritten Signature Image */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <img
                  src="/signature.jpeg"
                  alt="Signature of S D Sandarsh"
                  className="h-14 md:h-16 object-contain mix-blend-multiply -mb-1"
                />
                <div className="w-48 h-0.5 bg-[#885A3A] mb-1.5" />
                <span className="text-xs font-bold text-[#4A3528]">S D Sandarsh</span>
                <span className="text-[11px] text-[#725D50]">
                  Founder &amp; Lead Trainer, The Career Breweries
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
