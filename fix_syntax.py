import os

filepath = 'curriculum-app/src/components/SlideViewer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The bad string is:
# split('
# ');
bad_string = "split('\_n');".replace('_', '')
bad_string = "split('\n');"

# Let's just do a simple replace
fixed_content = content.replace("split('\n');", "split('\\n');")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("Fix applied.")
