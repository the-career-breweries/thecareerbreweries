"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { SOFTSKILLS_ACTIVITIES, SoftSkillActivity } from '@/data/softskills-activities';
import { SOFTSKILLS_TOPICS } from '@/data/softskills-topics';
import { 
  Sparkles, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  HelpCircle, 
  UploadCloud, 
  FileText, 
  Camera, 
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

export default function SoftSkillsActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalActivity, setActiveModalActivity] = useState<SoftSkillActivity | null>(null);
  
  // Log Activity Run Form State
  const [section, setSection] = useState<string>('Section A');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const categories = [
    'All',
    'Self-Discovery',
    'Communication',
    'Group Discussion',
    'Interview & STAR',
    'Aviation Simulation',
    'Creative Expression'
  ];

  const filteredActivities = SOFTSKILLS_ACTIVITIES.filter(act => {
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.facilitatorScript.whatIWillSay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalActivity) return;
    setIsSubmitting(true);

    try {
      // 1. Post to Evidence endpoint
      await fetch('/api/soft-skills/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicSlug: activeModalActivity.topicSlug,
          section,
          mediaType: 'photo',
          category: 'activity',
          url: mediaUrl || '/images/hero_students_workshop.jpg',
          caption: `${activeModalActivity.title} conducted in ${section}. ${notes}`
        })
      });

      // 2. Post to Sessions endpoint
      await fetch('/api/soft-skills/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionDate: logDate,
          section,
          topicId: activeModalActivity.topicId,
          topicSlug: activeModalActivity.topicSlug,
          topicTitle: SOFTSKILLS_TOPICS.find(t => t.id === activeModalActivity.topicId)?.title || activeModalActivity.title,
          activityTitle: activeModalActivity.title,
          durationMinutes: activeModalActivity.durationMinutes,
          materialsUsed: activeModalActivity.materialsRequired.join(', '),
          notes: notes || `Completed ${activeModalActivity.title} with high student engagement.`,
          evidenceLinks: mediaUrl ? [mediaUrl] : []
        })
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveModalActivity(null);
        setNotes('');
        setMediaUrl('');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} />
            <span>Classroom Activity Bank</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            List of Classroom Activities & Facilitation Guide
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
            Task-Based Learning (TBL) drills, self-discovery prompts, CCQs, and ICQs designed specifically 
            for Alliance University Aviation batches.
          </p>
        </div>

        {/* Filters */}
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
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? 600 : 500,
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === cat ? '#6366f1' : 'var(--bg-app)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search activities or prompts..."
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

        {/* Activities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredActivities.map(act => (
            <div
              key={act.id}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1'
                  }}>
                    {act.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    <Clock size={14} />
                    <span>{act.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Title & Tendency */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
                  {act.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
                  <UserCheck size={14} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-muted)' }}>Target Tendency:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{act.targetTendency}</span>
                </div>

                {/* Objective */}
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1.25rem 0' }}>
                  {act.objective}
                </p>

                {/* Facilitator Prompt Box */}
                <div style={{
                  background: 'var(--bg-app)',
                  borderRadius: '8px',
                  padding: '1rem',
                  borderLeft: '4px solid #6366f1',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#6366f1', marginBottom: '0.25rem' }}>
                    What I will say in class:
                  </div>
                  <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    "{act.facilitatorScript.whatIWillSay}"
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>What learners do:</strong> {act.facilitatorScript.whatLearnersDo}
                  </div>
                </div>

                {/* Materials Pill List */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong>Materials:</strong> {act.materialsRequired.join(', ')}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                marginTop: '0.5rem'
              }}>
                <Link
                  href={`/soft-skills/topics/${act.topicSlug}/photos-and-videos`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'none'
                  }}
                >
                  <Camera size={14} />
                  <span>Evidence Vault</span>
                </Link>

                <button
                  onClick={() => setActiveModalActivity(act)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    background: '#6366f1',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <UploadCloud size={16} />
                  <span>Log Activity Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Log Activity Run Modal */}
        {activeModalActivity && (
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
              maxWidth: '500px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <button
                onClick={() => setActiveModalActivity(null)}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', marginBottom: '0.5rem' }}>
                <UploadCloud size={20} />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Evidence Collection</span>
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                Log Activity Run
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {activeModalActivity.title}
              </p>

              {submitSuccess ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px'
                }}>
                  <CheckCircle2 size={48} style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Activity Logged Successfully!</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Saved to Session Tracker & Evidence Vault.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogActivity} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Date Conducted
                      </label>
                      <input
                        type="date"
                        value={logDate}
                        onChange={(e) => setLogDate(e.target.value)}
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
                      Classroom Observations & Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Students engaged actively. Identified 4 students who need extra practice on opening hooks..."
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Photo / Video Link or Drive URL
                    </label>
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or paste image link"
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
                      If blank, standard classroom session evidence is attached automatically.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalActivity(null)}
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
                        background: '#6366f1',
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
                      <span>{isSubmitting ? 'Logging...' : 'Submit Evidence'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </SoftSkillsNav>
  );
}
