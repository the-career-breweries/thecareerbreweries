import re

for filepath in [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1/week6.md',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1/week6.md'
]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Use flexbox and min-height to ensure headers match height exactly and align nicely
    content = content.replace(
        '<h3 style="text-align: center; color: #3c4043;">The Classic Coastguard Mishap</h3>',
        '<h3 style="text-align: center; color: #3c4043; min-height: 2.5em; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem;">The Classic Coastguard Mishap</h3>'
    )
    
    content = content.replace(
        '<h3 style="text-align: center; color: #3c4043;">Pronunciation in Context</h3>',
        '<h3 style="text-align: center; color: #3c4043; min-height: 2.5em; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem;">Pronunciation<br />in Context</h3>'
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
