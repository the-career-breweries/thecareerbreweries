import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def check_computing_entry():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Sec A (4659)
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2500)

        sub_opts = await page.evaluate('''() => {
            let s = document.getElementById('subjectId');
            return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
        }''')
        print("Sec A subjects:", sub_opts)

        comp_val = None
        for o in sub_opts:
            if "Computing Skills" in o['text']:
                comp_val = o['value']
                break
        print(f"Computing Skills subjectId: {comp_val}")

        await page.evaluate(f"document.getElementById('subjectId').value = '{comp_val}'")
        await page.evaluate(f"getComponentAfterSubject('{comp_val}')")
        await page.wait_for_timeout(2500)

        components = await page.evaluate('''() => {
            let s = document.getElementById('componentId');
            return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
        }''')
        print("Components for Computing Skills:", components)

        mse_val = None
        for o in components:
            if "MSE" in o['text']:
                mse_val = o['value']
                break
        print(f"MSE componentId: {mse_val}")

        await page.evaluate(f"document.getElementById('componentId').value = '{mse_val}'")
        await page.wait_for_timeout(1000)

        # Click Question & CO Mapping
        print("Clicking getQuestionAndCOMapping()...")
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        await page.screenshot(path="scratch/computing_mapping_screen.png")
        print("Screenshot saved to scratch/computing_mapping_screen.png")

        # Check existing questions if already defined or if empty
        existing_info = await page.evaluate('''() => {
            let totalQInput = document.getElementById('totalNumberOfQuestionAdd');
            let rows = [];
            let trs = document.querySelectorAll('table tbody tr');
            trs.forEach((tr, i) => {
                let q = tr.querySelector('input[id^="obe_question_no"]');
                let m = tr.querySelector('input[id^="obe_max_marks"]');
                if (q || m) {
                    rows.push({
                        row: i,
                        q: q ? q.value : null,
                        m: m ? m.value : null
                    });
                }
            });
            return {
                totalQ: totalQInput ? totalQInput.value : null,
                rowsCount: rows.length,
                rows: rows
            };
        }''')
        print("Existing mapping info:", existing_info)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(check_computing_entry())
