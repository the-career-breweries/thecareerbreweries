import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    ".cinematic-bg-media {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}",
    ".cinematic-bg-media {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}"
)

content = content.replace(
    ".cinematic-bg-container {\n  position: fixed;",
    ".cinematic-bg-container {\n  position: fixed;\n  background-color: #000;"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(content)
