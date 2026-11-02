import asyncio
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

TARGETS = [
    {"subject": "Communicative English", "class": "BBA", "cid": "4661", "sid": "8040"},
    {"subject": "Communicative English", "class": "B.Sc - A", "cid": "4659", "sid": "8046"},
    {"subject": "Communicative English", "class": "B.Sc - B", "cid": "4660", "sid": "8046"},
    {"subject": "Introduction to Computing Skills", "class": "B.Sc - A", "cid": "4659", "sid": "8117"},
    {"subject": "Introduction to Computing Skills", "class": "B.Sc - B", "cid": "4660", "sid": "8117"}
]

COMPONENTS = [
    {"name": "Assignment 1", "id": "777"},
    {"name": "Assignments", "id": "807"},
    {"name": "Class Participation", "id": "804"}
]

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        status_list = []

        for t in TARGETS:
            for c in COMPONENTS:
                await page.goto(url, timeout=45000)
                await page.wait_for_timeout(2000)

                await page.evaluate(f"getSubject('{t['cid']}')")
                await page.evaluate(f"document.getElementById('classId').value = '{t['cid']}'")
                await page.wait_for_timeout(1500)

                await page.evaluate(f"document.getElementById('subjectId').value = '{t['sid']}'")
                await page.evaluate(f"getComponentAfterSubject('{t['sid']}')")
                await page.wait_for_timeout(1500)

                await page.evaluate(f"document.getElementById('componentId').value = '{c['id']}'")
                await page.wait_for_timeout(1000)

                await page.evaluate("submitForm()")
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2500)

                info = await page.evaluate('''() => {
                    const text = document.body.innerText;
                    const hasMissing = text.includes('Question and CO Mapping is missing') || text.includes('Please add Question and CO Mapping');
                    const hasButton = document.getElementById('btn_question_and_comapping') !== null;
                    const hasTable = document.querySelector('table tbody tr') !== null;
                    return { hasMissing, hasButton, hasTable, snippet: text.slice(0, 300).replace(/\\s+/g, ' ') };
                }''')

                print(f"[{t['subject']} - {t['class']}] Component {c['name']} ({c['id']}): Missing={info['hasMissing']}, HasBtn={info['hasButton']}, HasTable={info['hasTable']}")
                status_list.append({
                    "target": f"{t['subject']} - {t['class']}",
                    "component": c['name'],
                    "cid": c['id'],
                    "info": info
                })

        with open("scratch/co_current_status.json", "w", encoding="utf-8") as f:
            json.dump(status_list, f, indent=2)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check())
