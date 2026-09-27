import re

file_paths = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week3.md',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week3.md'
]

for file_path in file_paths:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove question and reveal lines
    content = re.sub(r'question:.*?\n', '', content)
    content = re.sub(r'reveal:.*?\n', '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
