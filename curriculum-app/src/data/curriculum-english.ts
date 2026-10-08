export interface WeekData {
  week: number | string;
  semester: number;
  level?: number;
  theme: string;
  focus: string;
  task: string;
  rubric: string;
  label?: string;
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
  { week: 1, semester: 1, level: 1, theme: 'Introduction to Nouns, Pronouns, and Adjectives', focus: 'Grammar Basics', task: 'Identify parts of speech', rubric: 'Performance', label: 'Unit 1: Session 1' },
  { week: 2, semester: 1, level: 1, theme: 'Verbs, Adverbs, Prepositions, & Conjunctions', focus: 'Action & Linking words', task: 'Sentence construction', rubric: 'Performance', label: 'Unit 1: Session 2' },
  { week: 3, semester: 1, level: 1, theme: 'Present Tenses', focus: 'Rules and usage', task: 'Tense exercises', rubric: 'Performance', label: 'Unit 1: Session 3' },
  { week: 4, semester: 1, level: 1, theme: 'Past and Future Tenses', focus: 'Simple, Continuous, Perfect', task: 'Time consistency', rubric: 'Performance', label: 'Unit 1: Session 4' },
  { week: 5, semester: 1, level: 1, theme: 'Sentence Structure Basics', focus: 'SVO model, Phrases, Clauses', task: 'Fix run-on sentences', rubric: 'Performance', label: 'Unit 1: Session 5' },
  { week: 6, semester: 1, level: 1, theme: 'Sentence Types and Review', focus: 'Simple, Compound, Complex', task: 'Grammar Assessment', rubric: 'Performance', label: 'Unit 1: Session 6' },
  { week: 7, semester: 1, level: 1, theme: 'Introduction to Vocabulary Building', focus: 'Active vs Passive vocabulary', task: 'Dictionary skills', rubric: 'Performance', label: 'Unit 2: Session 1' },
  { week: 8, semester: 1, level: 1, theme: 'Prefixes, Suffixes, Synonyms, & Antonyms', focus: 'Word roots and meanings', task: 'Word replacement', rubric: 'Performance', label: 'Unit 2: Session 2' },
  { week: 9, semester: 1, level: 1, theme: 'Technical Vocabulary - Aircraft & Infrastructure', focus: 'Aviation terms', task: 'Case-based learning', rubric: 'Performance', label: 'Unit 2: Session 3' },
  { week: 10, semester: 1, level: 1, theme: 'Technical Vocabulary - Flight Ops & ATC', focus: 'ATC terms, Phonetic alphabet', task: 'ATC Simulation', rubric: 'Performance', label: 'Unit 2: Session 4' },
  { week: 11, semester: 1, level: 1, theme: 'Technical Vocabulary - Passenger Handling', focus: 'Ticketing, Baggage, Safety', task: 'Customer interaction', rubric: 'Performance', label: 'Unit 2: Session 5' },
  { week: 12, semester: 1, level: 1, theme: 'Vocabulary Application and Review', focus: 'Acronyms, Integration', task: 'Vocabulary Assessment', rubric: 'Performance', label: 'Unit 2: Session 6' },
  { week: 13, semester: 1, level: 1, theme: 'Introduction to Reading Comprehension', focus: 'Active vs Passive reading', task: 'Identify main ideas', rubric: 'Performance', label: 'Unit 3: Session 1' },
  { week: 14, semester: 1, level: 1, theme: 'Skimming Techniques', focus: 'Titles, headings, gist', task: 'Speed reading drills', rubric: 'Performance', label: 'Unit 3: Session 2' },
  { week: 15, semester: 1, level: 1, theme: 'Scanning Techniques', focus: 'Visual cues, keywords', task: 'Scanning flight schedules', rubric: 'Performance', label: 'Unit 3: Session 3' },
  { week: 16, semester: 1, level: 1, theme: 'Reading Technical and Aviation Documents', focus: 'CARs, SOPs, Briefing cards', task: 'Extract data from SOP', rubric: 'Performance', label: 'Unit 3: Session 4' },
  { week: 17, semester: 1, level: 1, theme: 'Interpretation and Critical Reading', focus: 'Inferences, Fact vs Opinion', task: 'Critical analysis', rubric: 'Performance', label: 'Unit 3: Session 5' },
  { week: 18, semester: 1, level: 1, theme: 'Comprehensive Reading Practice & Review', focus: 'Timed reading test', task: 'Reading Assessment', rubric: 'Performance', label: 'Unit 3: Session 6' },
  { week: 19, semester: 1, level: 1, theme: 'Principles of Paragraph Writing', focus: 'Topic and supporting sentences', task: 'Descriptive writing', rubric: 'Performance', label: 'Unit 4: Session 1' },
  { week: 20, semester: 1, level: 1, theme: 'Formal and Informal Letter Writing', focus: 'Business formats, Tone', task: 'Drafting letters', rubric: 'Performance', label: 'Unit 4: Session 2' },
  { week: 21, semester: 1, level: 1, theme: 'Professional Email Writing', focus: 'Subject lines, Salutations', task: 'Internal communication', rubric: 'Performance', label: 'Unit 4: Session 3' },
  { week: 22, semester: 1, level: 1, theme: 'Advanced Email Scenarios', focus: 'Persuasion, Bad news, Irate customers', task: 'Handling email threads', rubric: 'Performance', label: 'Unit 4: Session 4' },
  { week: 23, semester: 1, level: 1, theme: 'Fundamentals of Report Writing', focus: 'Executive summaries, findings', task: 'Incident report outline', rubric: 'Performance', label: 'Unit 4: Session 5' },
  { week: 24, semester: 1, level: 1, theme: 'Report Writing Application & Review', focus: 'Operational shift reports', task: 'Report Assessment', rubric: 'Performance', label: 'Unit 4: Session 6' },
  { week: 25, semester: 1, level: 1, theme: 'Fundamentals of Active Listening', focus: 'Hearing vs Listening, Barriers', task: 'Audio exercises', rubric: 'Performance', label: 'Unit 5: Session 1' },
  { week: 26, semester: 1, level: 1, theme: 'Phonetics and Pronunciation', focus: 'Vowels, Consonants, Intonation', task: 'Pronunciation drills', rubric: 'Performance', label: 'Unit 5: Session 2' },
  { week: 27, semester: 1, level: 1, theme: 'Everyday Conversation Practice', focus: 'Small talk, open-ended questions', task: 'Conversational scenarios', rubric: 'Performance', label: 'Unit 5: Session 3' },
  { week: 28, semester: 1, level: 1, theme: 'Professional Speaking in Aviation', focus: 'PA Announcements, Briefings', task: 'Cabin safety announcement', rubric: 'Performance', label: 'Unit 5: Session 4' },
  { week: 29, semester: 1, level: 1, theme: 'Role Play: Customer Service Scenarios', focus: 'Handling inquiries, delays, irate passengers', task: 'Role Play exercises', rubric: 'Performance', label: 'Unit 5: Session 5' },
  { week: 30, semester: 1, level: 1, theme: 'Role Play: Conflict Resolution & Review', focus: 'De-escalation techniques', task: 'Speaking Assessment', rubric: 'Performance', label: 'Unit 5: Session 6' },
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
