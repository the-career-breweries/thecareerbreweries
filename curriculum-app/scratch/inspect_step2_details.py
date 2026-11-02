import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_full_step2():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2000)

        # Submit to get to step 2
        async with page.expect_navigation(timeout=30000):
            await page.evaluate("submitForm()")

        await page.wait_for_timeout(3000)

        # Inspect table and all components
        data = await page.evaluate('''() => {
            const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
                const selects = Array.from(tr.querySelectorAll('select')).map(s => {
                    const opt = s.selectedOptions[0];
                    return { id: s.id, name: s.name, val: opt ? opt.text : '' };
                });
                const inputs = Array.from(tr.querySelectorAll('input')).map(inp => ({
                    id: inp.id,
                    name: inp.name,
                    val: inp.value
                }));
                const text = tr.innerText.trim().replace(/\\s+/g, ' ');
                return { text, selects, inputs };
            });

            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            }));

            const fullText = document.body.innerText;

            return { rows, buttons, fullText };
        }''')

        print("Components rows:")
        for r in data['rows']:
            print(" ", r)

        print("\nButtons:")
        for b in data['buttons']:
            print(" ", b)

        print("\nPage text snippet:\n", data['fullText'][:2500])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_full_step2())
