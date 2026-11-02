import os
import sys
import docx

sys.stdout.reconfigure(encoding='utf-8')
doc_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\Weekly_Work_Report_Sandarsh_2026-10-26_to_2026-10-31.docx"
doc = docx.Document(doc_path)

print(f"Total tables: {len(doc.tables)}")
for i, t in enumerate(doc.tables):
    first_cell = t.rows[0].cells[0].text.strip().replace('\n', ' ') if t.rows and t.rows[0].cells else ''
    print(f"Table {i}: rows={len(t.rows)}, cols={len(t.rows[0].cells)}, first_cell='{first_cell[:50]}'")
