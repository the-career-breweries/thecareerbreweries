import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add FileText to lucide-react import
    if 'FileText' not in content:
        content = re.sub(
            r'import { (.*?) } from \'lucide-react\';',
            r'import { \1, FileText } from \'lucide-react\';',
            content
        )
        
    # Add NotesTemplate import
    if 'import NotesTemplate' not in content:
        content = re.sub(
            r'import SlideViewer from \'@/components/SlideViewer\';',
            r'import SlideViewer from \'@/components/SlideViewer\';\nimport NotesTemplate from \'@/components/NotesTemplate\';',
            content
        )
        
    # Add activeNotesLesson state
    if 'const [activeNotesLesson' not in content:
        content = re.sub(
            r'const \[activeLesson, setActiveLesson\] = useState<WeekData \| null>\(null\);',
            r'const [activeLesson, setActiveLesson] = useState<WeekData | null>(null);\n  const [activeNotesLesson, setActiveNotesLesson] = useState<WeekData | null>(null);',
            content
        )
        
    # Clean up the module-card div and replace its footer
    # Find the entire module-card block
    # Note: `week.label || \`Session ${week.week}\`` in english, but computing might use `Session` differently.
    
    # We will do a generic regex replacement for the module-card footer area
    
    # First, let's fix the duplicated styles on module-card
    content = re.sub(r'(style=\{\{ position: "relative", overflow: "hidden" \}\}\s*)+', r'style={{ position: "relative", overflow: "hidden" }} ', content)
    
    # Remove the onClick from the outer div, we will add it to the Begin Module section
    content = re.sub(
        r'<div key=\{week\.week\} className="module-card"\s*style=\{\{ position: "relative", overflow: "hidden" \}\}\s*onClick=\{([^}]+)\}>',
        r'<div key={week.week} className="module-card" style={{ position: "relative", overflow: "hidden" }}>',
        content
    )
    
    # Replace the footer area
    old_footer_pattern = r'<div className="module-card-footer">\s*<span>Begin Module</span>\s*<ChevronRight size=\{16\} />\s*</div>\s*\{\/\* Progress Bar inside module card \*\/\}\s*<div style=\{\{ width: \'100%\', height: \'4px\'[^\}]+\}\}>\s*<div style=\{\{ width: `\$\{sessionProgress\[week\.week\] \|\| 0\}%`[^\}]+\}\}\s*\/>\s*</div>\s*</div>'
    
    new_footer = r"""<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem', marginBottom: '1rem' }}>
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
                              <span>Generate Notes</span>
                              <FileText size={16} />
                            </div>
                          </div>
                          {/* Progress Bar inside module card */}
                          <div style={{ width: '100%', height: '4px', background: 'var(--border-sidebar)', position: 'absolute', bottom: 0, left: 0 }}>
                             <div style={{ width: `${sessionProgress[week.week] || 0}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                          </div>
                        </div>"""

    content = re.sub(old_footer_pattern, new_footer, content)

    # Add the NotesTemplate component at the end
    notes_modal = r"""          {/* Notes Template Modal */}
          {activeNotesLesson && (
            <NotesTemplate
              courseName={program === 'ug' ? (selectedStream === 'BBA Aviation' || selectedStream === 'B.Sc Aviation' ? 'Communicative English' : 'Computing Skills') : 'Course'}
              sessionName={activeNotesLesson.theme}
              theme={activeNotesLesson.theme}
              focus={activeNotesLesson.focus}
              onClose={() => setActiveNotesLesson(null)}
            />
          )}"""
    
    if 'activeNotesLesson &&' not in content:
        content = content.replace('{activeLesson && (', notes_modal + '\n\n          {activeLesson && (')
        
    # But wait, we need to pass the correct course name!
    # Let's fix the courseName logic directly in the files.
    if 'communicative-english' in filepath:
        content = content.replace("courseName={program === 'ug' ? (selectedStream === 'BBA Aviation' || selectedStream === 'B.Sc Aviation' ? 'Communicative English' : 'Computing Skills') : 'Course'}", "courseName='Communicative English'")
    else:
        content = content.replace("courseName={program === 'ug' ? (selectedStream === 'BBA Aviation' || selectedStream === 'B.Sc Aviation' ? 'Communicative English' : 'Computing Skills') : 'Course'}", "courseName='Computing Skills'")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
