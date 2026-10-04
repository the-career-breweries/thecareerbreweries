import re

file_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the Success state UI
old_success_ui = """        uploadedUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upload Successful!</h3>
            <p style={{ color: '#4b5563', margin: 0 }}>Your file has been safely stored in Cloudinary.</p>
              <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '8px', border: '1px solid #10b981', width: '100%', fontSize: '0.9rem', fontWeight: '500' }}>
                ??? Magic Action: This asset has been automatically inserted into your current slide and permanently saved to the codebase!
              </div>
            
            <div style={{ width: '100%', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '8px' }}>
              
              <code style={{ display: 'block', padding: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '6px', textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                {assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${uploadedUrl} -->` : assetType === 'image' ? `<!-- CINEMATIC_BG: ${uploadedUrl} -->` : `![Activity Asset](${uploadedUrl})`}
              </code>
            </div>
            
            <button onClick={handleReset} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}>
              Upload Another Asset
            </button>
          </div>
        )"""

new_success_ui = """        uploadedUrls.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Upload Successful!</h3>
            <p style={{ color: '#4b5563', margin: 0 }}>{uploadedUrls.length} file(s) safely stored in Cloudinary.</p>
              <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '8px', border: '1px solid #10b981', width: '100%', fontSize: '0.9rem', fontWeight: '500' }}>
                ✨ Magic Action: Slides generated and permanently saved to the codebase!
              </div>
            
            <button onClick={handleReset} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}>
              Upload More Assets
            </button>
          </div>
        )"""

# In case the string matching is fuzzy (e.g. `???` vs emoji), use regex
content = re.sub(r'uploadedUrl \? \([\s\S]*?\) \: \!assetType', new_success_ui + ' : !assetType', content)

# Replace the Upload input state UI
old_input_ui_pattern = r'<div style=\{\{ display: \'flex\', flexDirection: \'column\', gap: \'16px\' \}\}>[\s\S]*?<\/div>\s*?\)\}'
new_input_ui = """<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={handleReset} style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>← Back</button>
              <span style={{ fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>Uploading {assetType}</span>
            </div>
            
            <label style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', backgroundColor: files.length > 0 ? '#eff6ff' : '#f8fafc', borderColor: files.length > 0 ? '#3b82f6' : '#cbd5e1', cursor: 'pointer', transition: 'all 0.2s' }}>
              <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} accept={assetType === 'image' || assetType === 'gif' ? 'image/*' : assetType === 'video' ? 'video/*' : '*/*'} />
              {files.length === 0 ? (
                <>
                  <UploadCloud size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#334155', margin: '0 0 8px 0' }}>Click to browse and select multiple files</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Maximum file size 50MB</p>
                </>
              ) : (
                <>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>{files.length} file(s) selected</h3>
                  <p style={{ color: '#3b82f6', fontSize: '0.9rem', margin: 0 }}>Ready to upload</p>
                </>
              )}
            </label>

            {files.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <label style={{ fontWeight: '600', color: '#334155' }}>Assets per slide:</label>
                <select 
                  value={assetsPerSlide} 
                  onChange={(e) => setAssetsPerSlide(Number(e.target.value))}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600', backgroundColor: 'white', cursor: 'pointer' }}
                >
                  <option value={1}>1 Asset per slide</option>
                  <option value={2}>2 Assets per slide</option>
                  <option value={3}>3 Assets per slide</option>
                </select>
              </div>
            )}

            <button 
              onClick={handleUpload} 
              disabled={files.length === 0 || uploading}
              style={{ backgroundColor: files.length === 0 ? '#94a3b8' : '#2563eb', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem', cursor: files.length === 0 || uploading ? 'not-allowed' : 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {uploading ? (
                <>Uploading {files.length} file(s)...</>
              ) : (
                'Confirm Upload'
              )}
            </button>
          </div>
        )}"""

content = re.sub(r'<div style=\{\{ display: \'flex\', flexDirection: \'column\', gap: \'16px\' \}\}>[\s\S]*?<\/div>\n\s*?\)\}', new_input_ui, content)

# Now update the usage of AssetUploadModal in SlideViewer to use onSlidesGenerated
old_usage = """          <AssetUploadModal 
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
          />"""

new_usage = """          <AssetUploadModal 
            isOpen={isUploadModalOpen} 
            onClose={() => setIsUploadModalOpen(false)} 
            onSlidesGenerated={async (newSlides) => {
               const updatedSlides = [...slides];
               
               if (updatedSlides[currentSlide] === "# New Slide\\n\\nAdd content here...") {
                   updatedSlides.splice(currentSlide, 1, ...newSlides);
               } else {
                   updatedSlides.splice(currentSlide + 1, 0, ...newSlides);
               }
               
               setSlides(updatedSlides);
               
               try {
                 const newContent = updatedSlides.join('\\n\\n---\\n\\n');
                 await fetch('/api/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program, stream, semester, week: weekData.week, course, content: newContent }) });
               } catch (e) { console.error(e); }
            }}
          />"""

content = content.replace(old_usage, new_usage)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
