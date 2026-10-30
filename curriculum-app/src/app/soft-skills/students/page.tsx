"use client";

import React, { useState, useEffect } from 'react';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  Scissors, 
  FileText, 
  X, 
  Check, 
  Edit3,
  Video
} from 'lucide-react';

const LinkedinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z"/>
  </svg>
);

export default function SoftSkillsStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTendency, setSelectedTendency] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editTendency, setEditTendency] = useState<string>('Seeker');
  const [editLinkedInUrl, setEditLinkedInUrl] = useState<string>('');
  const [editPhotoCheck, setEditPhotoCheck] = useState<boolean>(true);
  const [editGroomingW1, setEditGroomingW1] = useState<string>('PASS');
  const [editGroomingW4, setEditGroomingW4] = useState<string>('PASS');
  const [editNonVerbalFix, setEditNonVerbalFix] = useState<string>('');
  const [editPacingFix, setEditPacingFix] = useState<string>('');
  const [editContentFix, setEditContentFix] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/soft-skills/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setAnalytics(data.analytics || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (st: any) => {
    setEditingStudent(st);
    setEditTendency(st.dominantTendency || 'Seeker');
    setEditLinkedInUrl(st.linkedIn?.profileUrl || '');
    setEditPhotoCheck(Boolean(st.linkedIn?.photoInUniform));
    setEditGroomingW1(st.groomingStatus?.week1Check || 'PASS');
    setEditGroomingW4(st.groomingStatus?.week4Check || 'PENDING');
    setEditNonVerbalFix(st.actionPlan?.nonVerbalFix || '');
    setEditPacingFix(st.actionPlan?.pacingFix || '');
    setEditContentFix(st.actionPlan?.contentFix || '');
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSaving(true);

    try {
      const updated = {
        ...editingStudent,
        dominantTendency: editTendency,
        linkedIn: {
          ...editingStudent.linkedIn,
          profileUrl: editLinkedInUrl,
          photoInUniform: editPhotoCheck,
          hasProfile: Boolean(editLinkedInUrl)
        },
        groomingStatus: {
          ...editingStudent.groomingStatus,
          week1Check: editGroomingW1,
          week4Check: editGroomingW4
        },
        actionPlan: {
          nonVerbalFix: editNonVerbalFix,
          pacingFix: editPacingFix,
          contentFix: editContentFix
        }
      };

      const res = await fetch('/api/soft-skills/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      const data = await res.json();
      if (data.success) {
        setEditingStudent(null);
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update student profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(st => {
    const matchesSection = selectedSection === 'All' || st.section === selectedSection;
    const matchesTendency = selectedTendency === 'All' || st.dominantTendency === selectedTendency;
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesTendency && matchesSearch;
  });

  const getTendencyBadge = (t: string) => {
    switch (t) {
      case 'Leader':
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Learner':
        return { background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', border: '1px solid rgba(37, 99, 235, 0.2)' };
      case 'Inquisitive':
        return { background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea', border: '1px solid rgba(147, 51, 234, 0.2)' };
      default: // Seeker
        return { background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.2)' };
    }
  };

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <UserCheck size={18} />
              <span>Individual-First Coaching Portfolio</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Student Tendency & Compliance Profiles
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
              Tracking innate tendencies (Seeker, Learner, Leader, Inquisitive), personal 3-point action plans, 
              LinkedIn readiness, and grooming audit spot-checks for 64 Alliance Aviation students.
            </p>
          </div>
        </div>

        {/* Tendency Cards Dashboard */}
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
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>SEEKERS ({analytics.tendencyCounts?.Seeker || 0})</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.25rem 0 0.35rem 0' }}>
                High Initiative
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Focus: Grounding enthusiasm into concrete STAR frameworks.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700 }}>LEARNERS ({analytics.tendencyCounts?.Learner || 0})</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.25rem 0 0.35rem 0' }}>
                Reflective Observers
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Focus: Accelerating GD entry speed within first 2 minutes.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 700 }}>LEADERS ({analytics.tendencyCounts?.Leader || 0})</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.25rem 0 0.35rem 0' }}>
                Assertive Drivers
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Focus: Inclusive facilitation & active listening drills.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#9333ea', fontWeight: 700 }}>INQUISITIVE ({analytics.tendencyCounts?.Inquisitive || 0})</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.25rem 0 0.35rem 0' }}>
                Critical Thinkers
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Focus: Streamlining 1-minute responses without over-analyzing.
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
              <span>Tendency:</span>
              <select
                value={selectedTendency}
                onChange={(e) => setSelectedTendency(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              >
                <option value="All">All Tendencies</option>
                <option value="Seeker">Seeker</option>
                <option value="Learner">Learner</option>
                <option value="Leader">Leader</option>
                <option value="Inquisitive">Inquisitive</option>
              </select>
            </div>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search student or roll number..."
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

        {/* Student Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              Loading student profiles...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              No students found matching filters.
            </div>
          ) : (
            filteredStudents.map(st => (
              <div
                key={st.rollNo}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {st.rollNo}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.15rem 0', color: 'var(--text-main)' }}>
                        {st.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {st.section} · {st.program}
                      </div>
                    </div>

                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      ...getTendencyBadge(st.dominantTendency)
                    }}>
                      {st.dominantTendency}
                    </span>
                  </div>

                  {/* 3-Point Action Plan Box */}
                  <div style={{
                    background: 'var(--bg-app)',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    margin: '0.85rem 0',
                    fontSize: '0.8rem',
                    lineHeight: 1.4
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={13} color="var(--accent-primary)" />
                      <span>3-Point Action Plan:</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      • <strong>Non-Verbal:</strong> {st.actionPlan?.nonVerbalFix || 'Posture calibration'}<br />
                      • <strong>Pacing:</strong> {st.actionPlan?.pacingFix || 'Strategic pauses'}<br />
                      • <strong>Content:</strong> {st.actionPlan?.contentFix || 'Real-incident STAR anchor'}
                    </div>
                  </div>

                  {/* Compliance Badges Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
                    {st.linkedIn?.hasProfile ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', fontWeight: 600 }}>
                        <LinkedinIcon />
                        <span>LinkedIn Active</span>
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontWeight: 600 }}>
                        <AlertCircle size={12} />
                        <span>No LinkedIn</span>
                      </span>
                    )}

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: st.groomingStatus?.week4Check === 'PASS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: st.groomingStatus?.week4Check === 'PASS' ? '#059669' : '#d97706', fontWeight: 600 }}>
                      <Scissors size={12} />
                      <span>Grooming: {st.groomingStatus?.week4Check || 'PASS'}</span>
                    </span>

                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-app)', color: 'var(--text-main)', fontWeight: 600 }}>
                      <span>CEFR: {st.englishScoreBaseline?.cefr || 'A2'}</span>
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openEditModal(st)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile & Plan</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Student Modal */}
        {editingStudent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
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
                onClick={() => setEditingStudent(null)}
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

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
                {editingStudent.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                {editingStudent.rollNo} · {editingStudent.section}
              </p>

              <form onSubmit={handleSaveStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Dominant Innate Tendency
                  </label>
                  <select
                    value={editTendency}
                    onChange={(e) => setEditTendency(e.target.value)}
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
                    <option value="Seeker">Seeker (Curious, High Energy)</option>
                    <option value="Learner">Learner (Observant, Methodical)</option>
                    <option value="Leader">Leader (Assertive, Action-Oriented)</option>
                    <option value="Inquisitive">Inquisitive (Analytical, Questioning)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Grooming W1 Spot-Check
                    </label>
                    <select
                      value={editGroomingW1}
                      onChange={(e) => setEditGroomingW1(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                    >
                      <option value="PASS">PASS</option>
                      <option value="FLAGGED">FLAGGED (Needs Fix)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Grooming W4 Spot-Check
                    </label>
                    <select
                      value={editGroomingW4}
                      onChange={(e) => setEditGroomingW4(e.target.value)}
                      style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                    >
                      <option value="PASS">PASS</option>
                      <option value="PENDING">PENDING</option>
                      <option value="FLAGGED">FLAGGED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={editLinkedInUrl}
                    onChange={(e) => setEditLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    id="photoCheck"
                    checked={editPhotoCheck}
                    onChange={(e) => setEditPhotoCheck(e.target.checked)}
                  />
                  <label htmlFor="photoCheck">Profile photo is in uniform with college tag / formal semi-casual</label>
                </div>

                {/* 3 Point Action Plan Fields */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    3-Point Individual Action Plan:
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Non-Verbal Fix (Posture / Eyes / Hands)</label>
                    <input
                      type="text"
                      value={editNonVerbalFix}
                      onChange={(e) => setEditNonVerbalFix(e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pacing & Clarity Fix (Pauses / Fillers)</label>
                    <input
                      type="text"
                      value={editPacingFix}
                      onChange={(e) => setEditPacingFix(e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Content Fix (Story / STAR proof)</label>
                    <input
                      type="text"
                      value={editContentFix}
                      onChange={(e) => setEditContentFix(e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
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
                    disabled={isSaving}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--accent-primary)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
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
