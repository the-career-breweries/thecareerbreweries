import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def inspect_validation():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Class Sec A, Computing Skills (8117), MSE (778)
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8117'")
        await page.evaluate("getComponentAfterSubject('8117')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.wait_for_timeout(1000)

        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle", timeout=15000)
        await page.wait_for_timeout(3000)

        # Inspect all validation functions on the page
        js = await page.evaluate('''() => {
            let res = {};
            for (let prop in window) {
                if (typeof window[prop] === 'function' && (prop.toLowerCase().includes('validate') || prop.toLowerCase().includes('mapping') || prop.toLowerCase().includes('submit') || prop.toLowerCase().includes('mark'))) {
                    try {
                        res[prop] = window[prop].toString();
                    } catch(e) {}
                }
            }
            return res;
        }''')

        for k, v in js.items():
            print(f"=== Function {k} ===")
            print(v[:1000])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_validation())
