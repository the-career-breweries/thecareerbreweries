import os
import sys

erp_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\erp_app.py"
gen_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\generate_official_weekly_report.py"

sec5_func = """def format_section_5_summary(doc, bucket_hours, total_hours, logs):
    category_display_names = {
        'classes': 'Classes taught',
        'prep': 'Class preparation',
        'faculty': 'Faculty development',
        'exams': 'Exams, events & duty',
        'admin': 'Admin, records & coordination',
        'research': 'Research & documentation',
        'other': 'Other academic activities'
    }
    
    if total_hours > 0 and bucket_hours:
        max_cat = max(bucket_hours, key=bucket_hours.get)
        max_name = category_display_names.get(max_cat, 'Classes taught')
        max_hrs = bucket_hours[max_cat]
        pct = (max_hrs / total_hours * 100)
        largest_text = f"—  Largest time commitment this week:  {max_name} — {max_hrs:.2f} hrs total ({pct:.1f}% of total logged time)"
    else:
        largest_text = "—  Largest time commitment this week:  No hours logged"
        
    inst_hrs = bucket_hours.get('exams', 0.0) + bucket_hours.get('admin', 0.0)
    if inst_hrs > 0:
        inst_text = f"—  Institutional work completed:  {inst_hrs:.2f} hrs total across exam duty, evaluation, AUERP administration, and operations"
    else:
        inst_text = "—  Institutional work completed:  Routine coordination and institutional support"
        
    teach_hrs = bucket_hours.get('classes', 0.0)
    prep_hrs = bucket_hours.get('prep', 0.0)
    teach_text = f"—  Teaching delivered and preparation behind it:  {teach_hrs:.2f} hrs taught, {prep_hrs:.2f} hrs prepared"
    
    admin_hrs = bucket_hours.get('admin', 0.0)
    if admin_hrs > 0:
        admin_text = f"—  Admin / coordination:  {admin_hrs:.2f} hrs total (AUERP configuration, component mark entry, reports & operational coordination)"
    else:
        admin_text = "—  Admin / coordination:  Standard departmental coordination"
        
    res_hrs = bucket_hours.get('research', 0.0)
    if res_hrs > 0:
        res_text = f"—  Research or documentation progress:  {res_hrs:.2f} hrs total (Research on Coursera course recommendations for students)"
    else:
        res_text = "—  Research or documentation progress:  No hours recorded in the supplied timesheet"
        
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
"""

# Patch erp_app.py
with open(erp_path, "r", encoding="utf-8") as f:
    erp_content = f.read().replace("\r\n", "\n")

if "def format_section_5_summary" not in erp_content:
    # Insert before generate_weekly_docx_bytes
    target = "def generate_weekly_docx_bytes"
    erp_content = erp_content.replace(target, sec5_func + "\n\n" + target, 1)

# Fix indentation in generate_weekly_docx_bytes
old_block = """    if official_logs is not None and len(official_logs) > 0:
        logs = official_logs
    else:
        logs = []
    for d in week_dates:"""

new_block = """    if official_logs is not None and len(official_logs) > 0:
        logs = official_logs
    else:
        logs = []
        for d in week_dates:"""

# We also need to indent the rest of that loop if it was unindented
if old_block in erp_content:
    # Let's replace the whole loop carefully
    old_loop = """    if official_logs is not None and len(official_logs) > 0:
        logs = official_logs
    else:
        logs = []
    for d in week_dates:
        d_str = d.strftime("%Y-%m-%d")
        if d_str in db_data:
            def clean_val(v):
                if v is None:
                    return ""
                s = str(v).strip()
                return "" if s.lower() in ("none", "nan", "-", "null") else s

            for entry in db_data[d_str]:
                cat = clean_val(entry.get("Category"))
                desc = clean_val(entry.get("Description"))
                ts = clean_val(entry.get("Time Slot"))
                
                hrs_val = entry.get("Hours")
                if cat and cat.lower() not in ("lunch", "leave / other"):
                    hrs = float(hrs_val) if hrs_val is not None else (0.25 if "04:00 - 04:15" in ts else 1.0)
                    if hrs > 0:
                        logs.append({
                            'date': d,
                            'day': d.strftime('%A'),
                            'date_str': d.strftime('%d-%b'),
                            'category': cat,
                            'activity': desc if desc else cat,
                            'hours': hrs
                        })"""

    new_loop = """    if official_logs is not None and len(official_logs) > 0:
        logs = official_logs
    else:
        logs = []
        for d in week_dates:
            d_str = d.strftime("%Y-%m-%d")
            if d_str in db_data:
                def clean_val(v):
                    if v is None:
                        return ""
                    s = str(v).strip()
                    return "" if s.lower() in ("none", "nan", "-", "null") else s

                for entry in db_data[d_str]:
                    cat = clean_val(entry.get("Category"))
                    desc = clean_val(entry.get("Description"))
                    ts = clean_val(entry.get("Time Slot"))
                    
                    hrs_val = entry.get("Hours")
                    if cat and cat.lower() not in ("lunch", "leave / other"):
                        hrs = float(hrs_val) if hrs_val is not None else (0.25 if "04:00 - 04:15" in ts else 1.0)
                        if hrs > 0:
                            logs.append({
                                'date': d,
                                'day': d.strftime('%A'),
                                'date_str': d.strftime('%d-%b'),
                                'category': cat,
                                'activity': desc if desc else cat,
                                'hours': hrs
                            })"""
    erp_content = erp_content.replace(old_loop, new_loop, 1)

# Add call to format_section_5_summary before saving
if "format_section_5_summary(doc" not in erp_content:
    call_target = "    buf = io.BytesIO()"
    erp_content = erp_content.replace(call_target, "    format_section_5_summary(doc, bucket_hours, total_hours, logs)\n\n" + call_target, 1)

with open(erp_path, "w", encoding="utf-8") as f:
    f.write(erp_content)

print("erp_app.py patched.")

# Patch generate_official_weekly_report.py
with open(gen_path, "r", encoding="utf-8") as f:
    gen_content = f.read().replace("\r\n", "\n")

if "def format_section_5_summary" not in gen_content:
    target_gen = "def build_docx_report"
    gen_content = gen_content.replace(target_gen, sec5_func + "\n\n" + target_gen, 1)

if "format_section_5_summary(doc" not in gen_content:
    call_target_gen = "    doc.save(out_path)"
    gen_content = gen_content.replace(call_target_gen, "    format_section_5_summary(doc, bucket_hours, total_hours, logs)\n\n" + call_target_gen, 1)

with open(gen_path, "w", encoding="utf-8") as f:
    f.write(gen_content)

print("generate_official_weekly_report.py patched.")
