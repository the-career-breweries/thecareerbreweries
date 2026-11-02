import os
import sys
import json
import uvicorn
from starlette.applications import Starlette
from starlette.responses import HTMLResponse, JSONResponse, FileResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles

# Import sync engine
sys.path.append(os.path.dirname(__file__))
from sync_auerp_engine import sync_subject_to_auerp

STORE_FILE = os.path.abspath("scratch/dsa_marks_store.json")
UI_FILE = os.path.abspath("scratch/portal_ui/index.html")

def get_store():
    with open(STORE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_store(store):
    with open(STORE_FILE, "w", encoding="utf-8") as f:
        json.dump(store, f, indent=2)

async def homepage(request):
    with open(UI_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    return HTMLResponse(content)

async def get_subjects(request):
    store = get_store()
    subjects_list = []
    total_all = 0
    graded_all = 0

    short_titles = {
        "BBA_English": "BBA English",
        "BSCA_English": "B.Sc A English",
        "BSCB_English": "B.Sc B English",
        "BSCA_Computing": "B.Sc A Computing",
        "BSCB_Computing": "B.Sc B Computing"
    }

    all_students_index = []
    for sid, sdata in store["subjects"].items():
        students = sdata["students"]
        graded = sum(1 for s in students if s.get("graded") or s.get("is_absent"))
        total = len(students)
        total_all += total
        graded_all += graded

        for st in students:
            all_students_index.append({
                "subject_id": sid,
                "subject_title": short_titles.get(sid, sid),
                "name": st["name"],
                "reg_no": st["reg_no"],
                "sl_no": st["sl_no"]
            })

        subjects_list.append({
            "id": sid,
            "name": sdata["config"]["name"],
            "class_name": sdata["config"]["class_name"],
            "course_code": sdata["config"]["course_code"],
            "short_title": short_titles.get(sid, sid),
            "total_students": total,
            "graded_count": graded,
            "questions_count": len(sdata["questions"])
        })

    overall = {
        "total": total_all,
        "graded": graded_all,
        "percent": round((graded_all / total_all * 100), 1) if total_all > 0 else 0
    }

    return JSONResponse({"subjects": subjects_list, "overall": overall, "all_students": all_students_index})

async def get_courses(request):
    store = get_store()
    courses = []

    # 1. Communicative English
    eng_cohorts = ["BBA_English", "BSCA_English", "BSCB_English"]
    eng_students = []
    eng_graded = 0
    eng_questions = store["subjects"]["BSCA_English"]["questions"]

    class_map = {
        "BBA_English": "BBA",
        "BSCA_English": "B.Sc Sec A",
        "BSCB_English": "B.Sc Sec B"
    }

    for cid in eng_cohorts:
        cdata = store["subjects"][cid]
        for st in cdata["students"]:
            if st.get("graded") or st.get("is_absent"):
                eng_graded += 1
            eng_students.append({
                **st,
                "cohort_id": cid,
                "class_label": class_map.get(cid, cid),
                "class_name": cdata["config"]["class_name"]
            })

    courses.append({
        "id": "english",
        "name": "Communicative English",
        "code": "Z7AVB 26203 / Z7AVA 26203",
        "total_students": len(eng_students),
        "graded_count": eng_graded,
        "questions_count": len(eng_questions),
        "questions": eng_questions,
        "classes": ["All Classes", "B.Sc Sec B", "B.Sc Sec A", "BBA"],
        "cohorts": eng_cohorts
    })

    # 2. Introduction to Computing Skills
    comp_cohorts = ["BSCA_Computing", "BSCB_Computing"]
    comp_students = []
    comp_graded = 0
    comp_questions = store["subjects"]["BSCA_Computing"]["questions"]

    comp_class_map = {
        "BSCA_Computing": "B.Sc Sec A",
        "BSCB_Computing": "B.Sc Sec B"
    }

    for cid in comp_cohorts:
        cdata = store["subjects"][cid]
        for st in cdata["students"]:
            if st.get("graded") or st.get("is_absent"):
                comp_graded += 1
            comp_students.append({
                **st,
                "cohort_id": cid,
                "class_label": comp_class_map.get(cid, cid),
                "class_name": cdata["config"]["class_name"]
            })

    courses.append({
        "id": "computing",
        "name": "Introduction to Computing Skills",
        "code": "Z7AVA 26209",
        "total_students": len(comp_students),
        "graded_count": comp_graded,
        "questions_count": len(comp_questions),
        "questions": comp_questions,
        "classes": ["All Classes", "B.Sc Sec B", "B.Sc Sec A"],
        "cohorts": comp_cohorts
    })

    return JSONResponse({
        "courses": courses,
        "rosters": {
            "english": eng_students,
            "computing": comp_students
        }
    })

async def get_roster(request):
    sub_id = request.query_params.get("subject", "BSCA_Computing")
    store = get_store()
    if sub_id not in store["subjects"]:
        return JSONResponse({"error": "Subject not found"}, status_code=404)

    sdata = store["subjects"][sub_id]
    return JSONResponse({
        "subject_id": sub_id,
        "config": sdata["config"],
        "questions": sdata["questions"],
        "students": sdata["students"]
    })

async def save_student(request):
    data = await request.json()
    student_update = data.get("student")
    sub_id = data.get("subject") or (student_update.get("cohort_id") if student_update else None)

    if not sub_id or not student_update:
        return JSONResponse({"error": "Invalid payload"}, status_code=400)

    store = get_store()
    if sub_id not in store["subjects"]:
        return JSONResponse({"error": f"Subject '{sub_id}' not found"}, status_code=404)

    students = store["subjects"][sub_id]["students"]
    for i, s in enumerate(students):
        if s["reg_no"] == student_update["reg_no"]:
            # Preserve base structure without helper fields leaking into store
            clean_update = {
                "sl_no": s["sl_no"],
                "name": s["name"],
                "reg_no": s["reg_no"],
                "marks": student_update.get("marks", s["marks"]),
                "total": student_update.get("total", s["total"]),
                "is_absent": student_update.get("is_absent", s["is_absent"]),
                "graded": student_update.get("graded", s["graded"])
            }
            students[i] = clean_update
            break

    save_store(store)
    return JSONResponse({"success": True})

async def sync_endpoint(request):
    data = await request.json()
    sub_id = data.get("subject")
    is_final = data.get("is_final", False)

    if not sub_id:
        return JSONResponse({"error": "Subject required"}, status_code=400)

    try:
        res = await sync_subject_to_auerp(sub_id, is_final_submit=is_final)
        return JSONResponse(res)
    except Exception as e:
        return JSONResponse({"success": False, "message": str(e)}, status_code=500)

async def serve_screenshot(request):
    path = request.query_params.get("path")
    if path and os.path.exists(path):
        return FileResponse(path)
    return JSONResponse({"error": "File not found"}, status_code=404)

app = Starlette(
    routes=[
        Route("/", homepage),
        Route("/api/courses", get_courses),
        Route("/api/subjects", get_subjects),
        Route("/api/roster", get_roster),
        Route("/api/save", save_student, methods=["POST"]),
        Route("/api/sync", sync_endpoint, methods=["POST"]),
        Route("/screenshot", serve_screenshot)
    ]
)

if __name__ == "__main__":
    port = 8500
    print(f"Starting AUERP DSA Marks Entry Portal at http://localhost:{port}...")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
