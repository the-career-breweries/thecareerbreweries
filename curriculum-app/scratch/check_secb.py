import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def check_secb():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Check Sec B (4660)
        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_timeout(2500)

        sub_opts = await page.evaluate('''() => {
            let s = document.getElementById('subjectId');
            return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
        }''')
        print("Subject options for Sec B:", sub_opts)

        eng_val = None
        for o in sub_opts:
            if "Communicative English" in o['text']:
                eng_val = o['value']
                break
        print(f"Sec B English val: {eng_val}")

        if eng_val:
            await page.evaluate(f"document.getElementById('subjectId').value = '{eng_val}'")
            await page.evaluate(f"getComponentAfterSubject('{eng_val}')")
            await page.wait_for_timeout(2000)

            comp_opts = await page.evaluate('''() => {
                let s = document.getElementById('componentId');
                return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
            }''')
            print("Component options for Sec B:", comp_opts)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(check_secb())
