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

FINAL_TWO = [
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "807",
        "comp_name": "Assignments",
        "mark_key": "ICS_Asgn"
    },
    {
        "group": "BSCB",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8117",
        "subject_name": "Introduction to Computing Skills",
        "component_id": "804",
        "comp_name": "Class Participation",
        "mark_key": "ICS_CP"
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

async def sync_one(page, item, students):
    grp = item["group"]
    cid = item["class_id"]
    cname = item["class_name"]
    sid = item["subject_id"]
    sname = item["subject_name"]
    comp_id = item["component_id"]
    comp_name = item["comp_name"]
    mkey = item["mark_key"]

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

            # Wait for class dropdown and functions to load
            await page.wait_for_selector("#classId", timeout=30000)
            await page.wait_for_function("() => typeof getSubject === 'function'", timeout=30000)

            # 1. Select Class
            print("Selecting class 4660...", flush=True)
            await page.evaluate(f"getSubject('{cid}')")
            await page.evaluate(f"document.getElementById('classId').value = '{cid}'")
            await page.wait_for_function("() => document.querySelectorAll('#subjectId option').length > 1", timeout=30000)

            # 2. Select Subject
            print(f"Selecting subject {sid}...", flush=True)
            await page.evaluate(f'''() => {{
                document.getElementById('subjectId').value = '{sid}';
                getComponentAfterSubject('{sid}');
                getGroups('{sid}');
            }}''')
            await page.wait_for_function("() => document.querySelectorAll('#componentId option').length > 1", timeout=30000)

            # 3. Select Component
            print(f"Selecting component {comp_id}...", flush=True)
            await page.evaluate(f"document.getElementById('componentId').value = '{comp_id}'")
            await page.wait_for_function(f"() => document.getElementById('componentId').value === '{comp_id}'", timeout=10000)

            # 4. Submit selection form
            print("Submitting form to open mark entry table...", flush=True)
            await page.evaluate("submitForm()")
            try:
                await page.wait_for_load_state("domcontentloaded", timeout=35000)
            except:
                pass
            await page.wait_for_timeout(4000)
            await page.wait_for_selector("table tbody tr input", timeout=45000)

            # 5. Populate student marks
            processed_students = []
            for s in students:
                is_abs = s.get("absent", False)
                val = s[mkey]
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

            fill_res = await page.evaluate('''(students) => {
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
                    const q0Inp = document.getElementById(`student_question_marks_${i}_0`);

                    if (totInp) totInp.value = s.total;
                    if (q0Inp) q0Inp.value = s.q0;

                    if (count < 2) {
                        sample.push({ reg: regCell, name: s.name, total: s.total, q0: s.q0 });
                    }
                    count++;
                }

                if (typeof validateOBEMarks === 'function') {
                    validateOBEMarks();
                }

                return { count, totalRows: rows.length, sample };
            }''', processed_students)

            print(f"Populated {fill_res['count']} / {fill_res['totalRows']} student rows on AUERP.", flush=True)
            for s in fill_res['sample']:
                print(f"  Sample: {s['name']} ({s['reg']}) -> Total: {s['total']}", flush=True)

            # 6. Click Save your changes (Strictly Draft Mode)
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

        for i, item in enumerate(FINAL_TWO, start=1):
            print(f"\n>>> Running Final Component {i} of {len(FINAL_TWO)}: {item['subject_name']} {item['comp_name']} <<<", flush=True)
            res = await sync_one(page, item, bscb_students)
            results.append(res)
            await asyncio.sleep(2)

        await browser.close()

    print("\n" + "="*70, flush=True)
    print("ALL REMAINING B.SC SECTION B COMPONENTS SYNCED SUCCESSFULLY IN DRAFT MODE!", flush=True)
    print("="*70, flush=True)
    for r in results:
        print(f"[{r['group']}] {r['subject']} - {r['component']}: {r['count']} students -> {r['banner']}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
