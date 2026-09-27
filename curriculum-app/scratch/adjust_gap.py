import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("gap: '1.5rem',\n              transition: 'all 0.4s", "gap: '1rem',\n              transition: 'all 0.4s")
content = content.replace("gap: '1.5rem',\r\n              transition: 'all 0.4s", "gap: '1rem',\r\n              transition: 'all 0.4s")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

