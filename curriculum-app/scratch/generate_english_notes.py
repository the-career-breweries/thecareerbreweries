import json

path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# English Content Generation
english_notes = {
    "3": {
      "keyConcepts": [{"title": "Synonyms & Antonyms", "explanation": "Words with similar and opposite meanings, used to enhance vocabulary and avoid repetition."}, {"title": "Aviation Technical Vocab", "explanation": "Industry-specific terminology critical for precise and safe communication in aviation."}],
      "definitions": [{"term": "Synonym", "definition": "A word or phrase that means exactly or nearly the same as another word or phrase."}, {"term": "Antonym", "definition": "A word opposite in meaning to another."}, {"term": "Jargon", "definition": "Special words or expressions that are used by a particular profession or group and are difficult for others to understand."}],
      "mnemonic": {"acronym": "VAC", "points": ["V - Vocabulary", "A - Accuracy", "C - Context"]},
      "btlQuestions": {"Remember": "Define synonym and antonym.", "Understand": "Explain why standard phraseology is important in aviation.", "Apply": "Use three aviation terms correctly in a sentence.", "Analyze": "Differentiate between general English and aviation English.", "Evaluate": "Assess the impact of misinterpreting technical jargon.", "Create": "Draft a short radio transmission using correct aviation vocabulary."},
      "referenceMaterial": {"primary": "Aviation English by Henry Emery & Andy Roberts", "further": "Wren & Martin, Chapter on Vocabulary"}
    },
    "4": {
      "keyConcepts": [{"title": "Skimming", "explanation": "Reading rapidly in order to get a general overview of the material."}, {"title": "Scanning", "explanation": "Reading rapidly in order to find specific facts or keywords."}],
      "definitions": [{"term": "Comprehension", "definition": "The action or capability of understanding something read or heard."}, {"term": "Inference", "definition": "A conclusion reached on the basis of evidence and reasoning from the text."}],
      "mnemonic": {"acronym": "SQ3R", "points": ["S - Survey", "Q - Question", "R - Read", "R - Recite", "R - Review"]},
      "btlQuestions": {"Remember": "List the steps of the SQ3R method.", "Understand": "Explain the difference between skimming and scanning.", "Apply": "Skim a provided METAR report to find the general weather condition.", "Analyze": "Identify the author's tone in a given passage.", "Evaluate": "Determine the reliability of a given technical bulletin.", "Create": "Formulate three comprehension questions for a text."},
      "referenceMaterial": {"primary": "Wren & Martin, Comprehension Section", "further": "Aviation Safety Reports for practical reading"}
    },
    "5": {
      "keyConcepts": [{"title": "Professional Formatting", "explanation": "The standard layout and structure expected in business communications (emails, letters, reports)."}, {"title": "Tone & Register", "explanation": "The level of formality and attitude conveyed through word choice in writing."}],
      "definitions": [{"term": "Salutation", "definition": "A standard formula of words used in a letter to address the person being written to."}, {"term": "Sign-off", "definition": "The concluding phrase of an email or letter (e.g., Yours sincerely)."}],
      "mnemonic": {"acronym": "KISS", "points": ["K - Keep", "I - It", "S - Short &", "S - Simple"]},
      "btlQuestions": {"Remember": "State the standard components of a professional email.", "Understand": "Explain when to use 'Yours faithfully' vs 'Yours sincerely'.", "Apply": "Draft an email requesting sick leave.", "Analyze": "Identify the tonal errors in a poorly written business letter.", "Evaluate": "Critique a peer's incident report for clarity.", "Create": "Write a formal incident report regarding a baggage delay."},
      "referenceMaterial": {"primary": "Oxford Guide to Effective Writing and Speaking", "further": "Wren & Martin, Composition Section"}
    },
    "6": {
      "keyConcepts": [{"title": "Pronunciation & Enunciation", "explanation": "The correct articulation of words to ensure clarity, especially over radio or PA systems."}, {"title": "Active Listening", "explanation": "Fully concentrating, understanding, responding, and remembering what is being said."}],
      "definitions": [{"term": "Articulation", "definition": "The formation of clear and distinct sounds in speech."}, {"term": "Intonation", "definition": "The rise and fall of the voice in speaking, conveying emotion or grammatical structure."}],
      "mnemonic": {"acronym": "HEAR", "points": ["H - Hear the message", "E - Empathize", "A - Analyze", "R - Respond"]},
      "btlQuestions": {"Remember": "Define active listening.", "Understand": "Explain how intonation changes the meaning of a sentence.", "Apply": "Demonstrate a PA announcement with clear articulation.", "Analyze": "Identify barriers to effective listening in a noisy environment.", "Evaluate": "Assess a role-play partner's clarity and pronunciation.", "Create": "Design a role-play script for handling a passenger complaint."},
      "referenceMaterial": {"primary": "Aviation English", "further": "TED Talks on Effective Speaking"}
    },
    "7": {
      "keyConcepts": [{"title": "The 7 Cs of Communication", "explanation": "Principles for effective communication: Clear, Concise, Concrete, Correct, Coherent, Complete, Courteous."}, {"title": "Barriers to Communication", "explanation": "Obstacles (physical, psychological, semantic) that prevent accurate transmission of messages."}],
      "definitions": [{"term": "Semantic Barrier", "definition": "Misunderstanding arising from the different meanings that words can have."}, {"term": "Conciseness", "definition": "Giving a lot of information clearly and in a few words; brief but comprehensive."}],
      "mnemonic": {"acronym": "7 Cs", "points": ["C - Clear", "C - Concise", "C - Concrete", "C - Correct", "C - Coherent", "C - Complete", "C - Courteous"]},
      "btlQuestions": {"Remember": "List the 7 Cs of communication.", "Understand": "Explain what constitutes a psychological barrier.", "Apply": "Rewrite a wordy email to be concise.", "Analyze": "Determine which of the 7 Cs is missing in a given vague message.", "Evaluate": "Argue the importance of courtesy in crisis communication.", "Create": "Develop a checklist for overcoming physical barriers in an airport."},
      "referenceMaterial": {"primary": "Business Communication Today", "further": "Soft Skills Manual"}
    },
    "8": {
      "keyConcepts": [{"title": "Body Language (Kinesics)", "explanation": "The conscious and unconscious movements and postures by which attitudes and feelings are communicated."}, {"title": "Eye Contact & Posture", "explanation": "Critical non-verbal cues that establish trust, confidence, and professionalism."}],
      "definitions": [{"term": "Kinesics", "definition": "The study of the way in which certain body movements and gestures serve as a form of non-verbal communication."}, {"term": "Proxemics", "definition": "The study of human use of space and the effects that population density has on behavior, communication, and social interaction."}],
      "mnemonic": {"acronym": "SOFTEN", "points": ["S - Smile", "O - Open posture", "F - Forward lean", "T - Touch (handshake)", "E - Eye contact", "N - Nod"]},
      "btlQuestions": {"Remember": "Define proxemics.", "Understand": "Explain how crossed arms can be interpreted by a passenger.", "Apply": "Demonstrate the SOFTEN technique in a greeting.", "Analyze": "Contrast the body language of confidence vs defensive behavior.", "Evaluate": "Critique a silent role-play based solely on non-verbal cues.", "Create": "Design a training module for ground staff on approachable posture."},
      "referenceMaterial": {"primary": "The Definitive Book of Body Language", "further": "Aviation Customer Service guidelines"}
    },
    "9": {
      "keyConcepts": [{"title": "Consolidated Grammar & Vocab", "explanation": "A comprehensive review of the foundational language structures covered in the first half of the semester."}, {"title": "Application of Skills", "explanation": "Integrating reading, writing, and speaking skills into practical communication tasks."}],
      "definitions": [{"term": "Revision", "definition": "The act of reviewing previously studied material to reinforce learning."}, {"term": "Integration", "definition": "The combination of multiple linguistic skills (e.g., listening and writing simultaneously)."}],
      "mnemonic": {"acronym": "CAP", "points": ["C - Comprehension", "A - Accuracy", "P - Practice"]},
      "btlQuestions": {"Remember": "Recall the 8 parts of speech.", "Understand": "Summarize the key differences between skimming and scanning.", "Apply": "Apply grammar rules to correct a series of mixed-error sentences.", "Analyze": "Analyze your own progress and identify areas needing improvement.", "Evaluate": "Assess the effectiveness of different revision techniques.", "Create": "Formulate a personalized study plan for the finals."},
      "referenceMaterial": {"primary": "Course Notes Sessions 1-8", "further": "Previous quizzes and worksheets"}
    },
    "10": {
      "keyConcepts": [{"title": "Turn-Taking & Moderation", "explanation": "The polite and structured flow of conversation in a group setting, ensuring all voices are heard."}, {"title": "Summarization", "explanation": "The ability to accurately synthesize the group's diverse points into a cohesive conclusion."}],
      "definitions": [{"term": "Group Discussion (GD)", "definition": "A communicative situation that allows its participants to share their views and opinions with other participants."}, {"term": "Moderator", "definition": "A person who presides over a discussion and ensures it stays on topic."}],
      "mnemonic": {"acronym": "LEAD", "points": ["L - Listen actively", "E - Encourage others", "A - Assert your points politely", "D - Drive to a conclusion"]},
      "btlQuestions": {"Remember": "State the role of a moderator in a GD.", "Understand": "Explain why turn-taking is critical in a professional discussion.", "Apply": "Use a polite phrase to interrupt a dominating speaker.", "Analyze": "Identify the distinct roles naturally assumed by participants in a GD.", "Evaluate": "Critique a mock GD for its adherence to constructive debate.", "Create": "Formulate an opening statement for a GD on aviation sustainability."},
      "referenceMaterial": {"primary": "Soft Skills Manual - GD Strategies", "further": "Mock GD evaluation sheets"}
    },
    "11": {
      "keyConcepts": [{"title": "Structuring a Presentation", "explanation": "Organizing content logically using an Introduction, Body, and Conclusion."}, {"title": "Visual Aids", "explanation": "Using slides, charts, or props effectively without them overshadowing the speaker."}],
      "definitions": [{"term": "Hook", "definition": "An engaging opening statement designed to capture the audience's attention immediately."}, {"term": "Transition", "definition": "A word, phrase, or sentence that smoothly connects one topic or slide to the next."}],
      "mnemonic": {"acronym": "PREP", "points": ["P - Point", "R - Reason", "E - Example", "P - Point (reiterate)"]},
      "btlQuestions": {"Remember": "List the three main sections of a presentation.", "Understand": "Explain the rule of 6x6 for presentation slides.", "Apply": "Draft a 'hook' for a presentation on airport security.", "Analyze": "Compare a highly textual slide vs a highly visual slide.", "Evaluate": "Assess the effectiveness of a peer's use of visual aids.", "Create": "Design a 3-minute mini-presentation on a technical topic."},
      "referenceMaterial": {"primary": "Presentation Zen by Garr Reynolds", "further": "Toastmasters International Guide"}
    },
    "12": {
      "keyConcepts": [{"title": "Overcoming Stage Fright", "explanation": "Techniques such as deep breathing, preparation, and positive visualization to manage public speaking anxiety."}, {"title": "Audience Engagement", "explanation": "Using eye contact, rhetorical questions, and modulation to keep the audience interested."}],
      "definitions": [{"term": "Extempore", "definition": "Spoken or done without preparation; impromptu."}, {"term": "Modulation", "definition": "Variation in the strength, tone, or pitch of one's voice."}],
      "mnemonic": {"acronym": "BEE", "points": ["B - Breathe", "E - Eye contact", "E - Engage"]},
      "btlQuestions": {"Remember": "Name two physical symptoms of stage fright.", "Understand": "Explain how preparation reduces speech anxiety.", "Apply": "Deliver a 1-minute extempore speech on a random topic.", "Analyze": "Determine which vocal modulations emphasize key points.", "Evaluate": "Review a recorded speech and critique the speaker's engagement.", "Create": "Develop a personal routine to calm nerves before speaking."},
      "referenceMaterial": {"primary": "Talk Like TED by Carmine Gallo", "further": "Public Speaking workshops"}
    },
    "13": {
      "keyConcepts": [{"title": "Global Awareness", "explanation": "Understanding and respecting cultural differences in communication styles, norms, and taboos."}, {"title": "Sensitivity & Adaptability", "explanation": "Modifying one's communication approach to be inclusive and easily understood by diverse nationalities."}],
      "definitions": [{"term": "Ethnocentrism", "definition": "Evaluation of other cultures according to preconceptions originating in the standards and customs of one's own culture."}, {"term": "High-Context Culture", "definition": "Cultures that rely heavily on non-verbal and subtle situational cues in communication."}],
      "mnemonic": {"acronym": "RICE", "points": ["R - Respect", "I - Inquire", "C - Communicate clearly", "E - Empathize"]},
      "btlQuestions": {"Remember": "Define a high-context culture.", "Understand": "Explain why idiomatic expressions should be avoided in cross-cultural communication.", "Apply": "Adapt a standard airline greeting for an international flight.", "Analyze": "Analyze a scenario where a cultural misunderstanding led to a service failure.", "Evaluate": "Assess your own cultural biases.", "Create": "Design a brief cultural sensitivity guide for new cabin crew."},
      "referenceMaterial": {"primary": "The Culture Map by Erin Meyer", "further": "Aviation Cross-Cultural manuals"}
    },
    "14": {
      "keyConcepts": [{"title": "Self-Introduction", "explanation": "Crafting a concise, professional summary of one's background, skills, and goals (the 'Elevator Pitch')."}, {"title": "Common Interview Questions", "explanation": "Preparing structured answers for behavioral and situational questions."}],
      "definitions": [{"term": "STAR Method", "definition": "A technique to answer behavioral questions by detailing the Situation, Task, Action, and Result."}, {"term": "Elevator Pitch", "definition": "A short description of an idea, product, or company that explains the concept in a way such that any listener can understand it in a short period of time."}],
      "mnemonic": {"acronym": "STAR", "points": ["S - Situation", "T - Task", "A - Action", "R - Result"]},
      "btlQuestions": {"Remember": "What does STAR stand for?", "Understand": "Explain the purpose of the 'Tell me about yourself' question.", "Apply": "Use the STAR method to answer: 'Describe a time you solved a problem'.", "Analyze": "Deconstruct a job description to anticipate likely interview questions.", "Evaluate": "Critique a peer's self-introduction for relevance and impact.", "Create": "Draft a comprehensive 60-second self-introduction."},
      "referenceMaterial": {"primary": "Cracking the Interview", "further": "Career Services handouts"}
    },
    "15": {
      "keyConcepts": [{"title": "Real-Time Practice", "explanation": "Simulating the pressure and environment of a real interview to test preparation and reflexes."}, {"title": "Constructive Feedback", "explanation": "Receiving and applying critiques on body language, content, and delivery."}],
      "definitions": [{"term": "Mock Interview", "definition": "An emulation of a job interview used for training purposes."}, {"term": "Constructive Criticism", "definition": "Providing well-reasoned opinions about the work of others, usually in a friendly and positive manner."}],
      "mnemonic": {"acronym": "ACT", "points": ["A - Assess", "C - Correct", "T - Try again"]},
      "btlQuestions": {"Remember": "List three areas typically evaluated in an interview.", "Understand": "Explain how to professionally accept constructive criticism.", "Apply": "Participate in a peer-to-peer mock interview.", "Analyze": "Identify your primary weak point during the mock session.", "Evaluate": "Grade a peer's interview performance using a standard rubric.", "Create": "Formulate a personalized action plan to improve interview skills before graduation."},
      "referenceMaterial": {"primary": "Mock Interview Rubric", "further": "Recorded interview sessions for self-review"}
    }
}

for key, val in english_notes.items():
    data["Communicative English"][key] = val

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
