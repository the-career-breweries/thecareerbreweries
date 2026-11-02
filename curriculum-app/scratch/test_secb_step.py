import asyncio
import os
import sys
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
EXCEL_FILE = os.path.abspath(r"scratch\uploads\BSCB_Computing_filled.xlsx")

async def test_secb():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()
        page.on("dialog", lambda dialog: asyncio.create_task(dialog.accept()))

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Select Sec B
        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        await page.screenshot(path="scratch/secb_step1_entry.png")
        print("Step 1: Opened Mark Entry screen")

        # Attach file
        file_input = page.locator("input[type='file']")
        await file_input.first.set_input_files(EXCEL_FILE)
        await page.wait_for_timeout(1000)

        print("Step 2: Uploading file...")
        await page.evaluate("uploadDSAMarksExcelFile()")
        await page.wait_for_timeout(5000)
        await page.screenshot(path="scratch/secb_step2_modal.png")

        # Check modal
        modal_visible = await page.locator("#btn_update_excel_modal, input[value*='Verify and Submit']").count()
        print(f"Modal count: {modal_visible}")

        # Let's inspect what buttons/elements exist in the modal or page
        buttons = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            }));
        }''')
        print("Buttons on page:")
        for b in buttons:
            print(" ", b)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_secb())
