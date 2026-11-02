import asyncio
import json
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

COMPONENTS = [
    {"id": "777", "name": "Assignment 1"},
    {"id": "807", "name": "Assignments"},
    {"id": "804", "name": "Class Participation"},
    {"id": "778", "name": "MSE"}
]

async def inspect_components():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        # Handle dialogs
        page.on("dialog", lambda d: asyncio.create_task(d.accept()))

        entry_url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        results = {}

        for comp in COMPONENTS:
            cid = comp["id"]
            cname = comp["name"]
            print(f"\n==========================================")
            print(f"Inspecting Component {cid} ({cname})...")
            print(f"==========================================")

            await page.goto(entry_url, timeout=45000)
            await page.wait_for_timeout(2500)

            # Class 4659 (Sec A)
            await page.evaluate("getSubject('4659')")
            await page.evaluate("document.getElementById('classId').value = '4659'")
            await page.wait_for_timeout(2000)

            await page.evaluate("document.getElementById('subjectId').value = '8117'")
            await page.evaluate("getComponentAfterSubject('8117')")
            await page.wait_for_timeout(2000)

            await page.evaluate(f"document.getElementById('componentId').value = '{cid}'")
            await page.wait_for_timeout(1000)

            await page.evaluate("submitForm()")
            await page.wait_for_load_state("networkidle", timeout=15000)
            await page.wait_for_timeout(3000)

            # Screenshot
            shot_path = f"scratch/view_comp_{cid}_{cname.replace(' ', '_')}.png"
            await page.screenshot(path=shot_path, full_page=True)

            # Inspect question headers, question numbers, CO mappings, max marks
            data = await page.evaluate('''() => {
                const info = {
                    title: document.title,
                    headers: [],
                    subHeaders: [],
                    coMappings: [],
                    tableSnippet: []
                };

                // Look for table headers
                const tables = Array.from(document.querySelectorAll('table'));
                tables.forEach(t => {
                    const ths = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\\s+/g, ' '));
                    if (ths.length > 0) info.headers.push(ths);

                    // Check rows in header or the first couple rows
                    const trs = Array.from(t.querySelectorAll('tr')).slice(0, 5).map(tr => {
                        return Array.from(tr.querySelectorAll('th, td')).map(cell => cell.innerText.trim().replace(/\\s+/g, ' '));
                    });
                    info.subHeaders.push(trs);
                });

                // Look for any text mentioning CO, Course Outcome, Question, Max Mark
                const bodyText = document.body.innerText;
                const lines = bodyText.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
                info.textLines = lines.filter(l => /CO|Question|Max Mark|Component|Weightage|Bloom/i.test(l)).slice(0, 50);

                return info;
            }''')

            results[cname] = data
            print(f"Data for {cname}:")
            print("Headers:")
            for h in data["headers"]:
                print(" ", h[:15])
            print("SubHeaders / First rows:")
            for sh in data["subHeaders"]:
                for row in sh[:3]:
                    print("   Row:", row[:15])
            print("Relevant text lines:")
            for l in data["textLines"][:15]:
                print("   Line:", l)

        # Also let's inspect Course Outcomes definition for Subject 8117
        print("\n==========================================")
        print("Inspecting CourseOutcomeDefinition.do...")
        print("==========================================")
        co_url = "https://portal.alliance.edu.in/auerp/CourseOutcomeDefinition.do?method=initCourseOutcomeDefinition&menuName=Course%20Outcome&menuId=1142&flag=false"
        await page.goto(co_url, timeout=45000)
        await page.wait_for_timeout(2500)
        await page.screenshot(path="scratch/co_definition_home.png")

        # Let's see what selects/tables exist on CourseOutcomeDefinition
        co_info = await page.evaluate('''() => {
            const selects = Array.from(document.querySelectorAll('select')).map(s => ({
                id: s.id,
                name: s.name,
                options: Array.from(s.options).map(o => ({ value: o.value, text: o.text }))
            }));
            const table = document.querySelector('table');
            const rows = table ? Array.from(table.querySelectorAll('tr')).map(tr => Array.from(tr.querySelectorAll('th, td')).map(c => c.innerText.trim())) : [];
            return { selects, rows: rows.slice(0, 20) };
        }''')
        print("CO Definition Screen:")
        for s in co_info["selects"]:
            print(f"  select id={s['id']} name={s['name']} -> {len(s['options'])} options: {s['options'][:5]}")

        with open("scratch/components_inspection_result.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        await browser.close()
        print("\nInspection complete!")

if __name__ == "__main__":
    asyncio.run(inspect_components())
