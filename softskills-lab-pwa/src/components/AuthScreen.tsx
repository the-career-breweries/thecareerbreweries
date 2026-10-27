"use client";

import ThemeToggle from './ThemeToggle';
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setCurrentUserEmail(data.user.email);
      }
    });
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUserEmail(null);
    setStatusMsg({ type: 'info', text: 'Signed out successfully.' });
  };

  const handleDemoAccess = (customName?: string) => {
    const cleanName = (customName || fullName || 'TCB Executive Learner').trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem('tcb_learner_name', cleanName);
      localStorage.setItem('tcb_name_locked', 'true');
      localStorage.setItem('tcb_unlocked_bundle', 'pro');
    }
    setStatusMsg({
      type: 'success',
      text: `Welcome, ${cleanName}! Redirecting to Diagnostic Assessment...`
    });
    setTimeout(() => router.push('/diagnostic'), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!isLogin && !fullName.trim()) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter your Full Legal Name. It will be permanently locked to your certificate.'
      });
      return;
    }

    if (!email || !password) {
      setStatusMsg({ type: 'error', text: 'Please enter both your email address and password.' });
      return;
    }

    if (password.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      if (!isLogin && typeof window !== 'undefined') {
        localStorage.setItem('tcb_learner_name', fullName.trim());
        localStorage.setItem('tcb_name_locked', 'true');
      }
      setStatusMsg({
        type: 'info',
        text: 'Redirecting to Diagnostic Assessment...'
      });
      setTimeout(() => router.push('/diagnostic'), 800);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setCurrentUserEmail(data.user?.email || email);
        if (typeof window !== 'undefined' && data.user?.user_metadata?.full_name) {
          localStorage.setItem('tcb_learner_name', data.user.user_metadata.full_name);
          localStorage.setItem('tcb_name_locked', 'true');
        }
        setStatusMsg({ type: 'success', text: 'Logged in! Redirecting to your learning path...' });
        setTimeout(() => router.push('/dashboard'), 700);
      } else {
        const cleanName = fullName.trim();
        if (typeof window !== 'undefined') {
          localStorage.setItem('tcb_learner_name', cleanName);
          localStorage.setItem('tcb_name_locked', 'true');
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: cleanName,
              name_locked: true,
              has_student_bundle: false,
              has_pro_bundle: false,
              diagnostic_completed: false,
              workshop_completion_pct: 0,
            }
          }
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: cleanName
          });
        }

        if (data.user && !data.session) {
          setStatusMsg({
            type: 'info',
            text: 'Account registered in Supabase! Check your email for the confirmation link, or click below to start your Diagnostic Assessment right away.'
          });
        } else {
          setCurrentUserEmail(data.user?.email || email);
          setStatusMsg({ type: 'success', text: 'Account created & certificate identity locked! Redirecting...' });
          setTimeout(() => router.push('/diagnostic'), 800);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setStatusMsg({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/diagnostic`
      }
    });
    if (error) {
      setStatusMsg({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  const isRateLimitError = statusMsg?.type === 'error' && statusMsg.text.toLowerCase().includes('rate limit');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>

      <main className="w-full max-w-md bg-surface-container rounded-xl shadow-lg border border-outline-variant p-8 relative overflow-hidden backdrop-blur-md">
        {/* Header */}
        <header className="flex flex-col items-center mb-8">
          <img
            alt="The Career Breweries Logo"
            className="w-24 h-24 mb-4 rounded-full object-contain shadow-sm"
            src="/tcb-logo.png"
          />
          <h1 className="text-2xl font-bold text-on-surface mb-2">Softskills Lab</h1>
          <p className="text-sm text-on-surface-variant text-center">
            Elevate your career through high-impact communication.
          </p>
        </header>

        {currentUserEmail && (
          <div className="mb-6 p-3.5 rounded-lg bg-primary/10 border border-primary/30 text-xs flex items-center justify-between gap-2">
            <div>
              <span className="text-on-surface-variant block">Signed in as</span>
              <strong className="text-on-surface">{currentUserEmail}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Status Message / Error Card */}
        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm flex flex-col gap-3 ${
              statusMsg.type === 'error'
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-primary/10 border-primary/40 text-primary'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {statusMsg.type === 'error' ? (
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
              )}
              <div className="flex flex-col gap-1">
                {isRateLimitError ? (
                  <>
                    <strong className="text-red-200">Supabase Email Rate Limit Exceeded</strong>
                    <span className="text-xs text-on-surface-variant leading-relaxed">
                      Supabase free-tier limits confirmation emails to ~3/hour. 
                      If your account already exists, switch to <strong>Log In</strong> (which doesn&apos;t send emails). 
                      Or continue directly in Demo Mode without waiting!
                    </span>
                  </>
                ) : (
                  <span>{statusMsg.text}</span>
                )}
              </div>
            </div>

            {/* Smart Resolution Buttons on Rate Limit */}
            {isRateLimitError && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-red-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setStatusMsg(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-variant border border-outline-variant text-xs font-bold text-on-surface hover:border-primary"
                >
                  Try Logging In Instead →
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAccess(fullName || 'Test Learner')}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <Zap size={12} /> Continue to Lab (Bypass)
                </button>
              </div>
            )}

            {statusMsg.type === 'info' && statusMsg.text.includes('Diagnostic') && (
              <Link
                href="/diagnostic"
                className="self-end text-xs font-bold underline flex items-center gap-1 mt-1"
              >
                Continue to Diagnostic Assessment <ArrowRight size={12} />
              </Link>
            )}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface" htmlFor="fullName">
                Full Legal Name <span className="text-xs text-secondary">(For Official Certificate)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
                <input
                  className="w-full bg-input border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary input-glow transition-all duration-200 outline-none"
                  id="fullName"
                  placeholder="e.g., S D Sandarsh"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <ShieldCheck size={12} className="text-primary flex-shrink-0" />
                Permanently bound to your account upon sign-up — cannot be edited later.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
                className="w-full bg-input border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary input-glow transition-all duration-200 outline-none"
                id="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
              <input
                className="w-full bg-input border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary input-glow transition-all duration-200 outline-none"
                id="password"
                placeholder="••••••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
            type="submit"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
          </button>

          <div className="flex items-center my-1">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-3 text-xs text-outline uppercase font-mono">or</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-transparent border border-outline text-on-surface font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </button>

            {/* Instant Demo Access Button */}
            <button
              onClick={() => handleDemoAccess(fullName || 'TCB Learner')}
              type="button"
              className="w-full bg-surface-variant/80 hover:bg-surface-variant border border-outline-variant text-on-surface text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap size={14} className="text-secondary" />
              Instant Workshop / Demo Access (No Email Required)
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setStatusMsg(null);
            }}
            className="text-on-surface-variant hover:text-primary transition-colors text-sm cursor-pointer"
          >
            {isLogin ? (
              <>Don&apos;t have an account? <span className="text-primary font-semibold">Create Account</span></>
            ) : (
              <>Already have an account? <span className="text-primary font-semibold">Log in</span></>
            )}
          </button>
        </footer>
      </main>

      <div className="mt-4 flex items-center gap-4 text-xs text-on-surface-variant font-mono">
        <Link href="/privacy" className="hover:text-primary transition-colors hover:underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <span>The Career Breweries &copy; 2026</span>
      </div>

      {/* Quick Preview Nav Bar */}
      <nav className="mt-6 flex items-center gap-2 text-xs bg-surface-container border border-outline-variant px-4 py-2 rounded-full shadow-sm">
        <span className="text-on-surface-variant font-medium">Screens:</span>
        <Link href="/" className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-semibold">1. Auth</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/diagnostic" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">2. Diagnostic</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/paywall" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">3. Paywall</Link>
        <ArrowRight size={12} className="text-outline" />
        <Link href="/dashboard" className="px-2.5 py-1 rounded-full hover:bg-surface-variant text-on-surface">4. Dashboard</Link>
      </nav>
    </div>
  );
}
