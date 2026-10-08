import os

dirs = [
    r"curriculum-app/src/content/computing-skills/ug/bba-aviation/sem1",
    r"curriculum-app/src/content/computing-skills/ug/bsc-aviation/sem1"
]

for d in dirs:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith('.md'):
                filepath = os.path.join(d, f)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # Replace literal backslash-n with actual newline
                new_content = content.replace('\\n', '\n')
                
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                
print("Fixed literal newlines in all scaffolded markdown files.")
