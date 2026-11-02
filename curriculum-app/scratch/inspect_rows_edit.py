import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_rows():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=getList&year=2026"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Inspect row 3 and 5 in #list
        rows_data = await page.evaluate('''() => {
            const table = document.getElementById('list');
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            return rows.map(r => {
                const cells = Array.from(r.querySelectorAll('td'));
                return {
                    sl: cells[0] ? cells[0].innerText.trim() : '',
                    cls: cells[1] ? cells[1].innerText.trim() : '',
                    course: cells[3] ? cells[3].innerText.trim() : '',
                    components: cells[4] ? cells[4].innerText.trim() : '',
                    editHTML: cells[5] ? cells[5].innerHTML : '',
                    deleteHTML: cells[6] ? cells[6].innerHTML : '',
                };
            });
        }''')

        for r in rows_data:
            print(f"Row {r['sl']}: {r['cls']} | {r['course']} | Comps: {r['components']}")
            print(f"   Edit: {r['editHTML']}")

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_rows())
