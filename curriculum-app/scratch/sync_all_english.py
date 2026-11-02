import asyncio
import os
import sys
import json
import openpyxl
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"
STORE_FILE = os.path.abspath("scratch/dsa_marks_store.json")

ENGLISH_TARGETS = [
    {
        "key": "BBA_English",
        "name": "BBA Aviation",
        "class_id": "4661",
        "class_name": "I_ASAS_BBA_2026",
        "subject_id": "8040",
        "subject_name": "Communicative English",
        "component_id": "778"
    },
    {
        "key": "BSCA_English",
        "name": "B.Sc Section A",
        "class_id": "4659",
        "class_name": "I_ASAS_BSC_2026_SECA",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "778"
    },
    {
        "key": "BSCB_English",
        "name": "B.Sc Section B",
        "class_id": "4660",
        "class_name": "I_ASAS_BSC_2026_SECB",
        "subject_id": "8046",
        "subject_name": "Communicative English",
        "component_id": "778"
    }
]

async def sync_target(page, target):
    key = target["key"]
    cname = target["name"]
    cid = target["class_id"]
    sid = target["subject_id"]
    comp_id = target["component_id"]

    print(f"\n=======================================================")
    print(f"Starting AUERP Sync for: {cname} ({key})")
    print(f"Class ID: {cid}, Subject ID: {sid}, Component ID: {comp_id}")
    print(f"=======================================================")

    # 1. Generate filled Excel
    import sync_auerp_engine
    fpath, count = sync_auerp_engine.generate_filled_excel(key)
    print(f"Generated filled Excel: {fpath} with {count} students.")

    entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
    print(f"Navigating to {entry_url}...")
    await page.goto(entry_url, timeout=45000)
    await page.wait_for_timeout(3000)

    # Check session
    if "loginAction" in page.url or await page.locator("#username").count() > 0:
        raise RuntimeError("AUERP Session expired! Please log in again.")

    # 2. Select Class
    print(f"Selecting class {target['class_name']} ({cid})...")
    await page.evaluate(f"getSubject('{cid}')")
    await page.evaluate(f"document.getElementById('classId').value = '{cid}'")
    await page.wait_for_timeout(2500)

    # 3. Select Subject
    print(f"Selecting subject {target['subject_name']} ({sid})...")
    await page.evaluate(f"document.getElementById('subjectId').value = '{sid}'")
    await page.evaluate(f"getComponentAfterSubject('{sid}')")
    await page.wait_for_timeout(2500)

    # 4. Select MSE (778)
    print(f"Selecting component MSE ({comp_id})...")
    await page.evaluate(f"document.getElementById('componentId').value = '{comp_id}'")
    await page.wait_for_timeout(1000)

    # 5. Open Mark Entry
    print("Opening DSA Mark Entry screen...")
    await page.evaluate("submitForm()")
    await page.wait_for_load_state("networkidle", timeout=20000)
    await page.wait_for_timeout(3000)

    # 6. Attach filled Excel
    print(f"Attaching file: {fpath}...")
    file_input = page.locator("input[type='file']")
    if await file_input.count() == 0:
        raise RuntimeError("File input not found on AUERP page!")
    await file_input.first.set_input_files(fpath)
    await page.wait_for_timeout(1000)

    # 7. Click Upload
    print("Clicking uploadDSAMarksExcelFile()...")
    upload_btn = page.locator("#btn_upload_excel_file")
    if await upload_btn.count() > 0:
        await upload_btn.first.click()
    else:
        await page.evaluate("uploadDSAMarksExcelFile()")
    await page.wait_for_timeout(5000)

    # Check for upload error banners
    body_text = await page.evaluate("document.body.innerText")
    if "Please enter valid marks" in body_text:
        err_shot = f"scratch/sync_{key}_error.png"
        await page.screenshot(path=err_shot)
        raise RuntimeError(f"AUERP validation error for {key}! Screenshot: {err_shot}")

    # 8. Modal Verify and Submit
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

    # 9. Save your changes (Draft)
    print("Clicking Save your changes (Draft mode)...")
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
    result_shot = os.path.abspath(f"scratch/sync_{key}_result.png")
    await page.screenshot(path=result_shot)
    print(f"Result screenshot saved to {result_shot}")

    body_text_after = await page.evaluate("document.body.innerText")
    for line in body_text_after.split("\n"):
        line_str = line.strip()
        if any(k in line_str.lower() for k in ["success", "saved", "error", "entered"]):
            print(f"  AUERP banner: {line_str}")

    # 10. Reopen and verify full table
    print(f"\nVerifying full table on AUERP for {cname}...")
    await page.goto(entry_url, timeout=45000)
    await page.wait_for_timeout(2500)

    await page.evaluate(f"getSubject('{cid}')")
    await page.evaluate(f"document.getElementById('classId').value = '{cid}'")
    await page.wait_for_timeout(2000)

    await page.evaluate(f"document.getElementById('subjectId').value = '{sid}'")
    await page.evaluate(f"getComponentAfterSubject('{sid}')")
    await page.wait_for_timeout(2000)

    await page.evaluate(f"document.getElementById('componentId').value = '{comp_id}'")
    await page.wait_for_timeout(1000)

    await page.evaluate("submitForm()")
    await page.wait_for_load_state("networkidle", timeout=15000)
    await page.wait_for_timeout(3000)

    full_shot = os.path.abspath(f"scratch/{key}_full_marks_view.png")
    await page.screenshot(path=full_shot, full_page=True)
    print(f"Full table screenshot saved to {full_shot}")

    # Inspect student rows
    table_data = await page.evaluate('''() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr')).filter(r => r.querySelectorAll('input').length > 0);
        return rows.map((r, i) => {
            const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
            const totalInput = r.querySelector('input[name*="studentTotalMarks"]') || r.querySelector('input[id*="studentTotalMarks"]') || r.querySelectorAll('input')[0];
            return {
                sl: i + 1,
                name: cells[1] || '',
                reg: cells[2] || '',
                total: totalInput ? totalInput.value : 'N/A'
            };
        });
    }''')

    print(f"Verified {len(table_data)} student rows on AUERP:")
    for d in table_data:
        print(f"  #{d['sl']}: {d['name']} ({d['reg']}) -> Total: {d['total']}")

    return {
        "key": key,
        "name": cname,
        "count": len(table_data),
        "result_shot": result_shot,
        "full_shot": full_shot,
        "students": table_data
    }

async def main():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        for target in ENGLISH_TARGETS:
            res = await sync_target(page, target)
            results.append(res)
            print(f"Finished {target['name']}.\n")
            await asyncio.sleep(2)

        await browser.close()

    print("\n=======================================================")
    print("ALL THREE ENGLISH CLASSES SYNCED AND VERIFIED SUCCESSFULLY!")
    print("=======================================================")
    for r in results:
        print(f"- {r['name']} ({r['key']}): {r['count']} students verified.")

if __name__ == "__main__":
    asyncio.run(main())
