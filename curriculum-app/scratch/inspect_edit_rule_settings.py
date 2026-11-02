import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_edit():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=getList&year=2026"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Check editRuleSettings definition
        fn = await page.evaluate("editRuleSettings.toString()")
        print("editRuleSettings function:\n", fn)

        # Execute editRuleSettings('20471')
        print("\nTriggering editRuleSettings('20471')...")
        async with page.expect_navigation(timeout=30000):
            await page.evaluate("editRuleSettings('20471')")

        await page.wait_for_timeout(3000)
        print("URL after edit:", page.url)
        await page.screenshot(path="scratch/edit_rules_20471.png", full_page=True)

        # Inspect all forms/tables on this edit screen
        screen_data = await page.evaluate('''() => {
            const tables = Array.from(document.querySelectorAll('table')).map(t => {
                const headers = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\\s+/g, ' '));
                const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => {
                    return Array.from(tr.querySelectorAll('td')).map(td => {
                        // check inputs inside td
                        const inputs = Array.from(td.querySelectorAll('input, select')).map(inp => ({
                            name: inp.name,
                            id: inp.id,
                            type: inp.type,
                            value: inp.value,
                            text: inp.tagName === 'SELECT' ? (inp.selectedOptions[0] ? inp.selectedOptions[0].text : '') : inp.value
                        }));
                        return {
                            text: td.innerText.trim().replace(/\\s+/g, ' '),
                            inputs
                        };
                    });
                });
                return { id: t.id, headers, rows };
            });

            return {
                title: document.title,
                tables
            };
        }''')

        print(f"Tables on edit page: {len(screen_data['tables'])}")
        for i, t in enumerate(screen_data['tables']):
            print(f"\n--- Table {i} (id={t['id']}) ---")
            print("Headers:", t['headers'])
            for r in t['rows']:
                row_str = " | ".join([f"{c['text']} (inputs: {c['inputs']})" if c['inputs'] else c['text'] for c in r])
                print("  ", row_str)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_edit())
