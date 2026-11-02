import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def inspect_mapping_dom():
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

        # Inspect elements on the mapping screen
        dom_info = await page.evaluate('''() => {
            let totalQInput = document.querySelector('input[placeholder*="Total No Of Question"]');
            let allInputs = Array.from(document.querySelectorAll('input')).map(i => ({
                id: i.id,
                name: i.name,
                placeholder: i.placeholder,
                value: i.value,
                onchange: i.getAttribute('onchange'),
                onkeyup: i.getAttribute('onkeyup')
            }));

            let allSelects = Array.from(document.querySelectorAll('select')).map(s => ({
                id: s.id,
                name: s.name,
                options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
            }));

            let allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick')
            }));

            return {
                totalQInput: totalQInput ? { id: totalQInput.id, name: totalQInput.name, onchange: totalQInput.getAttribute('onchange'), onkeyup: totalQInput.getAttribute('onkeyup') } : null,
                inputs: allInputs,
                selects: allSelects,
                buttons: allButtons
            };
        }''')

        print("Total Q Input:", dom_info['totalQInput'])
        print("\nSelect elements on mapping screen:")
        for s in dom_info['selects']:
            print(f"  id='{s['id']}', name='{s['name']}' -> {len(s['options'])} options: {s['options']}")

        print("\nInputs on mapping screen:")
        for i in dom_info['inputs']:
            if i['name'] or i['id'] or i['placeholder']:
                print(f"  id='{i['id']}', name='{i['name']}', placeholder='{i['placeholder']}', val='{i['value']}'")

        print("\nButtons on mapping screen:")
        for b in dom_info['buttons']:
            print(f"  {b}")

        # Test what happens when totalQInput is filled with 12
        if dom_info['totalQInput']:
            t_id = dom_info['totalQInput']['id']
            print(f"\nFilling #{t_id} with 12...")
            await page.fill(f"#{t_id}", "12")
            await page.evaluate(f"document.getElementById('{t_id}').onchange && document.getElementById('{t_id}').onchange()")
            await page.evaluate(f"document.getElementById('{t_id}').onkeyup && document.getElementById('{t_id}').onkeyup()")
            await page.wait_for_timeout(2000)

            rows_count = await page.evaluate("document.querySelectorAll('table tbody tr').length")
            print("Table tbody rows count after filling 12:", rows_count)

            await page.screenshot(path="scratch/dsa_mapping_after_12.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_mapping_dom())
