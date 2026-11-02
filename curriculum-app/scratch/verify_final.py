import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def verify_sections():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        for class_id, class_name in [("4659", "I_ASAS_BSC_2026_SECA"), ("4660", "I_ASAS_BSC_2026_SECB")]:
            url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
            await page.goto(url, timeout=45000)
            await page.wait_for_timeout(2500)

            await page.evaluate(f"getSubject('{class_id}')")
            await page.evaluate(f"document.getElementById('classId').value = '{class_id}'")
            await page.wait_for_timeout(2000)

            await page.evaluate("document.getElementById('subjectId').value = '8046'")
            await page.evaluate("getComponentAfterSubject('8046')")
            await page.wait_for_timeout(2000)

            await page.evaluate("document.getElementById('componentId').value = '778'")
            await page.wait_for_timeout(1000)

            await page.evaluate("getQuestionAndCOMapping()")
            await page.wait_for_load_state("networkidle", timeout=15000)
            await page.wait_for_timeout(3000)

            saved_rows = await page.evaluate('''() => {
                let rows = [];
                for (let i = 0; i < 15; i++) {
                    let q = document.getElementById("obe_question_no_" + i);
                    let m = document.getElementById("obe_max_marks_" + i);
                    if (q && m && m.value) {
                        rows.push({
                            q: q.value,
                            m: m.value,
                            co1: document.getElementById("courseMapping_" + i + "_0") ? document.getElementById("courseMapping_" + i + "_0").value : null,
                            co2: document.getElementById("courseMapping_" + i + "_1") ? document.getElementById("courseMapping_" + i + "_1").value : null,
                            co3: document.getElementById("courseMapping_" + i + "_2") ? document.getElementById("courseMapping_" + i + "_2").value : null,
                            co4: document.getElementById("courseMapping_" + i + "_3") ? document.getElementById("courseMapping_" + i + "_3").value : null
                        });
                    }
                }
                return rows;
            }''')

            print(f"Verified {class_name}: {len(saved_rows)} questions saved.")
            total = sum(float(r['m']) for r in saved_rows)
            print(f"  Total marks: {total}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_sections())
