import re

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the face graphic entirely
face_regex = r'\{/\* Right Face Graphic.*?</svg>\n\s*</div>'
content = re.sub(face_regex, '', content, flags=re.DOTALL)

# Hide dictionary timeout error from user, just log it
dict_error_regex = r'if \(err\.name === \'AbortError\'\) \{\n\s*setDictError\("Dictionary API is taking too long to respond right now\."\);\n\s*\} else \{\n\s*setDictError\("Dictionary API is currently unavailable \(network error\)\."\);\n\s*\}'
replacement = 'if (err.name === \'AbortError\') {\n         console.warn("Dictionary API is taking too long to respond right now.");\n      } else {\n         console.warn("Dictionary API is currently unavailable (network error).");\n      }'
content = re.sub(dict_error_regex, replacement, content, flags=re.DOTALL)

with open('curriculum-app/src/components/RandomTopicGenerator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
