import openpyxl
import json
import glob
import os
import re

TEMPLATES_DIR = r"scratch/templates"
STORE_FILE = r"scratch/dsa_marks_store.json"

SUBJECT_CONFIGS = [
    {
        "id": "BBA_English",
        "name": "Communicative English",
        "class_name": "I_ASAS_BBA_2026",
        "class_id": "4661",
        "subject_id": "8040",
        "course_code": "Z7AVB 26203",
        "total_max_marks": 50.0,
        "template_file": "BBA_English.xlsx"
    },
    {
        "id": "BSCA_English",
        "name": "Communicative English",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "class_id": "4659",
        "subject_id": "8046",
        "course_code": "Z7AVA 26203",
        "total_max_marks": 50.0,
        "template_file": "BSCA_English.xlsx"
    },
    {
        "id": "BSCB_English",
        "name": "Communicative English",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "class_id": "4660",
        "subject_id": "8046",
        "course_code": "Z7AVA 26203",
        "total_max_marks": 50.0,
        "template_file": "BSCB_English.xlsx"
    },
    {
        "id": "BSCA_Computing",
        "name": "Introduction to Computing Skills",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "class_id": "4659",
        "subject_id": "8117",
        "course_code": "Z7AVA 26209",
        "total_max_marks": 50.0,
        "template_file": "BSCA_Computing.xlsx"
    },
    {
        "id": "BSCB_Computing",
        "name": "Introduction to Computing Skills",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "class_id": "4660",
        "subject_id": "8117",
        "course_code": "Z7AVA 26209",
        "total_max_marks": 50.0,
        "template_file": "BSCB_Computing.xlsx"
    }
]

def init_store():
    # If store already exists, load existing marks so we don't overwrite user's work
    existing_store = {}
    if os.path.exists(STORE_FILE):
        try:
            with open(STORE_FILE, "r", encoding="utf-8") as f:
                existing_store = json.load(f)
        except Exception as e:
            print("Could not load existing store, creating fresh:", e)

    store = {"subjects": {}, "last_updated": None}

    for cfg in SUBJECT_CONFIGS:
        sid = cfg["id"]
        filepath = os.path.join(TEMPLATES_DIR, cfg["template_file"])
        if not os.path.exists(filepath):
            print(f"Warning: {filepath} does not exist!")
            continue

        wb = openpyxl.load_workbook(filepath)
        ws = wb.active

        # Extract Question headers: Q: 1 (Max Mark: 2)
        questions = []
        for col in range(5, ws.max_column + 1):
            val = ws.cell(1, col).value
            if val and str(val).startswith("Q:"):
                # Parse Question No and Max Mark
                m = re.search(r"Q:\s*(\d+)\s*\(Max\s*Mark:\s*([\d\.]+)\)", str(val), re.IGNORECASE)
                if m:
                    q_no = int(m.group(1))
                    max_mark = float(m.group(2))
                    questions.append({
                        "q_no": q_no,
                        "max_mark": max_mark,
                        "label": f"Q{q_no}",
                        "col_idx": col
                    })
                else:
                    questions.append({
                        "q_no": col - 4,
                        "max_mark": 5.0,
                        "label": f"Q{col - 4}",
                        "col_idx": col
                    })

        # Extract Students
        students = []
        for row in range(2, ws.max_row + 1):
            sl_no = ws.cell(row, 1).value
            name = ws.cell(row, 2).value
            reg_no = ws.cell(row, 3).value
            if not name or not reg_no:
                continue

            # Check if this student already has entered marks in existing_store
            existing_student_marks = None
            existing_total = None
            is_absent = False
            graded = False

            if sid in existing_store.get("subjects", {}):
                for s in existing_store["subjects"][sid].get("students", []):
                    if s["reg_no"] == str(reg_no).strip():
                        existing_student_marks = s.get("marks")
                        existing_total = s.get("total")
                        is_absent = s.get("is_absent", False)
                        graded = s.get("graded", False)
                        break

            marks_dict = existing_student_marks if existing_student_marks else {str(q["q_no"]): "" for q in questions}

            students.append({
                "sl_no": int(sl_no) if sl_no else row - 1,
                "name": str(name).strip(),
                "reg_no": str(reg_no).strip(),
                "marks": marks_dict,
                "total": existing_total if existing_total is not None else "",
                "is_absent": is_absent,
                "graded": graded
            })

        store["subjects"][sid] = {
            "config": cfg,
            "questions": questions,
            "students": students,
            "total_students": len(students)
        }
        print(f"Loaded {sid}: {len(students)} students, {len(questions)} questions")

    with open(STORE_FILE, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)
    print(f"\nStore successfully initialized to {STORE_FILE}!")

if __name__ == '__main__':
    init_store()
