import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Plus to lucide-react imports
content = content.replace(
    "} from 'lucide-react';",
    ", Plus } from 'lucide-react';"
)

# Replace the single button with a div containing two buttons and the add slide logic
admin_buttons_block = """                {isAdmin && (
                  <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem', zIndex: 50 }}>
                    <button onClick={async () => {
                      const updatedSlides = [...slides];
                      updatedSlides.splice(currentSlide + 1, 0, "# New Slide\\n\\nAdd content here...");
                      setSlides(updatedSlides);
                      setCurrentSlide(currentSlide + 1);
                      try {
                        const newContent = updatedSlides.join('\\n\\n---\\n\\n');
                        await fetch('/api/lesson', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent })
                        });
                      } catch (e) {
                        console.error('Failed to add slide', e);
                      }
                    }} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                      <Plus size={20} />
                      Add Slide Here
                    </button>
                    
                    <button onClick={() => setIsUploadModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                      <Upload size={20} />
                      Upload Asset to Slide
                    </button>
                  </div>
                )}"""

content = re.sub(
    r'\{isAdmin && \(\s*<button onClick=\{\(\) => setIsUploadModalOpen\(true\)\}.*?<Upload size=\{20\} \/>.*?Upload Asset to Slide.*?</button>\s*\)\}',
    admin_buttons_block,
    content,
    flags=re.DOTALL
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
