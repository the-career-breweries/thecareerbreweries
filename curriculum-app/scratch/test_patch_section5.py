import os
import sys
import docx

doc_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\Weekly_Work_Report_Sandarsh_2026-10-26_to_2026-10-31.docx"
doc = docx.Document(doc_path)

bucket_hours = {
    'classes': 25.5,
    'prep': 3.0,
    'faculty': 0.0,
    'exams': 4.5,
    'admin': 6.5,
    'research': 2.0
}
total_hours = 41.5

category_display_names = {
    'classes': 'Classes taught',
    'prep': 'Class preparation',
    'faculty': 'Faculty development',
    'exams': 'Exams, events & duty',
    'admin': 'Admin, records & coordination',
    'research': 'Research & documentation',
    'other': 'Other academic activities'
}

max_cat = max(bucket_hours, key=bucket_hours.get)
max_name = category_display_names.get(max_cat, 'Classes taught')
max_hrs = bucket_hours[max_cat]
pct = (max_hrs / total_hours * 100)

largest_text = f"—  Largest time commitment this week:  {max_name} — {max_hrs:.2f} hrs total ({pct:.1f}% of total logged time)"
inst_hrs = bucket_hours.get('exams', 0.0) + bucket_hours.get('admin', 0.0)
inst_text = f"—  Institutional work completed:  {inst_hrs:.2f} hrs total across exam duty, evaluation, AUERP administration, and operations"
teach_hrs = bucket_hours.get('classes', 0.0)
prep_hrs = bucket_hours.get('prep', 0.0)
teach_text = f"—  Teaching delivered and preparation behind it:  {teach_hrs:.2f} hrs taught, {prep_hrs:.2f} hrs prepared"
admin_hrs = bucket_hours.get('admin', 0.0)
admin_text = f"—  Admin / coordination:  {admin_hrs:.2f} hrs total (AUERP configuration, component mark entry, reports & operational coordination)"
res_hrs = bucket_hours.get('research', 0.0)
res_text = f"—  Research or documentation progress:  {res_hrs:.2f} hrs total (Research on Coursera course recommendations for students)"
followup_text = "—  Anything blocked, pending, or needing follow-up:  No such item was recorded in the supplied timesheet."

for p in doc.paragraphs:
    txt = p.text
    if "Largest time commitment" in txt:
        p.text = largest_text
    elif "Institutional work completed" in txt:
        p.text = inst_text
    elif "Teaching delivered and preparation" in txt:
        p.text = teach_text
    elif "Admin / coordination" in txt:
        p.text = admin_text
    elif "Research or documentation progress" in txt:
        p.text = res_text
    elif "Anything blocked, pending" in txt:
        p.text = followup_text

doc.save(doc_path)
print("Updated Section 5 in docx successfully!")

for i, p in enumerate(doc.paragraphs):
    if "The Week in Summary" in p.text:
        for j in range(i, i+8):
            if j < len(doc.paragraphs):
                print(f"P{j}: {doc.paragraphs[j].text}")
        break
