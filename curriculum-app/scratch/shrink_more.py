import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Row Gap
content = content.replace("gap: '1.5rem', zIndex: 10, flexWrap: 'wrap'", "gap: '1rem', zIndex: 10, flexWrap: 'wrap'")

# Card Size
content = content.replace("width: '180px'", "width: '150px'")
content = content.replace("height: '260px'", "height: '220px'")
content = content.replace("padding: '1.25rem'", "padding: '1rem'")

# Logo sizes
content = content.replace('width="48" height="48"', 'width="40" height="40"')
content = content.replace('size={48}', 'size={40}')

# Logo fonts
content = content.replace("fontSize: '1.4rem'", "fontSize: '1.2rem'")
content = content.replace("fontSize: '1.2rem', fontWeight: '800'", "fontSize: '1.1rem', fontWeight: '800'")
content = content.replace("fontSize: '1.6rem'", "fontSize: '1.3rem'")

# Card title text below (keep at 1.1rem or drop to 1rem)
content = content.replace("fontSize: '1.1rem', \n              fontWeight: '600'", "fontSize: '1rem', \n              fontWeight: '600'")
content = content.replace("fontSize: '1.1rem', \r\n              fontWeight: '600'", "fontSize: '1rem', \r\n              fontWeight: '600'")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\ThemeSelector.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
