import os
import sys
import datetime
import re

sys.stdout.reconfigure(encoding='utf-8')
PRO_DIR = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural"
os.chdir(PRO_DIR)
sys.path.append(PRO_DIR)

CATEGORIES = [
    "",
    "Classes taught",
    "Class preparation",
    "Faculty development",
    "Exams, events & duty",
    "Evaluation",
    "Admin, records & coordination",
    "Research & documentation",
    "Lunch",
    "Leave / Other"
]

def categorize_official_activity(cell_text, slot="", day_name=""):
    t = str(cell_text).strip()
    tl = t.lower()
    
    # 1. Direct category prefix match
    for cat in CATEGORIES:
        if cat and (tl.startswith(cat.lower() + ":") or tl.startswith(cat.lower() + " -") or tl.startswith(cat.lower() + "–")):
            desc = t[len(cat):].strip().lstrip(":-– ")
            return cat, desc if desc else t
            
    # 2. Check for lunch
    if "lunch" in tl:
        return "Lunch", "Lunch"
        
    # 3. Check for leave / holiday (using whole word matching to avoid 'classes' matching 'cl')
    if any(k in tl for k in ["holiday", "casual leave", "on duty"]) or re.search(r'\b(leave|cl|od)\b', tl):
        return "Leave / Other", t
        
    # 4. Faculty development
    if any(k in tl for k in ["calibration", "fdp", "faculty dev", "orientation", "pedagogy", "workshop", "webinar"]):
        return "Faculty development", t
        
    # 5. Exams, events & duty (Evaluation, SEE QP, question paper, invigilation, marks entry)
    if any(k in tl for k in ["evaluation", "evaluat", "see qp", "qp setting", "qp draft", "qp pattern", 
                            "setting see", "sem end exam", "answer script", "invigilation", "question paper", "exam duty", "marks updation", "marks entry"]):
        return "Exams, events & duty", t
        
    # 6. Class preparation (Lesson plan, prep)
    if any(k in tl for k in ["lesson plan", "lesson prep", "class prep", "prep for", "preparation", "learning aids"]):
        return "Class preparation", t
        
    # 7. Admin, records & coordination
    if any(k in tl for k in ["admin", "meeting", "coordination", "erp", "auerp", "lms", "attendance", 
                            "onboarding", "report generation", "email coord", "records", "dsa component", "co mapping"]):
        return "Admin, records & coordination", t
        
    # 8. Research & documentation
    if any(k in tl for k in ["research", "documentation of work", "course catalogue review", "journal", "paper draft"]):
        return "Research & documentation", t
        
    # 9. Classes taught (teaching subjects, topics, revisions, lectures)
    teaching_keywords = [
        "communicative english", "soft skills", "softskills", "computing skills", 
        "computing", "ics", "bba", "b.sc", "bsc", "revision", "recap", 
        "pivot table", "vlookup", "hlookup", "grammar", "writing skills", 
        "paragraph writing", "email writing", "group discussion", "lecture", "taught", "class", "session"
    ]
    if any(k in tl for k in teaching_keywords):
        return "Classes taught", t
        
    # Default fallback
    return "Classes taught", t

# Test Wednesday cells
cells_wed = [
    ('09:00 - 09:55', 'DSA Component Configuration'),
    ('10:00 - 10:55', 'DSA Component Configuration'),
    ('11:00 - 11:55', 'DSA Component Configuration'),
    ('12:00 - 12:55', 'Revision Classes: English'),
    ('01:00 - 01:55', 'Revision Classes: English'),
    ('02:00 - 02:55', 'Revision Classes: Computing Skills'),
    ('03:00 - 03:55', 'LUNCH'),
    ('04:00 - 04:15', 'Assignment Evaluation'),
    ('04:15 - 05:15', 'Assignment Evaluation')
]

print("Wednesday 28-Oct Activity Categorization:")
wed_hours = 0.0
for slot, c_val in cells_wed:
    cat, desc = categorize_official_activity(c_val, slot, "Wednesday")
    hrs = 0.25 if ("04:00" in slot and "04:15" in slot) else (0.0 if cat.lower() in ["lunch", "leave / other"] else 1.0)
    wed_hours += hrs
    print(f"  [{slot}] {hrs:4.2f}h | {cat:30s} | {desc}")

print(f"\nTotal Wednesday hours: {wed_hours:.2f} hrs")
