import re

with open('curriculum-app/src/components/SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_block = """if (!inline && match && match[1] === 'topic-generator') {
                          const customTopics = String(children).trim().split('\\n').map(t => t.trim()).filter(t => t.length > 0);
                          return <RandomTopicGenerator customTopics={customTopics} mode="debate" />;
                        }
                        if (!inline && match && match[1] === 'pronunciation-wheel') {
                          const customTopics = String(children).trim().split('\\n').map(t => t.trim()).filter(t => t.length > 0);
                          return <RandomTopicGenerator customTopics={customTopics} mode="pronunciation" />;
                        }"""

old_block = """if (!inline && match && match[1] === 'topic-generator') {
                          const customTopics = String(children).trim().split('\\n').map(t => t.trim()).filter(t => t.length > 0);
                          return <RandomTopicGenerator customTopics={customTopics} />;
                        }"""

content = content.replace(old_block, new_block)

with open('curriculum-app/src/components/SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated SlideViewer.tsx')
