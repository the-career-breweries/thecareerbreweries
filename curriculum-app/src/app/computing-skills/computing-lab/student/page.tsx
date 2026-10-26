"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileSpreadsheet, ShieldCheck, Sun, Moon, ArrowLeft } from 'lucide-react';
import StudentEvaluationPortal from '@/components/StudentEvaluationPortal';

export default function StudentEvaluationPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('lab_portal_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('lab_portal_theme', next);
  };

  const t = {
    bg: isDark ? '#090d16' : '#f8fafc',
    headerBg: isDark ? '#0f172a' : '#ffffff',
    border: isDark ? '#1e293b' : '#e2e8f0',
    text: isDark ? '#f8fafc' : '#0f172a',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    cardBgAlt: isDark ? '#1e293b' : '#f1f5f9',
    textSecondary: isDark ? '#cbd5e1' : '#334155'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Navbar */}
      <header style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.headerBg, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#10b981', color: '#090d16', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: t.text }}>
                Student Evaluation & Report Card Portal
              </h1>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
                Z7AVA 26209
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', margin: '2px 0 0', color: t.textMuted }}>
              Department of Aviation & Aerospace Studies | Academic Performance Verification
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              background: t.cardBgAlt,
              border: `1px solid ${t.border}`,
              color: t.textSecondary,
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            {isDark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <Link
            href="/computing-skills/computing-lab"
            style={{ textDecoration: 'none', color: t.textMuted, fontSize: '0.82rem', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <ArrowLeft size={14} /> Back to Lab Assignment Portal
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 20px' }}>
        <StudentEvaluationPortal theme={theme} />
      </main>

    </div>
  );
}
