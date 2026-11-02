import asyncio
import os
import sys
import json
import openpyxl
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

STORE_FILE = os.path.abspath("scratch/dsa_marks_store.json")
TEMPLATES_DIR = os.path.abspath("scratch/templates")
UPLOADS_DIR = os.path.abspath("scratch/uploads")
AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

os.makedirs(UPLOADS_DIR, exist_ok=True)

def generate_filled_excel(subject_key):
    with open(STORE_FILE, "r", encoding="utf-8") as f:
        store = json.load(f)

    if subject_key not in store["subjects"]:
        raise ValueError(f"Unknown subject key: {subject_key}")

    subj_data = store["subjects"][subject_key]
    cfg = subj_data["config"]
    template_path = os.path.join(TEMPLATES_DIR, cfg["template_file"])
    filled_path = os.path.join(UPLOADS_DIR, f"{subject_key}_filled.xlsx")

    wb = openpyxl.load_workbook(template_path)
    ws = wb.active

    # Create mapping of reg_no -> student_data
    students_by_reg = {s["reg_no"].strip(): s for s in subj_data["students"]}

    # Read question col mapping from row 1
    q_col_map = {}
    for col in range(5, ws.max_column + 1):
        val = ws.cell(1, col).value
        if val and str(val).startswith("Q:"):
            # find question number
            import re
            m = re.search(r"Q:\s*(\d+)", str(val))
            if m:
                q_no = str(m.group(1))
                q_col_map[q_no] = col

    # Populate rows
    updated_count = 0
    for row in range(2, ws.max_row + 1):
        reg_no = str(ws.cell(row, 3).value or "").strip()
        if reg_no in students_by_reg:
            s = students_by_reg[reg_no]
            if s.get("is_absent"):
                ws.cell(row, 4).value = "AB"
                for q_no, col in q_col_map.items():
                    ws.cell(row, col).value = 0
                updated_count += 1
            elif s.get("graded") or s.get("total") != "":
                # Total
                if s.get("total") != "":
                    try:
                        ws.cell(row, 4).value = float(s["total"])
                    except:
                        ws.cell(row, 4).value = str(s["total"])

                # Individual questions
                for q_no, col in q_col_map.items():
                    val = s.get("marks", {}).get(q_no, "")
                    if val != "" and val is not None:
                        try:
                            ws.cell(row, col).value = float(val)
                        except:
                            ws.cell(row, col).value = str(val)
                    else:
                        ws.cell(row, col).value = ""
                updated_count += 1

    wb.save(filled_path)
    print(f"Generated filled Excel: {filled_path} with {updated_count} graded/updated student rows.")
    return filled_path, updated_count

async def sync_subject_to_auerp(subject_key, is_final_submit=False):
    filled_excel_path, count = generate_filled_excel(subject_key)

    with open(STORE_FILE, "r", encoding="utf-8") as f:
        store = json.load(f)
    cfg = store["subjects"][subject_key]["config"]

    result = {
        "success": False,
        "message": "",
        "subject_key": subject_key,
        "class_name": cfg["class_name"],
        "course_name": cfg["name"],
        "count": count,
        "screenshot": ""
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        # Handle any browser alert / confirm dialogs automatically
        page.on("dialog", lambda dialog: asyncio.create_task(dialog.accept()))

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        print(f"Navigating to {entry_url}...")
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Check if session is expired
        if "loginAction" in page.url or await page.locator("#username").count() > 0:
            result["message"] = "AUERP session expired. Please log in first."
            result["requires_login"] = True
            await browser.close()
            return result

        # 1. Select Class
        class_id = cfg["class_id"]
        print(f"Selecting class {cfg['class_name']} ({class_id})...")
        await page.evaluate(f"getSubject('{class_id}')")
        await page.evaluate(f"document.getElementById('classId').value = '{class_id}'")
        await page.wait_for_timeout(2500)

        # 2. Select Subject
        subject_id = cfg["subject_id"]
        print(f"Selecting subject {cfg['name']} ({subject_id})...")
        await page.evaluate(f"document.getElementById('subjectId').value = '{subject_id}'")
        await page.evaluate(f"getComponentAfterSubject('{subject_id}')")
        await page.wait_for_timeout(2500)

        # 3. Select MSE (778)
        print("Selecting MSE (778)...")
        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        # 4. Open DSA Mark Entry screen
        print("Opening DSA Mark Entry screen...")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle", timeout=20000)
        await page.wait_for_timeout(3000)

        # 5. Attach file
        print(f"Attaching file: {filled_excel_path}...")
        file_input = page.locator("input[type='file']")
        if await file_input.count() == 0:
            result["message"] = "Excel file input element not found on AUERP page."
            await browser.close()
            return result

        await file_input.first.set_input_files(filled_excel_path)
        await page.wait_for_timeout(1000)

        # 6. Click Upload
        print("Clicking uploadDSAMarksExcelFile()...")
        upload_btn = page.locator("#btn_upload_excel_file")
        if await upload_btn.count() > 0:
            await upload_btn.first.click()
        else:
            await page.evaluate("uploadDSAMarksExcelFile()")
        await page.wait_for_timeout(4000)

        # 7. Check if modal appeared and click Verify and Submit
        modal_btn = page.locator("#btn_update_excel_modal, input[value*='Verify and Submit']")
        if await modal_btn.count() > 0:
            print("Modal appeared! Clicking Verify and Submit...")
            await modal_btn.first.click()
            try:
                await page.wait_for_load_state("networkidle", timeout=15000)
            except:
                pass
            await page.wait_for_timeout(3000)

        # 8. Save or Save & Submit
        if is_final_submit:
            print("Performing Save & Submit (Lock)...")
            submit_btn = page.locator("#qustion_wise_submit_button")
            if await submit_btn.count() > 0:
                await submit_btn.first.click()
            else:
                await page.evaluate("saveAndSubmitQuestionWiseMarks()")
        else:
            print("Performing Save your changes (Draft)...")
            save_btn = page.locator("#btn_save_your_changes")
            if await save_btn.count() > 0:
                await save_btn.first.click()
            else:
                alt_save = page.locator("#qustion_wise_save_button")
                if await alt_save.count() > 0:
                    await alt_save.first.click()
                else:
                    await page.evaluate("saveQuestionWiseMarks2()")

        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except:
            pass
        await page.wait_for_timeout(4000)

        # Capture screenshot
        shot_path = os.path.abspath(f"scratch/sync_{subject_key}_result.png")
        await page.screenshot(path=shot_path)
        result["screenshot"] = shot_path
        print(f"Sync screenshot saved to {shot_path}")

        body_text = await page.evaluate("document.body.innerText")
        if "successfully" in body_text.lower() or "saved" in body_text.lower():
            result["success"] = True
            result["message"] = f"Successfully synced marks for {cfg['class_name']} ({cfg['name']}) to AUERP!"
        else:
            result["success"] = True # Struts post-redirect completed
            result["message"] = f"Marks uploaded for {cfg['class_name']}. Please verify screenshot."

        await browser.close()

    return result

if __name__ == '__main__':
    if len(sys.argv) > 1:
        key = sys.argv[1]
        asyncio.run(sync_subject_to_auerp(key))
    else:
        print("Usage: python sync_auerp_engine.py <subject_key>")
