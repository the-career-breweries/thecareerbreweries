"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCw,
  Save,
  Trash2,
  Sparkles,
  Clock,
  User,
  Hash,
  Sun,
  Moon
} from 'lucide-react';

interface SubmissionRecord {
  id: string;
  rollNo: string;
  studentName: string;
  submittedAt: string;
  originalFilename: string;
  fileSize: number;
  viva: {
    q1Answer: string;
    q2Answer: string;
    isCorrect: boolean;
    secondsTaken: number;
  };
  forensics: {
    application: string;
    appVersion: string;
    totalTimeMinutes: number;
    creator: string;
    lastModifiedBy: string;
    createdDate: string;
    modifiedDate: string;
    sheetNames: string[];
    totalFormulasFound: number;
    sampleFormulas: string[];
    flags: {
      isAiGenerator: boolean;
      isHoneypotTriggered: boolean;
      isTrapRecordFound: boolean;
      hasZeroEditTime: boolean;
      hasMissingSheets: boolean;
      hasNoFormulas: boolean;
    };
    integrityScore: number;
    integrityLevel: 'clean' | 'suspicious' | 'high_risk';
    summaryFindings: string[];
    autoGradeEstimate: {
      dataSetup: number;
      tasks: number;
      analysis: number;
      total: number;
    };
  };
  evaluation: {
    finalScore: number;
    instructorOverride: boolean;
    instructorRemarks: string;
    evaluatedAt: string | null;
  };
}

const INSTRUCTOR_PASSKEY = '2525';

export default function InstructorEvaluationConsole() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'clean'>('all');

  // Selected Submission for Deep Forensic Inspection
  const [selectedSub, setSelectedSub] = useState<SubmissionRecord | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(0);
  const [overrideRemarks, setOverrideRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('lab_portal_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('lab_portal_theme', nextTheme);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('instructor_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === INSTRUCTOR_PASSKEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('instructor_auth', 'true');
      setAuthError('');
      fetchSubmissions();
    } else {
      setAuthError('Incorrect instructor passkey. Please try again.');
    }
  };

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/lab/submissions?passkey=${INSTRUCTOR_PASSKEY}`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInspector = (sub: SubmissionRecord) => {
    setSelectedSub(sub);
    setOverrideScore(sub.evaluation.finalScore);
    setOverrideRemarks(sub.evaluation.instructorRemarks || '');
    setSaveSuccess('');
  };

  const handleSaveEvaluation = async () => {
    if (!selectedSub) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/lab/submissions?passkey=${INSTRUCTOR_PASSKEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSub.id,
          finalScore: overrideScore,
          instructorRemarks: overrideRemarks
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('Grade and remarks updated successfully!');
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Error updating evaluation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to remove this submission record?')) return;
    try {
      await fetch(`/api/lab/submissions?passkey=${INSTRUCTOR_PASSKEY}&id=${id}`, {
        method: 'DELETE'
      });
      fetchSubmissions();
      if (selectedSub?.id === id) {
        setSelectedSub(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return;
    const headers = [
      'Roll No',
      'Student Name',
      'Submitted At',
      'Application Generator',
      'Editing Time (Mins)',
      'Total Formulas',
      'AI Generator Flag',
      'Honeypot Flag',
      'Trap Record Flag',
      'Micro-Viva Status',
      'Auto-Grade Estimate',
      'Final Score',
      'Instructor Remarks'
    ];

    const rows = submissions.map((s) => [
      `"${s.rollNo}"`,
      `"${s.studentName}"`,
      `"${s.submittedAt}"`,
      `"${s.forensics.application}"`,
      s.forensics.totalTimeMinutes,
      s.forensics.totalFormulasFound,
      s.forensics.flags.isAiGenerator ? 'YES' : 'NO',
      s.forensics.flags.isHoneypotTriggered ? 'YES' : 'NO',
      s.forensics.flags.isTrapRecordFound ? 'YES' : 'NO',
      s.viva.isCorrect ? 'PASS' : 'FAIL',
      s.forensics.autoGradeEstimate.total,
      s.evaluation.finalScore,
      `"${s.evaluation.instructorRemarks.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lab_Evaluation_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalCount = submissions.length;
  const flaggedCount = submissions.filter((s) => s.forensics.integrityLevel !== 'clean').length;
  const cleanCount = totalCount - flaggedCount;
  const avgScore = totalCount > 0 ? (submissions.reduce((acc, s) => acc + s.evaluation.finalScore, 0) / totalCount).toFixed(1) : '0';

  // Filtered roster
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'flagged') return s.forensics.integrityLevel !== 'clean';
    if (filterMode === 'clean') return s.forensics.integrityLevel === 'clean';
    return true;
  });

  const isDark = theme === 'dark';

  const t = {
    bg: isDark ? '#090d16' : '#f8fafc',
    cardBg: isDark ? '#0f172a' : '#ffffff',
    cardBgAlt: isDark ? '#141e33' : '#f1f5f9',
    cardHeaderBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#334155',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    headerBg: isDark ? '#0f172a' : '#ffffff',
    inputBg: isDark ? '#090d16' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
    codeBg: isDark ? '#090d16' : '#e2e8f0',
    shadow: isDark
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      : '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
    accentEmerald: '#10b981',
    accentEmeraldBg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', maxWidth: '400px', width: '100%', padding: '32px', textAlign: 'center', boxShadow: t.shadow }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: t.accentEmeraldBg, color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: t.text }}>
            Instructor Evaluation Access
          </h2>
          <p style={{ fontSize: '0.84rem', color: t.textMuted, margin: '0 0 24px' }}>
            Enter your instructor passkey to access assignment submissions and AI forensic audits.
          </p>

          {authError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Instructor Passkey"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '12px', borderRadius: '8px', fontSize: '0.95rem', textAlign: 'center', letterSpacing: '0.2em', marginBottom: '16px', outline: 'none' }}
              required
            />
            <button
              type="submit"
              style={{ width: '100%', backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Verify Passkey & Enter
            </button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <Link href="/computing-skills/computing-lab" style={{ color: t.textMuted, fontSize: '0.8rem', textDecoration: 'none' }}>
              ← Return to Student Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: t.bg, color: t.text, fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'background-color 0.2s, color 0.2s' }}>
      
      {/* Top Header */}
      <header style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.headerBg, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#10b981', color: '#090d16', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: t.text }}>
                Evaluator Console & AI Forensic Audit
              </h1>
              <span style={{ fontSize: '0.72rem', backgroundColor: t.accentEmeraldBg, color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                Passkey 2525
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', margin: '2px 0 0', color: t.textMuted }}>
              Course Code: Z7AVA 26209 • Spreadsheets & Data Analytics Lab
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Light / Dark Toggle */}
          <button
            onClick={toggleTheme}
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
            {isDark ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={fetchSubmissions}
            style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, color: t.textSecondary, padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Roster
          </button>

          <button
            onClick={exportToCSV}
            style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export Marks (CSV)
          </button>

          <Link
            href="/computing-skills/computing-lab"
            style={{ textDecoration: 'none', color: t.textMuted, fontSize: '0.82rem', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, fontWeight: 500 }}
          >
            Student View
          </Link>
        </div>
      </header>

      {/* Overview Metric Cards */}
      <div style={{ maxWidth: '1400px', margin: '28px auto 0', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px', boxShadow: t.shadow }}>
            <div style={{ fontSize: '0.78rem', color: t.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Total Submissions
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: t.text }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.76rem', color: t.textMuted, marginTop: '4px' }}>Registered in Lab Roster</div>
          </div>

          <div style={{ backgroundColor: t.cardBg, border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '20px', boxShadow: t.shadow }}>
            <div style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Flagged for AI / Integrity
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171' }}>
              {flaggedCount}
            </div>
            <div style={{ fontSize: '0.76rem', color: t.textMuted, marginTop: '4px' }}>Metadata / Honeypot triggers</div>
          </div>

          <div style={{ backgroundColor: t.cardBg, border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '20px', boxShadow: t.shadow }}>
            <div style={{ fontSize: '0.78rem', color: '#10b981', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Authentic Submissions
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
              {cleanCount}
            </div>
            <div style={{ fontSize: '0.76rem', color: t.textMuted, marginTop: '4px' }}>Passed all integrity traps</div>
          </div>

          <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px', boxShadow: t.shadow }}>
            <div style={{ fontSize: '0.78rem', color: t.textMuted, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              Cohort Average Score
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8' }}>
              {avgScore} <span style={{ fontSize: '0.95rem', color: t.textMuted }}>/ 50</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: t.textMuted, marginTop: '4px' }}>Auto-calculated marks</div>
          </div>

        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ maxWidth: '1400px', margin: '28px auto 0', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', minWidth: '300px', flex: '1', maxWidth: '440px' }}>
          <Search size={16} color={t.textMuted} style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            placeholder="Search by Roll No or Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '11px 14px 11px 40px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{ backgroundColor: filterMode === 'all' ? '#10b981' : t.cardBg, color: filterMode === 'all' ? '#090d16' : t.textMuted, border: `1px solid ${filterMode === 'all' ? '#10b981' : t.border}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setFilterMode('flagged')}
            style={{ backgroundColor: filterMode === 'flagged' ? '#f43f5e' : t.cardBg, color: filterMode === 'flagged' ? '#ffffff' : t.textMuted, border: `1px solid ${filterMode === 'flagged' ? '#f43f5e' : t.border}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Flagged Only ({flaggedCount})
          </button>
          <button
            onClick={() => setFilterMode('clean')}
            style={{ backgroundColor: filterMode === 'clean' ? '#10b981' : t.cardBg, color: filterMode === 'clean' ? '#090d16' : t.textMuted, border: `1px solid ${filterMode === 'clean' ? '#10b981' : t.border}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Clean Only ({cleanCount})
          </button>
        </div>
      </div>

      {/* Master Submissions Roster */}
      <main style={{ maxWidth: '1400px', margin: '20px auto 60px', padding: '0 28px' }}>
        <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: t.shadow }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ backgroundColor: t.cardBgAlt, borderBottom: `1px solid ${t.border}`, color: t.textMuted }}>
                  <th style={{ padding: '16px 20px' }}>Roll No</th>
                  <th style={{ padding: '16px 20px' }}>Student Name</th>
                  <th style={{ padding: '16px 20px' }}>Application Generator</th>
                  <th style={{ padding: '16px 20px' }}>Edit Time</th>
                  <th style={{ padding: '16px 20px' }}>Formulas</th>
                  <th style={{ padding: '16px 20px' }}>Score</th>
                  <th style={{ padding: '16px 20px' }}>Integrity Status</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: t.textMuted }}>
                      No submissions found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((s) => {
                    const isFlagged = s.forensics.integrityLevel !== 'clean';
                    return (
                      <tr
                        key={s.id}
                        style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.04)' : 'transparent' }}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: t.text }}>
                          {s.rollNo}
                        </td>
                        <td style={{ padding: '16px 20px', color: t.textSecondary }}>
                          {s.studentName}
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '0.8rem', color: s.forensics.flags.isAiGenerator ? '#f87171' : t.textMuted }}>
                          {s.forensics.application || 'Unknown'}
                        </td>
                        <td style={{ padding: '16px 20px', color: s.forensics.flags.hasZeroEditTime ? '#f87171' : t.textMuted }}>
                          {s.forensics.totalTimeMinutes}m
                        </td>
                        <td style={{ padding: '16px 20px', color: s.forensics.totalFormulasFound > 0 ? '#10b981' : '#f87171', fontWeight: 600 }}>
                          {s.forensics.totalFormulasFound} cells
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: '#38bdf8' }}>
                          {s.evaluation.finalScore} / 50
                          {s.evaluation.instructorOverride && (
                            <span style={{ fontSize: '0.7rem', marginLeft: '4px', color: '#eab308' }}>*</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {s.forensics.integrityLevel === 'clean' ? (
                            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                              🟢 Authentic
                            </span>
                          ) : s.forensics.flags.isAiGenerator ? (
                            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                              🟡 AI Tool (openpyxl)
                            </span>
                          ) : s.forensics.flags.isHoneypotTriggered ? (
                            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                              🔴 Honeypot Injected
                            </span>
                          ) : s.forensics.flags.isTrapRecordFound ? (
                            <span style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                              🟠 Trap FL-199 Present
                            </span>
                          ) : (
                            <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                              ⚠️ Suspicious ({s.forensics.integrityScore}%)
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenInspector(s)}
                            style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', marginRight: '8px' }}
                          >
                            Inspect & Grade
                          </button>
                          <button
                            onClick={() => handleDeleteSubmission(s.id)}
                            style={{ backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: '#ef4444', padding: '8px', borderRadius: '6px', cursor: 'pointer', verticalAlign: 'middle' }}
                            title="Delete submission"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= DEEP FORENSIC INSPECTOR MODAL ================= */}
      {selectedSub && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 9999 }}>
          <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '16px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '30px', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: t.text }}>
                    {selectedSub.studentName} ({selectedSub.rollNo})
                  </h2>
                  <span style={{ fontSize: '0.78rem', backgroundColor: selectedSub.forensics.integrityLevel === 'clean' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.2)', color: selectedSub.forensics.integrityLevel === 'clean' ? '#10b981' : '#f87171', padding: '2px 10px', borderRadius: '4px', fontWeight: 800 }}>
                    Integrity: {selectedSub.forensics.integrityScore}/100
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: t.textMuted, margin: '4px 0 0' }}>
                  Submitted: {new Date(selectedSub.submittedAt).toLocaleString()} • File: {selectedSub.originalFilename}
                </p>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                style={{ backgroundColor: 'transparent', border: 'none', color: t.textMuted, fontSize: '1.3rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Findings & Traps Summary */}
            <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: t.text, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" /> AI Detection Trap & Forensic Audit
              </h3>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', lineHeight: 1.7, color: t.textSecondary }}>
                {selectedSub.forensics.summaryFindings.map((finding, idx) => (
                  <li key={idx} style={{ color: finding.includes('Authentic') ? '#10b981' : '#f87171' }}>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Forensic Detail Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              
              <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Software Generator</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: selectedSub.forensics.flags.isAiGenerator ? '#f87171' : t.text, marginTop: '2px' }}>
                  {selectedSub.forensics.application || 'Unknown'}
                </div>
              </div>

              <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Active Editing Time</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: selectedSub.forensics.flags.hasZeroEditTime ? '#f87171' : t.text, marginTop: '2px' }}>
                  {selectedSub.forensics.totalTimeMinutes} minutes
                </div>
              </div>

              <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Workbook Author (Metadata)</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: t.text, marginTop: '2px' }}>
                  {selectedSub.forensics.creator || 'None'}
                </div>
              </div>

              <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Micro-Viva Score</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: selectedSub.viva.isCorrect ? '#10b981' : '#f87171', marginTop: '2px' }}>
                  {selectedSub.viva.isCorrect ? 'PASSED (2/2)' : 'FAILED / TIMED OUT'} ({selectedSub.viva.secondsTaken}s)
                </div>
              </div>

            </div>

            {/* Sheets & Formulas */}
            <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '0.84rem' }}>
              <div style={{ marginBottom: '8px', color: t.text }}>
                <strong>Detected Sheets:</strong> {selectedSub.forensics.sheetNames.join(', ') || 'No sheets detected'}
              </div>
              <div style={{ marginBottom: '8px', color: t.text }}>
                <strong>Total Formula Cells:</strong> {selectedSub.forensics.totalFormulasFound}
              </div>
              {selectedSub.forensics.sampleFormulas.length > 0 && (
                <div>
                  <strong style={{ color: t.text }}>Sample Formulas Used:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                    {selectedSub.forensics.sampleFormulas.map((f, idx) => (
                      <code key={idx} style={{ backgroundColor: t.codeBg, color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        ={f}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Evaluation & Grading Section */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: t.text, margin: '0 0 14px' }}>
                Evaluation & Grade Assignment (Max 50 Marks)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '18px', backgroundColor: t.cardBgAlt, padding: '14px', borderRadius: '8px', fontSize: '0.82rem', textAlign: 'center' }}>
                <div>
                  <div style={{ color: t.textMuted }}>Data Setup</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedSub.forensics.autoGradeEstimate.dataSetup} / 5
                  </div>
                </div>
                <div>
                  <div style={{ color: t.textMuted }}>Tasks 1-4</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedSub.forensics.autoGradeEstimate.tasks} / 40
                  </div>
                </div>
                <div>
                  <div style={{ color: t.textMuted }}>Analysis</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedSub.forensics.autoGradeEstimate.analysis} / 5
                  </div>
                </div>
                <div>
                  <div style={{ color: t.textMuted }}>Auto Total</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    {selectedSub.forensics.autoGradeEstimate.total} / 50
                  </div>
                </div>
              </div>

              {saveSuccess && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '16px' }}>
                  {saveSuccess}
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div style={{ minWidth: '160px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                    Final Score (0–50)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Number(e.target.value))}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
                  />
                </div>

                <div style={{ flex: '1', minWidth: '280px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                    Instructor Remarks / Feedback
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Good Pivot Table formatting; delay chart labels verified."
                    value={overrideRemarks}
                    onChange={(e) => setOverrideRemarks(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setSelectedSub(null)}
                  style={{ backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: t.textMuted, padding: '10px 18px', borderRadius: '8px', fontSize: '0.86rem', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={handleSaveEvaluation}
                  disabled={isSaving}
                  style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 800, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Evaluation'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
