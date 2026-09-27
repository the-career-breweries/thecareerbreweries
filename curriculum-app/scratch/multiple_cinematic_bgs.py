import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the extraction logic
old_extraction = """    // Extract Cinematic Background URL
    const currentSlideContent = slides[currentSlide] || '';
    const cinematicBgMatch = currentSlideContent.match(/<!-- CINEMATIC_BG: (.*?) -->/);
    const cinematicBgUrl = cinematicBgMatch ? cinematicBgMatch[1].trim() : null;
    const isVideoBg = cinematicBgUrl && (cinematicBgUrl.endsWith('.mp4') || cinematicBgUrl.endsWith('.webm'));"""

new_extraction = """    // Extract Cinematic Background URLs (supports multiple)
    const currentSlideContent = slides[currentSlide] || '';
    const cinematicBgMatches = Array.from(currentSlideContent.matchAll(/<!-- CINEMATIC_BG: (.*?) -->/g));
    const cinematicBgUrls = cinematicBgMatches.map(m => m[1].trim());"""

content = content.replace(old_extraction, new_extraction)

# 2. Update the rendering logic
old_render = """        {cinematicBgUrl && (
          <div className="cinematic-bg-container">
            {/* Ambient Glow */}
            {isVideoBg ? (
              <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media ambient-glow" />
            ) : (
              <img src={cinematicBgUrl} alt="" className="cinematic-bg-media ambient-glow" />
            )}
            {/* Sharp Foreground Image */}
            {isVideoBg ? (
              <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
            ) : (
              <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
            )}
            <div className="cinematic-bg-overlay" />
          </div>
        )}
        <div className="slide-container" style={cinematicBgUrl ? { background: "transparent", border: "none", boxShadow: "none" } : {}}>"""

new_render = """        {cinematicBgUrls.length > 0 && (
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
        )}
        <div className="slide-container" style={cinematicBgUrls.length > 0 ? { background: "transparent", border: "none", boxShadow: "none" } : {}}>"""

content = content.replace(old_render, new_render)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
