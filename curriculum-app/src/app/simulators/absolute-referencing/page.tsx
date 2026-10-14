'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import AbsoluteReferencingSimulator from '@/components/AbsoluteReferencingSimulator';

export default function AbsoluteReferencingPage() {
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
        maxWidth: '920px',
        margin: '0 auto 2rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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
          gap: '8px',
          fontSize: '0.82rem',
          color: '#94a3b8'
        }}>
          <BookOpen size={16} color="#eab308" />
          <span>Unit 3: MS Excel & Google Sheets · Session 14</span>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ maxWidth: '920px', margin: '0 auto 2rem auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(234, 179, 8, 0.12)',
          color: '#facc15',
          fontSize: '0.78rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <Sparkles size={14} /> Interactive Formula Simulator
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
          Absolute Cell Referencing (<span style={{ color: '#facc15' }}>$</span>) Simulator
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', margin: 0, maxWidth: '650px', marginInline: 'auto' }}>
          Toggle the dollar lock on and off. Watch what happens when AutoFill drags a formula down across passenger rows in both Microsoft Excel and Google Sheets.
        </p>
      </div>

      {/* Simulator Component */}
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <AbsoluteReferencingSimulator />
      </div>

      {/* Bottom Notes */}
      <div style={{
        maxWidth: '920px',
        margin: '2.5rem auto 0 auto',
        padding: '1.25rem 1.5rem',
        background: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        fontSize: '0.88rem',
        color: '#cbd5e1',
        lineHeight: '1.6'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>
          💡 Key Takeaway for Exams & Aviation Job Roles:
        </h3>
        <p style={{ margin: 0 }}>
          In airline revenue management and airport billing, a single tax or discount rate is often stored in one cell. 
          When applying that rate to hundreds of flight bookings, you <strong>MUST lock the reference with dollar signs ($D$1)</strong>. 
          Without it, Excel and Google Sheets shift the cell reference down into empty rows, turning multi-lakh invoices into ₹0 calculation errors.
        </p>
      </div>
    </div>
  );
}
