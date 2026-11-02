import asyncio
import os
import sys
import json
from decimal import Decimal, ROUND_HALF_UP
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
DATA_FILE = os.path.abspath("scratch/other_components_marks.json")

def round1(val):
    if val is None or val == '' or val == 'AB':
        return val
    try:
        return float(Decimal(str(val)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP))
    except:
        return val

def split3(T):
    T = round1(T)
    if T >= 13.5:
        q0 = 1.5
        q2 = 1.5
        q1 = round1(T - 3.0)
    else:
        q0 = round1(T * 0.1)
        q2 = round1(T * 0.1)
        q1 = round1(T - q0 - q2)
    return q0, q1, q2

# Target schedule in exact user order:
# 1. BBA
# 2. B.Sc - A
# 3. B.Sc - B
SCHEDULE = [
    # --- 1. BBA (4661) ---
    {
        "group": "BBA",
        "class_id": "4661",
        "class_name": "I_ASAS_BBA_2026",
        "subject_id": "8040",
        "subject_name": "Communicative English",
        "component_id": "777",
        "comp_name": "Assignment 1",
        "mark_key": "A1",
        "is_multi_q": False
    },
    {
        "group": "BBA",
        "class_id": "4661",
        "class_name": "I_ASAS_BBA_2026",
        "subject_id": "8040",
        "subject_name": "Communicative English",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "Asgn",
        "is_multi_q": False
    },
    {
        "group": "BBA",
        "class_id": "4661",
        "class_name": "I_ASAS_BBA_2026",
        "subject_id": "8040",
        "subject_name": "Communicative English",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "CP",
        "is_multi_q": False
    },

    # --- 2. B.Sc - Section A (4659) ---
    # Communicative English
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "777",
        "comp_name": "Assignment 1",
        "mark_key": "CE_A1",
        "is_multi_q": False
    },
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "CE_Asgn",
        "is_multi_q": False
    },
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "CE_CP",
        "is_multi_q": False
    },
    # Introduction to Computing Skills
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "777",
        "comp_name": "Assignment 1",
        "mark_key": "ICS_A1",
        "is_multi_q": True  # 3 questions: Q1 (1.5), Q2 (12), Q3 (1.5)
    },
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "ICS_Asgn",
        "is_multi_q": False
    },
    {
        "group": "BSCA",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "ICS_CP",
        "is_multi_q": False
    },

    # --- 3. B.Sc - Section B (4660) ---
    # Communicative English
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "777",
        "comp_name": "Assignment 1",
        "mark_key": "CE_A1",
        "is_multi_q": False
    },
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "CE_Asgn",
        "is_multi_q": False
    },
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "CE_CP",
        "is_multi_q": False
    },
    # Introduction to Computing Skills
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "777",
        "comp_name": "Assignment 1",
        "mark_key": "ICS_A1",
        "is_multi_q": True  # 3 questions: Q1 (1.5), Q2 (12), Q3 (1.5)
    },
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "ICS_Asgn",
        "is_multi_q": False
    },
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "ICS_CP",
        "is_multi_q": False
    }
]

async def sync_single_component(page, item, students_map):
    grp = item["group"]
    cid = item["class_id"]
    cname = item["class_name"]
    sid = item["subject_id"]
    sname = item["subject_name"]
    comp_id = item["component_id"]
    comp_name = item["comp_name"]
    mkey = item["mark_key"]
    is_multi = item["is_multi_q"]

    print(f"\n=======================================================", flush=True)
    print(f"Syncing: {grp} - {sname} -> {comp_name}", flush=True)
    print(f"Class: {cname} ({cid}), Subject: {sid}, Component: {comp_id}", flush=True)
    print(f"=======================================================", flush=True)

    max_retries = 2
    for attempt in range(1, max_retries + 1):
        try:
            entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
            await page.goto(entry_url, timeout=45000)
            await page.wait_for_timeout(2500)

            # 1. Select Class
            await page.evaluate(f"getSubject('{cid}')")
            await page.evaluate(f"document.getElementById('classId').value = '{cid}'")
            await page.wait_for_timeout(2000)

            # 2. Select Subject
            await page.evaluate(f"document.getElementById('subjectId').value = '{sid}'")
            await page.evaluate(f"getComponentAfterSubject('{sid}')")
            await page.wait_for_timeout(2000)

            # 3. Select Component
            await page.evaluate(f"document.getElementById('componentId').value = '{comp_id}'")
            await page.wait_for_timeout(1000)

            # 4. Open Mark Entry Form
            await page.evaluate("submitForm()")
            try:
                await page.wait_for_load_state("domcontentloaded", timeout=25000)
            except:
                pass
            await page.wait_for_timeout(3000)
            await page.wait_for_selector("table tbody tr input", timeout=20000)

            # 5. Prepare rounded student marks
            raw_students = students_map[grp]
            processed_students = []
            for s in raw_students:
                is_abs = s.get("absent", False) or (mkey == "ICS_A1" and s.get("ics_a1_absent", False))
                val = s[mkey]
                if is_multi:
                    if is_abs:
                        processed_students.append({
                            "reg_no": s["reg_no"],
                            "name": s["name"],
                            "total": "AB",
                            "q0": "0",
                            "q1": "0",
                            "q2": "0",
                            "absent": True
                        })
                    else:
                        t = round1(val)
                        q0, q1, q2 = split3(t)
                        processed_students.append({
                            "reg_no": s["reg_no"],
                            "name": s["name"],
                            "total": str(t),
                            "q0": str(q0),
                            "q1": str(q1),
                            "q2": str(q2),
                            "absent": False
                        })
                else:
                    if is_abs:
                        processed_students.append({
                            "reg_no": s["reg_no"],
                            "name": s["name"],
                            "total": "AB",
                            "q0": "0",
                            "absent": True
                        })
                    else:
                        t = round1(val)
                        processed_students.append({
                            "reg_no": s["reg_no"],
                            "name": s["name"],
                            "total": str(t),
                            "q0": str(t),
                            "absent": False
                        })

            payload = {
                "students": processed_students,
                "is_multi_q": is_multi
            }

            fill_res = await page.evaluate('''(data) => {
                const students = data.students;
                const isMulti = data.is_multi_q;

                const studentsByReg = {};
                for (const s of students) {
                    studentsByReg[s.reg_no] = s;
                }

                const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(r => r.querySelectorAll('input').length > 0);
                let count = 0;
                const sample = [];

                for (let i = 0; i < rows.length; i++) {
                    const r = rows[i];
                    const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
                    const regCell = cells.find(c => c.includes('PROV/ASAV/'));
                    if (!regCell || !studentsByReg[regCell]) {
                        continue;
                    }
                    const s = studentsByReg[regCell];
                    const totInp = document.getElementById(`student_total_mark_${i}`);

                    if (isMulti) {
                        const q0Inp = document.getElementById(`student_question_marks_${i}_0`);
                        const q1Inp = document.getElementById(`student_question_marks_${i}_1`);
                        const q2Inp = document.getElementById(`student_question_marks_${i}_2`);

                        if (totInp) totInp.value = s.total;
                        if (q0Inp) q0Inp.value = s.q0;
                        if (q1Inp) q1Inp.value = s.q1;
                        if (q2Inp) q2Inp.value = s.q2;

                        if (count < 3) {
                            sample.push({ reg: regCell, name: s.name, total: s.total, q0: s.q0, q1: s.q1, q2: s.q2 });
                        }
                    } else {
                        const q0Inp = document.getElementById(`student_question_marks_${i}_0`);
                        if (totInp) totInp.value = s.total;
                        if (q0Inp) q0Inp.value = s.q0;

                        if (count < 3) {
                            sample.push({ reg: regCell, name: s.name, total: s.total, q0: s.q0 });
                        }
                    }
                    count++;
                }

                if (typeof validateOBEMarks === 'function') {
                    validateOBEMarks();
                }

                return { count, totalRows: rows.length, sample };
            }''', payload)

            print(f"Populated {fill_res['count']} / {fill_res['totalRows']} student rows on AUERP.", flush=True)
            for s in fill_res['sample']:
                print(f"  {s['name']} ({s['reg']}) -> Total: {s['total']}", flush=True)

            # 6. Save your changes (Strictly Draft Mode)
            print("Clicking 'Save your changes' (#btn_save_your_changes)...", flush=True)
            save_btn = page.locator("#btn_save_your_changes")
            if await save_btn.count() > 0:
                await save_btn.first.click()
            else:
                await page.evaluate("saveQuestionWiseMarks2()")

            try:
                await page.wait_for_load_state("domcontentloaded", timeout=25000)
            except:
                pass
            await page.wait_for_timeout(4000)

            # 7. Screenshot and Banner Verification
            shot_filename = f"scratch/sync_{grp}_{sname.replace(' ', '_')}_{comp_name.replace(' ', '_')}.png"
            await page.screenshot(path=shot_filename, full_page=True)

            banner_msg = "No banner detected"
            body_text = await page.evaluate("document.body.innerText")
            for line in body_text.split("\n"):
                line_str = line.strip()
                if any(k in line_str.lower() for k in ["success", "saved", "error", "entered", "valid"]):
                    banner_msg = line_str
                    break

            print(f"AUERP Status: {banner_msg}", flush=True)
            print(f"Saved screenshot: {shot_filename}", flush=True)

            if "not valid" in banner_msg.lower():
                raise RuntimeError(f"Validation error: {banner_msg}")

            return {
                "group": grp,
                "class": cname,
                "subject": sname,
                "component": comp_name,
                "count": fill_res['count'],
                "banner": banner_msg,
                "screenshot": shot_filename
            }

        except Exception as e:
            print(f"Attempt {attempt} failed with error: {e}", flush=True)
            if attempt == max_retries:
                raise e
            await asyncio.sleep(4)

async def main():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        all_data = json.load(f)

    students_map = {
        "BBA": all_data["BBA"],
        "BSCA": all_data["BSCA"],
        "BSCB": all_data["BSCB"]
    }

    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        for i, item in enumerate(SCHEDULE, start=1):
            print(f"\n>>> Running Component {i} of {len(SCHEDULE)}: {item['group']} {item['subject_name']} {item['comp_name']} <<<", flush=True)
            res = await sync_single_component(page, item, students_map)
            results.append(res)
            await asyncio.sleep(2)

        await browser.close()

    print("\n" + "="*70, flush=True)
    print("ALL OTHER DSA COMPONENTS SYNCED SUCCESSFULLY IN DRAFT MODE!", flush=True)
    print("="*70, flush=True)
    for r in results:
        print(f"[{r['group']}] {r['subject']} - {r['component']}: {r['count']} students -> {r['banner']}", flush=True)

    with open("scratch/other_components_sync_summary.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())
