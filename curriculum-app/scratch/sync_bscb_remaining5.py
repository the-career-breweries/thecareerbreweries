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

BSCB_REMAINING_5 = [
    # Communicative English (8046)
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
    # Introduction to Computing Skills (8117)
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

async def safe_goto(page, url, retries=5):
    for i in range(retries):
        try:
            print(f"safe_goto attempt {i+1} to {url}...", flush=True)
            await page.goto(url, timeout=120000, wait_until="domcontentloaded")
            return
        except Exception as e:
            print(f"safe_goto attempt {i+1} failed: {e}. Retrying in 5s...", flush=True)
            await asyncio.sleep(5)
    raise RuntimeError(f"Failed to navigate to {url} after {retries} attempts.")

async def sync_bscb_component(page, item, students):
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
    print(f"Syncing [{grp}] {sname} -> {comp_name}", flush=True)
    print(f"Class ID: {cid}, Subject ID: {sid}, Component ID: {comp_id}", flush=True)
    print(f"=======================================================", flush=True)

    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
            await safe_goto(page, entry_url)
            await page.wait_for_timeout(3000)

            # 1. Select Class
            await page.evaluate(f"getSubject('{cid}')")
            await page.evaluate(f"document.getElementById('classId').value = '{cid}'")
            await page.wait_for_function("() => document.querySelectorAll('#subjectId option').length > 1", timeout=30000)

            # 2. Select Subject
            await page.evaluate(f'''() => {{
                document.getElementById('subjectId').value = '{sid}';
                getComponentAfterSubject('{sid}');
                getGroups('{sid}');
            }}''')
            await page.wait_for_function("() => document.querySelectorAll('#componentId option').length > 1", timeout=30000)

            # 3. Select Component
            await page.evaluate(f"document.getElementById('componentId').value = '{comp_id}'")
            await page.wait_for_function(f"() => document.getElementById('componentId').value === '{comp_id}'", timeout=10000)

            # 4. Open Mark Entry Form
            await page.evaluate("submitForm()")
            try:
                await page.wait_for_load_state("domcontentloaded", timeout=45000)
            except:
                pass
            await page.wait_for_timeout(4000)
            await page.wait_for_selector("table tbody tr input", timeout=45000)

            # 5. Prepare rounded student marks
            processed_students = []
            for s in students:
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

                        if (count < 2) {
                            sample.push({ reg: regCell, name: s.name, total: s.total, q0: s.q0, q1: s.q1, q2: s.q2 });
                        }
                    } else {
                        const q0Inp = document.getElementById(`student_question_marks_${i}_0`);
                        if (totInp) totInp.value = s.total;
                        if (q0Inp) q0Inp.value = s.q0;

                        if (count < 2) {
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
                print(f"  Sample: {s['name']} ({s['reg']}) -> Total: {s['total']}", flush=True)

            # 6. Save your changes (Draft Mode)
            print("Clicking 'Save your changes' (#btn_save_your_changes)...", flush=True)
            save_btn = page.locator("#btn_save_your_changes")
            if await save_btn.count() > 0:
                await save_btn.first.click()
            else:
                await page.evaluate("saveQuestionWiseMarks2()")

            try:
                await page.wait_for_load_state("domcontentloaded", timeout=35000)
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
            await asyncio.sleep(5)

async def main():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        all_data = json.load(f)

    bscb_students = all_data["BSCB"]
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        for i, item in enumerate(BSCB_REMAINING_5, start=1):
            print(f"\n>>> Running BSCB Component {i} of {len(BSCB_REMAINING_5)}: {item['subject_name']} {item['comp_name']} <<<", flush=True)
            res = await sync_bscb_component(page, item, bscb_students)
            results.append(res)
            await asyncio.sleep(2)

        await browser.close()

    print("\n" + "="*70, flush=True)
    print("ALL 5 REMAINING B.SC SECTION B COMPONENTS SYNCED SUCCESSFULLY IN DRAFT MODE!", flush=True)
    print("="*70, flush=True)
    for r in results:
        print(f"[{r['group']}] {r['subject']} - {r['component']}: {r['count']} students -> {r['banner']}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
