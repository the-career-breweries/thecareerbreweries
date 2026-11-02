import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_view_ajax():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=getList&year=2026"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2000)

        # Call viewExamFacultyRuleSetting via fetch
        res = await page.evaluate('''async () => {
            const resp = await fetch("ExamFacultyRuleSetting.do?method=viewExamFacultyRuleSetting&ruleSettingId=20471");
            const text = await resp.text();
            return text;
        }''')

        print("viewExamFacultyRuleSetting response for 20471 (first 2000 chars):")
        print(res[:2000])

        with open("scratch/view_exam_faculty_rule_setting_20471.html", "w", encoding="utf-8") as f:
            f.write(res)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_view_ajax())
