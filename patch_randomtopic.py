import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isSpeaking state
state_match = "const [isSlowMode, setIsSlowMode] = useState<boolean>(false);"
new_state = state_match + "\n  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);"
content = content.replace(state_match, new_state)

# 2. Update loadVoices to deduplicate
load_voices_old = """        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
          setVoices(availableVoices);
          if (availableVoices.length > 0 && !selectedVoiceURI) {
            // Default to an Indian English voice if available, else standard UK or US
            const defaultVoice = availableVoices.find(v => v.lang === 'en-IN') || availableVoices.find(v => v.lang === 'en-GB') || availableVoices[0];
            if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
          }
        };"""

load_voices_new = """        const loadVoices = () => {
          const allVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
          const usVoice = allVoices.find(v => v.lang === 'en-US' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-US');
          const gbVoice = allVoices.find(v => v.lang === 'en-GB' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-GB');
          const inVoice = allVoices.find(v => v.lang === 'en-IN' && v.name.includes('Google')) || allVoices.find(v => v.lang === 'en-IN');
          
          // Deduplicate and remove undefined
          const uniqueVoices = [usVoice, gbVoice, inVoice].filter(Boolean) as SpeechSynthesisVoice[];
          
          setVoices(uniqueVoices);
          if (uniqueVoices.length > 0 && !selectedVoiceURI) {
            const defaultVoice = inVoice || gbVoice || usVoice;
            if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
          }
        };"""
content = content.replace(load_voices_old, load_voices_new)

# 3. Add onstart and onend to utterance
play_pron_old = """      utterance.rate = isSlowMode ? 0.5 : 1.0;
      window.speechSynthesis.speak(utterance);
    };"""

play_pron_new = """      utterance.rate = isSlowMode ? 0.5 : 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };"""
content = content.replace(play_pron_old, play_pron_new)

# 4. Add the animation styles and update SVG
style_old = """      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />"""

style_new = """      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes talkMouth {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(3.5); }
        }
        .speaking-mouth {
          animation: talkMouth 0.15s infinite alternate ease-in-out;
          transform-origin: 60px 65px;
        }
      `}} />"""
content = content.replace(style_old, style_new)

svg_old = """<path d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill="white" stroke="#202124" strokeWidth="2" />"""
svg_new = """<path className={isSpeaking ? "speaking-mouth" : ""} d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill={isSpeaking ? "#202124" : "white"} stroke="#202124" strokeWidth="2" />"""
content = content.replace(svg_old, svg_new)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
