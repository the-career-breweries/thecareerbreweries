"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function TermsPage() {
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
          <span className="text-xs text-on-surface-variant font-mono">Last Updated: November 2026</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Terms and Conditions</h1>
            <p className="text-xs text-on-surface-variant">The Career Breweries (TCB) Softskills Lab</p>
          </div>
        </div>

        <section className="flex flex-col gap-4 text-xs md:text-sm text-on-surface leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-primary mb-1">1. Acceptance of Terms</h2>
            <p className="text-on-surface-variant">
              By accessing or enrolling in The Career Breweries Softskills Lab, 3-Days Workshop curriculum, interactive simulators, or associated digital materials, you agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">2. Service Description &amp; Digital Access</h2>
            <p className="text-on-surface-variant">
              The Career Breweries offers online soft skills training courses, interactive speech/communication simulators, and verifiable completion certificates. Access to curriculum modules is granted upon successful payment and user registration.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">3. Instant Digital Delivery Policy</h2>
            <p className="text-on-surface-variant">
              All courses, simulators, and digital training assets are delivered digitally and instantly. Upon successful payment verification via our payment gateway (Razorpay), your account receives immediate access to your purchased bundle (Student Bundle or Professional Bundle).
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">4. User Account &amp; Legal Name Verification</h2>
            <p className="text-on-surface-variant">
              To issue authentic completion credentials, users provide their legal name during enrollment. This legal name is permanently tied to verified certificates and scannable verification IDs. Accounts and access passes may not be shared, resold, or transferred.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">5. Intellectual Property</h2>
            <p className="text-on-surface-variant">
              All proprietary communication frameworks (including the Amazon A-B-C Resume Rule, 1-3-1 Rule, F.A.R.E. Salary Negotiation, STAR Drills, and the Friday 6 PM Crisis Simulator) are the intellectual property of The Career Breweries. Unauthorized distribution, commercial reproduction, or scraping is strictly prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">6. Limitation of Liability</h2>
            <p className="text-on-surface-variant">
              Our training frameworks and placement interview tools are designed to maximize interview and communication performance. While we provide industry-proven training, employment hiring outcomes ultimately depend on employer selection discretion and individual performance.
            </p>
          </div>

          <div className="pt-2 border-t border-outline-variant/60">
            <h2 className="text-base font-bold text-primary mb-1">7. Contact Information</h2>
            <p className="text-on-surface-variant">
              For any questions regarding these terms, reach out to our team at:
              <br />
              <strong>Email:</strong> <span className="font-mono text-primary">careerbreweries@gmail.com</span>
              <br />
              <strong>Phone:</strong> <span className="font-mono text-primary">+91 97437 11584</span>
              <br />
              <strong>Location:</strong> Bengaluru, Karnataka, India
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
