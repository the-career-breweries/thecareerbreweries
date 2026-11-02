import docx
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

qp_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Introduction to Computing Skills\Computing Skills\MidTerm_Computing\MSE_Introduction_to_Computing_Skills_Z7AVA26209_QP.docx"

doc = docx.Document(qp_path)

print("PARAGRAPHS:")
for p in doc.paragraphs:
    if p.text.strip():
        print(p.text)

print("\nTABLES:")
for i, table in enumerate(doc.tables):
    print(f"\n--- Table {i+1} ---")
    for row in table.rows:
        row_text = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
        print(" | ".join(row_text))
