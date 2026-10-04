import re

with open('slideviewer_copy.txt', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find("components={{")
brace_count = 0
in_string = False
string_char = ''
escape = False
end_idx = -1

for i in range(start_idx + 11, len(content)):
    c = content[i]
    if escape:
        escape = False
        continue
    if c == '\\':
        escape = True
        continue
    if in_string:
        if c == string_char:
            in_string = False
        continue
    if c in '"\'`':
        in_string = True
        string_char = c
        continue
        
    if c == '{':
        brace_count += 1
    elif c == '}':
        brace_count -= 1
        if brace_count == 0:
            end_idx = i
            break

components_object = content[start_idx + 12 : end_idx] # EXCLUDING THE OUTER BRACES.
# So components_object is exactly what goes inside the React components object, e.g. `code() { ... }`

new_content = content[:start_idx] + "components={markdownComponents}" + content[end_idx + 1:]

usememo_decl = f"""
  const markdownComponents = React.useMemo(() => ({{
    {components_object}
  }}), []);
"""

insert_target = "const currentSlideContent = slides[currentSlide] || '';"
insert_idx = new_content.find(insert_target)

final_content = new_content[:insert_idx] + usememo_decl + "\n  " + new_content[insert_idx:]

with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(final_content)
