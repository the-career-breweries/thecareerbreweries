import re

# Crisis Simulator
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("fontFamily: \"'Inter', sans-serif\"", "fontFamily: \"'Inter', sans-serif\"\n    }} className=\"escape-subtitle\">")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Anatomy Widget
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AnatomyWidget.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace("boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'\n    }}>", "boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'\n    }} className=\"escape-subtitle\">")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AnatomyWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)
