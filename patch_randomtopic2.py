import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getVoices
content = re.sub(
    r'const availableVoices = window\.speechSynthesis\.getVoices\(\)\.filter.*?setVoices\(availableVoices\);.*?if \(defaultVoice\) setSelectedVoiceURI\(defaultVoice\.voiceURI\);\n\s*\}',
    r'''const allVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
          const usVoice = allVoices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-US');
          const gbVoice = allVoices.find(v => v.lang === 'en-GB' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-GB');
          const inVoice = allVoices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-IN');
          const uniqueVoices = [usVoice, gbVoice, inVoice].filter(Boolean) as SpeechSynthesisVoice[];
          setVoices(uniqueVoices);
          if (uniqueVoices.length > 0 && !selectedVoiceURI) {
            const defaultVoice = inVoice || gbVoice || usVoice;
            if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
          }''',
    content,
    flags=re.DOTALL
)

# Replace speak
content = re.sub(
    r'utterance\.rate = isSlowMode \? 0\.5 : 1\.0;\n\s*window\.speechSynthesis\.speak\(utterance\);',
    r'''utterance.rate = isSlowMode ? 0.5 : 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);''',
    content
)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
