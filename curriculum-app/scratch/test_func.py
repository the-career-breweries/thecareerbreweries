import asyncio
from playwright.async_api import async_playwright

async def get_func():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json")
        page = await ctx.new_page()
        await page.goto("https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true")
        await page.wait_for_timeout(2000)
        await page.evaluate("getSubject('4660')")
        await page.evaluate("document.getElementById('classId').value = '4660'")
        await page.wait_for_timeout(2000)
        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)
        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        fn = await page.evaluate("uploadDSAMarksExcelFile.toString()")
        print(fn)
        await b.close()

if __name__ == "__main__":
    asyncio.run(get_func())
