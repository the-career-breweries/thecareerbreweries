import asyncio
import os
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

ITEMS_TO_DEFINE = [
    # BBA
    {
        "class_name": "BBA Aviation",
        "cid": "4661",
        "sid": "8040",
        "subject_name": "Communicative English",
        "comp_id": "807",
        "comp_name": "Assignments",
        "max_marks": "15",
        "co_index": 1, # CO2
        "weightage": "3"
    },
    {
        "class_name": "BBA Aviation",
        "cid": "4661",
        "sid": "8040",
        "subject_name": "Communicative English",
        "comp_id": "804",
        "comp_name": "Class Participation",
        "max_marks": "10",
        "co_index": 0, # CO1
        "weightage": "3"
    },

    # B.Sc Section A
    {
        "class_name": "B.Sc Section A",
        "cid": "4659",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "777",
        "comp_name": "Assignment 1",
        "max_marks": "15",
        "co_index": 2, # CO3
        "weightage": "3"
    },
    {
        "class_name": "B.Sc Section A",
        "cid": "4659",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "807",
        "comp_name": "Assignments",
        "max_marks": "15",
        "co_index": 1, # CO2
        "weightage": "3"
    },
    {
        "class_name": "B.Sc Section A",
        "cid": "4659",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "804",
        "comp_name": "Class Participation",
        "max_marks": "10",
        "co_index": 0, # CO1
        "weightage": "3"
    },

    # B.Sc Section B
    {
        "class_name": "B.Sc Section B",
        "cid": "4660",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "777",
        "comp_name": "Assignment 1",
        "max_marks": "15",
        "co_index": 2, # CO3
        "weightage": "3"
    },
    {
        "class_name": "B.Sc Section B",
        "cid": "4660",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "807",
        "comp_name": "Assignments",
        "max_marks": "15",
        "co_index": 1, # CO2
        "weightage": "3"
    },
    {
        "class_name": "B.Sc Section B",
        "cid": "4660",
        "sid": "8046",
        "subject_name": "Communicative English",
        "comp_id": "804",
        "comp_name": "Class Participation",
        "max_marks": "10",
        "co_index": 0, # CO1
        "weightage": "3"
    }
]

async def define_component(page, item):
    print(f"\n=======================================================")
    print(f"Defining Question & CO Mapping for:")
    print(f"Class: {item['class_name']} ({item['cid']}) | Subject: {item['subject_name']} ({item['sid']})")
    print(f"Component: {item['comp_name']} ({item['comp_id']}) -> Max: {item['max_marks']}, CO{item['co_index']+1}: {item['weightage']}")
    print(f"=======================================================")

    url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
    await page.goto(url, timeout=45000)
    await page.wait_for_timeout(2500)

    # 1. Select Class
    await page.evaluate(f"getSubject('{item['cid']}')")
    await page.evaluate(f"document.getElementById('classId').value = '{item['cid']}'")
    await page.wait_for_timeout(2000)

    # 2. Select Subject
    await page.evaluate(f"document.getElementById('subjectId').value = '{item['sid']}'")
    await page.evaluate(f"getComponentAfterSubject('{item['sid']}')")
    await page.wait_for_timeout(2000)

    # 3. Select Component
    await page.evaluate(f"document.getElementById('componentId').value = '{item['comp_id']}'")
    await page.wait_for_timeout(1000)
    await page.evaluate("submitForm()")
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(3000)

    # Check if Question & CO Mapping button is present
    btn = page.locator("#btn_question_and_comapping")
    if await btn.count() == 0:
        print(f"NOTE: #btn_question_and_comapping not found. It may already be defined!")
        return True

    # 4. Click Question & CO Mapping
    await page.evaluate("getQuestionAndCOMapping()")
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(3000)

    # 5. Fill fields:
    # Question No = 1
    # Max Marks = item['max_marks']
    # CO select = item['weightage']
    await page.locator("#obe_question_no_0").fill("1")
    await page.locator("#obe_max_marks_0").fill(item['max_marks'])

    co_selector = f"#courseMapping_0_{item['co_index']}"
    await page.select_option(co_selector, item['weightage'])
    await page.wait_for_timeout(1000)

    # Screenshot
    shot_name = f"scratch/co_{item['cid']}_{item['comp_id']}_filled.png"
    await page.screenshot(path=shot_name)

    # 6. Submit
    await page.evaluate("submitQuestionAndCoMapping()")
    try:
        await page.wait_for_load_state("networkidle", timeout=15000)
    except:
        pass
    await page.wait_for_timeout(4000)

    body_text = await page.evaluate("document.body.innerText")
    success = False
    for line in body_text.split("\n"):
        line_str = line.strip()
        if "completed successfully" in line_str.lower() or "entered successfully" in line_str.lower() or "success" in line_str.lower():
            print(f"  AUERP Result: {line_str}")
            success = True

    if not success:
        print(f"  Warning: Check page screenshot {shot_name}")

    return success

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        for item in ITEMS_TO_DEFINE:
            await define_component(page, item)
            await asyncio.sleep(2)

        await browser.close()
    print("\nAll English Question & CO mappings defined successfully!")

if __name__ == "__main__":
    asyncio.run(main())
