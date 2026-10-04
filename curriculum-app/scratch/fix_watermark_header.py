import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# 1. Fix the Watermark CSS to make it visible
notes_content = notes_content.replace(
    'color: rgba(15, 23, 42, 0.08) !important;',
    'color: rgba(0, 0, 0, 0.15) !important;'
)
notes_content = notes_content.replace(
    'z-index: -1;',
    'z-index: 1000;'
)

# 2. Fix the header
old_header = r"<div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1rem' }}>\s*<span><strong>Course:</strong> \{courseName\}</span>\s*<span><strong>Session:</strong> \{sessionName\}</span>\s*</div>"
new_header = """<div style={{ color: '#64748b', fontSize: '1.2rem' }}>
                <div style={{ marginBottom: '0.25rem' }}><strong>Course:</strong> {courseName}</div>
                <div><strong>Session:</strong> {sessionName}</div>
              </div>"""

notes_content = re.sub(old_header, new_header, notes_content)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
