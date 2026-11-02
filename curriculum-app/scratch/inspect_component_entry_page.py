import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_entry_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # BBA English (4661, 8040), Component 777 (Assignment 1)
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        await page.screenshot(path="scratch/bba_assignment1_entry_screen.png", full_page=True)

        info = await page.evaluate('''() => {
            const hasUpload = document.getElementById('btn_upload_excel_file') !== null;
            const hasDownload = Array.from(document.querySelectorAll('a, button, input')).some(el => (el.innerText || el.value || '').includes('Download Excel Template') || (el.getAttribute('onclick') || '').includes('downloadExcelTemplate'));
            const inputs = Array.from(document.querySelectorAll('table tbody input')).map(inp => ({
                id: inp.id,
                name: inp.name,
                type: inp.type,
                value: inp.value
            })).slice(0, 15);

            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            })).filter(b => b.value || b.text);

            return { hasUpload, hasDownload, inputs, buttons };
        }''')

        print("Page Info for BBA Assignment 1:")
        print("  Has Upload Excel:", info['hasUpload'])
        print("  Has Download Template:", info['hasDownload'])
        print("  Table Inputs Sample:", info['inputs'][:8])
        print("  Buttons on Page:")
        for b in info['buttons']:
            print("   ", b)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_entry_page())
