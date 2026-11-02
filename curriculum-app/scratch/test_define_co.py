import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def test_define():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        # Handle dialogs automatically (confirm dialog in submitQuestionAndCoMapping)
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # 1. Select BBA English (4661, 8040)
        print("Selecting BBA English...")
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        # 2. Select Component 777 (Assignment 1)
        print("Selecting Component 777 (Assignment 1)...")
        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.wait_for_timeout(1000)
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        # 3. Click Question & CO Mapping
        print("Opening Question & CO Mapping screen...")
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        # 4. Fill values:
        # Question No: 1
        # Max Mark: 15
        # CO3: 3
        print("Filling Question No = 1, Max Marks = 15, CO3 = 3...")
        await page.locator("#obe_question_no_0").fill("1")
        await page.locator("#obe_max_marks_0").fill("15")
        await page.select_option("#courseMapping_0_2", "3") # CO3 = 3 (Strong)
        await page.wait_for_timeout(1000)

        await page.screenshot(path="scratch/bba_assignment1_before_submit.png", full_page=True)

        # 5. Submit Question and CO Mapping
        print("Clicking Submit (submitQuestionAndCoMapping)...")
        await page.evaluate("submitQuestionAndCoMapping()")
        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except:
            pass
        await page.wait_for_timeout(4000)

        await page.screenshot(path="scratch/bba_assignment1_after_submit.png", full_page=True)

        body_text = await page.evaluate("document.body.innerText")
        print("Page confirmation after submit:")
        for line in body_text.split("\n"):
            line_str = line.strip()
            if any(k in line_str.lower() for k in ["success", "saved", "error", "mapping", "question", "missing"]):
                print(f"  -> {line_str}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_define())
