export interface WeekData {
  week: number | string;
  semester: number;
  level?: number;
  theme: string;
  focus: string;
  task: string;
  rubric: string;
  label?: string; // e.g. "Orientation" instead of Week 0
}

export interface StreamCurriculum {
  streamName: string;
  weeks: WeekData[];
}

export interface ProgramCurriculum {
  programName: string;
  streams: StreamCurriculum[];
}

const englishSem1Weeks: WeekData[] = [
  { week: 1, semester: 1, level: 1, theme: 'Welcome to Communicative English', focus: 'Orientation & Roadmap', task: 'Introduction', rubric: 'Participation' , label: 'Unit 1: Session 1' },
  { week: 2, semester: 1, level: 1, theme: 'Fundamentals of Grammar', focus: 'Parts of Speech, Tenses, Sentence Structure', task: 'Grammar Worksheets', rubric: 'Accuracy' , label: 'Unit 1: Session 2' },
  { week: 3, semester: 1, level: 1, theme: 'Vocabulary Development', focus: 'Synonyms, Antonyms, Aviation Technical Vocab', task: 'Vocabulary Quizzes', rubric: 'Contextual Usage' , label: 'Unit 1: Session 3' },
  { week: 4, semester: 1, level: 1, theme: 'Reading Skills', focus: 'Comprehension, Skimming, Scanning', task: 'Reading Analysis', rubric: 'Speed and Interpretation' , label: 'Unit 2: Session 1' },
  { week: 5, semester: 1, level: 1, theme: 'Writing Skills', focus: 'Paragraphs, Letters, Reports, Emails', task: 'Drafting Professional Emails', rubric: 'Formatting, Tone' , label: 'Unit 2: Session 2' },
  { week: 6, semester: 1, level: 1, theme: 'Listening & Speaking', focus: 'Pronunciation, Conversation, Role Play', task: 'Role Play Scenarios', rubric: 'Fluency, Articulation' , label: 'Unit 2: Session 3' },
  { week: 7, semester: 1, level: 1, theme: 'Effective Communication', focus: '7 Cs of Communication, Barriers', task: 'Case Study Analysis', rubric: 'Understanding, Application' , label: 'Unit 3: Session 1' },
  { week: 8, semester: 1, level: 1, theme: 'Non-Verbal Communication', focus: 'Body language, eye contact, posture', task: 'Silent Role Play', rubric: 'Expression, Awareness' , label: 'Unit 3: Session 2' },
  { week: 9, semester: 1, level: 1, theme: 'Mid-Semester Recap', focus: 'Grammar, Vocab, Reading, Writing', task: 'Interactive Quiz & Revision', rubric: 'Recall, Accuracy' , label: 'Unit 3: Session 3' },
  { week: 10, semester: 1, level: 1, theme: 'Group Discussions', focus: 'Initiation, summarization, turn-taking', task: 'Mock GD Session', rubric: 'Participation, Logic' , label: 'Unit 4: Session 1' },
  { week: 11, semester: 1, level: 1, theme: 'Presentation Skills', focus: 'Structuring content, visual aids', task: '3-Minute Mini Presentation', rubric: 'Structure, Delivery' , label: 'Unit 4: Session 2' },
  { week: 12, semester: 1, level: 1, theme: 'Public Speaking', focus: 'Overcoming stage fright, engagement', task: 'Extempore Speaking', rubric: 'Confidence, Spontaneity' , label: 'Unit 4: Session 3' },
  { week: 13, semester: 1, level: 1, theme: 'Cross-Cultural Communication', focus: 'Global awareness, sensitivity', task: 'Cultural Scenario Analysis', rubric: 'Empathy, Adaptability' , label: 'Unit 5: Session 1' },
  { week: 14, semester: 1, level: 1, theme: 'Interview Preparation', focus: 'Self-introduction, common questions', task: 'Drafting Interview Answers', rubric: 'Clarity, Professionalism' , label: 'Unit 5: Session 2' },
  { week: 15, semester: 1, level: 1, theme: 'Mock Interviews', focus: 'Real-time practice, feedback', task: 'Peer-to-Peer Mock Interview', rubric: 'Overall Performance' , label: 'Unit 5: Session 3' },
];

export const curriculumDataEnglish: Record<'ug' | 'pg', ProgramCurriculum> = {
  ug: {
    programName: 'Undergraduate',
    streams: [
      { streamName: 'BBA Aviation', weeks: englishSem1Weeks },
      { streamName: 'B.Sc Aviation', weeks: englishSem1Weeks },
    ]
  },
  pg: {
    programName: 'Postgraduate',
    streams: []
  }
};
