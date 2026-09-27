import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Card dimensions
content = content.replace("width: '280px'", "width: '180px'")
content = content.replace("height: '400px'", "height: '260px'")
content = content.replace("gap: '3rem'", "gap: '1.5rem'")
content = content.replace("padding: '2.5rem'", "padding: '1.25rem'")

# Title below card
content = content.replace("fontSize: '1.5rem', \n              fontWeight: '600'", "fontSize: '1.1rem', \n              fontWeight: '600'")
content = content.replace("fontSize: '1.5rem', \r\n              fontWeight: '600'", "fontSize: '1.1rem', \r\n              fontWeight: '600'")
# To be safe, also check for single line
content = content.replace("fontSize: '1.5rem', \n              fontWeight: '600'", "fontSize: '1.1rem', \n              fontWeight: '600'")

# Border thickness
content = content.replace("border: hoveredTheme === t.id ? `6px solid ${t.color}` : '6px solid transparent',", "border: hoveredTheme === t.id ? `4px solid ${t.color}` : '4px solid transparent',")

# Logo sizes
content = content.replace('width="72" height="72"', 'width="48" height="48"')
content = content.replace('size={72}', 'size={48}')

# Text sizes in logos
content = content.replace("fontSize: '2rem'", "fontSize: '1.4rem'")
content = content.replace("fontSize: '1.8rem'", "fontSize: '1.2rem'")
content = content.replace("fontSize: '2.2rem'", "fontSize: '1.6rem'")
content = content.replace("fontSize: '1.6rem'", "fontSize: '1.1rem'")

# Header texts
content = content.replace("fontSize: '4.5rem'", "fontSize: '3rem'")
content = content.replace("fontSize: '1.5rem', color: '#d1d5db'", "fontSize: '1.2rem', color: '#d1d5db'")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

