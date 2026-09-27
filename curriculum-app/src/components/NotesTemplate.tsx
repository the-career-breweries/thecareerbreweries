'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface NotesTemplateProps {
  courseName: string;
  sessionName: string;
  theme: string;
  focus: string;
  onClose: () => void;
  weekNumber?: number | string; // pass this from parent so we know exactly which session to fetch
}

export default function NotesTemplate({ courseName, sessionName, theme, focus, onClose, weekNumber }: NotesTemplateProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Extract a clean session ID number (e.g., "1" from week 1)
  const sessionIdentifier = typeof weekNumber !== 'undefined' ? weekNumber.toString() : '1';

  useEffect(() => {
    // We fetch the dynamic content from our generated JSON
    fetch(`/api/notes?course=${encodeURIComponent(courseName)}&session=${encodeURIComponent(sessionIdentifier)}`)
      .then(res => res.json())
      .then(json => {
        if (!json.error) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load notes data:', err);
        setLoading(false);
      });
  }, [courseName, sessionIdentifier]);

  const feedbackUrl = `https://thecareerbreweries.onrender.com/notes-feedback?course=${encodeURIComponent(courseName)}&session=${encodeURIComponent(sessionName)}`;

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${courseName}_${sessionName}_NotesbySD`.replace(/[^a-zA-Z0-9_]/g, '_');
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="notes-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '2rem'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 15mm; }
          
          /* Force all containers to expand fully and remove scrollbars/clipping */
          html, body, main, div {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
            display: block !important;
          }
          
          body * { visibility: hidden; }
          
          .notes-modal-overlay,
          .notes-modal-overlay *,
          .printable-notes-container, 
          .printable-notes-container * { 
            visibility: visible; 
          }
          
          .notes-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            width: 100% !important;
          }
          
          .printable-notes-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }

          .no-print, .no-print * { display: none !important; }
          
          section { page-break-inside: avoid; margin-bottom: 2rem; }
          h1, h2, h3 { page-break-after: avoid; }
          .definition-box { page-break-inside: avoid; }
          
          .print-watermark {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: fixed !important;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            color: rgba(0, 0, 0, 0.15) !important;
            z-index: 1000;
              pointer-events: none;
              text-align: center;
              width: 100%;
            pointer-events: none;
            text-align: center;
            width: 100%;
            visibility: visible !important;
          }
          
          .print-watermark * {
            visibility: visible !important;
          }
        }
        
        @media screen {
          .print-watermark { display: none; }
        }
      `}} />
      
      <div style={{
        background: '#ffffff',
        width: '100%', maxWidth: '900px', height: '100%', maxHeight: '90vh',
        borderRadius: '12px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
      }}>
        {/* Header - No Print */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc'
        }}>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Notes: {sessionName}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handlePrint} disabled={loading} style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
              background: loading ? '#94a3b8' : '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              <Printer size={16} /> Print / PDF
            </button>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
            }}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Notes Content */}
        <div className="printable-notes-container" style={{
          flex: 1, overflowY: 'auto', padding: '3rem', color: '#1e293b', background: 'white'
        }}>
          {/* Watermark for Print */}
          <div className="print-watermark">
              <p style={{ fontWeight: 'bold', fontSize: '48px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>S D Sandarsh</p>
              <p style={{ fontSize: '24px', margin: '15px 0', fontWeight: '500', lineHeight: '1.4' }}>
                Communicative English Trainer,<br />
                Soft Skills Trainer,<br />
                & Employability Coach
              </p>
              <p style={{ fontSize: '24px', margin: 0, fontWeight: '500' }}>+91 97437 11584</p>
            </div>

          {/* Header */}
          <div style={{ borderBottom: '2px solid #4f46e5', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '2.2rem' }}>{theme}</h1>
            <div style={{ color: '#64748b', fontSize: '1.2rem' }}>
                <div style={{ marginBottom: '0.25rem' }}><strong>Course:</strong> {courseName}</div>
                <div><strong>Session:</strong> {sessionName}</div>
              </div>
          </div>

          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', color: '#64748b' }}>
               <Loader2 className="lucide-spin" size={48} style={{ animation: 'spin 2s linear infinite', marginBottom: '1rem' }} />
               <p>Generating AI Content...</p>
               <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
             </div>
          ) : (
            <>
              {/* 1. Key Concepts */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#4f46e5', fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>1. Key Concepts Covered</h2>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  {data?.keyConcepts?.map((concept: any, i: number) => (
                    <li key={i}><strong>{concept.title}</strong>: {concept.explanation}</li>
                  )) || (
                    <>
                      <li><strong>{focus.split(',')[0] || focus}</strong>: [Detailed explanation to be inserted here]</li>
                      {focus.split(',').slice(1).map((concept, i) => (
                        <li key={i}><strong>{concept.trim()}</strong>: [Detailed explanation to be inserted here]</li>
                      ))}
                    </>
                  )}
                </ul>
              </section>

              {/* 2. Definitions */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#4f46e5', fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>2. Definitions</h2>
                <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                  {data?.definitions?.map((defn: any, i: number) => (
                    <div key={i} className="definition-box" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}>
                      <strong>{defn.term}:</strong> {defn.definition}
                    </div>
                  )) || (
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}>
                      <strong>[Term 1]:</strong> A clear, concise definition of the term as prescribed in the syllabus.
                    </div>
                  )}
                </div>
              </section>

              {/* 3. Mnemonics */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#4f46e5', fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>3. Mnemonics to Remember</h2>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', color: '#991b1b' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}><strong>Mnemonic:</strong> {data?.mnemonic?.acronym || '[ACRONYM]'}</p>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                    {data?.mnemonic?.points?.map((pt: string, i: number) => (
                      <li key={i}><strong>{pt[0]}</strong>{pt.slice(1)}</li>
                    )) || (
                      <>
                        <li><strong>A</strong> - [Concept A]</li>
                        <li><strong>C</strong> - [Concept C]</li>
                      </>
                    )}
                  </ul>
                </div>
              </section>

              {/* 4. Format of Questions (BTL) */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#4f46e5', fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>4. Expected Exam Questions (Bloom's Taxonomy)</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left', width: '25%' }}>BTL Level</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'left' }}>Sample Question Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Remember (BTL 1)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Remember || "Define / List / State [Concept]."}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Understand (BTL 2)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Understand || "Explain the difference between [A] and [B]."}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Apply (BTL 3)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Apply || "Demonstrate how to use [Concept] in a given scenario."}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Analyze (BTL 4)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Analyze || "Examine the causes and effects of [Scenario]."}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Evaluate (BTL 5)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Evaluate || "Assess the effectiveness of [Method]."}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}><strong>Create (BTL 6)</strong></td>
                      <td style={{ padding: '0.75rem', border: '1px solid #cbd5e1' }}>{data?.btlQuestions?.Create || "Formulate a plan to [solve a problem using concept]."}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {/* 5. Reference Material */}
              <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: '#4f46e5', fontSize: '1.4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>5. Prescribed Reference Material</h2>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                  <li><strong>Primary Textbook:</strong> {data?.referenceMaterial?.primary || "[Title, Author, Chapter X]"}</li>
                  <li><strong>Further Reading:</strong> {data?.referenceMaterial?.further || "[Article / Resource Link]"}</li>
                </ul>
              </section>
            </>
          )}

          {/* 6. Feedback QR Code */}
          <section style={{ 
            marginTop: '3rem', padding: '2rem', background: '#f8fafc', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '2rem',
            border: '1px dashed #cbd5e1'
          }}>
            <div style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <QRCodeSVG value={feedbackUrl} size={120} level="H" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>We Value Your Feedback!</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', lineHeight: '1.5' }}>
                Scan this QR code to tell us what more could be added in upcoming notes. 
                Do you need more examples, clearer definitions, or better mnemonics? Let us know!
              </p>
              <a href={feedbackUrl} className="no-print" target="_blank" rel="noreferrer" style={{
                color: '#4f46e5', textDecoration: 'none', fontWeight: 'bold'
              }}>Click here to open form</a>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
