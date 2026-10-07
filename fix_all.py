import os
import re

files_to_clean = [
    r"curriculum-app\src\content\english-lessons\ug\bba-aviation\sem1\week5.md",
    r"curriculum-app\src\content\english-lessons\ug\bsc-aviation\sem1\week5.md",
    r"curriculum-app\src\content\english-lessons\ug\bba-aviation\sem1\week6.md",
    r"curriculum-app\src\content\english-lessons\ug\bsc-aviation\sem1\week6.md"
]

for f in files_to_clean:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Remove lines starting with *Methodology: 
        new_content = re.sub(r'^\*Methodology: .*?\*\n', '', content, flags=re.MULTILINE)
        
        if content != new_content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Removed methodologies from {f}")

# Now fix SlideViewer.tsx
with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_component = """const WritingTopicActivity = ({ data }: { data: string }) => {
  const lines = data.trim().split('\\n');
  const getVal = (key: string) => lines.find(l => l.startsWith(key + ':'))?.replace(key + ':', '').trim() || '';

  const title = getVal('title');
  const type = getVal('type');
  const rawInstructions = lines.filter(l => l.startsWith('* ')).map(l => l.replace(/^\\* /, ''));

  const typeIcons: Record<string, string> = {
    paragraph: '📝', letter: '📧', report: '📄', email: '📩'
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', border: '2px solid #bfdbfe', borderRadius: '16px', padding: '2rem', margin: '1.5rem 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e40af', marginBottom: '1.5rem' }}>
        {typeIcons[type] || '📝'} {title || `Activity: Write a ${type || 'Paragraph'}`}
      </h2>

      {rawInstructions.length > 0 && (
        <div style={{ textAlign: 'left', background: 'white', borderRadius: '10px', padding: '1rem 1.5rem', border: '1px solid #bfdbfe' }}>
          <p style={{ fontWeight: '700', color: '#1d4ed8', marginBottom: '0.5rem' }}>Instructions:</p>
          <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
            {rawInstructions.map((inst, i) => (
              <li key={i} style={{ color: '#374151', marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: inst.replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:#1d4ed8">$1</strong>') }} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};"""

# the emojis in the original code are mangled by the console output above (??????) 
# I will use a regex to match the component body safely.
new_component_code = re.sub(
    r'const WritingTopicActivity = \(\{ data \}: \{ data: string \}\) => \{.*?return \([\s\S]*?</div>\s*\);\s*\};',
    '''const WritingTopicActivity = ({ data }: { data: string }) => {
  const lines = data.trim().split('\\n');
  const getVal = (key: string) => lines.find(l => l.startsWith(key + ':'))?.replace(key + ':', '').trim() || '';

  const title = getVal('title');
  const type = getVal('type');
  const rawInstructions = lines.filter(l => l.startsWith('* ')).map(l => l.replace(/^\\* /, ''));

  const typeIcons: Record<string, string> = {
    paragraph: '📝', letter: '📧', report: '📄', email: '📩'
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', border: '2px solid #bfdbfe', borderRadius: '16px', padding: '2rem', margin: '1.5rem 0', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e40af', marginBottom: '1.5rem' }}>
        {typeIcons[type] || '📝'} {title || `Activity: Write a ${type || 'Paragraph'}`}
      </h2>

      {rawInstructions.length > 0 && (
        <div style={{ textAlign: 'left', background: 'white', borderRadius: '10px', padding: '1rem 1.5rem', border: '1px solid #bfdbfe', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontWeight: '700', color: '#1d4ed8', marginBottom: '0.5rem' }}>Instructions:</p>
          <ol style={{ paddingLeft: '1.2rem', margin: 0, whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {rawInstructions.map((inst, i) => (
              <li key={i} style={{ color: '#374151', marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: inst.replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:#1d4ed8">$1</strong>') }} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};''',
    code,
    flags=re.DOTALL
)

if code != new_component_code:
    with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
        f.write(new_component_code)
    print("Updated SlideViewer.tsx component")
else:
    print("Failed to replace component.")
