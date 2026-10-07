import os

content = """# Listening & Speaking Skills
*Pronunciation, Conversation, and Active Listening*

---

# Agenda for Today

*   **Part 1:** Fundamentals of Active Listening
*   **Part 2:** Phonetics and Pronunciation
*   **Activity:** Pronunciation Roulette
*   **Part 3:** Professional Speaking in Aviation
*   **Part 4:** Role Play & Conflict Resolution

---

# Part 1: Fundamentals of Active Listening

Listening is a psychological choice, whereas hearing is just a biological function.

**The S.O.F.T.E.N. Technique for Active Listening:**
*   **S**mile (When appropriate)
*   **O**pen posture (No crossed arms)
*   **F**orward lean
*   **T**ouch (A professional handshake)
*   **E**ye Contact
*   **N**od (Validate you are listening)

*Focus on paraphrasing and summarizing to confirm understanding when a passenger speaks to you.*

---

# Part 2: The Impact of Mispronunciation

Pronunciation mistakes can range from slightly embarrassing to entirely changing the meaning of a critical message. Watch these examples:

<div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
  <div style="flex: 1; min-width: 300px; max-width: 800px;">
    <h3 style="text-align: center; color: #3c4043; min-height: 2.5em; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem;">The Classic Coastguard Mishap</h3>
    <iframe width="100%" height="450" src="https://www.youtube.com/embed/yR0lWICH3rY?rel=0" title="Berlitz German Coastguard" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
  <div style="flex: 1; min-width: 300px; max-width: 800px;">
    <h3 style="text-align: center; color: #3c4043; min-height: 2.5em; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 1rem;">Pronunciation<br />in Context</h3>
    <iframe width="100%" height="450" src="https://www.youtube.com/embed/5QE76OkYA4k?si=2s4h37OAFrkXrbrx&amp;start=118" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</div>

---

# LET THE PRACTICE BEGIN
*Focus on vowel and consonant sounds, sentence intonation, and fixing common pronunciation errors.*

```pronunciation-wheel
Entrepreneur
Rendezvous
Itinerary
Faux pas
Quinoa
Mischievous
Epitome
Colonel
Draught
Hyperbole
Cache
Almond
Aisle
Asthma
Boutique
Chassis
Facade
Gauge
Hierarchy
Lingerie
Niche
Queue
Suite
Yacht
```

---

# Part 3: Everyday Conversation & Professional Speaking

**Small Talk and Building Rapport:**
*   Professional greetings and introductions set the tone.
*   Use open-ended questions to build rapport, and closed questions for quick facts.

**Professional Aviation Speaking:**
*   **PA Announcements:** Require clear voice modulation, steady pacing, and absolute clarity.
*   **High-Noise Environments:** Enunciate and project your voice without shouting.

---

# Part 4: Customer Service Role Play

**Instructions:** Work with a partner. Take turns playing the Aviation Professional and the Passenger. Focus on **active listening**, **clear pronunciation**, and **de-escalation techniques**.

**Scenario 1: The Frustrated Flyer**
A passenger is upset because their flight has been delayed by 3 hours due to technical issues.
*   **Professional:** Explain the delay calmly, enunciate clearly, use the S.O.F.T.E.N technique, and offer a refreshment voucher.
*   **Passenger:** Express frustration and ask about connecting flights.

**Scenario 2: The Lost Baggage**
A passenger has arrived at the destination, but their baggage is missing.
*   **Professional:** Ask for flight details and baggage tags. Guide them through the PIR (Property Irregularity Report) process using clear instructions.
*   **Passenger:** You are stressed and speaking very quickly.

---
"""

files = [
    r"curriculum-app\src\content\english-lessons\ug\bba-aviation\sem1\week6.md",
    r"curriculum-app\src\content\english-lessons\ug\bsc-aviation\sem1\week6.md"
]

for f in files:
    if os.path.exists(f):
        with open(f, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f"Updated {f}")
