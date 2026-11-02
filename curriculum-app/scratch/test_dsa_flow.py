import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def test_selection():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Check current values of academicYear and classId
        curr = await page.evaluate('''() => {
            return {
                academicYear: document.getElementById('academicYear').value,
                classId: document.getElementById('classId').value,
                hasGetSubject: typeof getSubject === 'function'
            };
        }''')
        print("Current state:", curr)

        # Select classId 4659 (Sec A)
        print("Calling getSubject('4659')...")
        await page.evaluate("getSubject('4659')")
        await page.evaluate("document.getElementById('classId').value = '4659'")
        await page.wait_for_timeout(3000)

        # Inspect subjectId options
        sub_opts = await page.evaluate('''() => {
            let s = document.getElementById('subjectId');
            return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
        }''')
        print("Subject options after selecting Sec A:", sub_opts)

        # Find Communicative English
        eng_val = None
        for o in sub_opts:
            if "Communicative English" in o['text']:
                eng_val = o['value']
                break
        print(f"Selected English val: {eng_val}")

        if eng_val:
            await page.evaluate(f"document.getElementById('subjectId').value = '{eng_val}'")
            # call onchange handler for subjectId
            print(f"Calling getComponentAfterSubject('{eng_val}')...")
            await page.evaluate(f"getComponentAfterSubject('{eng_val}')")
            if await page.evaluate("typeof getGroups === 'function'"):
                await page.evaluate(f"getGroups('{eng_val}')")
            await page.wait_for_timeout(3000)

            comp_opts = await page.evaluate('''() => {
                let s = document.getElementById('componentId');
                return Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
            }''')
            print("Component options:", comp_opts)

            mse_val = None
            for o in comp_opts:
                if "MSE" in o['text']:
                    mse_val = o['value']
                    break
            print(f"MSE val: {mse_val}")

            if mse_val:
                await page.evaluate(f"document.getElementById('componentId').value = '{mse_val}'")
                await page.wait_for_timeout(1000)

                print("Calling getQuestionAndCOMapping()...")
                # Let's inspect what getQuestionAndCOMapping does
                fn_str = await page.evaluate("getQuestionAndCOMapping.toString()")
                print("getQuestionAndCOMapping function definition:\n", fn_str[:500])

                await page.evaluate("getQuestionAndCOMapping()")
                await page.wait_for_timeout(4000)

                await page.screenshot(path="scratch/dsa_mapping_screen_seca.png")
                print("Screenshot saved to scratch/dsa_mapping_screen_seca.png")

                content = await page.content()
                print("Page URL after click:", page.url)
                print("Contains 'DSA Component Marks Entry':", "DSA Component Marks Entry" in content)
                print("Contains 'Question No':", "Question No" in content)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_selection())
