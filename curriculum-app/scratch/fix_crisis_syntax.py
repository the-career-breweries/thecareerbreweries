import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("}} className=\"escape-subtitle\">\n    }}>", "}} className=\"escape-subtitle\">")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
