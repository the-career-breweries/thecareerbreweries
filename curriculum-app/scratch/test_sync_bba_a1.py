import asyncio
import os
import sys
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
DATA_FILE = os.path.abspath("scratch/other_components_marks.json")

async def test_bba_a1():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        all_data = json.load(f)
    bba_students = {s["reg_no"]: s for s in all_data["BBA"]}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        print("Navigating to AUERP...")
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Select BBA English
        print("Selecting class 4661, subject 8040, component 777...")
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.wait_for_timeout(1000)

        await page.evaluate("submitForm()")
        await page.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(3000)

        # Fill marks
        fill_res = await page.evaluate('''(studentsMap) => {
            const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(r => r.querySelectorAll('input').length > 0);
            let filledCount = 0;
            const log = [];

            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
                // find register no in cells
                const regCell = cells.find(c => c.includes('PROV/ASAV/'));
                if (!regCell || !studentsMap[regCell]) {
                    log.push(`Row ${i}: student not found for cell ${regCell}`);
                    continue;
                }
                const s = studentsMap[regCell];
                const totalInp = document.getElementById(`student_total_mark_${i}`);
                const qInp = document.getElementById(`student_question_marks_${i}_0`);

                if (s.absent) {
                    if (totalInp) totalInp.value = 'AB';
                    if (qInp) qInp.value = '0';
                } else {
                    const markStr = s.A1.toString();
                    if (totalInp) totalInp.value = markStr;
                    if (qInp) qInp.value = markStr;
                }
                filledCount++;
                log.push(`Row ${i}: ${s.name} (${regCell}) -> Total: ${totalInp.value}, Q1: ${qInp.value}`);
            }

            if (typeof validateOBEMarks === 'function') {
                validateOBEMarks();
            }

            return { filledCount, totalRows: rows.length, log };
        }''', bba_students)

        print(f"Filled {fill_res['filledCount']} of {fill_res['totalRows']} rows:")
        for l in fill_res['log'][:5]:
            print("  ", l)

        await page.screenshot(path="scratch/test_bba_a1_before_save.png", full_page=True)

        # Click Save your changes
        print("Clicking Save your changes (#btn_save_your_changes)...")
        save_btn = page.locator("#btn_save_your_changes")
        if await save_btn.count() > 0:
            await save_btn.first.click()
        else:
            await page.evaluate("saveQuestionWiseMarks2()")

        try:
            await page.wait_for_load_state("domcontentloaded", timeout=20000)
        except:
            pass
        await page.wait_for_timeout(4000)

        # Capture result screenshot
        await page.screenshot(path="scratch/test_bba_a1_after_save.png", full_page=True)

        body_text = await page.evaluate("document.body.innerText")
        for line in body_text.split("\n"):
            line_str = line.strip()
            if any(k in line_str.lower() for k in ["success", "saved", "error", "entered"]):
                print(f"  AUERP banner: {line_str}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_bba_a1())
