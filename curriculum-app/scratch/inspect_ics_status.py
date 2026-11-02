import json

data = json.load(open('scratch/dsa_marks_store.json'))
bsca = data['subjects']['BSCA_Computing']['students']
bscb = data['subjects']['BSCB_Computing']['students']

print("=== SECTION A COMPUTING (31 total) ===")
for s in bsca:
    st = f"GRADED ({s['total']})" if s.get('graded') else ("ABSENT" if s.get('is_absent') else "NOT GRADED")
    print(f"Sec A | {s['sl_no']:2d} | {s['name']:<32} | {s['reg_no']} | {st}")

print("\n=== SECTION B COMPUTING (33 total) ===")
for s in bscb:
    st = f"GRADED ({s['total']})" if s.get('graded') else ("ABSENT" if s.get('is_absent') else "NOT GRADED")
    print(f"Sec B | {s['sl_no']:2d} | {s['name']:<32} | {s['reg_no']} | {st}")
