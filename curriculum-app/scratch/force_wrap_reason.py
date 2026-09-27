import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "animation: 'fadeIn 0.3s ease-out'\n                }}>",
    "animation: 'fadeIn 0.3s ease-out',\n                  whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word'\n                }}>"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
