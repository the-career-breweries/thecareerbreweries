import json

with open(r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        if 6005 <= d.get("step_index", 0) <= 6046:
            src = d.get("source")
            tp = d.get("type")
            cnt = str(d.get("content") or "")
            tc = d.get("tool_calls")
            if tc:
                print(f"Step {d.get('step_index')}: TOOL_CALL {[t.get('name') for t in tc]}")
            elif cnt:
                print(f"Step {d.get('step_index')}: {src} - {tp}: {cnt[:150]}")
