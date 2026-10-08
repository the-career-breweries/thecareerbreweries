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

const computingSem1Weeks: WeekData[] = [
  // UNIT 1 - INTRODUCTION TO COMPUTERS
  { week: 1, semester: 1, theme: 'Computer Hardware Basics', focus: 'Hardware vs Software, CPU, Memory, I/O devices', task: 'Identify components', rubric: 'Identification' , label: 'Unit 1: Session 1' },
  { week: 2, semester: 1, theme: 'Software Fundamentals', focus: 'System vs Application software, Licenses', task: 'Install/uninstall apps', rubric: 'Comprehension' , label: 'Unit 1: Session 2' },
  { week: 3, semester: 1, theme: 'Operating Systems - Interface & Navigation', focus: 'Windows UI, Taskbar, Settings', task: 'Personalize OS environment', rubric: 'Navigation' , label: 'Unit 1: Session 3' },
  { week: 4, semester: 1, theme: 'File Management & Organization', focus: 'Hierarchy, Folders, Extensions', task: 'Organize disorganized folder', rubric: 'Organization' , label: 'Unit 1: Session 4' },
  { week: 5, semester: 1, theme: 'System Maintenance & Review', focus: 'Task Manager, Diagnostics, Backups', task: 'Basic system troubleshooting', rubric: 'Troubleshooting' , label: 'Unit 1: Session 5' },

  // UNIT 2 - MS WORD
  { week: 6, semester: 1, theme: 'Document Creation and Basic Formatting', focus: 'Ribbon, Saving, Font formatting', task: 'Draft basic aviation memo', rubric: 'Creation' , label: 'Unit 2: Session 1' },
  { week: 7, semester: 1, theme: 'Paragraph Formatting and Layout', focus: 'Alignment, Spacing, Lists, Indents', task: 'Format employee policy', rubric: 'Formatting' , label: 'Unit 2: Session 2' },
  { week: 8, semester: 1, theme: 'Working with Tables and Visuals', focus: 'Tables, Shapes, SmartArt', task: 'Create flight schedule table', rubric: 'Structuring' , label: 'Unit 2: Session 3' },
  { week: 9, semester: 1, theme: 'Page Layout and Document Finalization', focus: 'Margins, Headers/Footers, Grammar Check', task: 'Format multi-page incident report', rubric: 'Layout' , label: 'Unit 2: Session 4' },
  { week: 10, semester: 1, theme: 'Advanced Reporting & Review', focus: 'Styles, TOC, Mail Merge', task: 'End-to-end report creation', rubric: 'Professionalism' , label: 'Unit 2: Session 5' },

  // UNIT 3 - MS EXCEL
  { week: 11, semester: 1, theme: 'Introduction to Spreadsheets', focus: 'Workbooks, Cells, Data Entry, AutoFill', task: 'Create basic passenger list', rubric: 'Data Entry' , label: 'Unit 3: Session 1' },
  { week: 12, semester: 1, theme: 'Formatting Cells and Worksheets', focus: 'Number formats, Cell alignment, Row height', task: 'Format ticketing sales report', rubric: 'Formatting' , label: 'Unit 3: Session 2' },
  { week: 13, semester: 1, theme: 'Basic Mathematical Formulas', focus: 'Operators (+, -, *, /), PEMDAS', task: 'Calculate basic baggage fees', rubric: 'Calculation' , label: 'Unit 3: Session 3' },
  { week: 14, semester: 1, theme: 'Cell Referencing', focus: 'Relative, Absolute ($), Mixed referencing', task: 'Calculate tax with absolute references', rubric: 'Referencing accuracy' , label: 'Unit 3: Session 4' },
  { week: 15, semester: 1, theme: 'Essential Functions (Statistical)', focus: 'SUM, AVERAGE, MIN, MAX, COUNT', task: 'Analyze daily passenger counts', rubric: 'Function application' , label: 'Unit 3: Session 5' },
  { week: 16, semester: 1, theme: 'Logical and Text Functions', focus: 'IF, Nested IF, CONCATENATE, UPPER', task: 'Evaluate passenger data logically', rubric: 'Logic implementation' , label: 'Unit 3: Session 6' },
  { week: 17, semester: 1, theme: 'Data Management and Sorting', focus: 'Multi-level sorting, Basic & Advanced Filters', task: 'Filter flight manifest', rubric: 'Data Management' , label: 'Unit 3: Session 7' },
  { week: 18, semester: 1, theme: 'Visualizing Data with Charts', focus: 'Column, Bar, Pie, Line charts, Formatting', task: 'Visualize quarterly revenue', rubric: 'Visualization' , label: 'Unit 3: Session 8' },
  { week: 19, semester: 1, theme: 'Basic Data Analysis Tools', focus: 'Conditional Formatting, Remove Duplicates', task: 'Clean and validate crew records', rubric: 'Data Analysis' , label: 'Unit 3: Session 9' },
  { week: 20, semester: 1, theme: 'Printing and Excel Review', focus: 'Page layout, Print areas, Headers', task: 'Data entry to chart creation (Assessment)', rubric: 'Overall Excel Mastery' , label: 'Unit 3: Session 10' },

  // UNIT 4 - MS POWERPOINT
  { week: 21, semester: 1, theme: 'Introduction to PowerPoint', focus: 'Workspace, Slides, Layouts, Placeholders', task: 'Build 5-slide company intro', rubric: 'Slide Creation' , label: 'Unit 4: Session 1' },
  { week: 22, semester: 1, theme: 'Design Themes and Templates', focus: 'Themes, Slide Master, Branding', task: 'Apply consistent branding', rubric: 'Design Consistency' , label: 'Unit 4: Session 2' },
  { week: 23, semester: 1, theme: 'Inserting Media and Visuals', focus: 'Images, Shapes, Video, SmartArt', task: 'Create visual safety briefing', rubric: 'Multimedia usage' , label: 'Unit 4: Session 3' },
  { week: 24, semester: 1, theme: 'Animations and Transitions', focus: 'Transitions, Entrance/Emphasis, Animation Pane', task: 'Animate step-by-step process', rubric: 'Sequencing' , label: 'Unit 4: Session 4' },
  { week: 25, semester: 1, theme: 'Presentation Delivery & Review', focus: 'Speaker notes, Presenter View, Exporting', task: 'Deliver final presentation', rubric: 'Delivery' , label: 'Unit 4: Session 5' },

  // UNIT 5 - INTERNET & EMAIL
  { week: 26, semester: 1, theme: 'Internet Basics and Web Browsing', focus: 'Browsers, URLs, Search engines, Bookmarks', task: 'Research aviation industry trends', rubric: 'Web Literacy' , label: 'Unit 5: Session 1' },
  { week: 27, semester: 1, theme: 'Professional Email Management', focus: 'Outlook/Gmail, Compose, CC/BCC, Attachments', task: 'Draft and organize business emails', rubric: 'Email Etiquette' , label: 'Unit 5: Session 2' },
  { week: 28, semester: 1, theme: 'Cloud Storage and Collaboration', focus: 'Google Drive/OneDrive, Sharing, Co-authoring', task: 'Co-author a shared document', rubric: 'Collaboration' , label: 'Unit 5: Session 3' },
  { week: 29, semester: 1, theme: 'Cyber Safety and Security Basics', focus: 'Phishing, Passwords, Malware, Safe browsing', task: 'Security settings and password audit', rubric: 'Security Awareness' , label: 'Unit 5: Session 4' },
  { week: 30, semester: 1, theme: 'Digital Communication Tools & Review', focus: 'Zoom/Teams, Screen sharing, Slack', task: 'Integrated digital skills test', rubric: 'Digital Competence' , label: 'Unit 5: Session 5' }
];

export const curriculumDataComputing: Record<'ug' | 'pg', ProgramCurriculum> = {
  ug: {
    programName: 'Undergraduate',
    streams: [
      { streamName: 'B.Sc Aviation', weeks: computingSem1Weeks },
      { streamName: 'BBA Aviation', weeks: computingSem1Weeks },
    ]
  },
  pg: {
    programName: 'PG',
    streams: []
  }
};
