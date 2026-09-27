import re

def add_white_space_normal(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if whiteSpace is already there
    if 'whiteSpace: \'normal\'' not in content:
        content = content.replace("fontFamily: \"'Inter', sans-serif\"", "fontFamily: \"'Inter', sans-serif\", whiteSpace: 'normal'")
        content = content.replace("fontFamily: \"'Inter', sans-serif\"\n    }}", "fontFamily: \"'Inter', sans-serif\", whiteSpace: 'normal'\n    }}")
        content = content.replace("border: '1px solid rgba(255,255,255,0.1)'\n    }}", "border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'normal'\n    }}")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

add_white_space_normal(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\CrisisSimulator.tsx')
add_white_space_normal(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AnatomyWidget.tsx')

