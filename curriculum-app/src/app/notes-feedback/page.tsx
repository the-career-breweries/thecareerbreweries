'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Send, MessageSquarePlus } from 'lucide-react';
import '@/app/globals.css';

function FeedbackForm() {
  const searchParams = useSearchParams();
  const sessionName = searchParams.get('session') || 'General Session';
  const courseName = searchParams.get('course') || 'Course';
  
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: courseName,
          session: sessionName,
          comment: feedback
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit feedback');
      
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem', textAlign: 'center' }}>
        <CheckCircle size={64} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '2rem' }}>Thank You!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px' }}>
          Your feedback has been submitted successfully. We appreciate your input on how to improve our notes!
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <MessageSquarePlus size={32} color="var(--accent-primary)" />
          <h1 style={{ color: 'var(--text-main)', fontSize: '1.8rem', margin: 0 }}>Notes Feedback</h1>
        </div>
        
        <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You are providing feedback for:</p>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.1rem' }}>{courseName} - {sessionName}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
            What more could be added in upcoming notes?
          </label>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what concepts need better explanation, if you need more examples, mnemonics, or anything else!"
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-sidebar)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            required
          />
          
          {error && <p style={{ color: '#ef4444', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={isSubmitting || !feedback.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isSubmitting || !feedback.trim() ? 'not-allowed' : 'pointer',
              opacity: isSubmitting || !feedback.trim() ? 0.7 : 1,
              marginTop: '1rem'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            {!isSubmitting && <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NotesFeedbackPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--text-main)' }}>Loading...</div>}>
      <FeedbackForm />
    </Suspense>
  );
}
