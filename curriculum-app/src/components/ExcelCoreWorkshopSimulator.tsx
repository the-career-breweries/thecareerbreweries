'use client';

import React, { useState } from 'react';
import { 
  Calculator, Lock, BarChart3, Binary, CheckCircle2, 
  ArrowRight, Sparkles, RefreshCw, Layers, ShieldCheck, 
  HelpCircle, Eye, AlertCircle, Laptop, Globe, Check, Award
} from 'lucide-react';

export default function ExcelCoreWorkshopSimulator() {
  const [activeTab, setActiveTab] = useState<'math' | 'referencing' | 'stats' | 'logical_text'>('math');
  const [platform, setPlatform] = useState<'excel' | 'sheets'>('excel');
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({
    math: false,
    referencing: false,
    stats: false,
    logical_text: false,
  });

  // Mark tab complete
  const markComplete = (tab: string) => {
    setCompletedTabs(prev => ({ ...prev, [tab]: true }));
  };

  // -------------------------------------------------------------
  // TAB 1: BASIC MATHEMATICAL FORMULAE (Order of Operations / PEMDAS)
  // -------------------------------------------------------------
  const [actualLuggage, setActualLuggage] = useState<number>(24);
  const [useParentheses, setUseParentheses] = useState<boolean>(true);
  const freeAllowance = 15;
  const ratePerKg = 450;
  const handlingFee = 200;

  // Correct: =(24 - 15) * 450 + 200 = 9 * 450 + 200 = 4050 + 200 = 4250
  // Wrong (No brackets): =24 - 15 * 450 + 200 = 24 - 6750 + 200 = -6526
  const calcCorrect = (actualLuggage - freeAllowance) * ratePerKg + handlingFee;
  const calcWrong = actualLuggage - (freeAllowance * ratePerKg) + handlingFee;
  const excessKg = Math.max(0, actualLuggage - freeAllowance);

  // -------------------------------------------------------------
  // TAB 2: CELL REFERENCING (Absolute $ Locking vs Relative Shift)
  // -------------------------------------------------------------
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [refStep, setRefStep] = useState<number>(0); // 0, 1, 2 (rows)
  const gstRate = 0.18; // In cell $E$1
  const routesData = [
    { row: 3, code: 'QP 1302', sector: 'BLR ➔ BOM', base: 4000 },
    { row: 4, code: 'QP 1405', sector: 'DEL ➔ GOI', base: 6500 },
    { row: 5, code: 'QP 1511', sector: 'HYD ➔ IXE', base: 5200 },
  ];

  // -------------------------------------------------------------
  // TAB 3: ESSENTIAL FUNCTIONS (Statistical)
  // -------------------------------------------------------------
  const [selectedStatFunc, setSelectedStatFunc] = useState<'SUM' | 'AVERAGE' | 'MAX' | 'MIN' | 'COUNT' | 'COUNTA'>('SUM');
  const flightStats = [
    { flight: 'AI 101', sector: 'DEL-BOM', pax: 182, cargo: 3400, delay: 0 },
    { flight: '6E 204', sector: 'BLR-DEL', pax: 176, cargo: 1950, delay: 22 },
    { flight: 'UK 815', sector: 'BOM-GOI', pax: 158, cargo: 2800, delay: 8 },
    { flight: 'SG 302', sector: 'HYD-IXE', pax: 186, cargo: 950, delay: 35 },
    { flight: 'QP 110', sector: 'CCU-MAA', pax: 168, cargo: 1600, delay: 4 },
  ];

  const totalPax = flightStats.reduce((acc, f) => acc + f.pax, 0);
  const avgPax = (totalPax / flightStats.length).toFixed(1);
  const maxCargo = Math.max(...flightStats.map(f => f.cargo));
  const minDelay = Math.min(...flightStats.map(f => f.delay));
  const countFlights = flightStats.length;

  // -------------------------------------------------------------
  // TAB 4: LOGICAL AND TEXT FUNCTIONS
  // -------------------------------------------------------------
  const [milesInput, setMilesInput] = useState<number>(54000);
  const [customName, setCustomName] = useState<string>('  rohan  verma  ');
  const [textActiveTab, setTextActiveTab] = useState<'logical' | 'text'>('logical');

  // Text functions results
  const cleanedProper = customName.trim().replace(/\s+/g, ' ').toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const rawCode = 'del-ixe-804';
  const upperCode = rawCode.toUpperCase();
  const originCode = upperCode.slice(0, 3);
  const destCode = upperCode.slice(4, 7);

  // Logical results
  const isPriority = milesInput >= 50000;
  const loungeTier = milesInput >= 75000 ? 'Platinum First' : milesInput >= 50000 ? 'Gold Executive' : milesInput >= 25000 ? 'Silver Club' : 'Standard Member';

  const allCompleted = Object.values(completedTabs).filter(Boolean).length === 4;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
      color: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #334155',
      boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '1060px',
      margin: '0 auto'
    }}>
      {/* Top Banner & Header */}
      <div style={{
        padding: '1.5rem 1.75rem',
        borderBottom: '1px solid #1e293b',
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: '#eab308',
              color: '#0f172a',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Unit 3 Fast-Track
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Sessions 1–6 (2–4 Hour Intensive Workshop Simulator)
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator color="#38bdf8" size={24} />
            Spreadsheet Core Essentials Laboratory
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.86rem' }}>
            Interactive aviation flight analytics: Master Math Formulas, $ Locking, Statistical Functions, & Logical Text Logic.
          </p>
        </div>

        {/* Platform Switcher & Completion Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            background: '#1e293b',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid #334155'
          }}>
            <button
              onClick={() => setPlatform('excel')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: platform === 'excel' ? '#107c41' : 'transparent',
                color: platform === 'excel' ? '#ffffff' : '#94a3b8',
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
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: platform === 'sheets' ? '#0f9d58' : 'transparent',
                color: platform === 'sheets' ? '#ffffff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <Globe size={14} /> Google Sheets
            </button>
          </div>

          <div style={{
            background: allCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${allCompleted ? '#10b981' : '#38bdf8'}`,
            padding: '6px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: allCompleted ? '#34d399' : '#38bdf8'
          }}>
            {allCompleted ? <Award size={16} /> : <Sparkles size={16} />}
            <span>{Object.values(completedTabs).filter(Boolean).length}/4 Completed</span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        background: '#090d16',
        borderBottom: '1px solid #1e293b'
      }}>
        {[
          { id: 'math', label: '1. Basic Math (PEMDAS)', sub: 'Session 3 · Operators & Precedence', icon: Calculator, color: '#38bdf8' },
          { id: 'referencing', label: '2. Cell Referencing ($)', sub: 'Session 4 · Relative vs Absolute', icon: Lock, color: '#eab308' },
          { id: 'stats', label: '3. Statistical Functions', sub: 'Session 5 · SUM, AVG, MAX, MIN', icon: BarChart3, color: '#a855f7' },
          { id: 'logical_text', label: '4. Logical & Text Logic', sub: 'Session 6 · IF, PROPER, CONCAT', icon: Binary, color: '#10b981' },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          const isDone = completedTabs[t.id];
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                markComplete(t.id);
              }}
              style={{
                background: isActive ? '#1e293b' : 'transparent',
                border: 'none',
                borderBottom: isActive ? `3px solid ${t.color}` : '3px solid transparent',
                padding: '1rem 1.2rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                background: isActive ? t.color : '#334155',
                color: isActive ? '#0f172a' : '#94a3b8',
                padding: '7px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{t.label}</span>
                  {isDone && <CheckCircle2 size={14} color="#10b981" />}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '2px' }}>
                  {t.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div style={{ padding: '1.75rem' }}>
        
        {/* ========================================================= */}
        {/* TAB 1: BASIC MATHEMATICAL FORMULAE (Order of Operations)  */}
        {/* ========================================================= */}
        {activeTab === 'math' && (
          <div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Module 1 · Session 3 Focus
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  Order of Operations (PEMDAS / BODMAS) in Airfare Billing
                </h3>
              </div>

              {/* Toggle Parentheses */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
                <button
                  onClick={() => setUseParentheses(true)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: useParentheses ? '#10b981' : 'transparent',
                    color: useParentheses ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <Check size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  With Parentheses: =(B3 - C3) * D3 + E3
                </button>
                <button
                  onClick={() => setUseParentheses(false)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: !useParentheses ? '#ef4444' : 'transparent',
                    color: !useParentheses ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Without Parentheses: =B3 - C3 * D3 + E3
                </button>
              </div>
            </div>

            {/* Formula Bar */}
            <div style={{
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1rem',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.92rem'
            }}>
              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 700 }}>fx</span>
              <span style={{ color: '#64748b' }}>|</span>
              {useParentheses ? (
                <span>
                  <strong style={{ color: '#f59e0b' }}>=</strong>
                  <span style={{ color: '#38bdf8' }}>(</span>
                  <span style={{ color: '#10b981' }}>B3</span>
                  <span style={{ color: '#cbd5e1' }}> - </span>
                  <span style={{ color: '#ec4899' }}>C3</span>
                  <span style={{ color: '#38bdf8' }}>)</span>
                  <span style={{ color: '#cbd5e1' }}> * </span>
                  <span style={{ color: '#a855f7' }}>D3</span>
                  <span style={{ color: '#cbd5e1' }}> + </span>
                  <span style={{ color: '#f43f5e' }}>E3</span>
                </span>
              ) : (
                <span style={{ color: '#ef4444' }}>
                  =B3 - C3 * D3 + E3 <em style={{ fontSize: '0.78rem', color: '#f87171' }}>(Critical Logic Flaw!)</em>
                </span>
              )}
            </div>

            {/* Spreadsheet Grid */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '8px 12px', width: '45px', textAlign: 'center' }}>#</th>
                    <th style={{ padding: '8px 14px' }}>A: Flight / Sector</th>
                    <th style={{ padding: '8px 14px' }}>B: Luggage (kg)</th>
                    <th style={{ padding: '8px 14px' }}>C: Free Allowance</th>
                    <th style={{ padding: '8px 14px' }}>D: Rate / Excess Kg</th>
                    <th style={{ padding: '8px 14px' }}>E: Handling Fee</th>
                    <th style={{ padding: '8px 14px', background: useParentheses ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
                      F: Total Excess Invoice (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #1e293b', background: '#090d16' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>3</td>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f8fafc' }}>
                      AI 804 (DEL ➔ IXE)
                    </td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>
                      {actualLuggage} kg
                    </td>
                    <td style={{ padding: '10px 14px', color: '#ec4899', fontWeight: 700 }}>
                      {freeAllowance} kg
                    </td>
                    <td style={{ padding: '10px 14px', color: '#a855f7', fontWeight: 700 }}>
                      ₹{ratePerKg}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#f43f5e', fontWeight: 700 }}>
                      ₹{handlingFee}
                    </td>
                    <td style={{
                      padding: '10px 14px',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: useParentheses ? '#34d399' : '#f87171',
                      background: useParentheses ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                    }}>
                      ₹{useParentheses ? calcCorrect.toLocaleString('en-IN') : calcWrong.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Luggage Slider & Step-by-Step Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1' }}>
                    Adjust Actual Luggage (Cell B3):
                  </label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>{actualLuggage} kg</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={actualLuggage}
                  onChange={(e) => setActualLuggage(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <span>15 kg (No Excess)</span>
                  <span>25 kg</span>
                  <span>40 kg (Heavy Cargo)</span>
                </div>

                <div style={{ marginTop: '1rem', padding: '10px 12px', background: '#0f172a', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  💡 <strong>Aviation Real-World Rule:</strong> Indigo & Air India charge per excess kg over 15kg. Total billing = <code>(Excess) × Rate + Airport Security Handling Fee</code>.
                </div>
              </div>

              {/* PEMDAS Execution Flow */}
              <div style={{
                background: useParentheses ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${useParentheses ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                padding: '1.25rem',
                borderRadius: '10px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: useParentheses ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {useParentheses ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {useParentheses ? 'Order of Evaluation (Correct PEMDAS)' : 'Why the Formula Failed Without Parentheses!'}
                </h4>

                {useParentheses ? (
                  <div style={{ fontSize: '0.82rem', lineHeight: '1.6', color: '#cbd5e1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Step 1</span>
                      <span><strong>Parentheses first:</strong> ({actualLuggage} - {freeAllowance}) = <strong>{excessKg} kg</strong> excess.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{ background: '#a855f7', color: '#ffffff', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Step 2</span>
                      <span><strong>Multiplication next:</strong> {excessKg} kg × ₹450 = <strong>₹{(excessKg * 450).toLocaleString('en-IN')}</strong>.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{ background: '#10b981', color: '#0f172a', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>Step 3</span>
                      <span><strong>Addition last:</strong> ₹{(excessKg * 450).toLocaleString('en-IN')} + ₹200 = <strong>₹{calcCorrect.toLocaleString('en-IN')}</strong> total.</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', lineHeight: '1.6', color: '#fca5a5' }}>
                    <div>1. Excel prioritizes <strong>* before -</strong>.</div>
                    <div>2. It calculates <code>{freeAllowance} × {ratePerKg} = ₹6,750</code> first!</div>
                    <div>3. Then it subtracts that from luggage: <code>{actualLuggage} - 6,750 + 200 = ₹{calcWrong.toLocaleString('en-IN')}</code>!</div>
                    <div style={{ marginTop: '6px', fontWeight: 700, color: '#f87171' }}>
                      Result: The airline owes the passenger ₹{Math.abs(calcWrong).toLocaleString('en-IN')} instead of charging them!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CELL REFERENCING (Absolute $ Locking)             */}
        {/* ========================================================= */}
        {activeTab === 'referencing' && (
          <div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#eab308', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Module 2 · Session 4 Focus
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  Cell Referencing: Calculating 18% Aviation GST Across Sectors
                </h3>
              </div>

              {/* Toggle Lock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsLocked(true)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: isLocked ? '#eab308' : '#1e293b',
                    color: isLocked ? '#0f172a' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Lock size={14} /> Locked: =B3 * $E$1 (Correct)
                </button>
                <button
                  onClick={() => setIsLocked(false)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: !isLocked ? '#ef4444' : '#1e293b',
                    color: !isLocked ? '#ffffff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Unlocked: =B3 * E1 (Relative Error)
                </button>
              </div>
            </div>

            {/* Reference Anchor Notice */}
            <div style={{
              background: '#1e293b',
              border: '1px solid #eab308',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              fontSize: '0.86rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#eab308', color: '#0f172a', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                  CELL $E$1
                </span>
                <span>Fixed Aviation Tax Rate: <strong>18% (0.18)</strong></span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                Keyboard Shortcut: <strong>{platform === 'excel' ? 'F4 (or Fn+F4)' : 'Cmd + Shift + F4'}</strong>
              </div>
            </div>

            {/* Multi-Row Spreadsheet Table */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '8px 12px', width: '45px', textAlign: 'center' }}>#</th>
                    <th style={{ padding: '8px 14px' }}>A: Flight Route</th>
                    <th style={{ padding: '8px 14px' }}>B: Base Fare (₹)</th>
                    <th style={{ padding: '8px 14px' }}>C: Formula Evaluated</th>
                    <th style={{ padding: '8px 14px' }}>D: GST Calculated (₹)</th>
                    <th style={{ padding: '8px 14px' }}>E: Status</th>
                  </tr>
                </thead>
                <tbody>
                  {routesData.map((r, idx) => {
                    const rowNum = r.row;
                    const refCell = isLocked ? '$E$1' : `E${idx + 1}`;
                    const isError = !isLocked && idx > 0;
                    const gstAmount = isError ? 0 : r.base * gstRate;

                    return (
                      <tr 
                        key={r.code}
                        onClick={() => setRefStep(idx)}
                        style={{
                          borderBottom: '1px solid #1e293b',
                          background: refStep === idx ? 'rgba(234, 179, 8, 0.08)' : '#090d16',
                          cursor: 'pointer'
                        }}
                      >
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{rowNum}</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.code} ({r.sector})</td>
                        <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: 700 }}>₹{r.base.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px 14px', fontFamily: 'Consolas, monospace', color: isError ? '#ef4444' : '#eab308' }}>
                          =B{rowNum} * {refCell}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 800, color: isError ? '#ef4444' : '#34d399' }}>
                          ₹{gstAmount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          {isError ? (
                            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              Shifted to Empty Cell! (₹0)
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              Locked on $E$1 (18%)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Explanation Card */}
            <div style={{ background: '#1e293b', padding: '1.2rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#eab308' }}>
                💡 Key Examination Memory Rule:
              </h4>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                The dollar symbol <code>$</code> acts like a <strong>handcuff / padlock</strong>. 
                <code>$E$1</code> locks both Column E and Row 1. When you AutoFill downwards, relative references 
                (<code>B3 ➔ B4 ➔ B5</code>) shift row by row, while <code>$E$1</code> stays firmly rooted to your tax rate.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ESSENTIAL FUNCTIONS - STATISTICAL                 */}
        {/* ========================================================= */}
        {activeTab === 'stats' && (
          <div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Module 3 · Session 5 Focus
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  Essential Statistical Functions in Daily Flight Dispatch
                </h3>
              </div>

              {/* Function Selectors */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(['SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT', 'COUNTA'] as const).map(fn => (
                  <button
                    key={fn}
                    onClick={() => setSelectedStatFunc(fn)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: selectedStatFunc === fn ? '#a855f7' : '#1e293b',
                      color: selectedStatFunc === fn ? '#ffffff' : '#94a3b8',
                      transition: 'all 0.15s'
                    }}
                  >
                    ={fn}()
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Bar with active range */}
            <div style={{
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1rem',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.92rem'
            }}>
              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 700 }}>fx</span>
              <span style={{ color: '#64748b' }}>|</span>
              <span style={{ color: '#a855f7', fontWeight: 700 }}>={selectedStatFunc}</span>
              <span style={{ color: '#38bdf8' }}>
                ({selectedStatFunc === 'MAX' ? 'D3:D7' : selectedStatFunc === 'MIN' ? 'E3:E7' : selectedStatFunc === 'COUNTA' ? 'B3:B7' : 'C3:C7'})
              </span>
            </div>

            {/* Spreadsheet Grid with Glowing Range */}
            <div style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '8px 12px', width: '45px', textAlign: 'center' }}>#</th>
                    <th style={{ padding: '8px 14px' }}>A: Flight</th>
                    <th style={{ padding: '8px 14px', background: selectedStatFunc === 'COUNTA' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}>
                      B: Route
                    </th>
                    <th style={{ padding: '8px 14px', background: ['SUM', 'AVERAGE', 'COUNT'].includes(selectedStatFunc) ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}>
                      C: Pax Count
                    </th>
                    <th style={{ padding: '8px 14px', background: selectedStatFunc === 'MAX' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}>
                      D: Cargo (kg)
                    </th>
                    <th style={{ padding: '8px 14px', background: selectedStatFunc === 'MIN' ? 'rgba(168, 85, 247, 0.2)' : 'transparent' }}>
                      E: Gate Delay (min)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flightStats.map((f, i) => (
                    <tr key={f.flight} style={{ borderBottom: '1px solid #1e293b', background: '#090d16' }}>
                      <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>{i + 3}</td>
                      <td style={{ padding: '8px 14px', fontWeight: 700, color: '#f8fafc' }}>{f.flight}</td>
                      <td style={{
                        padding: '8px 14px',
                        color: selectedStatFunc === 'COUNTA' ? '#c084fc' : '#cbd5e1',
                        fontWeight: selectedStatFunc === 'COUNTA' ? 700 : 400
                      }}>
                        {f.sector}
                      </td>
                      <td style={{
                        padding: '8px 14px',
                        color: ['SUM', 'AVERAGE', 'COUNT'].includes(selectedStatFunc) ? '#c084fc' : '#cbd5e1',
                        fontWeight: ['SUM', 'AVERAGE', 'COUNT'].includes(selectedStatFunc) ? 700 : 400
                      }}>
                        {f.pax}
                      </td>
                      <td style={{
                        padding: '8px 14px',
                        color: selectedStatFunc === 'MAX' ? '#c084fc' : '#cbd5e1',
                        fontWeight: selectedStatFunc === 'MAX' ? 700 : 400
                      }}>
                        {f.cargo.toLocaleString('en-IN')}
                      </td>
                      <td style={{
                        padding: '8px 14px',
                        color: selectedStatFunc === 'MIN' ? '#c084fc' : '#cbd5e1',
                        fontWeight: selectedStatFunc === 'MIN' ? 700 : 400
                      }}>
                        {f.delay} mins
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live Calculation Output Card */}
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '10px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase' }}>
                  Calculated Output for ={selectedStatFunc}()
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {selectedStatFunc === 'SUM' && `${totalPax} Total Passengers`}
                  {selectedStatFunc === 'AVERAGE' && `${avgPax} Pax / Flight`}
                  {selectedStatFunc === 'MAX' && `${maxCargo.toLocaleString('en-IN')} kg (Peak Cargo)`}
                  {selectedStatFunc === 'MIN' && `${minDelay} mins (Lowest Delay)`}
                  {selectedStatFunc === 'COUNT' && `${countFlights} Numeric Records Tracked`}
                  {selectedStatFunc === 'COUNTA' && `${countFlights} Non-Empty Flight Sectors`}
                </div>
              </div>

              <div style={{ fontSize: '0.84rem', color: '#cbd5e1', maxWidth: '420px', lineHeight: '1.5' }}>
                {selectedStatFunc === 'SUM' && 'Adds all numbers in the range C3:C7: (182 + 176 + 158 + 186 + 168).'}
                {selectedStatFunc === 'AVERAGE' && 'Calculates arithmetic mean: Total (870) divided by 5 flights = 174.0.'}
                {selectedStatFunc === 'MAX' && 'Finds the largest value in D3:D7 to identify the heaviest cargo flight.'}
                {selectedStatFunc === 'MIN' && 'Scans E3:E7 to spot best on-time arrival performance (0 min delay).'}
                {selectedStatFunc === 'COUNT' && 'Counts cells that contain NUMBERS only. Blank or text cells are ignored.'}
                {selectedStatFunc === 'COUNTA' && 'Counts all non-empty cells (Numbers + Text). Perfect for counting passenger names or sector codes.'}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LOGICAL AND TEXT FUNCTIONS (IF, PROPER, CONCAT)   */}
        {/* ========================================================= */}
        {activeTab === 'logical_text' && (
          <div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Module 4 · Session 6 Focus
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  Logical Decision-Making & Passenger Manifest Text Cleaning
                </h3>
              </div>

              {/* Sub-Tabs: Logical vs Text */}
              <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '3px', border: '1px solid #334155' }}>
                <button
                  onClick={() => setTextActiveTab('logical')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: textActiveTab === 'logical' ? '#10b981' : 'transparent',
                    color: textActiveTab === 'logical' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  Logical Function: =IF()
                </button>
                <button
                  onClick={() => setTextActiveTab('text')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: textActiveTab === 'text' ? '#10b981' : 'transparent',
                    color: textActiveTab === 'text' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  Text Cleaners: =PROPER, =UPPER, =LEFT
                </button>
              </div>
            </div>

            {textActiveTab === 'logical' ? (
              <div>
                {/* Formula Bar for IF */}
                <div style={{
                  background: '#090d16',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '1rem',
                  fontFamily: 'Consolas, monospace',
                  fontSize: '0.92rem'
                }}>
                  <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 700 }}>fx</span>
                  <span style={{ color: '#64748b' }}>|</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>=IF</span>
                  <span style={{ color: '#38bdf8' }}>(</span>
                  <span style={{ color: '#cbd5e1' }}>C3 &gt;= 50000, </span>
                  <span style={{ color: '#34d399' }}>&quot;★ PRIORITY LOUNGE&quot;</span>
                  <span style={{ color: '#cbd5e1' }}>, </span>
                  <span style={{ color: '#94a3b8' }}>&quot;STANDARD BOARDING&quot;</span>
                  <span style={{ color: '#38bdf8' }}>)</span>
                </div>

                {/* Interactive Miles Adjuster */}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1' }}>
                      Passenger Frequent Flyer Miles (Cell C3):
                    </label>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isPriority ? '#34d399' : '#94a3b8' }}>
                      {milesInput.toLocaleString('en-IN')} miles
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="5000"
                    value={milesInput}
                    onChange={(e) => setMilesInput(Number(e.target.value))}
                    style={{ width: '100%', accentColor: isPriority ? '#10b981' : '#94a3b8', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    <span>10,000</span>
                    <span>50,000 (Priority Threshold)</span>
                    <span>1,00,000 (Platinum)</span>
                  </div>
                </div>

                {/* Evaluation Card */}
                <div style={{
                  background: isPriority ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.08)',
                  border: `1.5px solid ${isPriority ? '#10b981' : '#475569'}`,
                  borderRadius: '10px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isPriority ? '#34d399' : '#94a3b8', textTransform: 'uppercase' }}>
                      Condition Evaluation: ({milesInput.toLocaleString('en-IN')} &gt;= 50,000) ➔ <strong>{isPriority ? 'TRUE' : 'FALSE'}</strong>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isPriority ? '#34d399' : '#e2e8f0', marginTop: '4px' }}>
                      {isPriority ? '★ PRIORITY LOUNGE ACCESS' : 'STANDARD BOARDING'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                      Nested Tier Level: <strong style={{ color: '#38bdf8' }}>{loungeTier}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', maxWidth: '380px', lineHeight: '1.5' }}>
                    An <code>IF</code> function has exactly 3 arguments:
                    <ol style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem' }}>
                      <li><strong>Logical Test:</strong> Is C3 &ge; 50000?</li>
                      <li><strong>Value If TRUE:</strong> Return &quot;PRIORITY&quot;</li>
                      <li><strong>Value If FALSE:</strong> Return &quot;STANDARD&quot;</li>
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Text Functions Lab */}
                <div style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                    Test Messy Passenger Name Entry (Cell A3):
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090d16',
                      border: '1px solid #334155',
                      color: '#38bdf8',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.95rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Type messy text with spaces e.g.  ananya   sharma  "
                  />
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                    Type your own mixed-case or spaced text above to watch the spreadsheet sanitation pipeline execute live!
                  </div>
                </div>

                {/* Function Output Showcase */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  
                  {/* PROPER + TRIM */}
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                      =PROPER(TRIM(A3))
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
                      &quot;{cleanedProper}&quot;
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      <strong>TRIM</strong> strips accidental leading/trailing spaces; <strong>PROPER</strong> capitalizes the first letter of each word.
                    </div>
                  </div>

                  {/* UPPER */}
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                      =UPPER(&quot;del-ixe-804&quot;)
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
                      &quot;{upperCode}&quot;
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Standardizes lower-case airport or route codes into official IATA capital letters.
                    </div>
                  </div>

                  {/* LEFT / RIGHT */}
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#eab308', textTransform: 'uppercase' }}>
                      =LEFT(B3, 3) &amp; =RIGHT(B3, 3)
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
                      Origin: {originCode} | Dest: {destCode}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      Extracts starting 3 characters (Origin airport) and trailing 3 characters (Destination airport).
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Workshop Summary Footer Bar */}
      <div style={{
        background: '#090d16',
        padding: '1.25rem 1.75rem',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
          🎓 <strong>2–4 Hour Workshop Goal:</strong> Seamlessly transition from raw data entry to automated, error-free flight analytics.
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab !== 'logical_text' ? (
            <button
              onClick={() => {
                if (activeTab === 'math') { setActiveTab('referencing'); markComplete('referencing'); }
                else if (activeTab === 'referencing') { setActiveTab('stats'); markComplete('stats'); }
                else if (activeTab === 'stats') { setActiveTab('logical_text'); markComplete('logical_text'); }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              Next Module <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTab('math');
                markComplete('logical_text');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} /> Review From Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
