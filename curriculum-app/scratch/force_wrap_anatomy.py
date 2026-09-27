import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AnatomyWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "animation: 'fadeInUp 0.2s ease-out', zIndex: 20\n              }}>",
    "animation: 'fadeInUp 0.2s ease-out', zIndex: 20,\n                whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word'\n              }}>"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AnatomyWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
