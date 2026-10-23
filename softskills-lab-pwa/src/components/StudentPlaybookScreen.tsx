"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/lib/supabase/client';
import { TRACK_A_MODULES } from '@/data/trackAModules';
import {
  PILLAR_1_NON_VERBAL,
  HOMETOWN_PRIDE_EXAMPLES,
  PILLAR_2_CONVERSATION_FLOW,
  PILLAR_2_TRAP_DECODERS,
  PILLAR_3_PRONUNCIATION_WORDS,
  VOCAL_EXERCISES,
  SPEAKING_FRAMEWORKS,
  IMPROMPTU_TOPICS,
} from '@/data/studentPlaybookData';
import {
  ArrowLeft,
  ShieldAlert,
  Lock,
  Volume2,
  Eye,
  Compass,
  Mic,
  CheckCircle2,
  RefreshCw,
  Timer,
  UserCheck,
  Play,
  Pause
} from 'lucide-react';

export default function StudentPlaybookScreen() {
  const [learnerName, setLearnerName] = useState('Verified TCB Learner');
  const [learnerEmail, setLearnerEmail] = useState('licensed-learner@tcb.edu');
  const [credentialId, setCredentialId] = useState('TCB-SSL-VAULT');
  const [completedCount, setCompletedCount] = useState(0);
  const [trainerPreviewUnlock, setTrainerPreviewUnlock] = useState(false);

  // Anti-piracy state
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [isModifierPressed, setIsModifierPressed] = useState(false);
  const [holdingScriptId, setHoldingScriptId] = useState<string | null>(null);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  // Active Pillar Tab: 1 | 2 | 3
  const [activePillar, setActivePillar] = useState<1 | 2 | 3>(1);

  // Single-Card Focus Mode (Anti-Screenshot: only 1 card unblurred at a time)
  const [focusedNonVerbalId, setFocusedNonVerbalId] = useState<string>(PILLAR_1_NON_VERBAL[0].id);
  const [focusedTrapId, setFocusedTrapId] = useState<string>(PILLAR_2_TRAP_DECODERS[0].id);
  const [focusedWordIdx, setFocusedWordIdx] = useState<number>(0);

  // Pillar 2: Interactive Native Place Pitch Builder
  const [cityInput, setCityInput] = useState('Nagpur');
  const [crownInput, setCrownInput] = useState('the Tiger Capital of India and the heart of central India');
  const [cultureInput, setCultureInput] = useState('world-famous fiery Saoji cuisine, iconic Poha, the finest oranges, and a massive coffee culture');
  const [peopleInput, setPeopleInput] = useState('if two people from my city meet anywhere in the world, they become instant family—and that fierce loyalty and warmth is what I bring to every team I join');

  // Pillar 3: Box Breathing Interactive Timer
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathTick, setBreathTick] = useState(0);

  // Pillar 3: PREP / AREA Impromptu Spinner & Builder
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<'prep' | 'area'>('prep');
  const [impromptuTopic, setImpromptuTopic] = useState(IMPROMPTU_TOPICS[0]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [builderInputs, setBuilderInputs] = useState<Record<string, string>>({
    step0: '',
    step1: '',
    step2: '',
    step3: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      const done = TRACK_A_MODULES.filter((m) => (savedProgress[m.id] || 0) === 100).length;
      setCompletedCount(done);

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
          setCredentialId(`TCB-SSL-${uidClean.slice(0, 4)}-${uidClean.slice(4, 8)}`);
        }
      });
    }
  }, []);

  // Anti-Piracy Window Blur & Keyboard/Copy/Snipping-Tool Blocker
  useEffect(() => {
    const handleBlur = () => {
      setIsWindowBlurred(true);
      setHoldingScriptId(null);
    };
    const handleFocus = () => {
      setIsWindowBlurred(false);
      setIsModifierPressed(false);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
        setHoldingScriptId(null);
      }
    };
    const handleMouseLeave = () => {
      setHoldingScriptId(null);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      // Any modifier key used in screenshot combos (Win+Shift+S, Cmd+Shift+4, Alt+PrtScn, Ctrl+Shift+S) immediately blurs scripts
      if (e.metaKey || e.shiftKey || e.altKey || e.ctrlKey || ['Meta', 'Shift', 'Alt', 'Control'].includes(e.key)) {
        setIsModifierPressed(true);
        setHoldingScriptId(null);
      }
      if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        triggerSecurityAlert('Copying, saving, or printing Playbook intellectual property is disabled.');
      }
      if (e.key === 'PrintScreen') {
        setIsWindowBlurred(true);
        setHoldingScriptId(null);
        triggerSecurityAlert('Screenshot protection triggered. Content is watermarked with your account ID.');
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.shiftKey && !e.altKey && !e.ctrlKey) {
        setIsModifierPressed(false);
      }
      if (e.key === 'PrintScreen') {
        setIsWindowBlurred(true);
        triggerSecurityAlert('Screenshots are prohibited. Your Credential ID is logged.');
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Box Breathing 16-second loop
  useEffect(() => {
    if (!breathRunning) return;
    const interval = setInterval(() => {
      setBreathTick((t) => (t + 1) % 16);
    }, 1000);
    return () => clearInterval(interval);
  }, [breathRunning]);

  // Impromptu 60s countdown
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const triggerSecurityAlert = (msg: string) => {
    setSecurityToast(msg);
    setTimeout(() => setSecurityToast(null), 3500);
  };

  const speakWord = (text: string, rate = 0.92) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } else {
      triggerSecurityAlert('Browser speech synthesis is not supported on this device.');
    }
  };

  const loadHometownPreset = (idx: number) => {
    const preset = HOMETOWN_PRIDE_EXAMPLES[idx];
    if (!preset) return;
    setCityInput(preset.city);
    setCrownInput(preset.crownIdentity);
    setCultureInput(preset.sensoryCulture);
    setPeopleInput(preset.peopleBridge);
  };

  const spinRandomTopic = () => {
    const next = IMPROMPTU_TOPICS[Math.floor(Math.random() * IMPROMPTU_TOPICS.length)];
    setImpromptuTopic(next);
    setTimerSeconds(60);
    setTimerRunning(false);
  };

  const isUnlocked = completedCount >= 5 || trainerPreviewUnlock;
  const activeFramework = SPEAKING_FRAMEWORKS.find((f) => f.id === selectedFrameworkId) || SPEAKING_FRAMEWORKS[0];
  const breathPhase =
    breathTick < 4
      ? 'INHALE DEEPLY (Belly expands)'
      : breathTick < 8
      ? 'HOLD BREATH (Relax shoulders)'
      : breathTick < 12
      ? 'EXHALE SLOWLY (Drop vocal pitch)'
      : 'HOLD EMPTY (Calm stillness)';

  const watermarkStamp = `LICENSED TO: ${learnerName.toUpperCase()} • ${learnerEmail} • ${credentialId}`;

  return (
    <div
      onCopy={(e) => {
        e.preventDefault();
        triggerSecurityAlert('Direct copying is disabled inside the Protected Playbook Vault.');
      }}
      onCut={(e) => e.preventDefault()}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerSecurityAlert('Right-click is disabled to protect TCB Playbook intellectual property.');
      }}
      className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans relative select-none overflow-x-hidden"
    >
      {/* Print-to-PDF Blocker (@media print) */}
      <style>{`
        @media print {
          .no-print-vault { display: none !important; }
          .print-piracy-warning { display: flex !important; }
        }
      `}</style>

      {/* Only visible if learner attempts Ctrl+P or Save as PDF */}
      <div className="print-piracy-warning hidden fixed inset-0 bg-white text-black p-12 flex-col items-center justify-center text-center z-[999]">
        <h1 className="text-2xl font-bold mb-4">🔒 PROTECTED INTELLECTUAL PROPERTY — THE CAREER BREWERIES</h1>
        <p className="text-base mb-2">
          This Communication Playbook is licensed exclusively for in-app use by:
        </p>
        <p className="font-mono text-lg font-bold border p-4 my-4">
          {learnerName} ({learnerEmail}) • Credential ID: {credentialId}
        </p>
        <p className="text-sm text-gray-700 max-w-md">
          Printing, exporting to PDF, or distributing this Playbook outside the Softskills Lab application is strictly prohibited.
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

        {/* Security Toast */}
        {securityToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-red-950/95 border border-red-500/60 text-red-100 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-bounce">
            <ShieldAlert size={16} className="text-red-400 flex-shrink-0" />
            <span>{securityToast}</span>
          </div>
        )}

        {/* Window-Switch / Snipping Tool Auto-Blur Shield */}
        {isWindowBlurred && isUnlocked && (
          <div
            onClick={() => setIsWindowBlurred(false)}
            className="fixed inset-0 z-40 backdrop-blur-xl bg-background/80 flex flex-col items-center justify-center p-6 text-center cursor-pointer"
          >
            <div className="glass-panel p-8 rounded-2xl border-2 border-primary max-w-md flex flex-col items-center gap-3 shadow-2xl">
              <Lock size={32} className="text-primary" />
              <h3 className="text-lg font-bold text-on-surface">
                Anti-Capture Shield Active
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Playbook content automatically blurs when the window loses focus or a screen-snipping tool is opened.
              </p>
              <span className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold">
                Click Anywhere Inside App to Resume
              </span>
            </div>
          </div>
        )}

        {/* STRICT 100% COMPLETION GATE */}
        {!isUnlocked ? (
          <div className="w-full glass-panel rounded-2xl p-8 md:p-12 border-2 border-outline-variant flex flex-col items-center text-center gap-5 my-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Lock size={30} />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
              Mastery Vault • Locked ({completedCount} of 5 Track A Modules Completed)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface max-w-xl">
              The Student Communication Playbook Unlocks at 100% Track A Completion
            </h1>
            <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Complete all 5 Campus-to-Corporate modules to unlock your interactive Vault featuring Non-Verbal Mirroring &amp; EQ Hooks, the Native Place Story Builder, the 16-Word Audio Pronunciation Lab, and the 60-Second PREP/AREA Impromptu Gym.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all"
              >
                Continue Track A Modules ({5 - completedCount} left)
              </Link>
              <button
                onClick={() => setTrainerPreviewUnlock(true)}
                className="px-4 py-3 rounded-xl border border-outline-variant text-xs font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              >
                Trainer Preview: Unlock Now
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Hero Card with Forensic Watermark */}
            <header className="w-full glass-panel rounded-2xl p-6 md:p-8 border border-primary/40 relative overflow-hidden">
              {/* Diagonal Watermark Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-col justify-around opacity-[0.045] dark:opacity-[0.055] -rotate-6 select-none overflow-hidden"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <p key={i} className="text-xs font-mono font-bold whitespace-nowrap tracking-widest">
                    {watermarkStamp} &nbsp; • &nbsp; {watermarkStamp}
                  </p>
                ))}
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                      Student Bundle Edition
                    </span>
                    <span className="text-xs font-mono text-secondary font-semibold">
                      • 3-Days Workshop &amp; Lab Companion Vault
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-on-surface">
                    The Campus-to-Corporate Communication Playbook
                  </h1>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-2xl">
                    Interactive non-verbal rapport hooks, hometown storytelling, live audio pronunciation drills, and spontaneous speaking frameworks.
                  </p>
                </div>

                <div className="bg-surface-container-high border border-outline-variant rounded-xl p-3.5 text-left md:text-right flex-shrink-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                    Anti-Piracy License Bound To
                  </p>
                  <p className="text-xs font-bold text-primary mt-0.5">{learnerName}</p>
                  <p className="text-[11px] font-mono text-on-surface-variant">{learnerEmail}</p>
                </div>
              </div>

              {/* 3 Pillar Navigation Tabs */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-outline-variant/60">
                <button
                  onClick={() => setActivePillar(1)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activePillar === 1
                      ? 'bg-primary text-on-primary border-primary shadow-md'
                      : 'bg-surface-container hover:border-primary/50 border-outline-variant text-on-surface'
                  }`}
                >
                  <Eye size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                      Pillar 01
                    </p>
                    <p className="text-sm font-bold">Body Language, Mirroring &amp; EQ Hooks</p>
                  </div>
                </button>

                <button
                  onClick={() => setActivePillar(2)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activePillar === 2
                      ? 'bg-primary text-on-primary border-primary shadow-md'
                      : 'bg-surface-container hover:border-primary/50 border-outline-variant text-on-surface'
                  }`}
                >
                  <Compass size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                      Pillar 02
                    </p>
                    <p className="text-sm font-bold">Native Place, Intros &amp; Holding Conversations</p>
                  </div>
                </button>

                <button
                  onClick={() => setActivePillar(3)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activePillar === 3
                      ? 'bg-primary text-on-primary border-primary shadow-md'
                      : 'bg-surface-container hover:border-primary/50 border-outline-variant text-on-surface'
                  }`}
                >
                  <Mic size={20} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                      Pillar 03
                    </p>
                    <p className="text-sm font-bold">Vocal Gym, Pronunciation &amp; PREP / AREA</p>
                  </div>
                </button>
              </div>
            </header>

            {/* ==================== PILLAR 1: NON-VERBAL, MIRRORING & ACTIVE LISTENING ==================== */}
            {activePillar === 1 && (
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                      Pillar 01 • Non-Verbal Magnetism &amp; Active Listening Cues
                    </span>
                    <h2 className="text-xl font-bold text-on-surface mt-0.5">
                      Win the Room Before You Finish Your First Sentence
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant hidden sm:inline">
                    🔒 Tap any card to unblur &amp; focus
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {PILLAR_1_NON_VERBAL.map((item) => {
                    const isFocused = focusedNonVerbalId === item.id;
                    return (
                      <article
                        key={item.id}
                        onClick={() => setFocusedNonVerbalId(item.id)}
                        className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer relative overflow-hidden ${
                          isFocused
                            ? 'border-primary shadow-md'
                            : 'border-outline-variant/60 opacity-75 hover:opacity-95'
                        }`}
                      >
                        {/* Forensic Watermark inside card */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-mono opacity-20 select-none"
                        >
                          {watermarkStamp}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30">
                              {item.badge}
                            </span>
                            <span className="text-xs font-mono text-on-surface-variant">
                              • {item.inspiration}
                            </span>
                          </div>
                          {!isFocused && (
                            <span className="text-xs font-mono text-primary font-semibold">
                              Tap to Unblur Card →
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-on-surface mb-3">{item.title}</h3>

                        <div className={isFocused ? 'space-y-4' : 'blur-sm select-none pointer-events-none space-y-4'}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                              <p className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold mb-1">
                                ❌ The Amateur Mistake
                              </p>
                              <p className="text-xs md:text-sm text-on-surface leading-relaxed">
                                {item.trap}
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                              <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                                🧠 Evaluator’s Subconscious Reaction
                              </p>
                              <p className="text-xs md:text-sm text-on-surface italic leading-relaxed">
                                {item.evaluatorThought}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant">
                            <p className="text-xs font-mono uppercase tracking-wider text-secondary font-bold mb-2">
                              How to Execute in Live Interviews &amp; GDs:
                            </p>
                            <ul className="space-y-2">
                              {item.executionSteps.map((step, i) => (
                                <li key={i} className="text-xs md:text-sm text-on-surface flex items-start gap-2">
                                  <CheckCircle2 size={15} className="text-primary mt-0.5 flex-shrink-0" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* White-Card Cue Box */}
                          <div className="p-4 rounded-xl bg-[#FCF5ED] text-[#1F1511] border-2 border-[#885A3A] shadow-sm relative">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-[#885A3A] font-bold mb-1">
                              LAB ACTION CUE • {learnerName.toUpperCase()}
                            </p>
                            <p className="text-sm font-medium leading-relaxed">{item.microScriptOrCue}</p>
                            <p className="text-xs font-mono font-bold text-[#885A3A] mt-2">
                              Rule of Thumb: {item.mantra}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ==================== PILLAR 2: NATIVE PLACE, INTROS & HOLDING CONVERSATIONS ==================== */}
            {activePillar === 2 && (
              <section className="flex flex-col gap-8">
                {/* Part A: Speaking About Your Native Place (The Nagpur Pride Formula) */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-primary/40 relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 right-4 text-[10px] font-mono opacity-20 select-none"
                  >
                    {watermarkStamp}
                  </div>

                  <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                    2A • The "Native Place" Pride Formula
                  </span>
                  <h2 className="text-xl font-bold text-on-surface mt-1">
                    Turn "Tell Me About Your Hometown" Into Instant Rapport
                  </h2>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    When asked where you are from, never give a dry geography answer (<em>"I am from Nagpur, it is in Maharashtra"</em>). Use the <strong>3-Layer Hometown Hook</strong>: (1) Crown Identity, (2) Sensory Culture &amp; Food, and (3) The People &amp; Work-Ethic Bridge.
                  </p>

                  {/* Preset City Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-xs font-mono text-on-surface-variant">Load Sample City:</span>
                    {HOMETOWN_PRIDE_EXAMPLES.map((preset, idx) => (
                      <button
                        key={preset.city}
                        onClick={() => loadHometownPreset(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          cityInput === preset.city
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container border-outline-variant text-on-surface hover:border-primary'
                        }`}
                      >
                        {preset.city} Example
                      </button>
                    ))}
                  </div>

                  {/* Interactive Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                        1. Your Native Place / City
                      </label>
                      <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                        2. Crown Identity / What It’s Known As
                      </label>
                      <input
                        type="text"
                        value={crownInput}
                        onChange={(e) => setCrownInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                        3. Signature Food, Coffee Culture, or Landmark
                      </label>
                      <input
                        type="text"
                        value={cultureInput}
                        onChange={(e) => setCultureInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-on-surface-variant mb-1">
                        4. Special Bond of the People &amp; Your Work Ethic
                      </label>
                      <input
                        type="text"
                        value={peopleInput}
                        onChange={(e) => setPeopleInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Synthesized White Script Card */}
                  <div className="mt-5 p-5 rounded-2xl bg-[#FCF5ED] text-[#1F1511] border-2 border-[#885A3A] shadow-sm relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#885A3A] font-bold">
                        YOUR 30-SECOND NATIVE PLACE RAPPORT HOOK • WATERMARKED: {credentialId}
                      </span>
                      <button
                        onClick={() =>
                          speakWord(
                            `I grew up in ${cityInput}—which we proudly call ${crownInput}. Beyond ${cultureInput}, what makes ${cityInput} truly special is its people: ${peopleInput}.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#885A3A] text-white text-xs font-bold hover:opacity-90"
                      >
                        <Volume2 size={14} /> Hear Flow
                      </button>
                    </div>
                    <p className="text-sm md:text-base font-serif leading-relaxed">
                      &ldquo;I grew up in <strong>{cityInput || '[Your City]'}</strong>—which we proudly call{' '}
                      <strong>{crownInput || '[Crown Identity]'}</strong>. Beyond{' '}
                      <strong>{cultureInput || '[Signature Culture/Food]'}</strong>, what makes{' '}
                      {cityInput || 'my hometown'} truly special is its people:{' '}
                      <strong>{peopleInput || '[People & Ethos Bridge]'}</strong>.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Part B: Holding Any Conversation (The Echo-Anchor-Bridge Loop) */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant">
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                    2B • Holding Effortless Conversations
                  </span>
                  <h3 className="text-xl font-bold text-on-surface mt-1 mb-4">
                    The "Echo → Anchor → Bridge" Loop (Never Run Out of Things to Say)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PILLAR_2_CONVERSATION_FLOW.map((c) => (
                      <div
                        key={c.step}
                        className="p-4 rounded-xl bg-surface-container-high border border-outline-variant flex flex-col justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-primary mb-1">{c.step}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">{c.desc}</p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-outline-variant/50">
                          <p className="text-xs text-red-400">
                            <strong>❌ Dead-End:</strong> {c.bad}
                          </p>
                          <p className="text-xs text-emerald-400">
                            <strong>✅ Magnet:</strong> {c.good}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part C: The 4 Deadly Interview Question Trap-Decoders (White Script Cards) */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                        2C • High-Stakes Interview Trap Decoders
                      </span>
                      <h3 className="text-xl font-bold text-on-surface mt-0.5">
                        Stop Reading Your CV Out Loud — Say This Instead
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-on-surface-variant hidden sm:inline">
                      🔒 Tap a question card to unblur script
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {PILLAR_2_TRAP_DECODERS.map((card) => {
                      const isFocused = focusedTrapId === card.id;
                      return (
                        <article
                          key={card.id}
                          onClick={() => setFocusedTrapId(card.id)}
                          className={`glass-panel rounded-2xl p-6 border transition-all cursor-pointer relative overflow-hidden ${
                            isFocused
                              ? 'border-primary shadow-md'
                              : 'border-outline-variant/60 opacity-75 hover:opacity-95'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-mono text-secondary font-bold uppercase">
                              {card.episode}
                            </span>
                            {!isFocused && (
                              <span className="text-xs font-mono text-primary font-bold">
                                Tap to Unblur Script →
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-on-surface mb-3">{card.question}</h4>

                          <div className={isFocused ? 'space-y-4' : 'blur-sm pointer-events-none space-y-4'}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                                <p className="font-bold text-red-400 mb-1">❌ Trap 1 (What 80% Do):</p>
                                <p className="text-on-surface">{card.trapA}</p>
                              </div>
                              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                                <p className="font-bold text-red-400 mb-1">❌ Trap 2 (The Other Extreme):</p>
                                <p className="text-on-surface">{card.trapB}</p>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-surface-container-high border border-outline-variant text-xs space-y-1">
                              <p className="text-on-surface-variant">
                                <strong className="text-primary">Interviewer’s Secret Thought:</strong>{' '}
                                <em>{card.interviewerSecretThought}</em>
                              </p>
                              <p className="text-on-surface-variant">
                                <strong className="text-secondary">What It Is Actually Testing:</strong>{' '}
                                {card.hiddenTest}
                              </p>
                            </div>

                            {/* White Script Card with Uncroppable Mid-Text Watermark (Zero-Friction Reading) */}
                            <div className="p-5 rounded-xl bg-[#FCF5ED] text-[#1F1511] border-2 border-[#885A3A] relative overflow-hidden">
                              {/* Uncroppable Diagonal Watermark right across the middle of the script */}
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 flex flex-col justify-center items-center opacity-[0.12] -rotate-6 select-none z-10"
                              >
                                <p className="text-xs font-mono font-bold text-[#885A3A] whitespace-nowrap">
                                  {learnerName.toUpperCase()} • {learnerEmail} • {credentialId}
                                </p>
                                <p className="text-[10px] font-mono font-bold text-red-800 whitespace-nowrap mt-2">
                                  LEAKING REVOKES CERTIFICATE ID {credentialId}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 relative z-20">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-[#885A3A] font-bold">
                                  SAY THIS INSTEAD • LICENSED TO {learnerName.toUpperCase()} ({credentialId})
                                </p>
                              </div>

                              <div
                                className={
                                  !isModifierPressed
                                    ? 'relative z-20 transition-all'
                                    : 'blur-md select-none pointer-events-none relative z-20 transition-all'
                                }
                              >
                                <p className="text-sm font-serif whitespace-pre-line leading-relaxed">
                                  &ldquo;{card.whiteCardScript}&rdquo;
                                </p>
                                <p className="text-xs font-mono font-bold text-[#885A3A] mt-3 pt-2 border-t border-[#885A3A]/20">
                                  Takeaway Mantra: {card.mantra}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ==================== PILLAR 3: VOCAL GYM, PRONUNCIATION & PREP/AREA ==================== */}
            {activePillar === 3 && (
              <section className="flex flex-col gap-8">
                {/* Part 3A: Vocal Warmup Gym + Interactive Box Breathing */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant">
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                    3A • The 3-Minute Pre-Interview Vocal Gym
                  </span>
                  <h2 className="text-xl font-bold text-on-surface mt-1 mb-4">
                    Warm Up Your Voice, Drop Nervous Pitch &amp; Kill Filler Words
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {VOCAL_EXERCISES.map((ex) => (
                      <div
                        key={ex.id}
                        className="p-5 rounded-xl bg-surface-container-high border border-outline-variant flex flex-col justify-between gap-3"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-primary mb-1">{ex.title}</h3>
                          <p className="text-xs text-secondary font-medium mb-2">{ex.purpose}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {ex.instructions}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/70 border border-outline-variant/60 text-xs font-mono text-on-surface whitespace-pre-line">
                          {ex.drillText}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive 4-4-4-4 Box Breathing Pacer */}
                  <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                        Live 4-4-4-4 Vocal Pitch-Drop Pacer
                      </p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">
                        {breathRunning
                          ? `${breathPhase} — ${(breathTick % 4) + 1}s / 4s`
                          : 'Press Start 2 minutes before your interview to steady your breathing and lower vocal tension.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setBreathRunning(!breathRunning);
                        setBreathTick(0);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-2 flex-shrink-0"
                    >
                      {breathRunning ? <Pause size={14} /> : <Play size={14} />}
                      {breathRunning ? 'Stop Pacer' : 'Start 4-4-4-4 Pacer'}
                    </button>
                  </div>
                </div>

                {/* Part 3B: Interactive Pronunciation Lab (16 Oft-Used Words with 🔊 Web Speech Audio) */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-primary/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                        3B • Interactive Audio Pronunciation Lab (16 High-Frequency Words)
                      </span>
                      <h3 className="text-xl font-bold text-on-surface mt-0.5">
                        Fix the Subtle Mispronunciations That Signal Inexperience
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-primary">
                      🔊 Tap a word card to focus &amp; hear audio
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PILLAR_3_PRONUNCIATION_WORDS.map((item, idx) => {
                      const isFocused = focusedWordIdx === idx;
                      return (
                        <div
                          key={item.word}
                          onClick={() => setFocusedWordIdx(idx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                            isFocused
                              ? 'bg-surface-container-high border-primary shadow-md'
                              : 'bg-surface-container border-outline-variant/60 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold text-on-surface">{item.word}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                                {item.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFocusedWordIdx(idx);
                                  speakWord(item.audioText, 0.92);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1 hover:opacity-90"
                                title="Hear Normal Speed"
                              >
                                <Volume2 size={13} /> Normal
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFocusedWordIdx(idx);
                                  speakWord(item.audioText, 0.6);
                                }}
                                className="px-2 py-1 rounded-lg border border-outline-variant text-[11px] font-mono text-on-surface hover:border-primary"
                                title="Hear Slow Coach Speed"
                              >
                                0.6x Slow
                              </button>
                            </div>
                          </div>

                          <div className={isFocused ? 'space-y-2' : 'blur-[3px] select-none pointer-events-none space-y-2'}>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                              <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 line-through">
                                ❌ {item.wrongPhonetic}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                                ✅ {item.rightPhonetic}
                              </span>
                            </div>
                            <p className="text-xs text-on-surface-variant">{item.tip}</p>
                            <p className="text-xs italic text-on-surface bg-background/60 p-2 rounded-lg border border-outline-variant/50">
                              &ldquo;{item.sampleSentence}&rdquo;
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part 3C: Spontaneous Speaking Frameworks (PREP & AREA) + 60s Impromptu Gym */}
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">
                        3C • Spontaneous Speaking Frameworks (P.R.E.P. &amp; A.R.E.A.)
                      </span>
                      <h3 className="text-xl font-bold text-on-surface mt-0.5">
                        Structure Any Opinion in 60 Seconds Without Rambling
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedFrameworkId('prep')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedFrameworkId === 'prep'
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container border-outline-variant text-on-surface'
                        }`}
                      >
                        P.R.E.P. Framework
                      </button>
                      <button
                        onClick={() => setSelectedFrameworkId('area')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedFrameworkId === 'area'
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container border-outline-variant text-on-surface'
                        }`}
                      >
                        A.R.E.A. Framework
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant mb-5">
                    <p className="text-sm font-bold text-primary">{activeFramework.fullName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      <strong>Best Used For:</strong> {activeFramework.bestFor}
                    </p>
                    <p className="text-xs font-mono text-secondary mt-1">
                      Model Prompt: {activeFramework.samplePrompt}
                    </p>
                  </div>

                  {/* 4 Steps Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {activeFramework.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-7 w-7 rounded-lg bg-primary text-on-primary font-mono font-bold text-sm flex items-center justify-center">
                            {st.letter}
                          </span>
                          <span className="text-sm font-bold text-on-surface">{st.label}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant">{st.prompt}</p>
                        <div className="p-3 rounded-lg bg-[#FCF5ED] text-[#1F1511] border border-[#885A3A]/50 text-xs font-serif">
                          &ldquo;{st.exampleLine}&rdquo;
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive 60-Second Impromptu Topic Spinner & Practice Pad */}
                  <div className="p-5 rounded-2xl bg-surface-container-high border-2 border-primary/40 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                          Live 60-Second Impromptu Speaking Drill ({activeFramework.acronym})
                        </span>
                        <h4 className="text-base font-bold text-on-surface mt-0.5">
                          Topic: &ldquo;{impromptuTopic}&rdquo;
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={spinRandomTopic}
                          className="px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:border-primary inline-flex items-center gap-1.5"
                        >
                          <RefreshCw size={13} /> Spin New Topic
                        </button>
                        <button
                          onClick={() => {
                            if (timerSeconds === 0) setTimerSeconds(60);
                            setTimerRunning(!timerRunning);
                          }}
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <Timer size={14} />
                          {timerRunning ? `Speaking... ${timerSeconds}s` : `Start ${timerSeconds}s Timer`}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeFramework.steps.map((st, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-mono text-on-surface-variant mb-1">
                            {st.letter} — {st.label}
                          </label>
                          <input
                            type="text"
                            placeholder={st.prompt}
                            value={builderInputs[`step${idx}`] || ''}
                            onChange={(e) =>
                              setBuilderInputs({ ...builderInputs, [`step${idx}`]: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-background border border-outline-variant text-xs text-on-surface focus:outline-none focus:border-primary"
                          />
                        </div>
                      ))}
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
