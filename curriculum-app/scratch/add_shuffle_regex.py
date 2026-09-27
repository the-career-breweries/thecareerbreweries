import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<button onClick=\{\(\) => setIsUploadModalOpen\(true\)\} style=\{\{[^\}]*\}\}>\s*<Upload size=\{20\} />\s*Upload Asset to Slide\s*</button>'

replacement = """<button onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <Upload size={20} />
                        Upload Asset to Slide
                      </button>
                      
                      {cinematicBgUrls.length > 1 && (
                         <button onClick={async () => {
                            const updatedSlides = [...slides];
                            let slideContent = updatedSlides[currentSlide];
                            
                            const tagPattern = /<!-- CINEMATIC_BG: (.*?) -->/g;
                            const tags = Array.from(slideContent.matchAll(tagPattern)).map(m => m[0]);
                            
                            const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
                            
                            let tagIndex = 0;
                            slideContent = slideContent.replace(tagPattern, () => {
                               const replacement = shuffledTags[tagIndex];
                               tagIndex++;
                               return replacement;
                            });
                            
                            updatedSlides[currentSlide] = slideContent;
                            setSlides(updatedSlides);
                            
                            try {
                              const newContent = updatedSlides.join('\\n\\n---\\n\\n');
                              await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent }) });
                            } catch (e) { console.error(e); }
                         }} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#8b5cf6', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                           <Shuffle size={20} />
                           Shuffle Gallery
                         </button>
                      )}"""

content = re.sub(pattern, replacement, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
