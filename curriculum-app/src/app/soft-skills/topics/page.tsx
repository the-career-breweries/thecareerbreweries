"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SoftSkillsNav from '@/components/soft-skills/SoftSkillsNav';
import { SOFTSKILLS_TOPICS, SoftSkillTopic } from '@/data/softskills-topics';
import { 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Camera, 
  ClipboardCheck, 
  Target, 
  CheckCircle2, 
  Clock, 
  Award,
  Search
} from 'lucide-react';

export default function SoftSkillsTopicsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'topic-1': true,
    'topic-2': true
  });

  const categories = [
    'All',
    'Self-Presentation',
    'Communication Skills',
    'Interview Under Pressure',
    'Simulation & Review'
  ];

  const toggleExpand = (id: string) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTopics = SOFTSKILLS_TOPICS.filter(topic => {
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subtopics.some(st => st.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <SoftSkillsNav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            <Layers size={18} />
            <span>MH Cockpit Syllabus Calibration</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
            Master Topics & Subtopics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0, maxWidth: '850px' }}>
            The 10-module soft skills framework calibrated for Alliance University Aviation students. 
            Focuses on individual tendencies, non-memorized self-introductions, and evidence-backed interview readiness.
          </p>
        </div>

        {/* Filters and Search Bar */}
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
          {/* Category Tabs */}
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
                  background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-app)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search topics or subtopics..."
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

        {/* Topics List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredTopics.map(topic => {
            const isExpanded = expandedTopics[topic.id];
            return (
              <div
                key={topic.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s'
                }}
              >
                {/* Topic Header Card */}
                <div 
                  onClick={() => toggleExpand(topic.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                    <div style={{
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem'
                    }}>
                      {topic.number}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '12px',
                          background: 'rgba(37, 99, 235, 0.08)',
                          color: 'var(--accent-primary)',
                          fontWeight: 600
                        }}>
                          {topic.category}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          fontWeight: 600
                        }}>
                          CEFR {topic.cefrFocus}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          · {topic.targetYear}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>
                        {topic.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Subtopics */}
                {isExpanded && (
                  <div style={{
                    padding: '0 1.5rem 1.5rem 1.5rem',
                    borderTop: '1px solid var(--border-color)',
                    background: 'var(--bg-app)'
                  }}>
                    {/* Learning Outcome Banner */}
                    <div style={{
                      marginTop: '1.25rem',
                      marginBottom: '1.25rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'rgba(37, 99, 235, 0.05)',
                      borderLeft: '4px solid var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}>
                      <Target size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                        <strong>Learning Outcome: </strong>
                        <span style={{ color: 'var(--text-main)' }}>{topic.learningOutcome}</span>
                      </div>
                    </div>

                    {/* Subtopics Grid */}
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem 0' }}>
                      Sub-Topics & Teachable Components ({topic.subtopics.length})
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      {topic.subtopics.map(st => (
                        <div
                          key={st.id}
                          style={{
                            background: 'var(--bg-surface)',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              background: 'var(--bg-app)',
                              color: 'var(--accent-primary)'
                            }}>
                              {st.number}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {st.title}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {st.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px dashed var(--border-color)',
                      justifyContent: 'flex-end'
                    }}>
                      <Link
                        href={`/soft-skills/topics/list-of-activities?topic=${topic.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-main)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <Sparkles size={16} color="#6366f1" />
                        <span>View Activities</span>
                      </Link>

                      <Link
                        href={`/soft-skills/topics/${topic.slug}/photos-and-videos`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          background: 'rgba(37, 99, 235, 0.08)',
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                          color: 'var(--accent-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <Camera size={16} />
                        <span>Evidence (Photos & Videos)</span>
                      </Link>

                      <Link
                        href={`/soft-skills/sessions-tracker?topic=${topic.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          background: 'var(--accent-primary)',
                          border: '1px solid var(--accent-primary)',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          textDecoration: 'none'
                        }}
                      >
                        <ClipboardCheck size={16} />
                        <span>Log Session</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SoftSkillsNav>
  );
}
