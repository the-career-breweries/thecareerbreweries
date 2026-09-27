import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"(options=\{semesters\.map\(s => \(\{ label: `Semester \$\{s\}`, value: s \}\)\)\}\s*/>)"

new_dropdown = r"""\1

                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 0 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}"""

content = re.sub(pattern, new_dropdown, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
