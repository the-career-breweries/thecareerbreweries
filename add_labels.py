import re

filepath = 'curriculum-app/src/data/curriculum-computing.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to match: { week: 1, semester: 1, ... }
def repl(match):
    full_str = match.group(0)
    week_str = match.group(1)
    
    try:
        week_num = int(week_str)
    except:
        return full_str # e.g. if week is "Mid-Sem"
    
    if week_num <= 5:
        unit = 1
        sess = week_num
    elif week_num <= 10:
        unit = 2
        sess = week_num - 5
    elif week_num <= 20:
        unit = 3
        sess = week_num - 10
    elif week_num <= 25:
        unit = 4
        sess = week_num - 20
    else:
        unit = 5
        sess = week_num - 25
        
    label = f"Unit {unit}: Session {sess}"
    
    # If it already has a label, replace it, otherwise add it.
    if "label:" in full_str:
        return re.sub(r"label:\s*'(.*?)'", f"label: '{label}'", full_str)
    else:
        # Add before the closing brace
        return full_str.rsplit('}', 1)[0] + f", label: '{label}' }}"

new_content = re.sub(r'\{\s*week:\s*(\d+).*?\}', repl, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Added labels to curriculum-computing.ts")
