import json

with open(r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        if 6080 <= d.get("step_index", 0) <= 6130:
            print(f"Step {d.get('step_index')}: {d.get('source')} - {d.get('type')}")
            content = str(d.get('content') or '')[:100].replace('\n', ' ')
            print(f"  Content: {content}")
            tc = d.get('tool_calls')
            if tc:
                print(f"  Tool calls: {[t.get('name') for t in tc]}")
