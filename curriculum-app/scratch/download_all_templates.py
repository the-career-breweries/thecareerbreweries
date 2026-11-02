import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'
OUT_DIR = os.path.abspath("scratch/templates")
os.makedirs(OUT_DIR, exist_ok=True)

TARGETS = [
    {"class_id": "4661", "class_name": "I_ASAS_BBA_2026", "subject_id": "8040", "subject_name": "Communicative English", "code": "BBA_English"},
    {"class_id": "4659", "class_name": "I_ASAS_BSC_2026_SECA", "subject_id": "8046", "subject_name": "Communicative English", "code": "BSCA_English"},
    {"class_id": "4660", "class_name": "I_ASAS_BSC_2026_SECB", "subject_id": "8046", "subject_name": "Communicative English", "code": "BSCB_English"},
    {"class_id": "4659", "class_name": "I_ASAS_BSC_2026_SECA", "subject_id": "8117", "subject_name": "Introduction to Computing Skills", "code": "BSCA_Computing"},
    {"class_id": "4660", "class_name": "I_ASAS_BSC_2026_SECB", "subject_id": "8117", "subject_name": "Introduction to Computing Skills", "code": "BSCB_Computing"}
]

async def download_all():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE, accept_downloads=True)
        page = await context.new_page()

        for t in TARGETS:
            out_file = os.path.join(OUT_DIR, f"{t['code']}.xlsx")
            print(f"\nFetching template for {t['code']} ({t['class_name']})...")

            url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
            await page.goto(url, timeout=45000)
            await page.wait_for_timeout(2500)

            await page.evaluate(f"getSubject('{t['class_id']}')")
            await page.evaluate(f"document.getElementById('classId').value = '{t['class_id']}'")
            await page.wait_for_timeout(2000)

            await page.evaluate(f"document.getElementById('subjectId').value = '{t['subject_id']}'")
            await page.evaluate(f"getComponentAfterSubject('{t['subject_id']}')")
            await page.wait_for_timeout(2000)

            await page.evaluate("document.getElementById('componentId').value = '778'") # MSE
            await page.wait_for_timeout(1000)

            await page.evaluate("submitForm()")
            await page.wait_for_load_state("networkidle", timeout=15000)
            await page.wait_for_timeout(3000)

            async with page.expect_download() as download_info:
                await page.evaluate("downloadExcelTemplate()")
            
            download = await download_info.value
            await download.save_as(out_file)
            print(f"Saved: {out_file}")

        await browser.close()
        print("\nAll templates downloaded successfully!")

if __name__ == '__main__':
    asyncio.run(download_all())
