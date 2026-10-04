import re

with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the ReactMarkdown rendering and extract it to see how to patch it
matches = re.findall(r'<ReactMarkdown[^>]*>(.*?)</ReactMarkdown>', content, re.DOTALL)
for i, match in enumerate(matches):
    print(f"Match {i}: length {len(match)}")

# To patch it properly, we can insert the useMemo before `return (` inside `export default function SlideViewer`
# Let's just output the whole file so I can modify it perfectly.
with open('slideviewer_copy.txt', 'w', encoding='utf-8') as f:
    f.write(content)

print("SlideViewer copied to slideviewer_copy.txt")
