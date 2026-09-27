import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to keep sessionProgress ONLY for StreamingDashboard
# Let's fix WelcomeScreen
content = content.replace('theme={theme}\n                  sessionProgress={sessionProgress}\n            onClose={() => {\n              setShowOrientation(false);', 'theme={theme}\n            onClose={() => {\n              setShowOrientation(false);')

# Let's fix SlideViewer
content = content.replace('theme={theme}\n                  sessionProgress={sessionProgress}\n                  onClose={() => setActiveLesson(null)}', 'theme={theme}\n                  onClose={() => setActiveLesson(null)}')

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SoftSkillsApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
