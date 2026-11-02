import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_page():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/ExamFacultyRuleSetting.do?method=editRuleSetting&ruleSettingId=20471"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Inspect all input, select, textarea elements and their containers
        details = await page.evaluate('''() => {
            const formElements = Array.from(document.querySelectorAll('input, select, textarea')).map(el => ({
                id: el.id,
                name: el.name,
                type: el.type,
                value: el.value,
                disabled: el.disabled,
                checked: el.checked
            }));

            // Check if there are divs or sections showing components or question mappings
            const textBlocks = Array.from(document.querySelectorAll('.box, .box-body, .panel, .form-group, fieldset')).map(el => ({
                text: el.innerText.trim().replace(/\\s+/g, ' ')
            })).filter(x => x.text.length > 20 && x.text.length < 1000);

            return {
                formElements,
                textBlocks: textBlocks.slice(0, 20)
            };
        }''')

        print("Form Elements found:", len(details['formElements']))
        for el in details['formElements']:
            if el['name'] or el['id']:
                print(f"  id='{el['id']}', name='{el['name']}', type='{el['type']}', val='{el['value']}'")

        print("\nText Blocks:")
        for tb in details['textBlocks'][:10]:
            print("  Block:", tb['text'])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_page())
