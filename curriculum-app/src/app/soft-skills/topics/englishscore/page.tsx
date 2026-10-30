"use client";

import React, { useState, useEffect } from 'react';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { 
  BarChart3, 
  UploadCloud, 
  CheckCircle2, 
  Search, 
  Download, 
  FileCheck, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  X, 
  Eye,
  Check
} from 'lucide-react';

export default function EnglishScorePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedCefr, setSelectedCefr] = useState<string>('All');

  // Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  // Form State
  const [formRollNo, setFormRollNo] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formSection, setFormSection] = useState<string>('Section A');
  const [formAttempt, setFormAttempt] = useState<string>('Baseline Diagnostic');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formOverallScore, setFormOverallScore] = useState<number>(320);
  const [formGrammar, setFormGrammar] = useState<number>(310);
  const [formVocab, setFormVocab] = useState<number>(330);
  const [formReading, setFormReading] = useState<number>(320);
  const [formListening, setFormListening] = useState<number>(320);
  const [formScreenshotUrl, setFormScreenshotUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Students roster for dropdown
  const [roster, setRoster] = useState<{ rollNo: string; name: string }[]>([]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/soft-skills/englishscore');
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setAnalytics(data.analytics || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // Load student roster
    fetch('/api/soft-skills/students')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.students) {
          setRoster(data.students.map((s: any) => ({ rollNo: s.rollNo, name: s.name, section: s.section })));
        }
      })
      .catch(console.error);
  }, []);

  const handleStudentSelect = (roll: string) => {
    setFormRollNo(roll);
    const found = roster.find(r => r.rollNo === roll);
    if (found) {
      setFormName(found.name);
    }
  };

  const calculateCefr = (score: number) => {
    if (score >= 500) return 'C1';
    if (score >= 400) return 'B2';
    if (score >= 300) return 'B1';
    if (score >= 200) return 'A2';
    return 'A1';
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRollNo || !formName) {
      alert('Please select or enter student details.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/soft-skills/englishscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNo: formRollNo,
          studentName: formName,
          section: formSection,
          attemptType: formAttempt,
          testDate: formDate,
          overallScore: Number(formOverallScore),
          cefrLevel: calculateCefr(Number(formOverallScore)),
          grammar: Number(formGrammar),
          vocabulary: Number(formVocab),
          reading: Number(formReading),
          listening: Number(formListening),
          screenshotUrl: formScreenshotUrl || '/images/better_worksheet.jpg'
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitModalOpen(false);
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save EnglishScore report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ['Roll No', 'Student Name', 'Program', 'Section', 'Attempt', 'Test Date', 'Overall Score', 'CEFR Level', 'Grammar', 'Vocabulary', 'Reading', 'Listening'];
    const rows = records.map(r => [
      `"${r.rollNo}"`,
      `"${r.studentName}"`,
      `"${r.program || 'B.Sc Aviation'}"`,
      `"${r.section}"`,
      `"${r.attemptType}"`,
      `"${r.testDate}"`,
      r.overallScore,
      `"${r.cefrLevel}"`,
      r.grammar,
      r.vocabulary,
      r.reading,
      r.listening
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `British_Council_EnglishScore_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => {
    const matchesSection = selectedSection === 'All' || r.section === selectedSection;
    const matchesCefr = selectedCefr === 'All' || r.cefrLevel === selectedCefr;
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesCefr && matchesSearch;
  });

  const getCefrBadgeStyle = (cefr: string) => {
    switch (cefr) {
      case 'C1':
      case 'B2':
        return { background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'B1':
        return { background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.2)' };
      case 'A2':
        return { background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' };
      default:
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.2)' };
    }
  };

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <BarChart3 size={18} />
              <span>British Council Diagnostic Framework</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              EnglishScore Testing & CEFR Progression Hub
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
              Tracking baseline scores, screenshot evidence, and December retake progression for 64 Alliance Aviation students.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.15rem',
                borderRadius: '8px',
                background: 'var(--accent-primary)',
                border: 'none',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <UploadCloud size={16} />
              <span>Log Score Evidence</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        {analytics && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Assessed</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: 'var(--text-main)' }}>
                {analytics.totalStudents} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 64 Students</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={13} />
                <span>100% Baseline Coverage</span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cohort Average Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: 'var(--accent-primary)' }}>
                {analytics.averageScore} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 599</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Baseline CEFR Equivalent: <strong>B1 (Developing)</strong>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bridge Clinic Needed</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: '#dc2626' }}>
                {analytics.bridgeNeededCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Students (Pre-A1/A1)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Targeting morning/evening vocabulary drills
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>December Retake Target</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: '#059669' }}>
                +50 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Score Delta Goal</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Scheduled for December End-of-Term Check
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="All">All Sections</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>CEFR Level:</span>
              <select
                value={selectedCefr}
                onChange={(e) => setSelectedCefr(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="All">All Levels</option>
                <option value="A1">A1 (Foundation)</option>
                <option value="A2">A2 (Developing)</option>
                <option value="B1">B1 (Intermediate)</option>
                <option value="B2">B2 (Vantage)</option>
              </select>
            </div>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by student or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.45rem 0.85rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-app)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                width: '100%',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Diagnostic Score Table */}
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Roll Number</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Section</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Overall Score</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>CEFR Level</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Sub-Scores (G/V/R/L)</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading diagnostic records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No students match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {r.rollNo}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {r.studentName}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                      {r.section}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-primary)' }}>
                      {r.overallScore}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        ...getCefrBadgeStyle(r.cefrLevel)
                      }}>
                        {r.cefrLevel}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <span title="Grammar">G: {r.grammar || '-'}</span> · <span title="Vocabulary">V: {r.vocabulary || '-'}</span> · <span title="Reading">R: {r.reading || '-'}</span> · <span title="Listening">L: {r.listening || '-'}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {r.screenshotUrl ? (
                        <button
                          onClick={() => setActiveScreenshot(r.screenshotUrl)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            background: 'var(--bg-app)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--accent-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={13} />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No Proof</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Screenshot Lightbox Modal */}
        {activeScreenshot && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '2rem'
          }}>
            <div style={{ position: 'relative', maxWidth: '600px', width: '100%', background: 'var(--bg-surface)', borderRadius: '12px', overflow: 'hidden' }}>
              <button
                onClick={() => setActiveScreenshot(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
                EnglishScore Test Evidence
              </div>
              <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', background: '#000' }}>
                <img src={activeScreenshot} alt="Evidence" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        )}

        {/* Score Submission Modal */}
        {isSubmitModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                Log EnglishScore Diagnostic
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Record scores and upload certificate or screenshot verification.
              </p>

              <form onSubmit={handleSubmitScore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Select Student
                  </label>
                  <select
                    value={formRollNo}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="">-- Choose Alliance Aviation Student --</option>
                    {roster.map(st => (
                      <option key={st.rollNo} value={st.rollNo}>
                        {st.name} ({st.rollNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Section
                    </label>
                    <select
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Section A">Section A</option>
                      <option value="Section B">Section B</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Attempt Phase
                    </label>
                    <select
                      value={formAttempt}
                      onChange={(e) => setFormAttempt(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="Baseline Diagnostic">Baseline Diagnostic</option>
                      <option value="December Retake">December Retake</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Overall Score (0-599)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={599}
                      value={formOverallScore}
                      onChange={(e) => setFormOverallScore(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-app)',
                        color: 'var(--text-main)',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Calculated CEFR Level
                    </label>
                    <div style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      background: 'var(--bg-app)',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      textAlign: 'center',
                      fontSize: '0.9rem'
                    }}>
                      {calculateCefr(formOverallScore)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Grammar</label>
                    <input
                      type="number"
                      value={formGrammar}
                      onChange={(e) => setFormGrammar(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Vocab</label>
                    <input
                      type="number"
                      value={formVocab}
                      onChange={(e) => setFormVocab(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Reading</label>
                    <input
                      type="number"
                      value={formReading}
                      onChange={(e) => setFormReading(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Listening</label>
                    <input
                      type="number"
                      value={formListening}
                      onChange={(e) => setFormListening(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Score Screenshot Evidence URL
                  </label>
                  <input
                    type="text"
                    value={formScreenshotUrl}
                    onChange={(e) => setFormScreenshotUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or paste image path"
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Note: If Android blocks screenshotting, photograph screen from another phone and link here.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    style={{
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Check size={16} />
                    <span>{isSubmitting ? 'Saving...' : 'Save Record'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SoftSkillsNav>
  );
}
