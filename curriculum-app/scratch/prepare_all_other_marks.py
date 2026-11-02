import json

store = json.load(open('scratch/dsa_marks_store.json', encoding='utf-8'))

# 1. BBA English Marks (18 students)
# Keys: A1 (Assignment 1, max 15), Asgn (Assignments, max 15), CP (Class Participation, max 10)
bba_raw = {
    "RUCHITHA S": {"A1": 14.0, "Asgn": 14.0, "CP": 9.0},
    "VIANCA SHERINE": {"A1": 14.0, "Asgn": 15.0, "CP": 10.0},
    "JESNA THOMAS": {"A1": 15.0, "Asgn": 15.0, "CP": 10.0},
    "PRAYANK SHARMA": {"A1": 13.0, "Asgn": 15.0, "CP": 9.0},
    "AYUSHI KUMARI": {"A1": 0.0, "Asgn": 0.0, "CP": 0.0, "absent": True},
    "ATHINA KUNNATH": {"A1": 14.0, "Asgn": 14.0, "CP": 8.0},
    "HARSITA PRASAD": {"A1": 14.0, "Asgn": 12.0, "CP": 10.0},
    "JOEL THOMAS": {"A1": 14.0, "Asgn": 13.0, "CP": 9.0},
    "K MADHU PRATIKA": {"A1": 15.0, "Asgn": 14.0, "CP": 9.0},
    "JASWANT KALYAN YADIDA": {"A1": 14.0, "Asgn": 13.0, "CP": 10.0},
    "DHANUSH M": {"A1": 11.0, "Asgn": 12.0, "CP": 9.0},
    "PRIYA RAWAT": {"A1": 15.0, "Asgn": 14.0, "CP": 9.0},
    "ANJALI M NAIR": {"A1": 0.0, "Asgn": 0.0, "CP": 0.0, "absent": True},
    "SUREKHA N": {"A1": 10.0, "Asgn": 14.0, "CP": 9.0},
    "SOHINI DEY": {"A1": 10.0, "Asgn": 15.0, "CP": 0.0},
    "NAYANA P NAIR": {"A1": 14.0, "Asgn": 15.0, "CP": 10.0},
    "DOLU BINDU": {"A1": 15.0, "Asgn": 12.0, "CP": 9.0},
    "VEERAPANENI YASHITA CHOWDARY": {"A1": 15.0, "Asgn": 13.0, "CP": 10.0}
}

# 2. B.Sc Sec A Marks (31 students)
# Both CE and ICS
bsca_raw = {
    "ABDUL AZEEZ WAJID": {"CE_A1": 13.8, "ICS_A1": 14.7, "CE_Asgn": 11.0, "ICS_Asgn": 13.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "ASSOUMANI SALIM": {"CE_A1": 9.75, "ICS_A1": 2.4, "CE_Asgn": 12.0, "ICS_Asgn": 14.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "BHUMIKA I A": {"CE_A1": 12.6, "ICS_A1": 12.3, "CE_Asgn": 12.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 8.0},
    "DANIEL NTONJA": {"CE_A1": 13.35, "ICS_A1": 14.7, "CE_Asgn": 13.0, "ICS_Asgn": 13.8, "CE_CP": 10.0, "ICS_CP": 10.0},
    "DEEPAK LAKHANI": {"CE_A1": 10.8, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 7.0},
    "DUDEKULE BABA THANVEER": {"CE_A1": 8.55, "ICS_A1": 4.5, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "E KEERTHIKHA": {"CE_A1": 12.3, "ICS_A1": 14.1, "CE_Asgn": 14.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 8.0},
    "EERI BAVALEENA": {"CE_A1": 13.2, "ICS_A1": 14.25, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 8.0},
    "HANNAH MARIAM SONY": {"CE_A1": 12.3, "ICS_A1": 12.3, "CE_Asgn": 12.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 9.0},
    "ISHAN NARULA K": {"CE_A1": 12.75, "ICS_A1": 13.65, "CE_Asgn": 13.0, "ICS_Asgn": 14.0, "CE_CP": 10.0, "ICS_CP": 8.0},
    "KUSUMA H REDDY": {"CE_A1": 11.4, "ICS_A1": 12.45, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 10.0, "ICS_CP": 8.0},
    "MADHAV GOKUL": {"CE_A1": 11.55, "ICS_A1": 12.75, "CE_Asgn": 13.0, "ICS_Asgn": 12.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "MAHAMMAD SAQUIB KAMAGAL": {"CE_A1": 11.25, "ICS_A1": 15.0, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 8.0},
    "MAN PATEL": {"CE_A1": 9.6, "ICS_A1": 13.5, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "MOHAMMED AYAAN": {"CE_A1": 12.6, "ICS_A1": 14.4, "CE_Asgn": 13.0, "ICS_Asgn": 13.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "NIDHI K S": {"CE_A1": 13.05, "ICS_A1": 13.35, "CE_Asgn": 14.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 9.0},
    "PRANESH M UMASHANKAR": {"CE_A1": 12.6, "ICS_A1": 14.7, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 9.0},
    "PRATHAMESH CHAVAN": {"CE_A1": 11.55, "ICS_A1": 12.9, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 9.0},
    "PUSHKARAN ADAIKKAN": {"CE_A1": 7.8, "ICS_A1": 8.1, "CE_Asgn": 14.0, "ICS_Asgn": 12.0, "CE_CP": 9.0, "ICS_CP": 9.0},
    "R RAFFEAL": {"CE_A1": 10.05, "ICS_A1": 11.25, "CE_Asgn": 13.0, "ICS_Asgn": 13.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "RAKSHAN R S": {"CE_A1": 11.25, "ICS_A1": 12.0, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 9.0},
    "RATAKONDA CHINTAMANU PAVAN KUMAR": {"CE_A1": 11.4, "ICS_A1": 14.1, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "RAYAPANENI UDAY KIRAN": {"CE_A1": 9.9, "ICS_A1": 7.5, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 9.0},
    "SAI DAKSHITHA V": {"CE_A1": 11.4, "ICS_A1": 14.1, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 8.0},
    "SARVESHWARAN V": {"CE_A1": 12.15, "ICS_A1": 14.55, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "SAYYED FALAK NAZ NASIR": {"CE_A1": 11.25, "ICS_A1": 11.4, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 8.0},
    "SHUBHANKAR BHOWMICK": {"CE_A1": 12.9, "ICS_A1": 14.1, "CE_Asgn": 13.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 9.0},
    "SYED SAMIYA AZRA": {"CE_A1": 11.4, "ICS_A1": 13.8, "CE_Asgn": 13.0, "ICS_Asgn": 12.5, "CE_CP": 8.0, "ICS_CP": 9.0},
    "TANMAY JANNAPURA THEJASVI": {"CE_A1": 10.35, "ICS_A1": 13.95, "CE_Asgn": 12.0, "ICS_Asgn": 11.0, "CE_CP": 9.0, "ICS_CP": 9.0},
    "TANMAY KUMAR": {"CE_A1": 11.55, "ICS_A1": 14.4, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 10.0},
    "VANDANA RANI": {"CE_A1": 9.9, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 12.6, "CE_CP": 10.0, "ICS_CP": 9.0}
}

# 3. B.Sc Sec B Marks (33 students)
# Both CE and ICS
bscb_raw = {
    "HAMZA": {"CE_A1": 13.65, "ICS_A1": 14.4, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 10.0, "ICS_CP": 10.0},
    "BANDALA DAIWIK VARDHAN": {"CE_A1": 14.1, "ICS_A1": 14.4, "CE_Asgn": 14.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 9.0},
    "ADHIL MOHAMMED M": {"CE_A1": 12.75, "ICS_A1": 14.7, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "ABIGA J": {"CE_A1": 13.35, "ICS_A1": 14.25, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 9.0},
    "PRATHAM P NAIK": {"CE_A1": 12.45, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 10.0, "ICS_CP": 9.0},
    "KRISHANU SUR": {"CE_A1": 10.8, "ICS_A1": 0.0, "CE_Asgn": 14.0, "ICS_Asgn": 14.0, "CE_CP": 9.0, "ICS_CP": 9.0, "ics_a1_absent": True},
    "EVLIN ROSE SHOJI": {"CE_A1": 13.8, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 10.0},
    "CHEEDELLA SAI MANVITH": {"CE_A1": 11.7, "ICS_A1": 14.4, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "SIRI SAMHITHA R": {"CE_A1": 7.8, "ICS_A1": 10.5, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "DINESH S": {"CE_A1": 7.5, "ICS_A1": 4.2, "CE_Asgn": 14.0, "ICS_Asgn": 14.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "PAVAN S": {"CE_A1": 10.65, "ICS_A1": 12.6, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "SAMANTHA JAMES": {"CE_A1": 11.1, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 14.0, "CE_CP": 10.0, "ICS_CP": 10.0},
    "ARYAN ZINDA R": {"CE_A1": 9.9, "ICS_A1": 8.1, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 10.0},
    "SYED RASUL HUZAIF": {"CE_A1": 11.55, "ICS_A1": 14.4, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "SMRUTI RANJAN RAUTARAY": {"CE_A1": 12.6, "ICS_A1": 14.55, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 10.0},
    "AVINASH A": {"CE_A1": 10.2, "ICS_A1": 14.55, "CE_Asgn": 14.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 9.0},
    "SREEYA S": {"CE_A1": 14.25, "ICS_A1": 14.85, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 10.0},
    "AARYA MANISH KAMERKAR": {"CE_A1": 12.6, "ICS_A1": 14.7, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 10.0, "ICS_CP": 9.0},
    "BILAL ABDUL MAJEETH": {"CE_A1": 12.0, "ICS_A1": 13.5, "CE_Asgn": 14.0, "ICS_Asgn": 14.0, "CE_CP": 9.0, "ICS_CP": 9.0},
    "DHYAANA VASUDEVAN": {"CE_A1": 13.2, "ICS_A1": 12.9, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "DEEPIKA S": {"CE_A1": 7.5, "ICS_A1": 14.7, "CE_Asgn": 13.5, "ICS_Asgn": 14.0, "CE_CP": 10.0, "ICS_CP": 9.0},
    "IRENE ANNA SABU": {"CE_A1": 14.1, "ICS_A1": 14.1, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 8.0, "ICS_CP": 9.0},
    "DANIEL JAISON J": {"CE_A1": 10.8, "ICS_A1": 14.7, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 8.0, "ICS_CP": 9.0},
    "V SAI HEMANTH ACHARI": {"CE_A1": 12.15, "ICS_A1": 12.6, "CE_Asgn": 14.0, "ICS_Asgn": 13.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "GURU BALACHANDRAN C": {"CE_A1": 10.5, "ICS_A1": 13.8, "CE_Asgn": 15.0, "ICS_Asgn": 15.0, "CE_CP": 10.0, "ICS_CP": 10.0},
    "SRIVARSHINI G K": {"CE_A1": 13.05, "ICS_A1": 14.7, "CE_Asgn": 14.0, "ICS_Asgn": 12.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "HARMAIN SEHAR": {"CE_A1": 11.55, "ICS_A1": 15.0, "CE_Asgn": 15.0, "ICS_Asgn": 10.2, "CE_CP": 10.0, "ICS_CP": 10.0},
    "MAKARA BUSHAN": {"CE_A1": 10.65, "ICS_A1": 9.6, "CE_Asgn": 14.0, "ICS_Asgn": 10.2, "CE_CP": 9.0, "ICS_CP": 8.0},
    "AYUSH RAJ": {"CE_A1": 0.0, "ICS_A1": 0.0, "CE_Asgn": 0.0, "ICS_Asgn": 0.0, "CE_CP": 0.0, "ICS_CP": 0.0, "absent": True},
    "RASHMIKA": {"CE_A1": 10.95, "ICS_A1": 13.2, "CE_Asgn": 14.0, "ICS_Asgn": 11.0, "CE_CP": 8.0, "ICS_CP": 8.0},
    "VISHWAS": {"CE_A1": 12.9, "ICS_A1": 12.9, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 8.0},
    "DINESH SAI": {"CE_A1": 7.8, "ICS_A1": 9.9, "CE_Asgn": 13.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 9.0},
    "FELBIN": {"CE_A1": 10.85, "ICS_A1": 13.8, "CE_Asgn": 14.0, "ICS_Asgn": 15.0, "CE_CP": 9.0, "ICS_CP": 10.0}
}

# Helper to match name loosely
def find_match(target_name, raw_dict):
    t_clean = target_name.upper().strip()
    if t_clean in raw_dict:
        return raw_dict[t_clean]
    for k, v in raw_dict.items():
        if k in t_clean or t_clean in k:
            return v
    # Try individual parts
    parts = set(t_clean.split())
    for k, v in raw_dict.items():
        k_parts = set(k.split())
        if len(parts.intersection(k_parts)) >= 2:
            return v
    return None

# Build final verified dataset mapped by register number
verified_data = {
    "BBA": [],
    "BSCA": [],
    "BSCB": []
}

# 1. BBA
for s in store['subjects']['BBA_English']['students']:
    m = find_match(s['name'], bba_raw)
    if not m:
        raise ValueError(f"Unmatched BBA student: {s['name']}")
    verified_data["BBA"].append({
        "reg_no": s["reg_no"],
        "name": s["name"],
        "A1": m["A1"],
        "Asgn": m["Asgn"],
        "CP": m["CP"],
        "absent": m.get("absent", False)
    })

# 2. BSCA
for s in store['subjects']['BSCA_English']['students']:
    m = find_match(s['name'], bsca_raw)
    if not m:
        raise ValueError(f"Unmatched BSCA student: {s['name']}")
    verified_data["BSCA"].append({
        "reg_no": s["reg_no"],
        "name": s["name"],
        "CE_A1": m["CE_A1"],
        "ICS_A1": m["ICS_A1"],
        "CE_Asgn": m["CE_Asgn"],
        "ICS_Asgn": m["ICS_Asgn"],
        "CE_CP": m["CE_CP"],
        "ICS_CP": m["ICS_CP"],
        "absent": m.get("absent", False)
    })

# 3. BSCB
for s in store['subjects']['BSCB_English']['students']:
    m = find_match(s['name'], bscb_raw)
    if not m:
        raise ValueError(f"Unmatched BSCB student: {s['name']}")
    verified_data["BSCB"].append({
        "reg_no": s["reg_no"],
        "name": s["name"],
        "CE_A1": m["CE_A1"],
        "ICS_A1": m["ICS_A1"],
        "CE_Asgn": m["CE_Asgn"],
        "ICS_Asgn": m["ICS_Asgn"],
        "CE_CP": m["CE_CP"],
        "ICS_CP": m["ICS_CP"],
        "absent": m.get("absent", False),
        "ics_a1_absent": m.get("ics_a1_absent", False)
    })

with open("scratch/other_components_marks.json", "w", encoding="utf-8") as f:
    json.dump(verified_data, f, indent=2)

print(f"BBA matched: {len(verified_data['BBA'])} / 18")
print(f"BSCA matched: {len(verified_data['BSCA'])} / 31")
print(f"BSCB matched: {len(verified_data['BSCB'])} / 33")
