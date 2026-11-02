import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://localhost:8500")
        await page.wait_for_timeout(1000)
        
        # Test 1: Computing Skills -> Hamza
        print("--- TEST 1: Computing Skills -> Hamza ---")
        comp_btn = page.locator("button:has-text('Introduction to Computing Skills')")
        await comp_btn.click()
        await page.wait_for_timeout(400)
        
        await page.fill("#searchInput", "Hamza")
        await page.wait_for_timeout(400)
        
        name = await page.inner_text("#studentName")
        reg = await page.inner_text("#studentRegNo")
        cls = await page.inner_text("#studentClassBadge")
        q_count = len(await page.query_selector_all("#questionsGrid input"))
        print(f"Student: {name} | Class: {cls} | Reg: {reg} | Questions: {q_count}")
        
        # Press Enter to test auto-focus
        await page.press("#searchInput", "Enter")
        await page.wait_for_timeout(300)
        active_id = await page.evaluate("document.activeElement ? document.activeElement.id : null")
        print(f"Active Element after Enter: {active_id}")
        
        await page.screenshot(path="scratch/test_hamza_computing_card.png")
        
        # Test 2: Communicative English -> Bilal
        print("\n--- TEST 2: Communicative English -> Bilal ---")
        eng_btn = page.locator("button:has-text('Communicative English')")
        await eng_btn.click()
        await page.wait_for_timeout(400)
        
        await page.fill("#searchInput", "Bilal")
        await page.wait_for_timeout(400)
        
        name2 = await page.inner_text("#studentName")
        reg2 = await page.inner_text("#studentRegNo")
        cls2 = await page.inner_text("#studentClassBadge")
        q_count2 = len(await page.query_selector_all("#questionsGrid input"))
        print(f"Student: {name2} | Class: {cls2} | Reg: {reg2} | Questions: {q_count2}")
        
        await page.screenshot(path="scratch/test_bilal_english_card.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
