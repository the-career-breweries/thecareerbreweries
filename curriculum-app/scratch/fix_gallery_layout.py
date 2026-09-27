import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_render = """        {cinematicBgUrls.length > 0 && (
          <div className="cinematic-bg-container" style={{ display: 'flex', width: '100vw', height: '100vh', gap: '2rem', padding: '0' }}>
            {/* Ambient Glows */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', zIndex: -1 }}>
               {cinematicBgUrls.map((url, i) => {
                 const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                 return isVideo ? (
                    <video key={`glow-${i}`} src={url} autoPlay loop muted playsInline className="ambient-glow" style={{ flex: 1, objectFit: 'cover' }} />
                 ) : (
                    <img key={`glow-${i}`} src={url} alt="" className="ambient-glow" style={{ flex: 1, objectFit: 'cover' }} />
                 );
               })}
            </div>
            
            {/* Sharp Foreground Images */}
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: '2rem', zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {cinematicBgUrls.map((url, i) => {
                   const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                   return isVideo ? (
                      <video key={`sharp-${i}`} src={url} autoPlay loop muted playsInline style={{ flex: 1, height: '100%', objectFit: 'contain', minWidth: 0 }} />
                   ) : (
                      <img key={`sharp-${i}`} src={url} alt="Cinematic Background" style={{ flex: 1, height: '100%', objectFit: 'contain', minWidth: 0 }} />
                   );
                })}
            </div>
            <div className="cinematic-bg-overlay" />
          </div>
        )}"""


new_render = """        {cinematicBgUrls.length > 0 && (
          <div className="cinematic-bg-container" style={{ display: 'flex', width: '100vw', height: '100vh', gap: '2rem', padding: '0' }}>
            {/* Ambient Glows */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', zIndex: -1, overflow: 'hidden' }}>
               {cinematicBgUrls.map((url, i) => {
                 const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                 return isVideo ? (
                    <video key={`glow-${i}`} src={url} autoPlay loop muted playsInline style={{ flex: 1, objectFit: 'cover', filter: 'blur(80px) brightness(0.5)', transform: 'scale(1.2)' }} />
                 ) : (
                    <img key={`glow-${i}`} src={url} alt="" style={{ flex: 1, objectFit: 'cover', filter: 'blur(80px) brightness(0.5)', transform: 'scale(1.2)' }} />
                 );
               })}
            </div>
            
            {/* Sharp Foreground Images */}
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: '4rem', padding: '4rem', zIndex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {cinematicBgUrls.map((url, i) => {
                   const isVideo = url.endsWith('.mp4') || url.endsWith('.webm');
                   return isVideo ? (
                      <video key={`sharp-${i}`} src={url} autoPlay loop muted playsInline style={{ flex: 1, height: '100%', objectFit: 'contain', minWidth: 0 }} />
                   ) : (
                      <img key={`sharp-${i}`} src={url} alt="Cinematic Background" style={{ flex: 1, height: '100%', objectFit: 'contain', minWidth: 0 }} />
                   );
                })}
            </div>
            <div className="cinematic-bg-overlay" />
          </div>
        )}"""

content = content.replace(old_render, new_render)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
