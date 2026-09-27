import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\{isAdmin && \(\s*<AssetUploadModal\s*isOpen=\{isUploadModalOpen\}\s*onClose=\{\(\) => setIsUploadModalOpen\(false\)\}\s*currentSlideContent=\{slides\[currentSlide\] \|\| \'\'\}\s*/>\s*\)\}'

replacement = """{isAdmin && (
          <AssetUploadModal 
            isOpen={isUploadModalOpen} 
            onClose={() => setIsUploadModalOpen(false)} 
            onSnippetGenerated={async (snippet) => {
               const updatedSlides = [...slides];
               if (updatedSlides[currentSlide] === "# New Slide\\n\\nAdd content here...") {
                   updatedSlides[currentSlide] = snippet;
               } else {
                   updatedSlides[currentSlide] = updatedSlides[currentSlide] + "\\n\\n" + snippet;
               }
               setSlides(updatedSlides);
               try {
                 const newContent = updatedSlides.join('\\n\\n---\\n\\n');
                 await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent }) });
               } catch (e) { console.error(e); }
            }}
          />
        )}"""

content = re.sub(pattern, replacement, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
