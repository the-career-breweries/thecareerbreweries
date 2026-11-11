"use client";

import ThemeToggle from './ThemeToggle';
import React, { useEffect, useState } from 'react';
import {
  Lock,
  CreditCard,
  MessageSquare,
  Brain,
  ArrowRight,
  CheckCircle2,
  User,
  FileText,
  Users,
  Mail,
  Award,
  Sparkles,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { TRACK_A_MODULES } from '@/data/trackAModules';
import { TRACK_B_MODULES } from '@/data/trackBModules';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ICON_MAP = {
  MessageSquare,
  FileText,
  Users,
  Mail,
  Award,
  Brain,
  CreditCard,
  TrendingUp
};

export default function DashboardScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasProBundle, setHasProBundle] = useState(false);
  const [hasStudentBundle, setHasStudentBundle] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showDiagnosticBanner, setShowDiagnosticBanner] = useState(false);
  const [mindlerCode, setMindlerCode] = useState<string | null>(null);
  const [validUntil, setValidUntil] = useState<number | null>(null);
  const [nowTimer, setNowTimer] = useState(Date.now());
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpCodeInput, setTopUpCodeInput] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const code = localStorage.getItem('tcb_mindler_code');
      const vu = localStorage.getItem('tcb_valid_until');
      if (code) setMindlerCode(code);
      if (vu) setValidUntil(parseInt(vu, 10));
    }
    const timer = setInterval(() => setNowTimer(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const passRemaining = (() => {
    if (!validUntil) return null;
    const diff = validUntil - nowTimer;
    if (diff <= 0) return { text: 'Pass Expired', color: '#EF4444', isExpired: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return {
      text: days > 0 ? `${days}d ${hours}h left` : `${hours}h ${mins}m left`,
      color: days < 1 ? '#EF4444' : '#10B981',
      isExpired: false
    };
  })();

  const handleTopUpSubmit = async (codeToUse: string) => {
    if (!mindlerCode) return;
    setIsTopUpLoading(true);
    try {
      const res = await fetch('https://tcb-sentinel.vercel.app/api/topup-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: mindlerCode, passcode: codeToUse, days: 3 })
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Pass successfully topped up by +3 Days (+72 Hours)!');
        if (data.valid_until) {
          localStorage.setItem('tcb_valid_until', String(data.valid_until));
          setValidUntil(data.valid_until);
        }
        setTopUpModalOpen(false);
      } else {
        alert('❌ ' + (data.error || 'Failed to activate top up.'));
      }
    } catch {
      alert('Network error communicating with Sentinel.');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  useEffect(() => {
    let unlocked = false;

    if (typeof window !== 'undefined') {
      // 1. Check if returning from a successful Razorpay checkout
      const searchParams = new URLSearchParams(window.location.search);
      const rzpPaymentId = searchParams.get('razorpay_payment_id');
      const rzpStatus = searchParams.get('razorpay_payment_link_status');
      const bundleParam = searchParams.get('bundle');
      if (searchParams.get('diagnostic_done') === '1') {
        setShowDiagnosticBanner(true);
      }

      if (rzpPaymentId && (rzpStatus === 'paid' || !rzpStatus)) {
        const bundle = bundleParam === 'pro' ? 'pro' : 'student';
        localStorage.setItem('tcb_unlocked_bundle', bundle);
        localStorage.setItem(`tcb_payment_${bundle}`, rzpPaymentId);
        if (bundle === 'pro') {
          setHasProBundle(true);
          setHasStudentBundle(true);
        } else {
          setHasStudentBundle(true);
          setHasProBundle(false);
        }
        unlocked = true;

        // Clean query parameters from URL bar for clean UX
        window.history.replaceState({}, '', '/dashboard');
      } else {
        const localBundle = localStorage.getItem('tcb_unlocked_bundle');
        if (localBundle === 'pro') {
          setHasProBundle(true);
          setHasStudentBundle(true);
          unlocked = true;
        } else if (localBundle === 'student') {
          setHasStudentBundle(true);
          setHasProBundle(false);
          unlocked = true;
        }
      }

      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      setProgressMap(savedProgress);
    }

    const client = supabase;
    if (client) {
      client.auth.getUser().then(async ({ data }) => {
        if (data?.user) {
          setUserEmail(data.user.email || null);
          const meta = data.user.user_metadata || {};

          // Sync Razorpay payment to Supabase profile if returning with payment ID
          if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const rzpPaymentId = searchParams.get('razorpay_payment_id') || searchParams.get('payment_id');
            const bundleParam = searchParams.get('bundle');
            if (rzpPaymentId) {
              const updates =
                bundleParam === 'pro'
                  ? { has_pro_bundle: true, has_student_bundle: true }
                  : { has_student_bundle: true };

              await client.auth.updateUser({ data: updates });
              await client.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                payment_id: rzpPaymentId,
                ...updates
              });
            }
          }

          if (meta.has_pro_bundle) {
            setHasProBundle(true);
            setHasStudentBundle(true);
            unlocked = true;
          } else if (meta.has_student_bundle) {
            setHasStudentBundle(true);
            setHasProBundle(false);
            unlocked = true;
          } else if (data.user.email?.toLowerCase() === 'nayanachukki19@gmail.com') {
            // Verified paid customer from Razorpay receipt pay_TvF8MTqEwbsqf7
            setHasStudentBundle(true);
            setHasProBundle(false);
            unlocked = true;
            if (typeof window !== 'undefined') {
              localStorage.setItem('tcb_unlocked_bundle', 'student');
              localStorage.setItem('tcb_payment_student', 'pay_TvF8MTqEwbsqf7');
            }
            client.auth.updateUser({ data: { has_student_bundle: true } });
            client.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              payment_id: 'pay_TvF8MTqEwbsqf7',
              has_student_bundle: true
            });
          }

          // Check profiles table if user_metadata is not yet populated
          if (!unlocked && data.user.id) {
            try {
              const { data: profile } = await client
                .from('profiles')
                .select('has_pro_bundle, has_student_bundle')
                .eq('id', data.user.id)
                .maybeSingle();

              if (profile?.has_pro_bundle) {
                setHasProBundle(true);
                setHasStudentBundle(true);
                unlocked = true;
                if (typeof window !== 'undefined') {
                  localStorage.setItem('tcb_unlocked_bundle', 'pro');
                }
              } else if (profile?.has_student_bundle) {
                setHasStudentBundle(true);
                setHasProBundle(false);
                unlocked = true;
                if (typeof window !== 'undefined') {
                  localStorage.setItem('tcb_unlocked_bundle', 'student');
                }
              }
            } catch {
              // ignore
            }
          }

          // If unlocked via localStorage, sync to Supabase account
          if (unlocked && data.user.id) {
            const currentBundle = typeof window !== 'undefined' ? localStorage.getItem('tcb_unlocked_bundle') : null;
            if (currentBundle) {
              const updates =
                currentBundle === 'pro'
                  ? { has_pro_bundle: true, has_student_bundle: true }
                  : { has_student_bundle: true };
              client.auth.updateUser({ data: updates });
              client.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                ...updates
              });
            }
          }
        }

        setCheckingAccess(false);
      });
    } else {
      setCheckingAccess(false);
    }
  }, [router]);

  const completedCount = TRACK_A_MODULES.filter((m) => (progressMap[m.id] || 0) === 100).length;
  const overallTrackAPct = Math.round(
    TRACK_A_MODULES.reduce((acc, m) => acc + (progressMap[m.id] || 0), 0) / TRACK_A_MODULES.length
  );

  const completedTrackBCount = TRACK_B_MODULES.filter((m) => (progressMap[m.id] || 0) === 100).length;
  const overallTrackBPct = Math.round(
    TRACK_B_MODULES.reduce((acc, m) => acc + (progressMap[m.id] || 0), 0) / TRACK_B_MODULES.length
  );

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-on-surface-variant">Checking Workshop Access Pass...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {passRemaining && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold shadow-sm backdrop-blur-md"
            style={{
              background: passRemaining.isExpired ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              borderColor: passRemaining.color,
              color: passRemaining.color
            }}
          >
            <span>⏳ {passRemaining.text}</span>
            <button
              onClick={() => setTopUpModalOpen(true)}
              className="bg-[#C88323] hover:bg-[#b0721c] text-white rounded px-2 py-0.5 text-[10px] font-bold ml-1 cursor-pointer"
            >
              + Top Up
            </button>
          </div>
        )}
        <ThemeToggle />
      </div>

      <main className="flex-grow flex flex-col items-center px-4 md:px-6 w-full max-w-4xl mx-auto mt-8 md:mt-14 gap-10">
        {/* Diagnostic Completion Welcome Toast */}
        {showDiagnosticBanner && (
          <div className="w-full rounded-2xl p-5 bg-gradient-to-r from-emerald-500/15 via-primary/15 to-emerald-500/10 border-2 border-emerald-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                  Diagnostic Assessment Complete
                </span>
                <h3 className="text-base font-bold text-on-surface mt-0.5">
                  Welcome to Your Softskills Lab Trial!
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant">
                  We have mapped your diagnostic results to your personalized career roadmap. <strong>Module 1: The 3-Sentence Intro (P-P-F Formula)</strong> is unlocked below with 3 free interactive pitch builders!
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/module/intro-pitch"
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              Start Module 1 Now <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Top Summary Banner */}
        <section className="w-full glass-panel rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border border-primary/30">
                {hasProBundle
                  ? 'Student + Pro Bundles Active'
                  : hasStudentBundle
                  ? 'Student Bundle Active'
                  : 'Free Trial Active • Module 1 Unlocked'}
              </span>
              {userEmail && (
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <User size={12} className="text-primary" />
                  {userEmail}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Your Learning Path</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Interactive CELTA-structured frameworks, pressure drills, and live script builders.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 min-w-[220px]">
            <div className="w-full">
              <div className="flex items-center justify-between w-full text-xs font-mono mb-1">
                <span className="text-on-surface-variant">Track A ({completedCount}/5)</span>
                <span className="text-primary font-bold">{overallTrackAPct}%</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${overallTrackAPct}%` }}
                ></div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between w-full text-xs font-mono mb-1">
                <span className="text-on-surface-variant">Track B ({completedTrackBCount}/3)</span>
                <span className="text-secondary font-bold">{overallTrackBPct}%</span>
              </div>
              <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-300"
                  style={{ width: `${overallTrackBPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATE UNLOCK BANNER (Strict 100% Gate + LinkedIn & QR Credential) */}
        <section className="w-full">
          {overallTrackAPct === 100 ? (
            <div className="w-full rounded-2xl p-6 bg-gradient-to-r from-primary/20 via-secondary/15 to-primary/10 border-2 border-primary shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Award size={26} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                    100% Track A Mastery Unlocked
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface mt-0.5">
                    Your Verified TCB Certificate &amp; LinkedIn Credential is Ready!
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                    Includes your unique Credential ID, scannable QR verification link, and 1-click Add to LinkedIn Profile.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/certificate"
                className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
              >
                <Award size={18} />
                Claim Certificate &amp; Badge
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="w-full rounded-2xl p-5 bg-surface-container-high border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-85">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    Official TCB Certificate &amp; LinkedIn Badge (Locked — {overallTrackAPct}% Complete)
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Complete 100% of all 5 Track A modules to unlock your verified QR credential and qualify for official certification records.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-surface-variant text-on-surface-variant flex-shrink-0">
                {5 - completedCount} module(s) remaining
              </span>
            </div>
          )}
        </section>

        {/* STUDENT COMMUNICATION PLAYBOOK VAULT (Strict 100% Gate + 5 Anti-Piracy Shields) */}
        <section className="w-full">
          {overallTrackAPct === 100 ? (
            <div className="w-full rounded-2xl p-6 glass-panel border-2 border-secondary/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary/20 text-secondary border border-secondary/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                    Unlocked • Protected In-App Vault
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-on-surface mt-0.5">
                    The Student Communication Playbook (3 Interactive Pillars)
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                    Body Language &amp; Mirroring, Native Place Story Builder, 16-Word Audio Pronunciation Lab, and PREP / AREA Impromptu Gym.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/playbook"
                className="w-full md:w-auto text-center bg-secondary text-on-secondary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
              >
                Open Student Playbook
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="w-full rounded-2xl p-5 bg-surface-container-high border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-85">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    The Student Communication Playbook Vault (Locked — {overallTrackAPct}% Complete)
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Unlocks automatically after completing all 5 Track A modules. Includes Mirroring &amp; EQ Hooks, Hometown Story Builder, Audio Pronunciation Lab &amp; PREP/AREA Gym.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/playbook"
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary flex-shrink-0"
              >
                Preview Lock →
              </Link>
            </div>
          )}
        </section>

        {/* RECRUITER REACH OUTBOUND HUNTER SPOTLIGHT */}
        <section className="w-full">
          <div className="w-full rounded-2xl p-6 bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/5 border-2 border-primary/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xl">
                🎯
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  New TCB Engine • Outbound Job Acquisition
                </span>
                <h2 className="text-lg md:text-xl font-bold text-on-surface mt-0.5">
                  Recruiter Reach: Scout Hiring Teams &amp; Corporate Emails
                </h2>
                <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                  Stop clicking Easy Apply. Paste any target job link to discover hiring managers on LinkedIn, resolve corporate email protocols, and generate 300-char cold DMs with 3 free trials.
                </p>
              </div>
            </div>
            <a
              href="https://tcb-recruiter-reach.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
            >
              Launch Recruiter Reach ↗
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* TRACK A: THE STUDENT BUNDLE (5 MODULES) */}
        <section className="w-full flex flex-col gap-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary font-semibold">
                Track A • Campus to Corporate (Class XII, UG, PG)
              </span>
              <h2 className="text-xl font-bold text-on-surface mt-0.5">
                The Student Bundle Curriculum (Modules 1–5)
              </h2>
            </div>
            {hasStudentBundle ? (
              <span className="bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
                Unlocked &amp; Ready
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Module 1 Free Trial Active
                </span>
                <Link
                  href="/paywall?bundle=student"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-primary text-on-primary hover:opacity-90 flex items-center gap-1 shadow-sm"
                >
                  Unlock All 5 (₹499) <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            {TRACK_A_MODULES.map((mod) => {
              const IconComponent = ICON_MAP[mod.iconName] || MessageSquare;
              const pct = progressMap[mod.id] || 0;
              const isDone = pct === 100;
              const isStarted = pct > 0 && pct < 100;
              const isModuleUnlocked = hasStudentBundle || hasProBundle || mod.id === 'intro-pitch';

              return (
                <article
                  key={mod.id}
                  className={`module-card glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center w-full relative overflow-hidden group hover:border-primary/50 transition-all ${
                    !isModuleUnlocked ? 'opacity-85' : ''
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      isDone
                        ? 'bg-emerald-500'
                        : isStarted
                        ? 'bg-gradient-to-b from-secondary to-primary'
                        : isModuleUnlocked
                        ? 'bg-gradient-to-b from-primary to-primary-container'
                        : 'bg-outline-variant'
                    }`}
                  ></div>

                  <div className="h-14 w-14 rounded-xl bg-surface-variant/60 flex items-center justify-center border border-outline-variant flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    {isModuleUnlocked ? (
                      <IconComponent className="text-primary" size={26} />
                    ) : (
                      <Lock className="text-amber-500" size={24} />
                    )}
                  </div>

                  <div className="flex-grow flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                        Module {mod.number}
                      </span>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant/60">
                        <Sparkles size={10} className="inline mr-1 text-primary" />
                        {mod.frameworkShort}
                      </span>
                      {!isModuleUnlocked && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Lock size={10} /> Locked • Student Bundle
                        </span>
                      )}
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        • {mod.duration}
                      </span>
                    </div>

                    <h3 className="text-lg text-on-surface font-bold">{mod.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {mod.subtitle}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-2 w-36 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-secondary-container to-secondary'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span
                        className={`font-mono text-xs font-semibold ${
                          isDone ? 'text-emerald-400' : isStarted ? 'text-secondary' : 'text-on-surface-variant'
                        }`}
                      >
                        {pct}% Complete
                      </span>
                    </div>
                  </div>

                  {isModuleUnlocked ? (
                    <Link
                      href={`/dashboard/module/${mod.id}`}
                      className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      {isDone ? 'Review Lab' : isStarted ? 'Resume' : 'Start Module'}
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      href="/paywall?bundle=student"
                      className="w-full md:w-auto text-center bg-surface-variant hover:bg-surface-variant/80 text-on-surface font-bold py-3 px-6 rounded-xl border border-outline-variant hover:border-primary transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
                    >
                      <Lock size={15} className="text-amber-500" />
                      Unlock Module (₹499)
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* TRACK B: THE PROFESSIONAL BUNDLE (MODULES 6-8 + EXECUTIVE CRISIS PLAYBOOK) */}
        <section className="w-full flex flex-col gap-5 pt-6 border-t border-outline-variant/60">
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Track B • Executive Precision (Working Professionals &amp; Lateral Hires)
              </span>
              <h2 className="text-xl font-bold text-on-surface mt-0.5">
                The Professional Bundle Curriculum (Modules 6–8)
              </h2>
            </div>

            {hasProBundle ? (
              <span className="bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/30">
                Pro Track Active ({completedTrackBCount} of 3 Complete)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/15 text-amber-500 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                  <Lock size={12} />
                  Pro Bundle Exclusive
                </span>
                <Link
                  href="/paywall"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-primary text-on-primary hover:opacity-90 flex items-center gap-1 shadow-sm"
                >
                  Unlock Pro Track <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* TRACK B EXECUTIVE CRISIS & CASE PLAYBOOK BANNER */}
          {!hasProBundle ? (
            <div className="w-full rounded-2xl p-5 bg-surface-container-high/60 border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant flex-shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    The Professional Crisis &amp; Case Playbook Vault
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 uppercase font-semibold">
                      Locked • Pro Only
                    </span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Unlocks the 6 PM Friday ₹50Cr Crisis De-Escalator (Heart Rate BPM Meter) &amp; 5 Executive Case Simulators (including The Maggi Dilemma). Requires The Professional Bundle.
                  </p>
                </div>
              </div>
              <Link
                href="/paywall"
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:opacity-90 flex items-center gap-1.5 flex-shrink-0"
              >
                <Lock size={13} />
                Upgrade to Unlock
              </Link>
            </div>
          ) : overallTrackBPct === 100 ? (
            <div className="w-full rounded-2xl p-6 glass-panel border-2 border-primary shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                    100% Track B Unlocked • Executive Vault
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-on-surface mt-0.5">
                    The Professional Crisis &amp; Case Playbook (Live Simulators)
                  </h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-0.5">
                    Includes the 6 PM Friday ₹50Cr Crisis Call (with live Heart-Rate BPM Meter) &amp; 5 Unblur-the-Rubric Executive Case Simulators (including The Maggi Dilemma).
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/pro-playbook"
                className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
              >
                Open Executive Playbook
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="w-full rounded-2xl p-5 bg-surface-container-high border border-outline-variant/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-surface-variant flex items-center justify-center text-primary flex-shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    The Professional Crisis &amp; Case Playbook Vault ({overallTrackBPct}% Complete)
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Unlocks after completing Modules 6–8. Features the 6 PM Friday ₹50Cr Crisis De-Escalator (Heart Rate BPM Meter) &amp; 5 Unblur-the-Rubric Case Simulators.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/pro-playbook"
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary flex-shrink-0"
              >
                Preview Pro Playbook →
              </Link>
            </div>
          )}

          {/* Modules 6, 7, 8 Cards */}
          <div className="flex flex-col gap-4 w-full">
            {TRACK_B_MODULES.map((mod) => {
              const IconComponent = ICON_MAP[mod.iconName] || Brain;
              const pct = progressMap[mod.id] || 0;
              const isDone = pct === 100;
              const isStarted = pct > 0 && pct < 100;

              return (
                <article
                  key={mod.id}
                  className={`module-card glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center w-full relative overflow-hidden transition-all ${
                    !hasProBundle
                      ? 'border-dashed border-outline-variant/70 opacity-80'
                      : 'group hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      !hasProBundle
                        ? 'bg-zinc-600'
                        : isDone
                        ? 'bg-emerald-500'
                        : isStarted
                        ? 'bg-gradient-to-b from-secondary to-primary'
                        : 'bg-gradient-to-b from-primary to-primary-container'
                    }`}
                  ></div>

                  <div className="h-14 w-14 rounded-xl bg-surface-variant/60 flex items-center justify-center border border-outline-variant flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    {!hasProBundle ? (
                      <Lock className="text-on-surface-variant" size={24} />
                    ) : (
                      <IconComponent className="text-primary" size={26} />
                    )}
                  </div>

                  <div className="flex-grow flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        Module {mod.number} • Pro Track
                      </span>
                      {!hasProBundle ? (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <Lock size={10} /> Locked • Pro Only
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant/60">
                          <Sparkles size={10} className="inline mr-1 text-primary" />
                          {mod.frameworkShort}
                        </span>
                      )}
                      <span className="text-[11px] text-on-surface-variant font-mono">
                        • {mod.duration}
                      </span>
                    </div>

                    <h3 className="text-lg text-on-surface font-bold">{mod.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {mod.subtitle}
                    </p>

                    {hasProBundle && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 w-36 bg-surface-variant rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isDone
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-primary to-secondary'
                            }`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isDone ? 'text-emerald-400' : isStarted ? 'text-secondary' : 'text-on-surface-variant'
                          }`}
                        >
                          {pct}% Complete
                        </span>
                      </div>
                    )}
                  </div>

                  {!hasProBundle ? (
                    <Link
                      href="/paywall"
                      className="w-full md:w-auto text-center bg-surface-variant/80 hover:bg-surface-variant border border-outline-variant text-on-surface-variant hover:text-on-surface font-semibold py-3 px-5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 flex-shrink-0"
                    >
                      <Lock size={14} className="text-primary" />
                      Locked • Upgrade
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/module/${mod.id}`}
                      className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                    >
                      {isDone ? 'Review Lab' : isStarted ? 'Resume' : 'Start Module'}
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* 💳 User Top-Up Modal */}
      {topUpModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(7,24,44,0.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0F2D52', border: '2px solid #C88323', borderRadius: '20px', padding: '30px', maxWidth: '440px', width: '100%', color: 'white', boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '26px' }}>⏳</div>
              <div>
                <h3 style={{ fontSize: '19px', color: '#F8FAFC', margin: 0, fontWeight: 700 }}>Top Up Pass (+3 Days)</h3>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Extends active access by +72 hours for ₹299</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '20px' }}>
              Recharge your access window for +3 days. Maintains your 2 registered devices with single active session protection.
            </p>
            <a href={`https://wa.me/919743711584?text=Hi%20Coach%20Sandarsh!%20👋%20I%20would%20like%20to%20top%20up%20my%20Softskills%20Lab%20pass%20for%20%2B3%20days%20(₹299)%20(Code%20%23${mindlerCode||'public'}).`} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', background: '#16A34A', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}>
              💬 Request +3 Days on WhatsApp (₹299)
            </a>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Have an Authorization Code?</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Passcode (e.g. 7755)" value={topUpCodeInput} onChange={e => setTopUpCodeInput(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(200,131,35,0.4)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '13px', outline: 'none' }} />
                <button onClick={() => handleTopUpSubmit(topUpCodeInput.trim())} disabled={!topUpCodeInput.trim() || isTopUpLoading} style={{ background: '#C88323', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                  {isTopUpLoading ? '...' : 'Apply'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button onClick={() => setTopUpModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94A3B8', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
