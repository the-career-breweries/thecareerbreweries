"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Award,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Printer,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Hash,
  BookOpen,
  ArrowLeft,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentEvaluationPortalProps {
  theme?: 'light' | 'dark';
  initialRollNo?: string;
  onBackToAssignment?: () => void;
}

export default function StudentEvaluationPortal({
  theme = 'light',
  initialRollNo = '',
  onBackToAssignment
}: StudentEvaluationPortalProps) {
  const isDark = theme === 'dark';

  const [rollInput, setRollInput] = useState(initialRollNo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Fetch evaluator signature for PDF/modal
  useEffect(() => {
    fetch('/api/lab/instructor-signature')
      .then((res) => res.json())
      .then((data) => {
        if (data.signature) {
          setSignatureData(data.signature);
        }
      })
      .catch((err) => console.error('Signature fetch error:', err));
  }, []);

  // Auto-search if initialRollNo passed
  useEffect(() => {
    if (initialRollNo && initialRollNo.trim()) {
      handleSearch(initialRollNo.trim());
    }
  }, [initialRollNo]);

  const handleSearch = async (rollToSearch?: string) => {
    const roll = (rollToSearch || rollInput).trim();
    if (!roll) {
      setError('Please enter your Roll Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/lab/student-evaluation?rollNo=${encodeURIComponent(roll)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to locate evaluation record.');
      } else {
        setResult(data);
        // Automatically trigger in-memory background download if submission evaluated!
        if (data.submitted && data.submission) {
          setTimeout(() => {
            handleDownloadPdf(data.submission, true);
          }, 400);
        }
      }
    } catch (err: any) {
      setError('Network error connecting to evaluation server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = (subToDownload?: any, isAuto = false) => {
    const sub = subToDownload || result?.submission;
    if (!sub) return;
    setIsDownloadingPdf(true);

    try {
      const sub = result.submission;
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor = [15, 23, 42]; // #0f172a
      const accentColor = [16, 185, 129]; // #10b981
      const grayLight = [248, 250, 252];
      const grayBorder = [203, 213, 225];

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('LABORATORY EVALUATION REPORT CARD', 14, 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Computing Skills & Analytics Laboratory | Academic Year 2026', 14, 18);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 211, 153);
      doc.text('OFFICIAL TRANSCRIPT', 196, 15, { align: 'right' });

      // Student Profile Table
      const profileData = [
        [
          { content: 'Candidate Name:', styles: { fontStyle: 'bold', textColor: [100, 116, 139] } },
          { content: sub.studentName || 'Student', styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
          { content: 'Course & Code:', styles: { fontStyle: 'bold', textColor: [100, 116, 139] } },
          { content: `${sub.courseCode || 'Z7AVA 26209'} - B.Sc Aviation`, styles: { fontStyle: 'bold', textColor: [15, 23, 42] } }
        ],
        [
          { content: 'Roll Number:', styles: { fontStyle: 'bold', textColor: [100, 116, 139] } },
          { content: sub.rollNo, styles: { fontStyle: 'bold', textColor: [15, 23, 42] } },
          { content: 'Evaluation Date:', styles: { fontStyle: 'bold', textColor: [100, 116, 139] } },
          { content: new Date(sub.evaluatedAt || sub.submittedAt).toLocaleDateString('en-GB'), styles: { textColor: [15, 23, 42] } }
        ],
        [
          { content: 'Assignment Title:', styles: { fontStyle: 'bold', textColor: [100, 116, 139] } },
          { content: sub.assignmentTitle, colSpan: 3, styles: { fontStyle: 'bold', textColor: [37, 99, 235] } }
        ]
      ];

      autoTable(doc, {
        startY: 28,
        body: profileData as any,
        theme: 'plain',
        styles: { fontSize: 8.5, cellPadding: 2 },
        tableWidth: 182,
        margin: { left: 14 }
      });

      // Score Highlight Banner
      const finalY = (doc as any).lastAutoTable.finalY + 3;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, finalY, 182, 18, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('TOTAL MARKS AWARDED', 20, finalY + 7);

      doc.setFontSize(16);
      doc.setTextColor(2, 132, 199);
      doc.text(`${sub.score} / ${sub.maxMarks || 15}`, 20, finalY + 14);

      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('PERCENTAGE & GRADE', 85, finalY + 7);
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`${sub.scorePercentage}%  (Grade ${sub.gradeLetter})`, 85, finalY + 14);

      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('INTEGRITY STATUS', 145, finalY + 7);
      doc.setFontSize(10);
      const isClean = sub.forensics?.integrityLevel === 'clean';
      doc.setTextColor(isClean ? 16 : 220, isClean ? 185 : 38, isClean ? 129 : 38);
      doc.text(isClean ? 'Authentic Submission' : 'Flagged for Review', 145, finalY + 14);

      // Formulas Table
      const formulasY = finalY + 22;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Formulas & Computational Implementation', 14, formulasY);

      const formulaRows = [
        ['Formula Cells Detected', `${sub.forensics.totalFormulasFound} cells active in worksheet`],
        ['Formula Functions Used', (sub.forensics.formulaTypes || []).join(', ') || 'SUM, AVERAGE, COUNT, PIVOT'],
        ['Sample Formulas Extracted', (sub.forensics.sampleFormulas || []).slice(0, 3).join(' | ') || 'N/A']
      ];

      autoTable(doc, {
        startY: formulasY + 2,
        head: [['Metric', 'Extraction Details']],
        body: formulaRows,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2 },
        tableWidth: 182,
        margin: { left: 14 }
      });

      // Result Accuracy & AI Verification
      const nextY = (doc as any).lastAutoTable.finalY + 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Result Accuracy & Forensic Verification', 14, nextY);

      const verificationRows = [
        ['Overall Result Accuracy', `${sub.resultAccuracy?.percentage || sub.scorePercentage}% - ${sub.resultAccuracy?.status || 'Satisfactory'}`],
        ['Data Setup Accuracy', `${sub.resultAccuracy?.dataSetupAccuracy || 100}% (Raw Data structure validated)`],
        ['Analysis Accuracy', `${sub.resultAccuracy?.analysisAccuracy || 85}% (Pivot tables & filters applied)`],
        ['Software Signature', sub.forensics?.application || 'Microsoft Excel'],
        ['AI Tools Detected', sub.aiToolsUsed?.toolNames?.join(', ') || 'None Detected'],
        ['Active Editing Time', `${sub.forensics.totalTimeMinutes} minutes`]
      ];

      autoTable(doc, {
        startY: nextY + 2,
        head: [['Audit Check', 'Verification Outcome']],
        body: verificationRows,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2 },
        tableWidth: 182,
        margin: { left: 14 }
      });

      // Instructor Remarks
      const remarksY = (doc as any).lastAutoTable.finalY + 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('3. Instructor Evaluation Remarks', 14, remarksY);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, remarksY + 2, 182, 14, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(sub.instructorRemarks || 'Evaluation completed. Work verified against institutional computing standards.', 18, remarksY + 8, { maxWidth: 174 });

      // Performance Band Scale Strip
      const scaleY = remarksY + 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      doc.text('Performance Band Scale:  O (>=90% Outstanding)  |  A+ (80-89% Excellent)  |  A (70-79% Very Good)  |  B (60-69% Good)  |  C (50-59% Pass)  |  F (<50% Re-attempt)', 105, scaleY, { align: 'center' });

      // Signature Footer (Center Aligned)
      const signY = scaleY + 4;
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.4);
      doc.line(14, signY, 196, signY);

      if (signatureData) {
        try {
          // Page center is 105mm. Image width 36mm -> X = 87mm
          doc.addImage(signatureData, 'PNG', 87, signY + 3, 36, 12);
        } catch (imgErr) {
          // fallback if image fail
        }
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Course Instructor / Evaluator', 105, signY + 19, { align: 'center' });

      doc.save(`${sub.rollNo}_${sub.studentName.replace(/\s+/g, '_')}_Report_Card.pdf`);
      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 9000);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      if (!isAuto) {
        alert('Could not download PDF. You can view the report card on-screen.');
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const t = {
    bg: isDark ? '#0b0f19' : '#f8fafc',
    cardBg: isDark ? '#111827' : '#ffffff',
    cardBgAlt: isDark ? '#1a2234' : '#f1f5f9',
    border: isDark ? '#1f293d' : '#e2e8f0',
    borderHighlight: isDark ? '#374151' : '#cbd5e1',
    text: isDark ? '#f9fafb' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#334155',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    accentEmeraldBg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
    accentEmeraldText: '#10b981',
    shadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.05)'
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      
      {/* Search / Login Header */}
      {!result && (
        <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '36px 32px', boxShadow: t.shadow, textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: t.accentEmeraldBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10b981' }}>
            <Award size={28} />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px', color: t.text }}>
            Student Evaluation & Report Card Portal
          </h2>
          <p style={{ fontSize: '0.86rem', color: t.textMuted, maxWidth: '580px', margin: '0 auto 28px' }}>
            Enter your institutional Roll Number to view your marks, formula accuracy breakdown, AI forensic verification, and download your official signed report card.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', gap: '8px' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                placeholder="Enter Roll No (e.g. 019, 26-AVA-034, PROV-ASAV...)"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '8px',
                  border: `1.5px solid ${error ? '#ef4444' : t.borderHighlight}`,
                  backgroundColor: t.cardBgAlt,
                  color: t.text,
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: '#090d16',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {loading ? 'Locating...' : 'Check Evaluation'}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', maxWidth: '520px', margin: '16px auto 0', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Roll Chips */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: `1px solid ${t.border}`, fontSize: '0.78rem', color: t.textMuted }}>
            <span style={{ marginRight: '8px', fontWeight: 600 }}>Quick sample lookups:</span>
            {['019', '034', '049', '010', '001'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setRollInput(chip);
                  handleSearch(chip);
                }}
                style={{
                  backgroundColor: t.cardBgAlt,
                  border: `1px solid ${t.border}`,
                  color: t.textSecondary,
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  margin: '0 4px',
                  transition: 'all 0.15s'
                }}
              >
                Roll {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* When Found but Not Submitted */}
      {result && result.submitted === false && (
        <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '36px 32px', boxShadow: t.shadow, textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(234, 179, 8, 0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#eab308' }}>
            <Clock size={24} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: t.text }}>
            Registered Student: {result.student?.name}
          </h3>
          <div style={{ display: 'inline-block', backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: t.textMuted, marginBottom: '16px' }}>
            {result.student?.rollNo}
          </div>

          <p style={{ fontSize: '0.88rem', color: t.textSecondary, maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            {result.message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {onBackToAssignment && (
              <button
                onClick={onBackToAssignment}
                style={{
                  backgroundColor: '#10b981',
                  color: '#090d16',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Go to Active Assignment Submission →
              </button>
            )}
            <button
              onClick={() => {
                setResult(null);
                setRollInput('');
              }}
              style={{
                backgroundColor: 'transparent',
                border: `1px solid ${t.border}`,
                color: t.textSecondary,
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Search Another Roll No
            </button>
          </div>
        </div>
      )}

      {/* When Submission Evaluated */}
      {result && result.submitted === true && result.submission && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Return Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => {
                setResult(null);
                setRollInput('');
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: t.textMuted,
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0'
              }}
            >
              <ArrowLeft size={16} /> Check another roll number
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: t.cardBgAlt,
                  color: t.textSecondary,
                  border: `1px solid ${t.borderHighlight}`,
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
                <Printer size={15} /> View Full Report Card
              </button>

              <button
                onClick={() => handleDownloadPdf()}
                disabled={isDownloadingPdf}
                style={{
                  backgroundColor: '#10b981',
                  color: '#090d16',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: isDownloadingPdf ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} /> {isDownloadingPdf ? 'Generating...' : 'Download PDF Report Card'}
              </button>
            </div>
          </div>

          {/* Background Auto-Download Toast Notification */}
          {downloadSuccessToast && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '10px 18px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', boxShadow: '0 2px 10px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
                <span>Official Report Card PDF has been downloaded in the background to your device.</span>
              </div>
              <button
                onClick={() => setDownloadSuccessToast(false)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, padding: '2px 6px' }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {/* Student Profile Card */}
          <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '24px 28px', boxShadow: t.shadow }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span style={{ backgroundColor: t.accentEmeraldBg, color: t.accentEmeraldText, fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                  EVALUATED SUBMISSION RECORD
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 4px', color: t.text }}>
                  {result.submission.studentName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: t.textMuted }}>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>{result.submission.rollNo}</span>
                  <span>•</span>
                  <span>{result.submission.courseCode} - B.Sc Aviation</span>
                  <span>•</span>
                  <span>Evaluated: {new Date(result.submission.evaluatedAt || result.submission.submittedAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              {/* Score Highlight Badge */}
              <div style={{ textAlign: 'right', backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, padding: '12px 20px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: t.textMuted, textTransform: 'uppercase' }}>Total Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1.1 }}>
                  {result.submission.score} <span style={{ fontSize: '0.9rem', color: t.textMuted }}>/ {result.submission.maxMarks}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {result.submission.scorePercentage}% • Grade {result.submission.gradeLetter}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Detail Grid Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            
            {/* Card 1: Formulas Used */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                1. Formulas & Structure
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
                {result.submission.forensics.totalFormulasFound} Cells
              </div>
              <div style={{ fontSize: '0.78rem', color: t.textSecondary, lineHeight: 1.4 }}>
                <strong>Functions Used:</strong>{' '}
                {(result.submission.forensics.formulaTypes || []).join(', ') || 'SUM, AVERAGE, COUNT'}
              </div>
              <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                {result.submission.forensics.sheetNames.length} worksheets validated
              </div>
            </div>

            {/* Card 2: Result Accuracy */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                2. Result Accuracy
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px' }}>
                {result.submission.resultAccuracy?.percentage || result.submission.scorePercentage}%
              </div>
              <div style={{ fontSize: '0.78rem', color: t.textSecondary, lineHeight: 1.4 }}>
                <strong>Status:</strong> {result.submission.resultAccuracy?.status || 'Satisfactory'}
              </div>
              <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                Computational precision checked
              </div>
            </div>

            {/* Card 3: AI & Software Audit */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                3. Software & AI Audit
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: t.text, marginBottom: '6px' }}>
                {result.submission.forensics.application || 'Microsoft Excel'}
              </div>
              <div style={{ fontSize: '0.78rem', color: result.submission.aiToolsUsed?.detected ? '#f87171' : '#10b981', fontWeight: 700, lineHeight: 1.4 }}>
                AI Tools: {result.submission.aiToolsUsed?.toolNames?.join(', ') || 'None Detected'}
              </div>
              <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                Active Edit Time: {result.submission.forensics.totalTimeMinutes}m
              </div>
            </div>

            {/* Card 4: Integrity Status */}
            <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                4. Integrity Status
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: result.submission.forensics.integrityLevel === 'clean' ? '#10b981' : '#facc15', marginBottom: '6px' }}>
                {result.submission.forensics.integrityScore} / 100
              </div>
              <div style={{ fontSize: '0.78rem', color: t.textSecondary, lineHeight: 1.4 }}>
                <strong>Status:</strong>{' '}
                {result.submission.forensics.integrityLevel === 'clean' ? '🟢 Authentic' : '⚠️ Verified with Discrepancies'}
              </div>
              <div style={{ fontSize: '0.74rem', color: t.textMuted, marginTop: '6px' }}>
                Laboratory standards verified
              </div>
            </div>

          </div>

          {/* Instructor Remarks Card */}
          <div style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '20px 24px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', marginBottom: '6px' }}>
              Evaluator Remarks & Academic Sign-off
            </div>
            <p style={{ fontSize: '0.86rem', color: t.textSecondary, margin: '0 0 16px', lineHeight: 1.5 }}>
              {result.submission.instructorRemarks || 'Evaluation completed. Work verified against institutional computing standards.'}
            </p>

            {/* Academic Performance Scale Strip */}
            <div style={{ backgroundColor: t.cardBgAlt, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 12px', marginBottom: '14px', fontSize: '0.72rem', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 800, color: t.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Performance Scale:</span>
              <span><strong>O</strong> (≥90% Outstanding)</span>
              <span>•</span>
              <span><strong>A+</strong> (80–89% Excellent)</span>
              <span>•</span>
              <span><strong>A</strong> (70–79% Very Good)</span>
              <span>•</span>
              <span><strong>B</strong> (60–69% Good)</span>
              <span>•</span>
              <span><strong>C</strong> (50–59% Pass)</span>
              <span>•</span>
              <span><strong>F</strong> (&lt;50% Re-attempt)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: `1px solid ${t.border}`, paddingTop: '14px', textAlign: 'center' }}>
              {signatureData && (
                <img src={signatureData} alt="Course Instructor / Evaluator Signature" style={{ height: '38px', objectFit: 'contain', marginBottom: '6px', display: 'block' }} />
              )}
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: t.text }}>Course Instructor / Evaluator</div>
            </div>
          </div>

        </div>
      )}

      {/* Visual Report Card Modal */}
      {showModal && result?.submission && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '12px',
              maxWidth: '1060px',
              width: '96vw',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
          >
            {/* Modal Close / Print Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                Official Student Report Card Preview
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDownloadPdf}
                  style={{ backgroundColor: '#10b981', color: '#090d16', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Download size={13} /> Download PDF
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div style={{ padding: '24px 28px' }}>
              {/* Header */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: '#0f172a', textTransform: 'uppercase' }}>
                    Laboratory Evaluation Report Card
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                    Computing Skills & Data Analytics Laboratory | Academic Year 2026
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                    OFFICIAL TRANSCRIPT
                  </span>
                </div>
              </div>

              {/* Student Metadata Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '14px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#64748b', width: '18%' }}>Candidate Name:</td>
                    <td style={{ padding: '5px 8px', fontWeight: 800, color: '#0f172a', width: '32%' }}>{result.submission.studentName}</td>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#64748b', width: '18%' }}>Course Code:</td>
                    <td style={{ padding: '5px 8px', fontWeight: 800, color: '#0f172a', width: '32%' }}>{result.submission.courseCode} - B.Sc Aviation</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#64748b' }}>Roll Number:</td>
                    <td style={{ padding: '5px 8px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>{result.submission.rollNo}</td>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#64748b' }}>Evaluation Date:</td>
                    <td style={{ padding: '5px 8px', color: '#0f172a' }}>{new Date(result.submission.evaluatedAt || result.submission.submittedAt).toLocaleDateString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 8px', fontWeight: 700, color: '#64748b' }}>Assignment:</td>
                    <td colSpan={3} style={{ padding: '5px 8px', fontWeight: 700, color: '#2563eb' }}>{result.submission.assignmentTitle}</td>
                  </tr>
                </tbody>
              </table>

              {/* Score Highlight Strip */}
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Marks Awarded</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284c7' }}>
                    {result.submission.score} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {result.submission.maxMarks}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Performance Grade</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    {result.submission.scorePercentage}% (Grade {result.submission.gradeLetter})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Integrity Status</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: result.submission.forensics.integrityLevel === 'clean' ? '#059669' : '#dc2626' }}>
                    {result.submission.forensics.integrityLevel === 'clean' ? 'Authentic Work' : 'Flagged for Review'}
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px', fontSize: '0.76rem' }}>
                
                {/* Column 1: Formulas & Result Accuracy */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                    Formulae & Computational Accuracy
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#334155' }}>
                    <div><strong>Formulas Extracted:</strong> {result.submission.forensics.totalFormulasFound} cells active</div>
                    <div><strong>Functions Used:</strong> {(result.submission.forensics.formulaTypes || []).join(', ') || 'SUM, AVERAGE, COUNT'}</div>
                    <div><strong>Accuracy Status:</strong> <span style={{ color: '#059669', fontWeight: 700 }}>{result.submission.resultAccuracy?.status} ({result.submission.resultAccuracy?.percentage}%)</span></div>
                    <div><strong>Data Setup:</strong> {result.submission.resultAccuracy?.dataSetupAccuracy}%</div>
                  </div>
                </div>

                {/* Column 2: AI & Software Audit */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 14px', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                    Software & AI Authoring Audit
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#334155' }}>
                    <div><strong>Software Signature:</strong> {result.submission.forensics.application}</div>
                    <div><strong>AI Tools Detected:</strong> <span style={{ color: result.submission.aiToolsUsed?.detected ? '#dc2626' : '#059669', fontWeight: 700 }}>{result.submission.aiToolsUsed?.toolNames?.join(', ')}</span></div>
                    <div><strong>Active Editing Time:</strong> {result.submission.forensics.totalTimeMinutes} minutes</div>
                    <div><strong>Integrity Score:</strong> {result.submission.forensics.integrityScore}/100</div>
                  </div>
                </div>

              </div>

              {/* Remarks */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 14px', backgroundColor: '#f8fafc', marginBottom: '14px', fontSize: '0.76rem' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Instructor Remarks</div>
                <div style={{ color: '#475569' }}>{result.submission.instructorRemarks}</div>
              </div>

              {/* Academic Performance Grading Scale Key Strip */}
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 12px', marginBottom: '12px', fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
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

              {/* Sign-off with Signature (Center Aligned) */}
              <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '0.78rem' }}>
                {signatureData && (
                  <img src={signatureData} alt="Course Instructor / Evaluator Signature" style={{ height: '42px', objectFit: 'contain', marginBottom: '4px', display: 'block' }} />
                )}
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Course Instructor / Evaluator</div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
