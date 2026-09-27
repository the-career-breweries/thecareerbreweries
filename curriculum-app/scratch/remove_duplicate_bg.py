import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Use regex to remove the duplicate block inside slide-body
pattern = r'<div className="slide-body" style=\{\{ position: \'relative\' \}\}>\s*\{cinematicBgUrl && \(\s*<div className="cinematic-bg-container">.*?<div className="cinematic-bg-overlay" />\s*</div>\s*\)\}'

replacement = '<div className="slide-body" style={{ position: \'relative\' }}>'

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
