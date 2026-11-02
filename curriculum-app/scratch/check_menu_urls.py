import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_links():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        await page.goto("https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true")
        await page.wait_for_timeout(2500)

        # Extract all links that contain menuName or .do
        links = await page.evaluate('''() => {
            const result = [];
            document.querySelectorAll('a').forEach(a => {
                const text = a.innerText.trim();
                const href = a.href;
                const onclick = a.getAttribute('onclick');
                if (href || onclick) {
                    result.push({ text, href, onclick });
                }
            });
            return result;
        }''')

        print(f"Total links: {len(links)}")
        for l in links:
            t = l['text'].lower()
            h = (l['href'] or '').lower()
            if any(k in t or k in h for k in ['dsa', 'component', 'obe', 'outcome', 'mapping', 'configuration']):
                print(f"Link: text='{l['text']}' | href='{l['href']}' | onclick='{l['onclick']}'")

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_links())
