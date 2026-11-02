import os

def insert_call(file_path, target_str, replacement_str):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read().replace("\r\n", "\n")
    if target_str in content:
        content = content.replace(target_str, replacement_str, 1)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {os.path.basename(file_path)} successfully.")
    else:
        print(f"Target not found in {os.path.basename(file_path)}.")

erp_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\erp_app.py"
gen_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\generate_official_weekly_report.py"

# In erp_app.py:
insert_call(
    erp_path,
    "    buf = io.BytesIO()\n    doc.save(buf)",
    "    format_section_5_summary(doc, bucket_hours, total_hours, logs)\n    buf = io.BytesIO()\n    doc.save(buf)"
)

# In generate_official_weekly_report.py:
insert_call(
    gen_path,
    "    doc.save(out_path)\n    print(f\"\\nSaved Report to: {out_path}\")",
    "    format_section_5_summary(doc, bucket_hours, total_hours, logs)\n    doc.save(out_path)\n    print(f\"\\nSaved Report to: {out_path}\")"
)
