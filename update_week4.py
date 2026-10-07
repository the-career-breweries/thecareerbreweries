import os

content = """# SEASON 1 • EPISODE 4
## The Ultimate Debate
*Arguing to Win (Without Losing Your Cool)*

▶   **PLAY EPISODE**

---

# Phase 1: The Hook & The Stakes
*We are jumping straight in.*

**The Goal:** 
You have 10 minutes to prepare a 2-minute opening statement that will completely dismantle your opponent's side.

**The Rules:**
- There are no rules on how you structure it. 
- Just convince the room.
- Attack the *idea*, never the *person*.

*Rely on your gut instinct.*

---

# Phase 2: The Raw Debate
*The Task Cycle*

**The Format:**
1. **Team A:** Speaks for 2 minutes.
2. **Team B:** Speaks for 2 minutes.
3. **Cross-Talk:** 1 minute of open, unmoderated rebuttal.

**Trainer’s Role:** Strict observation. We are looking for:
- *Ad hominem attacks (attacking the person, not the idea).*
- *Rambling without a clear point.*
- *Getting emotional or defensive.*
- *Making bold claims with zero evidence.*

```topic-generator
mode:debate
```

---

# Phase 3: The Review & "Aha!" Moment
*How did that feel?*

What was the hardest part about proving your point or defending against the attack?
- Was it hard to organize thoughts under pressure?
- Was it difficult to counter the other team effectively?

*Let's look at a framework to solve exactly these problems.*

---

# The AREA Framework
*How to construct an unbreakable argument.*

*   **A - Assertion:** The claim. (What are you arguing?)
*   **R - Reasoning:** The "why". (Why is your claim true?)
*   **E - Evidence:** The proof. (Data, facts, or real-world examples).
*   **A - Action/Impact:** Why it matters. (The "So what?")

**Example:** 
"Airlines should ban reclining seats (**Assertion**), because it prevents physical altercations in cramped cabins (**Reasoning**). According to the FAA, air rage incidents involving seat space have risen 300% since 2019 (**Evidence**). This ensures a safer, stress-free environment for both crew and passengers (**Action/Impact**)."

---

# The 4-Step Rebuttal
*How to dismantle an opponent's argument.*

1. **"They said..."** (Acknowledge their exact claim).
2. **"But we say..."** (State your counter-claim).
3. **"Because..."** (Provide your reasoning and evidence).
4. **"Therefore..."** (Conclude why your point is stronger).

**The Application:** Let's rebuild one of our failed arguments on the whiteboard using this exact framework.

---

# END OF EPISODE

*Next Episode: The Art of the Apology...*

```qrcode
```
"""

files = [
    r"curriculum-app\src\content\lessons\pg\mba\sem1\week4.md",
    r"curriculum-app\src\content\lessons\pg\mcom\sem1\week4.md",
    r"curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week4.md",
    r"curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week4.md",
    r"curriculum-app\src\content\lessons\ug\shared\sem1\week4.md"
]

for f in files:
    if os.path.exists(f):
        with open(f, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f"Updated {f}")
