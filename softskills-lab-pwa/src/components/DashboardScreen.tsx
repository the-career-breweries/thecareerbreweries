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

  useEffect(() => {
    let unlocked = false;

    if (typeof window !== 'undefined') {
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

      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      setProgressMap(savedProgress);
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUserEmail(data.user.email || null);
          const meta = data.user.user_metadata || {};
          if (meta.has_pro_bundle) {
            setHasProBundle(true);
            setHasStudentBundle(true);
            unlocked = true;
          } else if (meta.has_student_bundle) {
            setHasStudentBundle(true);
            unlocked = true;
          }
        }

        if (!unlocked) {
          router.replace('/paywall');
        } else {
          setCheckingAccess(false);
        }
      });
    } else {
      if (!unlocked) {
        router.replace('/paywall');
      } else {
        setCheckingAccess(false);
      }
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
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

      <main className="flex-grow flex flex-col items-center px-4 md:px-6 w-full max-w-4xl mx-auto mt-8 md:mt-14 gap-10">
        {/* Top Summary Banner */}
        <section className="w-full glass-panel rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border border-primary/30">
                {hasProBundle
                  ? 'Student + Pro Bundles Active'
                  : hasStudentBundle
                  ? 'Student Bundle Active'
                  : '3-Days Workshop & Lab'}
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
                    Complete 100% of all 5 Track A modules to unlock your verified QR credential and qualify for 3-Days Workshop completion emails.
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
            <span className="bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
              Unlocked &amp; Ready
            </span>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {TRACK_A_MODULES.map((mod) => {
              const IconComponent = ICON_MAP[mod.iconName] || MessageSquare;
              const pct = progressMap[mod.id] || 0;
              const isDone = pct === 100;
              const isStarted = pct > 0 && pct < 100;

              return (
                <article
                  key={mod.id}
                  className="module-card glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center w-full relative overflow-hidden group hover:border-primary/50 transition-all"
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      isDone
                        ? 'bg-emerald-500'
                        : isStarted
                        ? 'bg-gradient-to-b from-secondary to-primary'
                        : 'bg-gradient-to-b from-primary to-primary-container'
                    }`}
                  ></div>

                  <div className="h-14 w-14 rounded-xl bg-surface-variant/60 flex items-center justify-center border border-outline-variant flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    <IconComponent className="text-primary" size={26} />
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

                  <Link
                    href={`/dashboard/module/${mod.id}`}
                    className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    {isDone ? 'Review Lab' : isStarted ? 'Resume' : 'Start Module'}
                    <ArrowRight size={16} />
                  </Link>
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
              <button
                onClick={() => {
                  setHasProBundle(true);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('tcb_unlocked_bundle', 'pro');
                  }
                }}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-primary text-on-primary hover:opacity-90 flex items-center gap-1"
              >
                Unlock Pro Track Preview <ArrowRight size={12} />
              </button>
            )}
          </div>

          {/* TRACK B EXECUTIVE CRISIS & CASE PLAYBOOK BANNER */}
          {overallTrackBPct === 100 ? (
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
                  className="module-card glass-panel rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center w-full relative overflow-hidden group hover:border-primary/50 transition-all"
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${
                      isDone
                        ? 'bg-emerald-500'
                        : isStarted
                        ? 'bg-gradient-to-b from-secondary to-primary'
                        : 'bg-gradient-to-b from-primary to-primary-container'
                    }`}
                  ></div>

                  <div className="h-14 w-14 rounded-xl bg-surface-variant/60 flex items-center justify-center border border-outline-variant flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                    <IconComponent className="text-primary" size={26} />
                  </div>

                  <div className="flex-grow flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        Module {mod.number} • Pro Track
                      </span>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant border border-outline-variant/60">
                        <Sparkles size={10} className="inline mr-1 text-primary" />
                        {mod.frameworkShort}
                      </span>
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
                  </div>

                  <Link
                    href={`/dashboard/module/${mod.id}`}
                    className="w-full md:w-auto text-center bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    {isDone ? 'Review Lab' : isStarted ? 'Resume' : 'Start Module'}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
