import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_submit():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Inspect submitbutton
        btn_info = await page.evaluate('''() => {
            const btn = document.getElementById('submitbutton');
            return {
                id: btn ? btn.id : null,
                val: btn ? btn.value : null,
                onclick: btn ? btn.getAttribute('onclick') : null,
                formAction: btn && btn.form ? btn.form.action : null
            };
        }''')
        print("Submit button info:", btn_info)

        # Let's inspect all script tags to find functions like updateRuleSetting, next, etc.
        scripts = await page.evaluate('''() => {
            const sc = Array.from(document.querySelectorAll('script')).map(s => s.innerText);
            return sc.filter(s => s.includes('update') || s.includes('RuleSetting') || s.includes('Component') || s.includes('Mapping'));
        }''')
        print(f"Relevant scripts count: {len(scripts)}")
        for i, s in enumerate(scripts[:5]):
            print(f"--- Script {i} ---")
            print(s[:500])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_submit())
