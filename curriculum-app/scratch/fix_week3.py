import os
import shutil
import glob

# 1. Update week3.md specifically
WEEK3_CONTENT = """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1920&q=80 -->

# The Absurd & Abstract
## Interpretation, Perception, Extempore, Thematic Apperception

▶  **PLAY EPISODE**

---

<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80 -->

# Why are we doing this?

**The Hidden Metric:** Cognitive Flexibility, Pattern Recognition, and Non-Verbal Reasoning under pressure.

**The Arena:** 
*   **Picture Perception and Discussion Test (SSB):** Interpreting ambiguous scenes.
*   **Cabin Crew Screening:** The dreaded "Random Card / Extempore" round.
*   **Design Exams & Architecture Admissions:** Thematic apperception and spatial reasoning.
*   **IELTS Speaking Part 2:** Unscripted speaking on unexpected abstract topics.

*This session trains your brain to find logic in chaos—a critical skill for emergency aviation scenarios.*

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790577644/arpppkeewt0gosszb3lb.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790578142/ufv9fmgr0fjnxtcbpq90.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790578163/asarufcrr5rmv9kr7ozy.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790578210/eqlhebsauqr56dpk7rw3.jpg -->

---

<!-- CINEMATIC_BG: https://res.cloudinary.com/l4eozknq/image/upload/v1790578344/migefloo9bqrizlrtf7k.jpg -->
"""

shared_w3 = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\shared\sem1\week3.md"
bba_w3 = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week3.md"
bsc_w3 = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week3.md"

with open(shared_w3, 'w', encoding='utf-8') as f:
    f.write(WEEK3_CONTENT)
shutil.copy(shared_w3, bba_w3)
shutil.copy(shared_w3, bsc_w3)

# 2. Change "THE STAKES" to "Why are we doing this?" in all other weeks
files = glob.glob(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\*\sem1\*.md')
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "# THE STAKES\n*Why are we doing this?*" in content:
        content = content.replace("# THE STAKES\n*Why are we doing this?*", "# Why are we doing this?")
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
