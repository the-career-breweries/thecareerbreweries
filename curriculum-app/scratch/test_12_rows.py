import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def test_12_rows():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8046'")
        await page.evaluate("getComponentAfterSubject('8046')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_timeout(3000)

        print("Setting totalNumberOfQuestionAdd to 12 and triggering onChangeTotalNoOfQuestion...")
        await page.evaluate('''() => {
            document.getElementById("totalNumberOfQuestionAdd").value = "12";
            onChangeTotalNoOfQuestion();
        }''')

        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        await page.screenshot(path="scratch/dsa_mapping_12_rows.png")
        print("Screenshot saved to scratch/dsa_mapping_12_rows.png")

        # Inspect rows generated
        rows_info = await page.evaluate('''() => {
            let trs = Array.from(document.querySelectorAll('table tbody tr'));
            return trs.map((tr, idx) => {
                let inputs = Array.from(tr.querySelectorAll('input')).map(i => ({ id: i.id, name: i.name, value: i.value }));
                let selects = Array.from(tr.querySelectorAll('select')).map(s => ({ id: s.id, name: s.name, value: s.value }));
                return { idx, inputs, selects };
            });
        }''')

        print(f"Total rows rendered: {len(rows_info)}")
        for r in rows_info:
            print(f"Row {r['idx']}: inputs={r['inputs']}, selects={[s['id'] for s in r['selects']]}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_12_rows())
