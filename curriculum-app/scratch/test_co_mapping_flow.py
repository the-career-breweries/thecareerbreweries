import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def inspect_co_func():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Select BBA English (4661, 8040)
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        # Select Assignment 1 (777)
        await page.evaluate("document.getElementById('componentId').value = '777'")
        await page.wait_for_timeout(1000)
        await page.evaluate("submitForm()")
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        # Inspect getQuestionAndCOMapping
        fn = await page.evaluate("typeof getQuestionAndCOMapping !== 'undefined' ? getQuestionAndCOMapping.toString() : 'undefined'")
        print("getQuestionAndCOMapping definition:\n", fn)

        # Let's call getQuestionAndCOMapping() and see what happens (does a modal open or navigation?)
        print("\nCalling getQuestionAndCOMapping()...")
        await page.evaluate("getQuestionAndCOMapping()")
        await page.wait_for_timeout(4000)

        await page.screenshot(path="scratch/after_click_co_mapping.png", full_page=True)

        # Inspect any modal or new elements
        modal_info = await page.evaluate('''() => {
            const modals = Array.from(document.querySelectorAll('.modal, .modal-dialog, .modal-content, [role=dialog]')).map(m => ({
                id: m.id,
                className: m.className,
                style: m.getAttribute('style'),
                text: m.innerText.trim().slice(0, 1000)
            }));

            const inputs = Array.from(document.querySelectorAll('input, select, textarea')).map(inp => ({
                id: inp.id,
                name: inp.name,
                type: inp.type,
                value: inp.value,
                placeholder: inp.placeholder
            })).filter(x => x.id.includes('co') || x.id.includes('quest') || x.name.includes('co') || x.name.includes('quest') || x.name.includes('Mark'));

            return { url: window.location.href, modals, inputs, bodySnippet: document.body.innerText.slice(0, 1500) };
        }''')

        print("Current URL:", modal_info['url'])
        print("Modals found:", len(modal_info['modals']))
        for m in modal_info['modals']:
            print("  Modal:", m['id'], m['className'], m['style'])
            print("    Text:\n", m['text'][:500])

        print("\nRelevant inputs:", modal_info['inputs'])

        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect_co_func())
