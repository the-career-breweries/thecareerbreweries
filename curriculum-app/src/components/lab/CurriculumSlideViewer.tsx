'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CurriculumSlide,
  getAllCurriculumSlides,
  getSlidesForAssignment
} from '@/lib/curriculum-slides-data';
import { AssignmentTemplate } from '@/lib/assignment-generator';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  Target
} from 'lucide-react';

interface CurriculumSlideViewerProps {
  mode: 'embedded' | 'master' | 'unit';
  theme: 'light' | 'dark';
  assignment?: AssignmentTemplate;
  unitNumber?: number;
  onSwitchTab?: (tab: 'assignment' | 'notes') => void;
}

export default function CurriculumSlideViewer({
  mode,
  theme,
  assignment,
  unitNumber = 3,
  onSwitchTab
}: CurriculumSlideViewerProps) {
  const isDark = theme === 'dark';

  // Palette matching computing-lab page
  const t = {
    bg: isDark ? '#090d16' : '#f8fafc',
    cardBg: isDark ? '#0f172a' : '#ffffff',
    cardBgAlt: isDark ? '#141e33' : '#f1f5f9',
    cardHeaderBg: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    borderHighlight: isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.5)',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSecondary: isDark ? '#cbd5e1' : '#334155',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    inputBg: isDark ? '#090d16' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
    codeBg: isDark ? '#080d1a' : '#f1f5f9',
    shadow: isDark
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
      : '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
    accentEmerald: '#10b981',
    accentEmeraldBg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
    accentEmeraldText: isDark ? '#34d399' : '#059669',
    accentBlue: '#38bdf8',
    accentBlueBg: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(2, 132, 199, 0.08)',
    accentBlueText: isDark ? '#38bdf8' : '#0284c7',
    accentAmber: '#fbbf24',
    accentAmberBg: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(217, 119, 6, 0.08)',
    accentAmberText: isDark ? '#fbbf24' : '#b45309',
    accentRose: '#fb7185',
    accentRoseBg: isDark ? 'rgba(244, 63, 94, 0.1)' : 'rgba(225, 29, 72, 0.08)',
    accentRoseText: isDark ? '#fb7185' : '#be123c',
  };

  // State for master mode
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>(mode === 'master' ? 'all' : 3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTheater, setIsTheater] = useState<boolean>(false);

  // State for embedded / unit mode
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (mode === 'unit' && unitNumber !== 3) {
      return true;
    }
    return false;
  });

  // Active slide index
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);

  // Derive relevant slides
  const slides: CurriculumSlide[] = useMemo(() => {
    if (mode === 'embedded') {
      return getSlidesForAssignment(assignment);
    }
    if (mode === 'unit') {
      const targetUnit = unitNumber || 3;
      return getAllCurriculumSlides().filter((s) => s.unit === targetUnit);
    }
    // Master mode: filter by unit and search
    let all = getAllCurriculumSlides();
    if (selectedUnit !== 'all') {
      all = all.filter((s) => s.unit === selectedUnit);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      all = all.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.objective.toLowerCase().includes(q) ||
          s.conceptSummary.toLowerCase().includes(q) ||
          s.formulaSyntax?.formula.toLowerCase().includes(q) ||
          s.badge.toLowerCase().includes(q)
      );
    }
    return all;
  }, [mode, assignment, selectedUnit, searchQuery]);

  // Keep index within bounds when slides change
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting when typing in search input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const activeSlide: CurriculumSlide | undefined = slides[currentSlideIndex];

  const handleCopyFormula = (formulaStr: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formulaStr);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  if (!activeSlide) {
    return (
      <div
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: '14px',
          padding: '30px',
          textAlign: 'center',
          color: t.textMuted
        }}
      >
        <BookOpen size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
        <h4 style={{ margin: '0 0 6px', color: t.text }}>No Slides Found Matching Query</h4>
        <p style={{ margin: 0, fontSize: '0.86rem' }}>
          Try clearing your search query or choosing another curriculum unit.
        </p>
      </div>
    );
  }

  // =========================================================================
  // EMBEDDED & UNIT MODE (For Active Assignment Scaffolding & Unit-Wise Revision)
  // =========================================================================
  if (mode === 'embedded' || mode === 'unit') {
    const isUnitMode = mode === 'unit';
    return (
      <div
        id={isUnitMode ? `unit-${unitNumber}-implementation-slides` : 'active-lab-implementation-slides'}
        style={{
          backgroundColor: t.cardBg,
          border: isUnitMode ? `1px solid ${t.border}` : `2px solid ${t.borderHighlight}`,
          borderRadius: isUnitMode ? '14px' : '16px',
          overflow: 'hidden',
          boxShadow: isUnitMode ? 'none' : t.shadow,
          marginTop: isUnitMode ? '20px' : 0,
          transition: 'all 0.2s ease'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)',
            padding: '18px 24px',
            borderBottom: isCollapsed ? 'none' : `1px solid ${t.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#10b981',
                color: '#090d16',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: t.accentEmeraldBg,
                    color: t.accentEmeraldText,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {isUnitMode
                    ? `Unit ${unitNumber} Implementation Slideshow`
                    : 'Step-by-Step Implementation Guide'}
                </span>
                <span style={{ fontSize: '0.76rem', color: t.textMuted }}>
                  Slide {currentSlideIndex + 1} of {slides.length}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0', color: t.text }}>
                {isUnitMode
                  ? unitNumber === 3
                    ? 'Technical Implementation Slideshow: Formulas, Lookups, Pivot Tables & Charts'
                    : `${activeSlide?.unitTitle || 'Unit ' + unitNumber} Implementation Slide Deck`
                  : `Technical Execution & Formula Walkthrough for ${assignment?.exerciseNumber || 'This Exercise'}`}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isUnitMode && onSwitchTab && (
              <button
                type="button"
                onClick={() => onSwitchTab('notes')}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${t.border}`,
                  color: t.accentBlueText,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <BookOpen size={13} /> View Full Curriculum Atlas
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                backgroundColor: t.cardBgAlt,
                border: `1px solid ${t.border}`,
                color: t.text,
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {isCollapsed ? (
                <>
                  <ChevronDown size={14} /> Expand Slideshow ({slides.length} Slides)
                </>
              ) : (
                <>
                  <ChevronUp size={14} /> Collapse Slideshow
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Topic Scrubber Tabs */}
        {!isCollapsed && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: t.cardBgAlt,
              borderBottom: `1px solid ${t.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto'
            }}
          >
            <span style={{ fontSize: '0.74rem', color: t.textMuted, fontWeight: 700, whiteSpace: 'nowrap', marginRight: '6px' }}>
              Jump to Topic:
            </span>
            {slides.map((s, idx) => {
              const isCurrent = idx === currentSlideIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  style={{
                    backgroundColor: isCurrent ? '#10b981' : 'transparent',
                    color: isCurrent ? '#090d16' : t.textSecondary,
                    border: `1px solid ${isCurrent ? '#10b981' : t.border}`,
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {idx + 1}. {s.badge}
                </button>
              );
            })}
          </div>
        )}

        {/* Slide Body */}
        {!isCollapsed && (
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Slide Header: Badge, Title & Objective */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span
                  style={{
                    backgroundColor: t.accentBlueBg,
                    color: t.accentBlueText,
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {activeSlide.badge}
                </span>
                <span style={{ fontSize: '0.78rem', color: t.textMuted }}>
                  Use ◀ Left and Right ▶ arrow keys on keyboard to navigate
                </span>
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: t.text, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                {activeSlide.title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: t.textSecondary, margin: 0, lineHeight: 1.6 }}>
                <strong>Objective:</strong> {activeSlide.objective}
              </p>
            </div>

            {/* Concept Summary Banner */}
            <div
              style={{
                backgroundColor: t.cardBgAlt,
                border: `1px solid ${t.border}`,
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '0.86rem',
                color: t.textSecondary,
                lineHeight: 1.6
              }}
            >
              {activeSlide.conceptSummary}
            </div>

            {/* Formula Syntax Anatomy (If applicable) */}
            {activeSlide.formulaSyntax && (
              <div
                style={{
                  backgroundColor: isDark ? '#080d1a' : '#f8fafc',
                  border: `1px solid ${t.border}`,
                  borderRadius: '12px',
                  padding: '18px 20px',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Formula Syntax & Argument Breakdown
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyFormula(activeSlide.formulaSyntax!.formula)}
                    style={{
                      backgroundColor: copiedFormula ? '#10b981' : t.cardBg,
                      color: copiedFormula ? '#090d16' : t.text,
                      border: `1px solid ${copiedFormula ? '#10b981' : t.border}`,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {copiedFormula ? (
                      <>
                        <Check size={12} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy Formula
                      </>
                    )}
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: isDark ? '#040711' : '#ffffff',
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: t.accentEmeraldText,
                    overflowX: 'auto',
                    marginBottom: '14px'
                  }}
                >
                  {activeSlide.formulaSyntax.formula}
                </div>

                {/* Color-coded parts breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {activeSlide.formulaSyntax.parts.map((part, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        backgroundColor: t.cardBg,
                        border: `1px solid ${t.border}`,
                        borderLeft: `4px solid ${part.color}`,
                        borderRadius: '6px',
                        padding: '8px 12px'
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: part.color, marginBottom: '2px' }}>
                        {part.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: t.textSecondary, lineHeight: 1.4 }}>
                        {part.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Simulated Spreadsheet Grid Preview (If applicable) */}
            {activeSlide.spreadsheetPreview && (
              <div
                style={{
                  backgroundColor: t.cardBgAlt,
                  border: `1px solid ${t.border}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Interactive Spreadsheet Visual Model (Aviation Dataset)</span>
                  {activeSlide.spreadsheetPreview.formulaBar && (
                    <span style={{ fontFamily: 'monospace', color: t.textMuted, fontSize: '0.75rem' }}>
                      fx: {activeSlide.spreadsheetPreview.formulaBar}
                    </span>
                  )}
                </div>

                <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${t.border}` }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0', color: t.text }}>
                        {activeSlide.spreadsheetPreview.headers.map((h, hIdx) => (
                          <th key={hIdx} style={{ padding: '8px 12px', borderRight: `1px solid ${t.border}`, fontWeight: 700 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeSlide.spreadsheetPreview.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            backgroundColor: row.highlightRow ? (isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)') : rIdx % 2 === 0 ? t.cardBg : t.cardBgAlt
                          }}
                        >
                          {row.values.map((val, cIdx) => (
                            <td
                              key={cIdx}
                              style={{
                                padding: '8px 12px',
                                borderRight: `1px solid ${t.border}`,
                                borderBottom: `1px solid ${t.border}`,
                                color: row.highlightCol === cIdx ? '#10b981' : t.text,
                                fontWeight: row.highlightCol === cIdx ? 800 : 500
                              }}
                            >
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeSlide.spreadsheetPreview.calloutText && (
                  <div style={{ fontSize: '0.78rem', color: t.textMuted, marginTop: '8px', fontStyle: 'italic' }}>
                    💡 {activeSlide.spreadsheetPreview.calloutText}
                  </div>
                )}
              </div>
            )}

            {/* Step-by-Step Action List */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: t.text, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Implementation Sequence:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {activeSlide.stepByStep.map((step) => (
                  <div
                    key={step.step}
                    style={{
                      backgroundColor: t.cardBgAlt,
                      border: `1px solid ${t.border}`,
                      borderRadius: '8px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          backgroundColor: '#10b981',
                          color: '#090d16',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {step.step}
                      </span>
                      <strong style={{ fontSize: '0.82rem', color: t.text }}>{step.action}</strong>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: t.textSecondary, lineHeight: 1.4, paddingLeft: '28px' }}>
                      {step.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traps & Pro Tips Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: t.accentRoseBg,
                  border: `1px solid ${t.accentRose}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: t.accentRoseText, textTransform: 'uppercase', marginBottom: '2px' }}>
                    Common Trap to Avoid
                  </div>
                  <div style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: 1.45 }}>
                    {activeSlide.commonPitfall}
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: t.accentAmberBg,
                  border: `1px solid ${t.accentAmber}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                <Lightbulb size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: t.accentAmberText, textTransform: 'uppercase', marginBottom: '2px' }}>
                    Professional Best Practice
                  </div>
                  <div style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: 1.45 }}>
                    {activeSlide.proTip}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Direct Application */}
            {activeSlide.exerciseApplication && (
              <div
                style={{
                  backgroundColor: t.accentEmeraldBg,
                  border: `1px solid ${t.accentEmerald}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.82rem',
                  color: t.accentEmeraldText,
                  fontWeight: 600
                }}
              >
                <Target size={16} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Lab Exercise Target:</strong> {activeSlide.exerciseApplication}
                </span>
              </div>
            )}

            {/* Slide Navigation Stepper Footer */}
            <div
              style={{
                borderTop: `1px solid ${t.border}`,
                paddingTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                style={{
                  backgroundColor: currentSlideIndex === 0 ? 'transparent' : t.cardBgAlt,
                  border: `1px solid ${t.border}`,
                  color: currentSlideIndex === 0 ? t.textMuted : t.text,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: currentSlideIndex === 0 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={16} /> Previous Step
              </button>

              {/* Dot Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(dotIdx)}
                    style={{
                      width: dotIdx === currentSlideIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: dotIdx === currentSlideIndex ? '#10b981' : t.border,
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.2s ease'
                    }}
                    title={`Slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                style={{
                  backgroundColor: currentSlideIndex === slides.length - 1 ? 'transparent' : '#10b981',
                  border: currentSlideIndex === slides.length - 1 ? `1px solid ${t.border}` : 'none',
                  color: currentSlideIndex === slides.length - 1 ? t.textMuted : '#090d16',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: currentSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: currentSlideIndex === slides.length - 1 ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                  opacity: currentSlideIndex === slides.length - 1 ? 0.5 : 1
                }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            </div>

          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // MASTER MODE (Inside "Course Curriculum Notes & Revision Units")
  // =========================================================================
  return (
    <div
      style={{
        backgroundColor: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: t.shadow,
        marginBottom: '28px'
      }}
    >
      {/* Top Banner & Control Deck */}
      <div
        style={{
          backgroundColor: isDark ? '#0d1527' : '#f1f5f9',
          padding: '24px 28px',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ backgroundColor: '#10b981', color: '#090d16', fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                CURRICULUM MASTER SLIDESHOW
              </span>
              <span style={{ fontSize: '0.78rem', color: t.textMuted }}>
                {slides.length} Implementation Modules Available
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: t.text, margin: 0 }}>
              Technical Implementation Atlas & Step-by-Step Slide Deck
            </h3>
            <p style={{ fontSize: '0.86rem', color: t.textSecondary, margin: '4px 0 0' }}>
              Consolidated interactive revision deck covering formula structures, lookup algorithms, pivot tables, and documentation rules.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsTheater(!isTheater)}
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                color: t.text,
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isTheater ? (
                <>
                  <Minimize2 size={14} /> Standard View
                </>
              ) : (
                <>
                  <Maximize2 size={14} /> Theater Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Unit Tabs & Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {/* Unit Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all' as const, label: 'All Units (Full Atlas)' },
              { id: 3 as const, label: 'Unit 3: MS Excel & Spreadsheets' },
              { id: 2 as const, label: 'Unit 2: MS Word Documentation' },
              { id: 4 as const, label: 'Unit 4: PowerPoint Presentations' },
              { id: 1 as const, label: 'Unit 1: OS & File Architecture' }
            ].map((tab) => {
              const isSelected = selectedUnit === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedUnit(tab.id);
                    setCurrentSlideIndex(0);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#10b981' : t.cardBg,
                    color: isSelected ? '#090d16' : t.textSecondary,
                    border: `1px solid ${isSelected ? '#10b981' : t.border}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={14} color={t.textMuted} style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search slide (e.g. VLOOKUP, Pivot, Round)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentSlideIndex(0);
              }}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: t.inputBg,
                border: `1px solid ${t.inputBorder}`,
                color: t.text,
                padding: '8px 12px 8px 32px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Slideshow Stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isTheater ? '1fr' : '280px 1fr',
          minHeight: '620px'
        }}
      >
        {/* Left Thumbnails Scrubber (Hidden in Theater mode) */}
        {!isTheater && (
          <div
            style={{
              backgroundColor: t.cardBgAlt,
              borderRight: `1px solid ${t.border}`,
              overflowY: 'auto',
              maxHeight: '680px',
              padding: '12px'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: t.textMuted, padding: '6px 8px', textTransform: 'uppercase' }}>
              Slide Navigator ({slides.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {slides.map((slide, sIdx) => {
                const isSelected = sIdx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlideIndex(sIdx)}
                    style={{
                      textAlign: 'left',
                      backgroundColor: isSelected ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                      border: `1px solid ${isSelected ? '#10b981' : 'transparent'}`,
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: isSelected ? '#10b981' : t.textMuted
                        }}
                      >
                        STEP {sIdx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                          color: t.textSecondary,
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        U{slide.unit}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: isSelected ? t.text : t.textSecondary,
                        lineHeight: 1.35
                      }}
                    >
                      {slide.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Stage: Active Slide Presentation Content */}
        <div style={{ padding: isTheater ? '32px 40px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Slide Top Badge & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: t.accentEmeraldBg, color: t.accentEmeraldText, fontSize: '0.74rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px' }}>
                  {activeSlide.badge}
                </span>
                <span style={{ fontSize: '0.78rem', color: t.textMuted }}>
                  {activeSlide.unitTitle}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>

            <h2 style={{ fontSize: isTheater ? '1.8rem' : '1.5rem', fontWeight: 800, color: t.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
              {activeSlide.title}
            </h2>
            <div style={{ fontSize: '0.94rem', color: t.textSecondary, lineHeight: 1.6 }}>
              <strong>Operational Takeaway:</strong> {activeSlide.objective}
            </div>
          </div>

          {/* Concept Summary */}
          <div
            style={{
              backgroundColor: t.cardBgAlt,
              border: `1px solid ${t.border}`,
              borderRadius: '10px',
              padding: '16px 20px',
              fontSize: '0.88rem',
              color: t.textSecondary,
              lineHeight: 1.65
            }}
          >
            {activeSlide.conceptSummary}
          </div>

          {/* Formula Syntax Box (If present) */}
          {activeSlide.formulaSyntax && (
            <div
              style={{
                backgroundColor: isDark ? '#080d1a' : '#f8fafc',
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '20px 24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Standard Formula Syntax & Argument Map
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyFormula(activeSlide.formulaSyntax!.formula)}
                  style={{
                    backgroundColor: copiedFormula ? '#10b981' : t.cardBg,
                    color: copiedFormula ? '#090d16' : t.text,
                    border: `1px solid ${copiedFormula ? '#10b981' : t.border}`,
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedFormula ? (
                    <>
                      <Check size={13} /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy size={13} /> Copy Formula Code
                    </>
                  )}
                </button>
              </div>

              <div
                style={{
                  backgroundColor: isDark ? '#040711' : '#ffffff',
                  border: `1px solid ${t.border}`,
                  borderRadius: '8px',
                  padding: '14px 18px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: t.accentEmeraldText,
                  overflowX: 'auto',
                  marginBottom: '14px'
                }}
              >
                {activeSlide.formulaSyntax.formula}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {activeSlide.formulaSyntax.parts.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: t.cardBg,
                      border: `1px solid ${t.border}`,
                      borderLeft: `4px solid ${p.color}`,
                      borderRadius: '6px',
                      padding: '10px 14px'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: p.color, marginBottom: '2px' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: t.textSecondary, lineHeight: 1.4 }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spreadsheet Table Preview (If present) */}
          {activeSlide.spreadsheetPreview && (
            <div
              style={{
                backgroundColor: t.cardBgAlt,
                border: `1px solid ${t.border}`,
                borderRadius: '12px',
                padding: '18px 22px'
              }}
            >
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Spreadsheet Simulation & Live Cell Coordinates</span>
                {activeSlide.spreadsheetPreview.formulaBar && (
                  <span style={{ fontFamily: 'monospace', color: t.textMuted }}>
                    Formula Bar: {activeSlide.spreadsheetPreview.formulaBar}
                  </span>
                )}
              </div>

              <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${t.border}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0', color: t.text }}>
                      {activeSlide.spreadsheetPreview.headers.map((h, hIdx) => (
                        <th key={hIdx} style={{ padding: '8px 12px', borderRight: `1px solid ${t.border}`, fontWeight: 700 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeSlide.spreadsheetPreview.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{
                          backgroundColor: row.highlightRow ? (isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)') : rIdx % 2 === 0 ? t.cardBg : t.cardBgAlt
                        }}
                      >
                        {row.values.map((val, cIdx) => (
                          <td
                            key={cIdx}
                            style={{
                              padding: '8px 12px',
                              borderRight: `1px solid ${t.border}`,
                              borderBottom: `1px solid ${t.border}`,
                              color: row.highlightCol === cIdx ? '#10b981' : t.text,
                              fontWeight: row.highlightCol === cIdx ? 800 : 500
                            }}
                          >
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeSlide.spreadsheetPreview.calloutText && (
                <div style={{ fontSize: '0.8rem', color: t.textMuted, marginTop: '10px', fontStyle: 'italic' }}>
                  💡 {activeSlide.spreadsheetPreview.calloutText}
                </div>
              )}
            </div>
          )}

          {/* Action Step Breakdown */}
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: t.text, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Execution Steps:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {activeSlide.stepByStep.map((s) => (
                <div
                  key={s.step}
                  style={{
                    backgroundColor: t.cardBgAlt,
                    border: `1px solid ${t.border}`,
                    borderRadius: '8px',
                    padding: '14px 16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        backgroundColor: '#10b981',
                        color: '#090d16',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {s.step}
                    </span>
                    <strong style={{ fontSize: '0.86rem', color: t.text }}>{s.action}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: 1.5, paddingLeft: '30px' }}>
                    {s.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pitfalls & Best Practice Tips */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div
              style={{
                backgroundColor: t.accentRoseBg,
                border: `1px solid ${t.accentRose}`,
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                gap: '12px'
              }}
            >
              <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: t.accentRoseText, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Common Error or Audit Trap
                </div>
                <div style={{ fontSize: '0.82rem', color: t.textSecondary, lineHeight: 1.5 }}>
                  {activeSlide.commonPitfall}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: t.accentAmberBg,
                border: `1px solid ${t.accentAmber}`,
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                gap: '12px'
              }}
            >
              <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: t.accentAmberText, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Industry Best Practice
                </div>
                <div style={{ fontSize: '0.82rem', color: t.textSecondary, lineHeight: 1.5 }}>
                  {activeSlide.proTip}
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation Footer Bar */}
          <div
            style={{
              marginTop: 'auto',
              borderTop: `1px solid ${t.border}`,
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              style={{
                backgroundColor: currentSlideIndex === 0 ? 'transparent' : t.cardBgAlt,
                border: `1px solid ${t.border}`,
                color: currentSlideIndex === 0 ? t.textMuted : t.text,
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: currentSlideIndex === 0 ? 0.5 : 1
              }}
            >
              <ChevronLeft size={16} /> Previous Module
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: t.textMuted }}>
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              style={{
                backgroundColor: currentSlideIndex === slides.length - 1 ? 'transparent' : '#10b981',
                border: currentSlideIndex === slides.length - 1 ? `1px solid ${t.border}` : 'none',
                color: currentSlideIndex === slides.length - 1 ? t.textMuted : '#090d16',
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: currentSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: currentSlideIndex === slides.length - 1 ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.35)',
                opacity: currentSlideIndex === slides.length - 1 ? 0.5 : 1
              }}
            >
              Next Module <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
