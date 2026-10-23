export interface NonVerbalTechnique {
  id: string;
  title: string;
  badge: string;
  inspiration: string;
  trap: string;
  evaluatorThought: string;
  executionSteps: string[];
  microScriptOrCue: string;
  mantra: string;
}

export interface TrapDecoderCard {
  id: string;
  episode: string;
  question: string;
  trapA: string;
  trapB: string;
  interviewerSecretThought: string;
  hiddenTest: string;
  whiteCardScript: string;
  mantra: string;
}

export interface PronunciationWord {
  word: string;
  category: string;
  wrongPhonetic: string;
  rightPhonetic: string;
  audioText: string;
  tip: string;
  sampleSentence: string;
}

export interface SpeakingFramework {
  id: string;
  acronym: string;
  fullName: string;
  bestFor: string;
  steps: { letter: string; label: string; prompt: string; exampleLine: string }[];
  samplePrompt: string;
}

export const PILLAR_1_NON_VERBAL: NonVerbalTechnique[] = [
  {
    id: 'subtle-mirroring',
    title: 'The 2-Second Subtle Mirror',
    badge: 'Subconscious Persuasion',
    inspiration: 'Inspired by Interview Mirroring Psychology',
    trap: 'Sitting in rigid military stiffness with hands locked under the table—or worse, copying the interviewer immediately like a mime.',
    evaluatorThought: '"This candidate feels naturally on my wavelength. Conversation feels effortless—I like them."',
    executionSteps: [
      'Wait 2 to 3 seconds after the interviewer shifts posture before adjusting yours.',
      'Match their energy zone, not their exact limb (e.g., if they lean back casually, relax your shoulders; if they lean forward onto the desk, bring your forearms onto the table).',
      'Mirror their vocal tempo and volume within 10%—if they speak thoughtfully and slowly, drop your speed by one gear.'
    ],
    microScriptOrCue: 'Physical Cue: When the interviewer folds their hands on the desk and asks a thoughtful question, pause 2 seconds, rest your hands loosely in a steeple on the table, and match their calm cadence.',
    mantra: 'Match the energy, delay by two seconds, never mimic.'
  },
  {
    id: 'missy-eq-hook',
    title: 'The Observational EQ Hook (Reading the Room)',
    badge: 'First-10-Seconds Rapport',
    inspiration: 'Inspired by EQ vs. Pure IQ Dynamics',
    trap: 'Walking in like a robot—treating the interviewer like an automated grading machine and jumping straight into rehearsed textbook lines.',
    evaluatorThought: '"Finally, a candidate with situational awareness and emotional intelligence who actually notices the human on the other side of the table."',
    executionSteps: [
      'Read the clock and the interviewer’s fatigue level in the first 5 seconds (e.g., 4:30 PM after 30 campus interviews vs. 9:30 AM fresh panel).',
      'Use a genuine, brief human observation or warmth hook before launching into technical mode.',
      'Decode the subtext of questions rather than giving sterile, one-line literal answers.'
    ],
    microScriptOrCue: 'Verbal Hook (Late Afternoon Panel): "Good afternoon! I know I’m probably your 20th conversation today, so I’ll keep my energy sharp and my answers crisp for you."',
    mantra: 'Read the human first, answer the question second.'
  },
  {
    id: 'active-listening-cues',
    title: 'Exhibiting Active Listening via Non-Verbal Cues',
    badge: 'Executive Composure',
    inspiration: 'Active Listening & Micro-Signaling Protocol',
    trap: 'Doing the nervous "Rapid Triple-Nod" while the interviewer is still speaking, or staring blankly while mentally rehearsing your next line.',
    evaluatorThought: '"Rapid nodding tells me you want me to shut up so you can talk. A slow single nod tells me you are actually processing my words."',
    executionSteps: [
      'Replace rapid bobble-head nodding with the "Slow Single Nod" only when the speaker lands a key point.',
      'Use the "10-Degree Forward Tilt" + slight eyebrow lift when a complex question is asked to visually signal curiosity.',
      'Apply the "1.5-Second Cushion": Let 1.5 seconds of silence pass after the interviewer finishes before you speak, then echo 2–3 of their keywords.'
    ],
    microScriptOrCue: 'Verbal Echo Hint: "That’s an important distinction—especially what you mentioned about [repeat their keyword]. Here is how I approached that..."',
    mantra: 'Slow single nod, 10-degree lean, 1.5-second pause.'
  }
];

export const HOMETOWN_PRIDE_EXAMPLES = [
  {
    city: 'Nagpur',
    crownIdentity: 'the Tiger Capital of India and the heart of central India',
    sensoryCulture: 'world-famous fiery Saoji cuisine, iconic tarri poha, the finest oranges, and one of the fastest-growing coffee cultures',
    peopleBridge: 'if two people from Nagpur meet anywhere in the world, they become instant family—and that fierce loyalty and community warmth is exactly what I bring to any team I work with'
  },
  {
    city: 'Mysuru',
    crownIdentity: 'the Cultural & Heritage Capital of Karnataka that blends royal discipline with modern tech hubs',
    sensoryCulture: 'authentic filter coffee, melt-in-the-mouth Mysuru Pak, and tree-lined boulevards that teach you calm focus',
    peopleBridge: 'people from Mysuru are known for quiet grace paired with deep dependability—we don’t just make noise, we deliver consistently'
  },
  {
    city: 'Jaipur',
    crownIdentity: 'the Pink City where centuries of entrepreneurial trading heritage meet modern design',
    sensoryCulture: 'vibrant bazaars, kachoris at sunrise, and architecture built to last generations',
    peopleBridge: 'growing up in Jaipur teaches you hospitality and resourcefulness from day one—turning every stranger into a trusted relationship'
  }
];

export const PILLAR_2_CONVERSATION_FLOW = [
  {
    step: '1. The Echo (Validate)',
    desc: 'Catch the most interesting noun or emotion in the other person’s sentence and reflect it back warmly.',
    bad: '"Okay. Anyway, as I was saying about my project..."',
    good: '"Scaling a new team from 3 to 20 in six months sounds intense—especially keeping the culture intact."'
  },
  {
    step: '2. The Anchor (Relate)',
    desc: 'Drop a 1-sentence personal parallel or observation so it feels like a two-way human exchange, not an interrogation.',
    bad: '"Yes, I also like teamwork."',
    good: '"When I led our 18-member campus fest sponsorship cell, the hardest part wasn’t strategy—it was keeping everyone aligned in week three."'
  },
  {
    step: '3. The Bridge (Pass the Mic)',
    desc: 'Ask an open-ended "What" or "How" question that invites them to share an insight they are proud of.',
    bad: '"Do you have any more questions for me?"',
    good: '"What was the single biggest shift you made that helped that new team click?"'
  }
];

export const PILLAR_2_TRAP_DECODERS: TrapDecoderCard[] = [
  {
    id: 'ep1-intro',
    episode: 'Playbook Card 01 • The First Filter',
    question: '"Tell me about yourself."',
    trapA: 'Reading your CV out loud: "My name is X, I studied at Y college, I am from Z city, my CGPA is 8.4, thank you."',
    trapB: 'Rambling a 4-minute childhood biography with zero connection to the role.',
    interviewerSecretThought: '"I already have your CV sitting in front of me. I just heard this exact template from the person before you."',
    hiddenTest: 'Can you connect who you are, what you have built, and the exact value you bring to THIS chair in 45 seconds?',
    whiteCardScript: 'I have spent the last two years of my degree building and leading practical projects in [Your Domain]—including [1 High-Impact Project/Internship] where we solved [Specific Problem] under tight deadlines. I learned how to build outcomes from scratch, and I am now looking to bring that execution energy to a team that is scaling fast. That is why I am sitting in this chair today.',
    mantra: '45 seconds. No CV recitation. Start with value.'
  },
  {
    id: 'ep2-salary',
    episode: 'Playbook Card 02 • The Compensation Filter',
    question: '"What are your salary expectations?"',
    trapA: 'Quoting a number that is way too low out of fear of losing the offer.',
    trapB: 'Throwing out an inflated number with zero market basis, killing the conversation on the spot.',
    interviewerSecretThought: '"Do they actually know their market value and have they done their homework, or are they guessing out of desperation?"',
    hiddenTest: 'Information & composure. Flip the question politely to discover the band first; if pressed, anchor with a researched range.',
    whiteCardScript: 'Step 1 (The Polite Flip): "Before I share a number, could you share what the approved compensation band for this role looks like?"\n\nStep 2 (If They Insist You Go First): "I have researched what this role pays across the industry for my skill set in this city, and the range sits between ₹X LPA and ₹Y LPA. I am happy to find the right number within that band based on the total responsibilities."',
    mantra: 'Never negotiate out of desperation—negotiate with information.'
  },
  {
    id: 'ep3-why-hire',
    episode: 'Playbook Card 03 • The Differentiation Filter',
    question: '"Why should we hire you?"',
    trapA: 'Repeating generic adjectives: "I am hardworking, a quick learner, punctual, and a team player."',
    trapB: 'Summarizing your resume bullet points a second time.',
    interviewerSecretThought: '"Out of every candidate we met today, why are YOU the one who solves our problem better than anyone else?"',
    hiddenTest: 'Show you understand what they actually need + connect your specific proof + give 1 reason nobody else in the room can replicate.',
    whiteCardScript: 'Based on everything we have discussed today, you need someone who can take ownership of [Core Role Challenge] without needing weeks of hand-holding. I have done exactly that twice before—once during my [Internship/Capstone] with zero budget, and once while leading [Project/Initiative] from scratch. Both times, we delivered measurable results ahead of schedule. That is what I am bringing here.',
    mantra: 'You are not selling your past. You are solving their future.'
  },
  {
    id: 'ep5-weakness',
    episode: 'Playbook Card 04 • The Final Filter',
    question: '"Tell me your biggest weakness."',
    trapA: 'The 3 Big Red Flags (🚩 0 → 1 → 2 → 3: Instant Rejection):\n• Red Flag 1: "I take too much work because I want things done" (Interviewer: Is that really a weakness?)\n• Red Flag 2: "I care so much and work is my passion" (Interviewer: That is dodging the question.)\n• Red Flag 3: "Actually I am a perfectionist" + "I haven’t thought about weakness a lot" (Interviewer: Dishonest or completely unprepared → REJECTED).',
    trapB: 'Confessing a fatal core disqualifier: "I struggle with basic deadlines and I don’t like taking orders from managers."',
    interviewerSecretThought: '"Every time I hear ‘I take too much work’ or ‘I am a perfectionist,’ my internal Red Flag counter ticks up. I want to see if you have the self-awareness to admit a real operational flaw and the agency to fix it."',
    hiddenTest: 'Self-awareness, honesty, and behavioral reflection—can you identify where you fall short, share a real example of the cost, and explain how you actively correct it?',
    whiteCardScript: 'I have realized that I sometimes hesitate to delegate because I feel I can finish certain tasks faster myself.\n\nIn my previous role/project, I kept taking smaller tasks back from my team and ended up getting overloaded—and I realized I was also limiting their sense of ownership.\n\nSo now, I define ownership and success criteria upfront, and I consciously ask myself whether I genuinely need to do something myself before stepping in or taking it back from my team.',
    mantra: 'Real weakness. Real cost acknowledged. Real ownership defined.'
  }
];

export const PILLAR_3_PRONUNCIATION_WORDS: PronunciationWord[] = [
  {
    word: 'Pronunciation',
    category: 'Everyday Trap',
    wrongPhonetic: 'pro-NOUN-see-ay-shun',
    rightPhonetic: 'pruh-NUN-see-AY-shun',
    audioText: 'Pronunciation',
    tip: 'There is NO "noun" in the middle—it is NUN (like a nun), not NOUN.',
    sampleSentence: 'Clear pronunciation builds instant credibility in client meetings.'
  },
  {
    word: 'Resume (CV)',
    category: 'Interview Essential',
    wrongPhonetic: 'ree-ZOOM',
    rightPhonetic: 'REZ-oo-may',
    audioText: 'Résumé',
    tip: '"Ree-zoom" means to restart a paused video. Your CV is pronounced "REZ-oo-may".',
    sampleSentence: 'As you can see on my résumé, I led a four-member product team.'
  },
  {
    word: 'Wednesday',
    category: 'Scheduling & Calls',
    wrongPhonetic: 'WED-nes-day',
    rightPhonetic: 'WENZ-day',
    audioText: 'Wednesday',
    tip: 'The first "d" and second "e" are completely silent. Two syllables only: WENZ-day.',
    sampleSentence: 'Let us schedule the follow-up review for Wednesday afternoon.'
  },
  {
    word: 'Entrepreneur',
    category: 'Business & GD',
    wrongPhonetic: 'en-ter-pren-er / on-ter-pren-yoor',
    rightPhonetic: 'on-truh-pruh-NUR',
    audioText: 'Entrepreneur',
    tip: 'Starts with an "ON" sound (French origin), not "EN-ter".',
    sampleSentence: 'Thinking like an entrepreneur inside a company creates massive value.'
  },
  {
    word: 'Colleague',
    category: 'Workplace',
    wrongPhonetic: 'kuh-LEEG-yoo / KO-leeg',
    rightPhonetic: 'KOL-eeg',
    audioText: 'Colleague',
    tip: 'Stress the first syllable (KOL), and the "-ue" at the end is completely silent.',
    sampleSentence: 'My colleague and I co-authored the testing automation script.'
  },
  {
    word: 'Often',
    category: 'Everyday Trap',
    wrongPhonetic: 'OFF-ten (hard T)',
    rightPhonetic: 'OFF-uhn',
    audioText: 'Often',
    tip: 'Keep the "t" silent (just like "listen" and "soften") for smooth, natural flow.',
    sampleSentence: 'We often validate user feedback before writing a single line of code.'
  },
  {
    word: 'Subtle',
    category: 'Analytical & GD',
    wrongPhonetic: 'SUB-tul',
    rightPhonetic: 'SUT-uhl',
    audioText: 'Subtle',
    tip: 'The "b" is 100% silent—pronounce it exactly like "shuttle" with an S.',
    sampleSentence: 'There is a subtle but important difference between output and outcome.'
  },
  {
    word: 'Epitome',
    category: 'GD & Presentations',
    wrongPhonetic: 'EP-ee-tome',
    rightPhonetic: 'ih-PIT-uh-mee',
    audioText: 'Epitome',
    tip: 'Four syllables! It does NOT rhyme with "home"—it ends with "-mee".',
    sampleSentence: 'That campaign was the epitome of customer-first thinking.'
  },
  {
    word: 'Cache',
    category: 'Tech & Corporate',
    wrongPhonetic: 'KASH-ay',
    rightPhonetic: 'KASH',
    audioText: 'Cache',
    tip: 'Pronounced identically to "cash" (money). "Kash-ay" is a different word (cachet).',
    sampleSentence: 'Clearing the server cache reduced our page load latency by 40%.'
  },
  {
    word: 'Suite',
    category: 'Tech & Corporate',
    wrongPhonetic: 'SOOT',
    rightPhonetic: 'SWEET',
    audioText: 'Suite',
    tip: 'A software suite or C-suite is pronounced "SWEET", never "suit".',
    sampleSentence: 'We presented our findings to the C-suite and product leads.'
  },
  {
    word: 'Executive',
    category: 'Corporate Titles',
    wrongPhonetic: 'eks-ee-KYOO-tiv',
    rightPhonetic: 'ig-ZEK-yuh-tiv',
    audioText: 'Executive',
    tip: 'Stress lands on the second syllable: ig-ZEK-yuh-tiv.',
    sampleSentence: 'Every executive summary should start with the bottom-line conclusion.'
  },
  {
    word: 'Niche',
    category: 'Marketing & Strategy',
    wrongPhonetic: 'NITCH / NEESH-ay',
    rightPhonetic: 'NEESH',
    audioText: 'Niche',
    tip: 'Single syllable: "NEESH" (rhymes with "quiche"), no "-ay" at the end.',
    sampleSentence: 'Focusing on a specific student niche helped our project grow organically.'
  },
  {
    word: 'Genre',
    category: 'Icebreakers & Culture',
    wrongPhonetic: 'JEN-er / JON-er',
    rightPhonetic: 'ZHON-ruh',
    audioText: 'Genre',
    tip: 'Soft "zh" start (like "vision"), two clean syllables: ZHON-ruh.',
    sampleSentence: 'Non-fiction biographies are my favourite reading genre.'
  },
  {
    word: 'Itinerary',
    category: 'Operations & Logistics',
    wrongPhonetic: 'eye-TIN-er-ee',
    rightPhonetic: 'eye-TIN-uh-rer-ee',
    audioText: 'Itinerary',
    tip: 'Don’t swallow the middle syllable: eye-TIN-uh-rer-ee.',
    sampleSentence: 'I circulated the event itinerary to all twelve visiting speakers.'
  },
  {
    word: 'Liaison',
    category: 'Leadership & Roles',
    wrongPhonetic: 'lay-ZON',
    rightPhonetic: 'lee-AY-zon',
    audioText: 'Liaison',
    tip: 'Three syllables starting with "lee": lee-AY-zon.',
    sampleSentence: 'I acted as the student liaison between the placement cell and recruiters.'
  },
  {
    word: 'Mischievous',
    category: 'Vocabulary',
    wrongPhonetic: 'mis-CHEE-vee-us',
    rightPhonetic: 'MIS-chuh-vus',
    audioText: 'Mischievous',
    tip: 'Only 3 syllables (there is no second "i" after the "v"): MIS-chuh-vus.',
    sampleSentence: 'He gave a mischievous smile before asking the curveball question.'
  }
];

export const VOCAL_EXERCISES = [
  {
    id: 'box-breathing',
    title: '1. The 4-4-4-4 Diaphragmatic Pitch Drop',
    purpose: 'Eliminates shaky, high-pitched nervous voice 2 minutes before an interview or GD.',
    instructions: 'Inhale deeply into your belly for 4s → Hold for 4s → Exhale slowly through pursed lips for 4s → Hold empty for 4s. Your vocal cords relax and your pitch naturally drops by half an octave.',
    drillText: 'Hum gently on the exhale ("Mmmmm-ahhhh") to feel chest resonance instead of throat strain.'
  },
  {
    id: 'articulation-gym',
    title: '2. Plosive & Tongue-Tip Precision Drill',
    purpose: 'Stops mumbling and trailing off at the end of sentences.',
    instructions: 'Read the three drills below out loud by exaggerating the consonant endings (T, D, P, B, K). Run each line 3 times: first slow, then conversational, then brisk.',
    drillText: '• "Red leather, yellow leather, crisp clear metrics."\n• "Unique New York, specific strategic execution."\n• "Tip of the tongue, the teeth, and the lips—articulate every final consonant."'
  },
  {
    id: 'silent-power-pause',
    title: '3. The Silent Power Pause (Filler-Word Killer)',
    purpose: 'Replaces "umm", "ahh", "like", "basically", and "you know" with executive composure.',
    instructions: 'Whenever your brain is searching for the next thought, close your lips completely for 1.5 seconds instead of leaking a vocalized "ummm". To the listener, a 1.5-second silence looks like deep thoughtfulness.',
    drillText: 'Practice reading: "The biggest lesson I learned [PAUSE 1.5s] was that speed without clarity [PAUSE 1.5s] creates rework."'
  }
];

export const SPEAKING_FRAMEWORKS: SpeakingFramework[] = [
  {
    id: 'prep',
    acronym: 'P.R.E.P.',
    fullName: 'Point • Repeat/Reason • Example/Explanation • Point',
    bestFor: 'Impromptu interview questions, Group Discussions, and 60-second elevator opinions.',
    samplePrompt: '"Should AI tools be allowed in college exams and assignments?"',
    steps: [
      {
        letter: 'P',
        label: 'Point (Clear Opening Stance)',
        prompt: 'State your core position clearly in one crisp sentence.',
        exampleLine: 'AI tools should be integrated into college assignments, provided we shift evaluation from rote writing to critical defence.'
      },
      {
        letter: 'R',
        label: 'Repeat / Reason (Amplify the Why)',
        prompt: 'Reinforce your point by explaining the core reason behind it.',
        exampleLine: 'The reason is simple: in the modern workplace, graduates will be judged on how well they audit and direct AI, not whether they can memorize syntax without it.'
      },
      {
        letter: 'E',
        label: 'Example / Explanation (Concrete Proof)',
        prompt: 'Anchor your argument with a real example, data point, or scenario.',
        exampleLine: 'For example, when our department allowed AI co-pilots in our capstone project but added a 10-minute live architecture viva, project complexity doubled while plagiarism dropped.'
      },
      {
        letter: 'P',
        label: 'Point (Closing Loop)',
        prompt: 'Land the plane by restating your core point with conviction.',
        exampleLine: 'That is why regulating and grading how students use AI is far smarter than banning it.'
      }
    ]
  },
  {
    id: 'area',
    acronym: 'A.R.E.A.',
    fullName: 'Assertive • Reason • Evidence • Articulate',
    bestFor: 'High-conviction leadership questions, defending a decision, or standing out in HR/Panel rounds.',
    samplePrompt: '"Does CGPA actually matter when hiring fresh graduates?"',
    steps: [
      {
        letter: 'A',
        label: 'Assertive (Bold Opening Claim)',
        prompt: 'Take an unambiguous, confident stance without hedging ("I sort of think...").',
        exampleLine: 'CGPA is a useful baseline filter for consistency, but real-world problem ownership is the true predictor of workplace performance.'
      },
      {
        letter: 'R',
        label: 'Reason (Logical Mechanism)',
        prompt: 'Explain the underlying logic of why your assertion holds true.',
        exampleLine: 'Exams test how well you answer known questions with a syllabus, whereas corporate roles test how you navigate ambiguous problems with no textbook.'
      },
      {
        letter: 'E',
        label: 'Evidence (Undeniable Proof)',
        prompt: 'Provide a real observation, metric, or lived proof point.',
        exampleLine: 'In our campus placement cell data across 120 students, candidates who had shipped at least two live projects converted final interviews at twice the rate of high-CGPA peers without project proof.'
      },
      {
        letter: 'A',
        label: 'Articulate (Memorable Synthesis)',
        prompt: 'Close with a polished, quotable takeaway that lingers in the room.',
        exampleLine: 'In short: grades may get you into the interview room, but demonstrated execution is what earns you the offer.'
      }
    ]
  }
];

export const IMPROMPTU_TOPICS = [
  'Should companies mandate 5 days work-from-office for freshers?',
  'Is it better to start your career at a fast-growing startup or a Fortune 500 MNC?',
  'Will AI replace entry-level coding and analyst jobs, or transform them?',
  'Should soft skills and communication carry 30% weightage in engineering & degree curriculums?',
  'What is more valuable in a team: a brilliant solo performer or a reliable collaborator?',
  'Tell me about a time you disagreed with a teammate—how did you handle it?'
];
