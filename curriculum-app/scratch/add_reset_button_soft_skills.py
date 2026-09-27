import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change dropdown condition
content = content.replace('{SECTIONS.length > 0 && (', '{SECTIONS.length > 1 && (')

# Inject the reset button
old_dropdown_block = """                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 1 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}
                </div>"""

new_dropdown_block = """                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 1 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}
                    
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
                </div>"""

content = content.replace(old_dropdown_block, new_dropdown_block)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
