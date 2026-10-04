import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove animation styles
style_new = """        @keyframes talkMouth {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(3.5); }
        }
        .speaking-mouth {
          animation: talkMouth 0.15s infinite alternate ease-in-out;
          transform-origin: 60px 65px;
        }"""
content = content.replace(style_new, "")

# Remove className={isSpeaking ? "speaking-mouth" : ""}
svg_old = """<path className={isSpeaking ? "speaking-mouth" : ""} d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill={isSpeaking ? "#202124" : "white"} stroke="#202124" strokeWidth="2" />"""
svg_new = """<path d="M 30 65 Q 60 75 90 65 Q 60 85 30 65" fill={isSpeaking ? "#202124" : "white"} stroke="#202124" strokeWidth="2" />"""
content = content.replace(svg_old, svg_new)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
