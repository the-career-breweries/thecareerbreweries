'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import '@/app/globals.css';

interface FeedbackItem {
  id: string;
  course: string;
  session: string;
  comment: string;
  submittedAt: string;
}

export default function AdminFeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching feedback:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
            <span>Back</span>
          </Link>
          <h1 style={{ color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MessageSquare color="var(--accent-primary)" />
            Student Notes Feedback
          </h1>
        </div>
        
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>No feedback has been submitted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.map(fb => (
              <div key={fb.id} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-sidebar)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-sidebar)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                      <BookOpen size={16} />
                      {fb.course}
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{fb.session}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    {new Date(fb.submittedAt).toLocaleString()}
                  </div>
                </div>
                <div style={{ color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {fb.comment}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
