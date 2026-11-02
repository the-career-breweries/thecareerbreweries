import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

TARGETS = [
    {"class_id": "4661", "class_name": "I_ASAS_BBA_2026", "subject_id": "8040", "name": "BBA_English"},
    {"class_id": "4659", "class_name": "I_ASAS_BSC_2026_SECA", "subject_id": "8046", "name": "BSCA_English"},
    {"class_id": "4660", "class_name": "I_ASAS_BSC_2026_SECB", "subject_id": "8046", "name": "BSCB_English"}
]

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        for t in TARGETS:
            await page.goto(url, timeout=45000)
            await page.wait_for_timeout(2000)

            await page.evaluate(f"getSubject('{t['class_id']}')")
            await page.evaluate(f"document.getElementById('classId').value = '{t['class_id']}'")
            await page.wait_for_timeout(2000)

            await page.evaluate(f"document.getElementById('subjectId').value = '{t['subject_id']}'")
            await page.evaluate(f"getComponentAfterSubject('{t['subject_id']}')")
            await page.wait_for_timeout(2000)

            comps = await page.evaluate('''() => {
                return Array.from(document.getElementById('componentId').options).map(o => ({ val: o.value, text: o.text }));
            }''')
            print(f"{t['name']} ({t['class_name']}) components: {comps}")

        await b.close()

if __name__ == "__main__":
    asyncio.run(check())
