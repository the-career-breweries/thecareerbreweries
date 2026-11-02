import json
from datetime import datetime, timedelta

# 1. softskills-sessions.json
sessions = [
  {
    "id": "sess-101",
    "sessionNumber": 1,
    "sessionDate": "2026-10-20",
    "campus": "Alliance University",
    "program": "B.Sc Aviation",
    "section": "Section A",
    "instructorName": "S D Sandarsh",
    "durationMinutes": 40,
    "topicId": "topic-1",
    "topicSlug": "confidence-mindset",
    "topicTitle": "Confidence, Mindset & First Impression",
    "subtopicsCovered": ["1.1 Facing your fears", "1.2 The 30-second calm-down routine", "1.3 Walking into the room"],
    "activityTitle": "Three Words My Friends Use For Me",
    "studentCount": 31,
    "engagementLevel": "High",
    "observedCefr": "A2",
    "complementarySessionNeeded": False,
    "evidenceLinks": [
      "/images/hero_students_workshop.jpg"
    ],
    "materialsUsed": "Index cards, 30s timer, Whiteboard",
    "notes": "Students opened up well during the three-words exercise. Several admitted hesitation regarding English grammar. Practiced entry posture three times.",
    "loggedAt": "2026-10-20T16:30:00Z",
    "isCompliant48h": True
  },
  {
    "id": "sess-102",
    "sessionNumber": 2,
    "sessionDate": "2026-10-22",
    "campus": "Alliance University",
    "program": "B.Sc Aviation",
    "section": "Section B",
    "instructorName": "S D Sandarsh",
    "durationMinutes": 40,
    "topicId": "topic-1",
    "topicSlug": "confidence-mindset",
    "topicTitle": "Confidence, Mindset & First Impression",
    "subtopicsCovered": ["1.2 The 30-second calm-down routine", "1.4 Greeting the interviewer"],
    "activityTitle": "The 30-Second Somatic Calm-Down Drill",
    "studentCount": 30,
    "engagementLevel": "High",
    "observedCefr": "B1",
    "complementarySessionNeeded": False,
    "evidenceLinks": [
      "/images/better_self_awareness.jpg"
    ],
    "materialsUsed": "Stopwatch, Door entry simulation",
    "notes": "Practiced handshake and seating protocol. Emphasized eye contact distribution when facing a two-person panel.",
    "loggedAt": "2026-10-22T17:15:00Z",
    "isCompliant48h": True
  },
  {
    "id": "sess-103",
    "sessionNumber": 3,
    "sessionDate": "2026-10-27",
    "campus": "Alliance University",
    "program": "B.Sc Aviation",
    "section": "Section A",
    "instructorName": "S D Sandarsh",
    "durationMinutes": 40,
    "topicId": "topic-2",
    "topicSlug": "tell-me-about-yourself",
    "topicTitle": "Tell Me About Yourself & Personal Pitch",
    "subtopicsCovered": ["2.1 The Present-Past-Future rule", "2.2 Backing up strengths with proof"],
    "activityTitle": "Strength in a Story (The Anti-Cliché Anchor)",
    "studentCount": 29,
    "engagementLevel": "High",
    "observedCefr": "A2",
    "complementarySessionNeeded": True,
    "evidenceLinks": [
      "/images/better_peer_feedback.jpg"
    ],
    "materialsUsed": "Worksheets, Stopwatch",
    "notes": "Five students still recited generic buzzwords ('I am a hardworking multitasker'). Scheduled a 15-minute bridge clinic before Friday morning class.",
    "loggedAt": "2026-10-27T18:00:00Z",
    "isCompliant48h": True
  },
  {
    "id": "sess-104",
    "sessionNumber": 4,
    "sessionDate": "2026-10-29",
    "campus": "Alliance University",
    "program": "B.Sc Aviation",
    "section": "Section B",
    "instructorName": "S D Sandarsh",
    "durationMinutes": 40,
    "topicId": "topic-5",
    "topicSlug": "public-speaking-prep",
    "topicTitle": "Public Speaking & 1-Minute Impromptu (PREP)",
    "subtopicsCovered": ["5.1 The 20-second plan", "5.2 The PREP method"],
    "activityTitle": "Absurd Art Interpretation & Storytelling",
    "studentCount": 32,
    "engagementLevel": "High",
    "observedCefr": "B1",
    "complementarySessionNeeded": False,
    "evidenceLinks": [
      "/images/hero_office_blue_gold.jpg"
    ],
    "materialsUsed": "Projector, Abstract Painting Slide, Random Topic Spinner",
    "notes": "Tremendous engagement. Using abstract art removed fear of 'wrong answers' and got even the most hesitant students speaking for a full minute.",
    "loggedAt": "2026-10-29T16:45:00Z",
    "isCompliant48h": True
  }
]

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\softskills-sessions.json', 'w', encoding='utf-8') as f:
    json.dump(sessions, f, indent=2)

# 2. softskills-evidence.json
evidence = [
  {
    "id": "ev-1",
    "topicSlug": "confidence-mindset",
    "section": "Section A",
    "studentRollNo": "PROV-ASAV-BSC-7-26-001",
    "studentName": "Syed Rasul Huzaif",
    "mediaType": "photo",
    "category": "activity",
    "url": "/images/hero_students_workshop.jpg",
    "caption": "Three Words My Friends Use For Me - Pair comparison and discussion drill in Section A.",
    "uploadedAt": "2026-10-20T16:35:00Z"
  },
  {
    "id": "ev-2",
    "topicSlug": "confidence-mindset",
    "section": "Section B",
    "studentRollNo": "PROV-ASAV-BSC-7-26-033",
    "studentName": "Rakshan R S",
    "mediaType": "photo",
    "category": "grooming",
    "url": "/images/better_self_awareness.jpg",
    "caption": "Grooming and posture spot-check: Proper uniform alignment and executive seating posture.",
    "uploadedAt": "2026-10-22T17:20:00Z"
  },
  {
    "id": "ev-3",
    "topicSlug": "tell-me-about-yourself",
    "section": "Section A",
    "studentRollNo": "PROV-ASAV-BSC-7-26-010",
    "studentName": "Dhyaana Vasudevan",
    "mediaType": "video",
    "category": "baseline_pitch",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "caption": "Week 2 Baseline Self-Introduction Video (48 seconds). Focus area: eliminate eye gaze drop at closing.",
    "uploadedAt": "2026-10-27T18:05:00Z"
  },
  {
    "id": "ev-4",
    "topicSlug": "public-speaking-prep",
    "section": "Section B",
    "studentRollNo": "PROV-ASAV-BSC-7-26-049",
    "studentName": "Pratham P Naik",
    "mediaType": "photo",
    "category": "activity",
    "url": "/images/hero_office_blue_gold.jpg",
    "caption": "Absurd Art Interpretation: Presenting an impromptu story on visual prompts in 60 seconds.",
    "uploadedAt": "2026-10-29T16:50:00Z"
  }
]

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\softskills-evidence.json', 'w', encoding='utf-8') as f:
    json.dump(evidence, f, indent=2)

# 3. softskills-englishscore.json
students = json.load(open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\aviation-students.json', encoding='utf-8'))
english_records = []
for i, s in enumerate(students):
    score = 240 + (i * 7) % 260
    cefr = 'B1' if score >= 350 else ('A2' if score >= 280 else 'A1')
    english_records.append({
        "id": f"es-{i+1}",
        "rollNo": s["rollNo"],
        "studentName": s["name"],
        "program": "B.Sc Aviation",
        "section": "Section A" if i < 32 else "Section B",
        "attemptType": "Baseline Diagnostic",
        "testDate": "2026-10-14",
        "overallScore": score,
        "cefrLevel": cefr,
        "grammar": min(599, score + (i % 20) - 10),
        "vocabulary": min(599, score - (i % 15) + 5),
        "reading": min(599, score + (i % 30) - 15),
        "listening": min(599, score + 10),
        "screenshotUrl": "/images/better_worksheet.jpg",
        "verified": True
    })

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\softskills-englishscore.json', 'w', encoding='utf-8') as f:
    json.dump(english_records, f, indent=2)

print("Successfully seeded sessions, evidence, and englishscore files.")
