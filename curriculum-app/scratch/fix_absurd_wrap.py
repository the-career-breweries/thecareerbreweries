import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AbsurdAbstract.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add whiteSpace and escape-subtitle class to root div
content = content.replace(
"""    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column'
    }}>""",
"""    <div className="escape-subtitle" style={{
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      border: '1px solid #f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    }}>"""
)

# And specifically to the question text
content = content.replace(
"""          <p style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', fontWeight: '600', lineHeight: '1.5' }}>""",
"""          <p style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', fontWeight: '600', lineHeight: '1.5', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>"""
)

# And specifically to the reveal text
content = content.replace(
"""              <p style={{ margin: 0, fontSize: '1.5rem', color: '#15803d', fontWeight: '700', lineHeight: '1.4' }}>""",
"""              <p style={{ margin: 0, fontSize: '1.5rem', color: '#15803d', fontWeight: '700', lineHeight: '1.4', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>"""
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\AbsurdAbstract.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
