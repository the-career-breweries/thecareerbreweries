import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def inspect_functions():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8046'")
        await page.evaluate("getComponentAfterSubject('8046')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '778'")
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_timeout(3000)

        fn_info = await page.evaluate('''() => {
            return {
                addMore: typeof addMoreQuestionForComponent === 'function' ? addMoreQuestionForComponent.toString() : null,
                removeLast: typeof removeLastQuestionForComponent === 'function' ? removeLastQuestionForComponent.toString() : null,
                submit: typeof submitQuestionAndCoMapping === 'function' ? submitQuestionAndCoMapping.toString() : null,
                totalQInputEvents: {
                    onchange: document.getElementById('totalNumberOfQuestionAdd') ? document.getElementById('totalNumberOfQuestionAdd').getAttribute('onchange') : null,
                    onblur: document.getElementById('totalNumberOfQuestionAdd') ? document.getElementById('totalNumberOfQuestionAdd').getAttribute('onblur') : null
                }
            };
        }''')

        print("addMore function:\n", fn_info['addMore'])
        print("\nsubmit function:\n", fn_info['submit'])
        print("\ntotalQInputEvents:\n", fn_info['totalQInputEvents'])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_functions())
