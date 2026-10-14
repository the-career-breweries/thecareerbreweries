'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Loader2, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface NotesTemplateProps {
  courseName: string;
  sessionName: string;
  theme: string;
  focus: string;
  onClose: () => void;
  weekNumber?: number | string;
}

export default function NotesTemplate({ courseName, sessionName, theme, focus, onClose, weekNumber }: NotesTemplateProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionIdentifier = typeof weekNumber !== 'undefined' ? weekNumber.toString() : '1';
  const isUnitConsolidated = sessionIdentifier.toLowerCase().startsWith('unit');

  useEffect(() => {
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

  const renderFormattedText = (text: any) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ fontStyle: 'italic', color: '#0369a1', fontWeight: 600 }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${courseName}_${sessionName}_RevisionNotes`.replace(/[^a-zA-Z0-9_]/g, '_');
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="notes-modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
      zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '1.5rem'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            background: #ffffff !important;
            color: #1e293b !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 10pt !important;
            line-height: 1.5 !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          #__next, .lms-container {
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          body * { visibility: hidden !important; }
          .no-print, .no-print * { display: none !important; }

          .lms-topbar, .lms-layout, .welcome-container, .slide-modal-overlay {
            display: none !important;
          }

          .notes-modal-overlay,
          .notes-modal-overlay *,
          .notes-modal-card,
          .notes-modal-card *,
          .printable-notes-container, 
          .printable-notes-container * { 
            visibility: visible !important; 
          }

          .notes-modal-overlay {
            position: static !important;
            background: none !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
            box-shadow: none !important;
          }

          .notes-modal-card {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            display: block !important;
          }

          .printable-notes-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
            flex: none !important;
          }

          .printable-notes-container div {
            overflow: visible !important;
          }

          h1, h2, h3, h4 { page-break-after: avoid; break-after: avoid; }
          table { page-break-inside: auto; break-inside: auto; }
          tr, td, th { page-break-inside: avoid; break-inside: avoid; }
          .callout-box, .rule-box, .worked-example-box, .memory-box, .exam-tip-box, .topic-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .part-banner {
            page-break-after: avoid;
            break-after: avoid;
          }
        }
        
        .notes-table th {
          background-color: #0f2942 !important;
          color: #ffffff !important;
          font-weight: 600;
          padding: 8px 12px;
          text-align: left;
          font-size: 0.85rem;
          letter-spacing: 0.02em;
        }
        .notes-table td {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .notes-table tr:nth-child(even) td {
          background-color: #f8fafc;
        }
      `}} />

      <div className="notes-modal-card" style={{
        background: '#ffffff',
        width: '100%', maxWidth: '980px', height: '100%', maxHeight: '92vh',
        borderRadius: '12px', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        border: '1px solid #cbd5e1'
      }}>
        {/* Top Control Bar - Screen Only */}
        <div className="no-print" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.85rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#0f2942', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700,
              padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {isUnitConsolidated ? 'Unit Revision Notes' : 'Session Notes'}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
              {courseName} · {sessionName}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={handlePrint} 
              disabled={loading} 
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                background: loading ? '#94a3b8' : '#0f2942', color: 'white', border: 'none',
                borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600,
                fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(15,41,66,0.2)'
              }}
            >
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button 
              onClick={onClose} 
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b',
                display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Notes Content Area */}
        <div className="printable-notes-container" style={{
          flex: 1, overflowY: 'auto', padding: '2.5rem 3rem', color: '#1e293b', background: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', color: '#64748b' }}>
              <Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem', color: '#0f2942' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Loading Revision Notes...</p>
              <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
            </div>
          ) : (
            <>
              {/* Institutional Header */}
              <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <p style={{
                  margin: '0 0 0.35rem 0', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.12em'
                }}>
                  Alliance School of Aviation Studies · BBA Aviation Management · Semester I
                </p>
                <h1 style={{
                  margin: '0 0 0.35rem 0', color: '#0f2942', fontSize: '2.1rem', fontWeight: 800,
                  lineHeight: '1.2'
                }}>
                  {courseName.toLowerCase().includes('computing') ? 'Introduction to Computing Skills' : courseName}
                </h1>
                <h2 style={{
                  margin: '0 0 0.35rem 0', color: '#0284c7', fontSize: '1.25rem', fontWeight: 700
                }}>
                  {theme}
                </h2>
                {data?.subtitle && (
                  <p style={{
                    margin: '0 0 0.65rem 0', color: '#475569', fontSize: '0.92rem', fontWeight: 500, fontStyle: 'italic'
                  }}>
                    {data.subtitle}
                  </p>
                )}
                <div style={{
                  color: '#64748b', fontSize: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap'
                }}>
                  <span><strong>Course Code:</strong> {
                    data?.courseCode && !['ENG 101', 'CS 101'].includes(data.courseCode)
                      ? data.courseCode
                      : (courseName.toLowerCase().includes('computing')
                          ? 'Z7AVA 26209'
                          : (courseName.toLowerCase().includes('soft skill')
                              ? 'Z7AVA 26210'
                              : 'Z7AVB 26203'))
                  }</span>
                  <span>|</span>
                  <span>Theory</span>
                  <span>|</span>
                  <span>Simple explanations · Worked examples · Memory tricks · Exam tips</span>
                </div>
              </div>

              {/* HOW TO USE THESE NOTES Callout Box */}
              <div className="callout-box" style={{
                background: '#f0f7ff', border: '1px solid #bfdbfe', borderLeft: '4px solid #2563eb',
                padding: '0.9rem 1.25rem', borderRadius: '4px', marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  margin: '0 0 0.4rem 0', color: '#1e3a8a', fontSize: '0.8rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>
                  How To Use These Notes
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#1e3a8b', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  {data?.howToUse ? (
                    data.howToUse.map((pt: string, idx: number) => <li key={idx}>{pt}</li>)
                  ) : (
                    <>
                      <li><strong>Three steps for every concept:</strong> (1) Understand what it means in plain English, (2) Connect it with a familiar everyday example, (3) See how it naturally applies in an airport or airline.</li>
                      <li><strong>Exam writing strategy:</strong> Anchor your definition in clear everyday intuition first, then provide the airline operational context to score maximum marks.</li>
                      <li><strong>Balanced examples:</strong> We use relatable daily scenarios alongside real Indian aviation contexts (Air India, IndiGo, Akasa) to keep things simple and practical.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Interactive Simulator Banner for Session 14 / Unit 3 - Screen Only */}
              {(String(weekNumber) === '14' || String(weekNumber) === 'unit-3' || theme.toLowerCase().includes('referencing')) && (
                <div className="no-print" style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: '8px',
                  padding: '1.1rem 1.35rem',
                  marginBottom: '1.75rem',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: '#eab308',
                      color: '#0f172a',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', color: '#f8fafc', fontSize: '0.92rem', fontWeight: 700 }}>
                        Interactive Absolute Referencing ($) Simulator Available!
                      </h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                        Test dragging formulas with and without the dollar lock across passenger ticket calculations.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/simulators/absolute-referencing"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#eab308',
                      color: '#0f172a',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(234, 179, 8, 0.25)'
                    }}
                  >
                    Launch Interactive Simulator ↗
                  </a>
                </div>
              )}

              {/* 2–4 Hour Spreadsheet Core Workshop Simulator Banner (Session 16 & Unit 3) */}
              {(String(weekNumber) === '16' || String(weekNumber) === 'unit-3' || theme.toLowerCase().includes('logical') || theme.toLowerCase().includes('spreadsheet')) && (
                <div className="no-print" style={{
                  background: 'linear-gradient(135deg, #091322 0%, #0c2137 100%)',
                  borderRadius: '8px',
                  padding: '1.1rem 1.35rem',
                  marginBottom: '1.75rem',
                  border: '1px solid #0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.18)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px 0', color: '#f8fafc', fontSize: '0.92rem', fontWeight: 700 }}>
                        🚀 Post-Session 6 Fast-Track Workshop Simulator (Sessions 1–6)
                      </h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                        Consolidated 2–4 hour hands-on lab: Basic Math (PEMDAS), $ Referencing, Statistical, &amp; Logical/Text functions.
                      </p>
                    </div>
                  </div>
                  <a
                    href="/simulators/excel-core-workshop"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    Open 2–4 Hr Workshop Simulator ↗
                  </a>
                </div>
              )}

              {/* Navigation Grid (Parts TOC) if available */}
              {data?.parts && (
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem', marginBottom: '2rem'
                }}>
                  {data.parts.map((part: any, pIdx: number) => (
                    <div key={pIdx} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#0f2942', color: '#ffffff', padding: '6px 10px',
                        fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {part.title}
                      </div>
                      <div style={{ padding: '8px 12px', background: '#ffffff', fontSize: '0.82rem', lineHeight: '1.6', color: '#334155' }}>
                        {part.items?.map((item: string, iIdx: number) => (
                          <div key={iIdx} style={{ marginBottom: '4px' }}>{item}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Topics / Content Sections */}
              {data?.topics ? (
                // Rich Multi-Topic Format
                data.topics.map((topic: any, tIdx: number) => (
                  <div key={tIdx} className="topic-block" style={{ marginBottom: '2.5rem' }}>
                    {topic.partBanner && (
                      <div className="part-banner" style={{
                        background: '#0f2942', color: '#ffffff', padding: '7px 14px', borderRadius: '3px',
                        fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                        margin: '2rem 0 1.25rem 0'
                      }}>
                        {topic.partBanner}
                      </div>
                    )}
                    
                    <h3 style={{
                      color: '#0f2942', fontSize: '1.15rem', fontWeight: 700,
                      margin: '0 0 0.4rem 0', paddingBottom: '4px', borderBottom: '1px solid #e2e8f0'
                    }}>
                      {topic.title}
                    </h3>
                    
                    {topic.premise && (
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
                        {topic.premise}
                      </p>
                    )}

                    {/* Topic Table */}
                    {topic.table && (
                      <div style={{ margin: '1rem 0', overflowX: 'auto' }}>
                        <table className="notes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              {topic.table.headers?.map((h: string, hIdx: number) => (
                                <th key={hIdx}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {topic.table.rows?.map((r: any[], rIdx: number) => (
                              <tr key={rIdx}>
                                {r.map((cell: any, cIdx: number) => (
                                  <td key={cIdx}>{renderFormattedText(cell)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Green Rule Callout Box */}
                    {topic.rule && (
                      <div className="rule-box" style={{
                        background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a',
                        padding: '10px 14px', borderRadius: '4px', margin: '1rem 0'
                      }}>
                        <h4 style={{
                          margin: '0 0 0.35rem 0', color: '#15803d', fontSize: '0.78rem', fontWeight: 800,
                          textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>
                          {topic.rule.title}
                        </h4>
                        <p style={{ margin: 0, color: '#166534', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          {topic.rule.text}
                        </p>
                      </div>
                    )}

                    {/* Blue Worked Example Box */}
                    {topic.workedExample && (
                      <div className="worked-example-box" style={{
                        background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7',
                        padding: '10px 14px', borderRadius: '4px', margin: '1rem 0'
                      }}>
                        <h4 style={{
                          margin: '0 0 0.35rem 0', color: '#0369a1', fontSize: '0.78rem', fontWeight: 800,
                          textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>
                          {topic.workedExample.title || 'Worked Example'}
                        </h4>
                        <div style={{ color: '#0c4a6e', fontSize: '0.85rem', lineHeight: '1.55' }}>
                          {topic.workedExample.text && <p style={{ margin: '0 0 0.5rem 0' }}>{topic.workedExample.text}</p>}
                          {topic.workedExample.everydayContext && (
                            <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e0f2fe', marginBottom: '6px' }}>
                              <strong style={{ color: '#0369a1' }}>Everyday Example:</strong> {topic.workedExample.everydayContext}
                            </div>
                          )}
                          {topic.workedExample.aviationContext && (
                            <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e0f2fe', marginBottom: '6px' }}>
                              <strong style={{ color: '#0369a1' }}>Aviation Application:</strong> {topic.workedExample.aviationContext}
                            </div>
                          )}
                          {topic.workedExample.steps?.map((step: string, sIdx: number) => (
                            <div key={sIdx} style={{ marginBottom: '2px' }}>{step}</div>
                          ))}
                          {topic.workedExample.verdict && (
                            <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#0369a1' }}>
                              Key Takeaway: {topic.workedExample.verdict}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Purple Memory Trick */}
                    {topic.memoryTrick && (
                      <div className="memory-box" style={{
                        background: '#faf5ff', border: '1px solid #e9d5ff', borderLeft: '4px solid #9333ea',
                        padding: '9px 14px', borderRadius: '4px', margin: '1rem 0'
                      }}>
                        <h4 style={{
                          margin: '0 0 0.25rem 0', color: '#7e22ce', fontSize: '0.78rem', fontWeight: 800,
                          textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>
                          Memory Trick
                        </h4>
                        <p style={{ margin: 0, color: '#581c87', fontSize: '0.85rem', fontWeight: 500, lineHeight: '1.5' }}>
                          {topic.memoryTrick}
                        </p>
                      </div>
                    )}

                    {/* Amber Exam Tip / Trap */}
                    {topic.examTip && (
                      <div className="exam-tip-box" style={{
                        background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b',
                        padding: '9px 14px', borderRadius: '4px', margin: '1rem 0'
                      }}>
                        <h4 style={{
                          margin: '0 0 0.25rem 0', color: '#b45309', fontSize: '0.78rem', fontWeight: 800,
                          textTransform: 'uppercase', letterSpacing: '0.06em'
                        }}>
                          {topic.isTrap ? 'Common Exam Trap' : 'Exam Tip'}
                        </h4>
                        <p style={{ margin: 0, color: '#78350f', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          {topic.examTip}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Fallback Classic Format Enhanced with Claude Design
                <>
                  {/* Key Concepts */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div className="part-banner" style={{
                      background: '#0f2942', color: '#ffffff', padding: '7px 14px', borderRadius: '3px',
                      fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                      marginBottom: '1rem'
                    }}>
                      Part A · Core Concepts & Principles
                    </div>
                    {data?.keyConcepts?.map((concept: any, i: number) => (
                      <div key={i} style={{ marginBottom: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f2942', fontSize: '0.95rem', fontWeight: 700 }}>
                          {i + 1}. {concept.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                          {concept.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Definitions Table */}
                  {data?.definitions && data.definitions.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <div className="part-banner" style={{
                        background: '#0f2942', color: '#ffffff', padding: '7px 14px', borderRadius: '3px',
                        fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                        marginBottom: '1rem'
                      }}>
                        Part B · High-Yield Concepts & Dual Examples
                      </div>
                      <table className="notes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ width: '22%' }}>Term / Concept</th>
                            <th style={{ width: '34%' }}>Plain English Meaning</th>
                            <th style={{ width: '22%' }}>Everyday Example</th>
                            <th style={{ width: '22%' }}>Aviation Example</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.definitions.map((defn: any, i: number) => (
                            <tr key={i}>
                              <td><strong>{renderFormattedText(defn.term)}</strong></td>
                              <td>{renderFormattedText(defn.definition)}</td>
                              <td>{renderFormattedText(defn.everydayExample || '—')}</td>
                              <td>{renderFormattedText(defn.aviationExample || defn.example || '—')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Worked Example in Fallback Format */}
                  {data?.workedExample && (
                    <div className="worked-example-box" style={{
                      background: '#f0f9ff', border: '1px solid #bae6fd', borderLeft: '4px solid #0284c7',
                      padding: '10px 14px', borderRadius: '4px', margin: '1.5rem 0'
                    }}>
                      <h4 style={{
                        margin: '0 0 0.35rem 0', color: '#0369a1', fontSize: '0.78rem', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.06em'
                      }}>
                        {data.workedExample.title || 'Worked Example'}
                      </h4>
                      <div style={{ color: '#0c4a6e', fontSize: '0.85rem', lineHeight: '1.55' }}>
                        {data.workedExample.text && <p style={{ margin: '0 0 0.5rem 0' }}>{data.workedExample.text}</p>}
                        {data.workedExample.everydayContext && (
                          <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e0f2fe', marginBottom: '6px' }}>
                            <strong style={{ color: '#0369a1' }}>Everyday Example:</strong> {data.workedExample.everydayContext}
                          </div>
                        )}
                        {data.workedExample.aviationContext && (
                          <div style={{ background: '#ffffff', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e0f2fe', marginBottom: '6px' }}>
                            <strong style={{ color: '#0369a1' }}>Aviation Application:</strong> {data.workedExample.aviationContext}
                          </div>
                        )}
                        {data.workedExample.steps?.map((step: string, sIdx: number) => (
                          <div key={sIdx} style={{ marginBottom: '2px' }}>{step}</div>
                        ))}
                        {data.workedExample.verdict && (
                          <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#0369a1' }}>
                            Key Takeaway: {data.workedExample.verdict}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Memory Trick Box */}
                  {data?.mnemonic && (
                    <div className="memory-box" style={{
                      background: '#faf5ff', border: '1px solid #e9d5ff', borderLeft: '4px solid #9333ea',
                      padding: '10px 14px', borderRadius: '4px', marginBottom: '2rem'
                    }}>
                      <h4 style={{
                        margin: '0 0 0.25rem 0', color: '#7e22ce', fontSize: '0.78rem', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.06em'
                      }}>
                        Memory Trick
                      </h4>
                      <p style={{ margin: 0, color: '#581c87', fontSize: '0.88rem', fontWeight: 500, lineHeight: '1.5' }}>
                        {typeof data.mnemonic === 'string' ? data.mnemonic : `${data.mnemonic.acronym} — ${data.mnemonic.points?.join(', ')}`}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* EXAM SMART Section */}
              <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                <div className="part-banner" style={{
                  background: '#0f2942', color: '#ffffff', padding: '7px 14px', borderRadius: '3px',
                  fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}>
                  Exam Smart · How to Write Top-Scoring Answers
                </div>

                <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                  Match your answer to the marks:
                </p>
                <table className="notes-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>Marks</th>
                      <th style={{ width: '60%' }}>What to write</th>
                      <th style={{ width: '20%' }}>Expected Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>1 mark</strong></td>
                      <td>The exact term, rule, or option. Look for tricky keywords like "always", "never", "without conditions".</td>
                      <td>One line</td>
                    </tr>
                    <tr>
                      <td><strong>3 marks</strong></td>
                      <td>Three clear points, or a formal definition plus two realistic airline operational examples.</td>
                      <td>4–6 lines</td>
                    </tr>
                    <tr>
                      <td><strong>5 marks</strong></td>
                      <td>Definition → 4–5 key points or comparison table → one complete airline example.</td>
                      <td>Half to 1 page</td>
                    </tr>
                    <tr>
                      <td><strong>10–15 marks</strong></td>
                      <td>Short introduction → headings for each sub-question → scenario facts and figures → diagram or table → one-line conclusion.</td>
                      <td>About 2 pages</td>
                    </tr>
                  </tbody>
                </table>

                {/* Bloom's Taxonomy Question Bank if present */}
                {data?.btlQuestions && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                      Sample Exam Questions by Bloom's Level:
                    </p>
                    <table className="notes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ width: '25%' }}>BTL Level</th>
                          <th>Sample Question Format</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(data.btlQuestions).map(([level, q]: [string, any], idx: number) => (
                          <tr key={idx}>
                            <td><strong>{level}</strong></td>
                            <td>{q}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* QUICK REVISION Section */}
              {data?.quickRevision && (
                <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                  <div className="part-banner" style={{
                    background: '#0f2942', color: '#ffffff', padding: '7px 14px', borderRadius: '3px',
                    fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                    marginBottom: '1rem'
                  }}>
                    Quick Revision · Everything on One Page
                  </div>
                  <table className="notes-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>Topic / Rule</th>
                        <th>Remember This</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.quickRevision.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td><strong>{renderFormattedText(item.topic)}</strong></td>
                          <td>{renderFormattedText(item.rememberThis)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{
                    textAlign: 'center', fontWeight: 600, color: '#0f2942', fontSize: '0.9rem',
                    margin: '1.5rem 0 0 0'
                  }}>
                    Show your working, name the rule, use the case's own facts. All the best!
                  </p>
                </div>
              )}

              {/* Prescribed Reference Material */}
              {data?.referenceMaterial && (
                <div style={{
                  padding: '1rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: '6px', marginTop: '2rem', fontSize: '0.85rem', color: '#475569'
                }}>
                  <div style={{ fontWeight: 700, color: '#0f2942', marginBottom: '0.25rem' }}>Prescribed Reference Material:</div>
                  <div><strong>Primary:</strong> {data.referenceMaterial.primary || 'Provided in course syllabus.'}</div>
                  {data.referenceMaterial.further && (
                    <div style={{ marginTop: '2px' }}><strong>Further Reading:</strong> {data.referenceMaterial.further}</div>
                  )}
                </div>
              )}

              {/* Feedback Section - Screen Only */}
              <div className="no-print" style={{
                marginTop: '3rem', padding: '1.5rem', background: '#f8fafc',
                borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1.5rem',
                border: '1px dashed #cbd5e1'
              }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <QRCodeSVG value={feedbackUrl} size={90} level="H" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f2942', fontSize: '0.95rem', fontWeight: 700 }}>We Value Your Feedback!</h4>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Scan this QR code to tell us what more could be added in upcoming revision notes.
                  </p>
                  <a href={feedbackUrl} target="_blank" rel="noreferrer" style={{
                    color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem'
                  }}>
                    Click here to open feedback form →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
