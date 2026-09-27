import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add weekNumber={activeNotesLesson.week}
    if 'weekNumber={activeNotesLesson.week}' not in content:
        content = content.replace(
            "onClose={() => setActiveNotesLesson(null)}",
            "onClose={() => setActiveNotesLesson(null)}\n              weekNumber={activeNotesLesson.week}"
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
