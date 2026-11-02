import asyncio
import os
import sys
import json
from decimal import Decimal, ROUND_HALF_UP
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
DATA_FILE = os.path.abspath("scratch/other_components_marks.json")

def round1(val):
    if val is None or val == '': return 0.0
    return float(Decimal(str(val)).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP))

async def test_bsca_a1():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        all_data = json.load(f)
    students = all_data["BSCA"]

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Select BSCA English
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8046'")
        await page.evaluate("getComponentAfterSubject('8046')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.wait_for_timeout(1000)

        await page.evaluate("submitForm()")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=25000)
        except:
            pass
        await page.wait_for_timeout(3000)
        await page.wait_for_selector("table tbody tr input", timeout=20000)

        # Prepare 1-decimal rounded payload
        processed_students = []
        for s in students:
            t = round1(s["CE_A1"])
            processed_students.append({
                "reg_no": s["reg_no"],
                "name": s["name"],
                "mark": t,
                "absent": s.get("absent", False)
            })

        fill_res = await page.evaluate('''(students) => {
            const studentsByReg = {};
            for (const s of students) {
                studentsByReg[s.reg_no] = s;
            }

            const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(r => r.querySelectorAll('input').length > 0);
            let count = 0;
            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
                const regCell = cells.find(c => c.includes('PROV/ASAV/'));
                if (!regCell || !studentsByReg[regCell]) continue;
                const s = studentsByReg[regCell];

                const totInp = document.getElementById(`student_total_mark_${i}`);
                const qInp = document.getElementById(`student_question_marks_${i}_0`);

                if (s.absent) {
                    if (totInp) totInp.value = 'AB';
                    if (qInp) qInp.value = '0';
                } else {
                    const mStr = s.mark.toString();
                    if (totInp) totInp.value = mStr;
                    if (qInp) qInp.value = mStr;
                }
                count++;
            }
            if (typeof validateOBEMarks === 'function') {
                validateOBEMarks();
            }
            return { count, totalRows: rows.length };
        }''', processed_students)

        print(f"Populated {fill_res['count']} / {fill_res['totalRows']} student rows.")

        # Click Save your changes
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

        shot = "scratch/test_bsca_a1_round1_result.png"
        await page.screenshot(path=shot, full_page=True)

        body_text = await page.evaluate("document.body.innerText")
        banner = "No banner"
        for line in body_text.split("\n"):
            line_str = line.strip()
            if any(k in line_str.lower() for k in ["success", "saved", "error", "entered", "valid"]):
                print(f"  AUERP banner: {line_str}")
                banner = line_str

        print(f"Result screenshot saved: {shot}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_bsca_a1())
