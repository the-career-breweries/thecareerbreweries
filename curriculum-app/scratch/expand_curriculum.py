import re

file_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\curriculum.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_sem1_block = """  // Sem 1 (Weeks 1-15)
  { week: 1, semester: 1, level: 1, theme: 'The Johari Window', focus: 'Self-awareness, blind spots', task: 'Self-profile worksheet', rubric: 'Insight' },
  { week: 2, semester: 1, level: 1, theme: 'The Manager\\'s Presence', focus: 'PREP Method, Confidence', task: 'Structured pitch', rubric: 'Structure' },
  { week: 3, semester: 1, level: 1, theme: 'The Absurd & Abstract', focus: 'Spontaneous speaking', task: 'Art Interpretation', rubric: 'Fluency' },
  { week: 4, semester: 1, level: 1, theme: 'The Ultimate Debate', focus: 'PREP + STAR in Action', task: 'Group Debate', rubric: 'Persuasion' },
  { week: 5, semester: 1, level: 1, theme: 'The Art of the Apology', focus: 'HEART Model, De-escalation', task: 'Crisis Role-Play', rubric: 'Empathy' },
  { week: 6, semester: 1, level: 1, theme: 'Non-Verbal Dominance', focus: 'Kinesics, Proxemics', task: 'Silent Interview', rubric: 'Body Language' },
  { week: 7, semester: 1, level: 1, theme: 'The Mayday Scenario', focus: 'Crisis Communication', task: 'Team Coordination', rubric: 'Clarity' },
  { week: 8, semester: 1, level: 1, theme: 'Active vs. Passive Listening', focus: 'Filtering noise, Empathy', task: 'Listening Drill', rubric: 'Attention' },
  { week: 9, semester: 1, level: 1, theme: 'Mid-Sem Interactive Recap', focus: 'Terminal Walkthrough', task: 'Rapid-fire Role-play', rubric: 'Recall' },
  { week: 10, semester: 1, level: 1, theme: 'The Pre-Flight Briefing', focus: 'Meeting Etiquette', task: 'Mock Briefing', rubric: 'Tone' },
  { week: 11, semester: 1, level: 1, theme: 'Introduction to GD', focus: 'The Fishbowl', task: 'Basic GD', rubric: 'Turn-taking' },
  { week: 12, semester: 1, level: 1, theme: 'The Ethical Trolley Problem', focus: 'Advanced GD', task: 'Complex Scenario', rubric: 'Logic' },
  { week: 13, semester: 1, level: 1, theme: 'Cross-Cultural Sensitivity', focus: 'The Global Passenger', task: 'Case Study', rubric: 'Awareness' },
  { week: 14, semester: 1, level: 1, theme: 'The 60-Second Elevator Pitch', focus: 'Self-selling', task: 'Elevator Pitch', rubric: 'Conciseness' },
  { week: 15, semester: 1, level: 1, theme: 'Terminal Day Simulation', focus: 'Final Simulation', task: 'Full Role-Play', rubric: 'Overall Performance' },"""

# We need to replace the block from `// Sem 1 (Weeks 1-4)` down to the end of week 4
pattern = r'  // Sem 1 \(Weeks 1-4\).*?(?=  // Sem 2)'

updated_content = re.sub(pattern, new_sem1_block + '\n\n', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Updated curriculum.ts to expand Semester 1 to 15 weeks.")
