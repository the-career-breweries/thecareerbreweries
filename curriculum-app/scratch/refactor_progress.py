import os
import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace SECTIONS and activeSection state
    old_state = """    // Section Tracking State
    const SECTIONS = ['Section 1', 'Section 2', 'Section 3', 'Section 4'];
    const [activeSection, setActiveSection] = useState<string>('Section 1');
    const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({
      'Section 1': 0, 'Section 2': 0, 'Section 3': 0, 'Section 4': 0
    });"""

    new_state = """    // Section Tracking State
    const SECTIONS = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];
    const [activeSection, setActiveSection] = useState<string>('Default');
    const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});
    const [sessionProgress, setSessionProgress] = useState<Record<number, number>>({});

    useEffect(() => {
      const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];
      if (currentSections.length > 0) {
        if (!currentSections.includes(activeSection)) {
            setActiveSection(currentSections[0]);
        }
      } else {
        setActiveSection('Default');
      }
    }, [selectedStream, activeSection]);"""
    
    content = content.replace(old_state, new_state)

    # 2. Fix handleResetSection (replace SECTIONS.forEach with dynamic if needed, actually it doesn't use SECTIONS, it uses targetSection)
    # wait, handleResetSection doesn't use SECTIONS in the provided snippet.

    # 3. Replace the useEffect for calculating progress
    old_effect_pattern = r"// Calculate progress from localStorage\s*useEffect\(\(\) => \{\s*if \(\!activeLesson\) \{[\s\S]*?\}\s*\}, \[activeLesson, program, selectedStream, selectedSemester\]\);"
    
    new_effect = """// Calculate progress from localStorage
    useEffect(() => {
      if (!activeLesson) {
        try {
          const data = JSON.parse(localStorage.getItem('tcb-progress') || '{}');
          const newProgress: Record<string, number> = {};
          const newSessionProgress: Record<number, number> = {};
          
          const currentStreamData = curriculumData[program].streams.find(s => s.streamName === selectedStream);
          const currentActiveWeeks = currentStreamData?.weeks.filter(w => w.semester === selectedSemester) || [];
          const totalWeeks = currentActiveWeeks.length || 1;
          
          const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Default'];
          
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
    }, [activeLesson, program, selectedStream, selectedSemester, activeSection]);"""

    content = re.sub(old_effect_pattern, new_effect, content)

    # 4. Modify the batch-tracker-card conditional logic
    old_tracker_cond = r"\{program === 'ug' && !selectedStream\.includes\('Aviation'\) && \("
    new_tracker_cond = r"{SECTIONS.length > 0 && ("
    content = re.sub(old_tracker_cond, new_tracker_cond, content)

    # 5. Add session progress bar to modules-grid for communicative & computing
    if "className=\"modules-grid\"" in content:
        # We need to add overflow hidden and relative position to module-card
        content = content.replace('className="module-card"', 'className="module-card" style={{ position: "relative", overflow: "hidden" }}')
        
        # Inject the progress bar right before closing tag of module-card
        old_card_footer = """                          <div className="module-card-footer">
                            <span>Begin Module</span>
                            <ChevronRight size={16} />
                          </div>
                        </div>"""
        
        new_card_footer = """                          <div className="module-card-footer">
                            <span>Begin Module</span>
                            <ChevronRight size={16} />
                          </div>
                          
                          {/* Progress Bar inside module card */}
                          <div style={{ width: '100%', height: '4px', background: 'var(--border-sidebar)', position: 'absolute', bottom: 0, left: 0 }}>
                             <div style={{ width: `${sessionProgress[week.week] || 0}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                          </div>
                        </div>"""
        content = content.replace(old_card_footer, new_card_footer)

    # 6. For SoftSkillsApp, we need to pass sessionProgress to StreamingDashboard and add Section dropdown
    if "StreamingDashboard" in content:
        # Add sessionProgress prop
        content = content.replace('theme={theme}', 'theme={theme}\n                  sessionProgress={sessionProgress}')
        
        # Add Section dropdown to navbar!
        old_navbar_dropdowns = """                  {/* Program Selector */}
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
                      onChange={(val) => setSelectedStream(val)}
                      options={curriculumData[program].streams.map(s => ({ label: s.streamName, value: s.streamName }))}
                    />

                    {/* Semester Selector */}
                    <CustomDropdown 
                      value={selectedSemester}
                      onChange={(val) => setSelectedSemester(val)}
                      options={semesterOptions.map(sem => ({ label: `Semester ${sem}`, value: sem }))}
                    />"""
                    
        new_navbar_dropdowns = """                  {/* Program Selector */}
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
                      onChange={(val) => setSelectedStream(val)}
                      options={curriculumData[program].streams.map(s => ({ label: s.streamName, value: s.streamName }))}
                    />

                    {/* Semester Selector */}
                    <CustomDropdown 
                      value={selectedSemester}
                      onChange={(val) => setSelectedSemester(val)}
                      options={semesterOptions.map(sem => ({ label: `Semester ${sem}`, value: sem }))}
                    />
                    
                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 0 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}"""
        
        content = content.replace(old_navbar_dropdowns, new_navbar_dropdowns)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
