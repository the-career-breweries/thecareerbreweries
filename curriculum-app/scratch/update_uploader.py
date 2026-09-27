import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace absurd-abstract with CINEMATIC_BG for images
content = content.replace(
    "`\\`\\`\\`absurd-abstract\\nimage: ${uploadedUrl}\\nquestion: Type your question here...\\nreveal: Type the reveal truth here!\\n\\`\\`\\``",
    "`<!-- CINEMATIC_BG: ${uploadedUrl} -->`"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
