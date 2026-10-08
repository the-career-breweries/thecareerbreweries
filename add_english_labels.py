import re

filepath = 'curriculum-app/src/data/curriculum-english.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def repl(match):
    full_str = match.group(0)
    week_str = match.group(1)
    
    try:
        week_num = int(week_str)
    except:
        return full_str
    
    # 15 weeks total. Let's do 5 units, 3 sessions per unit.
    unit = ((week_num - 1) // 3) + 1
    sess = ((week_num - 1) % 3) + 1
        
    label = f"Unit {unit}: Session {sess}"
    
    if "label:" in full_str:
        return re.sub(r"label:\s*'(.*?)'", f"label: '{label}'", full_str)
    else:
        return full_str.rsplit('}', 1)[0] + f", label: '{label}' }}"

new_content = re.sub(r'\{\s*week:\s*(\d+).*?\}', repl, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Added labels to curriculum-english.ts")
