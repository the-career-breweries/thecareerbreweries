import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=60000, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        # Native select class
        print("Selecting class 4660 natively...")
        await page.select_option("#classId", "4660")
        await page.wait_for_function("() => document.querySelectorAll('#subjectId option').length > 1", timeout=25000)
        print("Subjects loaded!")

        # Native select subject
        print("Selecting subject 8117 natively...")
        await page.select_option("#subjectId", "8117")
        await page.wait_for_function("() => document.querySelectorAll('#componentId option').length > 1", timeout=25000)
        print("Components loaded!")

        # Native select component
        print("Selecting component 807 natively...")
        await page.select_option("#componentId", "807")
        await page.wait_for_timeout(1000)

        # Click Mark Entry button
        print("Clicking #btn_dsa_mark_entry_id...")
        await page.locator("#btn_dsa_mark_entry_id").click()
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=25000)
        except:
            pass
        await page.wait_for_timeout(4000)
        await page.wait_for_selector("table tbody tr input", timeout=30000)

        inputs = await page.evaluate("document.querySelectorAll('table tbody tr input').length")
        print(f"SUCCESS! Table opened with {inputs} input fields!")
        await b.close()

if __name__ == "__main__":
    asyncio.run(test())
