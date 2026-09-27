import os
import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change the title
    old_title = "<h3><Users size={24} color=\"#4f46e5\" /> Section Progress Tracker</h3>"
    new_title = "<h3><Users size={24} color=\"#4f46e5\" /> {SECTIONS.length > 1 ? 'Section Progress Tracker' : 'Course Progress Tracker'}</h3>"
    content = content.replace(old_title, new_title)

    # Change the box name
    old_box_name = "<span className=\"batch-name\" style={{ fontWeight: '700', whiteSpace: 'nowrap', color: isActive ? 'var(--accent-primary)' : 'var(--text-main)' }}>{section}</span>"
    new_box_name = "<span className=\"batch-name\" style={{ fontWeight: '700', whiteSpace: 'nowrap', color: isActive ? 'var(--accent-primary)' : 'var(--text-main)' }}>{SECTIONS.length > 1 ? section : selectedStream}</span>"
    content = content.replace(old_box_name, new_box_name)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
