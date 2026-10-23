"use client";

import ThemeToggle from './ThemeToggle';
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Briefcase,
  GraduationCap,
  Star,
  Award,
  CreditCard,
  HeartPulse,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function PaywallScreen() {
  const router = useRouter();
  const [unlocking, setUnlocking] = useState<'student' | 'pro' | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  useEffect(() => {
    // Load Razorpay standard checkout script dynamically
    if (typeof window !== 'undefined') {
      const existingScript = document.getElementById('razorpay-checkout-js');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
      } else {
        setRazorpayLoaded(true);
      }
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          if (data.user.email) setUserEmail(data.user.email);
          const meta = data.user.user_metadata || {};
          if (meta.full_name) setUserName(meta.full_name);
        }
      });
    }
  }, []);

  const completeUnlock = async (bundle: 'student' | 'pro', paymentId?: string) => {
    setUnlocking(bundle);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcb_unlocked_bundle', bundle);
      if (paymentId) {
        localStorage.setItem(`tcb_payment_${bundle}`, paymentId);
      }
    }

    try {
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
            payment_id: paymentId || 'DEMO_UNLOCK',
            ...updates
          });
        }
      }
    } catch {
      // Fallback to localStorage if unauthenticated or Supabase offline
    } finally {
      setUnlocking(null);
      router.push('/dashboard');
    }
  };

  const handleCheckout = async (bundle: 'student' | 'pro') => {
    setUnlocking(bundle);

    try {
      // Step 1: Call our server route to create a genuine Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundle,
          email: userEmail,
          name: userName
        })
      });

      const orderData = await res.json();

      // If Razorpay keys are not configured or demo mode returned, bypass instantly
      if (orderData.demo || !orderData.orderId || !window.Razorpay) {
        await completeUnlock(bundle);
        return;
      }

      // Step 2: Open standard Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Career Breweries',
        description:
          bundle === 'pro'
            ? 'Professional Bundle — 3-Days Workshop & Lab'
            : 'Student Bundle — 3-Days Workshop & Lab',
        order_id: orderData.orderId,
        image: '/tcb-logo.png',
        prefill: {
          name: userName || 'TCB Learner',
          email: userEmail || 'learner@tcb.edu'
        },
        theme: {
          color: '#885A3A'
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Verify cryptographic signature on the server
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                bundle
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              await completeUnlock(bundle, response.razorpay_payment_id);
            } else {
              alert('Payment verification could not be confirmed. Please contact support.');
              setUnlocking(null);
            }
          } catch (e) {
            console.error('Verification error:', e);
            await completeUnlock(bundle, response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: function () {
            setUnlocking(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        alert(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
        setUnlocking(null);
      });
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback to demo unlock so user is never stuck
      await completeUnlock(bundle);
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
            Choose the interactive lab curriculum tailored to your career milestone. Includes scenario simulators, live script synthesizers, and verified credentials.
          </p>

          {!razorpayKey && (
            <div className="mt-4 px-3.5 py-1.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-xs font-mono inline-flex items-center gap-2">
              <Zap size={13} />
              Instant Workshop Demo Mode Active (Clicking unlock will immediately grant lifetime access)
            </div>
          )}
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

            <button
              onClick={() => handleCheckout('student')}
              disabled={unlocking !== null}
              className="w-full bg-surface-variant hover:bg-secondary hover:text-on-secondary text-on-surface border border-outline-variant font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {unlocking === 'student' ? (
                'Unlocking Student Bundle...'
              ) : (
                <>
                  <CreditCard size={16} />
                  {razorpayKey ? 'Unlock for ₹499' : 'Unlock Student (Instant Demo)'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
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

            <button
              onClick={() => handleCheckout('pro')}
              disabled={unlocking !== null}
              className="w-full bg-primary text-on-primary font-bold py-3.5 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {unlocking === 'pro' ? (
                'Unlocking Professional Bundle...'
              ) : (
                <>
                  <CreditCard size={16} />
                  {razorpayKey ? 'Unlock for ₹999' : 'Unlock Professional (Instant Demo)'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </article>
        </div>

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

        {/* Quick Nav Bar */}
        <nav className="flex items-center gap-2 text-xs bg-surface-container border border-outline-variant px-4 py-2 rounded-full shadow-sm">
          <span className="text-on-surface-variant font-medium">Screens:</span>
          <Link href="/" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">1. Auth</Link>
          <ArrowRight size={12} className="text-outline" />
          <Link href="/diagnostic" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">2. Diagnostic</Link>
          <ArrowRight size={12} className="text-outline" />
          <Link href="/paywall" className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-semibold">3. Paywall</Link>
          <ArrowRight size={12} className="text-outline" />
          <Link href="/dashboard" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">4. Dashboard</Link>
        </nav>
      </main>
    </div>
  );
}
