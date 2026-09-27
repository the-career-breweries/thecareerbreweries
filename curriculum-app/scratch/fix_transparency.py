import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="slide-container">',
    '<div className="slide-container" style={cinematicBgUrl ? { background: "transparent", border: "none", boxShadow: "none" } : {}}>'
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
