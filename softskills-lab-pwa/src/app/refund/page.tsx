"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function RefundPolicyPage() {
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
            <RefreshCw size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Cancellation &amp; Refund Policy</h1>
            <p className="text-xs text-on-surface-variant">The Career Breweries (TCB) Softskills Lab</p>
          </div>
        </div>

        <section className="flex flex-col gap-4 text-xs md:text-sm text-on-surface leading-relaxed">
          <div>
            <h2 className="text-base font-bold text-primary mb-1">1. Digital Software License Delivery</h2>
            <p className="text-on-surface-variant">
              The Career Breweries delivers all interactive communication software simulators, assessment engines, and digital credentials electronically as a web-based SaaS platform. Access to your purchased software license tier is provisioned immediately upon successful completion of payment via Razorpay.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">2. Duplicate Payments &amp; Transaction Errors</h2>
            <p className="text-on-surface-variant">
              If an accidental duplicate charge or multiple debits occur for the same user account during checkout, we will immediately initiate a <strong>100% full refund</strong> for the duplicate transaction without any penalty. Refunds are processed through Razorpay back to your original payment method (Bank Account, UPI, or Credit/Debit Card) within <strong>5–7 business days</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">3. Refund Eligibility &amp; Review Window</h2>
            <p className="text-on-surface-variant">
              We stand behind the quality and practical rigor of our training. If you experience technical defects, access delivery failures, or system errors that prevent you from utilizing the interactive lab software, please notify our support team within <strong>48 hours</strong> of purchase at <span className="font-mono text-primary font-bold">careerbreweries@gmail.com</span> with your registered email and Razorpay Payment ID (<code className="text-primary font-mono font-bold">pay_...</code>). Our technical team will review and resolve the issue or process an approved refund.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-primary mb-1">4. Non-Refundable Scenarios</h2>
            <p className="text-on-surface-variant">
              Refunds cannot be issued once a user has utilized more than 50% of the interactive simulation modules, or once an official verified skill certificate has been permanently generated and recorded under their legal name.
            </p>
          </div>

          <div className="pt-2 border-t border-outline-variant/60">
            <h2 className="text-base font-bold text-primary mb-1">5. Support &amp; Dispute Resolution</h2>
            <p className="text-on-surface-variant">
              To request a refund, report a billing anomaly, or inquire about your transaction:
              <br />
              <strong>Email:</strong> <span className="font-mono text-primary">careerbreweries@gmail.com</span>
              <br />
              <strong>Helpline:</strong> <span className="font-mono text-primary">+91 97437 11584</span>
              <br />
              <strong>Operating Address:</strong> The Career Breweries, Bengaluru, Karnataka, India
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
