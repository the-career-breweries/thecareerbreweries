import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

load_voices_replacement = '''const allVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
          const usVoice = allVoices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-US');
          const gbVoice = allVoices.find(v => v.lang === 'en-GB' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-GB');
          const inVoice = allVoices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-IN');
          
          const uniqueVoices = [];
          if (usVoice) uniqueVoices.push(usVoice);
          else uniqueVoices.push({ voiceURI: 'fallback-us', lang: 'en-US', name: 'American English pronunciation' } as any);
          
          if (gbVoice) uniqueVoices.push(gbVoice);
          else uniqueVoices.push({ voiceURI: 'fallback-gb', lang: 'en-GB', name: 'British English pronunciation' } as any);
          
          if (inVoice) uniqueVoices.push(inVoice);
          else uniqueVoices.push({ voiceURI: 'fallback-in', lang: 'en-IN', name: 'Indian English pronunciation' } as any);
          
          setVoices(uniqueVoices);
          if (uniqueVoices.length > 0 && !selectedVoiceURI) {
            const defaultVoice = inVoice || gbVoice || usVoice || uniqueVoices[0];
            if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
          }'''

# Replace the block inside loadVoices
content = re.sub(
    r'const allVoices = window\.speechSynthesis\.getVoices\(\).*?if \(defaultVoice\) setSelectedVoiceURI\(defaultVoice\.voiceURI\);\n\s*\}',
    load_voices_replacement,
    content,
    flags=re.DOTALL
)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
