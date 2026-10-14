'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, SkipForward, Lock, Unlock, 
  CheckCircle2, AlertTriangle, Sparkles, HelpCircle, 
  ChevronRight, ArrowDown, Info, ShieldCheck, Laptop, Globe,
  Copy, FileSpreadsheet, Check
} from 'lucide-react';

export default function AbsoluteReferencingSimulator() {
  const [step, setStep] = useState<number>(0); // 0: Init, 1: Row 2, 2: Row 3, 3: Row 4, 4: Done
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [platform, setPlatform] = useState<'excel' | 'sheets'>('excel');
  const [speed, setSpeed] = useState<number>(1800); // ms per step

  // Clipboard copy state & notification
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const copyToClipboard = async (content: string, key: string, toastMessage?: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedKey(key);
      if (toastMessage) setCopyToast(toastMessage);
      setTimeout(() => setCopiedKey(prev => prev === key ? null : prev), 2500);
      if (toastMessage) setTimeout(() => setCopyToast(null), 3500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const getAbsoluteTableTSV = () => {
    return [
      `Aviation GST Calculation Matrix\t\t\tTax Rate:\t0.18`,
      `Passenger Name\tBase Fare (₹)\tFormula Evaluated\tGST Calculated (₹)`,
      `Rohan Verma\t5000\t${isLocked ? '=B2*$D$1' : '=B2*D1'}\t${isLocked ? '=B2*$D$1' : '=B2*D1'}`,
      `Priya Sharma\t8500\t${isLocked ? '=B3*$D$1' : '=B3*D2'}\t${isLocked ? '=B3*$D$1' : '=B3*D2'}`,
      `Ananya Das\t12000\t${isLocked ? '=B4*$D$1' : '=B4*D3'}\t${isLocked ? '=B4*$D$1' : '=B4*D3'}`
    ].join('\n');
  };

  // Autoplay effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (step < 3) {
          setStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handleNextStep = () => {
    setIsPlaying(false);
    setStep(prev => (prev < 3 ? prev + 1 : 0));
  };

  // Cell evaluation data
  const rows = [
    {
      rowNum: 2,
      passenger: 'Rohan Verma',
      flight: 'AI 502',
      baseFare: 5000,
      relativeCell: 'B2',
      // Row 2 is always calculated from D1
      formulaLocked: '=B2 * $D$1',
      formulaUnlocked: '=B2 * D1',
      calcLocked: '₹5,000 × 18% = ₹900',
      calcUnlocked: '₹5,000 × 18% = ₹900',
      resultLocked: '₹900',
      resultUnlocked: '₹900',
      targetDCell: 'D1',
      isError: false,
      explanationLocked: 'Row 2: Relative cell B2 (₹5,000) is multiplied by locked anchor $D$1 (18%). Result: ₹900.',
      explanationUnlocked: 'Row 2: Relative cell B2 (₹5,000) is multiplied by D1 (18%). Result: ₹900 (Initial row works fine).'
    },
    {
      rowNum: 3,
      passenger: 'Priya Sharma',
      flight: 'AI 502',
      baseFare: 8500,
      relativeCell: 'B3',
      formulaLocked: '=B3 * $D$1',
      formulaUnlocked: '=B3 * D2',
      calcLocked: '₹8,500 × 18% = ₹1,530',
      calcUnlocked: '₹8,500 × 0 = ₹0 (Error!)',
      resultLocked: '₹1,530',
      resultUnlocked: '₹0',
      targetDCell: isLocked ? 'D1' : 'D2',
      isError: !isLocked,
      explanationLocked: 'Row 3 (With $): AutoFill shifted B2 ➔ B3, but kept $D$1 locked! 8,500 × 18% = ₹1,530.',
      explanationUnlocked: 'Row 3 (WITHOUT $): AutoFill shifted B2 ➔ B3, BUT ALSO shifted D1 ➔ D2! Since D2 is empty (0), 8,500 × 0 = ₹0!'
    },
    {
      rowNum: 4,
      passenger: 'Ananya Das',
      flight: 'AI 502',
      baseFare: 12000,
      relativeCell: 'B4',
      formulaLocked: '=B4 * $D$1',
      formulaUnlocked: '=B4 * D3',
      calcLocked: '₹12,000 × 18% = ₹2,160',
      calcUnlocked: '₹12,000 × 0 = ₹0 (Error!)',
      resultLocked: '₹2,160',
      resultUnlocked: '₹0',
      targetDCell: isLocked ? 'D1' : 'D3',
      isError: !isLocked,
      explanationLocked: 'Row 4 (With $): B4 shifts, while $D$1 stays firmly anchored. 12,000 × 18% = ₹2,160. Total accuracy!',
      explanationUnlocked: 'Row 4 (WITHOUT $): Shifted down to D3! Another ₹0 output. The entire billing report is ruined without $.'
    }
  ];

  // Current active formula display in formula bar
  const currentFormula = () => {
    if (step === 0) return isLocked ? '=B2 * $D$1' : '=B2 * D1';
    const currentRow = rows[Math.min(step - 1, 2)];
    return isLocked ? currentRow.formulaLocked : currentRow.formulaUnlocked;
  };

  const currentActiveCell = () => {
    if (step === 0) return 'C2';
    return `C${rows[Math.min(step - 1, 2)].rowNum}`;
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '920px',
      margin: '0 auto',
      background: '#0f172a',
      borderRadius: '16px',
      border: '1px solid #334155',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Top Application Bar */}
      <div style={{
        background: platform === 'excel' ? 'linear-gradient(90deg, #107c41 0%, #0d5f32 100%)' : 'linear-gradient(90deg, #0f9d58 0%, #0b8043 100%)',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'white',
            color: platform === 'excel' ? '#107c41' : '#0f9d58',
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '3px 8px',
            borderRadius: '4px',
            letterSpacing: '0.05em'
          }}>
            {platform === 'excel' ? 'EXCEL SIMULATOR' : 'SHEETS SIMULATOR'}
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
            Absolute Cell Referencing in Action: The Dollar Lock ($)
          </span>
        </div>

        {/* Platform Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setPlatform('excel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: platform === 'excel' ? '#ffffff' : 'transparent',
              color: platform === 'excel' ? '#107c41' : '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Laptop size={14} /> MS Excel
          </button>
          <button
            onClick={() => setPlatform('sheets')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: platform === 'sheets' ? '#ffffff' : 'transparent',
              color: platform === 'sheets' ? '#0f9d58' : '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Globe size={14} /> Google Sheets
          </button>
        </div>
      </div>

      {/* Control Sub-bar */}
      <div style={{
        padding: '0.75rem 1.5rem',
        background: '#1e293b',
        borderBottom: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: isPlaying ? '#eab308' : '#10b981',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.82rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Autoplay'}
          </button>

          <button
            onClick={handleNextStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#334155',
              color: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.82rem',
              borderRadius: '6px',
              border: '1px solid #475569',
              cursor: 'pointer'
            }}
          >
            <SkipForward size={14} /> Step Forward
          </button>

          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '0.82rem',
              borderRadius: '6px',
              border: '1px solid #334155',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Lock Switcher - The Core Pedagogical Hook */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Mode:</span>
          <button
            onClick={() => { setIsLocked(true); setStep(0); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: isLocked ? '2px solid #eab308' : '1px solid #334155',
              background: isLocked ? 'rgba(234, 179, 8, 0.18)' : '#0f172a',
              color: isLocked ? '#facc15' : '#94a3b8'
            }}
          >
            <Lock size={14} /> With Lock ($D$1) - Correct
          </button>

          <button
            onClick={() => { setIsLocked(false); setStep(0); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: !isLocked ? '2px solid #ef4444' : '1px solid #334155',
              background: !isLocked ? 'rgba(239, 68, 68, 0.18)' : '#0f172a',
              color: !isLocked ? '#f87171' : '#94a3b8'
            }}
          >
            <Unlock size={14} /> Without Lock (D1) - Shows Error
          </button>
        </div>
      </div>

      {/* Spreadsheet Formula Bar */}
      <div style={{
        background: '#090d16',
        padding: '0.55rem 1.5rem',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.85rem'
      }}>
        {/* Name box */}
        <div style={{
          background: '#1e293b',
          padding: '3px 10px',
          borderRadius: '4px',
          fontWeight: 700,
          color: '#38bdf8',
          border: '1px solid #334155',
          minWidth: '45px',
          textAlign: 'center'
        }}>
          {currentActiveCell()}
        </div>

        <div style={{ color: '#64748b', fontStyle: 'italic', fontWeight: 600 }}>fx</div>

        {/* Active formula display with syntax color coding */}
        <div style={{
          flex: 1,
          background: '#1e293b',
          padding: '4px 12px',
          borderRadius: '4px',
          border: '1px solid #334155',
          fontFamily: 'monospace',
          fontSize: '0.92rem'
        }}>
          <span style={{ color: '#e2e8f0' }}>=</span>
          <span style={{ color: '#38bdf8', fontWeight: 700 }}>
            {step === 0 ? 'B2' : rows[Math.min(step - 1, 2)].relativeCell}
          </span>
          <span style={{ color: '#e2e8f0' }}> * </span>
          <span style={{
            color: isLocked ? '#facc15' : '#f87171',
            fontWeight: 800,
            background: isLocked ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}>
            {isLocked ? '$D$1' : (step === 0 ? 'D1' : rows[Math.min(step - 1, 2)].targetDCell)}
          </span>
        </div>

        {/* Platform shortcut helper badge & Copy Formula Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Shortcut:</span>
            <span style={{
              background: '#334155',
              color: '#f8fafc',
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: 700,
              border: '1px solid #475569'
            }}>
              {platform === 'excel' ? 'F4' : 'F4 / Fn+F4'}
            </span>
          </div>

          <button
            onClick={() => copyToClipboard(isLocked ? '=B2*$D$1' : '=B2*D1', 'abs-formula', 'Formula copied! Paste into cell C2 in Excel or Google Sheets.')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: copiedKey === 'abs-formula' ? '#10b981' : '#1e293b',
              color: copiedKey === 'abs-formula' ? '#ffffff' : '#38bdf8',
              border: '1px solid ' + (copiedKey === 'abs-formula' ? '#10b981' : '#334155'),
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Copy formula text"
          >
            {copiedKey === 'abs-formula' ? <Check size={13} /> : <Copy size={13} />}
            <span>{copiedKey === 'abs-formula' ? 'Copied Formula!' : 'Copy Formula'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div style={{ padding: '1.25rem 1.5rem', background: '#0b1120' }}>
        {/* Table Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
            Live Spreadsheet Grid · Tax Rate anchored in $D$1 (18%)
          </span>

          <button
            onClick={() => copyToClipboard(getAbsoluteTableTSV(), 'abs-table', 'Table copied! Open Excel or Google Sheets, click cell A1, and press Ctrl+V.')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: copiedKey === 'abs-table' ? '#10b981' : 'linear-gradient(135deg, #107c41 0%, #0f9d58 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '5px 13px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(16, 124, 65, 0.3)',
              transition: 'all 0.2s'
            }}
            title="Copy table with headers & formula to paste directly into Excel or Google Sheets (Ctrl+V at A1)"
          >
            {copiedKey === 'abs-table' ? <Check size={14} /> : <FileSpreadsheet size={14} />}
            <span>{copiedKey === 'abs-table' ? '✓ Copied for Excel / Sheets!' : 'Copy Table for Excel / Sheets'}</span>
          </button>
        </div>

        <div style={{
          background: '#1e293b',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #334155'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              {/* Column Letters */}
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ width: '40px', padding: '6px', textAlign: 'center', borderRight: '1px solid #334155' }}></th>
                <th style={{ padding: '6px 12px', textAlign: 'left', borderRight: '1px solid #334155', width: '28%' }}>A</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', borderRight: '1px solid #334155', width: '22%' }}>B</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', borderRight: '1px solid #334155', width: '26%' }}>C</th>
                <th style={{ padding: '6px 12px', textAlign: 'left', width: '24%' }}>D</th>
              </tr>
              {/* Row 1: Column Titles & The Locked Anchor in D1 */}
              <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                <td style={{ background: '#0f172a', color: '#94a3b8', fontWeight: 700, textAlign: 'center', padding: '8px', borderRight: '1px solid #334155' }}>
                  1
                </td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#94a3b8', borderRight: '1px solid #334155' }}>
                  Passenger Name
                </td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#94a3b8', borderRight: '1px solid #334155' }}>
                  Base Ticket Fare
                </td>
                <td style={{ padding: '8px 12px', fontWeight: 700, color: '#94a3b8', borderRight: '1px solid #334155' }}>
                  Aviation GST (18%)
                </td>
                {/* Cell D1: THE CRITICAL ANCHOR */}
                <td style={{
                  padding: '8px 12px',
                  background: isLocked ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: isLocked ? '2px solid #eab308' : '2px dashed #ef4444',
                  borderRadius: '4px',
                  position: 'relative',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: isLocked ? '#facc15' : '#f87171', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>
                        Tax Rate (D1)
                      </span>
                      <strong style={{ fontSize: '1rem', color: isLocked ? '#fef08a' : '#fca5a5' }}>18%</strong>
                    </div>
                    {isLocked ? (
                      <span style={{
                        background: '#eab308',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}>
                        <Lock size={12} /> $D$1 LOCKED
                      </span>
                    ) : (
                      <span style={{
                        background: '#ef4444',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}>
                        <Unlock size={12} /> UNLOCKED
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const isCalculated = step > idx;
                const isCurrentEvaluating = step === idx + 1;
                const isRow3or4Unlocked = !isLocked && idx > 0 && isCalculated;

                return (
                  <tr
                    key={row.rowNum}
                    style={{
                      borderBottom: '1px solid #334155',
                      background: isCurrentEvaluating ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                      transition: 'background 0.3s'
                    }}
                  >
                    {/* Row Number */}
                    <td style={{
                      background: '#0f172a',
                      color: isCurrentEvaluating ? '#38bdf8' : '#94a3b8',
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '10px 6px',
                      borderRight: '1px solid #334155'
                    }}>
                      {row.rowNum}
                    </td>

                    {/* Column A: Passenger */}
                    <td style={{ padding: '10px 12px', borderRight: '1px solid #334155', color: '#cbd5e1' }}>
                      {row.passenger}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Flight {row.flight}</span>
                    </td>

                    {/* Column B: Base Fare (Relative source) */}
                    <td style={{
                      padding: '10px 12px',
                      borderRight: '1px solid #334155',
                      fontWeight: 600,
                      position: 'relative',
                      background: isCurrentEvaluating ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      borderLeft: isCurrentEvaluating ? '3px solid #38bdf8' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>₹{row.baseFare.toLocaleString('en-IN')}</span>
                        {isCurrentEvaluating && (
                          <span style={{
                            fontSize: '0.68rem',
                            background: '#38bdf8',
                            color: '#0f172a',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            fontWeight: 800
                          }}>
                            {row.relativeCell}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column C: Calculated GST Result */}
                    <td style={{
                      padding: '10px 12px',
                      borderRight: '1px solid #334155',
                      fontWeight: 700,
                      position: 'relative',
                      background: isRow3or4Unlocked 
                        ? 'rgba(239, 68, 68, 0.15)' 
                        : (isCalculated ? 'rgba(16, 185, 129, 0.12)' : 'transparent')
                    }}>
                      {isCalculated ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{
                            color: isRow3or4Unlocked ? '#f87171' : '#34d399',
                            fontSize: '0.95rem'
                          }}>
                            {isLocked ? row.resultLocked : row.resultUnlocked}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            color: isRow3or4Unlocked ? '#f87171' : '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            {isRow3or4Unlocked ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                            {isLocked ? row.formulaLocked : row.formulaUnlocked}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.78rem' }}>
                          {idx === 0 ? 'Click Step Forward to calculate' : 'Awaiting AutoFill drag...'}
                        </span>
                      )}

                      {/* Green AutoFill Drag Handle Dot on Row 2 */}
                      {idx === 0 && step === 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '-4px',
                            bottom: '-4px',
                            width: '9px',
                            height: '9px',
                            background: '#10b981',
                            border: '1px solid white',
                            cursor: 'crosshair',
                            boxShadow: '0 0 6px #10b981',
                            animation: 'pulse 1s infinite'
                          }}
                          title="AutoFill Handle (Drag Down)"
                        />
                      )}
                    </td>

                    {/* Column D: Secondary cells in Column D (D2, D3, D4) */}
                    <td style={{
                      padding: '10px 12px',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontStyle: 'italic',
                      background: !isLocked && isCurrentEvaluating ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                      border: !isLocked && isCurrentEvaluating ? '2px dashed #ef4444' : 'none'
                    }}>
                      {!isLocked && idx > 0 && isCurrentEvaluating ? (
                        <span style={{ color: '#f87171', fontWeight: 700 }}>
                          ⚠️ D{row.rowNum} is EMPTY (Value = 0)!
                        </span>
                      ) : (
                        idx === 0 ? '' : `(Empty cell D${row.rowNum})`
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Step Explanation Box */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          background: isLocked ? '#1e293b' : 'rgba(239, 68, 68, 0.1)',
          border: isLocked ? '1px solid #334155' : '1px solid #ef4444',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{
            background: isLocked ? '#eab308' : '#ef4444',
            color: '#0f172a',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2px'
          }}>
            {isLocked ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: isLocked ? '#facc15' : '#f87171',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {step === 0 ? 'Ready to Start' : `Step ${step} of 3 Analysis`}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.75rem' }}>·</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {isLocked ? 'Absolute Reference Lock ($) Active' : 'Relative Drift Active (Error State)'}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: '#f1f5f9' }}>
              {step === 0 ? (
                <span>
                  Click <strong>Step Forward</strong> or <strong>Autoplay</strong> to watch how Excel and Google Sheets handle the AutoFill drag down across passenger rows.
                </span>
              ) : isLocked ? (
                rows[step - 1].explanationLocked
              ) : (
                rows[step - 1].explanationUnlocked
              )}
            </p>
          </div>
        </div>

        {/* The Google Sheets vs Excel Comparison Callout */}
        <div style={{
          marginTop: '1rem',
          padding: '0.9rem 1.25rem',
          borderRadius: '8px',
          background: platform === 'excel' ? 'rgba(16, 124, 65, 0.12)' : 'rgba(15, 157, 88, 0.12)',
          border: platform === 'excel' ? '1px solid rgba(16, 124, 65, 0.3)' : '1px solid rgba(15, 157, 88, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: platform === 'excel' ? '#4ade80' : '#6ee7b7', marginBottom: '2px' }}>
              {platform === 'excel' ? '✈️ Microsoft Excel Pro-Tip:' : '☁️ Google Sheets Cloud Bridge:'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              {platform === 'excel' 
                ? 'Press F4 while typing D1 in the formula bar to cycle through: D1 ➔ $D$1 (both locked) ➔ D$1 (row locked) ➔ $D1 (column locked).'
                : 'In Google Sheets, press F4 (or Fn + F4 on Mac/laptops). Sheets will also prompt a green "Suggested autofill" popup that applies the formula across all 180 rows in 1 click!'}
            </div>
          </div>

          <div style={{
            background: platform === 'excel' ? '#107c41' : '#0f9d58',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}>
            {platform === 'excel' ? 'F4 Cycle Shortcut' : 'F4 / Fn+F4 in Browser'}
          </div>
        </div>
      </div>

      {/* Floating Clipboard Copy Confirmation Toast */}
      {copyToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
          border: '1.5px solid #34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.86rem',
          fontWeight: 600,
          maxWidth: '440px',
          lineHeight: '1.4'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Check size={16} color="#ffffff" />
          </div>
          <span>{copyToast}</span>
        </div>
      )}
    </div>
  );
}
