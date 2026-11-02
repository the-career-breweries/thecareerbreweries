import json

students = json.load(open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\aviation-students.json', encoding='utf-8'))
tendencies = ['Seeker', 'Learner', 'Leader', 'Inquisitive']
cefr_levels = ['A1', 'A2', 'B1', 'B2']

enriched = []
for i, s in enumerate(students):
    t = tendencies[i % len(tendencies)]
    level = 'A2' if i % 3 == 0 else ('B1' if i % 2 == 0 else 'A1')
    score = 220 + (i * 5) % 280
    slug_name = s['name'].lower().replace(' ', '-')
    enriched.append({
        'slNo': s.get('slNo', i+1),
        'rollNo': s['rollNo'],
        'name': s['name'],
        'program': 'B.Sc Aviation',
        'section': 'Section A' if i < 32 else 'Section B',
        'dominantTendency': t,
        'secondaryTendency': tendencies[(i+1) % len(tendencies)],
        'englishScoreBaseline': {
            'score': score,
            'cefr': level,
            'testDate': '2026-10-15',
            'hasScreenshot': True
        },
        'englishScoreDecember': {
            'score': None,
            'cefr': None,
            'testDate': None,
            'hasScreenshot': False
        },
        'linkedIn': {
            'hasProfile': i % 4 != 0,
            'profileUrl': f'https://linkedin.com/in/{slug_name}',
            'photoInUniform': i % 3 != 0,
            'socialMediaCleaned': True
        },
        'groomingStatus': {
            'week1Check': 'PASS',
            'week4Check': 'PASS' if i % 5 != 0 else 'PENDING',
            'notes': 'Uniform compliant; neat hair.'
        },
        'actionPlan': {
            'nonVerbalFix': 'Avoid shifting weight between feet while standing',
            'pacingFix': 'Introduce 2-second pause before answering instead of saying "uh"',
            'contentFix': 'Anchor strengths with one concrete team incident'
        }
    })

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\softskills-students.json', 'w', encoding='utf-8') as f:
    json.dump(enriched, f, indent=2)

print(f'Wrote {len(enriched)} enriched students.')
