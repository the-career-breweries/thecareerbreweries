import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"({\s*/\*\s*Semester Selector\s*\*/\s*}[\s\S]*?options=\{semesters\.map\(s => \(\{ label: `Semester \$\{s\}`, value: s \}\)\)\}\s*/>\s*</div>)"

new_section_dropdown = """                    {/* Section Selector (if applicable) */}
                    {SECTIONS.length > 0 && (
                      <CustomDropdown 
                        value={activeSection}
                        onChange={(val) => setActiveSection(val)}
                        options={SECTIONS.map(sec => ({ label: sec, value: sec }))}
                      />
                    )}"""

# We'll use a slightly different pattern to ensure we match it correctly. Let's just find the closing div of the dropdown group.

target = """                  {/* Semester Selector */}
                    <CustomDropdown 
                      value={selectedSemester} 
                      onChange={(val) => {
                        setSelectedSemester(Number(val));
                        setSearchResults(null);
                        setActiveLesson(null);
                      }}
                      options={semesters.map(s => ({ label: `Semester ${s}`, value: s }))}
                    />"""

if target in content:
    content = content.replace(target, target + "\n\n" + new_section_dropdown)
else:
    print("Failed to find target in SoftSkillsApp.tsx")

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
