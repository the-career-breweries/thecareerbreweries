import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\7447ede1-d79c-4bd8-9e33-a41134a95c72\.system_generated\logs\transcript.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        d = json.loads(line)
        if 2595 <= d.get("step_index", 0) <= 2615:
            print(f"Step {d.get('step_index')}: {d.get('source')} - {d.get('type')}")
            content = str(d.get('content') or '')[:250].replace('\n', ' ')
            print("  ", content)
            tc = d.get('tool_calls')
            if tc:
                print("   tool_calls:", [t.get('name') for t in tc])
