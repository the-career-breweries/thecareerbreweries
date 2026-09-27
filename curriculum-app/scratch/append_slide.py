import os

snippet = "\n\n---\n\n<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790366015/taeis50ouxp80ugsaqaj.jpg -->\n"

paths = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week3.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week3.md'
]

for path in paths:
    if os.path.exists(path):
        with open(path, 'a', encoding='utf-8') as f:
            f.write(snippet)
