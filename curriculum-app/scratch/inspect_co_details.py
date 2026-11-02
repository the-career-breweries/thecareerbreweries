import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def inspect_co_screen():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
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

        # Go to Question and CO Mapping screen
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        # Screenshot
        await page.screenshot(path="scratch/co_screen_full.png", full_page=True)

        # Inspect options and functions
        details = await page.evaluate('''() => {
            const sel = document.getElementById('courseMapping_0_0');
            const options = sel ? Array.from(sel.options).map(o => ({ val: o.value, text: o.text })) : [];

            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit], a')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            })).filter(x => x.text || x.value);

            // Look for table headers and structure
            const tables = Array.from(document.querySelectorAll('table')).map(t => {
                const headers = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\\s+/g, ' '));
                return { id: t.id, headers };
            });

            // Find submit function
            const submitBtn = document.getElementById('btn_co_question_mapping_submit');
            const submitOnClick = submitBtn ? submitBtn.getAttribute('onclick') : null;

            return {
                title: document.title,
                options,
                buttons,
                tables,
                submitOnClick,
                bodyText: document.body.innerText.slice(0, 1500)
            };
        }''')

        print("Select options in courseMapping_0_0:", details['options'])
        print("\nButtons on Question & CO screen:")
        for b in details['buttons']:
            print(" ", b)
        print("\nTables:", details['tables'])
        print("\nSubmit onclick:", details['submitOnClick'])
        print("\nBody text:\n", details['bodyText'])

        # Check all functions related to add, delete, save, submit on this screen
        funcs = await page.evaluate('''() => {
            const fns = {};
            ['addMore', 'addMoreQuestion', 'saveQuestionAndCOMapping', 'submitQuestionAndCOMapping', 'validateQuestionAndCOMapping', 'deleteQuestion'].forEach(name => {
                if (typeof window[name] !== 'undefined') {
                    fns[name] = window[name].toString();
                }
            });
            // Also find any function called in buttons
            return fns;
        }''')
        print("\nFunctions found:", funcs)

        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect_co_screen())
