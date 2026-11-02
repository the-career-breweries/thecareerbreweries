import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8')

async def verify_hourly_sync():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page()
        await page.goto('http://localhost:8502', timeout=30000)
        await page.wait_for_timeout(3000)

        # Click button containing Hourly Log
        btn = page.locator("button").filter(has_text="Hourly Log")
        print("Hourly Log button count:", await btn.count())
        if await btn.count() > 0:
            await btn.first.click()
            await page.wait_for_timeout(3000)

        # Check for Sync button
        sync_btn = page.locator("button").filter(has_text="Sync to Official Sheet")
        print("Sync button count:", await sync_btn.count())
        if await sync_btn.count() > 0:
            btn_text = await sync_btn.first.inner_text()
            print(f"Clicking sync button: {btn_text}...")
            await sync_btn.first.click()
            await page.wait_for_timeout(8000)

            # Check messages
            success_box = page.locator(".stAlert, [data-testid='stAlert']")
            if await success_box.count() > 0:
                for i in range(await success_box.count()):
                    print("Alert box:", await success_box.nth(i).inner_text())

            await page.screenshot(path="scratch/erp_sync_success_result.png", full_page=True)
            print("Screenshot saved to scratch/erp_sync_success_result.png")
        else:
            print("Sync button not found. Current URL:", page.url)

        await b.close()

if __name__ == "__main__":
    asyncio.run(verify_hourly_sync())
