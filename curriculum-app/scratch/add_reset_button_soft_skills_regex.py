import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'({\s*/\*\s*Section Selector \(if applicable\)\s*\*/\s*}[\s\S]*?\{SECTIONS\.length > 1 && \([\s\S]*?</CustomDropdown>\s*\)\s*\})'

new_reset_button = r"""\1
                    
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
                    </button>"""

content = re.sub(pattern, new_reset_button, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
