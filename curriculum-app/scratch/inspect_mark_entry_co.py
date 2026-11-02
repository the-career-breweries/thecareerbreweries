import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def inspect_mark_entry():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        print("Navigating to DSAComponentMarkEntry...")
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # Select BBA English (4661, 8040)
        await page.evaluate("getSubject('4661')")
        await page.evaluate("document.getElementById('classId').value = '4661'")
        await page.wait_for_timeout(2000)

        await page.evaluate("document.getElementById('subjectId').value = '8040'")
        await page.evaluate("getComponentAfterSubject('8040')")
        await page.wait_for_timeout(2000)

        # Read component options
        comps = await page.evaluate('''() => {
            return Array.from(document.getElementById('componentId').options).map(o => ({ val: o.value, text: o.text }));
        }''')
        print("Comps for BBA English:", comps)

        # Select first component (e.g. Assignment 1 or whichever is there)
        for c in comps:
            if c['val']:
                print(f"\n--- Checking Component {c['text']} ({c['val']}) ---")
                await page.evaluate(f"document.getElementById('componentId').value = '{c['val']}'")
                await page.wait_for_timeout(1000)
                await page.evaluate("submitForm()")
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(3000)

                # Inspect all buttons, inputs, links on the page
                elements = await page.evaluate('''() => {
                    const btns = Array.from(document.querySelectorAll('button, input[type=button], input[type=submit], a')).map(el => ({
                        tag: el.tagName,
                        id: el.id,
                        value: el.value || '',
                        text: el.innerText.trim(),
                        onclick: el.getAttribute('onclick'),
                        href: el.href || ''
                    })).filter(x => x.text.length > 0 || x.value.length > 0 || x.id.length > 0);

                    // Check if there is any question config modal or button
                    const textContent = document.body.innerText;
                    const matches = textContent.split('\\n').map(l => l.trim()).filter(l => /question|co|mapping|define|config/i.test(l));

                    return { btns, matches: matches.slice(0, 30) };
                }''')

                print("Matching text lines:")
                for m in elements['matches']:
                    print("  ", m)

                print("Buttons / Links:")
                for btn in elements['btns']:
                    if any(k in btn['text'].lower() or k in btn['value'].lower() or k in (btn['onclick'] or '').lower() for k in ['question', 'co', 'map', 'define', 'upload', 'save', 'template']):
                        print("  ", btn)

                # Check all scripts defined on page for function names
                funcs = await page.evaluate('''() => {
                    const fns = [];
                    for (let k in window) {
                        if (typeof window[k] === 'function' && !k.startsWith('webkit') && !k.startsWith('on')) {
                            const str = window[k].toString();
                            if (/question|co|mapping|define|modal|rule/i.test(k) || /question|co|mapping/i.test(str)) {
                                fns.push(k);
                            }
                        }
                    }
                    return fns;
                }''')
                print("Custom functions matching question/CO:", funcs)

                break # just check the first one first

        await b.close()

if __name__ == "__main__":
    asyncio.run(inspect_mark_entry())
