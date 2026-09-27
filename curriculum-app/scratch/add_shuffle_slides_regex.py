import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'<button onClick=\{async \(\) => \{\s*const updatedSlides = \[\.\.\.slides\];\s*updatedSlides\.splice\(currentSlide \+ 1, 0, "# New Slide\\n\\nAdd content here\.\.\."\);\s*setSlides\(updatedSlides\);\s*setCurrentSlide\(currentSlide \+ 1\);\s*try \{\s*const newContent = updatedSlides\.join\(\'\\n\\n---\\n\\n\'\);\s*await fetch\(\'/api/lesson\', \{\s*method: \'POST\',\s*headers: \{ \'Content-Type\': \'application/json\' \},\s*body: JSON\.stringify\(\{ program, stream, semester, week: weekData\.week, course, content: newContent \}\)\s*\}\);\s*\} catch \(e\) \{\s*console\.error\(\'Failed to add slide\', e\);\s*\}\s*\}\} style=\{\{[^\}]*\}\}>\s*<Plus size=\{20\} />\s*Add Slide Here\s*</button>'

new_buttons = """<button onClick={async () => {
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
                      
                      {slides.length > 2 && (
                         <button onClick={async () => {
                            const updatedSlides = [...slides];
                            const firstSlide = updatedSlides.shift();
                            const shuffled = updatedSlides.sort(() => Math.random() - 0.5);
                            const finalSlides = [firstSlide, ...shuffled];
                            setSlides(finalSlides);
                            setCurrentSlide(0);
                            
                            try {
                              const newContent = finalSlides.join('\\n\\n---\\n\\n');
                              await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent }) });
                            } catch (e) { console.error(e); }
                         }} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#8b5cf6', color: 'white', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                           <Shuffle size={20} />
                           Shuffle All Slides
                         </button>
                      )}"""

content = re.sub(pattern, new_buttons, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
