"use client";

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { curriculumDataComputing as curriculumData, WeekData } from '@/data/curriculum-computing';
import { Search, Loader2, Sparkles, Sun, Moon, BookOpen, GraduationCap, LayoutDashboard, ChevronRight, Users, RotateCcw, Menu, FileText, FileSpreadsheet, Download } from 'lucide-react';
import SlideViewer from '@/components/SlideViewer';
import NotesTemplate from '@/components/NotesTemplate';
import WelcomeScreen from '@/components/WelcomeScreen';

const computingUnitSummaries: Record<number, { unit: number; title: string; focus: string; lastWeek: number }> = {
  1: {
    unit: 1,
    title: 'Introduction to Computers & OS',
    focus: 'Consolidated revision notes & question bank covering Computer Hardware, Software, Windows 11 Navigation, and File Organization (Sessions 1–5).',
    lastWeek: 5
  },
  2: {
    unit: 2,
    title: 'Microsoft Word Proficiency',
    focus: 'Consolidated revision notes & question bank covering Document Creation, Typography, Tables, Styles, Layout, and Mail Merge (Sessions 6–10).',
    lastWeek: 10
  },
  3: {
    unit: 3,
    title: 'Microsoft Excel & Data Analysis',
    focus: 'Consolidated revision notes & question bank covering Workbooks, Cell Referencing, Formulas, Statistical Functions, Charts, and Printing (Sessions 11–20).',
    lastWeek: 20
  },
  4: {
    unit: 4,
    title: 'Microsoft PowerPoint Presentation',
    focus: 'Consolidated revision notes & question bank covering Slide Layouts, Themes, Slide Master, Visuals, Transitions, and Presenter View (Sessions 21–25).',
    lastWeek: 25
  },
  5: {
    unit: 5,
    title: 'Internet, Email & Digital Workplace',
    focus: 'Consolidated revision notes & question bank covering Web Browsing, Professional Emailing, Cloud Storage, Cyber Safety, and Collaboration Tools (Sessions 26–30).',
    lastWeek: 30
  }
};

export default function CommunicativeEnglishApp() {
  const [program, setProgram] = useState<'ug' | 'pg'>('ug');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const semesters = [1]; // Only Semester 1 for now

  // Dynamically load streams based on program
  const streams = curriculumData[program].streams.filter(s => s.streamName.includes('B.Sc'));
  const [selectedStream, setSelectedStream] = useState<string>(streams.length > 0 ? streams[0].streamName : '');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [showOrientation, setShowOrientation] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>('');
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Default to light theme for LMS style
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Real-time search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, link: string, snippet: string}[] | null>(null);

  // Active Lesson State
  const [activeLesson, setActiveLesson] = useState<WeekData | null>(null);
  const [activeNotesLesson, setActiveNotesLesson] = useState<WeekData | null>(null);

  // Section Tracking State
  const SECTIONS = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];
    const [activeSection, setActiveSection] = useState<string>('Default');
    const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});
    const [sessionProgress, setSessionProgress] = useState<Record<number, number>>({});

    useEffect(() => {
      const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];
      if (currentSections.length > 0) {
        if (!currentSections.includes(activeSection)) {
            setActiveSection(currentSections[0]);
        }
      } else {
        setActiveSection('Default');
      }
    }, [selectedStream, activeSection]);

  const handleResetSection = (e: React.MouseEvent, targetSection: string) => {
    e.stopPropagation();
    try {
      const data = JSON.parse(localStorage.getItem('tcb-progress') || '{}');
      const currentStreamData = curriculumData[program].streams.find(s => s.streamName === selectedStream);
      const currentActiveWeeks = currentStreamData?.weeks.filter(w => w.semester === selectedSemester) || [];
      
      currentActiveWeeks.forEach(week => {
        const key = `${program}-${selectedStream}-${selectedSemester}-${targetSection}-week${week.week}`;
        delete data[key];
      });
      
      localStorage.setItem('tcb-progress', JSON.stringify(data));
        // --- ERP CLOUD BRIDGE SYNC ---
        try {
          fetch('/api/erp-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: "Computing Skills",
              section: typeof targetSection !== 'undefined' ? targetSection : (typeof activeSection !== 'undefined' ? activeSection : 'General'),
              progress: data,
              key: "latest_sync",
              details: "Auto-synced from presentation mode"
            })
          }).catch(e => console.log('ERP Sync failed', e));
        } catch(e) {}
        // -----------------------------

      setSectionProgress(prev => ({ ...prev, [targetSection]: 0 }));
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate progress from localStorage
    useEffect(() => {
      if (!activeLesson) {
        try {
          const data = JSON.parse(localStorage.getItem('tcb-progress') || '{}');
          const newProgress: Record<string, number> = {};
          const newSessionProgress: Record<number, number> = {};
          
          const currentStreamData = curriculumData[program].streams.find(s => s.streamName === selectedStream);
          const currentActiveWeeks = currentStreamData?.weeks.filter(w => w.semester === selectedSemester) || [];
          const totalWeeks = currentActiveWeeks.length || 1;
          
          const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];
          
          currentSections.forEach(sec => {
            let completedWeeks = 0;
            let partialProgress = 0;
            
            currentActiveWeeks.forEach(week => {
              const key = `${program}-${selectedStream}-${selectedSemester}-${sec}-week${week.week}`;
              const record = data[key];
              
              if (record) {
                const progressPercentage = record.completed ? 100 : (record.totalSlides > 1 ? (record.currentSlide / (record.totalSlides - 1)) * 100 : 0);
                if (sec === activeSection || (currentSections.length === 1 && sec === 'Default')) {
                   newSessionProgress[week.week] = progressPercentage;
                }
                
                if (record.completed) {
                  completedWeeks += 1;
                } else if (record.totalSlides > 1) {
                  partialProgress += (record.currentSlide / (record.totalSlides - 1));
                }
              } else {
                if (sec === activeSection || (currentSections.length === 1 && sec === 'Default')) {
                   newSessionProgress[week.week] = 0;
                }
              }
            });
            
            const totalProgress = ((completedWeeks + partialProgress) / totalWeeks) * 100;
            newProgress[sec] = Math.min(100, Math.round(totalProgress));
          });
          
          setSectionProgress(newProgress);
          setSessionProgress(newSessionProgress);
        } catch (e) {
          console.error("Error reading progress", e);
        }
      }
    }, [activeLesson, program, selectedStream, selectedSemester, activeSection]);


  // Keyboard Shortcuts (Fullscreen, Light/Dark mode, Navigation)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        // Return to welcome screen if on dashboard
        if (!showWelcome && !activeLesson) {
          setShowWelcome(true);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.error(err));
        } else {
          document.exitFullscreen().catch(err => console.error(err));
        }
      } else if (e.key === 'l' || e.key === 'L') {
        setTheme('light');
        localStorage.setItem('app-theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (e.key === 'd' || e.key === 'D') {
        setTheme('dark');
        localStorage.setItem('app-theme', 'dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showWelcome, activeLesson]);

  // Handle program change
  const changeProgram = (newProgram: 'ug' | 'pg') => {
    setProgram(newProgram);
    setSelectedStream(curriculumData[newProgram].streams[0].streamName);
    setSelectedSemester(1);
    setSearchResults(null);
    setActiveLesson(null);
  };

  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeProgram(e.target.value as 'ug' | 'pg');
  };

  const handleStreamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStream(e.target.value);
    setSearchResults(null);
    setActiveLesson(null);
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(Number(e.target.value));
    setSearchResults(null);
    setActiveLesson(null);
  };

  // Filter weeks
  const activeStreamData = streams.find(s => s.streamName === selectedStream);
  const activeWeeks = activeStreamData?.weeks.filter(w => w.semester === selectedSemester) || [];
  
  const isLevel4 = activeWeeks.some(w => w.level === 4);

  const fetchLatestPaths = async () => {
    setIsSearching(true);
    setSearchResults(null);
    try {
      const query = `latest career paths roles and certifications for ${selectedStream} 2024`;
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Enter Access Code</h2>
        <input 
          type="password" 
          value={passkey} 
          onChange={(e) => {
            setPasskey(e.target.value);
            if (e.target.value === '2525') setIsUnlocked(true);
          }} 
          autoFocus
          style={{ 
            padding: '1rem', 
            fontSize: '2rem', 
            textAlign: 'center', 
            letterSpacing: '0.5em', 
            borderRadius: '12px', 
            border: '2px solid var(--border-color)', 
            background: 'var(--surface-glass)',
            color: 'var(--text-main)',
            width: '300px',
            outline: 'none'
          }}
        />
      </div>
    );
  }

  return (
    <>
      {showWelcome && !showOrientation ? (
        <WelcomeScreen program={program} onProgramChange={changeProgram} onNext={() => setShowOrientation(true)} />
      ) : showOrientation ? (
        <SlideViewer
          weekData={{ week: 0, theme: 'Welcome to Computing Skills', focus: 'Orientation & Roadmap', label: 'Orientation' }}
          program={program}
          stream={selectedStream}
          semester={selectedSemester}
          activeSection={activeSection}
          theme={theme}
          course="computing-skills"
          onClose={() => {
            setShowOrientation(false);
            setShowWelcome(false);
          }}
        />
      ) : (
        <div className="lms-container">
          {/* Top Navbar */}
          <header className="lms-topbar">
            <div className="lms-brand flex items-center">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mr-2 transition-colors cursor-pointer"
                title="Toggle Sidebar"
              >
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
              <div className="lms-logo"><BookOpen size={28} /></div>
              <h1>
                Introduction to Computing Skills
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', marginLeft: '10px', verticalAlign: 'middle', letterSpacing: '0.04em' }}>
                  Z7AVA 26209
                </span>
              </h1>
            </div>
            
            <div className="lms-topbar-actions">
              <Link
                href="/computing-skills/computing-lab"
                className="lab-portal-btn"
                style={{ textDecoration: 'none', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', color: '#059669', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FileSpreadsheet size={16} /> Student Lab & Assignment
              </Link>
              <div className="lms-program-toggle">
                <button 
                  className={`toggle-btn ${program === 'ug' ? 'active' : ''}`}
                  onClick={() => changeProgram('ug')}
                >
                  UG
                </button>
                <button 
                  className={`toggle-btn ${program === 'pg' ? 'active' : ''}`}
                  onClick={() => changeProgram('pg')}
                >
                  PG
                </button>
              </div>
              <button 
                className="theme-toggle-btn" 
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </header>

          <div className="lms-layout">
            {/* Sidebar Navigation */}
            <aside className={`lms-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
              
              {/* Workshops Link */}
              <div className="lms-sidebar-section" style={{ borderBottom: '1px solid var(--border-sidebar)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/" className="module-item" style={{ textDecoration: 'none', color: 'var(--text-sidebar)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎭</span> Soft Skills
                </a>
                <a href="/communicative-english" className="module-item" style={{ textDecoration: 'none', color: 'var(--text-sidebar)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🗣️</span> Communicative English
                </a>
                <a href="/computing-skills" className="module-item" style={{ textDecoration: 'none', color: 'var(--text-sidebar)' }}>
                  <span style={{ fontSize: '1.2rem' }}>💻</span> Computing Skills
                </a>
                <a href="/computing-skills/computing-lab" className="module-item" style={{ textDecoration: 'none', color: '#059669', fontWeight: 700 }}>
                  <span style={{ fontSize: '1.2rem' }}>📊</span> Student Lab & Assignment
                </a>
                <a href="/workshops/admin" 
                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium border border-blue-200 dark:border-blue-800 shadow-sm"
                >
                  <Users size={18} />
                  Paid Workshops Gateway
                </a>
              </div>

              <div className="lms-sidebar-section">
                <h3 className="sidebar-heading">Course Selection</h3>
                <div className="sidebar-select-group">
                  <label>Specialization</label>
                  <select value={selectedStream} onChange={handleStreamChange} autoFocus>
                    {streams.map(s => (
                      <option key={s.streamName} value={s.streamName}>{s.streamName}</option>
                    ))}
                  </select>
                </div>
                <div className="sidebar-select-group">
                  <label>Semester</label>
                  <select value={selectedSemester} onChange={handleSemesterChange}>
                    {semesters.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lms-sidebar-section modules-section">
                <h3 className="sidebar-heading">Modules</h3>
                <ul className="module-list">
                  <li 
                    className={`module-item ${activeLesson === null ? 'active' : ''}`}
                    onClick={() => setActiveLesson(null)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Semester Overview</span>
                  </li>
                  {activeWeeks.map((week) => (
                    <li 
                      key={week.week} 
                      className={`module-item ${activeLesson?.week === week.week ? 'active' : ''}`}
                      onClick={() => setActiveLesson(week)}
                    >
                      <BookOpen size={18} />
                      <div className="module-item-text">
                        <span className="module-week-label">{week.label || `Session ${week.week}`}</span>
                        <span className="module-theme-label" title={week.theme}>{week.theme}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lms-main">
              <div className="lms-dashboard">
                <div className="dashboard-header">
                  <h2>{program.toUpperCase()} / {selectedStream} / Semester {selectedSemester}</h2>
                  <p>Select a module from the sidebar to begin learning.</p>
                </div>

                  {SECTIONS.length > 0 && (
                    <div className="batch-tracker-card">
                      <div className="card-header">
                        <h3><Users size={24} color="#4f46e5" /> {SECTIONS.length > 1 ? 'Section Progress Tracker' : 'Course Progress Tracker'}</h3>
                      </div>
                      <div className="batch-progress-grid">
                        {SECTIONS.map(section => {
                          const progress = sectionProgress[section] || 0;
                          const isActive = activeSection === section;
                          return (
                            <div 
                              key={section} 
                              className={`batch-progress-item ${isActive ? 'active' : ''}`}
                              onClick={() => setActiveSection(section)}
                            >
                              <div className="batch-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span className="batch-name" style={{ fontWeight: '700', whiteSpace: 'nowrap', color: isActive ? 'var(--accent-primary)' : 'var(--text-main)' }}>{SECTIONS.length > 1 ? section : selectedStream}</span>
                                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '20px' }}>
                                    {isActive && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '12px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</span>}
                                    {isActive && progress > 0 && (
                                      <button 
                                        onClick={(e) => handleResetSection(e, section)}
                                        className="reset-progress-btn"
                                        title="Reset Demo Progress"
                                      >
                                        <RotateCcw size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <span className="batch-percent" style={{ fontWeight: '700', fontSize: '1.25rem', color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{progress}%</span>
                              </div>
                              <div className="progress-bar-bg" style={{ background: isActive ? 'var(--border-color)' : 'var(--bg-app)' }}>
                                <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: progress > 75 ? '#10b981' : progress > 50 ? '#f59e0b' : isActive ? '#4f46e5' : '#94a3b8' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isLevel4 && (
                    <div className="realtime-card">
                      <div className="card-header">
                        <h3><Sparkles size={24} color="#6366f1"/> Live Career Intelligence</h3>
                        <button className="search-btn" onClick={fetchLatestPaths} disabled={isSearching}>
                          {isSearching ? <Loader2 className="spinner" size={18} /> : <Search size={18} />}
                          Check for latest updates
                        </button>
                      </div>
                      {searchResults && (
                        <div className="search-results">
                          {searchResults.length === 0 ? (
                            <p>No results found.</p>
                          ) : (
                            searchResults.map((res, i) => (
                              <div key={i} className="result-item">
                                <a href={res.link} target="_blank" rel="noreferrer"><h4>{res.title}</h4></a>
                                <p>{res.snippet}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {!searchResults && !isSearching && (
                        <p className="hint-text">Click the button to fetch real-time certifications and career paths from the web for {selectedStream}.</p>
                      )}
                    </div>
                  )}

                  <div className="modules-grid">
                    {activeWeeks.map((week) => {
                      const unitSummary = Object.values(computingUnitSummaries).find(u => u.lastWeek === Number(week.week));
                      return (
                        <Fragment key={week.week}>
                          <div className="module-card" style={{ position: "relative", overflow: "hidden" }}>
                            <div className="module-card-header">
                              <span className="week-badge">{week.label || `Session ${week.week}`}</span>
                            </div>
                            <h3>{week.theme}</h3>
                            <p className="module-focus">{week.focus}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', marginBottom: '1rem' }}>
                              <div 
                                className="module-card-footer" 
                                style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', margin: 0 }}
                                onClick={() => setActiveLesson(week)}
                              >
                                <span>Begin Module</span>
                                <ChevronRight size={16} />
                              </div>
                              <div 
                                className="module-card-footer" 
                                style={{ background: 'transparent', padding: '8px 16px', border: '1px solid var(--border-sidebar)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', margin: 0 }}
                                onClick={(e) => { e.stopPropagation(); setActiveNotesLesson(week); }}
                              >
                                <span>Notes</span>
                                <FileText size={16} />
                              </div>
                              {Number(week.week) === 13 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/excel-demo-datasets"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(56, 189, 248, 0.12)',
                                      border: '1px solid rgba(56, 189, 248, 0.35)',
                                      color: '#38bdf8',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <FileSpreadsheet size={14} /> Demo Data: Math Functions
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <a
                                    href="/sample-data/01_Aviation_Essential_Functions_Dataset.csv"
                                    download="01_Aviation_Essential_Functions_Dataset.csv"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(56, 189, 248, 0.08)',
                                      border: '1px dashed rgba(56, 189, 248, 0.4)',
                                      color: '#38bdf8',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download sample CSV to send to student group"
                                  >
                                    <Download size={13} /> Download Sample File (.csv)
                                  </a>

                                </Fragment>
                              )}
                              {Number(week.week) === 14 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/absolute-referencing"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(234, 179, 8, 0.12)',
                                      border: '1px solid rgba(234, 179, 8, 0.35)',
                                      color: '#eab308',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Sparkles size={14} /> Try $ Simulator
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <a
                                    href="/sample-data/01_Aviation_Essential_Functions_Dataset.csv"
                                    download="01_Aviation_Essential_Functions_Dataset.csv"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(234, 179, 8, 0.08)',
                                      border: '1px dashed rgba(234, 179, 8, 0.4)',
                                      color: '#eab308',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download sample CSV to send to student group"
                                  >
                                    <Download size={13} /> Download Sample File (.csv)
                                  </a>

                                </Fragment>
                              )}
                              {Number(week.week) === 15 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/excel-demo-datasets"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(16, 185, 129, 0.12)',
                                      border: '1px solid rgba(16, 185, 129, 0.35)',
                                      color: '#10b981',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <FileSpreadsheet size={14} /> Demo Data: Stats (SUM/AVG)
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <a
                                    href="/sample-data/01_Aviation_Essential_Functions_Dataset.csv"
                                    download="01_Aviation_Essential_Functions_Dataset.csv"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(16, 185, 129, 0.08)',
                                      border: '1px dashed rgba(16, 185, 129, 0.4)',
                                      color: '#10b981',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download sample CSV to send to student group"
                                  >
                                    <Download size={13} /> Download Sample File (.csv)
                                  </a>

                                </Fragment>
                              )}
                              {Number(week.week) === 17 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/excel-demo-datasets"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(234, 179, 8, 0.12)',
                                      border: '1px solid rgba(234, 179, 8, 0.35)',
                                      color: '#eab308',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <FileSpreadsheet size={14} /> Demo Data: Lookups (V/H/X)
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    <a
                                      href="/sample-data/03_Aviation_VLOOKUP_HLOOKUP_Tariffs.csv"
                                      download="03_Aviation_VLOOKUP_HLOOKUP_Tariffs.csv"
                                      style={{
                                        flex: 1,
                                        textDecoration: 'none',
                                        background: 'rgba(234, 179, 8, 0.08)',
                                        border: '1px dashed rgba(234, 179, 8, 0.4)',
                                        color: '#eab308',
                                        padding: '5px 8px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        fontWeight: 600,
                                        fontSize: '0.72rem',
                                        cursor: 'pointer'
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      title="Download VLOOKUP/HLOOKUP Cargo Tariffs (.csv)"
                                    >
                                      <Download size={12} /> V/HLOOKUP (.csv)
                                    </a>
                                    <a
                                      href="/sample-data/04_Aviation_XLOOKUP_Crew_Snag_Master.csv"
                                      download="04_Aviation_XLOOKUP_Crew_Snag_Master.csv"
                                      style={{
                                        flex: 1,
                                        textDecoration: 'none',
                                        background: 'rgba(244, 63, 94, 0.08)',
                                        border: '1px dashed rgba(244, 63, 94, 0.4)',
                                        color: '#fb7185',
                                        padding: '5px 8px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        fontWeight: 600,
                                        fontSize: '0.72rem',
                                        cursor: 'pointer'
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      title="Download XLOOKUP Crew Dispatch Master (.csv)"
                                    >
                                      <Download size={12} /> XLOOKUP (.csv)
                                    </a>
                                  </div>
                                </Fragment>
                              )}
                              {Number(week.week) === 18 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/excel-demo-datasets"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(16, 185, 129, 0.12)',
                                      border: '1px solid rgba(16, 185, 129, 0.35)',
                                      color: '#34d399',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <FileSpreadsheet size={14} /> Demo Data: Pivots &amp; Charts
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <a
                                    href="/sample-data/05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv"
                                    download="05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(16, 185, 129, 0.08)',
                                      border: '1px dashed rgba(16, 185, 129, 0.4)',
                                      color: '#34d399',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download BLR 50-Flight Operations Log (.csv) to send to student group"
                                  >
                                    <Download size={13} /> Download Sample File (.csv)
                                  </a>
                                  <a
                                    href="/sample-data/Assignment_Pivot_Tables_and_Charts_BLR_Airport.md"
                                    download="Assignment_Pivot_Tables_and_Charts_BLR_Airport.md"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(234, 179, 8, 0.08)',
                                      border: '1px dashed rgba(234, 179, 8, 0.4)',
                                      color: '#facc15',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer',
                                      marginTop: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download Student Assignment Sheet (.md) for Pivot Tables & Charts"
                                  >
                                    <Download size={13} /> Download Pivot Assignment Sheet (.MD)
                                  </a>
                                  <a
                                    href="/sample-data/Assignment_Pivot_Tables_and_Charts_BLR_Airport.pdf"
                                    download="Assignment_Pivot_Tables_and_Charts_BLR_Airport.pdf"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(239, 68, 68, 0.08)',
                                      border: '1px dashed rgba(239, 68, 68, 0.4)',
                                      color: '#f87171',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer',
                                      marginTop: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download Official PDF Assignment Handout & Instructions"
                                  >
                                    <Download size={13} /> Download Assignment Handout (.PDF)
                                  </a>
                                </Fragment>
                              )}
                              {Number(week.week) === 16 && (
                                <Fragment>
                                  <Link
                                    href="/simulators/excel-demo-datasets"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(168, 85, 247, 0.12)',
                                      border: '1px solid rgba(168, 85, 247, 0.35)',
                                      color: '#c084fc',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <FileSpreadsheet size={14} /> Demo Data: IF &amp; Nested IF
                                    </span>
                                    <ChevronRight size={14} />
                                  </Link>
                                  <a
                                    href="/sample-data/02_Aviation_Logical_IF_Nested_IF_Dataset.csv"
                                    download="02_Aviation_Logical_IF_Nested_IF_Dataset.csv"
                                    style={{
                                      textDecoration: 'none',
                                      background: 'rgba(168, 85, 247, 0.08)',
                                      border: '1px dashed rgba(168, 85, 247, 0.4)',
                                      color: '#c084fc',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px',
                                      fontWeight: 600,
                                      fontSize: '0.76rem',
                                      cursor: 'pointer',
                                      marginTop: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    title="Download sample CSV to send to student group"
                                  >
                                    <Download size={13} /> Download Sample File (.csv)
                                  </a>

                                </Fragment>
                              )}

                              {Number(week.week) === 16 && (
                                <Link
                                  href="/simulators/excel-core-workshop"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'rgba(56, 189, 248, 0.12)',
                                    border: '1px solid rgba(56, 189, 248, 0.35)',
                                    color: '#38bdf8',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontWeight: 600,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Sparkles size={14} /> 2–4 Hr Workshop Lab
                                  </span>
                                  <ChevronRight size={14} />
                                </Link>
                              )}
                            </div>
                            {/* Progress Bar inside module card */}
                            <div style={{ width: '100%', height: '4px', background: 'var(--border-sidebar)', position: 'absolute', bottom: 0, left: 0 }}>
                              <div style={{ width: `${sessionProgress[week.week] || 0}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                            </div>
                          </div>

                          {/* 2-4 Hour Workshop Milestone Card (Placed Immediately After Unit 3 Session 6 / Week 16) */}
                          {Number(week.week) === 16 && (
                            <div 
                              key="unit-3-workshop-milestone"
                              className="module-card"
                              style={{ 
                                gridColumn: '1 / -1',
                                position: 'relative', 
                                overflow: 'hidden',
                                border: '1.5px solid #38bdf8',
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(14, 116, 144, 0.18) 100%)',
                                boxShadow: '0 8px 24px rgba(56, 189, 248, 0.12)',
                                padding: '1.75rem 2rem',
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '20px'
                              }}
                            >
                              <div style={{ flex: '1 1 500px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{
                                    background: '#38bdf8',
                                    color: '#0f172a',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                  }}>
                                    Unit 3 Milestone Lab
                                  </span>
                                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                    Post-Session 6 Intensive · 2–4 Hours Fast-Track
                                  </span>
                                </div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                                  Spreadsheet Core Essentials Workshop (Sessions 1–6)
                                </h3>
                                <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', maxWidth: '750px' }}>
                                  Designed to consolidate the first 6 sessions in a single 2–4 hour interactive laboratory. 
                                  Practice <strong>Basic Mathematical Formulae</strong>, <strong>Cell Referencing ($)</strong>, 
                                  <strong> Essential Statistical Functions</strong>, and <strong>Logical &amp; Text Functions</strong> with live aviation flight manifests.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  <span style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    1. Basic Math (PEMDAS)
                                  </span>
                                  <span style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#eab308', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    2. Cell Referencing ($A$1)
                                  </span>
                                  <span style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    3. Statistical Functions (SUM/AVG)
                                  </span>
                                  <span style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    4. Logical &amp; Text (IF/PROPER)
                                  </span>
                                </div>
                              </div>

                              <div>
                                <Link
                                  href="/simulators/excel-core-workshop"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                    color: '#ffffff',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Sparkles size={18} /> Launch 2–4 Hr Workshop Simulator
                                </Link>
                              </div>
                            </div>
                          )}

                          {/* Unit 3 Spreadsheet Demonstration Datasets & Workbooks Hub */}
                          {Number(week.week) === 16 && (
                            <div 
                              key="unit-3-datasets-hub-banner"
                              className="module-card"
                              style={{ 
                                gridColumn: '1 / -1',
                                position: 'relative', 
                                overflow: 'hidden',
                                border: '1.5px solid #10b981',
                                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.15) 100%)',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
                                padding: '1.75rem 2rem',
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '20px'
                              }}
                            >
                              <div style={{ flex: '1 1 500px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <span style={{
                                    background: '#10b981',
                                    color: '#064e3b',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                  }}>
                                    Embedded Spreadsheet Workbooks
                                  </span>
                                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                    IndiGo · Air India · Akasa · BIAL Airport Operational Data
                                  </span>
                                </div>
                                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <FileSpreadsheet size={24} color="#34d399" />
                                  Spreadsheet Demonstration Datasets Hub (Excel &amp; Sheets)
                                </h3>
                                <p style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', maxWidth: '750px' }}>
                                  5 live aviation datasets pre-formatted with column coordinates (A, B, C...) for live projection and student hands-on work. 
                                  One-click TSV copying to paste directly into Microsoft Excel or Google Sheets, plus direct CSV file downloads.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  <span style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    🧮 1. Essential Functions (SUM/AVG/MIN/MAX/COUNTIF/SUMIF)
                                  </span>
                                  <span style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    ⚖️ 2. IF &amp; Nested IF (DGCA Delay Compensation)
                                  </span>
                                  <span style={{ background: 'rgba(234, 179, 8, 0.12)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#eab308', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    🔍 3. VLOOKUP &amp; HLOOKUP (Air Cargo Tariffs)
                                  </span>
                                  <span style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    🚀 4. Modern XLOOKUP (Leftward Lookups)
                                  </span>
                                  <span style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '3px 10px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
                                    📊 5. Pivot Tables &amp; Charts (50 Flights Manifest)
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
                                <Link
                                  href="/simulators/excel-demo-datasets"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#ffffff',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.92rem',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FileSpreadsheet size={18} /> Open Datasets Hub &amp; TSVs
                                </Link>
                                <a
                                  href="/api/download-sample-datasets"
                                  download="Aviation_ICS_Student_Practice_Datasets_Batch2026.zip"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Download all 5 files in a ZIP bundle to send to your student WhatsApp/Teams group"
                                >
                                  <Download size={16} /> 📦 Download All Files (.ZIP)
                                </a>
                                <a
                                  href="/sample-data/README_Trainer_Demonstration_Instructions.txt"
                                  download="README_Trainer_Demonstration_Instructions.txt"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#cbd5e1',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontWeight: 600,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Download size={14} /> Download Lesson Script (TXT)
                                </a>
                                <a
                                  href="/sample-data/Assignment_Pivot_Tables_and_Charts_BLR_Airport.md"
                                  download="Assignment_Pivot_Tables_and_Charts_BLR_Airport.md"
                                  style={{
                                    textDecoration: 'none',
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    color: '#facc15',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    fontWeight: 600,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Download Pivot Table & Chart Student Assignment Sheet (.md)"
                                >
                                  <Download size={14} /> Download Pivot Assignment Sheet (.MD)
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Consolidated Notes Card for entire unit */}
                          {unitSummary && (
                            <div 
                              key={`unit-${unitSummary.unit}-consolidated`}
                              className="module-card consolidated-notes-card" 
                              style={{ 
                                position: "relative", 
                                overflow: "hidden",
                                border: "1.5px solid #10b981",
                                background: "linear-gradient(180deg, var(--bg-surface) 0%, rgba(16, 185, 129, 0.05) 100%)",
                                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.08)",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                setActiveNotesLesson({
                                  week: `unit-${unitSummary.unit}`,
                                  semester: selectedSemester,
                                  theme: `Unit ${unitSummary.unit}: ${unitSummary.title} (Consolidated Notes)`,
                                  focus: unitSummary.focus,
                                  task: `Unit ${unitSummary.unit} Revision`,
                                  rubric: 'Mastery',
                                  label: `Unit ${unitSummary.unit}: Consolidated Notes`
                                });
                              }}
                            >
                              <div className="module-card-header">
                                <span 
                                  className="week-badge"
                                  style={{ 
                                    background: "rgba(16, 185, 129, 0.12)", 
                                    color: "#059669", 
                                    border: "1px solid rgba(16, 185, 129, 0.25)",
                                    fontWeight: 700 
                                  }}
                                >
                                  Unit {unitSummary.unit}: Consolidated Notes
                                </span>
                              </div>
                              <h3 style={{ color: "var(--text-main)", fontWeight: 700 }}>
                                {`Unit ${unitSummary.unit} Consolidated Notes`}
                              </h3>
                              <p className="module-focus" style={{ marginBottom: "1.5rem" }}>
                                {unitSummary.focus}
                              </p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', marginBottom: '1rem' }}>
                                <div 
                                  className="module-card-footer" 
                                  style={{ 
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
                                    color: '#ffffff', 
                                    padding: '12px 16px', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
                                  }}
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setActiveNotesLesson({
                                      week: `unit-${unitSummary.unit}`,
                                      semester: selectedSemester,
                                      theme: `Unit ${unitSummary.unit}: ${unitSummary.title} (Consolidated Notes)`,
                                      focus: unitSummary.focus,
                                      task: `Unit ${unitSummary.unit} Revision`,
                                      rubric: 'Mastery',
                                      label: `Unit ${unitSummary.unit}: Consolidated Notes`
                                    }); 
                                  }}
                                >
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} />
                                    <span>Consolidated Notes</span>
                                  </span>
                                  <ChevronRight size={16} />
                                </div>
                              </div>
                              {/* Bottom decorative bar */}
                              <div style={{ width: '100%', height: '4px', background: 'linear-gradient(90deg, #059669, #10b981)', position: 'absolute', bottom: 0, left: 0 }} />
                            </div>
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
            </main>
          </div>

          {/* Presentation Slide Viewer Modal */}
          {/* Notes Template Modal */}
          {activeNotesLesson && (
            <NotesTemplate
              courseName='Introduction to Computing Skills'
              sessionName={activeNotesLesson.theme}
              theme={activeNotesLesson.theme}
              focus={activeNotesLesson.focus}
              onClose={() => setActiveNotesLesson(null)}
              weekNumber={activeNotesLesson.week}
            />
          )}

          {activeLesson && (
            <SlideViewer
              weekData={activeLesson}
              program={program}
              stream={selectedStream}
              semester={selectedSemester}
              activeSection={activeSection}
              theme={theme}
              course="computing-skills"
              onClose={() => setActiveLesson(null)}
            />
          )}
        </div>
      )}
    </>
  );
}
