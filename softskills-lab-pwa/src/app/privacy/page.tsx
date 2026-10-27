"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-3xl glass-panel rounded-2xl p-6 md:p-10 border border-outline-variant shadow-md my-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
          >
            <ArrowLeft size={14} /> Back to Lab
          </Link>
          <span className="text-xs text-on-surface-variant font-mono">Last Updated: October 2026</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Privacy Policy</h1>
            <p className="text-xs text-on-surface-variant">The Career Breweries (TCB) Softskills Lab</p>
          </div>
        </div>

        <section className="flex flex-col gap-3 text-xs md:text-sm text-on-surface leading-relaxed">
          <h2 className="text-base font-bold text-primary">1. Overview</h2>
          <p>
            The Career Breweries (&ldquo;TCB&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) provides the Softskills Lab interactive training platform and 3-Days Workshop tools. This Privacy Policy describes how we collect, use, and protect your information when you use our web application and mobile experiences.
          </p>

          <h2 className="text-base font-bold text-primary mt-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1 text-on-surface-variant">
            <li><strong>Account Information:</strong> Name, email address, and authentication credentials through our secure Supabase authentication provider.</li>
            <li><strong>Curriculum &amp; Learning Progress:</strong> Baseline diagnostic scores, completed module drills, and simulation performance metrics.</li>
            <li><strong>Payment &amp; Verification Details:</strong> UPI reference IDs (UTR numbers) or payment identifiers required to unlock workshop bundles. We do not store sensitive credit/debit card numbers or UPI PINs.</li>
          </ul>

          <h2 className="text-base font-bold text-primary mt-2">3. How We Use Your Data</h2>
          <p>
            Your data is used strictly to deliver interactive simulator drills, calculate communication progress scores, issue verified course completion certificates, and verify payment access. We never sell or rent your personal information to third parties.
          </p>

          <h2 className="text-base font-bold text-primary mt-2">4. Data Security</h2>
          <p>
            User authentication and database records are encrypted in transit via SSL/TLS and managed with industry-standard row-level security protocols.
          </p>

          <h2 className="text-base font-bold text-primary mt-2">5. Contact Us</h2>
          <p>
            For questions regarding this policy or to request account data deletion, reach out to us at:
            <br />
            <strong className="text-primary font-mono">careerbreweries@gmail.com</strong>
          </p>
        </section>
      </main>
    </div>
  );
}
