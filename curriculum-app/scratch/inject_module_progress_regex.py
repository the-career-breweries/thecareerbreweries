import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to add overflow hidden and relative position to module-card
    if 'className="module-card"' in content:
        content = content.replace('className="module-card"', 'className="module-card" style={{ position: "relative", overflow: "hidden" }}')
    
    # Inject the progress bar
    pattern = r'(<div className="module-card-footer">[\s\S]*?<span>Begin Module</span>[\s\S]*?<ChevronRight size=\{16\} />[\s\S]*?</div>\s*</div>)'
    
    new_footer = r"""\1

                          {/* Progress Bar inside module card */}
                          <div style={{ width: '100%', height: '4px', background: 'var(--border-sidebar)', position: 'absolute', bottom: 0, left: 0 }}>
                             <div style={{ width: `${sessionProgress[week.week] || 0}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                          </div>"""
                          
    # Wait, the regex `</div>\s*</div>` includes the outer `module-card` closing div!
    # Let's be more precise.
    
    pattern2 = r'(<div className="module-card-footer">[\s\S]*?</div>)(\s*</div>)'
    
    new_footer2 = r"""\1
                          {/* Progress Bar inside module card */}
                          <div style={{ width: '100%', height: '4px', background: 'var(--border-sidebar)', position: 'absolute', bottom: 0, left: 0 }}>
                             <div style={{ width: `${sessionProgress[week.week] || 0}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s' }} />
                          </div>\2"""
                          
    content = re.sub(pattern2, new_footer2, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
