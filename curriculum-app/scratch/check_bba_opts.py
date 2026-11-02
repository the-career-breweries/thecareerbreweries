import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def check_bba():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        c = await b.new_context(storage_state=AUTH_FILE)
        page = await c.new_page()
        await page.goto('https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true')
        await page.wait_for_timeout(2000)
        await page.evaluate("getSubject('4661')")
        await page.wait_for_timeout(2000)
        opts = await page.evaluate("Array.from(document.getElementById('subjectId').options).map(o => ({ val: o.value, text: o.text }))")
        print('BBA subjects:', opts)
        await b.close()

if __name__ == '__main__':
    asyncio.run(check_bba())
