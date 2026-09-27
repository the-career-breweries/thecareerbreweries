import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace(
    ".cinematic-bg-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;",
    ".cinematic-bg-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

