import os

syllabus = {
  2: {'theme': 'Fundamentals of Grammar', 'focus': 'Parts of Speech, Tenses, Sentence Structure', 'task': 'Grammar Worksheets'},
  3: {'theme': 'Vocabulary Development', 'focus': 'Synonyms, Antonyms, Aviation Technical Vocab', 'task': 'Vocabulary Quizzes'},
  4: {'theme': 'Reading Skills', 'focus': 'Comprehension, Skimming, Scanning', 'task': 'Reading Analysis'},
  5: {'theme': 'Writing Skills', 'focus': 'Paragraphs, Letters, Reports, Emails', 'task': 'Drafting Professional Emails'},
  6: {'theme': 'Listening & Speaking', 'focus': 'Pronunciation, Conversation, Role Play', 'task': 'Role Play Scenarios'},
  7: {'theme': 'Effective Communication', 'focus': '7 Cs of Communication, Barriers', 'task': 'Case Study Analysis'},
  8: {'theme': 'Non-Verbal Communication', 'focus': 'Body language, eye contact, posture', 'task': 'Silent Role Play'},
  9: {'theme': 'Mid-Semester Recap', 'focus': 'Grammar, Vocab, Reading, Writing', 'task': 'Interactive Quiz & Revision'},
  10: {'theme': 'Group Discussions', 'focus': 'Initiation, summarization, turn-taking', 'task': 'Mock GD Session'},
  11: {'theme': 'Presentation Skills', 'focus': 'Structuring content, visual aids', 'task': '3-Minute Mini Presentation'},
  12: {'theme': 'Public Speaking', 'focus': 'Overcoming stage fright, engagement', 'task': 'Extempore Speaking'},
  13: {'theme': 'Cross-Cultural Communication', 'focus': 'Global awareness, sensitivity', 'task': 'Cultural Scenario Analysis'},
  14: {'theme': 'Interview Preparation', 'focus': 'Self-introduction, common questions', 'task': 'Drafting Interview Answers'},
  15: {'theme': 'Mock Interviews', 'focus': 'Real-time practice, feedback', 'task': 'Peer-to-Peer Mock Interview'}
}

base_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\english-lessons\ug'
streams = ['bsc-aviation', 'bba-aviation']

for stream in streams:
    sem1_dir = os.path.join(base_dir, stream, 'sem1')
    os.makedirs(sem1_dir, exist_ok=True)
    
    for week_num, data in syllabus.items():
        # Do not overwrite week1.md just to be safe
        if week_num == 1:
            continue
            
        topics = data['focus'].split(', ')
        
        slide_content = f"""# {data['theme']}
Welcome to Week {week_num}. Today we cover {data['focus']}.

![Week {week_num} Illustration](/images/english/placeholder.jpg)

---

# Agenda for Today

*   **Topic 1:** {topics[0] if len(topics) > 0 else 'Core Concept'}
*   **Topic 2:** {topics[1] if len(topics) > 1 else 'Deep Dive'}
*   **Topic 3:** {topics[2] if len(topics) > 2 else 'Practical Application'}
*   **Activity:** {data['task']}

---

# Introduction to {topics[0] if len(topics) > 0 else data['theme']}

Let's break down the foundational aspects of this topic.

*   **What is it?** This is a critical skill for professional communication.
*   **Why does it matter?** In the aviation industry, clarity and precision are non-negotiable.
*   **How do we use it?** We apply these principles in daily operational tasks.

---

# Deep Dive: {topics[1] if len(topics) > 1 else 'Exploring Further'}

Here we explore the nuances that differentiate good communicators from great ones.

*   **Key Aspect A:** Always ensure your message is tailored to your audience.
*   **Key Aspect B:** Avoid common pitfalls and barriers.
*   **Pro Tip:** Practice consistently to build muscle memory in your communication style.

---

# Activity: {data['task']}

```sentence-activity
Instructions:
Read the provided scenario carefully.
Apply the concepts we just discussed.
Work with your partner to complete the task.
```

*   *Remember:* The goal is progress, not perfection.
*   Take 10 minutes to complete this exercise.
"""
        
        file_path = os.path.join(sem1_dir, f'week{week_num}.md')
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(slide_content)

print("Generated engaging presentation placeholders for Week 2-15.")
