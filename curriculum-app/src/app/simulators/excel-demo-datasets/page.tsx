'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Sparkles, FileSpreadsheet, Layers, Download } from 'lucide-react';
import ExcelDemoDatasetsHub from '@/components/ExcelDemoDatasetsHub';

export default function ExcelDemoDatasetsPage() {
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
        maxWidth: '1200px',
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
        <a
          href="/api/download-sample-datasets"
          download="Aviation_ICS_Student_Practice_Datasets_Batch2026.zip"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)'
          }}
          title="Download all 5 files in a ZIP bundle to send to your student WhatsApp/Teams group"
        >
          <Download size={16} /> 📦 Download Student Files Pack (.ZIP)
        </a>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/simulators/excel-core-workshop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Sparkles size={14} color="#38bdf8" /> 2–4 Hr Workshop Lab
          </Link>
          <Link
            href="/simulators/absolute-referencing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span>$ Absolute Referencing Simulator</span>
          </Link>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Alliance University · Aviation Department
          </span>
        </div>
      </div>

      {/* Main Interactive Hub */}
      <ExcelDemoDatasetsHub />
    </div>
  );
}
