"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/lib/supabase/client';
import { TRACK_B_MODULES } from '@/data/trackBModules';
import {
  FRIDAY_6PM_CRISIS_TURNS,
  EXECUTIVE_CASE_SIMULATIONS,
} from '@/data/proPlaybookData';
import {
  ArrowLeft,
  ShieldAlert,
  Lock,
  HeartPulse,
  CheckCircle2,
  XCircle,
  UserCheck,
  Briefcase,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export default function ProPlaybookScreen() {
  const [learnerName, setLearnerName] = useState('Verified TCB Executive');
  const [learnerEmail, setLearnerEmail] = useState('licensed-pro@tcb.edu');
  const [credentialId, setCredentialId] = useState('TCB-PRO-VAULT');
  const [completedTrackBCount, setCompletedTrackBCount] = useState(0);
  const [trainerPreviewUnlock, setTrainerPreviewUnlock] = useState(false);

  // Anti-piracy state
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  // Active Mode: 'friday-crisis' | 'rubric-cases'
  const [activeTab, setActiveTab] = useState<'friday-crisis' | 'rubric-cases'>('friday-crisis');

  // Mode 1: Friday 6 PM Crisis Call State (Heart Rate BPM Meter)
  const [crisisTurnIdx, setCrisisTurnIdx] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(215);
  const [crisisChoices, setCrisisChoices] = useState<Record<number, string>>({});

  // Mode 2: Unblur-the-Rubric Case Simulators
  const [selectedCaseId, setSelectedCaseId] = useState(EXECUTIVE_CASE_SIMULATIONS[0].id);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      const doneB = TRACK_B_MODULES.filter((m) => (savedProgress[m.id] || 0) === 100).length;
      setCompletedTrackBCount(doneB);

      const savedName = localStorage.getItem('tcb_locked_learner_name') || localStorage.getItem('tcb_learner_name');
      if (savedName) setLearnerName(savedName);
      const savedCid = localStorage.getItem('tcb_credential_id');
      if (savedCid) setCredentialId(savedCid);
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          if (data.user.email) setLearnerEmail(data.user.email);
          const meta = data.user.user_metadata || {};
          if (meta.full_name) setLearnerName(meta.full_name);
          const uidClean = data.user.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
          setCredentialId(`TCB-PRO-${uidClean.slice(0, 4)}-${uidClean.slice(4, 8)}`);
        }
      });
    }
  }, []);

  useEffect(() => {
    const handleBlur = () => setIsWindowBlurred(true);
    const handleFocus = () => setIsWindowBlurred(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        triggerSecurityAlert('Copying, saving, or printing Executive Playbook IP is disabled.');
      }
      if (e.key === 'PrintScreen') {
        setIsWindowBlurred(true);
        triggerSecurityAlert('Screenshot blocked. Watermarked with your Credential ID.');
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerSecurityAlert = (msg: string) => {
    setSecurityToast(msg);
    setTimeout(() => setSecurityToast(null), 3500);
  };

  const isUnlocked = completedTrackBCount >= 3 || trainerPreviewUnlock;
  const watermarkStamp = `PRO LICENSE: ${learnerName.toUpperCase()} • ${learnerEmail} • ${credentialId}`;

  const activeCase =
    EXECUTIVE_CASE_SIMULATIONS.find((c) => c.id === selectedCaseId) || EXECUTIVE_CASE_SIMULATIONS[0];

  // Calculate live score (0/10 -> 10/10) and unblurred badges for activeCase
  const stepResults = activeCase.steps.map((st) => {
    const chosenId = caseAnswers[`${activeCase.id}-${st.stepNumber}`];
    const chosenOpt = st.options.find((o) => o.id === chosenId);
    return {
      answered: Boolean(chosenOpt),
      isOptimal: Boolean(chosenOpt?.isOptimal),
      buzzerLabel: chosenOpt?.buzzerLabel,
      chosenOpt
    };
  });

  const liveScore = stepResults.reduce((acc, r) => acc + (r.isOptimal ? 2.5 : 0), 0);
  const allStepsAnswered = stepResults.every((r) => r.answered);

  return (
    <div
      onCopy={(e) => {
        e.preventDefault();
        triggerSecurityAlert('Direct copying is disabled inside the Executive Playbook Vault.');
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerSecurityAlert('Right-click is disabled to protect TCB Playbook intellectual property.');
      }}
      className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans relative select-none overflow-x-hidden"
    >
      <style>{`
        @media print {
          .no-print-vault { display: none !important; }
          .print-piracy-warning { display: flex !important; }
        }
      `}</style>

      <div className="print-piracy-warning hidden fixed inset-0 bg-white text-black p-12 flex-col items-center justify-center text-center z-[999]">
        <h1 className="text-2xl font-bold mb-4">🔒 PROTECTED EXECUTIVE PLAYBOOK — THE CAREER BREWERIES</h1>
        <p className="font-mono text-lg font-bold border p-4 my-4">
          Licensed to: {learnerName} ({learnerEmail}) • ID: {credentialId}
        </p>
      </div>

      <div className="no-print-vault w-full max-w-5xl flex flex-col gap-6 relative">
        {/* Top Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              <UserCheck size={12} /> Watermarked to: {learnerName} ({credentialId})
            </span>
            <ThemeToggle />
          </div>
        </div>

        {securityToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-red-950/95 border border-red-500/60 text-red-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium">
            <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
            <span>{securityToast}</span>
          </div>
        )}

        {isWindowBlurred && isUnlocked && (
          <div
            onClick={() => setIsWindowBlurred(false)}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-background/80 flex flex-col items-center justify-center p-6 text-center cursor-pointer"
          >
            <div className="glass-panel p-8 rounded-2xl border-2 border-primary max-w-md flex flex-col items-center gap-3 shadow-2xl">
              <Lock size={32} className="text-primary" />
              <h3 className="text-lg font-bold text-on-surface">Anti-Capture Shield Active</h3>
              <p className="text-xs text-on-surface-variant">
                Click anywhere inside the window to resume your Executive Crisis Simulator.
              </p>
            </div>
          </div>
        )}

        {!isUnlocked ? (
          <div className="w-full glass-panel rounded-2xl p-8 md:p-12 border-2 border-outline-variant flex flex-col items-center text-center gap-5 my-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Lock size={30} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
              Track B Executive Vault • Locked ({completedTrackBCount} of 3 Pro Modules Completed)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface max-w-xl">
              The Professional Crisis &amp; Case Playbook Unlocks After Completing Track B (Modules 6–8)
            </h1>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Complete Modules 6, 7, and 8 to unlock the interactive 6 PM Friday ₹50Cr Crisis De-Escalator (with live Heart-Rate BPM meter) and the 5 Unblur-the-Rubric Executive Case Simulators (including The Maggi Dilemma).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all"
              >
                Continue Track B Modules ({3 - completedTrackBCount} left)
              </Link>
              <button
                onClick={() => setTrainerPreviewUnlock(true)}
                className="px-4 py-3 rounded-xl border border-outline-variant text-xs font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              >
                Trainer Preview: Unlock Pro Playbook Now
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Hero */}
            <header className="w-full glass-panel rounded-2xl p-6 md:p-8 border border-primary/40 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-col justify-around opacity-[0.045] -rotate-6 select-none overflow-hidden"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <p key={i} className="text-xs font-mono font-bold whitespace-nowrap tracking-widest">
                    {watermarkStamp} &nbsp; • &nbsp; {watermarkStamp}
                  </p>
                ))}
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                      Professional Bundle Edition
                    </span>
                    <span className="text-xs font-mono text-secondary font-semibold">
                      • Executive Precision &amp; Case Simulator Vault
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                    The Executive Crisis &amp; Case Communication Playbook
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
                    Practice de-escalating high-pressure leadership calls and unblurring 10/10 Strong-Hire consulting &amp; operations rubrics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('friday-crisis')}
                    className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      activeTab === 'friday-crisis'
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface-container border-outline-variant text-on-surface'
                    }`}
                  >
                    <HeartPulse size={16} /> 1. Friday 6 PM Crisis Call (BPM Meter)
                  </button>
                  <button
                    onClick={() => setActiveTab('rubric-cases')}
                    className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      activeTab === 'rubric-cases'
                        ? 'bg-primary text-on-primary border-primary shadow-md'
                        : 'bg-surface-container border-outline-variant text-on-surface'
                    }`}
                  >
                    <Briefcase size={16} /> 2. Unblur-the-Rubric Cases (5 Cases)
                  </button>
                </div>
              </div>
            </header>

            {/* ==================== TAB 1: FRIDAY 6 PM TOXIC BOSS CRISIS SIMULATOR ==================== */}
            {activeTab === 'friday-crisis' && (
              <section className="glass-panel rounded-2xl p-6 md:p-8 border border-primary/40 flex flex-col gap-6 relative overflow-hidden">
                {/* Top Hook Banner + Live Heart Rate BPM Meter */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-black text-white border border-yellow-500/40">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                      POV: YOUR BOSS CALLS YOU AT 6:00 PM ON FRIDAY EVENING
                    </span>
                    <h2 className="text-lg font-bold mt-0.5">
                      The ₹50 Crore Lipstick Launch Postponement Crisis
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2.5 rounded-xl border border-zinc-700">
                    <HeartPulse
                      size={22}
                      className={
                        currentBpm >= 180
                          ? 'text-red-500 animate-ping'
                          : currentBpm >= 130
                          ? 'text-amber-400 animate-pulse'
                          : 'text-emerald-400'
                      }
                    />
                    <div>
                      <p className="text-[10px] font-mono uppercase text-zinc-400">Room Heart Rate</p>
                      <p className="text-base font-mono font-bold">
                        {currentBpm} <span className="text-red-500">bpm</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Turn Stepper */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {FRIDAY_6PM_CRISIS_TURNS.map((t, idx) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCrisisTurnIdx(idx);
                          setCurrentBpm(t.bossPanicBpm);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                          crisisTurnIdx === idx
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        Call Turn {t.id} of 3
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setCrisisTurnIdx(0);
                      setCurrentBpm(215);
                      setCrisisChoices({});
                    }}
                    className="text-xs font-mono text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
                  >
                    <RotateCcw size={13} /> Reset Call
                  </button>
                </div>

                {/* Active Call Turn */}
                {(() => {
                  const turn = FRIDAY_6PM_CRISIS_TURNS[crisisTurnIdx];
                  const chosenId = crisisChoices[turn.id];
                  const chosenOpt = turn.options.find((o) => o.id === chosenId);

                  return (
                    <div className="flex flex-col gap-5">
                      <div className="p-5 rounded-xl bg-surface-container-high border-l-4 border-red-500">
                        <p className="text-xs font-mono uppercase text-red-400 font-bold mb-1">
                          Incoming Audio — Panicking Boss:
                        </p>
                        <p className="text-sm md:text-base font-medium text-on-surface leading-relaxed">
                          {turn.bossLine}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {turn.options.map((opt) => {
                          const isSelected = chosenId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                setCrisisChoices({ ...crisisChoices, [turn.id]: opt.id });
                                setCurrentBpm(opt.resultingBpm);
                              }}
                              className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                                isSelected
                                  ? opt.isOptimal
                                    ? 'bg-emerald-500/10 border-2 border-emerald-500'
                                    : 'bg-red-500/10 border-2 border-red-500'
                                  : 'bg-surface-container border-outline-variant hover:border-primary'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                                  {opt.label}
                                </span>
                                <p className="text-xs md:text-sm text-on-surface mt-2 leading-relaxed font-serif">
                                  {opt.employeeResponse}
                                </p>
                              </div>
                              <span className="text-[11px] font-mono text-on-surface-variant">
                                Click to speak this response →
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {chosenOpt && (
                        <div
                          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            chosenOpt.isOptimal
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-on-surface'
                              : 'bg-red-500/15 border-red-500/40 text-on-surface'
                          }`}
                        >
                          <p className="text-xs md:text-sm font-medium">{chosenOpt.coachNote}</p>
                          {chosenOpt.isOptimal && crisisTurnIdx < FRIDAY_6PM_CRISIS_TURNS.length - 1 && (
                            <button
                              onClick={() => setCrisisTurnIdx(crisisTurnIdx + 1)}
                              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold flex-shrink-0"
                            >
                              Next Turn →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </section>
            )}

            {/* ==================== TAB 2: UNBLUR-THE-RUBRIC CASE SIMULATORS ==================== */}
            {activeTab === 'rubric-cases' && (
              <section className="flex flex-col gap-6">
                {/* Case Selector Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {EXECUTIVE_CASE_SIMULATIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedCaseId === c.id
                          ? 'bg-primary text-on-primary border-primary shadow-md'
                          : 'glass-panel border-outline-variant text-on-surface hover:border-primary/50'
                      }`}
                    >
                      <p className="text-xs font-bold line-clamp-2">{c.title}</p>
                    </button>
                  ))}
                </div>

                {/* Active Case Board */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-primary/40 flex flex-col gap-6 relative overflow-hidden">
                  {/* Top Black Hook Bar + 4 Unblurring Rubric Badges */}
                  <div className="p-4 rounded-xl bg-black text-white flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider">
                        {activeCase.hookBanner}
                      </span>
                      <span className="text-xs font-mono text-zinc-300">
                        Licensed ID: {credentialId}
                      </span>
                    </div>

                    {/* 4 Progressive Unblurring Rubric Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      {activeCase.rubricBadges.map((badge, idx) => {
                        const res = stepResults[idx];
                        return (
                          <div
                            key={badge}
                            className={`p-2.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                              !res.answered
                                ? 'bg-zinc-900 border-zinc-700 text-zinc-400 blur-[3px] select-none'
                                : res.isOptimal
                                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                                : 'bg-red-950/90 border-red-500 text-red-300'
                            }`}
                          >
                            {res.answered ? (
                              res.isOptimal ? (
                                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                              ) : (
                                <XCircle size={14} className="text-red-400 flex-shrink-0" />
                              )
                            ) : null}
                            <span className="truncate">
                              {res.answered && !res.isOptimal && res.buzzerLabel
                                ? res.buzzerLabel
                                : badge}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role Context */}
                  <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant text-xs md:text-sm text-on-surface">
                    <strong className="text-primary">Case Brief: </strong>
                    {activeCase.roleContext}
                  </div>

                  {/* 4 Interactive Case Turns */}
                  <div className="space-y-5">
                    {activeCase.steps.map((st, idx) => {
                      const ansKey = `${activeCase.id}-${st.stepNumber}`;
                      const chosenId = caseAnswers[ansKey];
                      const chosenOpt = st.options.find((o) => o.id === chosenId);

                      return (
                        <div
                          key={st.stepNumber}
                          className="p-5 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-3"
                        >
                          <p className="text-xs font-mono uppercase text-secondary font-bold">
                            Turn {st.stepNumber} of 4 • Testing: { resStepLabel(stepResults[idx], st.rubricBadge) }
                          </p>
                          <p className="text-sm font-bold text-on-surface">{st.interviewerPrompt}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                            {st.options.map((opt) => {
                              const isSelected = chosenId === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() =>
                                    setCaseAnswers({ ...caseAnswers, [ansKey]: opt.id })
                                  }
                                  className={`p-4 rounded-xl border text-left text-xs md:text-sm transition-all ${
                                    isSelected
                                      ? opt.isOptimal
                                        ? 'bg-emerald-500/15 border-2 border-emerald-500 text-on-surface font-medium'
                                        : 'bg-red-500/15 border-2 border-red-500 text-on-surface font-medium'
                                      : 'bg-surface-container-high border-outline-variant text-on-surface hover:border-primary'
                                  }`}
                                >
                                  {opt.candidateLine}
                                </button>
                              );
                            })}
                          </div>

                          {chosenOpt && (
                            <p
                              className={`text-xs font-mono p-3 rounded-lg ${
                                chosenOpt.isOptimal
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-red-500/10 text-red-400'
                              }`}
                            >
                              {chosenOpt.feedback}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Black Scoreboard Bar (Final Score: X/10 -> Verdict) */}
                  <div className="p-5 rounded-xl bg-black text-white border border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Award size={24} className="text-yellow-400" />
                      <div>
                        <p className="text-xs font-mono uppercase text-zinc-400">
                          Live Interview Scoreboard
                        </p>
                        <p className="text-lg font-mono font-bold">
                          Final Score : <span className="text-yellow-400">{liveScore}/10</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <p className="text-sm font-mono font-bold">
                        {!allStepsAnswered
                          ? 'Answer all 4 turns to reveal Final Verdict'
                          : liveScore === 10
                          ? 'Final Verdict : ✅ STRONG HIRE'
                          : liveScore >= 7.5
                          ? 'Final Verdict : ✅ LEAN HIRE'
                          : 'Final Verdict : ❌ NO HIRE (Retry turns above)'}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">{activeCase.takeaway}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function resStepLabel(res: { answered: boolean }, badge: string) {
  return res.answered ? badge : '🔒 Blurred Rubric Skill (Answer to Unblur)';
}
