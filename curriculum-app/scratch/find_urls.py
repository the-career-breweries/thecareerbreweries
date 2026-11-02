import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\submit_auerp_multi.py', 'r', encoding='utf-8') as f:
    text = f.read()

urls = re.findall(r'https?://[^\s\'"]+', text)
print("URLs found:")
for u in set(urls):
    print(u)
