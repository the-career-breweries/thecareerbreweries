import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix backslashes
    content = content.replace(r"\'lucide-react\';", "'lucide-react';")
    content = content.replace(r"\'@/components/SlideViewer\';", "'@/components/SlideViewer';")
    content = content.replace(r"\'@/components/NotesTemplate\';", "'@/components/NotesTemplate';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
