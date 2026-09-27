import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the cinematic background block
cinematic_block = """                  {cinematicBgUrl && (
                    <div className="cinematic-bg-container">
                      {isVideoBg ? (
                        <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
                      ) : (
                        <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
                      )}
                      <div className="cinematic-bg-overlay" />
                    </div>
                  )}"""

# Remove it from slide-body
content = content.replace(cinematic_block, "")

# Add it just before slide-container
new_cinematic_block = """
        {cinematicBgUrl && (
          <div className="cinematic-bg-container">
            {isVideoBg ? (
              <video src={cinematicBgUrl} autoPlay loop muted playsInline className="cinematic-bg-media" />
            ) : (
              <img src={cinematicBgUrl} alt="Cinematic Background" className="cinematic-bg-media" />
            )}
            <div className="cinematic-bg-overlay" />
          </div>
        )}
"""

content = content.replace(
    '<div className="slide-container">',
    new_cinematic_block + '        <div className="slide-container">'
)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
