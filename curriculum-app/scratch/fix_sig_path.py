import os

erp_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\erp_app.py"
with open(erp_path, "r", encoding="utf-8") as f:
    c = f.read().replace("\r\n", "\n")

old_sig = """        p = cell.paragraphs[0]
        p.add_run().add_picture("Signature_S_D_Sandarsh.png", width=docx.shared.Inches(1.2))
        p.add_run(f"\\n{datetime.datetime.now().strftime('%d %b %Y')}")"""

new_sig = """        p = cell.paragraphs[0]
        sig_img_path = os.path.join(get_script_dir(), "Signature_S_D_Sandarsh.png")
        if os.path.exists(sig_img_path):
            p.add_run().add_picture(sig_img_path, width=docx.shared.Inches(1.2))
        p.add_run(f"\\n{datetime.datetime.now().strftime('%d %b %Y')}")"""

if old_sig in c:
    c = c.replace(old_sig, new_sig, 1)
    with open(erp_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("Fixed signature path in erp_app.py.")
else:
    print("old_sig not found.")
