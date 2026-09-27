import re

content = """# The Absurd & Abstract
*Session 3: Art Interpretation*

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790361041/ojoztxo2hnsxddwmwaje.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790361044/mgareg1phpc94vmb4pyo.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790361047/owv6jxia5skiwq4zwjmp.jpg -->
"""

file_paths = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week3.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week3.md'
]

for file_path in file_paths:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
