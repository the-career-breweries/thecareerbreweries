with open('curriculum-app/src/components/RandomTopicGeneratorOld.tsx', 'r', encoding='utf-16') as f:
    content = f.read()

start = content.find('{/* Mode Debate Render */}')
end = content.find('{/* Mode Pronunciation Render */}')
print(content[start:end])
