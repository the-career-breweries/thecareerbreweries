import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_view():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # viewFacultyRuleSetting definition
        fn_view = await page.evaluate("typeof viewFacultyRuleSetting !== 'undefined' ? viewFacultyRuleSetting.toString() : 'undefined'")
        print("viewFacultyRuleSetting:\n", fn_view)

        # Let's submitForm() to see step 2
        print("\nSubmitting form (Update / Next step)...")
        async with page.expect_navigation(timeout=30000):
            await page.evaluate("submitForm()")

        await page.wait_for_timeout(3000)
        print("URL after submitForm:", page.url)
        await page.screenshot(path="scratch/rules_step2_20471.png", full_page=True)

        body_text = await page.evaluate("document.body.innerText")
        print("\nPage text after submitForm (first 1500 chars):\n", body_text[:1500])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_view())
