import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Modify AssetUploadModal props
content = content.replace(
    "const AssetUploadModal = ({ isOpen, onClose, currentSlideContent }: { isOpen: boolean, onClose: () => void, currentSlideContent: string }) => {",
    "const AssetUploadModal = ({ isOpen, onClose, onSnippetGenerated }: { isOpen: boolean, onClose: () => void, onSnippetGenerated: (snippet: string) => void }) => {"
)

# Modify handleUpload to call onSnippetGenerated
handle_upload_old = """        if (data.secure_url) {
          setUploadedUrl(data.secure_url);
        } else {"""
handle_upload_new = """        if (data.secure_url) {
          setUploadedUrl(data.secure_url);
          const snippet = assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${data.secure_url} -->` : assetType === 'image' ? `<!-- CINEMATIC_BG: ${data.secure_url} -->` : `![Activity Asset](${data.secure_url})`;
          onSnippetGenerated(snippet);
        } else {"""
content = content.replace(handle_upload_old, handle_upload_new)

# Modify Upload Successful text
success_text_old = """<p style={{ color: '#4b5563', margin: 0 }}>Your file has been safely stored in Cloudinary.</p>"""
success_text_new = """<p style={{ color: '#4b5563', margin: 0 }}>Your file has been safely stored in Cloudinary.</p>
              <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '8px', border: '1px solid #10b981', width: '100%', fontSize: '0.9rem', fontWeight: '500' }}>
                ✨ Magic Action: This asset has been automatically inserted into your current slide and permanently saved to the codebase!
              </div>"""
content = content.replace(success_text_old, success_text_new)

# Modify SlideViewer render of AssetUploadModal
modal_render_old = """        {isAdmin && (
          <AssetUploadModal 
            isOpen={isUploadModalOpen} 
            onClose={() => setIsUploadModalOpen(false)} 
            currentSlideContent={slides[currentSlide] || ''}
          />
        )}"""

modal_render_new = """        {isAdmin && (
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

content = content.replace(modal_render_old, modal_render_new)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
