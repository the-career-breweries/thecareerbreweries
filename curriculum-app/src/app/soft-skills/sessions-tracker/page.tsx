"use client";

import React, { useState, useEffect } from 'react';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { SOFTSKILLS_TOPICS } from '@/data/softskills-topics';
import { 
  ClipboardCheck, 
  Plus, 
  Download, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Search, 
  Filter, 
  X, 
  Eye, 
  Check 
} from 'lucide-react';

export default function SoftSkillsSessionsTrackerPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Log Session Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [activeSessionDetail, setActiveSessionDetail] = useState<any>(null);

  // Form State
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [section, setSection] = useState<string>('Section A');
  const [durationMinutes, setDurationMinutes] = useState<number>(40);
  const [topicSlug, setTopicSlug] = useState<string>('confidence-mindset');
  const [subtopicText, setSubtopicText] = useState<string>('1.1 Facing your fears, 1.2 Calm-down routine');
  const [activityTitle, setActivityTitle] = useState<string>('Three Words My Friends Use For Me');
  const [studentCount, setStudentCount] = useState<number>(31);
  const [engagementLevel, setEngagementLevel] = useState<string>('High');
  const [observedCefr, setObservedCefr] = useState<string>('A2');
  const [complementaryNeeded, setComplementaryNeeded] = useState<boolean>(false);
  const [materialsUsed, setMaterialsUsed] = useState<string>('Worksheets, Index Cards, Stopwatch');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/soft-skills/sessions');
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        setKpis(data.kpis || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleTopicChange = (slug: string) => {
    setTopicSlug(slug);
    const found = SOFTSKILLS_TOPICS.find(t => t.slug === slug);
    if (found && found.subtopics.length > 0) {
      setSubtopicText(found.subtopics.map(st => `${st.number} ${st.title}`).slice(0, 2).join(', '));
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const foundTopic = SOFTSKILLS_TOPICS.find(t => t.slug === topicSlug);

    try {
      const res = await fetch('/api/soft-skills/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionDate,
          section,
          campus: 'Alliance University',
          program: 'B.Sc Aviation',
          instructorName: 'S D Sandarsh',
          durationMinutes: Number(durationMinutes),
          topicId: foundTopic?.id || '',
          topicSlug,
          topicTitle: foundTopic?.title || topicSlug,
          subtopicsCovered: subtopicText.split(',').map(s => s.trim()).filter(Boolean),
          activityTitle,
          studentCount: Number(studentCount),
          engagementLevel,
          observedCefr,
          complementarySessionNeeded: complementaryNeeded,
          materialsUsed,
          evidenceLinks: evidenceUrl ? [evidenceUrl] : ['/images/hero_students_workshop.jpg'],
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsLogModalOpen(false);
        setNotes('');
        setEvidenceUrl('');
        fetchSessions();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (sessions.length === 0) return;
    const headers = [
      'Session #', 'Date', 'Campus', 'Program', 'Section', 'Instructor', 'Duration (Mins)', 
      'Topic', 'Subtopics', 'Activity', 'Students Count', 'Engagement', 'Observed CEFR', 
      'Complementary Needed?', '48h Compliant?', 'Evidence Link', 'Trainer Notes'
    ];
    const rows = sessions.map(s => [
      s.sessionNumber,
      `"${s.sessionDate}"`,
      `"${s.campus}"`,
      `"${s.program}"`,
      `"${s.section}"`,
      `"${s.instructorName}"`,
      s.durationMinutes,
      `"${s.topicTitle}"`,
      `"${(s.subtopicsCovered || []).join('; ')}"`,
      `"${s.activityTitle}"`,
      s.studentCount,
      `"${s.engagementLevel}"`,
      `"${s.observedCefr}"`,
      s.complementarySessionNeeded ? 'YES' : 'NO',
      s.isCompliant48h !== false ? 'YES' : 'NO',
      `"${(s.evidenceLinks || []).join('; ')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Alliance_SoftSkills_Master_Session_Tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSection = selectedSection === 'All' || s.section === selectedSection;
    const matchesTopic = selectedTopic === 'all' || s.topicSlug === selectedTopic;
    const matchesSearch = s.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesTopic && matchesSearch;
  });

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <ClipboardCheck size={18} />
              <span>MH Cockpit Operational Logbook</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Master Classroom Sessions Tracker
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
              Log each 30-40 minute soft skills session within the mandatory 48-hour compliance window. 
              Tracks observations, CEFR proficiencies, and verified photo/video evidence.
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
              onClick={() => setIsLogModalOpen(true)}
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
              <Plus size={16} />
              <span>Log New Session</span>
            </button>
          </div>
        </div>

        {/* KPI Dashboard */}
        {kpis && (
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Sessions Logged</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: 'var(--text-main)' }}>
                {kpis.totalSessions}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Alliance University · Aviation Department
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Student Reach</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: 'var(--accent-primary)' }}>
                {kpis.totalStudentsReached} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Attendees</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Across Section A and Section B
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>48h Logging Compliance</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', color: '#059669' }}>
                {kpis.complianceRate}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={13} />
                <span>{kpis.compliantCount} of {kpis.totalSessions} sessions logged within 48h</span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Primary Instructor</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.4rem 0 0.5rem 0', color: 'var(--text-main)' }}>
                S D Sandarsh
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Next Saturday Calibration Call Ready
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
              <span>Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                style={{
                  padding: '0.35rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  maxWidth: '220px'
                }}
              >
                <option value="all">All Topics</option>
                {SOFTSKILLS_TOPICS.map(t => (
                  <option key={t.slug} value={t.slug}>{t.shortTitle}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sessions or notes..."
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

        {/* Sessions Table */}
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
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Sess #</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Section</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Topic & Activity</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Students</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>CEFR Level</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>48h Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading session logbook...
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No sessions logged matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      #{s.sessionNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {s.sessionDate}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      {s.section}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.topicTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.activityTitle}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {s.studentCount}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--accent-primary)',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}>
                        {s.observedCefr}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {s.isCompliant48h !== false ? (
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <CheckCircle2 size={12} />
                          <span>48h Compliant</span>
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          background: 'rgba(245, 158, 11, 0.1)',
                          color: '#d97706',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <AlertTriangle size={12} />
                          <span>Logged Late</span>
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button
                        onClick={() => setActiveSessionDetail(s)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Inspect Session Detail Modal */}
        {activeSessionDetail && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setActiveSessionDetail(null)}
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

              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Session #{activeSessionDetail.sessionNumber} · {activeSessionDetail.sessionDate}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                {activeSessionDetail.topicTitle}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1.25rem 0' }}>
                Batch: {activeSessionDetail.section} ({activeSessionDetail.program}) · {activeSessionDetail.durationMinutes} Minutes
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
                <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px' }}>
                  <strong>Activity Conducted:</strong> {activeSessionDetail.activityTitle}
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px' }}>
                  <strong>Subtopics Covered:</strong> {(activeSessionDetail.subtopicsCovered || []).join(', ')}
                </div>

                <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px' }}>
                  <strong>Trainer Observations & Notes:</strong>
                  <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-main)', fontStyle: 'italic' }}>
                    "{activeSessionDetail.notes}"
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px' }}>
                    <strong>Engagement:</strong> {activeSessionDetail.engagementLevel}
                  </div>
                  <div style={{ background: 'var(--bg-app)', padding: '0.85rem', borderRadius: '8px' }}>
                    <strong>Observed CEFR:</strong> {activeSessionDetail.observedCefr}
                  </div>
                </div>

                {activeSessionDetail.evidenceLinks && activeSessionDetail.evidenceLinks.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Verified Evidence:</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {activeSessionDetail.evidenceLinks.map((link: string, i: number) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(37, 99, 235, 0.1)',
                            color: 'var(--accent-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <Camera size={14} />
                          <span>View Evidence #{i+1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Log Session Modal */}
        {isLogModalOpen && (
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setIsLogModalOpen(false)}
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
                Log Classroom Session
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Alliance University · 48-Hour Compliance Tracker
              </p>

              <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Session Date
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
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
                      Batch / Section
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
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
                      <option value="Section A">Section A (B.Sc Aviation)</option>
                      <option value="Section B">Section B (B.Sc Aviation)</option>
                      <option value="BBA Aviation">BBA Aviation</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Topic
                    </label>
                    <select
                      value={topicSlug}
                      onChange={(e) => handleTopicChange(e.target.value)}
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
                      {SOFTSKILLS_TOPICS.map(t => (
                        <option key={t.slug} value={t.slug}>{t.number}. {t.shortTitle}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Activity Conducted
                  </label>
                  <input
                    type="text"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder="e.g. Three Words My Friends Use For Me"
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
                    Subtopics Covered (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={subtopicText}
                    onChange={(e) => setSubtopicText(e.target.value)}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Students Present</label>
                    <input
                      type="number"
                      value={studentCount}
                      onChange={(e) => setStudentCount(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Engagement</label>
                    <select
                      value={engagementLevel}
                      onChange={(e) => setEngagementLevel(e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Observed CEFR</label>
                    <select
                      value={observedCefr}
                      onChange={(e) => setObservedCefr(e.target.value)}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)' }}
                    >
                      <option value="Pre-A1">Pre-A1</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Photo or Video Evidence Link
                  </label>
                  <input
                    type="text"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or image link"
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
                    Class Observations & Student Reflections
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Document student engagement, specific breakthroughs, or areas needing follow-up..."
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-app)',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
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
                    <span>{isSubmitting ? 'Saving...' : 'Log Session Record'}</span>
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
