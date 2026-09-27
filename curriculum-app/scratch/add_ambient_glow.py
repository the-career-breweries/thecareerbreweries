import re

# 1. Update globals.css
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

ambient_css = """
.ambient-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover !important;
  filter: blur(60px) brightness(0.5);
  z-index: -1;
}
"""

css = css + ambient_css

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update SlideViewer.tsx
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

old_bg = """          <div className="cinematic-bg-container">
              {isVideoBg ? (
                <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
              ) : (
                <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
              )}
              <div className="cinematic-bg-overlay" />
            </div>"""

new_bg = """          <div className="cinematic-bg-container">
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
            </div>"""

tsx = tsx.replace(old_bg, new_bg)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx)
