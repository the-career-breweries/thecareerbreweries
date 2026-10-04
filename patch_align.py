with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

style_injection = """
      <style dangerouslySetInnerHTML={{__html: `
        .markdown-content-container h1,
        .markdown-content-container h2,
        .markdown-content-container h3,
        .markdown-content-container p,
        .markdown-content-container li {
          text-align: center;
        }
      `}} />
      
      {slides.length > 0 && ("""

content = content.replace('{slides.length > 0 && (', style_injection)

with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
