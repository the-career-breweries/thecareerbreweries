import asyncio
import os
import openpyxl
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
EXCEL_FILE = os.path.abspath(r"scratch\uploads\BSCB_Computing_filled.xlsx")

# Modify BSCB_Computing_filled.xlsx so absent students have 0 for questions
wb = openpyxl.load_workbook(EXCEL_FILE)
ws = wb.active
for r in range(2, ws.max_row + 1):
    tot = ws.cell(r, 4).value
    if tot == "AB":
        for c in range(5, ws.max_column + 1):
            ws.cell(r, c).value = 0
wb.save(EXCEL_FILE)
print("Updated Excel with 0 for absent questions.")

async def test_upload():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        file_input = page.locator("input[type='file']")
        await file_input.first.set_input_files(EXCEL_FILE)
        await page.wait_for_timeout(1000)

        await page.locator("#btn_upload_excel_file").click()
        await page.wait_for_timeout(4000)

        await page.screenshot(path="scratch/secb_upload_with_0.png")

        # Check if modal appeared without error
        body_text = await page.evaluate("document.body.innerText")
        if "Please enter valid marks" in body_text:
            print("ERROR still present with 0!")
        else:
            print("SUCCESS! No error message with 0.")

        # Check modal
        modal_btn = page.locator("#btn_update_excel_modal")
        print("Modal button count:", await modal_btn.count())

        await b.close()

if __name__ == "__main__":
    asyncio.run(test_upload())
