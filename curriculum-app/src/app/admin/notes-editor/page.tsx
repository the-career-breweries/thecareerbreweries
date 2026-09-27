'use client';

import React, { useState, useEffect } from 'react';
import { Save, ChevronLeft, Loader2, Edit3, BookOpen } from 'lucide-react';
import Link from 'next/link';
import '@/app/globals.css';

export default function NotesEditorDashboard() {
  const [course, setCourse] = useState('Communicative English');
  const [session, setSession] = useState('1');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState({
    keyConcepts: [
      { title: '', explanation: '' }
    ],
    definitions: [
      { term: '', definition: '' }
    ],
    mnemonic: {
      acronym: '',
      points: ['']
    },
    btlQuestions: {
      Remember: '',
      Understand: '',
      Apply: '',
      Analyze: '',
      Evaluate: '',
      Create: ''
    },
    referenceMaterial: {
      primary: '',
      further: ''
    }
  });

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?course=${encodeURIComponent(course)}&session=${encodeURIComponent(session)}`);
      const json = await res.json();
      if (!json.error) {
        setData(json);
      } else {
        // Reset if not found
        setData({
          keyConcepts: [{ title: '', explanation: '' }],
          definitions: [{ term: '', definition: '' }],
          mnemonic: { acronym: '', points: [''] },
          btlQuestions: { Remember: '', Understand: '', Apply: '', Analyze: '', Evaluate: '', Create: '' },
          referenceMaterial: { primary: '', further: '' }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [course, session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course,
          session,
          content: data
        })
      });
      if (res.ok) {
        alert('Notes saved successfully!');
      } else {
        alert('Failed to save notes.');
      }
    } catch (err) {
      alert('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string[], value: any) => {
    setData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={24} />
              <span>Back</span>
            </Link>
            <h1 style={{ color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Edit3 color="var(--accent-primary)" />
              Notes Editor CMS
            </h1>
          </div>
          
          <button onClick={handleSave} disabled={saving || loading} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '1rem', fontWeight: 'bold', cursor: saving || loading ? 'not-allowed' : 'pointer',
            opacity: saving || loading ? 0.7 : 1
          }}>
            {saving ? <Loader2 className="lucide-spin" size={18} /> : <Save size={18} />}
            Save Notes
          </button>
        </div>

        {/* Selectors */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Course</label>
            <select 
              value={course} 
              onChange={e => setCourse(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            >
              <option value="Communicative English">Communicative English</option>
              <option value="Computing Skills">Computing Skills</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Session Number</label>
            <select 
              value={session} 
              onChange={e => setSession(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            >
              {Array.from({length: 16}, (_, i) => i + 1).map(num => (
                <option key={num} value={num.toString()}>Session {num}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Loader2 className="lucide-spin" size={48} style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
            Loading content...
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* 1. Definitions */}
            <section style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
              <h2 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={20} /> 1. Definitions</h2>
              {data.definitions.map((defn: any, index: number) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Term" 
                    value={defn.term} 
                    onChange={e => {
                      const newDefs = [...data.definitions];
                      newDefs[index].term = e.target.value;
                      updateField(['definitions'], newDefs);
                    }}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Definition" 
                    value={defn.definition} 
                    onChange={e => {
                      const newDefs = [...data.definitions];
                      newDefs[index].definition = e.target.value;
                      updateField(['definitions'], newDefs);
                    }}
                    style={{ flex: 3, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  />
                </div>
              ))}
              <button 
                onClick={() => updateField(['definitions'], [...data.definitions, { term: '', definition: '' }])}
                style={{ padding: '8px 16px', background: 'transparent', color: 'var(--accent-primary)', border: '1px dashed var(--accent-primary)', borderRadius: '8px', cursor: 'pointer' }}
              >
                + Add Definition
              </button>
            </section>

            {/* 2. Mnemonics */}
            <section style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
              <h2 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '1rem' }}>2. Mnemonic</h2>
              <input 
                type="text" 
                placeholder="Acronym (e.g. SEND)" 
                value={data.mnemonic?.acronym || ''} 
                onChange={e => updateField(['mnemonic', 'acronym'], e.target.value)}
                style={{ width: '100%', marginBottom: '1rem', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              />
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Mnemonic Points (One per line)</p>
              <textarea 
                rows={5}
                value={data.mnemonic?.points?.join('\n') || ''} 
                onChange={e => updateField(['mnemonic', 'points'], e.target.value.split('\n'))}
                placeholder="S - Sender&#10;E - Encode"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              />
            </section>

            {/* 3. Bloom's Taxonomy Questions */}
            <section style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
              <h2 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '1rem' }}>3. Bloom's Taxonomy Questions</h2>
              {['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'].map((level) => (
                <div key={level} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>{level} (BTL)</label>
                  <input 
                    type="text" 
                    value={(data.btlQuestions as any)?.[level] || ''} 
                    onChange={e => updateField(['btlQuestions', level], e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                  />
                </div>
              ))}
            </section>

            {/* 4. Reference Material */}
            <section style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
              <h2 style={{ color: 'var(--text-main)', marginTop: 0, marginBottom: '1rem' }}>4. Reference Material</h2>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Primary Textbook / Chapter</label>
                <input 
                  type="text" 
                  value={data.referenceMaterial?.primary || ''} 
                  onChange={e => updateField(['referenceMaterial', 'primary'], e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--text-main)' }}>Further Reading</label>
                <input 
                  type="text" 
                  value={data.referenceMaterial?.further || ''} 
                  onChange={e => updateField(['referenceMaterial', 'further'], e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-sidebar)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
