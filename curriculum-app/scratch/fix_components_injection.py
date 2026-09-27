import re
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = "if (!inline && match && match[1] === 'qrcode') {"

new_code = """                            if (!inline && match && match[1] === 'crisis-simulator') {
                              const lines = String(children).trim().split('\\n');
                              const question = lines.find((l: string) => l.startsWith('question:'))?.replace('question:', '').trim() || '';
                              const choices: any[] = [];
                              let currentChoice: any = {};
                              
                              lines.forEach((l: string) => {
                                if (l.startsWith('choice')) {
                                  if (currentChoice.text) choices.push(currentChoice);
                                  currentChoice = { text: l.substring(l.indexOf(':') + 1).trim() };
                                } else if (l.startsWith('isCorrect')) {
                                  currentChoice.isCorrect = l.substring(l.indexOf(':') + 1).trim() === 'true';
                                } else if (l.startsWith('reason')) {
                                  currentChoice.reason = l.substring(l.indexOf(':') + 1).trim();
                                }
                              });
                              if (currentChoice.text) choices.push(currentChoice);

                              return <CrisisSimulator question={question} choices={choices} />;
                            }
                            if (!inline && match && match[1] === 'anatomy-widget') {
                              const lines = String(children).trim().split('\\n');
                              const image = lines.find((l: string) => l.startsWith('image:'))?.replace('image:', '').trim() || '';
                              const hotspots: any[] = [];
                              
                              const hotspotMap: any = {};
                              lines.forEach((l: string) => {
                                const m = l.match(/^hotspot(\\d+)_(x|y|title|desc):\\s*(.*)$/);
                                if (m) {
                                  const id = m[1];
                                  const key = m[2];
                                  const val = m[3];
                                  if (!hotspotMap[id]) hotspotMap[id] = {};
                                  if (key === 'x' || key === 'y') hotspotMap[id][key] = parseFloat(val);
                                  else hotspotMap[id][key] = val;
                                }
                              });
                              Object.values(hotspotMap).forEach(hs => hotspots.push(hs));

                              return <AnatomyWidget image={image} hotspots={hotspots} />;
                            }
                            if (!inline && match && match[1] === 'qrcode') {"""

content = content.replace(old_code, new_code)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\SlideViewer.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
