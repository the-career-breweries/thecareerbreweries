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
  Moon,
  Plus,
  BookOpen,
  Layers,
  CheckSquare,
  Square,
  FileText,
  Send,
  Check,
  ArrowRight
} from 'lucide-react';
import {
  TOPICS_DATA,
  SCENARIO_PRESETS,
  generateAssignmentFromCriteria,
  AssignmentTemplate
} from '@/lib/assignment-generator';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Navigation tab in Console: 'submissions' | 'generator' | 'library'
  const [activeConsoleTab, setActiveConsoleTab] = useState<'submissions' | 'generator' | 'library'>('submissions');

  // Submissions State
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'clean'>('all');

  // Inspection Drawer State
  const [selectedSub, setSelectedSub] = useState<SubmissionRecord | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(0);
  const [overrideRemarks, setOverrideRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Assignments Library State
  const [assignmentsList, setAssignmentsList] = useState<any[]>([]);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string>('blr-pivot-operations');
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);

  // Generator State
  const [genTopic, setGenTopic] = useState<'excel' | 'powerpoint' | 'word'>('excel');
  const [genSubtopics, setGenSubtopics] = useState<string[]>([
    '(i) Mathematical Functions & Arithmetic Formulae (SUM, AVERAGE, ROUND, PEMDAS, MIN/MAX, COUNT)',
    '(ii) Logical & Conditional Functions (IF, Nested IF, IFS, AND, OR, IFERROR)',
    '(iii) Lookup & Reference Functions (VLOOKUP, HLOOKUP, XLOOKUP, INDEX + MATCH)',
    '(iv) Pivot Tables, Slicers & Interactive Charts (Rows, Columns, Values, % of Row Total, Dual-Axis)'
  ]);
  const [genScenario, setGenScenario] = useState<string>(SCENARIO_PRESETS[0]);
  const [customScenario, setCustomScenario] = useState<string>('');
  const [genExerciseNumber, setGenExerciseNumber] = useState<string>('LAB EXERCISE 06');
  const [genTitle, setGenTitle] = useState<string>('');
  const [genMarks, setGenMarks] = useState<number>(50);
  const [genDeadline, setGenDeadline] = useState<string>('02 November, 2026 | 1700 hrs');
  const [generatedAssignment, setGeneratedAssignment] = useState<AssignmentTemplate | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string>('');
  const [publishError, setPublishError] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('lab_portal_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme('light');
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
      fetchAssignments();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === INSTRUCTOR_PASSKEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('instructor_auth', 'true');
      setAuthError('');
      fetchSubmissions();
      fetchAssignments();
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

  const fetchAssignments = async () => {
    setIsLoadingAssignments(true);
    try {
      const res = await fetch(`/api/lab/assignment?passkey=${INSTRUCTOR_PASSKEY}`);
      const data = await res.json();
      if (data.success) {
        setAssignmentsList(data.assignments || []);
        setActiveAssignmentId(data.activeAssignmentId || 'blr-pivot-operations');
      }
    } catch (err) {
      console.error('Failed to load assignments list:', err);
    } finally {
      setIsLoadingAssignments(false);
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

  // Subtopic checkbox toggler
  const handleToggleSubtopic = (subtopicName: string) => {
    if (genSubtopics.includes(subtopicName)) {
      setGenSubtopics(genSubtopics.filter((s) => s !== subtopicName));
    } else {
      setGenSubtopics([...genSubtopics, subtopicName]);
    }
  };

  // Switch topic and auto-select relevant subtopics
  const handleSelectTopic = (tKey: 'excel' | 'powerpoint' | 'word') => {
    setGenTopic(tKey);
    const defaults = TOPICS_DATA[tKey].subtopics.map((s) => s.name);
    setGenSubtopics(defaults.slice(0, 4));
    setGeneratedAssignment(null);
    setPublishSuccess('');
  };

  // Trigger generator
  const handleGenerateAssignment = () => {
    const finalScenario = customScenario.trim() || genScenario;
    const asgn = generateAssignmentFromCriteria({
      topic: genTopic,
      subtopics: genSubtopics,
      scenario: finalScenario,
      exerciseNumber: genExerciseNumber,
      totalMarks: genMarks,
      deadline: genDeadline,
      customTitle: genTitle.trim() || undefined
    });
    setGeneratedAssignment(asgn);
    setPublishSuccess('');
    setPublishError('');
  };

  // Save or Publish Assignment
  const handleSaveOrPublish = async (publishNow: boolean) => {
    if (!generatedAssignment) return;
    setIsPublishing(true);
    setPublishSuccess('');
    setPublishError('');

    try {
      const res = await fetch(`/api/lab/assignment?passkey=${INSTRUCTOR_PASSKEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignment: generatedAssignment,
          publishNow
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save assignment.');
      }

      setPublishSuccess(
        publishNow
          ? '🎉 Assignment Published Successfully! Students will now see this active assignment on the Student Portal.'
          : 'Assignment saved to your Library!'
      );

      fetchAssignments();
    } catch (err: any) {
      setPublishError(err.message || 'An error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Switch active assignment from library
  const handleSwitchActiveAssignment = async (targetId: string) => {
    try {
      const res = await fetch(`/api/lab/assignment?passkey=${INSTRUCTOR_PASSKEY}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeAssignmentId: targetId })
      });
      const data = await res.json();
      if (data.success) {
        setActiveAssignmentId(targetId);
        fetchAssignments();
      }
    } catch (err) {
      console.error('Error switching active assignment:', err);
    }
  };

  // Delete assignment from library
  const handleDeleteAssignment = async (id: string) => {
    if (id === 'blr-pivot-operations') {
      alert('Cannot delete the default Master Flight Operations assignment.');
      return;
    }
    if (!confirm('Are you sure you want to delete this assignment from your library?')) return;

    try {
      await fetch(`/api/lab/assignment?passkey=${INSTRUCTOR_PASSKEY}&id=${id}`, {
        method: 'DELETE'
      });
      fetchAssignments();
    } catch (err) {
      console.error('Error deleting assignment:', err);
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
    borderHighlight: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.5)',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#334155',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    headerBg: isDark ? '#0f172a' : '#ffffff',
    navBg: isDark ? '#0d1322' : '#f1f5f9',
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
            Enter your instructor passkey to access assignment submissions, AI forensic audits, and the Assignment Generator Studio.
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
                Evaluator Console & Assignment Studio
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

          {/* Quick Action: New Assignment Generator */}
          <button
            onClick={() => setActiveConsoleTab('generator')}
            style={{
              backgroundColor: '#10b981',
              color: '#090d16',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Sparkles size={15} /> Generate New Assignment
          </button>

          <button
            onClick={fetchSubmissions}
            style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, color: t.textSecondary, padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
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

      {/* Navigation Sub-Tabs */}
      <div style={{ backgroundColor: t.navBg, borderBottom: `1px solid ${t.border}`, padding: '0 28px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '28px' }}>
          <button
            onClick={() => setActiveConsoleTab('submissions')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 4px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeConsoleTab === 'submissions' ? '#10b981' : t.textMuted,
              borderBottom: activeConsoleTab === 'submissions' ? '3px solid #10b981' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={17} /> Submissions & Forensic Audit ({submissions.length})
          </button>

          <button
            onClick={() => setActiveConsoleTab('generator')}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 4px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeConsoleTab === 'generator' ? '#10b981' : t.textMuted,
              borderBottom: activeConsoleTab === 'generator' ? '3px solid #10b981' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={17} /> Assignment Generator Studio ✨
          </button>

          <button
            onClick={() => {
              setActiveConsoleTab('library');
              fetchAssignments();
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '16px 4px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeConsoleTab === 'library' ? '#10b981' : t.textMuted,
              borderBottom: activeConsoleTab === 'library' ? '3px solid #10b981' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={17} /> Assignments Library ({assignmentsList.length})
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SUBMISSIONS & FORENSIC AUDIT ================= */}
      {activeConsoleTab === 'submissions' && (
        <div>
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
        </div>
      )}

      {/* ================= TAB 2: ASSIGNMENT GENERATOR STUDIO ================= */}
      {activeConsoleTab === 'generator' && (
        <div style={{ maxWidth: '1400px', margin: '32px auto 80px', padding: '0 28px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ backgroundColor: t.accentEmeraldBg, color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                INSTRUCTOR STUDIO
              </span>
              <span style={{ fontSize: '0.8rem', color: t.textMuted }}>
                Curriculum Topic & Subtopic Alignment
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: t.text }}>
              Laboratory Assignment Generator Studio
            </h2>
            <p style={{ fontSize: '0.88rem', color: t.textMuted, margin: '4px 0 0' }}>
              Select your target software topic and subtopics to dynamically architect curriculum lab assignments complete with operational scenarios, rubrics, and AI traps.
            </p>
          </div>

          {publishSuccess && (
            <div style={{ backgroundColor: t.accentEmeraldBg, border: '1px solid #10b981', color: '#10b981', padding: '14px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} />
              {publishSuccess}
            </div>
          )}

          {publishError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '14px 20px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} />
              {publishError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', alignItems: 'start' }}>
            
            {/* Left Column: Generator Form Controls */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '28px', boxShadow: t.shadow, display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* 1. Tool / Software Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: t.text, marginBottom: '10px' }}>
                  1. Select Software Module (Topic) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {(['excel', 'powerpoint', 'word'] as const).map((tKey) => {
                    const isSelected = genTopic === tKey;
                    const meta = TOPICS_DATA[tKey];
                    return (
                      <button
                        key={tKey}
                        type="button"
                        onClick={() => handleSelectTopic(tKey)}
                        style={{
                          backgroundColor: isSelected ? t.accentEmeraldBg : t.cardBgAlt,
                          border: `2px solid ${isSelected ? '#10b981' : t.border}`,
                          color: isSelected ? '#10b981' : t.text,
                          padding: '14px 10px',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s'
                        }}
                      >
                        {tKey === 'excel' && <FileSpreadsheet size={24} />}
                        {tKey === 'powerpoint' && <Layers size={24} />}
                        {tKey === 'word' && <FileText size={24} />}
                        <span>{tKey === 'excel' ? 'Excel / Sheets' : tKey === 'powerpoint' ? 'PowerPoint' : 'MS Word'}</span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.75 }}>.{meta.fileType}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Subtopics Multi-Select */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 800, color: t.text }}>
                    2. Select Subtopics & Focus Areas *
                  </label>
                  <span style={{ fontSize: '0.74rem', color: t.textMuted }}>
                    {genSubtopics.length} selected
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {TOPICS_DATA[genTopic].subtopics.map((st) => {
                    const isChecked = genSubtopics.includes(st.name);
                    return (
                      <div
                        key={st.id}
                        onClick={() => handleToggleSubtopic(st.name)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '10px 12px',
                          backgroundColor: isChecked ? t.accentEmeraldBg : t.cardBgAlt,
                          border: `1px solid ${isChecked ? '#10b981' : t.border}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ marginTop: '2px', color: isChecked ? '#10b981' : t.textMuted }}>
                          {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: isChecked ? 700 : 500, color: t.text, lineHeight: 1.4 }}>
                          {st.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Operational Scenario Preset */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: t.text, marginBottom: '8px' }}>
                  3. Operational Scenario / Aviation Domain *
                </label>
                <select
                  value={genScenario}
                  onChange={(e) => setGenScenario(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '12px 14px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none', marginBottom: '8px' }}
                >
                  {SCENARIO_PRESETS.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                  <option value="custom">-- Custom Scenario (Type below) --</option>
                </select>

                {genScenario === 'custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom scenario (e.g. In-Flight Entertainment Reliability)"
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
                  />
                )}
              </div>

              {/* 4. Metadata (Exercise No, Marks, Deadline) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                    Exercise Number
                  </label>
                  <input
                    type="text"
                    value={genExerciseNumber}
                    onChange={(e) => setGenExerciseNumber(e.target.value)}
                    placeholder="LAB EXERCISE 06"
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 12px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={genMarks}
                    onChange={(e) => setGenMarks(Number(e.target.value))}
                    min={10}
                    max={100}
                    style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 12px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                  Submission Deadline
                </label>
                <input
                  type="text"
                  value={genDeadline}
                  onChange={(e) => setGenDeadline(e.target.value)}
                  placeholder="02 November, 2026 | 1700 hrs"
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                  Custom Assignment Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={genTitle}
                  onChange={(e) => setGenTitle(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', backgroundColor: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.text, padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', outline: 'none' }}
                />
              </div>

              {/* Action: Generate Plan Button */}
              <button
                type="button"
                onClick={handleGenerateAssignment}
                style={{
                  backgroundColor: '#10b981',
                  color: '#090d16',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Sparkles size={18} /> Generate Lab Assignment Plan
              </button>

            </div>

            {/* Right Column: Live Interactive Assignment Preview */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '28px', boxShadow: t.shadow, minHeight: '600px' }}>
              
              {!generatedAssignment ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: t.textMuted }}>
                  <Sparkles size={48} color="#10b981" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: t.text, margin: '0 0 8px' }}>
                    Assignment Preview Canvas
                  </h3>
                  <p style={{ fontSize: '0.86rem', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
                    Select your topic, subtopics, and operational scenario on the left, then click <strong>&quot;Generate Lab Assignment Plan&quot;</strong> to architect the complete curriculum assignment.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Preview Banner */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.border}`, paddingBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ backgroundColor: t.accentEmeraldBg, color: '#10b981', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {generatedAssignment.exerciseNumber} • {generatedAssignment.totalMarks} MARKS
                        </span>
                        <span style={{ fontSize: '0.75rem', color: t.textMuted }}>
                          Format: .{generatedAssignment.fileType}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: t.text, margin: 0 }}>
                        {generatedAssignment.title}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: t.textMuted, marginTop: '2px' }}>
                        Deadline: {generatedAssignment.deadline}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleSaveOrPublish(false)}
                        disabled={isPublishing}
                        style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, color: t.text, padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Save to Library
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveOrPublish(true)}
                        disabled={isPublishing}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#090d16',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <Send size={14} /> Publish to Student Portal
                      </button>
                    </div>
                  </div>

                  {/* Role Brief Preview */}
                  <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '16px' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Role & Organization Briefing
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: t.text, marginBottom: '4px' }}>
                      {generatedAssignment.role.title} — {generatedAssignment.role.organization}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: t.textSecondary, margin: '0 0 10px', lineHeight: 1.5 }}>
                      {generatedAssignment.role.context}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: 1.5 }}>
                      <strong>Mandate:</strong> {generatedAssignment.role.mandate}
                    </div>
                  </div>

                  {/* Tasks Breakdown */}
                  <div>
                    <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: t.text, margin: '0 0 12px' }}>
                      Generated Task Deliverables (4 Tasks):
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      {generatedAssignment.tasks.map((task) => (
                        <div
                          key={task.id}
                          style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontSize: '0.74rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                              TASK {task.id}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{task.marks} Marks</span>
                          </div>

                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: t.text }}>
                            {task.title}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: t.textSecondary, lineHeight: 1.4 }}>
                            {task.description}
                          </div>

                          <div style={{ fontSize: '0.75rem', color: t.textMuted, marginTop: 'auto', borderTop: `1px solid ${t.border}`, paddingTop: '6px' }}>
                            <strong>Visual:</strong> {task.chartOrVisual}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Honeypot & AI Trap Preview */}
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={15} /> Active AI Detection Traps Configured
                    </div>
                    <div style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: 1.5 }}>
                      • <strong>Trap 2 (Honeypot):</strong> Injects instruction: <code>{generatedAssignment.honeypotInstruction}</code>
                      <br />
                      • <strong>Trap 4 (Micro-Viva):</strong> 45s comprehension questions generated:
                      <div style={{ paddingLeft: '14px', marginTop: '4px' }}>
                        1. {generatedAssignment.vivaQuestions.q1.question} (Key: {generatedAssignment.vivaQuestions.q1.answer})
                        <br />
                        2. {generatedAssignment.vivaQuestions.q2.question} (Key: {generatedAssignment.vivaQuestions.q2.answer})
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 3: ASSIGNMENTS LIBRARY ================= */}
      {activeConsoleTab === 'library' && (
        <div style={{ maxWidth: '1400px', margin: '32px auto 80px', padding: '0 28px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px', color: t.text }}>
                Saved Assignments Library
              </h2>
              <p style={{ fontSize: '0.86rem', color: t.textMuted, margin: 0 }}>
                Manage, preview, and toggle between curriculum assignments published to the student portal.
              </p>
            </div>

            <button
              onClick={() => setActiveConsoleTab('generator')}
              style={{
                backgroundColor: '#10b981',
                color: '#090d16',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Create Another Assignment
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
            {assignmentsList.map((asgn) => {
              const isActive = asgn.id === activeAssignmentId;
              return (
                <div
                  key={asgn.id}
                  style={{
                    backgroundColor: t.cardBg,
                    border: `2px solid ${isActive ? '#10b981' : t.border}`,
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: t.shadow,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ backgroundColor: asgn.topic === 'excel' ? 'rgba(16, 185, 129, 0.15)' : asgn.topic === 'powerpoint' ? 'rgba(251, 146, 60, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: asgn.topic === 'excel' ? '#10b981' : asgn.topic === 'powerpoint' ? '#fb923c' : '#38bdf8', padding: '3px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {asgn.topic} • .{asgn.fileType}
                    </span>

                    {isActive ? (
                      <span style={{ backgroundColor: '#10b981', color: '#090d16', padding: '3px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={13} /> Active on Portal
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: t.textMuted }}>
                        Inactive
                      </span>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: t.textMuted, fontWeight: 700, marginBottom: '2px' }}>
                      {asgn.exerciseNumber} • {asgn.totalMarks} Marks
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.text, margin: 0, lineHeight: 1.4 }}>
                      {asgn.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                    {asgn.role?.context || asgn.scenario}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: t.textMuted }}>
                    <strong>Tasks Included:</strong> {asgn.tasks?.length || 4} tasks • Deadline: {asgn.deadline}
                  </div>

                  <div style={{ marginTop: 'auto', borderTop: `1px solid ${t.border}`, paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => handleSwitchActiveAssignment(asgn.id)}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#090d16',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Send size={13} /> Activate on Student Portal
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                        Currently Live
                      </span>
                    )}

                    {asgn.id !== 'blr-pivot-operations' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAssignment(asgn.id)}
                        style={{ backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: '#f87171', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}
                        title="Delete assignment"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

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
