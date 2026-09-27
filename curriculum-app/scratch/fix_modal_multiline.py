with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad1 = '''if (updatedSlides[currentSlide] === "# New Slide

Add content here...") {'''

good1 = '''if (updatedSlides[currentSlide] === "# New Slide\\n\\nAdd content here...") {'''

bad2 = '''updatedSlides[currentSlide] = updatedSlides[currentSlide] + "

" + snippet;'''

good2 = '''updatedSlides[currentSlide] = updatedSlides[currentSlide] + "\\n\\n" + snippet;'''

content = content.replace(bad1, good1).replace(bad2, good2)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
