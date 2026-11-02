import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def inspect():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        # Let's inspect the exact HTML of the sidebar menu for DSA Component Configuration
        await page.goto("https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true")
        await page.wait_for_timeout(2500)

        dsa_config_el = await page.evaluate('''() => {
            const el = Array.from(document.querySelectorAll('a, li, span')).find(e => e.innerText.trim() === 'DSA Component Configuration');
            if (el) {
                return {
                    tagName: el.tagName,
                    outerHTML: el.outerHTML,
                    parentHTML: el.parentElement.outerHTML
                };
            }
            return null;
        }''')
        print("DSA Config element:", dsa_config_el)

        # Let's check OBEMapping.do
        print("\n--- Inspecting OBEMapping.do ---")
        await page.goto("https://portal.alliance.edu.in/auerp/OBEMapping.do?method=initOBEMapping&menuName=OBE%20Mapping&menuId=1145&flag=false")
        await page.wait_for_timeout(2500)
        await page.screenshot(path="scratch/obe_mapping_screen.png")
        obe_inputs = await page.evaluate('''() => {
            const selects = Array.from(document.querySelectorAll('select')).map(s => ({
                id: s.id,
                name: s.name,
                options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
            }));
            const buttons = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText
            }));
            return { title: document.title, selects, buttons, text: document.body.innerText.slice(0, 500) };
        }''')
        print("OBE Mapping screen info:", obe_inputs)

        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect())
