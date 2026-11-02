import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_form():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        entry_url = "https://portal.alliance.edu.in/auerp/AttendanceEntry.do?method=initAttendanceEntry&menuName=Attendance%20Entry&menuId=88&flag=true"
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(3000)

        # Period: Session 3 (21908)
        date_str = '27/10/2026'
        await page.evaluate(f"document.getElementById('attendancedate').value = '{date_str}'")
        await page.evaluate(f"getPeriodsForTeacher('{date_str}')")
        await page.wait_for_timeout(2500)

        p_id = '21908'
        await page.evaluate(f'''
            var p = document.getElementById('periods');
            p.disabled = false;
            p.value = '{p_id}';
            var yr = document.getElementById("academicYear").value;
            var t = document.getElementById("teachers").value;
            getSubjectsAndClassForPeriods('{p_id}', yr, t, '{date_str}', updateClassesAndSubjects);
        ''')
        await page.wait_for_timeout(3000)

        form_fields = await page.evaluate('''() => {
            var form = document.attendanceEntryForm;
            var res = {};
            for (var i = 0; i < form.elements.length; i++) {
                var el = form.elements[i];
                if (el.name) {
                    res[el.name] = {
                        id: el.id,
                        type: el.type,
                        value: el.value,
                        selectedIndex: el.selectedIndex
                    };
                }
            }
            return res;
        }''')

        import json
        print(json.dumps(form_fields, indent=2))
        await browser.close()

if __name__ == '__main__':
    asyncio.run(check_form())
