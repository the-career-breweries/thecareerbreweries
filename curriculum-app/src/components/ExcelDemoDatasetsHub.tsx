'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileSpreadsheet, Copy, Download, Search, Check, 
  ExternalLink, Sparkles, BookOpen, Layers, Filter, 
  BarChart3, PieChart, Table, ArrowUpDown, HelpCircle, 
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
  RefreshCw, Terminal, Eye, Code, Zap
} from 'lucide-react';
import { 
  COMPUTING_DEMO_DATASETS, 
  DemoDataset, 
  TeacherFormulaGuide, 
  PivotExerciseGuide 
} from '@/data/computing-demo-datasets';

export default function ExcelDemoDatasetsHub() {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('functions-math');
  const [showFormulas, setShowFormulas] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [expandedGuideIndex, setExpandedGuideIndex] = useState<number | null>(0);
  
  // Interactive Pivot Simulator State (for tab 5)
  const [activePivotRecipe, setActivePivotRecipe] = useState<number>(0);

  const activeDataset = useMemo(() => {
    return COMPUTING_DEMO_DATASETS.find(d => d.id === selectedDatasetId) || COMPUTING_DEMO_DATASETS[0];
  }, [selectedDatasetId]);

  // Filtered rows for active dataset
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return activeDataset.rows;
    const q = searchQuery.toLowerCase();
    return activeDataset.rows.filter(row => {
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(q)
      );
    });
  }, [activeDataset, searchQuery]);

  // Copy to clipboard helper
  const copyToClipboard = async (text: string, key: string, toastMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setCopyToast(toastMsg);
      setTimeout(() => setCopiedKey(null), 2500);
      setTimeout(() => setCopyToast(null), 3500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  // Generate TSV string for instant copy-paste into Excel/Sheets
  const generateTSV = (dataset: DemoDataset): string => {
    const headers = dataset.columns.map(c => c.header).join('\t');
    const rows = dataset.rows.map((row, idx) => {
      return dataset.columns.map(col => {
        const val = row[col.key];
        // If showing formulas and it's a formula column, output formula or sample formula
        if (col.type === 'formula') {
          if (dataset.id === 'functions-math' && col.key === 'revenue_inr') {
            return `=D${idx + 2}*F${idx + 2}`;
          }
          if (dataset.id === 'logical-if' && col.key === 'compensation_due') {
            return `=IF(E${idx + 2}>=4, 5000, 0)`;
          }
          if (dataset.id === 'logical-if' && col.key === 'loyalty_status') {
            return `=IF(D${idx + 2}>=100000, "Platinum Elite", IF(D${idx + 2}>=50000, "Gold Wing", IF(D${idx + 2}>=25000, "Silver Crest", "Blue Base")))`;
          }
          if (dataset.id === 'logical-if' && col.key === 'lounge_access') {
            return `=IF(OR(H${idx + 2}="Platinum Elite", H${idx + 2}="Gold Wing"), "YES", "NO")`;
          }
          if (dataset.id === 'vlookup-hlookup' && col.key === 'dest_city') {
            return `=VLOOKUP(B${idx + 2}, $I$2:$L$8, 2, FALSE)`;
          }
          if (dataset.id === 'vlookup-hlookup' && col.key === 'distance_km') {
            return `=VLOOKUP(B${idx + 2}, $I$2:$L$8, 3, FALSE)`;
          }
          if (dataset.id === 'vlookup-hlookup' && col.key === 'rate_per_kg') {
            return `=VLOOKUP(E${idx + 2}, $N$2:$P$6, 2, TRUE)`;
          }
          if (dataset.id === 'vlookup-hlookup' && col.key === 'total_freight_inr') {
            return `=(E${idx + 2}*F${idx + 2})+VLOOKUP(B${idx + 2}, $I$2:$L$8, 4, FALSE)`;
          }
          if (dataset.id === 'xlookup-advanced' && col.key === 'staff_name') {
            return `=XLOOKUP(A${idx + 2}, $H$2:$H$9, $I$2:$I$9)`;
          }
          if (dataset.id === 'xlookup-advanced' && col.key === 'role') {
            return `=XLOOKUP(A${idx + 2}, $H$2:$H$9, $J$2:$J$9)`;
          }
          if (dataset.id === 'xlookup-advanced' && col.key === 'aircraft_tail') {
            return `=XLOOKUP(B${idx + 2}, $M$2:$M$8, $L$2:$L$8, "STANDBY")`;
          }
          if (dataset.id === 'xlookup-advanced' && col.key === 'snag_status') {
            return `=XLOOKUP(B${idx + 2}, $M$2:$M$8, $N$2:$N$8, "NO ACTIVE SNAG")`;
          }
        }
        return val !== undefined ? String(val) : '';
      }).join('\t');
    }).join('\n');

    let extraSections = '';
    // Append lookup reference tables for Sheet 3 & 4
    if (dataset.lookupTables && dataset.lookupTables.length > 0) {
      extraSections += '\n\n';
      dataset.lookupTables.forEach(t => {
        extraSections += `\n[REFERENCE TABLE: ${t.title} (${t.range})]\n`;
        extraSections += t.columns.map(c => c.header).join('\t') + '\n';
        extraSections += t.rows.map(r => t.columns.map(c => r[c.key] !== undefined ? String(r[c.key]) : '').join('\t')).join('\n') + '\n';
      });
    }

    if (dataset.horizontalTable) {
      extraSections += `\n[HORIZONTAL REFERENCE TABLE: ${dataset.horizontalTable.title} (${dataset.horizontalTable.range})]\n`;
      extraSections += dataset.horizontalTable.matrix.map(row => row.join('\t')).join('\n') + '\n';
    }

    return `${headers}\n${rows}${extraSections}`;
  };

  // Copy all teacher demonstration formulas
  const copyFormulaCheatsheet = (dataset: DemoDataset) => {
    const text = [
      `=== TEACHER FORMULA DEMONSTRATION SCRIPT: ${dataset.title} ===`,
      `Topic: ${dataset.topic}`,
      `File: ${dataset.filename}`,
      '',
      ...dataset.teacherGuides.map((g, i) => {
        return [
          `${i + 1}. ${g.title} [Target Cell: ${g.targetCell}]`,
          `   Formula: ${g.formula}`,
          `   Logic: ${g.plainEnglishExplanation}`,
          `   Aviation Context: ${g.aviationContext}`,
          `   Expected Output: ${g.expectedResult}`,
          `   Common Student Mistake: ${g.commonStudentMistake}`,
          ''
        ].join('\n');
      })
    ].join('\n');

    copyToClipboard(text, 'cheatsheet', 'Formula Demonstration Script copied to clipboard!');
  };

  // Download CSV trigger
  const handleDownloadCSV = (dataset: DemoDataset) => {
    const link = document.createElement('a');
    link.href = `/sample-data/${dataset.filename}`;
    link.download = dataset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Instructions TXT trigger
  const handleDownloadInstructions = () => {
    const link = document.createElement('a');
    link.href = `/sample-data/README_Trainer_Demonstration_Instructions.txt`;
    link.download = `README_Trainer_Demonstration_Instructions.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pivot Table Interactive Aggregation calculations for Tab 5
  const pivotCalculations = useMemo(() => {
    if (activeDataset.id !== 'pivot-table-charts') return null;

    const rows = activeDataset.rows;
    const airlines = ['IndiGo', 'Air India', 'Akasa Air', 'Vistara', 'SpiceJet'];
    
    // Recipe 1: Pax by Airline & Terminal
    const paxByAirlineTerminal: Record<string, { T1: number; T2: number; total: number }> = {};
    airlines.forEach(a => {
      paxByAirlineTerminal[a] = { T1: 0, T2: 0, total: 0 };
    });
    rows.forEach(r => {
      const a = String(r.airline);
      const t = String(r.terminal);
      const pax = Number(r.pax_booked) || 0;
      if (paxByAirlineTerminal[a]) {
        if (t === 'T1') paxByAirlineTerminal[a].T1 += pax;
        if (t === 'T2') paxByAirlineTerminal[a].T2 += pax;
        paxByAirlineTerminal[a].total += pax;
      }
    });

    // Recipe 2: On-Time Performance Count
    const statusByAirline: Record<string, { onTime: number; delayed: number; cancelled: number; total: number }> = {};
    airlines.forEach(a => {
      statusByAirline[a] = { onTime: 0, delayed: 0, cancelled: 0, total: 0 };
    });
    rows.forEach(r => {
      const a = String(r.airline);
      const s = String(r.status);
      if (statusByAirline[a]) {
        if (s === 'On-Time') statusByAirline[a].onTime += 1;
        if (s === 'Delayed') statusByAirline[a].delayed += 1;
        if (s === 'Cancelled') statusByAirline[a].cancelled += 1;
        statusByAirline[a].total += 1;
      }
    });

    // Recipe 3: Delay Root Causes
    const delayReasons: Record<string, { count: number; totalMins: number; avgMins: number }> = {};
    rows.forEach(r => {
      const reason = String(r.delay_reason);
      if (reason !== 'None') {
        const mins = Number(r.delay_mins) || 0;
        if (!delayReasons[reason]) {
          delayReasons[reason] = { count: 0, totalMins: 0, avgMins: 0 };
        }
        delayReasons[reason].count += 1;
        delayReasons[reason].totalMins += mins;
      }
    });
    Object.keys(delayReasons).forEach(k => {
      delayReasons[k].avgMins = Math.round(delayReasons[k].totalMins / delayReasons[k].count);
    });

    return {
      paxByAirlineTerminal,
      statusByAirline,
      delayReasons
    };
  }, [activeDataset]);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Toast Notification */}
      {copyToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontWeight: 600,
          fontSize: '0.9rem',
          animation: 'slideUp 0.3s ease'
        }}>
          <CheckCircle2 size={18} />
          {copyToast}
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Unit 3 Laboratory Hub
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Course Code: Z7AVA 26209 · B.Sc &amp; BBA Aviation
              </span>
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileSpreadsheet size={28} color="#38bdf8" />
              Spreadsheet Demonstration Datasets &amp; Master Workbooks
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.92rem', maxWidth: '780px', lineHeight: '1.5' }}>
              Official interactive aviation datasets for classroom demonstration in <strong>Microsoft Excel</strong> and <strong>Google Sheets</strong>. 
              Click to view, copy formatted tables directly to your clipboard, or download pre-built CSV files to work along with students.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <a
              href="/api/download-sample-datasets"
              download="Aviation_ICS_Student_Practice_Datasets_Batch2026.zip"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s'
              }}
              title="Download all 5 CSV datasets in a single ZIP bundle to share in student WhatsApp/Teams group"
            >
              <Download size={16} /> 📦 Download All Files (.ZIP) for Student Group
            </a>
            <button
              onClick={handleDownloadInstructions}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              title="Download teacher lesson plan and formula cheat sheet"
            >
              <BookOpen size={16} /> Teacher Demo Guide (TXT)
            </button>
            <Link
              href="/simulators/excel-core-workshop"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={16} /> 2–4 Hr Workshop Lab
            </Link>
          </div>
        </div>

        {/* Dataset Tabs */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {COMPUTING_DEMO_DATASETS.map((ds) => {
            const isActive = ds.id === selectedDatasetId;
            return (
              <button
                key={ds.id}
                onClick={() => {
                  setSelectedDatasetId(ds.id);
                  setSearchQuery('');
                  setExpandedGuideIndex(0);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {ds.category === 'functions_math' && <span style={{ fontSize: '1rem' }}>🧮</span>}
                {ds.category === 'logical_if' && <span style={{ fontSize: '1rem' }}>⚖️</span>}
                {ds.category === 'vlookup_hlookup' && <span style={{ fontSize: '1rem' }}>🔍</span>}
                {ds.category === 'xlookup_advanced' && <span style={{ fontSize: '1rem' }}>🚀</span>}
                {ds.category === 'pivot_table_charts' && <span style={{ fontSize: '1rem' }}>📊</span>}
                <span>{ds.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Dataset Description & Action Bar */}
      <div style={{
        background: '#0b1120',
        border: '1px solid #1e293b',
        borderRadius: '14px',
        padding: '1.5rem',
        marginBottom: '1.75rem'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {activeDataset.topic}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                {activeDataset.rows.length} Active Records · Ready for Excel / Sheets
              </span>
            </div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', color: '#f8fafc', fontWeight: 700 }}>
              {activeDataset.subtitle}
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5' }}>
              {activeDataset.scenarioDescription}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={() => {
                const tsv = generateTSV(activeDataset);
                copyToClipboard(tsv, 'table', `Copied ${activeDataset.rows.length} rows to clipboard! Ready to paste into Excel (Ctrl+V)`);
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              {copiedKey === 'table' ? <Check size={16} /> : <Copy size={16} />}
              {copiedKey === 'table' ? 'Copied Table!' : 'Copy Table for Excel / Sheets'}
            </button>

            <button
              onClick={() => handleDownloadCSV(activeDataset)}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s'
              }}
              title={`Download ${activeDataset.filename} to share with students`}
            >
              <Download size={16} /> Download Sample File (.csv)
            </button>

            <button
              onClick={() => copyFormulaCheatsheet(activeDataset)}
              style={{
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                color: '#eab308',
                padding: '9px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              title="Copy teacher demonstration formulas and keystroke instructions"
            >
              {copiedKey === 'cheatsheet' ? <Check size={16} /> : <Code size={16} />}
              {copiedKey === 'cheatsheet' ? 'Copied Script!' : 'Formula Script'}
            </button>
          </div>
        </div>

        {/* Student Group File Sharing Callout */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid #10b981',
          borderRadius: '10px',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#047857',
              color: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Send this file to your Student WhatsApp / Teams Group:</span>
                <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                  {activeDataset.filename}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                Students can open this .CSV directly in Excel or Google Sheets to follow along with your live lecture.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleDownloadCSV(activeDataset)}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Download size={14} /> Download This File (.csv)
            </button>
            <a
              href="/api/download-sample-datasets"
              download="Aviation_ICS_Student_Practice_Datasets_Batch2026.zip"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📦 Download All 5 (.zip)
            </a>
          </div>
        </div>

        {/* View Controls & Filter Search */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '1rem',
          borderTop: '1px solid #1e293b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Cell Display:</span>
            <button
              onClick={() => setShowFormulas(false)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: !showFormulas ? '1px solid #38bdf8' : '1px solid #334155',
                background: !showFormulas ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: !showFormulas ? '#38bdf8' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Computed Values
            </button>
            <button
              onClick={() => setShowFormulas(true)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: showFormulas ? '1px solid #eab308' : '1px solid #334155',
                background: showFormulas ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
                color: showFormulas ? '#eab308' : '#94a3b8',
                cursor: 'pointer'
              }}
            >
              Excel Formulas (=)
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Filter current table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 32px',
                background: '#090d16',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Grid View + Teacher Guide Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px', marginBottom: '2.5rem' }}>
        
        {/* Left Column: Spreadsheet Grid */}
        <div>
          <div style={{
            background: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            {/* Grid Header Info */}
            <div style={{
              background: '#0f172a',
              padding: '10px 16px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Table size={14} color="#38bdf8" />
                Sheet 1: <strong>{activeDataset.filename.replace('.csv', '')}</strong>
              </span>
              <span>Showing {filteredRows.length} of {activeDataset.rows.length} rows</span>
            </div>

            {/* Scrollable Spreadsheet Table */}
            <div style={{ overflowX: 'auto', maxHeight: '520px', overflowY: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.82rem',
                textAlign: 'left',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
              }}>
                <thead>
                  <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155' }}>
                    <th style={{
                      padding: '8px 10px',
                      color: '#94a3b8',
                      textAlign: 'center',
                      width: '40px',
                      borderRight: '1px solid #334155',
                      fontWeight: 600
                    }}>
                      #
                    </th>
                    {activeDataset.columns.map((col) => (
                      <th
                        key={col.key}
                        style={{
                          padding: '8px 12px',
                          color: '#f8fafc',
                          borderRight: '1px solid #334155',
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            background: '#334155',
                            color: '#38bdf8',
                            fontSize: '0.68rem',
                            padding: '1px 5px',
                            borderRadius: '3px'
                          }}>
                            {col.excelCol}
                          </span>
                          <span>{col.header}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, rowIdx) => {
                    const rowNumber = rowIdx + 2; // Row 1 is header
                    const isEven = rowIdx % 2 === 0;
                    return (
                      <tr 
                        key={rowIdx}
                        style={{
                          background: isEven ? '#0b1120' : '#0f172a',
                          borderBottom: '1px solid #1e293b',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = isEven ? '#0b1120' : '#0f172a'}
                      >
                        <td style={{
                          padding: '7px 8px',
                          color: '#64748b',
                          textAlign: 'center',
                          borderRight: '1px solid #1e293b',
                          fontSize: '0.75rem',
                          background: '#090d16'
                        }}>
                          {rowNumber}
                        </td>
                        {activeDataset.columns.map((col) => {
                          let displayVal = row[col.key];

                          // If showing formula mode
                          if (showFormulas && col.type === 'formula') {
                            if (activeDataset.id === 'functions-math' && col.key === 'revenue_inr') {
                              displayVal = `=D${rowNumber}*F${rowNumber}`;
                            } else if (activeDataset.id === 'logical-if' && col.key === 'compensation_due') {
                              displayVal = `=IF(E${rowNumber}>=4, 5000, 0)`;
                            } else if (activeDataset.id === 'logical-if' && col.key === 'loyalty_status') {
                              displayVal = `=IF(D${rowNumber}>=100000,"Platinum",...)`;
                            } else if (activeDataset.id === 'logical-if' && col.key === 'lounge_access') {
                              displayVal = `=IF(OR(H${rowNumber}="Platinum",...), "YES", "NO")`;
                            } else if (activeDataset.id === 'vlookup-hlookup' && col.key === 'dest_city') {
                              displayVal = `=VLOOKUP(B${rowNumber}, $I$2:$L$8, 2, FALSE)`;
                            } else if (activeDataset.id === 'vlookup-hlookup' && col.key === 'distance_km') {
                              displayVal = `=VLOOKUP(B${rowNumber}, $I$2:$L$8, 3, FALSE)`;
                            } else if (activeDataset.id === 'vlookup-hlookup' && col.key === 'rate_per_kg') {
                              displayVal = `=VLOOKUP(E${rowNumber}, $N$2:$P$6, 2, TRUE)`;
                            } else if (activeDataset.id === 'vlookup-hlookup' && col.key === 'total_freight_inr') {
                              displayVal = `=(E${rowNumber}*F${rowNumber})+VLOOKUP(...)`;
                            } else if (activeDataset.id === 'xlookup-advanced' && col.key === 'staff_name') {
                              displayVal = `=XLOOKUP(A${rowNumber}, $H$2:$H$9, $I$2:$I$9)`;
                            } else if (activeDataset.id === 'xlookup-advanced' && col.key === 'aircraft_tail') {
                              displayVal = `=XLOOKUP(B${rowNumber}, $M$2:$M$8, $L$2:$L$8)`;
                            } else if (activeDataset.id === 'xlookup-advanced' && col.key === 'snag_status') {
                              displayVal = `=XLOOKUP(B${rowNumber}, $M$2:$M$8, $N$2:$N$8, "NO SNAG")`;
                            }
                          }

                          // Currency formatting in normal view
                          if (!showFormulas && col.type === 'currency' && typeof displayVal === 'number') {
                            displayVal = '₹' + displayVal.toLocaleString('en-IN');
                          } else if (!showFormulas && col.type === 'formula' && typeof displayVal === 'number') {
                            displayVal = '₹' + displayVal.toLocaleString('en-IN');
                          }

                          return (
                            <td
                              key={col.key}
                              style={{
                                padding: '7px 12px',
                                borderRight: '1px solid #1e293b',
                                color: col.type === 'formula' ? '#38bdf8' : '#e2e8f0',
                                fontWeight: col.type === 'formula' ? 600 : 400,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {displayVal !== undefined ? String(displayVal) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Range Formula Bar summary (for Dataset 1) */}
            {activeDataset.id === 'functions-math' && (
              <div style={{
                background: '#090d16',
                borderTop: '2px solid #334155',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '0.8rem'
              }}>
                <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Total Station Passengers (D14)</div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>=SUM(D2:D13) ➔ 2,252 Pax</div>
                </div>
                <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Average Flight Load (D15)</div>
                  <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem' }}>=AVERAGE(D2:D13) ➔ 187.67</div>
                </div>
                <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Max Baggage Load (E14)</div>
                  <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem' }}>=MAX(E2:E13) ➔ 5,820 kg</div>
                </div>
                <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Widebody Revenue (G14)</div>
                  <div style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.95rem' }}>=SUMIF(C2:C13,...) ➔ ₹57,71,800</div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Reference Tables for VLOOKUP (Tab 3) & XLOOKUP (Tab 4) */}
          {activeDataset.lookupTables && activeDataset.lookupTables.length > 0 && (
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {activeDataset.lookupTables.map((table, tIdx) => (
                <div 
                  key={tIdx}
                  style={{
                    background: '#0b1120',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '1rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>
                      {table.title}
                    </h4>
                    <span style={{
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#eab308',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Range: {table.range}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {table.description}
                  </p>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: 'Consolas, monospace' }}>
                      <thead>
                        <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                          {table.columns.map(c => (
                            <th key={c.key} style={{ padding: '6px 8px', color: '#cbd5e1', textAlign: 'left' }}>
                              <span style={{ color: '#38bdf8', marginRight: '4px' }}>{c.excelCol}:</span>
                              {c.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((r, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid #1e293b' }}>
                            {table.columns.map(c => (
                              <td key={c.key} style={{ padding: '5px 8px', color: '#e2e8f0' }}>
                                {r[c.key] !== undefined ? String(r[c.key]) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Horizontal Reference Table for HLOOKUP (Tab 3) */}
          {activeDataset.horizontalTable && (
            <div style={{
              marginTop: '1.5rem',
              background: '#0b1120',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>
                  {activeDataset.horizontalTable.title}
                </h4>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  Range: {activeDataset.horizontalTable.range}
                </span>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                {activeDataset.horizontalTable.description}
              </p>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: 'Consolas, monospace' }}>
                  <tbody>
                    {activeDataset.horizontalTable.matrix.map((rowArr, rowIdx) => (
                      <tr key={rowIdx} style={{ borderBottom: '1px solid #1e293b', background: rowIdx === 0 ? '#1e293b' : 'transparent' }}>
                        <td style={{ padding: '6px 10px', color: '#94a3b8', fontWeight: 700, width: '160px', borderRight: '1px solid #334155' }}>
                          Row {rowIdx + 11}
                        </td>
                        {rowArr.map((cell, colIdx) => (
                          <td key={colIdx} style={{ padding: '6px 12px', color: rowIdx === 0 ? '#38bdf8' : '#f8fafc', borderRight: '1px solid #1e293b', fontWeight: rowIdx === 0 ? 700 : 400 }}>
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interactive Pivot Table Recipe Simulator (For Tab 5) */}
          {activeDataset.id === 'pivot-table-charts' && pivotCalculations && (
            <div style={{
              marginTop: '1.75rem',
              background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
              border: '1.5px solid #0284c7',
              borderRadius: '14px',
              padding: '1.5rem',
              boxShadow: '0 8px 30px rgba(2, 132, 199, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    Live Class Simulator
                  </span>
                  <h3 style={{ margin: '6px 0 2px 0', color: '#f8fafc', fontSize: '1.25rem', fontWeight: 800 }}>
                    Interactive Pivot Table &amp; Pivot Chart Builder
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                    Select an executive operational question to see the exact Drag-and-Drop field mapping and chart output.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeDataset.pivotGuides?.map((guide, gIdx) => (
                    <button
                      key={gIdx}
                      onClick={() => setActivePivotRecipe(gIdx)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: activePivotRecipe === gIdx ? '1.5px solid #38bdf8' : '1px solid #334155',
                        background: activePivotRecipe === gIdx ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                        color: activePivotRecipe === gIdx ? '#38bdf8' : '#94a3b8',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Recipe {gIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipe Layout Walkthrough */}
              {activeDataset.pivotGuides && activeDataset.pivotGuides[activePivotRecipe] && (
                <div>
                  <div style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.25rem'
                  }}>
                    <h4 style={{ margin: '0 0 6px 0', color: '#38bdf8', fontSize: '0.95rem' }}>
                      {activeDataset.pivotGuides[activePivotRecipe].title}
                    </h4>
                    <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      {activeDataset.pivotGuides[activePivotRecipe].objective}
                    </p>

                    {/* 4 Drag & Drop Buckets */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>FILTERS</div>
                        <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>
                          {activeDataset.pivotGuides[activePivotRecipe].filters?.join(', ') || '(None)'}
                        </div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>COLUMNS</div>
                        <div style={{ color: '#a855f7', fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>
                          {activeDataset.pivotGuides[activePivotRecipe].columns.join(', ') || '(None)'}
                        </div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>ROWS</div>
                        <div style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>
                          {activeDataset.pivotGuides[activePivotRecipe].rows.join(', ')}
                        </div>
                      </div>
                      <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>VALUES (Σ)</div>
                        <div style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem', marginTop: '2px' }}>
                          {activeDataset.pivotGuides[activePivotRecipe].values.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Pivot Table Result View */}
                  {activePivotRecipe === 0 && (
                    <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                          Generated Pivot Table: Total Passengers Booked by Airline &amp; Terminal
                        </span>
                        <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                          Chart: Clustered Column
                        </span>
                      </div>
                      
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', fontFamily: 'Consolas, monospace' }}>
                        <thead>
                          <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '8px 10px', color: '#f8fafc' }}>Row Labels (Airline)</th>
                            <th style={{ padding: '8px 10px', color: '#38bdf8', textAlign: 'right' }}>Terminal 1 (T1)</th>
                            <th style={{ padding: '8px 10px', color: '#38bdf8', textAlign: 'right' }}>Terminal 2 (T2)</th>
                            <th style={{ padding: '8px 10px', color: '#10b981', textAlign: 'right' }}>Grand Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(pivotCalculations.paxByAirlineTerminal).map(([airline, data], idx) => (
                            <tr key={airline} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : '#0f172a' }}>
                              <td style={{ padding: '7px 10px', color: '#e2e8f0', fontWeight: 600 }}>{airline}</td>
                              <td style={{ padding: '7px 10px', color: '#cbd5e1', textAlign: 'right' }}>{data.T1.toLocaleString()}</td>
                              <td style={{ padding: '7px 10px', color: '#cbd5e1', textAlign: 'right' }}>{data.T2.toLocaleString()}</td>
                              <td style={{ padding: '7px 10px', color: '#10b981', textAlign: 'right', fontWeight: 700 }}>{data.total.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activePivotRecipe === 1 && (
                    <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                          Generated Pivot Table: Flight Count by Status &amp; Airline
                        </span>
                        <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                          Chart: 100% Stacked Bar
                        </span>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', fontFamily: 'Consolas, monospace' }}>
                        <thead>
                          <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '8px 10px', color: '#f8fafc' }}>Airline</th>
                            <th style={{ padding: '8px 10px', color: '#10b981', textAlign: 'center' }}>On-Time</th>
                            <th style={{ padding: '8px 10px', color: '#f59e0b', textAlign: 'center' }}>Delayed</th>
                            <th style={{ padding: '8px 10px', color: '#ef4444', textAlign: 'center' }}>Cancelled</th>
                            <th style={{ padding: '8px 10px', color: '#38bdf8', textAlign: 'right' }}>Total Departures</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(pivotCalculations.statusByAirline).map(([airline, data], idx) => (
                            <tr key={airline} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : '#0f172a' }}>
                              <td style={{ padding: '7px 10px', color: '#e2e8f0', fontWeight: 600 }}>{airline}</td>
                              <td style={{ padding: '7px 10px', color: '#10b981', textAlign: 'center', fontWeight: 600 }}>{data.onTime}</td>
                              <td style={{ padding: '7px 10px', color: '#f59e0b', textAlign: 'center', fontWeight: 600 }}>{data.delayed}</td>
                              <td style={{ padding: '7px 10px', color: '#ef4444', textAlign: 'center', fontWeight: 600 }}>{data.cancelled}</td>
                              <td style={{ padding: '7px 10px', color: '#38bdf8', textAlign: 'right', fontWeight: 700 }}>{data.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activePivotRecipe >= 2 && (
                    <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                          Generated Pivot Table: Average Delay Minutes by Root-Cause Reason
                        </span>
                        <span style={{ color: '#38bdf8', fontSize: '0.78rem', fontWeight: 600 }}>
                          Chart: Pareto Horizontal Bar
                        </span>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left', fontFamily: 'Consolas, monospace' }}>
                        <thead>
                          <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                            <th style={{ padding: '8px 10px', color: '#f8fafc' }}>Delay Reason</th>
                            <th style={{ padding: '8px 10px', color: '#38bdf8', textAlign: 'center' }}>Affected Flights</th>
                            <th style={{ padding: '8px 10px', color: '#f59e0b', textAlign: 'right' }}>Avg Delay (Mins)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(pivotCalculations.delayReasons).map(([reason, data], idx) => (
                            <tr key={reason} style={{ borderBottom: '1px solid #1e293b', background: idx % 2 === 0 ? 'transparent' : '#0f172a' }}>
                              <td style={{ padding: '7px 10px', color: '#e2e8f0', fontWeight: 600 }}>{reason}</td>
                              <td style={{ padding: '7px 10px', color: '#38bdf8', textAlign: 'center' }}>{data.count}</td>
                              <td style={{ padding: '7px 10px', color: '#f59e0b', textAlign: 'right', fontWeight: 700 }}>{data.avgMins} mins</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Teacher Demonstration Walkthrough Sidebar */}
        <div>
          <div style={{
            background: '#0b1120',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '1.25rem',
            position: 'sticky',
            top: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#eab308" />
                Teacher Demo Walkthrough
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {activeDataset.teacherGuides.length} Formula Exercises
              </span>
            </div>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
              Step-by-step instructions for demonstrating in front of the class. Click any exercise to expand the formula mechanics and common student traps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
              {activeDataset.teacherGuides.map((guide, gIdx) => {
                const isExpanded = expandedGuideIndex === gIdx;
                return (
                  <div
                    key={gIdx}
                    style={{
                      background: isExpanded ? 'rgba(56, 189, 248, 0.08)' : '#0f172a',
                      border: isExpanded ? '1px solid #38bdf8' : '1px solid #1e293b',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div
                      onClick={() => setExpandedGuideIndex(isExpanded ? null : gIdx)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: isExpanded ? '#38bdf8' : '#334155',
                          color: isExpanded ? '#0f172a' : '#cbd5e1',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {gIdx + 1}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isExpanded ? '#38bdf8' : '#e2e8f0' }}>
                          {guide.title}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={14} color="#38bdf8" /> : <ChevronDown size={14} color="#64748b" />}
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 12px 12px 12px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <div style={{
                          background: '#090d16',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontFamily: 'Consolas, monospace',
                          color: '#38bdf8',
                          marginBottom: '8px',
                          border: '1px solid #1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px'
                        }}>
                          <span style={{ overflowX: 'auto' }}>{guide.formula}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(guide.formula, `f-${gIdx}`, `Formula copied: ${guide.formula}`);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                            title="Copy formula"
                          >
                            {copiedKey === `f-${gIdx}` ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div style={{ marginBottom: '6px' }}>
                          <strong style={{ color: '#f8fafc' }}>Target: </strong>
                          <span style={{ color: '#eab308', fontWeight: 600 }}>Cell {guide.targetCell}</span>
                        </div>

                        <div style={{ marginBottom: '6px' }}>
                          <strong style={{ color: '#f8fafc' }}>Plain English: </strong>
                          <span>{guide.plainEnglishExplanation}</span>
                        </div>

                        <div style={{ marginBottom: '6px' }}>
                          <strong style={{ color: '#f8fafc' }}>Aviation Context: </strong>
                          <span style={{ color: '#94a3b8' }}>{guide.aviationContext}</span>
                        </div>

                        <div style={{ marginBottom: '6px' }}>
                          <strong style={{ color: '#f8fafc' }}>Expected: </strong>
                          <span style={{ color: '#10b981', fontWeight: 600 }}>{guide.expectedResult}</span>
                        </div>

                        <div style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          marginTop: '8px',
                          color: '#fca5a5',
                          fontSize: '0.74rem'
                        }}>
                          <strong style={{ color: '#ef4444' }}>⚠️ Student Pitfall: </strong>
                          {guide.commonStudentMistake}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
