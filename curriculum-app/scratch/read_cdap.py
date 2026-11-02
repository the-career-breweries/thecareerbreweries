import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

cdap_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Introduction to Computing Skills\Computing Skills\CDAP\Amna_CDAP_Introduction_to_Computing_Skills.docx"

doc = docx.Document(cdap_path)

print("PARAGRAPHS WITH CO:")
for p in doc.paragraphs:
    if "CO" in p.text or "Course Outcome" in p.text:
        print(p.text)

print("\nTABLES WITH CO:")
for i, t in enumerate(doc.tables):
    for r in t.rows:
        text = " | ".join(c.text.strip().replace('\n', ' ') for c in r.cells)
        if "CO" in text or "Course Outcome" in text:
            print(f"T{i+1}: {text[:150]}")
