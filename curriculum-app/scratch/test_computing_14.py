import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

COMPUTING_14_QUESTIONS = [
    # (Q No, Max Mark, CO1, CO2, CO3, CO4)
    (1, "2.0", "3", "2", "2", "1"),
    (2, "2.0", "3", "2", "2", "1"),
    (3, "2.0", "3", "2", "2", "1"),
    (4, "2.0", "2", "3", "2", "1"),
    (5, "2.0", "2", "3", "2", "1"),
    (6, "5.0", "3", "2", "2", "2"),
    (7, "5.0", "3", "2", "2", "2"),
    (8, "5.0", "3", "2", "2", "2"),
    (9, "5.0", "2", "3", "2", "2"),
    (10, "5.0", "2", "3", "2", "2"),
    (11, "5.0", "2", "3", "2", "2"),
    (12, "10.0", "3", "2", "2", "2"),
    (13, "10.0", "2", "3", "2", "2"),
    (14, "10.0", "2", "3", "2", "2")
]

async def test_mapping_14():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        # 1. Select Sec A (4659)
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2500)

        # 2. Select Computing Skills (8117)
        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2500)

        # 3. Select MSE (778)
        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        # 4. Open Mapping screen
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        # 5. Set Total No Of Questions to 14
        print("Setting totalNumberOfQuestionAdd to 14...")
        await page.evaluate('''() => {
            document.getElementById("totalNumberOfQuestionAdd").value = "14";
            onChangeTotalNoOfQuestion();
        }''')
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3500)

        # 6. Fill rows
        print("Filling 14 rows...")
        await page.evaluate('''(mapping) => {
            mapping.forEach((item, idx) => {
                let [qNo, maxM, co1, co2, co3, co4] = item;
                let qInput = document.getElementById("obe_question_no_" + idx);
                if (qInput) qInput.value = qNo.toString();
                let mInput = document.getElementById("obe_max_marks_" + idx);
                if (mInput) mInput.value = maxM;
                let c1 = document.getElementById("courseMapping_" + idx + "_0");
                if (c1) c1.value = co1;
                let c2 = document.getElementById("courseMapping_" + idx + "_1");
                if (c2) c2.value = co2;
                let c3 = document.getElementById("courseMapping_" + idx + "_2");
                if (c3) c3.value = co3;
                let c4 = document.getElementById("courseMapping_" + idx + "_3");
                if (c4) c4.value = co4;
            });
        }''', COMPUTING_14_QUESTIONS)

        await page.screenshot(path="scratch/pre_submit_computing_14.png")
        print("Saved scratch/pre_submit_computing_14.png")

        # Listen for dialogs
        page.on("dialog", lambda dialog: asyncio.create_task(dialog.accept()))

        # 7. Submit
        print("Submitting...")
        await page.evaluate("submitQuestionAndCoMapping()")
        await page.wait_for_timeout(6000)

        await page.screenshot(path="scratch/post_submit_computing_14.png")
        print("Saved scratch/post_submit_computing_14.png")

        body_text = await page.evaluate("document.body.innerText")
        print("Page text snippet after submit:\n", body_text[:500])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_mapping_14())
