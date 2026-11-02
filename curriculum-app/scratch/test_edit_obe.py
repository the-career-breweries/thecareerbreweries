import asyncio
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb3Vyc2VOYW1lIjoiQmFjaGVsb3Igb2YgU2NpZW5jZSBpbiBBdmlhdGlvbiAvIEFlcm9uYXV0aWNhbCBTY2llbmNlIiwicHJvZ3JhbVR5cGUiOiJVbmRlciBHcmFkdWF0aW9uIiwiYmF0Y2giOjIwMjYsInNlbWVzdGVyIjoxLCJwcm9ncmFtIjoiQmFjaGVsb3Igb2YgU2NpZW5jZSBpbiBBdmlhdGlvbiAvIEFlcm9uYXV0aWNhbCBTY2llbmNlIiwiY291cnNlSWQiOjI3OCwic3ViamVjdElkIjo4MTE3LCJzdWJqZWN0TmFtZSI6Ilo3QVZBIDI2MjA5LUludHJvZHVjdGlvbiB0byBDb21wdXRpbmcgU2tpbGxzIn0.sX2FmnwPsrbF6r31Wl_n433fhh4Ll_X7u_qeuAR3cKM"

async def edit_obe():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
        url = "https://portal.alliance.edu.in/auerp/OBEMapping.do?method=initOBEMapping&menuName=OBE%20Mapping&menuId=1145&flag=false"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        print("Calling editOBEMapping(TOKEN)...")
        async with page.expect_navigation(timeout=30000):
            await page.evaluate(f"editOBEMapping('{TOKEN}')")

        await page.wait_for_timeout(3000)
        print("URL after editOBEMapping:", page.url)
        await page.screenshot(path="scratch/obe_edit_screen.png", full_page=True)

        data = await page.evaluate('''() => {
            const tables = Array.from(document.querySelectorAll('table')).map(t => {
                const headers = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\\s+/g, ' '));
                const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => {
                    return Array.from(tr.querySelectorAll('td')).map(td => {
                        const inputs = Array.from(td.querySelectorAll('input, select')).map(i => ({
                            name: i.name,
                            val: i.value,
                            text: i.tagName === 'SELECT' ? (i.selectedOptions[0] ? i.selectedOptions[0].text : '') : i.value
                        }));
                        return {
                            text: td.innerText.trim().replace(/\\s+/g, ' '),
                            inputs
                        };
                    });
                });
                return { id: t.id, headers, rows };
            });
            return { bodySnippet: document.body.innerText, tables };
        }''')

        print(f"Tables: {len(data['tables'])}")
        for i, t in enumerate(data['tables']):
            print(f"Table {i} (id={t['id']}): headers={t['headers']}")
            for r in t['rows']:
                r_txt = " | ".join([f"{c['text']} (inp:{c['inputs']})" if c['inputs'] else c['text'] for c in r])
                print(" ", r_txt)

        print("\nSnippet:\n", data['bodySnippet'][:1500])

        await b.close()

if __name__ == "__main__":
    asyncio.run(edit_obe())
