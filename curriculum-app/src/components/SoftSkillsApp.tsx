"use client";

import React, { useState, useEffect, useRef } from 'react';
import { curriculumData, WeekData } from '@/data/curriculum';
import { Search, Loader2, Sparkles, Tv, Sun, Moon, BookOpen, GraduationCap, LayoutDashboard, ChevronRight, Users, RotateCcw, Menu } from 'lucide-react';
import SlideViewer from '@/components/SlideViewer';
import StreamingDashboard from '@/components/StreamingDashboard';
import WelcomeScreen from '@/components/WelcomeScreen';
import ThemeSelector, { AppTheme } from '@/components/ThemeSelector';
import '@/app/globals.css';


const CustomDropdown = ({ value, options, onChange }: { value: string | number, options: { label: string, value: string | number }[], onChange: (val: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div ref={ref} style={{ position: 'relative' }} onMouseLeave={() => setIsOpen(false)}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        style={{ 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
          color: isOpen ? 'white' : '#e5e7eb', transition: 'color 0.2s'
        }}
      >
        {options.find(o => o.value === value)?.label || value}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: '-20px', paddingTop: '15px', minWidth: '180px', zIndex: 100 }}>
          <div style={{
            background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px', padding: '0.5rem 0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: '-7px', left: '30px',
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: '7px solid rgba(255,255,255,0.2)'
            }} />
            <div style={{
              position: 'absolute', top: '-6px', left: '31px',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(20,20,20,0.95)'
            }} />
            
            {options.map(opt => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                style={{
                  padding: '0.8rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem',
                  color: opt.value === value ? 'white' : '#9ca3af',
                  fontWeight: opt.value === value ? 'bold' : 'normal',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = opt.value === value ? 'white' : '#9ca3af'; }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CurriculumApp({ isAdmin = false }: { isAdmin?: boolean }) {
  const [program, setProgram] = useState<'ug' | 'pg'>('ug');
  const streams = curriculumData[program].streams;
  
  const [selectedStream, setSelectedStream] = useState<string>(streams[0].streamName);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [showOrientation, setShowOrientation] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>('');
  
  // Semesters depend on the program
  const maxSemesters = program === 'ug' ? 6 : 4;
  const semesters = Array.from({ length: maxSemesters }, (_, i) => i + 1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  
  // Theme State
  const [theme, setTheme] = useState<AppTheme | 'light' | 'dark'>('classic');
  const [hasSelectedTheme, setHasSelectedTheme] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as AppTheme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      // Deliberately NOT setting hasSelectedTheme so they see the screen on reload
    } else {
      setTheme('classic');
      document.documentElement.setAttribute('data-theme', 'classic');
    }
  }, []);

  const handleThemeSelection = (selectedTheme: AppTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('app-theme', selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    setHasSelectedTheme(true);
  };

  // Real-time search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, link: string, snippet: string}[] | null>(null);

  // Active Lesson State
  const [activeLesson, setActiveLesson] = useState<WeekData | null>(null);

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
              subject: "Soft Skills",
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
      {!hasSelectedTheme ? (
          <ThemeSelector onSelectTheme={handleThemeSelection} />
        ) : showWelcome && !showOrientation ? (
        <WelcomeScreen program={program} onProgramChange={changeProgram} onNext={() => setShowOrientation(true)} />
      ) : showOrientation ? (
        <SlideViewer isAdmin={isAdmin}
          weekData={{ week: 0, theme: 'Welcome to Softskills Studio', focus: 'Orientation & Roadmap', label: 'Orientation' }}
          program={program}
          stream={selectedStream}
          semester={selectedSemester}
          activeSection={activeSection}
          theme={theme}
                  sessionProgress={sessionProgress}
          onClose={() => {
            setShowOrientation(false);
            setShowWelcome(false);
          }}
        />
      ) : (
        <div className="lms-container" style={{ background: 'var(--bg-app)', color: 'white' }}>
          {/* Top Navbar (Edge-to-Edge) */}
          <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0))',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%',
            zIndex: 100, transition: 'background 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setActiveLesson(null)}>
                <Tv size={32} />
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '1px', margin: 0, fontFamily: '"Arial Black", sans-serif' }}>
                  STUDIO
                </h1>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#e5e7eb' }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#e5e7eb'}>Home</span>
                
                {/* Program Selector */}
                  <CustomDropdown 
                    value={program} 
                    onChange={(val) => handleProgramChange({ target: { value: val } } as any)}
                    options={[
                      { label: 'Undergraduate', value: 'ug' },
                      { label: 'Postgraduate', value: 'pg' }
                    ]}
                  />

                {/* Stream Selector */}
                  <CustomDropdown 
                    value={selectedStream} 
                    onChange={(val) => handleStreamChange({ target: { value: val } } as any)}
                    options={streams.map(s => ({ label: s.streamName, value: s.streamName }))}
                  />
                
                {/* Semester Selector */}
                  <CustomDropdown 
                    value={selectedSemester} 
                    onChange={(val) => {
                      setSelectedSemester(Number(val));
                      setSearchResults(null);
                      setActiveLesson(null);
                    }}
                    options={semesters.map(s => ({ label: `Semester ${s}`, value: s }))}
                  />

                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 1 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Progress: {sectionProgress[activeSection] || 0}%</span>
                    {/* Reset Progress Button */}
                    <button 
                      onClick={(e) => handleResetSection(e, activeSection)}
                      style={{ 
                        background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#e5e7eb', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', 
                        padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', marginLeft: '8px'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#e5e7eb'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                      title={`Reset Progress for ${activeSection}`}
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                    </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} color="white" />
              </div>
              <button 
                onClick={() => setHasSelectedTheme(false)}
                style={{ 
                  background: 'none', border: 'none', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
                title="Switch Profile"
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color="white" />
                </div>
              </button>
            </div>
          </header>

          <main style={{ width: '100%', minHeight: '100vh', paddingTop: activeLesson ? '70px' : '0' }}>
            {activeLesson ? (
              <SlideViewer isAdmin={isAdmin}
                weekData={activeLesson}
                program={program}
                stream={selectedStream}
                semester={selectedSemester}
                activeSection={activeSection}
                theme={theme}
                  sessionProgress={sessionProgress}
                onClose={() => setActiveLesson(null)}
              />
            ) : (
              <StreamingDashboard 
                program={program}
                streamName={selectedStream}
                semester={selectedSemester}
                weeks={curriculumData[program].streams.find(s => s.streamName === selectedStream)?.weeks.filter(w => w.semester === selectedSemester) || []}
                onSelectLesson={setActiveLesson}
                theme={theme}
                  sessionProgress={sessionProgress}
              />
            )}
          </main>
        </div>
)}
</>
  );
}
