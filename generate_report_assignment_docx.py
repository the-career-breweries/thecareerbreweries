import re
import sys
from pathlib import Path
from docx import Document
from docx.shared import Pt

# Paths
md_path = Path(r"C:/Projects/tcb-soft-skills/curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1/week5-report-assignment.md")
output_path = Path(r"C:/Users/nayan/.gemini/antigravity/brain/8a3ab317-aa2c-4ed3-bf00-08ee13fb2a20/report_assignment.docx")

# Read markdown
md_text = md_path.read_text(encoding="utf-8")

# Remove frontmatter delimiter
if md_text.startswith('---'):
    md_text = md_text.split('---', 2)[-1]

# Simple split: find the "Assignment Topic" heading
topic_match = re.search(r"#\s*Assignment Topic\s*(.*)", md_text, re.DOTALL)
# Actually the markdown uses <h2> inside HTML, but we can just split by the two <div> sections
parts = md_text.split('<div style="flex: 1; padding: 1rem; border: 1px solid #ccc;">')
if len(parts) < 2:
    sys.exit('Unexpected markdown structure')

# Left part contains instructions
left_html = parts[0]
right_html = parts[1]

# Strip HTML tags to plain text (very crude)
def strip_tags(html: str) -> str:
    # Remove tags like <h2>, <ol>, <li>, <p>, <strong>, <em>, etc.
    text = re.sub(r"<[^>]+>", "", html)
    # Convert HTML entities
    text = text.replace('&nbsp;', ' ')
    return text.strip()

instructions = strip_tags(left_html)
# Right part: extract the topic paragraph after "Assignment Topic" heading
right_text = strip_tags(right_html)
# The first line after heading likely contains the topic description
lines = [ln.strip() for ln in right_text.splitlines() if ln.strip()]
# Find line that starts with "Incident Report:"
topic_line = next((ln for ln in lines if ln.startswith('Incident Report:')), 'Topic not found')

# Create docx
doc = Document()

# Title
doc.add_heading('Report Writing Assignment', level=1)

# Instructions section
doc.add_heading('Report Writing Instructions', level=2)
for para in instructions.split('\n'):
    para = para.strip()
    if not para:
        continue
    # Add bullet points for list items starting with numbers or dashes
    if re.match(r"^[0-9]+\.\s+|^\*\s+", para):
        p = doc.add_paragraph(style='List Bullet')
        p.add_run(para)
    else:
        doc.add_paragraph(para)

# Topic section
doc.add_heading('Assignment Topic', level=2)
doc.add_paragraph(topic_line)

# Save
output_path.parent.mkdir(parents=True, exist_ok=True)
doc.save(output_path)
print(f'DOCX generated at {output_path}')
