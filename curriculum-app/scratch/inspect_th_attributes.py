import asyncio
from playwright.async_api import async_playwright

AUTH_FILE = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json"

async def check_ths():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(storage_state=AUTH_FILE)
        page = await ctx.new_page()

        page.on("dialog", lambda d: asyncio.create_task(d.accept()))
        url = "https://portal.alliance.edu.in/auerp/DSAComponentMarkEntry.do?method=initDSAmarkEntry&menuName=DSA%20Component%20Mark%20Entry&menuId=892&flag=true"

        for cid, cname in [("777", "Assignment 1"), ("807", "Assignments"), ("804", "Class Participation")]:
            await page.goto(url, timeout=45000)
            await page.wait_for_timeout(2000)

            await page.evaluate("getSubject('4659')")
            await page.evaluate("document.getElementById('classId').value = '4659'")
            await page.wait_for_timeout(1500)

            await page.evaluate("document.getElementById('subjectId').value = '8117'")
            await page.evaluate("getComponentAfterSubject('8117')")
            await page.wait_for_timeout(1500)

            await page.evaluate(f"document.getElementById('componentId').value = '{cid}'")
            await page.wait_for_timeout(1000)

            await page.evaluate("submitForm()")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(2500)

            th_data = await page.evaluate('''() => {
                const ths = Array.from(document.querySelectorAll('th'));
                return ths.map(th => ({
                    text: th.innerText.trim().replace(/\\s+/g, ' '),
                    html: th.innerHTML,
                    title: th.getAttribute('title'),
                    dataAttrs: Object.keys(th.dataset).reduce((acc, k) => { acc[k] = th.dataset[k]; return acc; }, {})
                })).filter(t => t.text.includes('Q:') || t.text.includes('CO') || t.text.includes('Max'));
            }''')

            print(f"\n--- {cname} (cid={cid}) THs ---")
            for t in th_data:
                print(" ", t)

        await b.close()

if __name__ == "__main__":
    asyncio.run(check_ths())
