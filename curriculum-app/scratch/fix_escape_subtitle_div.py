import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# I will add .escape-subtitle div to the list of selectors
css_content = css_content.replace(
    ".escape-subtitle p, \n.escape-subtitle h1, \n.escape-subtitle h2, \n.escape-subtitle h3, \n.escape-subtitle h4, \n.escape-subtitle span, \n.escape-subtitle li {",
    ".escape-subtitle p, \n.escape-subtitle div, \n.escape-subtitle h1, \n.escape-subtitle h2, \n.escape-subtitle h3, \n.escape-subtitle h4, \n.escape-subtitle span, \n.escape-subtitle li {"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

