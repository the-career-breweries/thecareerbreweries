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

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
