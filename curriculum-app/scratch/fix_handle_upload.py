import re

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'if \(data\.secure_url\) \{\s*setUploadedUrl\(data\.secure_url\);\s*\} else \{'

replacement = """if (data.secure_url) {
          setUploadedUrl(data.secure_url);
          const snippet = assetType === 'video' ? `<!-- CINEMA_CLIFFHANGER: ${data.secure_url} -->` : assetType === 'image' ? `<!-- CINEMATIC_BG: ${data.secure_url} -->` : `![Activity Asset](${data.secure_url})`;
          onSnippetGenerated(snippet);
        } else {"""

content = re.sub(pattern, replacement, content)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
