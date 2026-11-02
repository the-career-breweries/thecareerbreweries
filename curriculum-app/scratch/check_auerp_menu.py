import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_menus():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        await page.goto("https://portal.alliance.edu.in/auerp/loginAction.do?method=initHome", timeout=45000)
        await page.wait_for_timeout(3000)

        # Extract all menu links and text
        links = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.innerText.trim(),
                href: a.href,
                onclick: a.getAttribute('onclick')
            })).filter(x => x.text.length > 0 || (x.href && x.href.includes('.do')));
        }''')

        print("Total links found:", len(links))
        for l in links:
            t = l['text'].lower()
            h = (l['href'] or '').lower()
            if any(k in t or k in h for k in ['mapping', 'question', 'co', 'dsa', 'component', 'mark', 'assignment', 'course']):
                print(f"Match: text='{l['text']}' | href='{l['href']}' | onclick='{l['onclick']}'")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_menus())
