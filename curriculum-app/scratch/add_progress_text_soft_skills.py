import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'({\s*/\*\s*Reset Progress Button\s*\*/\s*})'

new_progress = r"""<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>Progress: {sectionProgress[activeSection] || 0}%</span>
                    \1"""

content = re.sub(pattern, new_progress, content)

# we need to close the div AFTER the reset button
pattern2 = r'(<span>Reset</span>\s*</button>)'
new_progress2 = r"""\1
                    </div>"""
                    
content = re.sub(pattern2, new_progress2, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
