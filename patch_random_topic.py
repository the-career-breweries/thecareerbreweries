import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r') as f:
    content = f.read()

# Add mode prop
content = content.replace('interface RandomTopicGeneratorProps {\n  customTopics?: string[];\n}', 'interface RandomTopicGeneratorProps {\n  customTopics?: string[];\n  mode?: "debate" | "pronunciation";\n}')
content = content.replace('export default function RandomTopicGenerator({ customTopics }: RandomTopicGeneratorProps = {}) {', 'export default function RandomTopicGenerator({ customTopics, mode = "debate" }: RandomTopicGeneratorProps = {}) {')

# Add playPronunciation function
play_func = """
  const playPronunciation = () => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(currentTopic);
    utterance.lang = 'en-IN'; // Indian English pronunciation like in screenshot
    window.speechSynthesis.speak(utterance);
  };
"""
content = content.replace("const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' ? customTopics : TOPICS;", play_func + "\n  const activeTopics = customTopics && customTopics.length > 0 && customTopics[0] !== 'spin' ? customTopics : TOPICS;")

# Replace bottom section
bottom_section_original = """<div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold' }}>
        <span style={{ color: '#ef4444' }}>FOR</span>
        <span>VS</span>
        <span style={{ color: '#22c55e' }}>AGAINST</span>
      </div>"""

bottom_section_new = """{mode === "debate" ? (
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span style={{ color: '#ef4444' }}>FOR</span>
          <span>VS</span>
          <span style={{ color: '#22c55e' }}>AGAINST</span>
        </div>
      ) : (
        <button 
          onClick={playPronunciation}
          disabled={isSpinning || currentTopic.includes("Click")}
          style={{
            marginTop: '1.5rem',
            background: 'white',
            color: '#1f2937',
            border: '2px solid #e5e7eb',
            padding: '0.75rem 2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: (isSpinning || currentTopic.includes("Click")) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            opacity: (isSpinning || currentTopic.includes("Click")) ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { if (!isSpinning && !currentTopic.includes("Click")) e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { if (!isSpinning && !currentTopic.includes("Click")) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          Pronounce Word
        </button>
      )}"""

content = content.replace(bottom_section_original, bottom_section_new)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w') as f:
    f.write(content)

print("Patched RandomTopicGenerator.tsx successfully.")
