import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=initFacultyRuleSetting&menuName=DSA%20Component%20Configuration&menuId=891&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2000)

        # Trigger academicYear and wait for navigation
        print("Selecting academicYear = '2026'...")
        async with page.expect_navigation(timeout=30000):
            await page.select_option("#academicYear", "2026")

        await page.wait_for_timeout(3000)
        print("URL after selecting year:", page.url)

        await page.screenshot(path="scratch/dsa_config_after_year.png", full_page=True)

        # Inspect tables
        table_info = await page.evaluate('''() => {
            const tables = Array.from(document.querySelectorAll('table'));
            return tables.map(t => {
                const headers = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim());
                const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => {
                    const cells = Array.from(tr.querySelectorAll('td')).map(td => ({
                        text: td.innerText.trim().replace(/\\s+/g, ' '),
                        links: Array.from(td.querySelectorAll('a, button, input[type=button]')).map(a => ({
                            text: a.innerText.trim() || a.value,
                            href: a.href,
                            onclick: a.getAttribute('onclick')
                        }))
                    }));
                    return cells;
                });
                return { id: t.id, headers, rowCount: rows.length, rows };
            });
        }''')

        print(f"Tables found: {len(table_info)}")
        for i, t in enumerate(table_info):
            print(f"\nTable {i} (id={t['id']}): headers={t['headers']}")
            print(f"Row count: {t['rowCount']}")
            for r in t['rows']:
                row_texts = [c['text'] for c in r]
                row_links = [c['links'] for c in r if len(c['links']) > 0]
                print(f"  Row: {row_texts}")
                if row_links:
                    print(f"    Actions: {row_links}")

        await b.close()

if __name__ == "__main__":
    asyncio.run(check())
