with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad = """const newContent = updatedSlides.join('

---

');"""

good = "const newContent = updatedSlides.join('\\n\\n---\\n\\n');"

content = content.replace(bad, good)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
