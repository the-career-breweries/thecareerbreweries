import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# Replace the flex span layout with stacked div layout
old_header = """<div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1rem' }}>
                <span><strong>Course:</strong> {courseName}</span>
                <span><strong>Session:</strong> {sessionName}</span>
              </div>"""

new_header = """<div style={{ color: '#64748b', fontSize: '1.1rem' }}>
                <div style={{ marginBottom: '0.25rem' }}><strong>Course:</strong> {courseName}</div>
                <div><strong>Session:</strong> {sessionName}</div>
              </div>"""

notes_content = notes_content.replace(old_header, new_header)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
