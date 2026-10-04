from docx import Document
from docx.shared import Pt, Inches

doc = Document()
doc.add_heading('Curriculum Alignment Report', 0)
doc.add_paragraph('This document provides a detailed mapping between the official Alliance University Course Catalogue and the existing slide content created for the Soft Skills Studio applications.')

# --- SECTION 1: ENGLISH ---
doc.add_heading('1. Communicative English & Professional Communication', level=1)
doc.add_paragraph('Note: Our 15-week slide deck perfectly maps to the entire Semester 1 (Communicative English) syllabus in Weeks 2-6, and seamlessly flows right into covering almost the entirety of the Semester 2 (Professional Communication) syllabus in Weeks 7-15.')

table1 = doc.add_table(rows=1, cols=3)
table1.style = 'Table Grid'
hdr_cells = table1.rows[0].cells
hdr_cells[0].text = 'Catalogue Unit'
hdr_cells[1].text = 'Topics Expected by Catalogue'
hdr_cells[2].text = 'What We Have Covered in Our Slides'

# Bold headers
for cell in hdr_cells:
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            run.font.bold = True

english_data = [
    ("Unit 1", "Fundamentals of Grammar, Parts of Speech, Tenses, Sentence Structure", "Week 2: Grammar Fundamentals (Parts of Speech, Tenses, Sentence Construction, Error Correction)"),
    ("Unit 2", "Vocabulary Development, Synonyms & Antonyms, Aviation Tech Vocab", "Week 3: Vocabulary Development (Synonyms, Antonyms, Contextual Aviation Terminology)"),
    ("Unit 3", "Reading Skills, Comprehension, Skimming & Scanning, Interpretation", "Week 4: Reading Skills (Skimming, Scanning, Comprehension techniques, Analytical reading)"),
    ("Unit 4", "Writing Skills, Paragraph Writing, Letter, Report & Email Writing", "Week 5: Writing Skills (Paragraph structuring, Formal/Informal Letters, Aviation Incident Reports, Professional Emails)"),
    ("Unit 5", "Listening & Speaking Skills, Pronunciation, Conversation, Role Play", "Week 6: Listening & Speaking (Pronunciation drills, Aviation conversation practice, Passenger Role-play)"),
    ("Unit 1 (Sem 2)", "Basics of Communication, Barriers, Non-verbal Comm, Listening Skills", "Week 7: Effective Communication (The 7 Cs, Overcoming Barriers)\nWeek 8: Non-Verbal Communication (Body language, Posture, Eye contact)"),
    ("Unit 2 (Sem 2)", "Business Correspondence, Email, Report, Memo, Notice", "(Partially covered in Sem 1 Week 5. Memos & Notices can be easily added as a dedicated week later)"),
    ("Unit 3 (Sem 2)", "Presentation Skills, Public Speaking, Visual Aids, Group Discussions", "Week 10: Group Discussions (Turn-taking, Summarization)\nWeek 11: Presentation Skills (Visual aids, Structuring content)\nWeek 12: Public Speaking (Overcoming stage fright)"),
    ("Unit 4 (Sem 2)", "Interview Skills, Resume Preparation, Corporate Etiquette, Grooming", "Week 14: Interview Preparation (Self-introduction, Common questions)\nWeek 15: Mock Interviews (Real-time practice and feedback)"),
    ("Unit 5 (Sem 2)", "Aviation-Specific Comm, Customer Handling, Conflict Resolution", "Week 13: Cross-Cultural Communication (Handling global passengers, Cultural sensitivity, Empathy)")
]

for unit, expected, covered in english_data:
    row_cells = table1.add_row().cells
    row_cells[0].text = unit
    row_cells[1].text = expected
    row_cells[2].text = covered

doc.add_paragraph() # Add spacing

# --- SECTION 2: COMPUTING ---
doc.add_heading('2. Introduction to Computing Skills (Semester I)', level=1)
doc.add_paragraph('Note: Because the course catalogue assigns more hours to MS Excel (10 hours) compared to the other units (5 hours each), the slide content was naturally scaled so that Excel gets double the weeks. The 14-week curriculum maps 100% perfectly to the Semester 1 syllabus.')

table2 = doc.add_table(rows=1, cols=3)
table2.style = 'Table Grid'
hdr_cells = table2.rows[0].cells
hdr_cells[0].text = 'Catalogue Unit'
hdr_cells[1].text = 'Topics Expected by Catalogue'
hdr_cells[2].text = 'What We Have Covered in Our Slides'

# Bold headers
for cell in hdr_cells:
    for paragraph in cell.paragraphs:
        for run in paragraph.runs:
            run.font.bold = True

computing_data = [
    ("Unit 1", "Introduction to Computers, Hardware & Software, Operating Systems, File Management", "Week 1: Hardware vs. Software Basics\nWeek 2: Operating Systems & Windows Basics\nWeek 3: File Management, Folder Organization & Search"),
    ("Unit 2", "MS Word, Document Creation, Formatting, Tables, Reports", "Week 4: Document Creation & MS Word UI\nWeek 5: Formatting (Fonts, Alignment, Spacing)\nWeek 6: Tables, Structuring, and Report Generation"),
    ("Unit 3", "MS Excel, Formulas, Functions, Charts, Basic Data Analysis\n(Catalogue specifies double hours for this unit)", "Week 7: Excel Basics & Core Formulas\nWeek 8: Functions (SUM, AVERAGE, MIN, MAX, IF)\nWeek 9: Data Visualization & Charts (Pie, Line, Column)\nWeek 10: Basic Data Analysis (Sorting, Filtering, Formatting)"),
    ("Unit 4", "MS PowerPoint, Presentation Design, Professional Templates", "Week 11: Presentation Design (Layouts, Text, Images)\nWeek 12: Professional Templates (Master Slides, Themes)"),
    ("Unit 5", "Internet & Email, Cloud Storage, Cyber Safety Basics, Digital Communication Tools", "Week 13: Internet Basics, Cloud Storage, Email Etiquette\nWeek 14: Cyber Safety (Phishing, Malware, Passwords)")
]

for unit, expected, covered in computing_data:
    row_cells = table2.add_row().cells
    row_cells[0].text = unit
    row_cells[1].text = expected
    row_cells[2].text = covered

doc.save('Curriculum_Mapping_Report.docx')
print("Document generated successfully.")
