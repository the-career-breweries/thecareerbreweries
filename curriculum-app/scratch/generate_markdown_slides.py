import json
import os

notes_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
with open(notes_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

courses = {
    "Communicative English": {
        "base_folder": "english-lessons",
        "keys": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
    },
    "Computing Skills": {
        "base_folder": "computing-skills",
        "keys": ["1", "2", "3", "4", "5", "6", "Mid-Sem", "7", "8", "9", "10", "11", "12", "13", "14"]
    }
}

streams = ["bsc-aviation", "bba-aviation"]

base_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content'

for course_name, meta in courses.items():
    folder_name = meta["base_folder"]
    course_data = data.get(course_name, {})
    
    for stream in streams:
        target_dir = os.path.join(base_dir, folder_name, 'ug', stream, 'sem1')
        os.makedirs(target_dir, exist_ok=True)
        
        for key in meta["keys"]:
            session_data = course_data.get(key)
            if not session_data:
                continue
                
            slides = []
            
            # Slide 1: Title
            title = f"# Session {key}\n## {course_name}"
            slides.append(title)
            
            # Slide 2: Key Concepts
            kc_slide = "## Key Concepts\n"
            for kc in session_data.get("keyConcepts", []):
                kc_slide += f"- **{kc['title']}**: {kc['explanation']}\n"
            slides.append(kc_slide)
            
            # Slide 3: Definitions
            def_slide = "## Important Definitions\n"
            for d in session_data.get("definitions", []):
                def_slide += f"- **{d['term']}**: {d['definition']}\n"
            slides.append(def_slide)
            
            # Slide 4: Mnemonic
            mnem = session_data.get("mnemonic", {})
            m_slide = f"## Mnemonic: {mnem.get('acronym', '')}\n"
            for pt in mnem.get("points", []):
                m_slide += f"- {pt}\n"
            slides.append(m_slide)
            
            # Slide 5: Questions
            q_slide = "## Knowledge Check (BTL)\n"
            btl = session_data.get("btlQuestions", {})
            for level, q in btl.items():
                q_slide += f"- **{level}**: {q}\n"
            slides.append(q_slide)
            
            # Slide 6: References
            r_slide = "## Reference Material\n"
            ref = session_data.get("referenceMaterial", {})
            r_slide += f"- **Primary**: {ref.get('primary', '')}\n"
            r_slide += f"- **Further Reading**: {ref.get('further', '')}\n"
            slides.append(r_slide)
            
            markdown_content = "\n\n---\n\n".join(slides)
            
            file_name = f"week{key}.md"
            file_path = os.path.join(target_dir, file_name)
            
            with open(file_path, 'w', encoding='utf-8') as mf:
                mf.write(markdown_content)

print("Generated markdown files.")
