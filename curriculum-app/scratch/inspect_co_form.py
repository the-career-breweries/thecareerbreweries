import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_form_inputs():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # BBA English (4661, 8040)
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        # Inspect all form inputs
        inputs = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('input, select')).map(el => ({
                id: el.id,
                name: el.name,
                type: el.type,
                value: el.value,
                className: el.className
            }));
        }''')

        print("Form inputs on Question & CO screen:")
        for inp in inputs:
            if inp['name'] or inp['id']:
                print(" ", inp)

        # Inspect addMoreQuestionForComponent and submitQuestionAndCoMapping functions
        fns = await page.evaluate('''() => {
            return {
                addMore: typeof addMoreQuestionForComponent !== 'undefined' ? addMoreQuestionForComponent.toString() : 'undefined',
                submitMapping: typeof submitQuestionAndCoMapping !== 'undefined' ? submitQuestionAndCoMapping.toString() : 'undefined'
            };
        }''')
        print("\naddMoreQuestionForComponent:\n", fns['addMore'])
        print("\nsubmitQuestionAndCoMapping:\n", fns['submitMapping'])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(check_form_inputs())
