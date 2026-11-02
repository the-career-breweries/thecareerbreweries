import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_table_and_js():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=initFacultyRuleSetting&menuName=DSA%20Component%20Configuration&menuId=891&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Inspect existing table or rows on page
        table_info = await page.evaluate('''() => {
            const table = document.querySelector('table');
            if (!table) return "No table";
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
            const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
                return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\\s+/g, ' '));
            });
            return { headers, rowCount: rows.length, rows: rows.slice(0, 20) };
        }''')
        print("Existing Table Info on load:")
        print("Headers:", table_info.get("headers"))
        print(f"Row count: {table_info.get('rowCount')}")
        for r in table_info.get("rows", []):
            print("  Row:", r)

        # Inspect onchange of academicYear and classId
        js_events = await page.evaluate('''() => {
            return {
                academicYearOnChange: document.getElementById('academicYear') ? document.getElementById('academicYear').getAttribute('onchange') : null,
                classIdOnChange: document.getElementById('classId') ? document.getElementById('classId').getAttribute('onchange') : null,
                subjectIdOnChange: document.getElementById('subjectId') ? document.getElementById('subjectId').getAttribute('onchange') : null
            };
        }''')
        print("JS onchange handlers:", js_events)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_table_and_js())
