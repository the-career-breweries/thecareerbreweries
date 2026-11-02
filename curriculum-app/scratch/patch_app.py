path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx'
content = open(path, 'r', encoding='utf-8').read()

old = """              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#e5e7eb' }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#e5e7eb'}>Home</span>"""

new = """              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', fontWeight: '600', color: '#e5e7eb' }}>
                <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = '#e5e7eb'}>Home</span>
                <Link href="/soft-skills/topics" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Topics</Link>
                <Link href="/soft-skills/topics/list-of-activities" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Activities</Link>
                <Link href="/soft-skills/topics/englishscore" style={{ color: '#e5e7eb', textDecoration: 'none' }}>EnglishScore</Link>
                <Link href="/soft-skills/sessions-tracker" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Tracker</Link>
                <Link href="/soft-skills/students" style={{ color: '#e5e7eb', textDecoration: 'none' }}>Students</Link>"""

if old in content:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.replace(old, new, 1))
    print('Successfully patched SoftSkillsApp.tsx')
else:
    print('Target not found')
