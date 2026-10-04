import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

play_pron_replacement = '''      if (selectedVoiceURI) {
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) {
          if (!voice.voiceURI.startsWith('fallback-')) {
            utterance.voice = voice as SpeechSynthesisVoice;
          }
          utterance.lang = voice.lang;
        }
      } else {
        utterance.lang = 'en-IN'; 
      }'''

content = re.sub(
    r'if \(selectedVoiceURI\) \{.*?else \{\n\s*utterance\.lang = \'en-IN\'; \n\s*\}',
    play_pron_replacement,
    content,
    flags=re.DOTALL
)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
