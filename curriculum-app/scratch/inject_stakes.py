import os
import shutil

WEEKS = {
    "week1.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Emotional Intelligence (EQ), Coachability, and Self-Regulation.

**The Arena:** 
*   **Behavioral Interviews:** "Tell me about a time you failed or received negative feedback."
*   **Psychometric Profiling:** Assessing your capacity for growth.
*   **Management Trainee Screenings:** Testing if you can handle constructive criticism.

*Aviation recruiters don't just hire for skills; they hire people who are self-aware enough to admit their blind spots.*

---""",

    "week2.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Command Presence, Authority Projection, and Stress Tolerance.

**The Arena:** 
*   **Cabin Crew Final Panel Interviews:** Judging your "room entry" and posture.
*   **Pilot Board Interviews:** Assessing if you command respect naturally.
*   **Corporate Networking Events:** First impressions and elevator pitches.
*   **IELTS Speaking Part 1:** Baseline confidence and introduction delivery.

*Before you finish your first sentence, recruiters have already graded your presence.*

---""",

    "week3.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1499557407026-6f8f78082695?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Cognitive Flexibility, Pattern Recognition, and Non-Verbal Reasoning under pressure.

**The Arena:** 
*   **Picture Perception and Discussion Test (SSB):** Interpreting ambiguous scenes.
*   **Cabin Crew Screening:** The dreaded "Random Card / Extempore" round.
*   **Design Exams & Architecture Admissions:** Thematic apperception and spatial reasoning.
*   **IELTS Speaking Part 2:** Unscripted speaking on unexpected abstract topics.

*This session trains your brain to find logic in chaos—a critical skill for emergency aviation scenarios.*

---""",

    "week4.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Logical Structuring, Conflict De-escalation, and Analytical Reasoning.

**The Arena:** 
*   **Group Discussions (GD):** Dominating a conversation without being aggressive.
*   **Assessment Center Roleplays:** Defending a business decision against a panel.
*   **Case Study Interviews:** Separating the "idea" from the "person" in high-stress debates.
*   **IELTS Speaking Part 3:** Structuring complex, multi-layered arguments.

*Knowing how to argue cleanly is how you lead teams through disagreements without destroying morale.*

---""",

    "week5.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Crisis Management, Empathy, Boundary Setting, and Emotional Endurance.

**The Arena:** 
*   **Situational Judgment Tests (SJT):** Multiple-choice tests on handling irate customers.
*   **Airline Ground Staff Screening:** Live simulations of delayed flights and lost baggage.
*   **Behavioral Questions:** "Tell me about a time you had to say NO to a client."

*Aviation is an industry of disruptions. Your career ceiling is determined by how well you handle angry people.*

---""",

    "week6.md": """<!-- CINEMATIC_BG: https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80 -->

# THE STAKES
*Why are we doing this?*

**The Hidden Metric:** Non-Verbal Congruence, Spatial Awareness, and Implicit Trust Building.

**The Arena:** 
*   **Group Discussion Observer Grading:** Recruiters watch your body language when you *arent* speaking.
*   **Video Interviews (HireVue/AI):** Algorithms literally track your eye movement, posture, and micro-expressions.
*   **Every Face-to-Face Interview:** Subconscious signaling of dominance vs. submissiveness.

*Your words might say "I am confident," but if your shoulders are hunched, no one will believe you.*

---"""
}

def inject_stakes():
    shared_dir = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\shared\sem1"
    bba_dir = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1"
    bsc_dir = r"C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1"

    for week_file, stakes_content in WEEKS.items():
        filepath = os.path.join(shared_dir, week_file)
        if not os.path.exists(filepath):
            print(f"Skipping {week_file} - not found.")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Prevent double injection
        if "# THE STAKES" in content:
            print(f"{week_file} already has THE STAKES.")
            continue
            
        parts = content.split('---', 1)
        if len(parts) == 2:
            new_content = parts[0] + "---\n\n" + stakes_content + parts[1]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            shutil.copy(filepath, os.path.join(bba_dir, week_file))
            shutil.copy(filepath, os.path.join(bsc_dir, week_file))
            print(f"Successfully updated {week_file}")
        else:
            print(f"Could not find injection point in {week_file}")

if __name__ == "__main__":
    inject_stakes()
