import json

with open(r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        c = str(d.get("content") or "")
        if "strictly equal" in c or "Arithmetic Check" in c or "70" in c:
            print(f"Step {d.get('step_index')}: {c[:150]}")
