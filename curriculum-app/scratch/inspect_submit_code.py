import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_submit_form():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        fn = await page.evaluate("typeof submitForm !== 'undefined' ? submitForm.toString() : 'undefined'")
        print("submitForm:\n", fn)

        # What other functions exist on the page?
        funcs = await page.evaluate('''() => {
            const names = [];
            for (let k in window) {
                if (typeof window[k] === 'function' && !k.startsWith('webkit') && !k.startsWith('on')) {
                    const str = window[k].toString();
                    if (str.includes('ExamFaculty') || str.includes('Rule') || str.includes('Component') || str.includes('submit')) {
                        names.push(k);
                    }
                }
            }
            return names;
        }''')
        print("Custom functions on window:", funcs)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_submit_form())
