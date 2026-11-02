import glob
import re

files = glob.glob(r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\*.html")

for f in files:
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        c = fp.read()
    if "DSA" in c:
        matches = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', c, re.IGNORECASE)
        for href, text in matches:
            if "DSA" in text or "Component" in text:
                print(f"File: {f}")
                print(f"  Href: {href}")
                print(f"  Text: {text.strip()}")
