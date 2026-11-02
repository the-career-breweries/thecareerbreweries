import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        # Check components dropdown for subject 8117 (ICS) in class 4659 (Sec A)
        await page.goto("https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true")
        await page.wait_for_timeout(2500)
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)
        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)

        # Read options from componentId
        components = await page.evaluate('''() => {
            const sel = document.getElementById('componentId');
            return Array.from(sel.options).map(o => ({ value: o.value, text: o.text }));
        }''')
        print("Components for 8117 (Introduction to Computing Skills):")
        for c in components:
            print(f"  value: {c['value']} | text: {c['text']}")

        # Now let's find the menu navigation in the top/side bar of AUERP
        # Let's inspect scripts or HTML that define menus
        menu_info = await page.evaluate('''() => {
            const scripts = Array.from(document.querySelectorAll('script')).map(s => s.innerText);
            const html = document.documentElement.innerHTML;
            // look for menu arrays or items
            const matches = [];
            const regex = /menuName=([^&"']+)/g;
            let m;
            while ((m = regex.exec(html)) !== null) {
                matches.push(decodeURIComponent(m[1]));
            }
            return {
                menuMatches: Array.from(new Set(matches)),
                scriptsWithMenu: scripts.filter(s => s.includes('menu') || s.includes('dsa') || s.includes('mapping')).length
            };
        }''')
        print("Menu matches found in HTML:", menu_info["menuMatches"])

        # Also let's check document.title and any navigation menu
        nav_items = await page.evaluate('''() => {
            const nav = Array.from(document.querySelectorAll('.menu, .sidebar, .navbar, #menu, .navigation, ul, li')).map(el => el.innerText.trim()).filter(t => t.length > 0 && t.length < 50);
            return Array.from(new Set(nav)).slice(0, 30);
        }''')
        print("Nav items:", nav_items[:10])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check())
