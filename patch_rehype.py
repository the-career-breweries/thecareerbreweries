import re

with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import rehypeRaw from 'rehype-raw';
import_marker = "import remarkGfm from 'remark-gfm';"
content = content.replace(import_marker, import_marker + "\nimport rehypeRaw from 'rehype-raw';")

# Add to ReactMarkdown
react_md_marker = "remarkPlugins={[remarkGfm]}"
content = content.replace(react_md_marker, react_md_marker + "\n                      rehypePlugins={[rehypeRaw]}")

with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
