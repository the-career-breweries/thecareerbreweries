import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_bsc_obe():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/OBEMapping.do?method=initOBEMapping&menuName=OBE%20Mapping&menuId=1145&flag=false"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # 1. Select Program Type = 1
        await page.select_option("#programTypeId", "1")
        await page.wait_for_timeout(2000)

        # 2. Select Program 57 (B.Sc)
        print("Selecting programId = 57...")
        await page.select_option("#programId", "57")
        await page.wait_for_timeout(2000)

        courses = await page.evaluate('''() => {
            return Array.from(document.getElementById('courseId').options).map(o => ({ val: o.value, text: o.text }));
        }''')
        print("Courses under B.Sc:", courses)

        # Select first valid course
        if len(courses) > 1:
            await page.select_option("#courseId", courses[1]['val'])
            await page.wait_for_timeout(2000)

            # Sem 1
            await page.select_option("#semesterNo", "1")
            await page.wait_for_timeout(2000)

            subjects = await page.evaluate('''() => {
                return Array.from(document.getElementById('subjectId').options).map(o => ({ val: o.value, text: o.text }));
            }''')
            print("Subjects under B.Sc Sem 1:", subjects)

            # Search
            print("Searching OBE Mapping for B.Sc...")
            async with page.expect_navigation(timeout=30000):
                await page.evaluate("searchOBEMapping()")

            await page.wait_for_timeout(3000)
            await page.screenshot(path="scratch/obe_bsc_search.png", full_page=True)

            rows = await page.evaluate('''() => {
                const trs = Array.from(document.querySelectorAll('#dataTable tbody tr'));
                return trs.map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td')).map(td => ({
                        text: td.innerText.trim().replace(/\\s+/g, ' '),
                        actionHtml: td.innerHTML
                    }));
                    return cells;
                });
            }''')

            print(f"Found {len(rows)} rows for B.Sc:")
            for r in rows:
                print("  ", [c['text'] for c in r])
                # Check action column
                if len(r) >= 9:
                    print("     Action:", r[8]['actionHtml'])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_bsc_obe())
