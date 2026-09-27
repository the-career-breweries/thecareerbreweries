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

    # 1. Fix the SECTIONS logic to return ['Global Cohort'] instead of [] for BBA
    old_section_logic1 = "const SECTIONS = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];"
    new_section_logic1 = "const SECTIONS = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];"
    content = content.replace(old_section_logic1, new_section_logic1)

    old_section_logic2 = "const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : [];"
    new_section_logic2 = "const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];"
    content = content.replace(old_section_logic2, new_section_logic2)

    old_section_logic3 = "const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Default'];"
    new_section_logic3 = "const currentSections = selectedStream.includes('B.Sc') ? ['Section A', 'Section B'] : ['Global Cohort'];"
    content = content.replace(old_section_logic3, new_section_logic3)
    
    # 2. For Computing Skills only, filter the streams list to ONLY B.Sc
    if 'computing-skills' in filepath:
        old_streams = "const streams = curriculumData[program].streams;"
        new_streams = "const streams = curriculumData[program].streams.filter(s => s.streamName.includes('B.Sc'));"
        content = content.replace(old_streams, new_streams)
        
        # Also, setSelectedStream must default to streams[0] if the current selectedStream isn't in streams
        old_state = "const [selectedStream, setSelectedStream] = useState<string>(streams[0].streamName);"
        new_state = "const [selectedStream, setSelectedStream] = useState<string>(streams.length > 0 ? streams[0].streamName : '');"
        content = content.replace(old_state, new_state)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
