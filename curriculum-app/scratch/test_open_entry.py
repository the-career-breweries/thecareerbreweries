import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_entry():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        print("Navigating to AUERP...")
        await page.goto(url, timeout=60000, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        # BBA English (4661, 8040), Component 777 (Assignment 1)
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

        await page.screenshot(path="scratch/bba_assignment1_screen.png", full_page=True)

        details = await page.evaluate('''() => {
            const hasUpload = document.getElementById('btn_upload_excel_file') !== null;
            const hasFileInp = document.querySelector('input[type=file]') !== null;
            const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(r => r.querySelectorAll('input').length > 0);
            const firstRowInputs = rows.length > 0 ? Array.from(rows[0].querySelectorAll('input')).map(inp => ({
                id: inp.id,
                name: inp.name,
                type: inp.type,
                value: inp.value
            })) : [];
            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            })).filter(b => b.value || b.text);

            return {
                rowCount: rows.length,
                hasUpload,
                hasFileInp,
                firstRowInputs,
                buttons
            };
        }''')

        print("Entry screen details:")
        print("  Row count:", details['rowCount'])
        print("  Has upload button:", details['hasUpload'])
        print("  Has file input:", details['hasFileInp'])
        print("  First row inputs:", details['firstRowInputs'])
        print("  Buttons:")
        for b in details['buttons']:
            print("   ", b)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_entry())
