"use client";

import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Award, ExternalLink, Calendar } from 'lucide-react';

export default function VerifyCredentialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const holderName = searchParams.get('name') || 'Verified TCB Graduate';
  const trackName = searchParams.get('track') || 'Track A: Campus to Corporate Softskills Lab';
  const decodedId = decodeURIComponent(id);

  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

      <main className="w-full max-w-xl glass-panel rounded-2xl p-8 border-2 border-primary shadow-xl flex flex-col items-center text-center gap-6">
        <img
          src="/tcb-logo.png"
          alt="The Career Breweries"
          className="w-20 h-20 rounded-full object-contain border border-outline-variant shadow-sm"
        />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={16} />
          Official Verified Credential • Active
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
            Credential Holder
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface mt-1">
            {holderName}
          </h1>
          <p className="text-sm text-primary font-semibold mt-1">
            {trackName} (3-Days Workshop &amp; Interactive Lab)
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 p-4 rounded-xl bg-surface-container-high border border-outline-variant text-left text-xs">
          <div>
            <span className="text-on-surface-variant block font-mono">CREDENTIAL ID</span>
            <strong className="text-on-surface font-mono text-sm">{decodedId}</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block font-mono">COMPLETION STATUS</span>
            <strong className="text-emerald-400 font-mono text-sm">100% Verified</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block font-mono">ISSUING AUTHORITY</span>
            <strong className="text-on-surface">The Career Breweries</strong>
          </div>
          <div>
            <span className="text-on-surface-variant block font-mono">VERIFIED DATE</span>
            <strong className="text-on-surface flex items-center gap-1">
              <Calendar size={12} /> {issueDate}
            </strong>
          </div>
        </div>

        <div className="w-full text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-secondary block mb-2.5">
            5 Assessed Frameworks Passed (100% Score):
          </span>
          <div className="grid grid-cols-1 gap-2">
            {[
              'P-P-F Formula — The 3-Sentence Executive Intro',
              'Google X-Y-Z Framework — ATS Resume Impact Engineering',
              'P.R.E.P. + Tactical Bridging — Group Discussion Leadership',
              'B.L.U.F. Architecture — Corporate Email Etiquette',
              'S.T.A.R.+L Method — Behavioral Interview Mastery'
            ].map((fw) => (
              <div
                key={fw}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-variant/40 border border-outline-variant/60 text-xs text-on-surface"
              >
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>{fw}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/certificate"
            className="flex-1 py-3 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-bold hover:bg-surface-variant transition-all"
          >
            View Full Certificate
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
          >
            Explore Softskills Lab <ExternalLink size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
