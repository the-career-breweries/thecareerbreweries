"use client";

import React, { useEffect, useState } from 'react';
import { Download, Share2, X, Smartphone, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if Service Worker is supported and register it
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration fallback
      });

      // Don't show if already in standalone app mode
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as unknown as { standalone?: boolean }).standalone;

      if (isStandalone) {
        return;
      }

      // Check if user previously dismissed in this session
      if (sessionStorage.getItem('tcb_pwa_dismissed') === 'true') {
        return;
      }

      // Detect iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
      if (isAppleDevice) {
        setIsIos(true);
        // Show after a slight delay on iOS
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }

      // Android / Chrome / Edge listener
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback hint if prompt unavailable
      alert("To install, tap your browser's menu (⋮) and select 'Add to Home screen' or 'Install App'.");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
    } catch {
      // Ignore
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('tcb_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom Install Banner */}
      <aside
        aria-label="Install TCB Softskills Lab App"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md bg-surface-container/95 backdrop-blur-md border border-primary/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 text-on-surface animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
            <img
              src="/tcb-logo.png"
              alt="TCB Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs md:text-sm text-on-surface">TCB Softskills Lab</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold">
                Free App
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant line-clamp-1">
              Add to Home Screen for full-screen practice &amp; fast drills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            type="button"
            className="bg-primary hover:opacity-90 active:scale-95 text-on-primary font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download size={13} />
            Install App
          </button>
          <button
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss banner"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </aside>

      {/* iOS Instructions Modal */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowIosInstructions(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <Smartphone size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Install on iPhone / iPad</h3>
                <p className="text-xs text-on-surface-variant">Add to Home Screen in 2 taps</p>
              </div>
            </div>

            <ol className="flex flex-col gap-3 text-xs text-on-surface-variant list-decimal list-inside bg-surface-variant/50 p-3.5 rounded-xl border border-outline-variant">
              <li>
                Tap the <strong className="text-on-surface inline-flex items-center gap-1"><Share2 size={12} /> Share</strong> button in your Safari toolbar at the bottom.
              </li>
              <li>
                Scroll down and tap <strong className="text-on-surface">"Add to Home Screen"</strong>.
              </li>
              <li>
                Tap <strong className="text-on-surface">"Add"</strong> in the top-right corner.
              </li>
            </ol>

            <button
              onClick={() => setShowIosInstructions(false)}
              className="w-full bg-primary text-on-primary font-bold py-2.5 px-4 rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
