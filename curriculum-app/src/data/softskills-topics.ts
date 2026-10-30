export interface SoftSkillSubtopic {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface SoftSkillTopic {
  id: string;
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Self-Presentation' | 'Communication Skills' | 'Interview Under Pressure' | 'Simulation & Review';
  cefrFocus: 'A1-A2' | 'B1' | 'B1-B2' | 'B2+';
  targetYear: '1st Year Foundation' | '2nd/3rd Year Placement' | 'All Years';
  description: string;
  learningOutcome: string;
  subtopics: SoftSkillSubtopic[];
}

export const SOFTSKILLS_TOPICS: SoftSkillTopic[] = [
  {
    id: 'topic-1',
    number: 1,
    slug: 'confidence-mindset',
    title: 'Confidence, Mindset & First Impression',
    shortTitle: 'Confidence & First Impression',
    category: 'Self-Presentation',
    cefrFocus: 'A1-A2',
    targetYear: '1st Year Foundation',
    description: 'Naming interview fears, reframing anxiety, 30-second somatic calm-down routine, confident entry, greeting, and posture.',
    learningOutcome: 'Reframe one interview fear as a helpful thought, use a 30-second calm-down routine, and walk in, greet, and sit with confident posture.',
    subtopics: [
      {
        id: '1.1',
        number: '1.1',
        title: 'Facing your fears',
        description: 'Writing down what scares you about interviews (like freezing or English hesitation) and turning those thoughts into positive, helpful reminders.'
      },
      {
        id: '1.2',
        number: '1.2',
        title: 'The 30-second calm-down routine',
        description: 'Simple deep breathing (in for 4 seconds, hold, breathe out) and dropping your shoulders to stop your heart from racing.'
      },
      {
        id: '1.3',
        number: '1.3',
        title: 'Walking into the room',
        description: 'Knocking politely, walking in with your head held high, and standing straight without looking down or rushing.'
      },
      {
        id: '1.4',
        number: '1.4',
        title: 'Greeting the interviewer',
        description: 'Making eye contact, smiling, saying a clear "Good morning", and waiting until you are asked before taking your seat.'
      }
    ]
  },
  {
    id: 'topic-2',
    number: 2,
    slug: 'tell-me-about-yourself',
    title: 'Tell Me About Yourself & Personal Pitch',
    shortTitle: 'Personal Pitch & Self-Intro',
    category: 'Self-Presentation',
    cefrFocus: 'A2-B1',
    targetYear: 'All Years',
    description: 'Building authentic, non-memorized self-introductions using the Present-Past-Future rule, backing strengths with real stories, and closing hooks.',
    learningOutcome: 'Deliver a 45-60 second self-introduction using Present-Past-Future, with one strength backed by a real personal incident.',
    subtopics: [
      {
        id: '2.1',
        number: '2.1',
        title: 'The Present-Past-Future rule',
        description: 'Present: what you study right now. Past: 1 or 2 practical projects/events. Future: target aviation role and why this airline.'
      },
      {
        id: '2.2',
        number: '2.2',
        title: 'Backing up strengths with proof',
        description: 'Eliminating empty buzzwords ("hardworking") and replacing them with a specific, real-world example that proves the skill.'
      },
      {
        id: '2.3',
        number: '2.3',
        title: 'The closing sentence',
        description: 'Ending your intro with a memorable line connecting back to the role that invites the interviewer to ask their first question.'
      },
      {
        id: '2.4',
        number: '2.4',
        title: 'Timing your introduction',
        description: 'Practicing with a stopwatch to keep your pitch strictly between 45 and 60 seconds without rushing or rambling.'
      }
    ]
  },
  {
    id: 'topic-3',
    number: 3,
    slug: 'presence-body-language',
    title: 'Presence, Body Language & Reading the Room',
    shortTitle: 'Body Language & Presence',
    category: 'Self-Presentation',
    cefrFocus: 'A2-B1',
    targetYear: 'All Years',
    description: 'Executive posture, triangle eye contact, open-palm hand gestures, spotting interviewer engagement cues, and adapting.',
    learningOutcome: 'Show open posture, steady eye contact, purposeful gestures, and respond dynamically to interviewer cues.',
    subtopics: [
      {
        id: '3.1',
        number: '3.1',
        title: 'How to sit properly',
        description: 'Sitting straight against the back of the chair, feet flat on the floor; eliminating crossed arms, leg bouncing, or pen clicking.'
      },
      {
        id: '3.2',
        number: '3.2',
        title: 'Natural eye contact',
        description: 'Looking comfortably at the interviewer\'s eyes and face without staring them down; cycling contact across multi-member panels.'
      },
      {
        id: '3.3',
        number: '3.3',
        title: 'Natural hand gestures',
        description: 'Using open-palm gestures inside the "chest-to-waist gesture box" to explain points, resting hands calmly when listening.'
      },
      {
        id: '3.4',
        number: '3.4',
        title: 'Reading the room',
        description: 'Spotting when interviewers are engaged (nodding) vs. disengaged (checking watch), and knowing when to wrap up an answer.'
      }
    ]
  },
  {
    id: 'topic-4',
    number: 4,
    slug: 'communication-clarity',
    title: 'Communication Clarity & Listening',
    shortTitle: 'Communication Clarity',
    category: 'Communication Skills',
    cefrFocus: 'A1-B1',
    targetYear: 'All Years',
    description: 'Pace control, strategic pauses, eliminating verbal fillers, active listening, accent awareness, and professional clarification phrases.',
    learningOutcome: 'Speak at a controlled pace with pauses and word stress, and ask for clarification politely instead of guessing.',
    subtopics: [
      {
        id: '4.1',
        number: '4.1',
        title: 'Slowing down and pausing',
        description: 'Speaking at 120-140 words per minute; using the 2-second silent pause before answering so you don\'t rush when nervous.'
      },
      {
        id: '4.2',
        number: '4.2',
        title: 'Clear pronunciation',
        description: 'Finishing the terminal sounds of words and emphasizing key nouns/verbs so listeners never have to strain.'
      },
      {
        id: '4.3',
        number: '4.3',
        title: 'Cutting out filler words',
        description: 'Replacing vocal crutches ("um", "uh", "like", "you know", "basically") with a clean, silent breath.'
      },
      {
        id: '4.4',
        number: '4.4',
        title: 'Listening before replying',
        description: 'Paying full attention to the question without interrupting; mirroring the interviewer\'s key phrase in your opening.'
      },
      {
        id: '4.5',
        number: '4.5',
        title: 'Asking for clarification politely',
        description: 'Knowing exact phrases to ask for repetition or clarification ("Could you please repeat that?", "Do you mean...?") instead of guessing.'
      }
    ]
  },
  {
    id: 'topic-5',
    number: 5,
    slug: 'public-speaking-prep',
    title: 'Public Speaking & 1-Minute Impromptu (PREP)',
    shortTitle: 'Public Speaking & PREP',
    category: 'Communication Skills',
    cefrFocus: 'B1-B2',
    targetYear: 'All Years',
    description: 'The 20-second silent blueprint, PREP impromptu model (Point, Reason, Example, Point), cadence control, and blank-out recovery.',
    learningOutcome: 'Structure a one-minute answer with an opening, two points, and a close after 20 seconds of silent planning.',
    subtopics: [
      {
        id: '5.1',
        number: '5.1',
        title: 'The 20-second plan',
        description: 'Using 20 seconds of silent planning to choose a clear stance and two bullet points, rather than panicking.'
      },
      {
        id: '5.2',
        number: '5.2',
        title: 'The PREP method',
        description: 'Point (clear stance) -> Reason ("Because...") -> Example (real story/fact) -> Point (crisp closing restatement).'
      },
      {
        id: '5.3',
        number: '5.3',
        title: 'Managing your 1 minute',
        description: 'Allocating 10 seconds for opening hook, 35 seconds for supporting evidence, and 15 seconds to wrap up cleanly.'
      },
      {
        id: '5.4',
        number: '5.4',
        title: 'What to do if your mind goes blank',
        description: 'Taking a calm breath and using a smooth bridge line ("Let me look at this from another angle...") without apologizing.'
      }
    ]
  },
  {
    id: 'topic-6',
    number: 6,
    slug: 'group-discussion',
    title: 'Group Discussion & Team Communication',
    shortTitle: 'Group Discussion & Teams',
    category: 'Communication Skills',
    cefrFocus: 'B1-B2',
    targetYear: '2nd/3rd Year Placement',
    description: 'Strategic entry timing, inclusive facilitation, respectful disagreement, active listening, and synthesizing group consensus.',
    learningOutcome: 'Enter a group discussion within the first two minutes, bring in a quieter member, and summarize effectively at the end.',
    subtopics: [
      {
        id: '6.1',
        number: '6.1',
        title: 'Joining the discussion early',
        description: 'Entering the conversation within the first 2 minutes by building on what someone said, without shouting or interrupting.'
      },
      {
        id: '6.2',
        number: '6.2',
        title: 'Bringing in quiet members',
        description: 'Inviting quieter teammates into the discussion ("Rohan, what do you think on this?") to demonstrate collaborative leadership.'
      },
      {
        id: '6.3',
        number: '6.3',
        title: 'Disagreeing politely',
        description: 'Disagreeing with ideas rather than people using the validation pivot ("That is a valid point, however considering the cost impact...").'
      },
      {
        id: '6.4',
        number: '6.4',
        title: 'Summarizing at the end',
        description: 'Listening closely to synthesize different viewpoints into a balanced, 30-second final summary.'
      }
    ]
  },
  {
    id: 'topic-7',
    number: 7,
    slug: 'answering-under-pressure-star',
    title: 'Answering Under Pressure: STAR & HR Questions',
    shortTitle: 'STAR Method & HR Questions',
    category: 'Interview Under Pressure',
    cefrFocus: 'B1-B2',
    targetYear: '2nd/3rd Year Placement',
    description: 'STAR behavioral structure (Situation, Task, Action, Result), core HR questions, authentic failure framing, and reverse interviewing.',
    learningOutcome: 'Answer core HR questions using STAR and handle a tricky behavioral or failure question calmly and honestly.',
    subtopics: [
      {
        id: '7.1',
        number: '7.1',
        title: 'The STAR method for story questions',
        description: 'Situation (1-2 lines), Task (responsibility), Action (50% of your time: exact steps taken), Result (quantifiable outcome & learning).'
      },
      {
        id: '7.2',
        number: '7.2',
        title: 'Core HR questions',
        description: 'Preparing grounded, authentic responses for "Why should we hire you?", "Where do you see yourself in 3-5 years?", and "Why this airline?".'
      },
      {
        id: '7.3',
        number: '7.3',
        title: 'Talking about weaknesses & mistakes',
        description: 'Admitting a real weakness without looking careless, backed by the concrete habits you are currently using to overcome it.'
      },
      {
        id: '7.4',
        number: '7.4',
        title: 'Good questions to ask at the end',
        description: 'Asking 1 or 2 thoughtful questions about fleet expansion, training culture, or team expectations when given the floor.'
      }
    ]
  },
  {
    id: 'topic-8',
    number: 8,
    slug: 'assessments-elimination-time',
    title: 'Assessment & Elimination Rounds + Time Management',
    shortTitle: 'Elimination Rounds & Time',
    category: 'Interview Under Pressure',
    cefrFocus: 'B1-B2',
    targetYear: '2nd/3rd Year Placement',
    description: 'The Skim-Scan-Verify technique, test time budgets, interview-day countdown logistics, and round-to-round psychological resets.',
    learningOutcome: 'Complete a timed reading and instruction task accurately and budget time effectively for screening tests and interview day.',
    subtopics: [
      {
        id: '8.1',
        number: '8.1',
        title: 'Quick reading and finding details',
        description: 'Skimming passages for main ideas, scanning for critical data, and spotting trick qualifiers like "NOT" or "EXCEPT".'
      },
      {
        id: '8.2',
        number: '8.2',
        title: 'Managing test time',
        description: 'Allocating specific minute limits per question and applying the strict "skip and flag" threshold on blocking questions.'
      },
      {
        id: '8.3',
        number: '8.3',
        title: 'Getting ready for interview day',
        description: 'Preparing your uniform, document dossier, and travel plan the day prior; maintaining focus during multi-hour waiting periods.'
      },
      {
        id: '8.4',
        number: '8.4',
        title: 'Shaking off a bad round',
        description: 'Mentally detaching from a nervous slip-up or tough question to walk into the subsequent interview round with a clean slate.'
      }
    ]
  },
  {
    id: 'topic-9',
    number: 9,
    slug: 'situational-technical-pressure',
    title: 'Situational, Technical & The Pressure Interview',
    shortTitle: 'Pressure & Situational Dilemmas',
    category: 'Interview Under Pressure',
    cefrFocus: 'B2+',
    targetYear: '2nd/3rd Year Placement',
    description: 'The 4-step scenario framework, thinking aloud through operational dilemmas, handling stress interruptions, and knowledge gap etiquette.',
    learningOutcome: 'Think aloud through a high-pressure scenario using the 4-step frame and stay composed when interrupted or challenged.',
    subtopics: [
      {
        id: '9.1',
        number: '9.1',
        title: 'The 4-step problem solver',
        description: 'Step 1: Spot the core issue & urgency. Step 2: Compare two possible options. Step 3: Execute SOP calmly. Step 4: Prevent repetition.'
      },
      {
        id: '9.2',
        number: '9.2',
        title: 'Thinking out loud',
        description: 'Talking through your logic step-by-step so the interview panel can evaluate your judgment, even if data is incomplete.'
      },
      {
        id: '9.3',
        number: '9.3',
        title: 'Staying calm when interrupted',
        description: 'Maintaining composure when interviewers cut in or change the parameters mid-answer; acknowledging and adapting with ease.'
      },
      {
        id: '9.4',
        number: '9.4',
        title: 'Handling questions you don\'t know',
        description: 'Saying "I am not familiar with that regulation, but here is how I would find the verified answer" instead of bluffing.'
      }
    ]
  },
  {
    id: 'topic-10',
    number: 10,
    slug: 'full-interview-simulation',
    title: 'Full Aviation Interview Simulation & Feedback',
    shortTitle: 'Full Interview Simulation',
    category: 'Simulation & Review',
    cefrFocus: 'All Levels',
    targetYear: 'All Years',
    description: 'Multi-station capstone simulation: Screening & grooming audit, rapid mini-GD, HR/Pressure panel, baseline comparison, and 3-point action plan.',
    learningOutcome: 'Complete an end-to-end interview simulation, compare baseline and capstone video pitches, and implement a 3-point action plan.',
    subtopics: [
      {
        id: '10.1',
        number: '10.1',
        title: 'Station 1 – Grooming & First Check',
        description: 'Auditing attire, shoes, hair, posture, document file, and delivering a 30-second formal greeting.'
      },
      {
        id: '10.2',
        number: '10.2',
        title: 'Station 2 – Fast Mini-GD',
        description: 'An 8-10 minute timed group discussion assessing entry speed, listening demeanor, and collaboration under panel observation.'
      },
      {
        id: '10.3',
        number: '10.3',
        title: 'Station 3 – Personal Interview Defense',
        description: 'A comprehensive 1-on-1 interview with behavioral STAR queries, scenario dilemmas, and unexpected follow-ups.'
      },
      {
        id: '10.4',
        number: '10.4',
        title: 'Seeing your improvement',
        description: 'Reviewing Week 2 baseline introduction recordings against Week 10 capstone delivery to measure concrete vocal and poise growth.'
      },
      {
        id: '10.5',
        number: '10.5',
        title: 'Your 3-point action plan',
        description: 'Writing down three specific fixes before actual airline campus placement: one body language fix, one vocal/clarity fix, and one content fix.'
      }
    ]
  }
];
