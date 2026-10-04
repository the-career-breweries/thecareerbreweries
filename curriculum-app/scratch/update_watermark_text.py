import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

old_watermark = r"""<div className="print-watermark">\s*<p style=\{\{ fontWeight: 'bold', fontSize: '48px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' \}\}>S D Sandarsh</p>\s*<p style=\{\{ fontSize: '24px', margin: '15px 0', fontWeight: '500' \}\}>Communicative English, Soft Skills & Employability Trainer</p>\s*<p style=\{\{ fontSize: '24px', margin: 0, fontWeight: '500' \}\}>\+91 97437 11584</p>\s*</div>"""

new_watermark = """<div className="print-watermark">
              <p style={{ fontWeight: 'bold', fontSize: '48px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>S D Sandarsh</p>
              <p style={{ fontSize: '24px', margin: '15px 0', fontWeight: '500', lineHeight: '1.4' }}>
                Communicative English Trainer,<br />
                Soft Skills Trainer,<br />
                & Employability Coach
              </p>
              <p style={{ fontSize: '24px', margin: 0, fontWeight: '500' }}>+91 97437 11584</p>
            </div>"""

notes_content = re.sub(old_watermark, new_watermark, notes_content)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
