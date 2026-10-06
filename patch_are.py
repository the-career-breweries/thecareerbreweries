import os

files = [
    r"curriculum-app\src\content\lessons\ug\shared\sem1\week4.md",
    r"curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week4.md",
    r"curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week4.md"
]

old_subtitle = "*Putting PREP and STAR to the Test*"
new_subtitle = "*Putting PREP and A.R.E. to the Test*"

old_star = """# THE STAR APPROACH
*How to tell a story that wins arguments.*

*   **S - Situation:** Set the scene and provide context.
*   **T - Task:** Describe your responsibility or the challenge.
*   **A - Action:** Explain exactly what *you* did.
*   **R - Result:** Share the outcome and what you achieved.

**Example in an Interview:** 
"During a delayed flight (**S**), passengers were frustrated (**T**). I proactively offered water and updates (**A**), which calmed the cabin and resulted in a smooth boarding process (**R**).\""""

new_are = """# THE A.R.E. FRAMEWORK
*How to construct an unbreakable argument.*

*   **A - Assertion:** State your claim clearly. (What are you arguing?)
*   **R - Reasoning:** Explain the "Because". (Why is your claim true?)
*   **E - Evidence:** Provide proof. (Data, facts, or real-world examples).

**Example in a Debate:** 
"Airlines should ban reclining seats (**Assertion**), because it prevents physical altercations in cramped cabins (**Reasoning**). According to the FAA, air rage incidents involving seat space have risen 300% since 2019 (**Evidence**).\""""

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(old_subtitle, new_subtitle)
    content = content.replace(old_star, new_are)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {path}")
