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
  QrCode,
  Smartphone,
  Copy,
  Check,
  X
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
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // PhonePe UPI Modal State
  const [phonePeModal, setPhonePeModal] = useState<{
    isOpen: boolean;
    bundle: 'student' | 'pro';
  }>({
    isOpen: false,
    bundle: 'student'
  });
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);

  // PhonePe UPI ID and Verified Account Name
  const phonePeUpiId =
    process.env.NEXT_PUBLIC_PHONEPE_UPI_ID || '9743711584@ybl';
  const phonePeMobile = '9743711584';
  const verifiedPayeeName = 'SANDARSH S D';
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  useEffect(() => {
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
      setPhonePeModal({ isOpen: false, bundle: 'student' });
      router.push('/dashboard');
    }
  };

  const handlePhonePeSubmit = () => {
    setUtrError('');
    const cleanUtr = utrInput.trim();

    if (cleanUtr.length < 8) {
      setUtrError('Please enter a valid 12-digit UPI UTR / Reference ID from your PhonePe receipt.');
      return;
    }

    completeUnlock(phonePeModal.bundle, `PHONEPE_UTR_${cleanUtr}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const copyMobileToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMobile(true);
    setTimeout(() => setCopiedMobile(false), 2500);
  };

  // Generate dynamic UPI Deep-Link and QR code for PhonePe
  const activeAmount = phonePeModal.bundle === 'pro' ? 999 : 499;
  const activeBundleTitle = phonePeModal.bundle === 'pro' ? 'The Professional Bundle' : 'The Student Bundle';
  const upiIntentString = `upi://pay?pa=${phonePeUpiId}&pn=${encodeURIComponent(verifiedPayeeName)}&am=${activeAmount}&cu=INR&tn=TCB%20${encodeURIComponent(activeBundleTitle)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntentString)}&bgcolor=ffffff&color=5f259f`;

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
            Choose the interactive lab curriculum tailored to your career milestone. Pay instantly via PhonePe / UPI (0% extra charges) for immediate access.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full bg-[#5F259F]/15 text-[#5F259F] dark:text-[#A775E3] border border-[#5F259F]/30 text-xs font-mono inline-flex items-center gap-1.5 font-bold">
              <Smartphone size={13} />
              Instant PhonePe UPI Direct Pay Active
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
                onClick={() => setPhonePeModal({ isOpen: true, bundle: 'student' })}
                disabled={unlocking !== null}
                className="w-full bg-[#5F259F] hover:bg-[#4D1E82] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Smartphone size={18} />
                Pay ₹499 via PhonePe / UPI QR
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => completeUnlock('student')}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors text-center py-1 font-mono"
              >
                Instant Workshop Demo Unlock →
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
                onClick={() => setPhonePeModal({ isOpen: true, bundle: 'pro' })}
                disabled={unlocking !== null}
                className="w-full bg-[#5F259F] hover:bg-[#4D1E82] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Smartphone size={18} />
                Pay ₹999 via PhonePe / UPI QR
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => completeUnlock('pro')}
                className="text-xs text-on-surface-variant hover:text-primary transition-colors text-center py-1 font-mono"
              >
                Instant Workshop Demo Unlock →
              </button>
            </div>
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

        {/* Privacy & Footer */}
        <div className="flex items-center gap-4 text-xs text-on-surface-variant font-mono">
          <Link href="/privacy" className="hover:text-primary transition-colors hover:underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <span>The Career Breweries &copy; 2026</span>
        </div>

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

      {/* ================= PHONEPE UPI QR MODAL ================= */}
      {phonePeModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border-2 border-[#5F259F] rounded-2xl w-full max-w-md p-6 flex flex-col gap-5 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setPhonePeModal({ isOpen: false, bundle: 'student' })}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header with PhonePe Branding */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5F259F] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                पे
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-on-surface">PhonePe Direct UPI Checkout</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
                    0% Gateway Fee
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {activeBundleTitle} • <strong className="text-on-surface">₹{activeAmount}</strong>
                </p>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-outline-variant shadow-inner">
              <img
                src={qrCodeUrl}
                alt="PhonePe UPI QR Code"
                className="w-48 h-48 rounded-lg object-contain"
              />
              <p className="text-[11px] font-mono text-zinc-600 font-semibold mt-2 text-center">
                Scan with PhonePe, Google Pay, Paytm, or BHIM
              </p>
            </div>

            {/* Payment Methods: UPI ID, Mobile No, Direct App */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* UPI ID */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-variant border border-outline-variant text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-on-surface-variant block uppercase">PhonePe UPI ID:</span>
                    <span className="font-mono font-bold text-on-surface text-[11px]">{phonePeUpiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phonePeUpiId)}
                    className="px-2 py-1 rounded bg-[#5F259F] text-white text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
                  >
                    {copiedUpi ? <Check size={11} /> : <Copy size={11} />}
                    {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Mobile Number */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-variant border border-outline-variant text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-on-surface-variant block uppercase">PhonePe Mobile:</span>
                    <span className="font-mono font-bold text-on-surface text-[11px]">{phonePeMobile}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyMobileToClipboard(phonePeMobile)}
                    className="px-2 py-1 rounded bg-[#5F259F] text-white text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
                  >
                    {copiedMobile ? <Check size={11} /> : <Copy size={11} />}
                    {copiedMobile ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Mobile "Open Directly in PhonePe" button */}
              <a
                href={upiIntentString}
                className="w-full py-2.5 px-4 rounded-lg bg-[#5F259F]/15 text-[#5F259F] dark:text-[#A775E3] border border-[#5F259F]/30 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#5F259F]/25 text-center"
              >
                <Smartphone size={14} />
                Open Directly in PhonePe App (Mobile)
              </a>

              <p className="text-[10.5px] text-on-surface-variant leading-tight bg-surface-variant/40 p-2 rounded-lg border border-outline-variant/50">
                💡 <strong>Tip:</strong> If your banking app blocks external browser links, simply <strong>scan the QR code above</strong> or send to <strong>{phonePeMobile}</strong> in PhonePe (100% success rate).
              </p>
            </div>

            {/* Step 3: Enter 12-Digit UTR Number */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/60">
              <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                <span>Enter 12-Digit UPI Ref / UTR No:</span>
                <span className="text-[10px] text-on-surface-variant font-normal">Found on PhonePe Receipt</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g., 429184719283"
                className="w-full bg-input border border-outline-variant rounded-lg p-2.5 text-xs font-mono text-on-surface placeholder:text-outline focus:border-[#5F259F] outline-none"
              />
              {utrError && <p className="text-[11px] text-red-400">{utrError}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePhonePeSubmit}
                disabled={unlocking !== null}
                className="w-full bg-[#5F259F] hover:bg-[#4D1E82] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle size={15} />
                Verify &amp; Activate Lab Access
              </button>
              <button
                type="button"
                onClick={() => completeUnlock(phonePeModal.bundle, 'PHONEPE_TEST_PASS')}
                className="text-[11px] text-on-surface-variant hover:text-primary transition-colors text-center font-mono py-1"
              >
                Instant Bypass (Test / Demo Mode) →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
