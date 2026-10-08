import json
import os
import re

sessions = [
    # Unit 1
    ("Introduction to Nouns, Pronouns, and Adjectives", "Grammar Basics", "Identify parts of speech"),
    ("Verbs, Adverbs, Prepositions, & Conjunctions", "Action & Linking words", "Sentence construction"),
    ("Present Tenses", "Rules and usage", "Tense exercises"),
    ("Past and Future Tenses", "Simple, Continuous, Perfect", "Time consistency"),
    ("Sentence Structure Basics", "SVO model, Phrases, Clauses", "Fix run-on sentences"),
    ("Sentence Types and Review", "Simple, Compound, Complex", "Grammar Assessment"),
    # Unit 2
    ("Introduction to Vocabulary Building", "Active vs Passive vocabulary", "Dictionary skills"),
    ("Prefixes, Suffixes, Synonyms, & Antonyms", "Word roots and meanings", "Word replacement"),
    ("Technical Vocabulary - Aircraft & Infrastructure", "Aviation terms", "Case-based learning"),
    ("Technical Vocabulary - Flight Ops & ATC", "ATC terms, Phonetic alphabet", "ATC Simulation"),
    ("Technical Vocabulary - Passenger Handling", "Ticketing, Baggage, Safety", "Customer interaction"),
    ("Vocabulary Application and Review", "Acronyms, Integration", "Vocabulary Assessment"),
    # Unit 3
    ("Introduction to Reading Comprehension", "Active vs Passive reading", "Identify main ideas"),
    ("Skimming Techniques", "Titles, headings, gist", "Speed reading drills"),
    ("Scanning Techniques", "Visual cues, keywords", "Scanning flight schedules"),
    ("Reading Technical and Aviation Documents", "CARs, SOPs, Briefing cards", "Extract data from SOP"),
    ("Interpretation and Critical Reading", "Inferences, Fact vs Opinion", "Critical analysis"),
    ("Comprehensive Reading Practice & Review", "Timed reading test", "Reading Assessment"),
    # Unit 4
    ("Principles of Paragraph Writing", "Topic and supporting sentences", "Descriptive writing"),
    ("Formal and Informal Letter Writing", "Business formats, Tone", "Drafting letters"),
    ("Professional Email Writing", "Subject lines, Salutations", "Internal communication"),
    ("Advanced Email Scenarios", "Persuasion, Bad news, Irate customers", "Handling email threads"),
    ("Fundamentals of Report Writing", "Executive summaries, findings", "Incident report outline"),
    ("Report Writing Application & Review", "Operational shift reports", "Report Assessment"),
    # Unit 5
    ("Fundamentals of Active Listening", "Hearing vs Listening, Barriers", "Audio exercises"),
    ("Phonetics and Pronunciation", "Vowels, Consonants, Intonation", "Pronunciation drills"),
    ("Everyday Conversation Practice", "Small talk, open-ended questions", "Conversational scenarios"),
    ("Professional Speaking in Aviation", "PA Announcements, Briefings", "Cabin safety announcement"),
    ("Role Play: Customer Service Scenarios", "Handling inquiries, delays, irate passengers", "Role Play exercises"),
    ("Role Play: Conflict Resolution & Review", "De-escalation techniques", "Speaking Assessment")
]

ts_code = """export interface WeekData {
  week: number | string;
  semester: number;
  level?: number;
  theme: string;
  focus: string;
  task: string;
  rubric: string;
  label?: string;
}

export interface StreamCurriculum {
  streamName: string;
  weeks: WeekData[];
}

export interface ProgramCurriculum {
  programName: string;
  streams: StreamCurriculum[];
}

const englishSem1Weeks: WeekData[] = [
"""

for i, (theme, focus, task) in enumerate(sessions):
    week_num = i + 1
    unit = ((week_num - 1) // 6) + 1
    sess = ((week_num - 1) % 6) + 1
    label = f"Unit {unit}: Session {sess}"
    # Escape quotes
    theme_esc = theme.replace("'", "\\'")
    focus_esc = focus.replace("'", "\\'")
    task_esc = task.replace("'", "\\'")
    ts_code += f"  {{ week: {week_num}, semester: 1, level: 1, theme: '{theme_esc}', focus: '{focus_esc}', task: '{task_esc}', rubric: 'Performance', label: '{label}' }},\n"

ts_code += """];

export const curriculumDataEnglish: Record<'ug' | 'pg', ProgramCurriculum> = {
  ug: {
    programName: 'Undergraduate',
    streams: [
      { streamName: 'BBA Aviation', weeks: englishSem1Weeks },
      { streamName: 'B.Sc Aviation', weeks: englishSem1Weeks },
    ]
  },
  pg: {
    programName: 'Postgraduate',
    streams: []
  }
};
"""

with open('curriculum-app/src/data/curriculum-english.ts', 'w', encoding='utf-8') as f:
    f.write(ts_code)

# Scaffold Markdown files
base_paths = [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1'
]

for path in base_paths:
    os.makedirs(path, exist_ok=True)
    # clean old week files safely
    for f in os.listdir(path):
        if re.match(r'^week\d+\.md$', f):
            os.remove(os.path.join(path, f))
            
    # create new 30 files
    for i, (theme, focus, task) in enumerate(sessions):
        week_num = i + 1
        unit = ((week_num - 1) // 6) + 1
        sess = ((week_num - 1) % 6) + 1
        
        md = f"# Session {week_num}: {theme}\n\n---\n\n"
        md += f"# Overview\n\nWelcome to Session {week_num}. Today we will be covering **{theme}**.\n\n---\n\n"
        md += f"# {unit}.{sess}.1 Core Concept\n\nInstructor will guide you through this concept.\n\n---\n\n"
        md += f"# {unit}.{sess}.2 Application\n\nInstructor will guide you through this concept.\n\n---\n\n"
        md += f"# {unit}.{sess}.3 Practice\n\nComplete the exercises provided by the instructor.\n\n---\n\n"
        
        with open(os.path.join(path, f'week{week_num}.md'), 'w', encoding='utf-8') as f:
            f.write(md)

# Update notes
notes_path = 'curriculum-app/src/data/notes-content.json'
with open(notes_path, 'r', encoding='utf-8') as f:
    notes = json.load(f)

notes['Communicative English'] = {}
for i, (theme, focus, task) in enumerate(sessions):
    week_num = str(i + 1)
    notes['Communicative English'][week_num] = {
        "keyConcepts": [
            {"title": theme, "explanation": focus}
        ],
        "definitions": [
            {"term": "Key Concept", "definition": "To be discussed in class."}
        ],
        "mnemonic": "N/A",
        "btlQuestions": {
            "Remember": "Recall the main points.",
            "Understand": "Explain the concept in your own words."
        },
        "referenceMaterial": {
            "primary": "Aviation Communication Handouts"
        }
    }

with open(notes_path, 'w', encoding='utf-8') as f:
    json.dump(notes, f, indent=2)

print("Scaffolded exactly 30 English sessions!")
