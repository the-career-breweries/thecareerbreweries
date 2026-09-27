import re

# 1. Fix cinematic bg container to be fixed screen
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

css_content = css_content.replace(
    ".cinematic-bg-container {\n  position: absolute;",
    ".cinematic-bg-container {\n  position: fixed;"
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(css_content)

# 2. Update hotspots in both week2.md files
def update_hotspots(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        md = f.read()
    
    # Replace old coordinates
    md = md.replace("hotspot1_x: 65", "hotspot1_x: 68")
    md = md.replace("hotspot1_y: 20", "hotspot1_y: 38")
    md = md.replace("hotspot2_x: 55", "hotspot2_x: 63")
    md = md.replace("hotspot2_y: 10", "hotspot2_y: 25")
    md = md.replace("hotspot3_x: 48", "hotspot3_x: 62")
    md = md.replace("hotspot3_y: 50", "hotspot3_y: 55")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(md)

update_hotspots(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week2.md')
update_hotspots(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week2.md')

