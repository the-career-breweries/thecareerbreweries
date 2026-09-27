import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_string = "const newContent = finalSlides.join('\n\n---\n\n');"
good_string = r"const newContent = finalSlides.join('\n\n---\n\n');"

content = content.replace(bad_string, good_string)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
