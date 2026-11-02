import os
import glob

BASE_DIR = r"G:\My Drive\Alliance University\Alliance University - Aviation"

keywords = ["co mapping", "question & co", "question mapping", "assignment 1", "class participation", "z7ava 26209", "computing skills"]

print("Searching files in:", BASE_DIR)

found_files = []
for root, dirs, files in os.walk(BASE_DIR):
    if ".venv" in root or "__pycache__" in root:
        continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in [".docx", ".xlsx", ".csv", ".txt", ".md", ".json"]:
            full_path = os.path.join(root, f)
            fname_lower = f.lower()
            if any(k in fname_lower for k in ["mapping", "co", "assignment", "participation", "session", "cdap", "computing"]):
                found_files.append(full_path)

print(f"Found {len(found_files)} candidate files by name:")
for fp in found_files:
    print(" ", fp)
