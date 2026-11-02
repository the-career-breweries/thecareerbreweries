import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

ans_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Introduction to Computing Skills\Computing Skills\MidTerm_Computing\MSE_Introduction_to_Computing_Skills_Z7AVA26209_AnswerKey.docx"

doc = docx.Document(ans_path)

print("PARAGRAPHS:")
for p in doc.paragraphs[:50]:
    if p.text.strip():
        print(p.text)
