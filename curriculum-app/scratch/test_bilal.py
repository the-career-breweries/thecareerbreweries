import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        page = await (await p.chromium.launch()).new_page()
        await page.goto("http://localhost:8500")
        await page.wait_for_timeout(1000)
        
        # Click tab case-insensitively
        tabs = await page.query_selector_all("#subjectTabs button")
        for t in tabs:
            txt = await t.inner_text()
            if "b.sc b english" in txt.lower():
                await t.click()
                print("Clicked:", txt.replace("\n", " | "))
                break
                
        await page.wait_for_timeout(500)
        await page.fill("#searchInput", "bilal")
        await page.wait_for_timeout(500)
        
        name = await page.inner_text("#studentName")
        reg = await page.inner_text("#studentRegNo")
        print(f"NAME: {name}, REG: {reg}")
        
        await page.screenshot(path="scratch/test_bilal_search.png")
        await page.close()

if __name__ == "__main__":
    asyncio.run(main())
