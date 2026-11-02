import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_dom():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        await page.goto("https://portal.alliance.edu.in/auerp/loginAction.do?method=initHome", timeout=45000)
        await page.wait_for_timeout(3000)

        # Screenshot home
        await page.screenshot(path="scratch/auerp_home.png")

        # Let's inspect page frames and HTML elements
        frames = page.frames
        print(f"Frames count: {len(frames)}")
        for i, f in enumerate(frames):
            print(f"Frame {i}: url={f.url}")

        # Check menu elements
        elements = await page.evaluate('''() => {
            const all = document.querySelectorAll('*');
            const res = [];
            for (let el of all) {
                if (el.innerText && (el.innerText.includes('Question') || el.innerText.includes('Mapping') || el.innerText.includes('CO') || el.innerText.includes('DSA') || el.innerText.includes('Marks') || el.innerText.includes('Evaluation') || el.innerText.includes('OBE'))) {
                    if (el.children.length === 0 || el.tagName === 'A' || el.tagName === 'LI' || el.tagName === 'SPAN') {
                        res.push({
                            tag: el.tagName,
                            text: el.innerText.trim().replace(/\\s+/g, ' '),
                            id: el.id,
                            className: el.className
                        });
                    }
                }
            }
            return res.slice(0, 50);
        }''')
        print("Matching elements on page:")
        for el in elements:
            print(" ", el)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_dom())
