import json

with open(r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        c = str(d.get("content") or "")
        if "856223" in c or "130954" in c:
            print(f"Found in step {d.get('step_index')}: {d.get('source')} - {d.get('type')}: {c[:100]}")
