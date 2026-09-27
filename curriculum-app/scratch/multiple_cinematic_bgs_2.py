import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'// Extract Cinematic Background URL\s*const currentSlideContent = slides\[currentSlide\] \|\| \'\';\s*const cinematicBgMatch = currentSlideContent\.match\(/<!-- CINEMATIC_BG: \(\.\*\?\) -->/\);\s*const cinematicBgUrl = cinematicBgMatch \? cinematicBgMatch\[1\]\.trim\(\) : null;\s*const isVideoBg = cinematicBgUrl && \(cinematicBgUrl\.endsWith\(\'\.mp4\'\) \|\| cinematicBgUrl\.endsWith\(\'\.webm\'\)\);'

replacement = """// Extract Cinematic Background URLs
    const currentSlideContent = slides[currentSlide] || '';
    const cinematicBgMatches = Array.from(currentSlideContent.matchAll(/<!-- CINEMATIC_BG: (.*?) -->/g));
    const cinematicBgUrls = cinematicBgMatches.map(m => m[1].trim());"""

content = re.sub(pattern, replacement, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
