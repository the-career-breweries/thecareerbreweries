import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

QUESTION_MAPPING = [
    # (Q No, Max Mark, CO1, CO2, CO3, CO4)
    # Values: '1' -> '1- Weak', '2' -> '2- Moderate', '3' -> '3- Strong'
    (1, "4.0", "3", "2", "2", "1"),
    (2, "4.0", "3", "2", "2", "1"),
    (3, "4.0", "3", "2", "2", "2"),
    (4, "6.0", "3", "2", "2", "2"),
    (5, "2.0", "3", "2", "2", "2"),
    (6, "11.0", "2", "3", "2", "2"),
    (7, "4.0", "2", "3", "2", "2"),
    (8, "3.0", "2", "2", "3", "2"),
    (9, "5.0", "2", "2", "3", "2"),
    (10, "3.0", "2", "2", "3", "2"),
    (11, "2.0", "2", "2", "3", "2"),
    (12, "2.0", "2", "2", "3", "2")
]

async def configure_section(page, class_id, class_name):
    print(f"\n=======================================================")
    print(f"Starting Question & CO Mapping for {class_name} (classId={class_id})...")
    print(f"=======================================================")

    url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
    await page.goto(url, timeout=45000)
    await page.wait_for_timeout(3000)

    # 1. Select Class
    print(f"Selecting class {class_name}...")
    await page.evaluate(f"getSubject('{class_id}')")
    await page.evaluate(f"document.getElementById('classId').value = '{class_id}'")
    await page.wait_for_timeout(2500)

    # 2. Select Subject (Communicative English = 8046)
    print("Selecting Communicative English (8046)...")
    await page.evaluate("document.getElementById('subjectId').value = '8046'")
    await page.evaluate("getComponentAfterSubject('8046')")
    await page.wait_for_timeout(2500)

    # 3. Select Component (MSE = 778)
    print("Selecting MSE (778)...")
    await page.evaluate("document.getElementById('componentId').value = '778'")
    await page.wait_for_timeout(1000)

    # 4. Open Question & CO Mapping screen
    print("Clicking getQuestionAndCOMapping()...")
    await page.evaluate("getQuestionAndCOMapping()")
    await page.wait_for_load_state("networkidle", timeout=15000)
    await page.wait_for_timeout(3000)

    # 5. Set Total No Of Questions to 12
    print("Setting totalNumberOfQuestionAdd to 12...")
    await page.evaluate('''() => {
        document.getElementById("totalNumberOfQuestionAdd").value = "12";
        onChangeTotalNoOfQuestion();
    }''')
    await page.wait_for_load_state("networkidle", timeout=15000)
    await page.wait_for_timeout(3500)

    # 6. Fill all 12 rows
    print("Filling 12 question rows with marks and CO ratings...")
    await page.evaluate('''(mapping) => {
        mapping.forEach((item, idx) => {
            let [qNo, maxM, co1, co2, co3, co4] = item;
            
            // Question No
            let qInput = document.getElementById("obe_question_no_" + idx);
            if (qInput) qInput.value = qNo.toString();

            // Max Mark
            let mInput = document.getElementById("obe_max_marks_" + idx);
            if (mInput) mInput.value = maxM;

            // CO1
            let c1 = document.getElementById("courseMapping_" + idx + "_0");
            if (c1) c1.value = co1;

            // CO2
            let c2 = document.getElementById("courseMapping_" + idx + "_1");
            if (c2) c2.value = co2;

            // CO3
            let c3 = document.getElementById("courseMapping_" + idx + "_2");
            if (c3) c3.value = co3;

            // CO4
            let c4 = document.getElementById("courseMapping_" + idx + "_3");
            if (c4) c4.value = co4;
        });
    }''', QUESTION_MAPPING)

    await page.wait_for_timeout(1000)

    # Verify filled values in DOM
    verification = await page.evaluate('''() => {
        let results = [];
        let totalMarks = 0.0;
        for (let i = 0; i < 12; i++) {
            let qNo = document.getElementById("obe_question_no_" + i) ? document.getElementById("obe_question_no_" + i).value : null;
            let mMark = document.getElementById("obe_max_marks_" + i) ? document.getElementById("obe_max_marks_" + i).value : null;
            let c1 = document.getElementById("courseMapping_" + i + "_0") ? document.getElementById("courseMapping_" + i + "_0").value : null;
            let c2 = document.getElementById("courseMapping_" + i + "_1") ? document.getElementById("courseMapping_" + i + "_1").value : null;
            let c3 = document.getElementById("courseMapping_" + i + "_2") ? document.getElementById("courseMapping_" + i + "_2").value : null;
            let c4 = document.getElementById("courseMapping_" + i + "_3") ? document.getElementById("courseMapping_" + i + "_3").value : null;
            if (mMark) totalMarks += parseFloat(mMark);
            results.push({ i, qNo, mMark, c1, c2, c3, c4 });
        }
        return { results, totalMarks };
    }''')

    print(f"Verified row count: {len(verification['results'])}, Total calculated marks: {verification['totalMarks']}")
    for r in verification['results']:
        print(f"  Row {r['i']+1}: Q={r['qNo']}, Mark={r['mMark']}, CO1={r['c1']}, CO2={r['c2']}, CO3={r['c3']}, CO4={r['c4']}")

    safe_name = class_name.lower().replace(" ", "_")
    pre_shot = f"scratch/pre_submit_{safe_name}.png"
    await page.screenshot(path=pre_shot)
    print(f"Pre-submit screenshot saved to {pre_shot}")

    # 7. Submit
    print("Triggering submitQuestionAndCoMapping()...")
    # In submitQuestionAndCoMapping, it calls confirm().
    # Playwright dialog listener will accept it automatically.
    dialog_handled = []
    def handle_dialog(dialog):
        print(f"Dialog encountered: [{dialog.type}] {dialog.message}")
        dialog_handled.append(dialog.message)
        asyncio.create_task(dialog.accept())

    page.on("dialog", handle_dialog)

    await page.evaluate("submitQuestionAndCoMapping()")
    await page.wait_for_timeout(6000)

    post_shot = f"scratch/post_submit_{safe_name}.png"
    await page.screenshot(path=post_shot)
    print(f"Post-submit screenshot saved to {post_shot}")

    body_text = await page.evaluate("document.body.innerText")
    success_indicators = [
        "successfully" in body_text.lower(),
        "success" in body_text.lower(),
        "submitted" in body_text.lower(),
        "saved" in body_text.lower(),
        "dsa component mark entry" in body_text.lower()
    ]
    print(f"Submission status indicators: {success_indicators}")
    print(f"Snippet of page text:\n{body_text[:400]}")
    return True

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        # 1. B.Sc Section A
        await configure_section(page, "4659", "I_ASAS_BSC_2026_SECA")

        # 2. B.Sc Section B
        await configure_section(page, "4660", "I_ASAS_BSC_2026_SECB")

        await browser.close()
        print("\nAll sections successfully processed!")

if __name__ == '__main__':
    asyncio.run(main())
