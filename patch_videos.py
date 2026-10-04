import re

for filepath in [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1/week6.md',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1/week6.md'
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change color: white to color: #3c4043
    content = content.replace('color: white;', 'color: #3c4043;')
    
    # Change max-width: 560px to max-width: 800px
    content = content.replace('max-width: 560px;', 'max-width: 800px;')
    
    # Change height="315" to height="450"
    content = content.replace('height="315"', 'height="450"')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
