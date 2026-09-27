with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_string = '''"# New Slide

Add content here..."'''

good_string = '"# New Slide\\n\\nAdd content here..."'

content = content.replace(bad_string, good_string)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
