import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def download_template():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE, accept_downloads=True)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Sec A
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        print("Clicking submitForm()...")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        # Inspect all buttons/inputs on the table page
        elements = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('input, button, a')).map(el => ({
                tag: el.tagName,
                id: el.id,
                name: el.name,
                value: el.value,
                text: el.innerText ? el.innerText.trim() : '',
                onclick: el.getAttribute('onclick'),
                href: el.getAttribute('href')
            })).filter(e => e.text.includes('Excel') || (e.value && e.value.includes('Excel')) || (e.onclick && e.onclick.includes('Excel')) || e.text.includes('Save') || (e.value && e.value.includes('Save')));
        }''')
        print("Relevant elements found:\n", elements)

        # Click Download Excel Template using Playwright locator
        dl_loc = page.locator("text='Download Excel Template', input[value*='Download Excel Template']")
        print(f"Download button locator count: {await dl_loc.count()}")
        
        async with page.expect_download() as download_info:
            await dl_loc.first.click()
        
        download = await download_info.value
        save_path = os.path.abspath("scratch/Computing_SecA_Template.xlsx")
        await download.save_as(save_path)
        print(f"SUCCESS: Template downloaded to {save_path}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(download_template())
