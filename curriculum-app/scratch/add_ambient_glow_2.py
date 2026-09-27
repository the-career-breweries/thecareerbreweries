import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

old_bg = """          {cinematicBgUrl && (
          <div className="cinematic-bg-container">
            {isVideoBg ? (
              <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
            ) : (
              <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
            )}
            <div className="cinematic-bg-overlay" />
          </div>
        )}"""

# I will use a regex to be safe
pattern = r'\{cinematicBgUrl && \(\s*<div className="cinematic-bg-container">\s*\{isVideoBg \? \(\s*<video src=\{cinematicBgUrl\} autoPlay loop muted playsInline className="cinematic-bg-media" />\s*\) : \(\s*<img src=\{cinematicBgUrl\} alt="Cinematic Background" className="cinematic-bg-media" />\s*\)\}\s*<div className="cinematic-bg-overlay" />\s*</div>\s*\)\}'

new_bg = """{cinematicBgUrl && (
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
        )}"""

tsx = re.sub(pattern, new_bg, tsx, flags=re.DOTALL)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx)
