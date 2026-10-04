import sys
from pathlib import Path
from docx import Document

# Output path (artifact directory)
output_path = Path(r"C:/Users/nayan/.gemini/antigravity/brain/8a3ab317-aa2c-4ed3-bf00-08ee13fb2a20/report_assignment.docx")

# Create document
doc = Document()

# Title
doc.add_heading('Report Writing Assignment', level=1)

# Instructions
instructions = [
    "Purpose: Summarise a factual incident, analyse causes, and propose recommendations.",
    "Structure (use headings):",
    "  1. Title – clear and specific.",
    "  2. Executive Summary – 2‑3 sentences (optional for longer reports).",
    "  3. Introduction – context, purpose, and scope.",
    "  4. Methodology – how information was gathered (e.g., crew statements, flight data).",
    "  5. Findings – chronological description of the incident.",
    "  6. Analysis – why it happened (weather, technical, human factors).",
    "  7. Conclusion – concise statement of the main outcome.",
    "  8. Recommendations – actionable steps to prevent recurrence.",
    "  9. References – any sources (manuals, regulations, weather reports).",
    "Language: Use formal, objective tone. Prefer past tense for events, present simple for facts, and passive voice for actions when appropriate.",
    "Style: Keep sentences concise (15‑20 words). Use transition words (therefore, consequently, however).",
    "Formatting: 12‑pt Times New Roman or Arial, 1.5 line spacing, 1‑inch margins. Numbered headings (1., 1.1, 1.1.1). Include page numbers.",
    "Word limit: Approximately 300‑350 words (≈1 page)."
]

doc.add_heading('Report Writing Instructions', level=2)
for line in instructions:
    if line.strip().endswith(':'):
        p = doc.add_paragraph(line.strip(), style='List Bullet')
    else:
        doc.add_paragraph(line)

# Topic
doc.add_heading('Assignment Topic', level=2)
topic = "Incident Report: Unexpected Turbulence Encounter on Flight XYZ123 from New Delhi to Mumbai.\nWrite a one‑page report covering the points in the left‑hand column. Use the structure provided."

doc.add_paragraph(topic)

# Blank lines for students to write
for _ in range(12):
    doc.add_paragraph('')

# Ensure directory exists and save
output_path.parent.mkdir(parents=True, exist_ok=True)

doc.save(output_path)
print(f'DOCX generated at {output_path}')
