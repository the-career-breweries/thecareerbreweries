"use client";

import React, { useState, useEffect } from 'react';
import { TRACK_A_MODULES } from '@/data/trackAModules';
import { TRACK_B_MODULES } from '@/data/trackBModules';

const ALL_MODULES = [...TRACK_A_MODULES, ...TRACK_B_MODULES];
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Zap,
  Wrench,
  Trophy
} from 'lucide-react';

export default function ModulePlayer({ slug }: { slug: string }) {
  const router = useRouter();
  const modIndex = ALL_MODULES.findIndex((m) => m.id === slug);
  const mod = ALL_MODULES[modIndex];

  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [brewInputs, setBrewInputs] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!mod) return;
    const defaults: Record<string, string> = {};
    mod.brewBuilder.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setBrewInputs(defaults);

    // Load saved stage progress
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      const pct = savedProgress[mod.id] || 0;
      if (pct === 0) {
        savedProgress[mod.id] = 25;
        localStorage.setItem('tcb_module_progress', JSON.stringify(savedProgress));
      }
    }
  }, [mod]);

  if (!mod) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
        <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const updateStageProgress = (stage: 1 | 2 | 3 | 4) => {
    setActiveStage(stage);
    const stagePct = stage * 25;
    if (typeof window !== 'undefined') {
      const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
      const currentPct = savedProgress[mod.id] || 0;
      if (stagePct > currentPct) {
        savedProgress[mod.id] = stagePct;
        localStorage.setItem('tcb_module_progress', JSON.stringify(savedProgress));
      }
    }
  };

  const synthesizeBrewOutput = () => {
    if (mod.id === 'intro-pitch') {
      return `"I am a ${brewInputs.present || '...'} [Present]. Recently, I ${brewInputs.past || '...'} [Past]. I’m excited to bring that execution rigor to your ${brewInputs.future || '...'} [Future]."`;
    }
    if (mod.id === 'resume-ats') {
      return `• ${brewInputs.x_action || '...'}, ${brewInputs.y_metric || '...'} by ${brewInputs.z_method || '...'}.`;
    }
    if (mod.id === 'gd-dominance') {
      return `"${brewInputs.bridge_point || '...'}. The core reason is that ${brewInputs.reason || '...'}. For example, ${brewInputs.example || '...'}. So balancing both lenses is key—and I’d love to hear the group’s view on implementation."`;
    }
    if (mod.id === 'email-etiquette') {
      return `Subject: ${brewInputs.subject_topic || '...'}\n\nHi [Name],\n\n${brewInputs.bluf_line || '...'}\n\n• Next Step: ${brewInputs.cta_line || '...'}\n\nWarm regards,\n[Your Name]`;
    }
    if (mod.id === 'hostile-qa') {
      return `"${brewInputs.ack_learning || '...'} [Acknowledge]. However, ${brewInputs.bridge_plateau || '...'} [Bridge]. I am looking for an environment focused on ${brewInputs.control_future || '...'}, and this role feels like the exact right arena for that [Control]."`;
    }
    if (mod.id === 'salary-negotiation') {
      return `Step 1 (The Flip): "Before I share a figure, could you share what the approved compensation band for this role looks like?"\n\nStep 2 (The Anchor & Range): "I have looked at what a ${brewInputs.role_title_city || '...'} pays across the industry, and the range sits between ${brewInputs.range_floor_x || '...'} and ${brewInputs.range_ceiling_y || '...'}. I am happy to find the right number within that band."`;
    }
    if (mod.id === 'managing-up') {
      return `• 1 (Quantified Risk): ${brewInputs.one_problem || '...'}.\n• 3 (Clarified Constraints): ${brewInputs.three_checks || '...'}.\n• 1 (Recommended Decision): I recommend we ${brewInputs.one_recommendation || '...'}.`;
    }
    return `• Situation & Task: ${brewInputs.st_context || '...'}\n• Action: ${brewInputs.action_steps || '...'}\n• Result & Learning (+L): ${brewInputs.result_learning || '...'}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(synthesizeBrewOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteModule = async () => {
    setSaving(true);
    try {
      let overallPct = 20;
      if (typeof window !== 'undefined') {
        const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
        savedProgress[mod.id] = 100;
        localStorage.setItem('tcb_module_progress', JSON.stringify(savedProgress));

        const totalScore = TRACK_A_MODULES.reduce((acc, m) => acc + (savedProgress[m.id] || 0), 0);
        overallPct = Math.round(totalScore / TRACK_A_MODULES.length);
      }

      if (supabase) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.auth.updateUser({
            data: { workshop_completion_pct: overallPct }
          });
          await supabase.from('profiles').upsert({
            id: userData.user.id,
            email: userData.user.email,
            workshop_completion_pct: overallPct
          });
        }
      }
    } catch {
      // Non-blocking fallback
    } finally {
      setSaving(false);
      router.push('/dashboard');
    }
  };

  const nextMod = modIndex < ALL_MODULES.length - 1 ? ALL_MODULES[modIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans relative">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

      <main className="w-full max-w-4xl mx-auto flex flex-col gap-6 my-4">
        {/* Top Breadcrumb & Module Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              Back to Learning Dashboard
            </Link>
            <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
              Module {mod.number} of {ALL_MODULES.length} • {mod.duration}
            </span>
          </div>

          <header className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              {mod.track} • {mod.frameworkShort}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface mt-1 mb-2">
              {mod.title}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
              {mod.overview}
            </p>

            {/* 4-Stage Navigation Stepper */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-outline-variant/60">
              {[
                { stage: 1 as const, label: '1. Framework', icon: BookOpen },
                { stage: 2 as const, label: '2. Pressure Drill', icon: Zap },
                { stage: 3 as const, label: '3. Brew Builder', icon: Wrench },
                { stage: 4 as const, label: '4. Mastery Sync', icon: Trophy }
              ].map((s) => {
                const Icon = s.icon;
                const isActive = activeStage === s.stage;
                const isDone = activeStage > s.stage;
                return (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => updateStageProgress(s.stage)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : isDone
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'bg-surface-variant/40 text-on-surface-variant border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    <Icon size={15} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </header>
        </div>

        {/* STAGE 1: THE FRAMEWORK BREAKDOWN */}
        {activeStage === 1 && (
          <section className="flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <Sparkles size={20} className="text-primary" />
                  Core Architecture: {mod.frameworkName}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {mod.pillars.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-surface-container-high border border-outline-variant flex flex-col md:flex-row gap-4 items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {p.letter}
                    </div>
                    <div className="flex-grow flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-on-surface">{p.title}</h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-secondary">
                          {p.timingOrWeight}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">{p.description}</p>
                      <div className="mt-2 p-3 rounded-lg bg-background/70 border border-outline-variant/60 text-xs md:text-sm text-on-surface italic">
                        &ldquo;{p.example}&rdquo;
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Teardown */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                  Side-by-Side Teardown
                </span>
                <h3 className="text-lg font-bold text-on-surface mt-1">
                  Prompt: {mod.teardown.prompt}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Amateur */}
                <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/30 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <XCircle size={18} />
                    The Amateur Response (Filtered Out)
                  </div>
                  <p className="text-xs md:text-sm text-on-surface-variant whitespace-pre-line bg-background/60 p-3.5 rounded-lg border border-outline-variant/50">
                    {mod.teardown.amateur}
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-on-surface-variant mt-1">
                    {mod.teardown.amateurFlaws.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TCB Brew */}
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/30 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    The TCB Executive Brew (Top 5%)
                  </div>
                  <p className="text-xs md:text-sm text-on-surface whitespace-pre-line bg-background/60 p-3.5 rounded-lg border border-outline-variant/50 font-medium">
                    {mod.teardown.tcbBrew}
                  </p>
                  <ul className="flex flex-col gap-1.5 text-xs text-on-surface-variant mt-1">
                    {mod.teardown.tcbStrengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => updateStageProgress(2)}
                  className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  Continue to Stage 2: Pressure Drill
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STAGE 2: THE PRESSURE DRILL */}
        {activeStage === 2 && (
          <section className="flex flex-col gap-6">
            {mod.scenarios.map((scen, sIdx) => {
              const chosenId = selectedAnswers[scen.id];
              return (
                <div key={scen.id} className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-5">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                      Scenario {sIdx + 1} • {scen.context}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-on-surface mt-1">
                      {scen.prompt}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {scen.options.map((opt) => {
                      const isPicked = chosenId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [scen.id]: opt.id }))
                          }
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                            isPicked
                              ? opt.isOptimal
                                ? 'bg-emerald-500/10 border-emerald-500/50'
                                : 'bg-red-500/10 border-red-500/50'
                              : 'bg-surface-container-high border-outline-variant hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 uppercase">
                              {opt.id}
                            </span>
                            <p className="text-sm md:text-base text-on-surface">{opt.text}</p>
                          </div>

                          {isPicked && (
                            <div
                              className={`mt-2 pt-2 border-t text-xs md:text-sm flex items-start gap-2 font-medium ${
                                opt.isOptimal
                                  ? 'border-emerald-500/30 text-emerald-400'
                                  : 'border-red-500/30 text-red-400'
                              }`}
                            >
                              {opt.isOptimal ? (
                                <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                              ) : (
                                <XCircle size={16} className="mt-0.5 flex-shrink-0" />
                              )}
                              <span>{opt.feedback}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => updateStageProgress(1)}
                className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-variant font-semibold flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Stage 1
              </button>
              <button
                type="button"
                onClick={() => updateStageProgress(3)}
                className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Continue to Stage 3: The Brew Builder
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {/* STAGE 3: THE BREW BUILDER (INTERACTIVE SCRIPT GENERATOR) */}
        {activeStage === 3 && (
          <section className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                Hands-On Practice Lab
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface mt-1">
                {mod.brewBuilder.title}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                {mod.brewBuilder.instructions}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {mod.brewBuilder.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-on-surface">{field.label}</label>
                  <span className="text-xs text-on-surface-variant">{field.helperText}</span>
                  <textarea
                    rows={2}
                    value={brewInputs[field.id] || ''}
                    onChange={(e) =>
                      setBrewInputs((prev) => ({ ...prev, [field.id]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full mt-1 bg-input border border-outline-variant rounded-xl p-3.5 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Live Synthesized Output Box */}
            <div className="p-5 rounded-xl bg-surface-container-high border-2 border-primary/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
                  Your Synthesized TCB Script (Live Preview)
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
              <pre className="text-sm md:text-base text-on-surface whitespace-pre-wrap font-sans leading-relaxed bg-background/70 p-4 rounded-lg border border-outline-variant">
                {synthesizeBrewOutput()}
              </pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => updateStageProgress(2)}
                className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-variant font-semibold flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Stage 2
              </button>
              <button
                type="button"
                onClick={() => updateStageProgress(4)}
                className="bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                Continue to Stage 4: Complete Module
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {/* STAGE 4: MASTERY CHECK & SUPABASE SYNC */}
        {activeStage === 4 && (
          <section className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Trophy size={32} />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-secondary">
                Module {mod.number} Mastery Verified
              </span>
              <h2 className="text-2xl font-bold text-on-surface mt-1">
                You’ve Mastered {mod.frameworkShort}!
              </h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto mt-2">
                Click below to mark <strong>{mod.title}</strong> as <strong>100% Complete</strong> and sync your progress to your Supabase profile.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-2">
              <button
                type="button"
                onClick={handleCompleteModule}
                disabled={saving}
                className="w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {saving ? 'Syncing to Supabase...' : 'Mark 100% Complete & Return to Dashboard'}
              </button>
            </div>

            {nextMod && (
              <Link
                href={`/dashboard/module/${nextMod.id}`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const savedProgress = JSON.parse(localStorage.getItem('tcb_module_progress') || '{}');
                    savedProgress[mod.id] = 100;
                    localStorage.setItem('tcb_module_progress', JSON.stringify(savedProgress));
                  }
                }}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Or jump straight to Module {nextMod.number}: {nextMod.title} <ArrowRight size={13} />
              </Link>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
