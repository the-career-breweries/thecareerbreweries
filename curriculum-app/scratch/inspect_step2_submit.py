import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_step3():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        # Go to Step 1
        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2000)

        # Submit to Step 2
        async with page.expect_navigation(timeout=30000):
            await page.evaluate("submitForm()")

        await page.wait_for_timeout(3000)
        print("At Step 2: URL=", page.url)

        # Inspect submitbutton and forms on Step 2
        btn_info = await page.evaluate('''() => {
            const btn = document.getElementById('submitbutton');
            const form = document.querySelector('form');
            return {
                btnVal: btn ? btn.value : null,
                btnOnclick: btn ? btn.getAttribute('onclick') : null,
                formAction: form ? form.action : null,
                formMethod: form ? form.elements['method'] ? form.elements['method'].value : null : null
            };
        }''')
        print("Step 2 button and form info:", btn_info)

        # Inspect all functions defined in scripts on Step 2
        scripts = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('script')).map(s => s.innerText).filter(s => s.includes('submit') || s.includes('update') || s.includes('save'));
        }''')
        print(f"Scripts on Step 2 count: {len(scripts)}")
        for s in scripts:
            print("--- Script snippet ---")
            print(s[:500])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_step3())
