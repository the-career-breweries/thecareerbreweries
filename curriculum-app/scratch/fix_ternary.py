with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_closing = """                      .replace(/<!-- WELCOME_ANIMATIONS -->/g, '')}
                    </ReactMarkdown>
                  </div>
                )}"""

good_closing = """                      .replace(/<!-- WELCOME_ANIMATIONS -->/g, '')}
                    </ReactMarkdown>
                    )}
                  </div>
                )}"""

content = content.replace(bad_closing, good_closing)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
