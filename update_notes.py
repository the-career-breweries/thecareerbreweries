import json
import os

filepath = 'curriculum-app/src/data/notes-content.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

if "Computing Skills" not in data:
    data["Computing Skills"] = {}

if "Communicative English" not in data:
    data["Communicative English"] = {}

# Updating Communicative English (Sessions 5 and 6) to reflect the 6-class deep dives
data["Communicative English"]["5"] = {
    "keyConcepts": [
        {"title": "The Anatomy of a Paragraph", "explanation": "A structured paragraph consists of a Topic Sentence, Supporting Sentences, and a Concluding Sentence."},
        {"title": "The Email Formula", "explanation": "Professional emails require a specific Subject Line, Greeting, focused Body, Call to Action, and formal Sign-off."},
        {"title": "Objective Report Writing", "explanation": "Reports must be written in the third person and utilize passive voice to maintain factual objectivity."}
    ],
    "definitions": [
        {"term": "Cohesion", "definition": "The logical flow and connection of ideas within a paragraph using transition words."},
        {"term": "Passive Voice", "definition": "A grammatical construction where the subject receives the action (e.g., 'The inspection was conducted') commonly used in incident reports."}
    ],
    "mnemonic": {
        "acronym": "EMAIL",
        "points": [
            "E - Exact Subject",
            "M - Meaningful Greeting",
            "A - Actionable Body",
            "I - Indicate Deadline (Call to Action)",
            "L - Leave a Professional Sign-off"
        ]
    },
    "btlQuestions": {
        "Remember": "What are the three main components of a structured paragraph?",
        "Understand": "Why is passive voice preferred in aviation incident reports?",
        "Apply": "Draft a short, formal email apologizing to your manager for a delayed submission.",
        "Analyze": "Compare the structure of a formal business letter to an informal letter to a friend.",
        "Evaluate": "Review a poorly written paragraph and explain how transition words would improve its cohesion.",
        "Create": "Write a complete 6-section incident report documenting a safety hazard observed in the lab."
    },
    "referenceMaterial": {
        "primary": "Wren & Martin High School English Grammar and Composition, Chapter on Letter Writing",
        "further": "Oxford Guide to Effective Writing and Speaking"
    }
}

data["Communicative English"]["6"] = {
    "keyConcepts": [
        {"title": "Hearing vs. Listening", "explanation": "Hearing is a biological, automatic function. Listening is an active, psychological choice requiring effort."},
        {"title": "The S.O.F.T.E.N. Technique", "explanation": "A framework for active listening body language: Smile, Open posture, Forward lean, Touch, Eye contact, Nod."},
        {"title": "The Positive-Negative-Positive Sandwich", "explanation": "A communication strategy for polite disagreement: Validate, State boundary, Offer alternative."}
    ],
    "definitions": [
        {"term": "Paraphrasing", "definition": "Summarizing the core issue and emotion of a speaker to confirm understanding, rather than just repeating their words."},
        {"term": "Sentence Intonation", "definition": "The rise and fall of voice pitch during speech, which can change statements into questions."}
    ],
    "mnemonic": {
        "acronym": "HEART",
        "points": [
            "H - Hear without interrupting",
            "E - Empathize with their feelings",
            "A - Apologize for the situation",
            "R - Resolve by offering options",
            "T - Thank them for their patience"
        ]
    },
    "btlQuestions": {
        "Remember": "What does the acronym S.O.F.T.E.N. stand for?",
        "Understand": "Explain the difference between open and closed questions when building rapport.",
        "Apply": "Paraphrase this statement: 'I've been waiting 3 hours and I'm going to miss my connection!'",
        "Analyze": "How does speaking in a high-noise environment change the way you must modulate your voice?",
        "Evaluate": "Watch a customer service roleplay and grade the employee's use of the H.E.A.R.T model.",
        "Create": "Perform a mock PA announcement incorporating appropriate pacing, clarity, and modulation."
    },
    "referenceMaterial": {
        "primary": "Effective Communication Skills by MTD Training",
        "further": "Aviation English by Macmillan Education"
    }
}

# Generating Computing Skills 1-30
computing_notes = {
    "1": ("Computer Hardware Basics", "Hardware vs Software", "Physical parts of a computer", "CPU, RAM, Storage", "Identify internal PC components"),
    "2": ("Software Fundamentals", "System vs Application", "Programs that run hardware vs tasks", "OS, Utilities, Apps", "Distinguish software types"),
    "3": ("Operating Systems - Interface & Navigation", "Windows UI", "GUI, Taskbar, Settings", "Desktop navigation", "Personalize Windows OS"),
    "4": ("File Management & Organization", "Hierarchy and Paths", "How files are stored in directories", "Folders, Files, Extensions", "Organize a messy directory"),
    "5": ("System Maintenance & Review", "System Diagnostics", "Task Manager, Backup protocols", "Processes, Maintenance", "Troubleshoot frozen applications"),
    
    "6": ("MS Word: Document Creation and Formatting", "Ribbon Interface", "UI layout for text editing tools", "Font, Paragraph, Styles", "Create and format a memo"),
    "7": ("Paragraph Formatting and Layout", "Alignment and Spacing", "Adjusting text flow and margins", "Justify, Line spacing", "Format an employee policy"),
    "8": ("Working with Tables and Visuals", "Tabular Data", "Organizing data into rows/columns", "Insert Table, SmartArt", "Design a flight schedule"),
    "9": ("Page Layout and Document Finalization", "Page Formatting", "Headers, Footers, Page breaks", "Margins, Orientation", "Finalize an incident report"),
    "10": ("Advanced Reporting & Review", "TOC and Mail Merge", "Automating document structuring", "Styles, Mass Mailing", "Generate a Table of Contents"),

    "11": ("Introduction to Spreadsheets", "Workbooks and Worksheets", "Grid-based data entry", "Rows, Columns, Cells", "Enter basic tabular data"),
    "12": ("Formatting Cells and Worksheets", "Data Types", "Currency, Dates, Percentages", "Format Painter, Wrap Text", "Format a sales report"),
    "13": ("Basic Mathematical Formulas", "Formula Syntax", "Starting with '=' and using operators", "PEMDAS, +, -, *, /", "Calculate baggage totals"),
    "14": ("Cell Referencing", "Absolute vs Relative", "Locking cells with $ in formulas", "F4 key, Dragging formulas", "Apply tax rates with absolute ref"),
    "15": ("Essential Functions (Statistical)", "Statistical Analysis", "SUM, AVERAGE, MIN, MAX", "Basic aggregations", "Analyze daily passenger counts"),
    "16": ("Logical and Text Functions", "Conditional Logic", "IF statements, Nested IFs", "CONCATENATE, Text manipulation", "Evaluate logical passenger data"),
    "17": ("Data Management and Sorting", "Sorting and Filtering", "Organizing large datasets", "Multi-level sort, AutoFilter", "Filter a flight manifest"),
    "18": ("Visualizing Data with Charts", "Data Visualization", "Representing numbers graphically", "Pie, Bar, Line Charts", "Create a quarterly revenue chart"),
    "19": ("Basic Data Analysis Tools", "Data Validation", "Drop-downs, Conditional Formatting", "Highlight rules, Duplicates", "Clean and validate crew records"),
    "20": ("Printing and Excel Review", "Print Areas", "Scaling sheets for paper", "Page Break Preview", "Set up a large table for printing"),

    "21": ("Introduction to PowerPoint", "Slide Layouts", "Placeholders for content", "Title, Body, Content slides", "Build a company intro deck"),
    "22": ("Design Themes and Templates", "Slide Master", "Global presentation formatting", "Themes, Variants, Backgrounds", "Apply corporate branding"),
    "23": ("Inserting Media and Visuals", "Multimedia Integration", "Pictures, Video, Audio", "Embedding, Playback options", "Create a visual safety briefing"),
    "24": ("Animations and Transitions", "Slide Dynamics", "Movement between and within slides", "Entrance, Emphasis, Sequencing", "Animate a process flow"),
    "25": ("Presentation Delivery & Review", "Presenter View", "Tools for delivering live", "Speaker Notes, Export to PDF", "Deliver a structured presentation"),

    "26": ("Internet Basics and Web Browsing", "Web Navigation", "Browsers, Search Engines, URLs", "Chrome, Keywords, Domains", "Research aviation trends"),
    "27": ("Professional Email Management", "Email Etiquette", "CC, BCC, Attachments, Signatures", "Inbox organization, Folders", "Draft a professional business email"),
    "28": ("Cloud Storage and Collaboration", "Cloud Computing", "Saving files to remote servers", "Google Drive, Co-authoring", "Collaborate live on a document"),
    "29": ("Cyber Safety and Security Basics", "Digital Security", "Phishing, Passwords, Malware", "2FA, Safe Browsing", "Identify a phishing email attempt"),
    "30": ("Digital Communication Tools & Review", "Virtual Meetings", "Zoom, Teams, Slack", "Screen sharing, Etiquette", "Conduct a professional video call")
}

for session, (title, concept_title, concept_exp, terms, apply_q) in computing_notes.items():
    data["Computing Skills"][session] = {
        "keyConcepts": [
            {"title": concept_title, "explanation": concept_exp},
            {"title": f"Applied {concept_title}", "explanation": f"Understanding how to leverage {concept_title.lower()} in a modern aviation business environment."}
        ],
        "definitions": [
            {"term": "Key Term", "definition": terms},
            {"term": "Practical Use", "definition": f"Applying {terms} efficiently in daily operations."}
        ],
        "mnemonic": {
            "acronym": "ACT",
            "points": ["A - Assess the task", "C - Choose the right tool", "T - Test the output"]
        },
        "btlQuestions": {
            "Remember": f"Define the core concepts of {title}.",
            "Understand": f"Explain the significance of {concept_title}.",
            "Apply": apply_q,
            "Analyze": f"Compare different methods of handling {terms}.",
            "Evaluate": f"Assess the effectiveness of your approach to {title}.",
            "Create": f"Design a workflow utilizing {concept_title}."
        },
        "referenceMaterial": {
            "primary": "Fundamentals of Computers, PHI Learning",
            "further": "Microsoft 365 Fundamentals"
        }
    }

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Successfully updated notes-content.json for 30 Computing Skills sessions and 2 English sessions.")
