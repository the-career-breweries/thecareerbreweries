import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_obe_search():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        url = "https://portal.alliance.edu.in/auerp/OBEMapping.do?method=initOBEMapping&menuName=OBE%20Mapping&menuId=1145&flag=false"
        await page.goto(url, timeout=45000)
        await page.wait_for_timeout(2500)

        # 1. Select Program Type = 1 (Under Graduation)
        print("Selecting programTypeId = 1...")
        await page.select_option("#programTypeId", "1")
        await page.wait_for_timeout(2000)

        # Inspect programId options
        programs = await page.evaluate('''() => {
            return Array.from(document.getElementById('programId').options).map(o => ({ val: o.value, text: o.text }));
        }''')
        print("Programs:", programs)

        # Find Aviation or B.Sc program
        target_prog = None
        for p_opt in programs:
            if any(k in p_opt['text'].lower() for k in ['aviation', 'science', 'bsc', 'b.sc', 'asas']):
                target_prog = p_opt['val']
                print(f"Matched Program: {p_opt}")
                break
        if not target_prog and len(programs) > 1:
            target_prog = programs[1]['val']

        if target_prog:
            await page.select_option("#programId", target_prog)
            await page.wait_for_timeout(2000)

            # Inspect courses
            courses = await page.evaluate('''() => {
                return Array.from(document.getElementById('courseId').options).map(o => ({ val: o.value, text: o.text }));
            }''')
            print("Courses:", courses)

            target_course = None
            for c in courses:
                if any(k in c['text'].lower() for k in ['aviation', 'b.sc', 'bsc']):
                    target_course = c['val']
                    print(f"Matched Course: {c}")
                    break
            if not target_course and len(courses) > 1:
                target_course = courses[1]['val']

            if target_course:
                await page.select_option("#courseId", target_course)
                await page.wait_for_timeout(2000)

                # Inspect semesters
                semesters = await page.evaluate('''() => {
                    return Array.from(document.getElementById('semesterNo').options).map(o => ({ val: o.value, text: o.text }));
                }''')
                print("Semesters:", semesters)

                target_sem = "1"
                await page.select_option("#semesterNo", target_sem)
                await page.wait_for_timeout(2000)

                # Inspect subjects
                subjects = await page.evaluate('''() => {
                    return Array.from(document.getElementById('subjectId').options).map(o => ({ val: o.value, text: o.text }));
                }''')
                print("Subjects:", subjects)

                for s in subjects:
                    if 'computing' in s['text'].lower() or s['val'] == '8117':
                        print(f"Selecting subject: {s}")
                        await page.select_option("#subjectId", s['val'])
                        break

                await page.wait_for_timeout(1000)

                # Click Search
                print("Clicking Search (searchOBEMapping)...")
                async with page.expect_navigation(timeout=30000):
                    await page.evaluate("searchOBEMapping()")

                await page.wait_for_timeout(3000)
                await page.screenshot(path="scratch/obe_search_result.png", full_page=True)

                # Inspect tables on result page
                res_data = await page.evaluate('''() => {
                    const tables = Array.from(document.querySelectorAll('table')).map(t => {
                        const headers = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\\s+/g, ' '));
                        const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr => {
                            const cells = Array.from(tr.querySelectorAll('td')).map(td => ({
                                text: td.innerText.trim().replace(/\\s+/g, ' '),
                                html: td.innerHTML
                            }));
                            return cells;
                        });
                        return { id: t.id, headers, rows };
                    });
                    return { bodyText: document.body.innerText, tables };
                }''')

                print("Results Text snippet:\n", res_data['bodyText'][:1500])
                for t in res_data['tables']:
                    print(f"\nTable id={t['id']} headers={t['headers']}")
                    for r in t['rows']:
                        print("  Row:", [c['text'] for c in r])

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_obe_search())
