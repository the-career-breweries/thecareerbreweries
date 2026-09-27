import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isEditing state
content = content.replace(
    "const [isIdle, setIsIdle] = useState(false);",
    "const [isIdle, setIsIdle] = useState(false);\n  const [isEditing, setIsEditing] = useState(false);\n  const [editingContent, setEditingContent] = useState('');"
)

# Add Save/Edit logic and textarea to the renderer
renderer_block = """                  {slides.length > 0 && (
                    <div className={`markdown-content-container ${cinematicBgUrl ? 'subtitle-mode' : ''}`} style={{ position: 'relative', width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: cinematicBgUrl ? 'flex-end' : 'flex-start', paddingTop: '2rem', paddingBottom: '4rem', zIndex: 1 }}>
                      {isEditing ? (
                        <div style={{ width: '100%', height: '60vh', background: 'rgba(0,0,0,0.8)', padding: '2rem', borderRadius: '1rem', zIndex: 60, position: 'relative' }}>
                          <textarea 
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            style={{ width: '100%', height: '100%', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem', fontFamily: 'monospace', fontSize: '1.2rem' }}
                          />
                          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={async () => {
                              const updatedSlides = [...slides];
                              updatedSlides[currentSlide] = editingContent;
                              setSlides(updatedSlides);
                              setIsEditing(false);
                              try {
                                const newContent = updatedSlides.join('\\n\\n---\\n\\n');
                                await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent }) });
                              } catch (e) { console.error(e); }
                            }} style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>
                          </div>
                        </div>
                      ) : (
                        <ReactMarkdown """

content = re.sub(
    r'\{slides\.length > 0 && \(\s*<div className=\{`markdown-content-container \$\{cinematicBgUrl \? \'subtitle-mode\' : \'\'\}`\} style=\{\{ position: \'relative\', width: \'100%\', minHeight: \'100%\', display: \'flex\', flexDirection: \'column\', alignItems: \'center\', justifyContent: cinematicBgUrl \? \'flex-end\' : \'flex-start\', paddingTop: \'2rem\', paddingBottom: \'4rem\', zIndex: 1 \}\}>\s*<ReactMarkdown',
    renderer_block,
    content
)

# Replace <ReactMarkdown ... /> with <ReactMarkdown ... /> )} (close the ternary)
content = re.sub(
    r'(<ReactMarkdown.*?/>)\s*</div>\s*\)',
    r'\1\n                      )}\n                    </div>\n                  )',
    content,
    flags=re.DOTALL
)

# Add Edit Slide button
edit_btn = """<button onClick={() => {
                        setEditingContent(slides[currentSlide]);
                        setIsEditing(true);
                      }} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <Sparkles size={20} />
                        Edit Slide Content
                      </button>"""

content = content.replace(
    "<Upload size={20} />\n                      Upload Asset to Slide\n                    </button>",
    "<Upload size={20} />\n                      Upload Asset to Slide\n                    </button>\n                    " + edit_btn
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
