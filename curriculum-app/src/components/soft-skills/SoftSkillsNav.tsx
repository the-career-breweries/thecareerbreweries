"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Layers, 
  Sparkles, 
  BarChart3, 
  Camera, 
  ClipboardCheck, 
  Users, 
  BookOpen, 
  Lock, 
  Sun, 
  Moon 
} from 'lucide-react';

interface SoftSkillsNavProps {
  children?: React.ReactNode;
}

export default function SoftSkillsNav({ children }: SoftSkillsNavProps) {
  const pathname = usePathname();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if already unlocked in this session
    const unlocked = sessionStorage.getItem('tcb-softskills-unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }

    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handlePasskeyChange = (val: string) => {
    setPasskey(val);
    if (val === '2525') {
      sessionStorage.setItem('tcb-softskills-unlocked', 'true');
      setIsUnlocked(true);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('app-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navItems = [
    { label: 'Classroom Slides', href: '/soft-skills', icon: BookOpen, matchExact: true },
    { label: 'Master Topics', href: '/soft-skills/topics', icon: Layers, matchExact: true },
    { label: 'Activities Guide', href: '/soft-skills/topics/list-of-activities', icon: Sparkles },
    { label: 'EnglishScore Hub', href: '/soft-skills/topics/englishscore', icon: BarChart3 },
    { label: 'Media Evidence', href: '/soft-skills/topics/confidence-mindset/photos-and-videos', icon: Camera, matchPrefix: '/soft-skills/topics/' },
    { label: 'Sessions Tracker', href: '/soft-skills/sessions-tracker', icon: ClipboardCheck },
    { label: 'Student Profiles', href: '/soft-skills/students', icon: Users },
  ];

  if (!isUnlocked) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-app)',
        color: 'var(--text-main)',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          padding: '3rem 2.5rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%'
        }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            borderRadius: '50%',
            background: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent-primary)',
            marginBottom: '1rem'
          }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Enter Access Code</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            MH Cockpit Soft Skills Studio · Alliance University
          </p>
          <input
            type="password"
            value={passkey}
            onChange={(e) => handlePasskeyChange(e.target.value)}
            placeholder="••••"
            autoFocus
            style={{
              padding: '0.85rem 1rem',
              fontSize: '1.75rem',
              textAlign: 'center',
              letterSpacing: '0.4em',
              borderRadius: '10px',
              border: '2px solid var(--border-color)',
              background: 'var(--bg-app)',
              color: 'var(--text-main)',
              width: '100%',
              outline: 'none',
              marginBottom: '1rem',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Authorized Instructors & Evaluators Only
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Top Banner Navigation */}
      <header style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {/* Brand Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.2 }}>Soft Skills Studio</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Alliance University · MH Cockpit Calibration
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <nav style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '0 1rem',
          gap: '0.25rem',
          scrollbarWidth: 'none'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;
            if (item.matchExact) {
              isActive = pathname === item.href;
            } else if (item.label === 'Media Evidence') {
              isActive = pathname.includes('/photos-and-videos') || pathname.includes('/photos&videos');
            } else {
              isActive = pathname === item.href || (item.href !== '/soft-skills' && pathname.startsWith(item.href));
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.7rem 0.95rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
