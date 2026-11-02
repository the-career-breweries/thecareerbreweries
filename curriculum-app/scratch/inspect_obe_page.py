import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_obe():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/OBEMapping.do?method=initOBEMapping&menuName=OBE%20Mapping&menuId=1145&flag=false"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Inspect select IDs and their onchange handlers
        handlers = await page.evaluate('''() => {
            const selects = Array.from(document.querySelectorAll('select')).map(s => ({
                id: s.id,
                name: s.name,
                onchange: s.getAttribute('onchange'),
                options: Array.from(s.options).map(o => ({ val: o.value, text: o.text }))
            }));
            return selects;
        }''')
        print("Selects on OBE Mapping:")
        for h in handlers:
            print(f"  id={h['id']}, onchange={h['onchange']}, opts={h['options'][:5]}")

        # Let's inspect the JavaScript functions on this page
        funcs = await page.evaluate('''() => {
            const fns = [];
            for (let k in window) {
                if (typeof window[k] === 'function' && !k.startsWith('webkit') && !k.startsWith('on')) {
                    const s = window[k].toString();
                    if (s.includes('OBE') || s.includes('Mapping') || s.includes('Program') || s.includes('Subject')) {
                        fns.push({ name: k, body: s.slice(0, 300) });
                    }
                }
            }
            return fns;
        }''')
        print("\nFunctions on OBE Mapping:")
        for f in funcs:
            print(f"  {f['name']}: {f['body']}")

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_obe())
