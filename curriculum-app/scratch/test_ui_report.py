import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

async def inspect():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page()
        await page.goto('http://localhost:8502', timeout=30000)
        await page.wait_for_timeout(3000)

        # In sidebar, find the button with "Hourly Log"
        nav_btn = page.locator("button").filter(has_text="Hourly Log")
        print("Hourly Log nav count:", await nav_btn.count())
        if await nav_btn.count() > 0:
            await nav_btn.first.click()
            await page.wait_for_timeout(3000)

        # Print all buttons
        buttons = await page.locator("button").all_inner_texts()
        for idx, btn in enumerate(buttons):
            print(f"Btn {idx}: {repr(btn)}")

        # Click Generate Weekly Report button
        gen_btn = page.locator("button").filter(has_text="Generate Weekly Report")
        if await gen_btn.count() > 0:
            print("Clicking Generate Weekly Report button...")
            await gen_btn.first.click()
            await page.wait_for_timeout(10000)

            # Check messages
            alerts = await page.locator(".stAlert").all_inner_texts()
            for a in alerts:
                print("Alert:", a.replace('\n', ' '))

            # Check for download button
            dl_btn = page.locator("button, a").filter(has_text="Download")
            print("Download button count:", await dl_btn.count())
            if await dl_btn.count() > 0:
                print("Download button text:", await dl_btn.first.inner_text())

            await page.screenshot(path="scratch/erp_report_ui_result.png", full_page=True)
            print("Screenshot saved to scratch/erp_report_ui_result.png")

        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect())
