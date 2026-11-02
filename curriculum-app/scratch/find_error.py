with open(r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\debug_after_submit.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()
import re
for m in re.finditer(r'<div[^>]*class=["\'][^"\']*alert[^"\']*["\'][^>]*>(.*?)</div>', html, re.S | re.I):
    print("ALERT:", m.group(0))
for m in re.finditer(r'id=["\']errorMessage["\'][^>]*>(.*?)</div>', html, re.S | re.I):
    print("ERROR_MSG:", m.group(0))
