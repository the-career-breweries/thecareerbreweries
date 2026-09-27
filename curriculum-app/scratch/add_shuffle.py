import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Shuffle to imports if not there
if "Shuffle" not in content[:1000]:
    content = content.replace("Play, Pause , Plus } from 'lucide-react'", "Play, Pause , Plus, Shuffle } from 'lucide-react'")

old_buttons = """                      <button onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                        <Upload size={20} />
                        Upload Asset to Slide
                      </button>"""

new_buttons = """                      <button onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
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

content = content.replace(old_buttons, new_buttons)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
