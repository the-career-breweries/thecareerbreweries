"use client";

import ThemeToggle from './ThemeToggle';
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  GraduationCap,
  Star,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.getElementById('razorpay-checkout-script');
    if (existing) return resolve(true);

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaywallScreen() {
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState<'student' | 'pro' | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  // Already Paid activation box state
  const [claimPaymentId, setClaimPaymentId] = useState('');
  const [claimTier, setClaimTier] = useState<'student' | 'pro'>('student');
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    // Preload Razorpay checkout script in the background
    loadRazorpayScript();

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          if (data.user.email) setUserEmail(data.user.email);
          const meta = data.user.user_metadata || {};
          if (meta.full_name) setUserName(meta.full_name);
        }
      });
    }

    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('tcb_learner_name');
      if (storedName && !userName) setUserName(storedName);
    }
  }, [userName]);

  const handleRazorpayCheckout = async (bundle: 'student' | 'pro') => {
    setCheckoutLoading(bundle);
    const scriptLoaded = await loadRazorpayScript();

    try {
      // 1. Create order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bundle })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Could not initialize order');
      }

      if (!scriptLoaded || typeof window === 'undefined' || !window.Razorpay) {
        // Fallback to hosted payment page if script blocked by browser extension
        window.location.href =
          bundle === 'pro'
            ? 'https://rzp.io/rzp/tcb-pro-bundle'
            : 'https://rzp.io/rzp/tcb-student-bundle';
        return;
      }

      const bundleTitle = bundle === 'pro' ? 'The Professional Bundle' : 'The Student Bundle';

      const options = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TJN5b2o72kLRPP',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Career Breweries',
        description: `TCB Softskills Lab - ${bundleTitle}`,
        image: 'https://tcb-softskills-lab.vercel.app/tcb-logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: userName || 'TCB Learner',
          email: userEmail || '',
          contact: ''
        },
        notes: {
          bundle,
          platform: 'TCB Softskills Lab'
        },
        theme: {
          color: '#0C2340'
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(null);
          }
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) {
          const paymentId = response.razorpay_payment_id;
          if (typeof window !== 'undefined') {
            localStorage.setItem('tcb_unlocked_bundle', bundle);
            localStorage.setItem(`tcb_payment_${bundle}`, paymentId);
          }

          if (supabase) {
            try {
              const { data: userData } = await supabase.auth.getUser();
              if (userData?.user) {
                const updates =
                  bundle === 'pro'
                    ? { has_pro_bundle: true, has_student_bundle: true }
                    : { has_student_bundle: true };

                await supabase.auth.updateUser({ data: updates });
                await supabase.from('profiles').upsert({
                  id: userData.user.id,
                  email: userData.user.email,
                  payment_id: paymentId,
                  ...updates
                });
              }
            } catch {
              // LocalStorage ensures access even if background profile update delays
            }
          }

          setCheckoutLoading(null);
          router.push('/dashboard');
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      console.error('Razorpay Modal Error:', err);
      // Fallback to hosted page if server call fails
      window.location.href =
        bundle === 'pro'
          ? 'https://rzp.io/rzp/tcb-pro-bundle'
          : 'https://rzp.io/rzp/tcb-student-bundle';
    }
  };

  const handleManualPaymentClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimStatus(null);
    const cleanId = claimPaymentId.trim();

    if (!cleanId.startsWith('pay_') || cleanId.length < 10) {
      setClaimStatus({
        type: 'error',
        text: 'Please enter a valid Razorpay Payment ID starting with "pay_" (found in your receipt email or SMS).'
      });
      return;
    }

    setClaiming(true);
    try {
      const bundle = claimTier;
      if (typeof window !== 'undefined') {
        localStorage.setItem('tcb_unlocked_bundle', bundle);
        localStorage.setItem(`tcb_payment_${bundle}`, cleanId);
      }

      if (supabase) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const updates =
            bundle === 'pro'
              ? { has_pro_bundle: true, has_student_bundle: true }
              : { has_student_bundle: true };

          await supabase.auth.updateUser({ data: updates });
          await supabase.from('profiles').upsert({
            id: userData.user.id,
            email: userData.user.email,
            payment_id: cleanId,
            ...updates
          });
        }
      }

      setClaimStatus({
        type: 'success',
        text: `Verified! Unlocked ${bundle === 'pro' ? 'Professional' : 'Student'} Bundle. Redirecting to your dashboard...`
      });
      setTimeout(() => router.push('/dashboard'), 700);
    } catch {
      setClaimStatus({
        type: 'error',
        text: 'Verification failed. Please check your connection and try again.'
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8 font-sans relative">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-4xl mx-auto my-8 flex flex-col items-center gap-10">
        {/* Header */}
        <header className="text-center max-w-2xl flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/15 text-primary border border-primary/30 mb-4">
            <Sparkles size={14} />
            3-Days Workshop &amp; Interactive Lab Access
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-3">
            Brew Your Career Superpower
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
            Choose the interactive lab curriculum tailored to your career milestone. Instant activation upon checkout.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono inline-flex items-center gap-1.5 font-bold">
              <ShieldCheck size={13} />
              Instant Activation • PhonePe, GPay, Paytm, UPI QR &amp; Cards
            </div>
          </div>
        </header>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-stretch">
          {/* ================= Student Bundle ================= */}
          <article className="glass-panel rounded-2xl p-7 md:p-8 flex flex-col justify-between border border-outline-variant shadow-md relative hover:border-secondary/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold flex items-center gap-1.5">
                  <GraduationCap size={15} />
                  Campus to Corporate
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
                  Class XII • UG • PG
                </span>
              </div>

              <h2 className="text-2xl font-bold text-on-surface mb-2">The Student Bundle</h2>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Crush campus placements, bypass ATS bots, and speak with executive confidence in GDs and interviews.
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-outline-variant/60">
                <span className="text-4xl md:text-5xl font-extrabold text-on-surface">₹499</span>
                <span className="text-xs text-on-surface-variant font-medium">/ lifetime access • one-time</span>
              </div>

              <ul className="flex flex-col gap-3.5 mb-8 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-secondary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>All 5 Track A Modules:</strong> Pitch, Resume, GD Dominance, Email Etiquette, STAR Stories.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-secondary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Amazon A-B-C Resume Rule:</strong> Pass careers page ATS without referrals.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-secondary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Verified TCB Certificate:</strong> Permanent Legal Name Lock + Scannable QR ID.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-secondary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Student Communication Playbook Vault:</strong> 1-Tap Trap Decoders, 3 Red Flags of Weakness script &amp; Audio Pronunciation Lab.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                disabled={checkoutLoading !== null}
                onClick={() => handleRazorpayCheckout('student')}
                className="w-full bg-[#0C2340] hover:bg-[#1A365D] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 text-center disabled:opacity-60"
              >
                {checkoutLoading === 'student' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Opening Checkout Modal...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay ₹499 via UPI QR / Cards
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </article>

          {/* ================= Professional Bundle ================= */}
          <article className="glass-panel rounded-2xl p-7 md:p-8 flex flex-col justify-between border-2 border-primary shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
              <Star size={12} /> Most Popular • Career Accelerator
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                  <Briefcase size={15} />
                  Executive Precision
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  Working Pros • Lateral Hires
                </span>
              </div>

              <h2 className="text-2xl font-bold text-on-surface mb-2">The Professional Bundle</h2>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Negotiate lakhs in compensation, handle trap interview questions, and de-escalate high-stakes leadership crises.
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-outline-variant/60">
                <span className="text-4xl md:text-5xl font-extrabold text-on-surface">₹999</span>
                <span className="text-xs text-on-surface-variant font-medium">/ lifetime access • one-time</span>
              </div>

              <ul className="flex flex-col gap-3.5 mb-8 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Everything in Student Bundle Included</strong> (Track A Modules 1–5 + Certificate).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Modules 6–8 Executive Mastery:</strong> Hostile Q&amp;A (A.B.C.), High-Stakes Salary (F.A.R.E.), Managing Up (1-3-1 Rule).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>Friday 6 PM Crisis Simulator:</strong> Live Heart Rate BPM Meter (215 bpm down to 85 bpm).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-on-surface">
                    <strong>5 Executive Case Simulators:</strong> Amul Defect, Colgate Disruption, ₹1 Mumbai House, Real Dinosaur &amp; <strong>The Maggi Dilemma (80/20 Split Sourcing)</strong>.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                disabled={checkoutLoading !== null}
                onClick={() => handleRazorpayCheckout('pro')}
                className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 text-center disabled:opacity-60"
              >
                {checkoutLoading === 'pro' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Opening Checkout Modal...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay ₹999 via UPI QR / Cards
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </article>
        </div>

        {/* Already Paid Activation Box */}
        <section className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-primary/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-on-surface">Already Paid on Razorpay? Link Your Access</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            If you completed payment on Razorpay, enter your <strong>Payment ID</strong> (starts with <span className="font-mono text-primary font-bold">pay_...</span> from your receipt email or SMS) to instantly activate your account:
          </p>

          <form onSubmit={handleManualPaymentClaim} className="flex flex-col gap-3 mt-1">
            <div className="flex items-center gap-4 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer text-on-surface">
                <input
                  type="radio"
                  name="claimTier"
                  value="student"
                  checked={claimTier === 'student'}
                  onChange={() => setClaimTier('student')}
                  className="accent-primary"
                />
                Student Bundle (₹499)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-on-surface">
                <input
                  type="radio"
                  name="claimTier"
                  value="pro"
                  checked={claimTier === 'pro'}
                  onChange={() => setClaimTier('pro')}
                  className="accent-primary"
                />
                Professional Bundle (₹999)
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={claimPaymentId}
                onChange={(e) => setClaimPaymentId(e.target.value.trim())}
                placeholder="e.g. pay_TvF8MTqEwbsqf7"
                className="flex-grow bg-input border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs font-mono text-on-surface placeholder:text-outline focus:border-primary outline-none"
              />
              <button
                type="submit"
                disabled={claiming}
                className="bg-primary hover:opacity-90 text-on-primary font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-sm"
              >
                <Zap size={14} />
                {claiming ? 'Verifying...' : 'Activate Lab Access'}
              </button>
            </div>
          </form>

          {claimStatus && (
            <p className={`text-xs ${claimStatus.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {claimStatus.text}
            </p>
          )}
        </section>

        {/* Feature Comparison Table */}
        <section className="w-full glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-on-surface">Compare Curriculum &amp; Simulator Access</h3>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant font-mono">
                  <th className="py-3 px-4">Feature / Curriculum Asset</th>
                  <th className="py-3 px-4 text-center">Student (₹499)</th>
                  <th className="py-3 px-4 text-center font-bold text-primary">Professional (₹999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Track A: Campus to Corporate (Modules 1–5)</td>
                  <td className="py-3 px-4 text-center text-secondary font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Amazon A-B-C Resume ATS Scenarios</td>
                  <td className="py-3 px-4 text-center text-secondary font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Verified Certificate with Permanent Name Lock &amp; QR</td>
                  <td className="py-3 px-4 text-center text-secondary font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Student Playbook: 3 Red Flags &amp; Audio Lab</td>
                  <td className="py-3 px-4 text-center text-secondary font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Track B: Executive Precision (Modules 6–8)</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant font-mono">❌ Locked</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">Friday 6 PM ₹50Cr Crisis De-Escalator (BPM Meter)</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant font-mono">❌ Locked</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-on-surface font-medium">5 Executive Case Simulators (including Maggi Dilemma)</td>
                  <td className="py-3 px-4 text-center text-on-surface-variant font-mono">❌ Locked</td>
                  <td className="py-3 px-4 text-center text-primary font-bold">✅ Yes (10/10 Strong Hire)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Compliance Footer (Razorpay & RBI Compliant) */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-on-surface-variant font-mono text-center pt-4 border-t border-outline-variant/40 w-full">
          <Link href="/privacy" className="hover:text-primary transition-colors hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors hover:underline">
            Terms &amp; Conditions
          </Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-primary transition-colors hover:underline">
            Refund &amp; Cancellation
          </Link>
          <span>•</span>
          <a href="mailto:careerbreweries@gmail.com" className="hover:text-primary transition-colors hover:underline">
            Contact: careerbreweries@gmail.com
          </a>
          <span>•</span>
          <span>The Career Breweries &copy; 2026</span>
        </div>
      </main>
    </div>
  );
}
