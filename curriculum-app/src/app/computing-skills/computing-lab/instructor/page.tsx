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
  ArrowRight,
  FolderArchive,
  Upload,
  X,
  Award,
  Printer,
  FileCheck
} from 'lucide-react';
import {
  TOPICS_DATA,
  SCENARIO_PRESETS,
  generateAssignmentFromCriteria,
  AssignmentTemplate
} from '@/lib/assignment-generator';

interface SubmissionRecord {
  id: string;
  assignmentId?: string;
  assignmentTitle?: string;
  batchEvaluated?: boolean;
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
    allFormulas?: string[];
    formulaTypes?: string[];
    resultAccuracy?: {
      percentage: number;
      status: string;
      dataSetupAccuracy: number;
      computationalAccuracy: number;
      analysisAccuracy: number;
    };
    aiToolsUsed?: {
      detected: boolean;
      toolNames: string[];
      reasons: string[];
    };
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
    maxMarks?: number;
    percentage?: number;
    gradeBand?: string;
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

  // Batch ZIP Evaluation State
  const [batchAssignmentId, setBatchAssignmentId] = useState<string>('blr-pivot-operations');
  const [batchMaxMarks, setBatchMaxMarks] = useState<number>(15);
  const [batchZipFile, setBatchZipFile] = useState<File | null>(null);
  const [isEvaluatingBatch, setIsEvaluatingBatch] = useState<boolean>(false);
  const [batchResult, setBatchResult] = useState<any | null>(null);
  const [batchError, setBatchError] = useState<string>('');
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');

  // Report Card & Deletion State
  const [selectedReportCardSub, setSelectedReportCardSub] = useState<SubmissionRecord | null>(null);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [isDeletingAll, setIsDeletingAll] = useState<boolean>(false);
  const [deleteStatus, setDeleteStatus] = useState<string>('');

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
        const list = data.assignments || [];
        setAssignmentsList(list);
        const active = data.activeAssignmentId || 'blr-pivot-operations';
        setActiveAssignmentId(active);
        const targetId = active || list[0]?.id || 'blr-pivot-operations';
        setBatchAssignmentId(targetId);
        const asgnObj = list.find((a: any) => a.id === targetId);
        if (asgnObj && asgnObj.totalMarks) {
          setBatchMaxMarks(asgnObj.totalMarks);
        }
      }
    } catch (err) {
      console.error('Failed to load assignments list:', err);
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const handleAssignmentSelect = (asgnId: string) => {
    setBatchAssignmentId(asgnId);
    const asgnObj = assignmentsList.find((a: any) => a.id === asgnId);
    if (asgnObj && asgnObj.totalMarks) {
      setBatchMaxMarks(asgnObj.totalMarks);
    }
  };

  const handleBatchZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.zip')) {
        setBatchError('Please select a valid .zip folder archive.');
        setBatchZipFile(null);
        return;
      }
      setBatchZipFile(file);
      setBatchError('');
    }
  };

  const handleRunBatchEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchZipFile) {
      setBatchError('Please select a student submissions .zip folder first.');
      return;
    }
    setIsEvaluatingBatch(true);
    setBatchError('');

    const formData = new FormData();
    formData.append('file', batchZipFile);
    formData.append('assignmentId', batchAssignmentId);
    formData.append('maxMarks', String(batchMaxMarks));
    formData.append('passkey', INSTRUCTOR_PASSKEY);

    try {
      const res = await fetch('/api/lab/batch-evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Batch evaluation failed.');
      }

      setBatchResult(data.summary);
      setShowBatchModal(true);
      setBatchZipFile(null);
      await fetchSubmissions();
    } catch (err: any) {
      setBatchError(err.message || 'Error occurred during batch evaluation.');
    } finally {
      setIsEvaluatingBatch(false);
    }
  };

  const handleOpenReportCard = (sub: SubmissionRecord) => {
    setSelectedReportCardSub(sub);
    setShowReportCardModal(true);
  };

  const handleDeleteAllEvaluations = async () => {
    const isFiltered = assignmentFilter !== 'all';
    const filterTitle = assignmentsList.find((a) => a.id === assignmentFilter)?.title || assignmentFilter;
    const confirmMessage = isFiltered
      ? `Are you sure you want to delete ALL evaluations for "${filterTitle}"? This cannot be undone.`
      : `⚠️ Are you sure you want to delete ALL ${submissions.length} evaluations from the master roster? This will completely clear the roster and cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    setIsDeletingAll(true);
    setDeleteStatus('');
    try {
      const url = isFiltered
        ? `/api/lab/submissions?passkey=${INSTRUCTOR_PASSKEY}&all=true&assignmentId=${assignmentFilter}`
        : `/api/lab/submissions?passkey=${INSTRUCTOR_PASSKEY}&all=true`;

      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDeleteStatus(data.message || 'All evaluations deleted.');
        await fetchSubmissions();
        setTimeout(() => setDeleteStatus(''), 4500);
      } else {
        alert(data.error || 'Failed to delete evaluations.');
      }
    } catch (err) {
      console.error('Delete all error:', err);
      alert('Network error while deleting evaluations.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  const exportBatchToCSV = (bResult: any) => {
    if (!bResult || !bResult.results || bResult.results.length === 0) return;
    const maxM = bResult.maxMarks || 50;
    const headers = [
      'Roll No',
      'Student Name',
      'Assignment',
      'Original File',
      `Final Score (Out of ${maxM})`,
      'Score Percentage',
      'Grade Band',
      'Result Accuracy (%)',
      'Formulae Used',
      'Application Generator',
      'AI Tools Detected',
      'Edit Time (Mins)',
      'Integrity Status',
      'Audit Findings'
    ];
    const rows = bResult.results.map((r: any) => {
      const score = r.evaluation.finalScore;
      const pct = r.evaluation.percentage || Math.round((score / maxM) * 100);
      const acc = r.forensics.resultAccuracy?.percentage ?? pct;
      const formulasStr = (r.forensics.allFormulas || r.forensics.sampleFormulas || []).slice(0, 8).join('; ');
      const aiToolsStr = (r.forensics.aiToolsUsed?.toolNames || (r.forensics.flags?.isAiGenerator ? ['ChatGPT / Claude Code Interpreter'] : ['None Detected'])).join(', ');

      return [
        `"${r.rollNo}"`,
        `"${r.studentName}"`,
        `"${r.assignmentTitle || bResult.assignmentTitle}"`,
        `"${r.originalFilename}"`,
        score,
        `"${pct}%"`,
        `"${r.evaluation.gradeBand || 'A'}"`,
        `"${acc}%"`,
        `"${formulasStr.replace(/"/g, '""')}"`,
        `"${r.forensics.application || 'Unknown'}"`,
        `"${aiToolsStr.replace(/"/g, '""')}"`,
        r.forensics.totalTimeMinutes,
        `"${r.forensics.integrityLevel?.toUpperCase()}"`,
        `"${(r.forensics.summaryFindings || []).join('; ').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batch_Evaluation_${bResult.assignmentId}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      'Assignment',
      'Original File',
      'Submitted At',
      'Final Score',
      'Max Marks',
      'Score (%)',
      'Result Accuracy (%)',
      'Formulae Used',
      'Application Generator',
      'AI Tools Detected',
      'Editing Time (Mins)',
      'Total Formulas',
      'AI Generator Flag',
      'Honeypot Flag',
      'Trap Record Flag',
      'Micro-Viva Status',
      'Integrity Status',
      'Instructor Remarks'
    ];

    const rows = submissions.map((s) => {
      const maxM = s.evaluation.maxMarks || 50;
      const pct = s.evaluation.percentage || Math.round((s.evaluation.finalScore / maxM) * 100);
      const acc = s.forensics.resultAccuracy?.percentage ?? pct;
      const formulasStr = (s.forensics.allFormulas || s.forensics.sampleFormulas || []).slice(0, 8).join('; ');
      const aiToolsStr = (s.forensics.aiToolsUsed?.toolNames || (s.forensics.flags?.isAiGenerator ? ['ChatGPT / Claude Code Interpreter'] : ['None Detected'])).join(', ');

      return [
        `"${s.rollNo}"`,
        `"${s.studentName}"`,
        `"${s.assignmentTitle || 'Flight Operations Analysis'}"`,
        `"${s.originalFilename || ''}"`,
        `"${s.submittedAt}"`,
        s.evaluation.finalScore,
        maxM,
        `"${pct}%"`,
        `"${acc}%"`,
        `"${formulasStr.replace(/"/g, '""')}"`,
        `"${s.forensics.application}"`,
        `"${aiToolsStr.replace(/"/g, '""')}"`,
        s.forensics.totalTimeMinutes,
        s.forensics.totalFormulasFound,
        s.forensics.flags.isAiGenerator ? 'YES' : 'NO',
        s.forensics.flags.isHoneypotTriggered ? 'YES' : 'NO',
        s.forensics.flags.isTrapRecordFound ? 'YES' : 'NO',
        s.viva.isCorrect ? 'PASS' : 'FAIL',
        `"${s.forensics.integrityLevel?.toUpperCase()}"`,
        `"${s.evaluation.instructorRemarks.replace(/"/g, '""')}"`
      ];
    });

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
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.originalFilename && s.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'flagged') return s.forensics.integrityLevel !== 'clean';
    if (filterMode === 'clean') return s.forensics.integrityLevel === 'clean';
    if (assignmentFilter !== 'all' && s.assignmentId !== assignmentFilter) return false;
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
      
      <div className="instructor-console-main-container">
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
                Instructor Authenticated
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
                  {avgScore} <span style={{ fontSize: '0.95rem', color: t.textMuted }}>/ {submissions[0]?.evaluation?.maxMarks || 50}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: t.textMuted, marginTop: '4px' }}>Auto-calculated marks</div>
              </div>

            </div>
          </div>

          {/* ================= BATCH SUBMISSIONS ZIP EVALUATOR ================= */}
          <div style={{ maxWidth: '1400px', margin: '24px auto 0', padding: '0 28px' }}>
            <div style={{ backgroundColor: t.cardBg, border: `2px solid ${t.borderHighlight}`, borderRadius: '14px', overflow: 'hidden', boxShadow: t.shadow }}>
              <div style={{ backgroundColor: t.cardHeaderBg, padding: '16px 22px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: '#10b981', color: '#090d16', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderArchive size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: t.text }}>
                      Batch Submissions Evaluation (ZIP Archive Upload)
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: t.textMuted, margin: '2px 0 0' }}>
                      Select the target assignment, upload student submissions ZIP, and automatically evaluate files with forensic AI audits & auto-grading
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '0.74rem', backgroundColor: t.accentEmeraldBg, color: t.accentEmeraldText, fontWeight: 700, padding: '3px 10px', borderRadius: '6px' }}>
                  Automated Class Evaluation
                </span>
              </div>

              <div style={{ padding: '22px' }}>
                {batchError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={17} /> {batchError}
                  </div>
                )}

                {batchResult && (
                  <div style={{ backgroundColor: t.accentEmeraldBg, border: `1px solid ${t.borderHighlight}`, borderRadius: '10px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800, fontSize: '0.92rem' }}>
                        <CheckCircle2 size={18} /> Batch Evaluation Complete!
                      </div>
                      <div style={{ fontSize: '0.82rem', color: t.textSecondary }}>
                        Evaluated <strong>{batchResult.evaluatedCount}</strong> submission(s) for <em>{batchResult.assignmentTitle}</em>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700 }}>
                          {batchResult.cleanCount} Clean
                        </span>
                        <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>
                          {batchResult.flaggedCount} Flagged
                        </span>
                        <span style={{ fontSize: '0.74rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontWeight: 700 }}>
                          Avg: {batchResult.averageScore} / {batchResult.maxMarks || 50}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setShowBatchModal(true)}
                        style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, color: t.text, padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={14} /> View Audit Report
                      </button>
                      <button
                        onClick={() => setBatchResult(null)}
                        style={{ background: 'transparent', border: 'none', color: t.textMuted, padding: '4px', cursor: 'pointer' }}
                        title="Dismiss banner"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleRunBatchEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  
                  {/* Top Inputs: Two spacious, balanced columns for Assignment & ZIP Upload */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', alignItems: 'start' }}>
                    
                    {/* Input 1: Target Assignment Selection */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                        1. Select Target Assignment *
                      </label>
                      <select
                        value={batchAssignmentId}
                        onChange={(e) => handleAssignmentSelect(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: t.inputBg,
                          border: `1px solid ${t.inputBorder}`,
                          color: t.text,
                          padding: '11px 14px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {assignmentsList.map((a) => (
                          <option key={a.id} value={a.id}>
                            [{a.topic?.toUpperCase()}] {a.exerciseNumber}: {a.title} ({a.totalMarks} Marks, .{a.fileType})
                          </option>
                        ))}
                      </select>
                      <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                        Expected format: <code>.{assignmentsList.find(a => a.id === batchAssignmentId)?.fileType || 'xlsx'}</code> • Applies assignment-specific rubrics & honeypot tests
                      </div>
                    </div>

                    {/* Input 2: ZIP File Upload Dropzone */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: t.text, marginBottom: '6px' }}>
                        2. Submissions ZIP Folder Archive *
                      </label>
                      <div
                        style={{
                          border: `2px dashed ${batchZipFile ? '#10b981' : t.inputBorder}`,
                          backgroundColor: batchZipFile ? t.accentEmeraldBg : t.cardBgAlt,
                          borderRadius: '8px',
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          minHeight: '44px'
                        }}
                      >
                        <input
                          type="file"
                          accept=".zip"
                          id="batch-zip-input"
                          style={{ display: 'none' }}
                          onChange={handleBatchZipChange}
                        />
                        <label htmlFor="batch-zip-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                          <FolderArchive size={26} color={batchZipFile ? '#10b981' : t.textMuted} style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {batchZipFile ? batchZipFile.name : 'Choose or drag & drop class .zip folder'}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: t.textMuted }}>
                              {batchZipFile ? `${(batchZipFile.size / 1024 / 1024).toFixed(2)} MB • Ready for evaluation` : 'Archive containing student .xlsx, .docx, or .pptx work'}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.76rem', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, padding: '6px 12px', borderRadius: '6px', fontWeight: 700, color: t.text, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            Browse ZIP
                          </span>
                        </label>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                        Upload a single compressed <code>.zip</code> file containing all student submissions
                      </div>
                    </div>

                  </div>

                  {/* Bottom Strip: Dedicated Evaluation Scale & Run Action Bar */}
                  <div
                    style={{
                      backgroundColor: t.cardBgAlt,
                      border: `1px solid ${t.border}`,
                      borderRadius: '10px',
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: t.text }}>
                          Dynamic Marks Calibration & Forensic Auto-Grading
                        </div>
                        <div style={{ fontSize: '0.76rem', color: t.textMuted }}>
                          Scores and rubrics will be automatically scaled out of your specified maximum marks.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label htmlFor="batch-max-marks-input" style={{ fontSize: '0.84rem', fontWeight: 700, color: t.text, whiteSpace: 'nowrap' }}>
                          Highest Marks:
                        </label>
                        <input
                          id="batch-max-marks-input"
                          type="number"
                          min="1"
                          max="1000"
                          value={batchMaxMarks}
                          onChange={(e) => setBatchMaxMarks(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          title="Enter highest marks to evaluate out of (e.g. 15, 20, 50)"
                          placeholder="15"
                          style={{
                            width: '75px',
                            boxSizing: 'border-box',
                            backgroundColor: t.inputBg,
                            border: `2px solid ${t.borderHighlight}`,
                            color: t.text,
                            padding: '9px 10px',
                            borderRadius: '8px',
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!batchZipFile || isEvaluatingBatch}
                        style={{
                          backgroundColor: !batchZipFile || isEvaluatingBatch ? t.cardBg : '#10b981',
                          color: !batchZipFile || isEvaluatingBatch ? t.textMuted : '#090d16',
                          border: `1px solid ${!batchZipFile || isEvaluatingBatch ? t.border : '#10b981'}`,
                          padding: '11px 22px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          cursor: !batchZipFile || isEvaluatingBatch ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: !batchZipFile || isEvaluatingBatch ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.35)',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isEvaluatingBatch ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            Evaluating Submissions...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            Evaluate All Submissions (Out of {batchMaxMarks})
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>

          {/* Search & Filters Toolbar Card */}
          <div style={{ maxWidth: '1400px', margin: '24px auto 0', padding: '0 28px' }}>
            <div
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: t.shadow,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Row 1: Search & Assignment Filter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Search Input */}
                <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                  <Search size={16} color={t.textMuted} style={{ position: 'absolute', left: '14px', top: '13px' }} />
                  <input
                    type="text"
                    placeholder="Search by Roll No, Student Name or Filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: t.inputBg,
                      border: `1px solid ${t.inputBorder}`,
                      color: t.text,
                      padding: '10px 14px 10px 40px',
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Assignment Filter Dropdown */}
                <div style={{ flex: '1.2', minWidth: '320px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: t.textMuted, whiteSpace: 'nowrap' }}>
                    Assignment:
                  </span>
                  <select
                    value={assignmentFilter}
                    onChange={(e) => setAssignmentFilter(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      boxSizing: 'border-box',
                      backgroundColor: t.inputBg,
                      border: `1px solid ${t.inputBorder}`,
                      color: t.text,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">All Assignments ({submissions.length})</option>
                    {assignmentsList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.exerciseNumber}: {a.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Status Filter Segmented Pills & Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: `1px solid ${t.border}`
                }}
              >
                {/* Segmented Filter Pills */}
                <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: t.cardBgAlt, padding: '3px', borderRadius: '8px', border: `1px solid ${t.border}`, gap: '3px' }}>
                  <button
                    onClick={() => setFilterMode('all')}
                    style={{
                      backgroundColor: filterMode === 'all' ? '#10b981' : 'transparent',
                      color: filterMode === 'all' ? '#090d16' : t.textMuted,
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    All ({submissions.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('flagged')}
                    style={{
                      backgroundColor: filterMode === 'flagged' ? '#f43f5e' : 'transparent',
                      color: filterMode === 'flagged' ? '#ffffff' : t.textMuted,
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    Flagged ({flaggedCount})
                  </button>
                  <button
                    onClick={() => setFilterMode('clean')}
                    style={{
                      backgroundColor: filterMode === 'clean' ? '#10b981' : 'transparent',
                      color: filterMode === 'clean' ? '#090d16' : t.textMuted,
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    Clean ({cleanCount})
                  </button>
                </div>

                {/* Actions: Export CSV + Delete All Evaluations */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={exportToCSV}
                    style={{
                      backgroundColor: t.cardBgAlt,
                      color: t.text,
                      border: `1px solid ${t.border}`,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s'
                    }}
                    title="Download CSV roster"
                  >
                    <Download size={15} /> Export CSV
                  </button>

                  <button
                    onClick={handleDeleteAllEvaluations}
                    disabled={submissions.length === 0 || isDeletingAll}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: submissions.length === 0 || isDeletingAll ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: submissions.length === 0 ? 0.5 : 1,
                      transition: 'all 0.15s'
                    }}
                    title="Permanently remove all evaluation records"
                  >
                    <Trash2 size={15} />
                    {isDeletingAll ? 'Deleting All...' : `Delete All Evaluations (${submissions.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {deleteStatus && (
            <div style={{ maxWidth: '1400px', margin: '14px auto 0', padding: '0 28px' }}>
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 16px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {deleteStatus}
              </div>
            </div>
          )}

          {/* Master Submissions Roster */}
          <main style={{ maxWidth: '100%', margin: '16px auto 60px', padding: '0 20px' }}>
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: t.shadow }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: t.cardBgAlt, borderBottom: `1px solid ${t.border}`, color: t.textMuted }}>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Roll No</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Student Name</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Assignment</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Software / Editor</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Edit Time</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Formulas / Structure</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Score</th>
                      <th style={{ padding: '12px 10px', whiteSpace: 'nowrap', fontWeight: 700 }}>Integrity Status</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 700 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: t.textMuted }}>
                          No submissions found matching criteria. Upload a submissions ZIP folder above or have students submit via portal.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((s) => {
                        const isFlagged = s.forensics.integrityLevel !== 'clean';
                        
                        // Clean formatted application display
                        const appStr = s.forensics.application || 'Unknown';
                        let cleanApp = appStr;
                        if (appStr.includes('LibreOffice')) cleanApp = 'LibreOffice Calc';
                        else if (appStr.toLowerCase().includes('openpyxl')) cleanApp = 'openpyxl (Python)';
                        else if (appStr.includes('Microsoft Excel') || appStr.toLowerCase() === 'excel') cleanApp = 'Microsoft Excel';
                        else if (appStr.includes('Excel iOS')) cleanApp = 'Excel (iOS)';
                        else if (appStr.includes('Excel Android')) cleanApp = 'Excel (Android)';
                        else if (appStr.includes('Google Sheets')) cleanApp = 'Google Sheets';
                        else if (cleanApp.length > 18) cleanApp = cleanApp.substring(0, 16) + '...';

                        // Clean formatted integrity status badge
                        const rawTool = s.forensics.aiToolsUsed?.toolNames?.[0] || '';
                        let shortAiTool = 'AI Tool';
                        if (rawTool.includes('OpenAI')) shortAiTool = 'AI: ChatGPT';
                        else if (rawTool.includes('openpyxl')) shortAiTool = 'AI: openpyxl';
                        else if (rawTool.includes('LLM')) shortAiTool = 'AI: LLM';

                        return (
                          <tr
                            key={s.id}
                            style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}
                          >
                            <td style={{ padding: '10px 10px', fontWeight: 800, color: t.text, whiteSpace: 'nowrap', fontSize: '0.80rem' }}>
                              {s.rollNo}
                            </td>
                            <td style={{ padding: '10px 10px', color: t.textSecondary, fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {s.studentName}
                            </td>
                            <td style={{ padding: '10px 10px', fontSize: '0.78rem', color: '#818cf8', fontWeight: 600, maxWidth: '130px' }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.assignmentTitle || 'Flight Operations Analysis'}>
                                {s.assignmentTitle || 'Flight Operations Analysis'}
                              </div>
                              {s.batchEvaluated && (
                                <span style={{ fontSize: '0.64rem', backgroundColor: t.accentIndigoBg, color: t.accentIndigoText, padding: '1px 5px', borderRadius: '3px', fontWeight: 700, display: 'inline-block', marginTop: '1px' }}>
                                  ZIP Batch
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '10px 10px', fontFamily: 'monospace', fontSize: '0.76rem', color: s.forensics.flags.isAiGenerator ? '#f87171' : t.textMuted, whiteSpace: 'nowrap' }} title={appStr}>
                              {cleanApp}
                            </td>
                            <td style={{ padding: '10px 10px', color: s.forensics.flags.hasZeroEditTime ? '#f87171' : t.textMuted, whiteSpace: 'nowrap' }}>
                              {s.forensics.totalTimeMinutes}m
                            </td>
                            <td style={{ padding: '10px 10px', color: s.forensics.totalFormulasFound > 0 ? '#10b981' : '#f87171', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {s.forensics.totalFormulasFound > 0
                                ? `${s.forensics.totalFormulasFound} cells`
                                : s.forensics.sheetNames.length > 0
                                ? `${s.forensics.sheetNames.length} slides`
                                : '0 detected'}
                            </td>
                            <td style={{ padding: '10px 10px', fontWeight: 800, color: '#38bdf8', whiteSpace: 'nowrap' }}>
                              {s.evaluation.finalScore} / {s.evaluation.maxMarks || 50}
                              {s.evaluation.instructorOverride && (
                                <span style={{ fontSize: '0.7rem', marginLeft: '3px', color: '#eab308' }}>*</span>
                              )}
                            </td>
                            <td style={{ padding: '10px 10px', whiteSpace: 'nowrap' }}>
                              {s.forensics.integrityLevel === 'clean' ? (
                                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 7px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 700, display: 'inline-block' }}>
                                  🟢 Authentic
                                </span>
                              ) : s.forensics.flags.isAiGenerator ? (
                                <span
                                  title={s.forensics.aiToolsUsed?.toolNames?.join(', ') || 'AI Code Generated'}
                                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '3px 7px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-block' }}
                                >
                                  🟡 {shortAiTool}
                                </span>
                              ) : s.forensics.flags.isHoneypotTriggered ? (
                                <span
                                  title="Invisible prompt injection honeypot token detected inside workbook cells"
                                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '3px 7px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-block' }}
                                >
                                  🔴 Honeypot
                                </span>
                              ) : s.forensics.flags.isTrapRecordFound ? (
                                <span
                                  title="Trap calibration record left in analysis"
                                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', padding: '3px 7px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-block' }}
                                >
                                  🟠 Trap Record
                                </span>
                              ) : (
                                <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15', padding: '3px 7px', borderRadius: '5px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-block' }}>
                                  ⚠️ Suspicious ({s.forensics.integrityScore}%)
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '10px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => handleOpenReportCard(s)}
                                style={{
                                  backgroundColor: t.accentEmeraldBg,
                                  color: '#10b981',
                                  border: `1px solid ${t.borderHighlight}`,
                                  padding: '5px 8px',
                                  borderRadius: '5px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  marginRight: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="View & Print Official Student Report Card"
                              >
                                <Award size={13} /> Report Card
                              </button>
                              <button
                                onClick={() => handleOpenInspector(s)}
                                style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '5px 9px', borderRadius: '5px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', marginRight: '4px' }}
                              >
                                Inspect
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(s.id)}
                                style={{ backgroundColor: 'transparent', border: `1px solid ${t.border}`, color: '#ef4444', padding: '5px 7px', borderRadius: '5px', cursor: 'pointer', verticalAlign: 'middle' }}
                                title="Delete submission"
                              >
                                <Trash2 size={13} />
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
      </div> {/* end instructor-console-main-container */}

      {/* ================= DEEP FORENSIC INSPECTOR MODAL ================= */}
      {selectedSub && (
        <div className="no-print" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 9999 }}>
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenReportCard(selectedSub);
                  }}
                  style={{
                    backgroundColor: t.accentEmeraldBg,
                    border: `1px solid ${t.borderHighlight}`,
                    color: '#10b981',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Award size={16} /> Generate Official Report Card
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
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
        </div>
      )}

      {/* ================= MODAL: BATCH EVALUATION AUDIT REPORT ================= */}
      {showBatchModal && batchResult && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '16px',
              maxWidth: '1100px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                backgroundColor: t.cardBg,
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#10b981', color: '#090d16', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderArchive size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: t.text }}>
                    Batch Evaluation Audit Report
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: t.textMuted, margin: '3px 0 0' }}>
                    Assignment: <strong style={{ color: t.text }}>{batchResult.assignmentTitle}</strong> • {batchResult.evaluatedCount} files analyzed out of {batchResult.totalFilesParsed} archive contents
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => exportBatchToCSV(batchResult)}
                  style={{
                    backgroundColor: t.accentEmeraldBg,
                    border: `1px solid ${t.borderHighlight}`,
                    color: '#10b981',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={15} /> Export Marks (CSV)
                </button>
                <button
                  onClick={() => setShowBatchModal(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: t.textMuted,
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Summary KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Total Evaluated</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: t.text, marginTop: '2px' }}>
                    {batchResult.evaluatedCount} <span style={{ fontSize: '0.8rem', color: t.textMuted }}>Students</span>
                  </div>
                </div>

                <div style={{ backgroundColor: t.cardBgAlt, border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Authentic Submissions</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                    {batchResult.cleanCount} <span style={{ fontSize: '0.8rem', color: t.textMuted }}>Clean</span>
                  </div>
                </div>

                <div style={{ backgroundColor: t.cardBgAlt, border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>Flagged / AI Generated</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                    {batchResult.flaggedCount} <span style={{ fontSize: '0.8rem', color: t.textMuted }}>Flagged</span>
                  </div>
                </div>

                <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px 18px' }}>
                  <div style={{ fontSize: '0.74rem', color: t.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>Cohort Average</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                    {batchResult.averageScore} <span style={{ fontSize: '0.8rem', color: t.textMuted }}>/ {batchResult.maxMarks || 50}</span>
                  </div>
                </div>
              </div>

              {/* Student Results Table */}
              <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: t.cardHeaderBg, borderBottom: `1px solid ${t.border}`, color: t.textMuted, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '12px 16px' }}>Student</th>
                        <th style={{ padding: '12px 16px' }}>File & Generator</th>
                        <th style={{ padding: '12px 16px' }}>Edit Time</th>
                        <th style={{ padding: '12px 16px' }}>Formulas</th>
                        <th style={{ padding: '12px 16px' }}>Integrity</th>
                        <th style={{ padding: '12px 16px' }}>Score</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchResult.results?.map((res: any, idx: number) => {
                        const isClean = res.forensics.integrityLevel === 'clean';
                        return (
                          <tr
                            key={res.id || idx}
                            style={{
                              borderBottom: idx === batchResult.results.length - 1 ? 'none' : `1px solid ${t.border}`,
                              backgroundColor: isClean ? 'transparent' : 'rgba(239, 68, 68, 0.04)'
                            }}
                          >
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: 700, color: t.text }}>{res.studentName}</div>
                              <div style={{ fontSize: '0.75rem', color: t.textMuted }}>{res.rollNo}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ color: t.text, fontFamily: 'monospace', fontSize: '0.78rem' }}>{res.originalFilename}</div>
                              <div style={{ fontSize: '0.74rem', color: res.forensics.flags?.isAiGenerator ? '#f87171' : t.textMuted }}>
                                {res.forensics.application || 'Unknown app'}
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', color: res.forensics.flags?.hasZeroEditTime ? '#f87171' : t.text }}>
                              {res.forensics.totalTimeMinutes}m
                            </td>
                            <td style={{ padding: '12px 16px', color: t.textSecondary }}>
                              {res.forensics.totalFormulasFound}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor: isClean ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: isClean ? '#10b981' : '#f87171'
                                }}
                              >
                                {isClean ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                                {isClean ? 'CLEAN' : 'FLAGGED'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#10b981' }}>
                                {res.evaluation.finalScore} <span style={{ fontSize: '0.72rem', color: t.textMuted }}>/ {res.evaluation.maxMarks || batchResult.maxMarks || 50}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => {
                                  setShowBatchModal(false);
                                  handleOpenReportCard(res);
                                }}
                                style={{
                                  backgroundColor: t.accentEmeraldBg,
                                  border: `1px solid ${t.borderHighlight}`,
                                  color: '#10b981',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  marginRight: '6px'
                                }}
                              >
                                Report Card
                              </button>
                              <button
                                onClick={() => {
                                  setShowBatchModal(false);
                                  handleOpenInspector(res);
                                }}
                                style={{
                                  backgroundColor: t.cardBgAlt,
                                  border: `1px solid ${t.border}`,
                                  color: t.text,
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: t.cardHeaderBg
              }}
            >
              <div style={{ fontSize: '0.78rem', color: t.textMuted }}>
                All records have been saved into the Master Roster.
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                style={{
                  backgroundColor: '#10b981',
                  color: '#090d16',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL STUDENT EVALUATION REPORT CARD ================= */}
      {showReportCardModal && selectedReportCardSub && (() => {
        const sub = selectedReportCardSub;
        const maxMarks = sub.evaluation.maxMarks || 50;
        const finalScore = sub.evaluation.finalScore;
        const scorePct = sub.evaluation.percentage || Math.round((finalScore / maxMarks) * 100);
        const accuracy = sub.forensics.resultAccuracy || {
          percentage: scorePct,
          status: scorePct >= 90 ? 'High Precision' : scorePct >= 75 ? 'Satisfactory' : 'Discrepancies Flagged',
          dataSetupAccuracy: 100,
          computationalAccuracy: 90,
          analysisAccuracy: 85
        };
        const aiTools = sub.forensics.aiToolsUsed || {
          detected: sub.forensics.flags.isAiGenerator || sub.forensics.flags.isHoneypotTriggered || (sub.forensics.flags.hasZeroEditTime && !sub.originalFilename?.toLowerCase().endsWith('.xlsx')),
          toolNames: sub.forensics.flags.isAiGenerator ? ['ChatGPT / Claude Code Interpreter (openpyxl)'] : ['None Detected (Microsoft Office / Google Sheets)'],
          reasons: sub.forensics.summaryFindings.filter((f) => !f.includes('Authentic'))
        };
        const formulas = sub.forensics.allFormulas || sub.forensics.sampleFormulas || [];
        const formulaTypes = sub.forensics.formulaTypes || [];
        const isClean = sub.forensics.integrityLevel === 'clean';

        return (
          <div
            className="report-card-modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(8px)',
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <style>{`
              @media print {
                @page {
                  size: A4 portrait;
                  margin: 8mm 10mm 8mm 10mm;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  height: 100% !important;
                  max-height: 100% !important;
                  overflow: hidden !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .instructor-console-main-container,
                .no-print {
                  display: none !important;
                }
                .report-card-modal-backdrop {
                  position: static !important;
                  inset: auto !important;
                  width: 100% !important;
                  height: auto !important;
                  min-height: 0 !important;
                  background: transparent !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  display: block !important;
                  overflow: visible !important;
                }
                #printable-report-card {
                  position: static !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: auto !important;
                  max-height: none !important;
                  overflow: visible !important;
                  box-shadow: none !important;
                  border: 2px solid #0f172a !important;
                  border-radius: 6px !important;
                  margin: 0 auto !important;
                  padding: 0 !important;
                  background: #ffffff !important;
                  color: #0f172a !important;
                  page-break-after: avoid !important;
                  page-break-inside: avoid !important;
                  break-after: avoid !important;
                  break-inside: avoid !important;
                }
                #printable-report-card * {
                  box-sizing: border-box !important;
                  color: #0f172a !important;
                }
                .report-card-body {
                  padding: 16px 20px !important;
                }
                .report-card-table th,
                .report-card-table td {
                  border: 1px solid #cbd5e1 !important;
                  padding: 5px 8px !important;
                }
              }
            `}</style>

            <div
              id="printable-report-card"
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '12px',
                maxWidth: '1360px',
                width: '96vw',
                maxHeight: '94vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                color: '#0f172a'
              }}
            >
              {/* Report Card Top Action Bar (Screen Only) */}
              <div
                className="no-print"
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  position: 'sticky',
                  top: 0,
                  zIndex: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#059669" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    Student Laboratory Evaluation Report Card
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Printer size={15} /> Print / Save PDF (A4)
                  </button>
                  <button
                    onClick={() => setShowReportCardModal(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #cbd5e1',
                      color: '#64748b',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* Official Academic Report Body */}
              <div className="report-card-body" style={{ padding: '22px 26px', backgroundColor: '#ffffff', color: '#0f172a' }}>
                
                {/* 1. Official Header Banner */}
                <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                        ACADEMIC RECORD
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                        Course Code: Z7AVA 26209 • Academic Cycle 2026–27
                      </span>
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '2px 0', color: '#0f172a', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      Computing Skills & Laboratory Practicum
                    </h1>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                      Official Student Performance Scorecard & Forensic Integrity Audit
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '180px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Evaluation Ref ID</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>{sub.id}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                      Issue Date: <strong>{new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      ✓ Evaluator Verified
                    </div>
                  </div>
                </div>

                {/* 2. Candidate & Exercise Demographics Matrix */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#f8fafc', padding: '12px 16px', marginBottom: '14px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(210px, 1.4fr) minmax(220px, 2fr)', gap: '14px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Candidate Name</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{sub.studentName}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Roll Number / ID</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7', fontFamily: 'monospace', marginTop: '2px', whiteSpace: 'nowrap' }}>{sub.rollNo}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Lab Assignment</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', lineHeight: 1.3 }}>
                        {sub.assignmentTitle || 'Flight Operations Analysis'}
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, whiteSpace: 'nowrap' }}>Evaluated Artifact:</span>
                    <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {sub.originalFilename}
                    </span>
                  </div>
                </div>

                {/* 3. Executive Performance & Integrity Ribbon */}
                <div style={{ border: '1.5px solid #0f172a', borderRadius: '6px', backgroundColor: '#f0fdf4', padding: '12px 18px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#065f46', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                      Total Evaluation Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
                        {finalScore}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#475569' }}>
                        / {maxMarks} Marks
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7', marginLeft: '6px' }}>
                        ({scorePct}%)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '6px 14px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Performance Band</div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#059669', marginTop: '1px' }}>
                        {sub.evaluation.gradeBand || (scorePct >= 90 ? 'Grade O' : scorePct >= 75 ? 'Grade A+' : scorePct >= 60 ? 'Grade A' : 'Grade B')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '6px 14px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Integrity Status</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isClean ? '#059669' : '#dc2626', marginTop: '1px', textTransform: 'uppercase' }}>
                        {isClean ? '✓ Authentic' : `⚠️ ${sub.forensics.integrityLevel}`}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '6px 14px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Result Accuracy</div>
                      <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0284c7', marginTop: '1px' }}>
                        {accuracy.percentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Structured Assessment Rubric Breakdown Table */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckSquare size={14} color="#059669" /> Component Evaluation Rubric & Computational Precision
                  </div>
                  <table className="report-card-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', border: '1px solid #cbd5e1' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>Assessment Domain</th>
                        <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Weightage</th>
                        <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Marks Awarded</th>
                        <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>Accuracy</th>
                        <th style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>Evaluator Criterion & Verification Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          1. Data Hygiene, Schema & Tabs Setup
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>
                          10% ({(maxMarks * 0.1).toFixed(1)}M)
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#059669' }}>
                          {(sub.forensics.autoGradeEstimate?.dataSetup ?? (maxMarks * 0.1)).toFixed(1)} M
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                          {accuracy.dataSetupAccuracy}%
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontSize: '0.74rem', color: '#334155' }}>
                          Raw sheet presence, clean headers & section formatting verified
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          2. Formula Implementation & Logic Tasks
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>
                          80% ({(maxMarks * 0.8).toFixed(1)}M)
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#059669' }}>
                          {(sub.forensics.autoGradeEstimate?.tasks ?? (maxMarks * 0.8)).toFixed(1)} M
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                          {accuracy.computationalAccuracy}%
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontSize: '0.74rem', color: '#334155' }}>
                          Mathematical, conditional (IF/IFS) & lookup formula syntax execution
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          3. Operational Analysis & Calibration
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>
                          10% ({(maxMarks * 0.1).toFixed(1)}M)
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: '#059669' }}>
                          {(sub.forensics.autoGradeEstimate?.analysis ?? (maxMarks * 0.1)).toFixed(1)} M
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                          {accuracy.analysisAccuracy}%
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontSize: '0.74rem', color: '#334155' }}>
                          Pivot table synthesis & flight analysis records handling
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          4. Micro-Viva Concept Verification
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>
                          Qualifying
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 800, color: sub.viva.isCorrect ? '#059669' : '#dc2626' }}>
                          {sub.viva.isCorrect ? 'PASSED (2/2)' : 'FAIL / TIMEOUT'}
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700 }}>
                          {sub.viva.isCorrect ? '100%' : '0%'}
                        </td>
                        <td style={{ padding: '5px 10px', border: '1px solid #cbd5e1', fontSize: '0.74rem', color: '#334155' }}>
                          Interactive conceptual response logged in {sub.viva.secondsTaken} seconds
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 900 }}>
                        <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1' }}>
                          Total Certified Practicum Score
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                          {maxMarks} M
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '0.95rem', color: '#059669' }}>
                          {finalScore} M
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#0284c7' }}>
                          {accuracy.percentage}%
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #cbd5e1', fontSize: '0.74rem' }}>
                          Performance classification: <strong>{sub.evaluation.gradeBand || 'Grade A'}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. Technical Evidence & Audit Grid (2 Balanced Columns) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px', fontSize: '0.78rem' }}>
                  
                  {/* Left Column: Formulae Used */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 16px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileSpreadsheet size={15} color="#0284c7" /> Formulae Used in Submission
                        </span>
                        <span style={{ color: '#0284c7', fontSize: '0.74rem', fontWeight: 700 }}>
                          {sub.forensics.totalFormulasFound} active formula cell(s)
                        </span>
                      </div>

                      {formulaTypes.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                          {formulaTypes.map((fn, idx) => (
                            <span key={idx} className="report-code-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, border: '1px solid #bae6fd' }}>
                              ={fn}()
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '6px', fontWeight: 700 }}>
                        Extracted Cell Formula Samples:
                      </div>
                      {formulas.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' }}>
                          {formulas.slice(0, 4).map((f, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: '#ffffff',
                                color: '#0369a1',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.73rem',
                                fontFamily: 'monospace',
                                border: '1px solid #e2e8f0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.4
                              }}
                            >
                              ={f}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#dc2626', fontSize: '0.74rem', fontStyle: 'italic', marginBottom: '8px' }}>
                          No formula tags detected in workbook (values may be hardcoded).
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                      <strong style={{ color: '#0f172a' }}>Workbook Tabs: </strong>
                      {sub.forensics.sheetNames?.map((sheet, idx) => (
                        <span key={idx} style={{ display: 'inline-block', backgroundColor: '#e2e8f0', color: '#334155', padding: '1px 6px', borderRadius: '3px', fontSize: '0.7rem', marginRight: '4px', marginTop: '2px', fontWeight: 600 }}>
                          {sheet}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: AI Tools & Authoring Verification */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 16px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={15} color={aiTools.detected ? '#dc2626' : '#059669'} /> AI & Authoring Verification
                        </span>
                        <span style={{ color: aiTools.detected ? '#dc2626' : '#059669', fontSize: '0.74rem', fontWeight: 800 }}>
                          Integrity Score: {sub.forensics.integrityScore}/100
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem', color: '#334155' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Software Signature:</strong>{' '}
                          <code style={{ backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', color: sub.forensics.flags.isAiGenerator ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                            {sub.forensics.application || 'Microsoft Excel'}
                          </code>
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a' }}>AI Tools Detected:</strong>{' '}
                          <span style={{ color: aiTools.detected ? '#dc2626' : '#059669', fontWeight: 700 }}>
                            {aiTools.toolNames.join(', ')}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Active Editing Time:</strong>{' '}
                          <span style={{ color: '#0f172a', fontWeight: 600 }}>
                            {sub.forensics.totalTimeMinutes > 0 ? `${sub.forensics.totalTimeMinutes} minutes` : '0 minutes'}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a' }}>Verification Status:</strong>{' '}
                          <span style={{ color: isClean ? '#059669' : aiTools.detected ? '#dc2626' : '#d97706', fontWeight: 700 }}>
                            {isClean
                              ? '✓ Authentic Student Submission'
                              : aiTools.detected
                              ? '⚠️ Flagged for Artificial Generation'
                              : '⚠️ Verified with Discrepancies'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                      Metadata & application fingerprint verified against laboratory submission standards.
                    </div>
                  </div>

                </div>

                {/* Academic Performance Grading Scale Key Strip */}
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', marginTop: '12px', marginBottom: '12px', fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Performance Scale:</span>
                  <span><strong>O</strong> (≥90% Outstanding)</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span><strong>A+</strong> (80–89% Excellent)</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span><strong>A</strong> (70–79% Very Good)</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span><strong>B</strong> (60–69% Good)</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span><strong>C</strong> (50–59% Pass)</span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span><strong>F</strong> (&lt;50% Re-attempt)</span>
                </div>

                {/* Institutional Endorsement Sign-Off with Evaluator Signature (Center Aligned) */}
                <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '14px', marginTop: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.78rem' }}>
                  <img
                    src="/api/lab/instructor-signature"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/instructor-signature.jpg';
                    }}
                    alt="Course Instructor / Evaluator Signature"
                    style={{
                      height: '46px',
                      maxWidth: '180px',
                      objectFit: 'contain',
                      mixBlendMode: 'multiply',
                      display: 'block',
                      marginBottom: '4px'
                    }}
                  />
                  <strong style={{ color: '#0f172a', fontSize: '0.84rem', display: 'block' }}>
                    Course Instructor / Evaluator
                  </strong>
                </div>

              </div>

              {/* Modal Bottom Close Action Bar (Screen Only) */}
              <div
                className="no-print"
                style={{
                  padding: '12px 20px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  backgroundColor: '#f8fafc'
                }}
              >
                <button
                  onClick={() => setShowReportCardModal(false)}
                  style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Close Report Card
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
