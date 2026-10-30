export interface SoftSkillActivity {
  id: string;
  topicId: string;
  topicSlug: string;
  title: string;
  category: 'Self-Discovery' | 'Communication' | 'Group Discussion' | 'Interview & STAR' | 'Aviation Simulation' | 'Creative Expression';
  durationMinutes: number;
  targetTendency: 'Seeker' | 'Learner' | 'Leader' | 'Inquisitive' | 'All Tendencies';
  objective: string;
  materialsRequired: string[];
  facilitatorScript: {
    whatIWillSay: string;
    whatLearnersDo: string;
  };
  ccqs: { question: string; expectedAnswer: string }[];
  icqs: { question: string; expectedAnswer: string }[];
  linkedWorksheetId?: string;
}

export const SOFTSKILLS_ACTIVITIES: SoftSkillActivity[] = [
  {
    id: 'act-1',
    topicId: 'topic-1',
    topicSlug: 'confidence-mindset',
    title: 'Three Words My Friends Use For Me',
    category: 'Self-Discovery',
    durationMinutes: 15,
    targetTendency: 'Seeker',
    objective: 'Break self-perception bias and explore first impressions without self-doubt.',
    materialsRequired: ['Index cards or sticky notes', 'Pens'],
    facilitatorScript: {
      whatIWillSay: 'Take out your card. Write 3 words your closest friends would use to describe you. Next, write 3 words YOU would choose for yourself. Turn to your partner and compare the gap.',
      whatLearnersDo: 'Students write quietly for 3 minutes, then compare differences with their partner and discuss why their friends see them differently.'
    },
    ccqs: [
      { question: 'Does a friend\'s description mean they are judging you or sharing what they notice?', expectedAnswer: 'Sharing what they notice.' },
      { question: 'Are these traits fixed forever or can you develop them?', expectedAnswer: 'You can develop them.' }
    ],
    icqs: [
      { question: 'Are we writing our names on the card?', expectedAnswer: 'Yes, your name at the top.' },
      { question: 'How many total words are you writing?', expectedAnswer: 'Six words: three from friends, three from yourself.' },
      { question: 'How many minutes do you have to write?', expectedAnswer: 'Three minutes.' }
    ],
    linkedWorksheetId: 'OrientationMaster'
  },
  {
    id: 'act-2',
    topicId: 'topic-1',
    topicSlug: 'confidence-mindset',
    title: 'The 30-Second Somatic Calm-Down Drill',
    category: 'Self-Discovery',
    durationMinutes: 10,
    targetTendency: 'All Tendencies',
    objective: 'Physically regulate heart rate and nervous tension before entering an interview.',
    materialsRequired: ['Stopwatch / classroom timer'],
    facilitatorScript: {
      whatIWillSay: 'Stand up straight. Close your eyes. We are doing box breathing: breathe in for 4 counts, hold for 4, release slowly for 4, and hold empty for 4. Unclench your jaw and drop your shoulders 2 inches. Feel your feet flat on the floor.',
      whatLearnersDo: 'Whole class stands, closes eyes, breathes collectively in cadence, and practices physical relaxation.'
    },
    ccqs: [
      { question: 'When your heart races before an interview, is it a sign of weakness or normal adrenaline?', expectedAnswer: 'Normal adrenaline that we can calm down.' }
    ],
    icqs: [
      { question: 'Are we speaking during this exercise?', expectedAnswer: 'No, complete silence and slow breathing.' },
      { question: 'How many counts do we breathe in for?', expectedAnswer: 'Four counts.' }
    ]
  },
  {
    id: 'act-3',
    topicId: 'topic-2',
    topicSlug: 'tell-me-about-yourself',
    title: 'Strength in a Story (The Anti-Cliché Anchor)',
    category: 'Interview & STAR',
    durationMinutes: 25,
    targetTendency: 'Learner',
    objective: 'Eliminate buzzwords like "hardworking" by anchoring one strength to a verifiable real-life incident.',
    materialsRequired: ['A4 worksheet or notebook', 'Timer'],
    facilitatorScript: {
      whatIWillSay: 'If you say you are "responsible" or "quick-thinking", an airline interviewer will forget it in 5 seconds. I want one incident: a time during college, a club event, or a personal challenge where that strength was tested. Write down the moment in 3 sentences.',
      whatLearnersDo: 'Students draft their 3-sentence incident, pair up, and test whether their story actually proves the strength.'
    },
    ccqs: [
      { question: 'If you say "I am a hardworking student", is that proof or a claim?', expectedAnswer: 'Just a claim.' },
      { question: 'Does telling a quick 20-second story prove the trait?', expectedAnswer: 'Yes, it provides evidence.' }
    ],
    icqs: [
      { question: 'Are you listing five different strengths?', expectedAnswer: 'No, pick just ONE strength and ONE incident.' },
      { question: 'How many sentences should your story outline be?', expectedAnswer: 'Three sentences.' }
    ],
    linkedWorksheetId: 'SelfProfile'
  },
  {
    id: 'act-4',
    topicId: 'topic-2',
    topicSlug: 'tell-me-about-yourself',
    title: 'Present-Past-Future 60-Second Speed Pitch',
    category: 'Interview & STAR',
    durationMinutes: 30,
    targetTendency: 'Leader',
    objective: 'Deliver an unscripted, natural introduction calibrated to 45-60 seconds.',
    materialsRequired: ['Mobile stopwatch / partner timer'],
    facilitatorScript: {
      whatIWillSay: 'Person A speaks for 45 to 60 seconds using Present-Past-Future. Person B runs the stopwatch. If Person A finishes before 45 seconds or goes past 60, Person B gently raises a hand. Then switch!',
      whatLearnersDo: 'Pairs alternate timing and critiquing each other\'s pitch pace, tone, and eye contact.'
    },
    ccqs: [
      { question: 'Should your introduction sound like a recited poem or an engaging conversation?', expectedAnswer: 'An engaging professional conversation.' }
    ],
    icqs: [
      { question: 'Can you read from a paper or screen during the pitch?', expectedAnswer: 'No reading; speak naturally from memory.' },
      { question: 'What is the minimum and maximum time allowed?', expectedAnswer: 'Between 45 and 60 seconds.' }
    ]
  },
  {
    id: 'act-5',
    topicId: 'topic-5',
    topicSlug: 'public-speaking-prep',
    title: 'Absurd Art Interpretation & Storytelling',
    category: 'Creative Expression',
    durationMinutes: 20,
    targetTendency: 'Inquisitive',
    objective: 'Overcome fear of the unknown and practice spontaneous verbal reasoning using abstract visual prompts.',
    materialsRequired: ['Classroom projector / abstract painting slide', 'Timer'],
    facilitatorScript: {
      whatIWillSay: 'Look at the abstract artwork on the screen. There are no right or wrong answers. You have 30 seconds to observe it. I will call on volunteers to tell us a 1-minute story or give their interpretation: What do you see, what is happening, and why?',
      whatLearnersDo: 'Students analyze abstract shapes and colors, structure an immediate interpretation, and articulate their viewpoint aloud.'
    },
    ccqs: [
      { question: 'Is there a "correct" art history answer to this image?', expectedAnswer: 'No, it is about creative expression and structured articulation.' }
    ],
    icqs: [
      { question: 'How long do you have to speak when nominated?', expectedAnswer: 'One minute.' }
    ]
  },
  {
    id: 'act-6',
    topicId: 'topic-5',
    topicSlug: 'public-speaking-prep',
    title: 'PREP Ground Delay Briefing Simulation',
    category: 'Aviation Simulation',
    durationMinutes: 25,
    targetTendency: 'Leader',
    objective: 'Apply the PREP framework (Point, Reason, Example, Point) to deliver a high-stakes delay announcement.',
    materialsRequired: ['Scenario briefing cards'],
    facilitatorScript: {
      whatIWillSay: 'You are the Duty Manager at Kempegowda International Airport. Flight 302 to Delhi is delayed by 3 hours due to severe weather. Step up and deliver a 1-minute announcement using PREP: Point (the delay), Reason (safety/weather), Example (meal vouchers provided), Point (safety restatement).',
      whatLearnersDo: 'Volunteers step to the front of the room, adopt executive posture, project their voice, and deliver the PREP announcement.'
    },
    ccqs: [
      { question: 'Should you hide the reason for the delay from passengers?', expectedAnswer: 'No, state the reason clearly to maintain trust.' }
    ],
    icqs: [
      { question: 'What are the 4 steps of the framework you must follow?', expectedAnswer: 'Point, Reason, Example, Point.' }
    ]
  },
  {
    id: 'act-7',
    topicId: 'topic-6',
    topicSlug: 'group-discussion',
    title: 'Rapid Mini-GD: The 2-Minute Entry Challenge',
    category: 'Group Discussion',
    durationMinutes: 30,
    targetTendency: 'All Tendencies',
    objective: 'Practice entering a high-speed group discussion smoothly without shouting or interrupting.',
    materialsRequired: ['GD topic slip', 'Facilitator bell / timer'],
    facilitatorScript: {
      whatIWillSay: 'Groups of 6. Your topic is: "Should airlines eliminate low-cost unbundled fares?" The clock starts now. Your individual goal is to make your first meaningful entry within the first 2 minutes. Do not shout; acknowledge the previous speaker and pivot.',
      whatLearnersDo: 'Students run an 8-minute discussion. Observers note who enters within 2 minutes and who brings in a quiet peer.'
    },
    ccqs: [
      { question: 'Is shouting over someone considered good leadership in a GD?', expectedAnswer: 'No, it loses points for team dynamics.' }
    ],
    icqs: [
      { question: 'How many minutes is the entire discussion?', expectedAnswer: 'Eight minutes.' },
      { question: 'What is your personal time window for making your first contribution?', expectedAnswer: 'Within the first two minutes.' }
    ],
    linkedWorksheetId: 'GD1Checklist'
  },
  {
    id: 'act-8',
    topicId: 'topic-7',
    topicSlug: 'answering-under-pressure-star',
    title: 'STAR Breakdown: Handling Flight Turbulence or Crew Friction',
    category: 'Interview & STAR',
    durationMinutes: 30,
    targetTendency: 'Learner',
    objective: 'Structure behavioural answers so that 50% of the speaking time is spent explaining concrete actions taken.',
    materialsRequired: ['STAR response worksheet'],
    facilitatorScript: {
      whatIWillSay: 'The interviewer asks: "Tell me about a time you had a serious conflict with a team member during a project." Don\'t spend 2 minutes complaining about what they did. Keep Situation and Task to 20 seconds. Spend 40 seconds on YOUR actions: how you approached them, what compromise you made, and what the final result was.',
      whatLearnersDo: 'Students fill in the 4 quadrants of the STAR worksheet and peer-audit for action-heavy content.'
    },
    ccqs: [
      { question: 'Which part of STAR should take up the largest portion of your answer?', expectedAnswer: 'Action (around 50%).' }
    ],
    icqs: [
      { question: 'Are we focusing on the other person\'s flaws or our own actions?', expectedAnswer: 'Our own professional actions.' }
    ],
    linkedWorksheetId: 'StarResponse'
  },
  {
    id: 'act-9',
    topicId: 'topic-9',
    topicSlug: 'situational-technical-pressure',
    title: 'The 4-Step De-escalation Drill: Angry Gate Passenger',
    category: 'Aviation Simulation',
    durationMinutes: 25,
    targetTendency: 'Leader',
    objective: 'Remain composed during verbal aggression and execute the 4-step framework (Assess, Options, Execute, Prevent).',
    materialsRequired: ['Roleplay cards'],
    facilitatorScript: {
      whatIWillSay: 'Student A is an irate business passenger whose luggage was misplaced. Student B is the airline customer service supervisor. Student A will test Student B by raising their voice and interrupting. Student B must maintain a steady tone, listen actively, and apply the 4-step framework.',
      whatLearnersDo: 'In pairs, students simulate 3 minutes of high-stress interaction, then switch roles.'
    },
    ccqs: [
      { question: 'If a passenger raises their voice, should you raise yours to match them?', expectedAnswer: 'No, lower your tone and stay calm.' }
    ],
    icqs: [
      { question: 'How long does each roleplay round last?', expectedAnswer: 'Three minutes.' }
    ]
  },
  {
    id: 'act-10',
    topicId: 'topic-10',
    topicSlug: 'full-interview-simulation',
    title: 'The 3-Station Placement Capstone Run',
    category: 'Aviation Simulation',
    durationMinutes: 45,
    targetTendency: 'All Tendencies',
    objective: 'Simulate the full airline campus recruitment cycle: Grooming Audit -> Mini-GD -> Personal Interview Station.',
    materialsRequired: ['Evaluation rubrics', 'Video recorder / mobile stands'],
    facilitatorScript: {
      whatIWillSay: 'Today is placement day. You will rotate through Station 1 (grooming and dossier check), Station 2 (8-minute rapid GD), and Station 3 (STAR interview defense). Every student records their personal interview to compare with their Week 2 baseline.',
      whatLearnersDo: 'Cohort moves through structured stations with peer evaluators and trainer scoring against standardized rubrics.'
    },
    ccqs: [
      { question: 'Are you allowed to skip any station?', expectedAnswer: 'No, all three stations must be completed.' }
    ],
    icqs: [
      { question: 'Who is recording the interview station video?', expectedAnswer: 'The designated peer recorder at Station 3.' }
    ],
    linkedWorksheetId: 'TechnicalDefensePrep'
  }
];
