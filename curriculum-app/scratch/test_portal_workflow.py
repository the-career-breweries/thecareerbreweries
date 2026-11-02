import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8500")
        await page.wait_for_timeout(1000)
        
        # Test 1: Cross-subject detection
        # Switch to B.SC A COMPUTING first
        tabs = await page.query_selector_all("#subjectTabs button")
        for t in tabs:
            txt = await t.inner_text()
            if "b.sc a computing" in txt.lower():
                await t.click()
                print("Switched to Section A Computing")
                break
        await page.wait_for_timeout(400)
        await page.fill("#searchInput", "bilal")
        await page.wait_for_timeout(400)
        
        banner_visible = await page.is_visible("#crossSubjectBanner:not(.hidden)")
        print(f"Cross-subject banner visible when on Sec A: {banner_visible}")
        if banner_visible:
            banner_text = await page.inner_text("#crossSubjectBanner")
            print("Banner text:", banner_text.replace("\n", " | "))
            
        await page.screenshot(path="scratch/test_bilal_cross_subject.png")
        
        # Test 2: Click the button to switch to B.Sc B English
        switch_btn = page.locator("#crossSubjectBanner button:has-text('B.Sc B English')")
        if await switch_btn.count() > 0:
            await switch_btn.click()
            await page.wait_for_timeout(500)
        else:
            # Click tab directly
            for t in await page.query_selector_all("#subjectTabs button"):
                if "b.sc b english" in (await t.inner_text()).lower():
                    await t.click()
                    break
            await page.wait_for_timeout(500)
            await page.fill("#searchInput", "bilal")
            await page.wait_for_timeout(500)

        # Press Enter on search input to test auto-focus
        await page.press("#searchInput", "Enter")
        await page.wait_for_timeout(300)
        
        name = await page.inner_text("#studentName")
        reg = await page.inner_text("#studentRegNo")
        active_id = await page.evaluate("document.activeElement ? document.activeElement.id : null")
        print(f"Selected: {name} ({reg}), Active element ID: {active_id}")
        
        await page.screenshot(path="scratch/test_bilal_card_ready.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
