import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def test_single_period():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()

        entry_url = "https://portal.alliance.edu.in/auerp/AttendanceEntry.do?method=initAttendanceEntry&menuName=Attendance%20Entry&menuId=88&flag=true"
        await page.goto(entry_url, timeout=45000)
        await page.wait_for_timeout(3000)

        date_str = '27/10/2026'
        await page.evaluate(f"document.getElementById('attendancedate').value = '{date_str}'")
        await page.evaluate(f"getPeriodsForTeacher('{date_str}')")
        await page.wait_for_timeout(2500)

        p_id = '21908' # Session 3
        # Select ONLY p_id in periods
        await page.evaluate(f'''
            var p = document.getElementById('periods');
            p.disabled = false;
            for (var i = 0; i < p.options.length; i++) {{
                p.options[i].selected = (p.options[i].value === '{p_id}');
            }}
            var yr = document.getElementById("academicYear").value;
            var t = document.getElementById("teachers").value;
            getSubjectsAndClassForPeriods('{p_id}', yr, t, '{date_str}', updateClassesAndSubjects);
        ''')
        await page.wait_for_timeout(3000)

        # Clear activity options and select BBA
        await page.evaluate('''() => {
            // Unselect all other periods again just to be safe
            var p = document.getElementById('periods');
            for (var i = 0; i < p.options.length; i++) {
                p.options[i].selected = (p.options[i].value === "21908");
            }

            // Clear activityId completely
            var act = document.getElementById("activityId");
            if (act) {
                while (act.options.length > 0) act.remove(0);
                act.options[0] = new Option("- Select -", "");
                act.selectedIndex = 0;
                act.value = "";
            }
            var attAct = document.getElementById("attendanceActivity");
            if (attAct) attAct.value = "";

            // Select BBA class ONLY (4661)
            var cls = document.getElementById("classes");
            cls.disabled = false;
            for (var i = 0; i < cls.options.length; i++) {
                cls.options[i].selected = (cls.options[i].value === "4661");
            }

            // Select CE (8040)
            var subj = document.getElementById("subjectId");
            subj.disabled = false;
            subj.value = "8040";

            document.getElementById("hoursHeld").value = "00:55";

            if (typeof $ !== "undefined" && $.confirm) {
                $.confirm = function(options) {
                    document.attendanceEntryForm.submit();
                };
            }
            submitData();
        }''')

        try:
            await page.wait_for_load_state("networkidle", timeout=15000)
        except:
            pass
        await page.wait_for_timeout(4000)

        content = await page.content()
        student_count = await page.locator("input[id^='nameList_']").count()
        if student_count == 0:
            student_count = await page.evaluate("document.getElementById('toCount') ? parseInt(document.getElementById('toCount').value) : 0")

        print("RESULT student_count:", student_count)
        if "Both course and activity" in content:
            print("FAILED: Both course and activity")
        elif "Cannot take attendance" in content:
            print("FAILED: Cannot take attendance")
        elif student_count > 0:
            print(f"🎉🎉🎉 SUCCESS! Roster loaded with {student_count} students!")
            for i in range(min(5, student_count)):
                sname = await page.evaluate(f"document.getElementById('nameList_[{i}]').value")
                print(f"  Student {i+1}: {sname}")

        await page.screenshot(path="debug_single_period.png")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_single_period())
