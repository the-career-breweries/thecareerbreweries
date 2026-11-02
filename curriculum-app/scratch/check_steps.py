import json

with open(r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        if d.get("step_index") in [6160, 6161, 6168, 6177, 6179, 6181, 6185]:
            print(f"=== Step {d.get('step_index')} ===")
            print(json.dumps(d.get("tool_calls"), indent=2))
