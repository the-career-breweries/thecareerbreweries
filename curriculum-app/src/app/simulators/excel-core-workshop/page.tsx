'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles, Layers, Calculator } from 'lucide-react';
import ExcelCoreWorkshopSimulator from '@/components/ExcelCoreWorkshopSimulator';

export default function ExcelCoreWorkshopPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      padding: '2rem 1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Navigation */}
      <div style={{
        maxWidth: '1060px',
        margin: '0 auto 2rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <Link
          href="/computing-skills"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#38bdf8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={16} /> Back to Computing Skills
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/simulators/excel-demo-datasets"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            <Sparkles size={14} color="#38bdf8" /> 📊 Demo Datasets &amp; CSVs
          </Link>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            color: '#94a3b8'
          }}>
            <BookOpen size={16} color="#eab308" />
            <span>Unit 3: Spreadsheet Software · Post-Session 6 Fast-Track Lab (Sessions 1–6)</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ maxWidth: '1060px', margin: '0 auto 2.25rem auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(56, 189, 248, 0.12)',
          color: '#38bdf8',
          fontSize: '0.78rem',
          fontWeight: 800,
          padding: '4px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <Sparkles size={14} /> 2–4 Hour Intensive Workshop Simulator
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
          Spreadsheet Core Essentials Lab (Sessions 1–6)
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', margin: 0, maxWidth: '780px', marginInline: 'auto', lineHeight: '1.6' }}>
          Consolidates the foundation of MS Excel &amp; Google Sheets into 4 interactive aviation laboratories: 
          <strong> Basic Math (PEMDAS)</strong>, <strong>Cell Referencing ($)</strong>, 
          <strong> Statistical Functions</strong>, and <strong>Logical &amp; Text Functions</strong>.
        </p>
      </div>

      {/* Simulator Component */}
      <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
        <ExcelCoreWorkshopSimulator />
      </div>

      {/* Workshop Exam & Operational Takeaways */}
      <div style={{
        maxWidth: '1060px',
        margin: '2.5rem auto 0 auto',
        padding: '1.5rem 1.75rem',
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        fontSize: '0.88rem',
        color: '#cbd5e1',
        lineHeight: '1.6'
      }}>
        <h3 style={{ margin: '0 0 0.75rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#38bdf8" />
          Sessions 1–6 Fast-Track Master Checklist (Quick Revision):
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '1rem' }}>
          <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <strong style={{ color: '#38bdf8' }}>1. Basic Math (Session 3):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Always bracket calculations <code>=(B3 - C3) * D3</code> to enforce subtraction before multiplication (PEMDAS / BODMAS).
            </p>
          </div>
          <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <strong style={{ color: '#eab308' }}>2. Cell Referencing (Session 4):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Press <code>F4</code> (or <code>Fn+F4</code>) to cycle <code>$A$1</code> ➔ <code>A$1</code> ➔ <code>$A1</code>. Prevents empty-cell shift during AutoFill.
            </p>
          </div>
          <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <strong style={{ color: '#a855f7' }}>3. Statistical Functions (Session 5):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              <code>SUM</code> adds numbers, <code>AVERAGE</code> divides sum by count, <code>MAX/MIN</code> find extremes, <code>COUNT</code> counts numbers only, <code>COUNTA</code> counts text.
            </p>
          </div>
          <div style={{ background: '#0f172a', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <strong style={{ color: '#10b981' }}>4. Logical &amp; Text (Session 6):</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              <code>=IF(test, true_val, false_val)</code> drives automated status flags. Pair with <code>PROPER</code>, <code>TRIM</code>, and <code>LEFT</code> to sanitize raw passenger manifests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
