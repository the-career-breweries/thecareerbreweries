import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

cdap_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Introduction to Computing Skills\Computing Skills\CDAP\Amna_CDAP_Introduction_to_Computing_Skills.docx"

doc = docx.Document(cdap_path)

t4 = doc.tables[3]
for r in t4.rows:
    print(" | ".join(c.text.strip().replace('\n', ' ') for c in r.cells))
