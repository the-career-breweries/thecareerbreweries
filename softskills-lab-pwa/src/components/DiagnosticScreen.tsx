"use client";

import ThemeToggle from './ThemeToggle';
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

const QUESTIONS = [
  {
    step: 1,
    question: 'How do you typically handle a hostile interview question?',
    options: [
      { id: '1', text: 'I freeze up or get defensive when my past work is challenged directly.' },
      { id: '2', text: 'I take a breath and reframe the question positively using structured examples.' },
      { id: '3', text: 'I over-explain and ramble to prove I know the subject matter thoroughly.' },
      { id: '4', text: 'I give a very brief one-liner and wait to move on to the next question.' }
    ]
  },
  {
    step: 2,
    question: 'When asked "Tell me about yourself", how do you structure your opening?',
    options: [
      { id: '1', text: 'I recite my resume chronologically from college to my current role.' },
      { id: '2', text: 'I deliver a sharp 3-sentence pitch: Present Hook, Past Proof, and Future Alignment.' },
      { id: '3', text: 'I improvise on the spot depending on the interviewer’s mood.' },
      { id: '4', text: 'I focus mostly on personal hobbies and background.' }
    ]
  },
  {
    step: 3,
    question: 'In a high-noise Group Discussion (GD), how do you make your point heard?',
    options: [
      { id: '1', text: 'I wait for silence, which often means I barely get a chance to speak.' },
      { id: '2', text: 'I use structured bridging phrases to build on a peer’s point and pivot authority.' },
      { id: '3', text: 'I raise my voice to talk over the loudest participant.' },
      { id: '4', text: 'I only summarize what others said at the very end.' }
    ]
  },
  {
    step: 4,
    question: 'When an HR manager quotes a compensation figure below your target, what do you do?',
    options: [
      { id: '1', text: 'I accept immediately out of fear that negotiating might revoke the offer.' },
      { id: '2', text: 'I anchor my value using market benchmarks and quantifiable impact before countering.' },
      { id: '3', text: 'I state a random higher number without explaining the rationale.' },
      { id: '4', text: 'I ask if they can review my salary after 6 months.' }
    ]
  },
  {
    step: 5,
    question: 'How do you communicate a project delay to senior leadership?',
    options: [
      { id: '1', text: 'I wait until the deadline passes and apologize with a long explanation.' },
      { id: '2', text: 'I send a proactive executive brief: current status, root blocker, and 2 mitigation options.' },
      { id: '3', text: 'I blame cross-functional dependencies in a group email.' },
      { id: '4', text: 'I stay quiet and hope nobody notices a few extra days.' }
    ]
  }
];

export default function DiagnosticScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({ 0: '2' });
  const [saving, setSaving] = useState(false);

  const currentQ = QUESTIONS[currentIdx];
  const progressPct = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);
  const selected = answers[currentIdx] || '2';

  const handleSelect = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optId }));
  };

  const handleNext = async () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      if (!answers[currentIdx + 1]) {
        setAnswers((prev) => ({ ...prev, [currentIdx + 1]: '2' }));
      }
      return;
    }

    setSaving(true);
    try {
      if (supabase) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.auth.updateUser({
            data: { diagnostic_completed: true }
          });
          await supabase.from('profiles').upsert({
            id: userData.user.id,
            email: userData.user.email,
            diagnostic_completed: true
          });
        }
      }
    } catch {
      // Non-blocking if profile table is not yet initialized
    } finally {
      setSaving(false);
      router.push('/paywall');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

      <main className="w-full max-w-xl bg-surface-container rounded-xl shadow-lg border border-outline-variant p-6 md:p-8 relative overflow-hidden">
        {/* Progress Header */}
        <header className="flex flex-col gap-3 mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} />
              Learner Needs Assessment
            </span>
            <span>{progressPct}% Complete</span>
          </div>
          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </header>

        {/* Question */}
        <section className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              Question {currentQ.step} of {QUESTIONS.length}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface mt-1">
              {currentQ.question}
            </h1>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3.5">
            {currentQ.options.map((opt) => {
              const isSelected = selected === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="relative cursor-pointer group w-full"
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.step}`}
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => handleSelect(opt.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`glass-panel p-5 rounded-xl flex items-start gap-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'hover:border-outline bg-surface-container-high/50'
                    }`}
                  >
                    <div
                      className={`relative mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-primary' : 'border-outline-variant'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm md:text-base text-on-surface leading-relaxed">
                      {opt.text}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Sticky / Bottom Action */}
          <div className="pt-4 flex items-center gap-3">
            {currentIdx > 0 && (
              <button
                type="button"
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="px-4 py-3.5 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-variant transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="flex-1 bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving
                ? 'Saving Results...'
                : currentIdx === QUESTIONS.length - 1
                ? 'Complete Diagnostic & View Bundles'
                : 'Next Question'}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Quick Preview Nav Bar */}
      <nav className="mt-6 flex items-center gap-2 text-xs bg-surface-container border border-outline-variant px-4 py-2 rounded-full shadow-sm">
        <span className="text-on-surface-variant font-medium">Screens:</span>
        <Link href="/" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">1. Auth</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/diagnostic" className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-semibold">2. Diagnostic</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/paywall" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">3. Paywall</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/dashboard" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">4. Dashboard</Link>
      </nav>
    </div>
  );
}
