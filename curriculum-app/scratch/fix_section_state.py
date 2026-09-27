import os
import re

files_to_update = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx'
]

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace SECTIONS and state
    # We will find the exact block by looking for SECTIONS
    old_state_pattern = r"const SECTIONS = \['Section 1', 'Section 2', 'Section 3', 'Section 4'\];\s*const \[activeSection, setActiveSection\] = useState<string>\('Section 1'\);\s*const \[sectionProgress, setSectionProgress\] = useState<Record<string, number>>\(\{\s*'Section 1': 0, 'Section 2': 0, 'Section 3': 0, 'Section 4': 0\s*\}\);"
    
    new_state = """const SECTIONS = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];
    const [activeSection, setActiveSection] = useState<string>('Default');
    const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});
    const [sessionProgress, setSessionProgress] = useState<Record<number, number>>({});

    useEffect(() => {
      const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];
      if (currentSections.length > 0) {
        if (!currentSections.includes(activeSection)) {
            setActiveSection(currentSections[0]);
        }
      } else {
        setActiveSection('Default');
      }
    }, [selectedStream, activeSection]);"""
    
    content = re.sub(old_state_pattern, new_state, content)

    # For Computing Skills and Communicative English, make sure we use SECTIONS instead of program === 'ug'
    if "className=\"batch-tracker-card\"" in content:
        # communicative-english and computing-skills use batch-tracker-card
        old_cond = r"\{program === 'ug' && !selectedStream.includes\('Aviation'\) && \("
        new_cond = r"{SECTIONS.length > 0 && ("
        content = re.sub(old_cond, new_cond, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
