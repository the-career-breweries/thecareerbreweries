import asyncio
import os
import sys
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def test_open_bscb():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(entry_url, timeout=60000, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        # 1. Select BSCB Class (4660)
        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_function("() => document.querySelectorAll('#subjectId option').length > 1", timeout=20000)
        
        # 2. Select Subject 8046
        await page.evaluate('''() => {
            document.getElementById('subjectId').value = '8046';
            getComponentAfterSubject('8046');
            getGroups('8046');
        }''')
        await page.wait_for_function("() => document.querySelectorAll('#componentId option').length > 1", timeout=20000)
        
        # 3. Select Component 777
        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.wait_for_function("() => document.getElementById('componentId').value === '777'", timeout=5000)
        
        # 4. Submit
        await page.evaluate("submitForm()")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=25000)
        except:
            pass
        await page.wait_for_timeout(4000)
        await page.wait_for_selector("table tbody tr input", timeout=25000)
        
        rows = await page.evaluate("document.querySelectorAll('table tbody tr').length")
        inputs = await page.evaluate("document.querySelectorAll('table tbody tr input').length")
        print(f"SUCCESS! BSCB Entry Screen opened with {rows} rows and {inputs} input fields!")
        await page.screenshot(path="scratch/bscb_a1_table_opened.png", full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_open_bscb())
