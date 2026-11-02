import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

AUTH_FILE = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\auth_tem622.json'

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=AUTH_FILE)
        page = await context.new_page()
        resp = await page.goto('https://portal.alliance.edu.in/auerp/AttendanceEntry.do?method=initAttendanceEntry&menuName=Attendance%20Entry&menuId=88&flag=true', timeout=30000)
        await page.wait_for_timeout(3000)
        print('Status:', resp.status)
        print('URL:', page.url)
        content = await page.content()
        print('Length:', len(content))
        await page.screenshot(path='scratch/att_check.png')
        if 'loginAction' in page.url or 'username' in content:
            print('Session EXPIRED - login required')
        else:
            print('Session ACTIVE!')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(check())
