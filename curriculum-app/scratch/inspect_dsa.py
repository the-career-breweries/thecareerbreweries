import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def inspect_dsa_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"
        print(f"Navigating to {url}...")
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        await page.screenshot(path="scratch/dsa_mark_entry_initial.png")
        print("Initial screenshot saved.")

        # Inspect select options
        selects = await page.evaluate('''() => {
            let res = {};
            document.querySelectorAll('select').forEach(s => {
                let opts = Array.from(s.options).map(o => ({ value: o.value, text: o.text }));
                res[s.id || s.name] = { id: s.id, name: s.name, disabled: s.disabled, options: opts };
            });
            return res;
        }''')
        
        for k, v in selects.items():
            print(f"Select: {k} (id={v['id']}, name={v['name']}, disabled={v['disabled']})")
            for o in v['options'][:10]:
                print(f"   Option: val='{o['value']}', text='{o['text']}'")
            if len(v['options']) > 10:
                print(f"   ... ({len(v['options'])} options total)")

        # Inspect buttons
        buttons = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]')).map(b => ({
                id: b.id,
                value: b.value,
                text: b.innerText,
                onclick: b.getAttribute('onclick'),
                className: b.className
            }));
        }''')
        print("\nButtons found:")
        for b in buttons:
            print(f"  {b}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_dsa_page())
