import os
import re

with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = """const WritingTopicActivity = ({ data }: { data: string }) => {
  const lines = data.trim().split('\\n');
  const getVal = (key: string) => lines.find(l => l.startsWith(key + ':'))?.replace(key + ':', '').trim() || '';

  const title = getVal('title');
  const type = getVal('type');
  const rawInstructions = lines.filter(l => l.startsWith('* ')).map(l => l.replace(/^\\* /, ''));

  const typeIcons: Record<string, string> = {
    paragraph: '📝', letter: '📧', report: '📄', email: '📩'
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', border: '2px solid #bfdbfe', borderRadius: '16px', padding: '2rem', margin: '1.5rem 0', textAlign: 'center', width: '100%', maxWidth: '100%', boxSizing: 'border-box', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e40af', marginBottom: '1.5rem' }}>
        {typeIcons[type] || '📝'} {title || `Activity: Write a ${type || 'Paragraph'}`}
      </h2>

      {rawInstructions.length > 0 && (
        <div style={{ textAlign: 'left', background: 'white', borderRadius: '10px', padding: '1rem 1.5rem', border: '1px solid #bfdbfe', width: '100%', boxSizing: 'border-box', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          <p style={{ fontWeight: '700', color: '#1d4ed8', marginBottom: '0.5rem' }}>Instructions:</p>
          <ol style={{ paddingLeft: '1.2rem', margin: 0, whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
            {rawInstructions.map((inst, i) => (
              <li key={i} style={{ color: '#374151', marginBottom: '4px', whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: inst.replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="color:#1d4ed8">$1</strong>') }} />
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
"""

# Regex to match the component
new_code = re.sub(
    r'const WritingTopicActivity = \(\{ data \}: \{ data: string \}\) => \{[\s\S]*?return \([\s\S]*?\}\);?\s*\n\};\n',
    replacement,
    code
)

if code == new_code:
    print('Failed to replace WritingTopicActivity')
else:
    with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print('Updated WritingTopicActivity in SlideViewer.tsx')

# We should also replace the `pre` behavior for components in ReactMarkdown because the pre tag overrides the width.
# In SlideViewer.tsx, markdownComponents is defined.
pre_override = """const markdownComponents = React.useMemo(() => ({
  pre({ node, children, ...props }: any) {
    const isCustom = node?.children?.[0]?.properties?.className?.some?.((c: string) => c.startsWith('language-'));
    if (isCustom) {
      return <div className="custom-component-wrapper" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>{children}</div>;
    }
    return <pre {...props} style={{ maxWidth: '100%', overflowX: 'auto' }}>{children}</pre>;
  },
  code({ node, inline, className, children, ...props }: any) {"""

new_code_2 = new_code.replace("const markdownComponents = React.useMemo(() => ({\n                      code({ node, inline, className, children, ...props }: any) {", pre_override)

if new_code == new_code_2:
    print("Failed to replace markdownComponents")
else:
    with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
        f.write(new_code_2)
    print('Updated markdownComponents in SlideViewer.tsx')

