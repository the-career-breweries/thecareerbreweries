import asyncio
import os
import sys
import json
import openpyxl
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
EXCEL_FILE = os.path.abspath(r"scratch\uploads\BSCB_Computing_filled.xlsx")

async def sync_and_verify():
    print("=== Step 1: Generating BSCB_Computing_filled.xlsx ===")
    import sync_auerp_engine
    fpath, count = sync_auerp_engine.generate_filled_excel("BSCB_Computing")
    print(f"Excel generated: {fpath} with {count} students.")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        page.on("dialog", lambda dialog: asyncio.create_task(dialog.accept()))

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        print(f"Navigating to {entry_url}...")
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(2500)

        # 1. Select Class Sec B (4660)
        print("Selecting class I_ASAS_BSC_2026_SECB (4660)...")
        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_timeout(2500)

        # 2. Select Subject (8117)
        print("Selecting subject Introduction to Computing Skills (8117)...")
        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2500)

        # 3. Select MSE (778)
        print("Selecting component MSE (778)...")
        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        # 4. Open Mark Entry screen
        print("Opening Mark Entry screen...")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle", timeout=20000)
        await page.wait_for_timeout(3000)

        # 5. Attach file
        print(f"Attaching file: {fpath}...")
        file_input = page.locator("input[type='file']")
        await file_input.first.set_input_files(fpath)
        await page.wait_for_timeout(1000)

        # 6. Click Upload
        print("Clicking #btn_upload_excel_file...")
        upload_btn = page.locator("#btn_upload_excel_file")
        if await upload_btn.count() > 0:
            await upload_btn.first.click()
        else:
            await page.evaluate("uploadDSAMarksExcelFile()")
        await page.wait_for_timeout(5000)

        # Check for error banners
        body_text = await page.evaluate("document.body.innerText")
        if "Please enter valid marks" in body_text:
            print("ERROR banner detected in upload!")
            await page.screenshot(path="scratch/secb_upload_error.png")
            await browser.close()
            return False

        # 7. Modal Verify and Submit
        modal_btn = page.locator("#btn_update_excel_modal, input[value*='Verify and Submit']")
        if await modal_btn.count() > 0:
            print("Modal appeared! Clicking Verify and Submit (#btn_update_excel_modal)...")
            await modal_btn.first.click()
            try:
                await page.wait_for_load_state("networkidle", timeout=15000)
            except:
                pass
            await page.wait_for_timeout(3000)
        else:
            print("WARNING: Modal button not found!")

        # 8. Save your changes (Draft)
        print("Clicking Save your changes (Draft)...")
        save_btn = page.locator("#btn_save_your_changes")
        if await save_btn.count() > 0:
            print("Found #btn_save_your_changes, clicking...")
            await save_btn.first.click()
        else:
            alt_save = page.locator("#qustion_wise_save_button")
            if await alt_save.count() > 0:
                print("Found #qustion_wise_save_button, clicking...")
                await alt_save.first.click()
            else:
                print("Calling saveQuestionWiseMarks2()...")
                await page.evaluate("saveQuestionWiseMarks2()")

        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except:
            pass
        await page.wait_for_timeout(4000)

        # Capture result screenshot
        result_shot = os.path.abspath("scratch/sync_BSCB_Computing_result.png")
        await page.screenshot(path=result_shot)
        print(f"Sync result screenshot saved to {result_shot}")

        body_text_after = await page.evaluate("document.body.innerText")
        print("Page confirmation text snippet:")
        for line in body_text_after.split("\n"):
            line_str = line.strip()
            if any(k in line_str.lower() for k in ["success", "saved", "error", "entered"]):
                print(f"  -> {line_str}")

        # === Step 9: Reopen and Capture Full Table Verification ===
        print("\n=== Step 9: Verifying full marks view on AUERP ===")
        await page.goto(entry_url, timeout=45000)
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
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        full_shot = os.path.abspath("scratch/bscb_full_marks_view.png")
        await page.screenshot(path=full_shot, full_page=True)
        print(f"Full page verification screenshot saved to {full_shot}")

        # Inspect table rows
        rows_data = await page.evaluate('''() => {
            const rows = Array.from(document.querySelectorAll('table tbody tr'));
            return rows.map(r => {
                const cells = Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim());
                return cells;
            }).filter(c => c.length >= 4 && /^\\d+$/.test(c[0]));
        }''')

        print(f"Found {len(rows_data)} student rows in AUERP table:")
        for r in rows_data[:5]:
            print(f"  Row {r[0]}: {r[1]} | Reg: {r[2]} | Total: {r[3]}")
        print("  ...")
        for r in rows_data:
            if "AB" in r or "KRISHANU" in r[1] or "AYUSH" in r[1]:
                print(f"  Row {r[0]}: {r[1]} | Reg: {r[2]} | Total: {r[3]}")
        for r in rows_data[-3:]:
            print(f"  Row {r[0]}: {r[1]} | Reg: {r[2]} | Total: {r[3]}")

        await browser.close()
        print("\nAll done!")

if __name__ == '__main__':
    asyncio.run(sync_and_verify())
