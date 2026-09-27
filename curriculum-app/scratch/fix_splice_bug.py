import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the multi-line splice string with the proper JS literal
bad_splice = """updatedSlides.splice(currentSlide + 1, 0, "# New Slide

Add content here...");"""

good_splice = r'updatedSlides.splice(currentSlide + 1, 0, "# New Slide\n\nAdd content here...");'

content = content.replace(bad_splice, good_splice)

# Just in case, let's also check for any other literal newlines that might have sneaked in
bad_fetch = """const newContent = updatedSlides.join('

---

');"""
good_fetch = r"const newContent = updatedSlides.join('\n\n---\n\n');"

content = content.replace(bad_fetch, good_fetch)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
