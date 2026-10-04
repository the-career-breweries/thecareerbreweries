import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# Fix watermark CSS properties
notes_content = notes_content.replace(
    'z-index: 1000;',
    'z-index: 1000;\n              pointer-events: none;\n              text-align: center;\n              width: 100%;'
)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
