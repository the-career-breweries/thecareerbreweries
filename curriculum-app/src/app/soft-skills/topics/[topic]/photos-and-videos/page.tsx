"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { SOFTSKILLS_TOPICS } from '@/data/softskills-topics';
import { 
  Camera, 
  Video, 
  UploadCloud, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  User, 
  Eye, 
  X, 
  ChevronLeft,
  ArrowRight,
  Filter,
  Layers
} from 'lucide-react';

export default function TopicPhotosAndVideosPage() {
  const params = useParams();
  const rawTopic = params.topic as string;
  const topicSlug = decodeURIComponent(rawTopic || 'confidence-mindset');

  const currentTopic = SOFTSKILLS_TOPICS.find(t => t.slug === topicSlug) || SOFTSKILLS_TOPICS[0];

  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [formSection, setFormSection] = useState<string>('Section A');
  const [formCategory, setFormCategory] = useState<string>('activity');
  const [formMediaType, setFormMediaType] = useState<string>('photo');
  const [formUrl, setFormUrl] = useState<string>('');
  const [formCaption, setFormCaption] = useState<string>('');
  const [formStudentName, setFormStudentName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Lightbox Media Modal
  const [activeMedia, setActiveMedia] = useState<any>(null);

  // Before & After Mode State
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false);

  const fetchEvidence = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/soft-skills/evidence?topicSlug=${currentTopic.slug}`);
      const data = await res.json();
      if (data.success) {
        setEvidenceList(data.evidence || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [currentTopic.slug]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl && !formCaption) {
      alert('Please provide an image link or caption.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/soft-skills/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicSlug: currentTopic.slug,
          section: formSection,
          category: formCategory,
          mediaType: formMediaType,
          url: formUrl || '/images/hero_students_workshop.jpg',
          caption: formCaption,
          studentName: formStudentName
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsUploadOpen(false);
        setFormUrl('');
        setFormCaption('');
        setFormStudentName('');
        fetchEvidence();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload evidence.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvidence = evidenceList.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSec = selectedSection === 'all' || item.section === selectedSection;
    return matchesCat && matchesSec;
  });

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1rem' }}>
          <Link
            href="/soft-skills/topics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            <ChevronLeft size={16} />
            <span>Back to Master Topics</span>
          </Link>
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
              <Camera size={18} />
              <span>Evidence Vault · Topic {currentTopic.number}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              {currentTopic.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
              Classroom photos, student pitch recordings, whiteboard artifacts, and before/after comparisons 
              for Alliance University Aviation cohorts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: showBeforeAfter ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                color: showBeforeAfter ? '#6366f1' : 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={16} />
              <span>Before & After Pitch Comparison</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
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
              <span>Upload Evidence</span>
            </button>
          </div>
        </div>

        {/* Before & After Interactive Showcase */}
        {showBeforeAfter && (
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '2px solid rgba(99, 102, 241, 0.3)',
            boxShadow: 'var(--shadow-md)',
            padding: '1.75rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} />
              <span>CAPSTONE PROGRESSION SHOWCASE</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Student Self-Introduction Evolution (Week 2 vs Week 10)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
              Demonstrating the transformation from hesitant, memorized baseline scripts into poised, authentic executive presence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Baseline Card */}
              <div style={{
                background: 'var(--bg-app)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#dc2626', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    WEEK 2 BASELINE PITCH
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>42 seconds</span>
                </div>
                <div style={{
                  height: '180px',
                  borderRadius: '8px',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <Play size={40} style={{ opacity: 0.8 }} />
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>
                    Dhyaana Vasudevan (Sec A)
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <strong>Diagnostic Notes:</strong> Voice dropped at endings, arms rigidly clamped to sides, recited lines rapidly from memory without pauses.
                </div>
              </div>

              {/* Capstone Card */}
              <div style={{
                background: 'var(--bg-app)',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    WEEK 10 POLISHED PITCH
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>54 seconds</span>
                </div>
                <div style={{
                  height: '180px',
                  borderRadius: '8px',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  <Play size={40} style={{ opacity: 0.8, color: '#10b981' }} />
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>
                    Dhyaana Vasudevan (Sec A)
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  <strong>Evaluator Review:</strong> Natural Present-Past-Future flow, calm eye contact, backed aviation passion with airport volunteering story. Ready for placement panel.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'All Evidence' },
              { id: 'activity', label: 'Classroom Activities' },
              { id: 'baseline_pitch', label: 'Baseline Pitches' },
              { id: 'capstone_pitch', label: 'Capstone Pitches' },
              { id: 'grooming', label: 'Grooming Audits' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === tab.id ? 600 : 500,
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === tab.id ? 'var(--accent-primary)' : 'var(--bg-app)',
                  color: selectedCategory === tab.id ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
              <option value="all">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading evidence vault...
          </div>
        ) : filteredEvidence.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            <Camera size={36} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>No evidence uploaded for this topic yet</div>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 1rem 0' }}>
              Take a classroom photo or record student pitch video clips and click Upload Evidence.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'var(--accent-primary)',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Upload Evidence Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredEvidence.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveMedia(item)}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Media Thumbnail */}
                <div style={{
                  height: '180px',
                  background: '#111',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.mediaType === 'video' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white', gap: '0.5rem' }}>
                      <Play size={40} style={{ opacity: 0.9 }} />
                      <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                        Video Clip
                      </span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white'
                  }}>
                    {item.section}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {item.caption}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{item.studentName || 'Classroom Cohort'}</span>
                    <span>{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Media Lightbox Modal */}
        {activeMedia && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '2rem'
          }}>
            <div style={{
              position: 'relative',
              maxWidth: '750px',
              width: '100%',
              background: 'var(--bg-surface)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)'
            }}>
              <button
                onClick={() => setActiveMedia(null)}
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
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>

              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
                {activeMedia.caption}
              </div>

              <div style={{ background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
                {activeMedia.mediaType === 'video' ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                    <Play size={48} style={{ margin: '0 auto 1rem auto' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Video evidence source:{' '}
                      <a href={activeMedia.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
                        {activeMedia.url}
                      </a>
                    </p>
                  </div>
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.caption}
                    style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Section: <strong>{activeMedia.section}</strong></span>
                <span>Category: <strong>{activeMedia.category}</strong></span>
                <span>Date: <strong>{new Date(activeMedia.uploadedAt).toLocaleDateString()}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
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
              position: 'relative'
            }}>
              <button
                onClick={() => setIsUploadOpen(false)}
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
                Upload Classroom Evidence
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Topic: {currentTopic.title}
              </p>

              <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                      Media Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
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
                      <option value="activity">Classroom Activity</option>
                      <option value="baseline_pitch">Student Baseline Video</option>
                      <option value="capstone_pitch">Student Capstone Video</option>
                      <option value="grooming">Grooming Spot-Check</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Student Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formStudentName}
                    onChange={(e) => setFormStudentName(e.target.value)}
                    placeholder="e.g. Dhyaana Vasudevan"
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
                    Photo / Video URL or Google Drive Link
                  </label>
                  <input
                    type="text"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or /images/..."
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
                    Caption / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    placeholder="Brief description of the classroom exercise or observation..."
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
                    onClick={() => setIsUploadOpen(false)}
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
                      fontSize: '0.875rem'
                    }}
                  >
                    {isSubmitting ? 'Saving...' : 'Upload Evidence'}
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
