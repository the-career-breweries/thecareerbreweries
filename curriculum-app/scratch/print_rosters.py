import json

store = json.load(open('scratch/dsa_marks_store.json', encoding='utf-8'))

print("=== BBA Students in store ===")
bba_students = store['subjects']['BBA_English']['students']
for s in bba_students:
    print(f"  {s['name']} ({s['reg_no']})")

print("\n=== B.Sc Sec A Students in store ===")
bsca_students = store['subjects']['BSCA_English']['students']
for s in bsca_students:
    print(f"  {s['name']} ({s['reg_no']})")

print("\n=== B.Sc Sec B Students in store ===")
bscb_students = store['subjects']['BSCB_English']['students']
for s in bscb_students:
    print(f"  {s['name']} ({s['reg_no']})")
