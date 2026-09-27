with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_join = """updatedSlides.join('

---

');"""

good_join = "updatedSlides.join('\\n\\n---\\n\\n');"

content = content.replace(bad_join, good_join)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
