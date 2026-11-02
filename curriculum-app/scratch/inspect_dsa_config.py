import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_dsa_config():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=initFacultyRuleSetting&menuName=DSA%20Component%20Configuration&menuId=891&flag=true"
        print(f"Navigating to {url}...")
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        await page.screenshot(path="scratch/dsa_config_home.png")

        # Let's inspect the dropdowns/controls
        info = await page.evaluate('''() => {
            const selects = Array.from(document.querySelectorAll('select')).map(s => ({
                id: s.id,
                name: s.name,
                options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
            }));
            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText
            }));
            return {
                title: document.title,
                selects,
                buttons,
                bodySnippet: document.body.innerText.slice(0, 1000)
            };
        }''')
        print("DSA Config Screen Info:")
        print("Title:", info["title"])
        print("Selects:")
        for s in info["selects"]:
            print(f"  id='{s['id']}', name='{s['name']}' -> {len(s['options'])} options: {s['options'][:5]}")
        print("Body Snippet:\n", info["bodySnippet"][:400])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_dsa_config())
