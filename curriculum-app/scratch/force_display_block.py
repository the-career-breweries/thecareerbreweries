import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# Update the CSS to ensure display: block
old_css_part = """html, body, main, div {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
          }"""

new_css_part = """html, body, main, div {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
            display: block !important;
          }"""

notes_content = notes_content.replace(old_css_part, new_css_part)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
