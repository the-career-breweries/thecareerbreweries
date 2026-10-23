export interface FrameworkPillar {
  letter: string;
  title: string;
  timingOrWeight: string;
  description: string;
  example: string;
}

export interface DrillOption {
  id: string;
  text: string;
  isOptimal: boolean;
  feedback: string;
}

export interface PressureScenario {
  id: string;
  context: string;
  prompt: string;
  options: DrillOption[];
}

export interface BrewField {
  id: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  helperText: string;
}

export interface ModuleData {
  id: string;
  number: number;
  track: 'Track A: Student Bundle' | 'Track B: Professional Bundle';
  title: string;
  subtitle: string;
  frameworkName: string;
  frameworkShort: string;
  duration: string;
  iconName: 'MessageSquare' | 'FileText' | 'Users' | 'Mail' | 'Award' | 'Brain' | 'CreditCard' | 'TrendingUp';
  overview: string;
  pillars: FrameworkPillar[];
  teardown: {
    prompt: string;
    amateur: string;
    amateurFlaws: string[];
    tcbBrew: string;
    tcbStrengths: string[];
  };
  scenarios: PressureScenario[];
  brewBuilder: {
    title: string;
    instructions: string;
    fields: BrewField[];
  };
}

export const TRACK_A_MODULES: ModuleData[] = [
  {
    id: 'intro-pitch',
    number: 1,
    track: 'Track A: Student Bundle',
    title: 'The 3-Sentence Intro',
    subtitle: 'Master the art of the first 30 seconds in interviews & networking.',
    frameworkName: 'The P-P-F Formula (Present → Past → Future)',
    frameworkShort: 'P-P-F Formula',
    duration: '15 mins',
    iconName: 'MessageSquare',
    overview:
      'When an interviewer says "Tell me about yourself," 90% of students recite their resume from high school onwards. The P-P-F Formula compresses your identity into three surgical sentences: who you are today, one quantified proof point from your past, and why you are sitting in this room for the future.',
    pillars: [
      {
        letter: 'P1',
        title: 'Present Hook (Identity + Core Focus)',
        timingOrWeight: 'Sentence 1 (~7 sec)',
        description: 'State your current academic stage/role and the 1-2 core domains you specialize in.',
        example: 'I am a final-year BBA Aviation student specializing in airline operations and passenger experience analytics.'
      },
      {
        letter: 'P2',
        title: 'Past Proof (1 Quantified Win)',
        timingOrWeight: 'Sentence 2 (~10 sec)',
        description: 'Back up your claim immediately with one specific project, internship, or leadership metric.',
        example: 'During my terminal operations capstone, I mapped turnaround bottlenecks across 40+ simulated flights and proposed a boarding sequence that cut gate delays by 18%.'
      },
      {
        letter: 'F',
        title: 'Future Alignment (Why This Role Now)',
        timingOrWeight: 'Sentence 3 (~8 sec)',
        description: 'Connect your proven skill directly to the company’s immediate priority.',
        example: 'I’m excited to bring that operational discipline to IndiGo’s Ground Ops team to help maintain industry-leading on-time performance.'
      }
    ],
    teardown: {
      prompt: '"Tell me about yourself in 30 seconds."',
      amateur:
        '"Myself Rohan, I am basically from Mysore. My father is a bank manager and my mother is a homemaker. I completed my 10th with 88% and 12th with 85%, and right now I am pursuing B.Com. I am a hard worker, quick learner, and my hobbies are playing cricket and watching tech videos."',
      amateurFlaws: [
        'Opens with grammatically incorrect "Myself..." and irrelevant family history.',
        'Lists generic adjectives ("hard worker, quick learner") with zero proof.',
        'Never connects skills to what the hiring manager actually needs.'
      ],
      tcbBrew:
        '"I’m a final-year B.Com Honors student with a sharp focus on financial auditing and cost reconciliation. Last semester, I led a 4-member audit simulation where I automated ledger cross-checks in Excel, reducing reconciliation errors by 22%. I’m eager to bring that analytical rigor to Deloitte’s Audit & Assurance practice this season."',
      tcbStrengths: [
        'Hooks attention in 6 seconds with a clear professional identity.',
        'Drops a concrete, memorable metric (22% error reduction) in Sentence 2.',
        'Closes by naming the target team and value proposition.'
      ]
    },
    scenarios: [
      {
        id: 's1',
        context: 'Campus Placement — Day 1 Panel Interview',
        prompt:
          'The interviewer glances at the clock and says: "We’ve interviewed 40 candidates since morning. Give me your introduction in 3 sentences without repeating your resume header."',
        options: [
          {
            id: 'a',
            text: '"Sure sir! I have an 8.6 CGPA, I know Python, SQL, and PowerBI, and I was the cultural secretary in 2nd year where I organized a 2-day fest."',
            isOptimal: false,
            feedback: 'Too fragmented—this is a laundry list of keywords from your resume rather than a cohesive narrative.'
          },
          {
            id: 'b',
            text: '"I’m a final-year BCA data enthusiast focused on business intelligence. In my recent internship, I built an automated PowerBI sales tracker that saved regional managers 4 hours of manual reporting every week. I want to bring that exact automation mindset to your Business Analyst trainee role."',
            isOptimal: true,
            feedback: 'Spot on! Clean Present Hook → Quantified Past Proof (4 hours/week saved) → Direct Future Alignment.'
          },
          {
            id: 'c',
            text: '"I am someone who thrives under pressure and loves solving complex business problems with technology. If given a chance, I will prove my dedication."',
            isOptimal: false,
            feedback: 'Purely generic claims ("thrives under pressure") with zero concrete evidence.'
          }
        ]
      },
      {
        id: 's2',
        context: 'Pre-Placement Talk (PPT) — Networking Q&A',
        prompt:
          'You walk up to a visiting VP after the company presentation. You have 20 seconds before other students crowd in. How do you introduce yourself?',
        options: [
          {
            id: 'a',
            text: '"Hi ma’am, loved your presentation! Can you tell me what the CTC breakup is for freshers?"',
            isOptimal: false,
            feedback: 'Asking compensation logistics at a public networking huddle wastes a prime relationship-building moment.'
          },
          {
            id: 'b',
            text: '"Hi Ananya, I’m Karthik, a final-year MBA Marketing candidate focusing on D2C retention. I recently analyzed churn patterns for a local skincare brand and boosted repeat orders by 15% via WhatsApp lifecycle flows. Your point on Tier-2 customer acquisition really resonated—how is your team approaching retention there?"',
            isOptimal: true,
            feedback: 'Executive precision! Uses P-P-F to establish credibility in 15 seconds and pivots into a thoughtful strategic question.'
          },
          {
            id: 'c',
            text: '"Hello ma’am, I am Karthik from MBA Section B. Please remember my name during tomorrow’s interviews!"',
            isOptimal: false,
            feedback: 'Puts awkward pressure on the speaker without giving them any professional reason to remember you.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'The 3-Sentence P-P-F Pitch Generator',
      instructions: 'Fill in the 3 blocks below to synthesize your custom 25-second interview opener.',
      fields: [
        {
          id: 'present',
          label: '1. Present Hook (Your Degree/Role + 2 Core Strengths)',
          placeholder: 'e.g., final-year BBA student specializing in brand strategy and digital analytics',
          defaultValue: 'final-year BBA student specializing in brand strategy and consumer analytics',
          helperText: 'Avoid starting with "Myself"—state your current stage and specialty.'
        },
        {
          id: 'past',
          label: '2. Past Proof (1 Specific Project/Internship + Metric)',
          placeholder: 'e.g., led a 5-person campus launch campaign that drove 1,200+ student sign-ups in 10 days',
          defaultValue: 'led a 5-person campus launch campaign that drove 1,200+ verified student sign-ups in 10 days',
          helperText: 'Include at least one number (%, hours saved, users reached, or scale).'
        },
        {
          id: 'future',
          label: '3. Future Alignment (Target Role + Value You Will Add)',
          placeholder: 'e.g., Growth Marketing team to accelerate high-conversion user acquisition',
          defaultValue: 'Growth Marketing team to accelerate high-conversion user acquisition',
          helperText: 'Name the specific role/domain and the business outcome you want to drive.'
        }
      ]
    }
  },
  {
    id: 'resume-ats',
    number: 2,
    track: 'Track A: Student Bundle',
    title: 'Resume Building & ATS Mastery',
    subtitle: 'Transform passive duty descriptions into high-converting impact bullets.',
    frameworkName: 'Google’s X-Y-Z Bullet Framework',
    frameworkShort: 'X-Y-Z Framework',
    duration: '20 mins',
    iconName: 'FileText',
    overview:
      'Applicant Tracking Systems (ATS) and recruiters spend an average of 6.4 seconds scanning a resume. Resumes that say "Responsible for..." get filtered out. Google’s X-Y-Z formula forces every single bullet point to prove impact: Accomplished [X], as measured by [Y], by doing [Z].',
    pillars: [
      {
        letter: 'X',
        title: 'Accomplished [X] (Power Verb + Core Deliverable)',
        timingOrWeight: 'Part 1 of Bullet',
        description: 'Start with a high-agency past-tense verb (Engineered, Spearheaded, Streamlined, Audited).',
        example: 'Streamlined student onboarding workflow'
      },
      {
        letter: 'Y',
        title: 'As Measured By [Y] (Hard Metric / Delta)',
        timingOrWeight: 'Part 2 of Bullet',
        description: 'Quantify the before-and-after change using %, ₹, hours saved, accuracy, or volume.',
        example: 'reducing document verification turnaround time by 35% (from 5 days to 3.2 days)'
      },
      {
        letter: 'Z',
        title: 'By Doing [Z] (Specific Tool / Action)',
        timingOrWeight: 'Part 3 of Bullet',
        description: 'Name the exact tool, framework, or method so the ATS matches your technical keywords.',
        example: 'by deploying an automated Google Forms + Apps Script validation pipeline.'
      }
    ],
    teardown: {
      prompt: 'Describe your college fest or internship experience on your resume.',
      amateur:
        '• Worked as Sponsorship Coordinator for college fest.\n• Contacted many companies and got sponsors.\n• Handled team members and made sure event was successful.',
      amateurFlaws: [
        'Uses weak verbs ("Worked as", "Handled") that describe duties, not achievements.',
        'Vague quantifiers ("many companies") give zero sense of scale.',
        'Contains no ATS-searchable skills (e.g., B2B cold outreach, pitch decks, CRM).'
      ],
      tcbBrew:
        '• Secured ₹3.4 Lakhs in corporate sponsorships (28% above target) across 9 D2C brands by executing a 60-company B2B cold-outreach pipeline and custom ROI pitch decks.',
      tcbStrengths: [
        'Opens with a decisive outcome verb ("Secured").',
        'Quantifies both total value (₹3.4L) and benchmark performance (+28%).',
        'Embeds rich ATS keywords ("B2B cold-outreach", "ROI pitch decks").'
      ]
    },
    scenarios: [
      {
        id: 's1',
        context: 'Resume Audit — Academic Project Bullet',
        prompt:
          'You built an academic project that was never deployed to paying customers, so you have no revenue numbers. Which bullet best applies the X-Y-Z framework?',
        options: [
          {
            id: 'a',
            text: 'Built a Machine Learning model to predict flight delays using Python and Pandas.',
            isOptimal: false,
            feedback: 'Has X and Z, but completely misses Y (scale of dataset or model accuracy).'
          },
          {
            id: 'b',
            text: 'Engineered a flight-delay classification model achieving 89.4% F1-score across 120,000+ historical BTS flight records by implementing Gradient Boosted Trees and feature engineering in Python.',
            isOptimal: true,
            feedback: 'Brilliant! When you don’t have revenue, you quantify dataset volume (120,000+ records) and technical accuracy (89.4%).'
          },
          {
            id: 'c',
            text: 'Successfully completed final-year project on flight delay prediction and received A+ grade from department head.',
            isOptimal: false,
            feedback: 'Recruiters care about technical scale and methodology, not classroom grades.'
          }
        ]
      },
      {
        id: 's2',
        context: 'ATS Keyword Optimization — Finance & Ops Role',
        prompt:
          'Your summer internship involved checking vendor invoices every day. How do you frame this for a Big-4 Analyst application?',
        options: [
          {
            id: 'a',
            text: 'Audited 450+ monthly vendor invoices totaling ₹1.8 Cr, eliminating 100% of duplicate billing discrepancies by designing a 3-way VLOOKUP & PivotTable reconciliation template.',
            isOptimal: true,
            feedback: 'Textbook X-Y-Z! Turns routine invoice checking into high-value financial control.'
          },
          {
            id: 'b',
            text: 'Responsible for daily vendor invoice checking and Excel entry in the accounts department.',
            isOptimal: false,
            feedback: 'Reads like a copy-pasted job description rather than an accomplishment.'
          },
          {
            id: 'c',
            text: 'Helped senior accountant verify bills and learned corporate finance culture.',
            isOptimal: false,
            feedback: '"Helped" and "learned" signal passive observation rather than ownership.'
          }
        ]
      },
      {
        id: 's3',
        context: 'The Amazon A-B-C Rule (Applied Via Careers Page With Zero Referral)',
        prompt:
          'A candidate cracked an Amazon engineering role directly through the public careers page with zero referral by applying the "A-B-C Rule" of resumes. What does "A-B-C" stand for?',
        options: [
          {
            id: 'a',
            text: 'A = Achievements in Numbers (quantified metrics like 40% bug reduction or 25% lower latency), B = Behavior You Proved (leadership/mentorship verbs like "Empowered" or "Spearheaded" instead of "Responsible for"), C = Copy the Job’s Language (matching exact keywords from the JD).',
            isOptimal: true,
            feedback: '10/10! That is the exact formula that bypassed thousands of applicants on Amazon’s careers portal without needing an internal employee referral.'
          },
          {
            id: 'b',
            text: 'A = Always Be Concise, B = Bullet Points Only, C = Chronological Order.',
            isOptimal: false,
            feedback: 'Formatting basics are good, but they don’t pass algorithmic ATS filters or prove high-agency behavioral impact.'
          },
          {
            id: 'c',
            text: 'A = Academic CGPA, B = Background Summary, C = Certifications.',
            isOptimal: false,
            feedback: 'Classroom credentials take a backseat to quantified achievements and high-agency behavioral proof.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'The X-Y-Z Resume Bullet Synthesizer',
      instructions: 'Turn any raw internship or project task into an ATS-proof executive resume bullet.',
      fields: [
        {
          id: 'x_action',
          label: '[X] Power Verb + Core Deliverable',
          placeholder: 'e.g., Redesigned the campus placement portal UI',
          defaultValue: 'Redesigned the student placement preparation portal',
          helperText: 'Start with a strong past-tense verb: Engineered, Spearheaded, Audited, Accelerated.'
        },
        {
          id: 'y_metric',
          label: '[Y] Quantified Impact (%, ₹, Time Saved, or Scale)',
          placeholder: 'e.g., increasing weekly student mock-test completions by 48% (600+ active users)',
          defaultValue: 'increasing weekly mock-test completions by 48% across 600+ final-year students',
          helperText: 'Ask yourself: How many? How much faster? By what percentage?'
        },
        {
          id: 'z_method',
          label: '[Z] Specific Tools, Methodology, or Action Taken',
          placeholder: 'e.g., simplifying the 5-step onboarding flow and adding instant score analytics',
          defaultValue: 'streamlining the onboarding flow and integrating instant diagnostic feedback cards',
          helperText: 'Include exact tools or methods that match the job description.'
        }
      ]
    }
  },
  {
    id: 'gd-dominance',
    number: 3,
    track: 'Track A: Student Bundle',
    title: 'Group Discussion (GD) Dominance',
    subtitle: 'Command the room with structured reasoning and polite turn-taking bridges.',
    frameworkName: 'P.R.E.P. + Tactical Bridging',
    frameworkShort: 'P.R.E.P. + Bridging',
    duration: '20 mins',
    iconName: 'Users',
    overview:
      'In campus placement GDs, evaluators immediately penalize two extremes: aggressive shouters and silent observers. The P.R.E.P. framework paired with Tactical Bridging lets you enter high-noise discussions smoothly, deliver a crystal-clear 40-second argument, and pass the baton like a natural leader.',
    pillars: [
      {
        letter: 'P',
        title: 'Point (Clear Stance + Bridge)',
        timingOrWeight: 'First 8 sec',
        description: 'Acknowledge the previous speaker by name/idea and state your core thesis in one crisp sentence.',
        example: 'Building on Priya’s point about EV subsidies, I believe charging infrastructure—not vehicle price—is the true bottleneck.'
      },
      {
        letter: 'R',
        title: 'Reason (The Structural "Why")',
        timingOrWeight: 'Next 10 sec',
        description: 'Explain the economic, operational, or human logic behind your claim.',
        example: 'Because range anxiety prevents urban commuters from adopting EVs as their primary household vehicle.'
      },
      {
        letter: 'E',
        title: 'Example (Concrete Data / Case)',
        timingOrWeight: 'Next 12 sec',
        description: 'Anchor your argument with one real-world statistic, industry case, or policy example.',
        example: 'For instance, Norway crossed 80% EV adoption only after mandating fast-chargers every 50 km along national corridors.'
      },
      {
        letter: 'P',
        title: 'Point + Floor Pass (Leadership Close)',
        timingOrWeight: 'Final 8 sec',
        description: 'Summarize your thesis and invite a quieter participant to weigh in.',
        example: 'So prioritizing grid density first is critical—and I’d love to hear what Rahul thinks from a supply-chain perspective.'
      }
    ],
    teardown: {
      prompt: 'GD Topic: "Will AI Replace Entry-Level Analysts?"',
      amateur:
        '"No, I totally disagree with you! AI can never replace humans because humans have emotions and creativity! Everyone is just scared for no reason, look at calculators, did calculators replace accountants? No!"',
      amateurFlaws: [
        'Starts with confrontational negation ("I totally disagree!") which triggers defensiveness.',
        'Relies on generic clichés ("humans have emotions") instead of business mechanics.',
        'Ends abruptly without advancing the group’s synthesis.'
      ],
      tcbBrew:
        '"Adding a nuance to Vikram’s point on automation speed—AI won’t replace entry-level analysts, but it is redefining their baseline output. Routine data cleaning is now automated, which shifts junior analysts toward stakeholder problem-framing and exception handling. For example, McKinsey’s Lilli tool cut research synthesis time by 30%, allowing first-year associates to focus on client implementation. So the role isn’t disappearing; the bar for critical judgment is rising."',
      tcbStrengths: [
        'Uses a collaborative "Yes-And" bridge referencing a peer.',
        'Follows P-R-E-P with a concrete industry example.',
        'Sounds composed, analytical, and boardroom-ready.'
      ]
    },
    scenarios: [
      {
        id: 's1',
        context: 'The "Fish Market" GD — Entering Without Shouting',
        prompt:
          'Four candidates have been talking over each other for 2 minutes. You haven’t spoken yet. How do you break in?',
        options: [
          {
            id: 'a',
            text: 'Wait until everyone is completely silent for 5 seconds so you appear polite.',
            isOptimal: false,
            feedback: 'In a competitive 10-minute GD, waiting for a 5-second silence often means you never speak at all.'
          },
          {
            id: 'b',
            text: 'Wait for a micro-breath from the current speaker, lean forward with an open palm, and say: "That’s a strong point on cost, Arjun—if we now connect that to execution timelines for 20 seconds..."',
            isOptimal: true,
            feedback: 'Masterclass! Validating the current speaker by name makes them stop defending their turf and hand you the floor.'
          },
          {
            id: 'c',
            text: 'Raise your voice louder than the group and say: "Please let others speak! Everyone is making too much noise!"',
            isOptimal: false,
            feedback: 'Scolding the group makes you look flustered rather than authoritative.'
          }
        ]
      },
      {
        id: 's2',
        context: 'Bonus Leadership Points — Inviting a Silent Peer',
        prompt:
          'With 2 minutes left, you notice Candidate #7 hasn’t managed to speak once. What is your highest-EV move?',
        options: [
          {
            id: 'a',
            text: 'Ignore them—fewer speakers means more airtime for you.',
            isOptimal: false,
            feedback: 'Evaluators score collaborative leadership higher than raw speaking minutes.'
          },
          {
            id: 'b',
            text: 'Finish your P.R.E.P. point in 25 seconds and say: "Before we synthesize our final consensus, Neha hasn’t had a chance to weigh in—Neha, how do you see the regulatory angle?"',
            isOptimal: true,
            feedback: 'Instant leadership multiplier! Evaluators universally award top marks to candidates who create space for quieter peers.'
          },
          {
            id: 'c',
            text: 'Stop the discussion and say: "Look, Candidate 7 is too shy to talk, someone give her a chance."',
            isOptimal: false,
            feedback: 'Calling someone "shy" patronizes them—frame the handoff as a genuine request for their perspective.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'The 40-Second P.R.E.P. GD Script Builder',
      instructions: 'Draft a razor-sharp Group Discussion intervention you can deploy in under 45 seconds.',
      fields: [
        {
          id: 'bridge_point',
          label: '[P] Bridge + Core Point',
          placeholder: 'e.g., Building on the discussion around remote work, hybrid models optimize both deep work and mentorship',
          defaultValue: 'Building on the discussion around work culture, structured hybrid models outperform both 100% remote and 5-day office mandates',
          helperText: 'Start with "Building on..." or "Adding a new lens to..."'
        },
        {
          id: 'reason',
          label: '[R] Core Reason (The "Why")',
          placeholder: 'e.g., early-career hires need in-person osmosis while mid-week remote days eliminate commute fatigue',
          defaultValue: 'early-career talent requires in-person shadowing for rapid upskilling, while mid-week remote days protect deep execution blocks',
          helperText: 'Keep the causal logic to 1 clear sentence.'
        },
        {
          id: 'example',
          label: '[E] Concrete Example / Data Point',
          placeholder: 'e.g., a Stanford study of 1,600 engineers showed 3-2 hybrid schedules reduced attrition by 33% with zero productivity dip',
          defaultValue: 'a recent Stanford study across 1,600 professionals showed a 3-2 hybrid schedule reduced attrition by 33% with zero dip in output',
          helperText: 'Cite a real company, policy, or benchmark.'
        }
      ]
    }
  },
  {
    id: 'email-etiquette',
    number: 4,
    track: 'Track A: Student Bundle',
    title: 'Corporate Email Etiquette',
    subtitle: 'Write executive-grade emails that get read and answered in 60 seconds.',
    frameworkName: 'B.L.U.F. Architecture (Bottom Line Up Front)',
    frameworkShort: 'B.L.U.F. Architecture',
    duration: '15 mins',
    iconName: 'Mail',
    overview:
      'In college, we are taught to write essays that build up to a conclusion at the very end. In corporate life, executives read on their phones between meetings. B.L.U.F. flips the pyramid: put your exact conclusion or request in Sentence 1, support it with 3 scannable bullets, and close with a dated Call-to-Action.',
    pillars: [
      {
        letter: 'S',
        title: 'Surgical Subject Line ([Tag] Topic — Date)',
        timingOrWeight: 'Header',
        description: 'Tell the recipient the action type, project name, and deadline before they even open the email.',
        example: '[Sign-Off Needed] Q2 Vendor Onboarding Checklist — By Fri 3 PM'
      },
      {
        letter: 'B',
        title: 'Bottom Line Up Front (Sentence 1)',
        timingOrWeight: 'Line 1',
        description: 'State the core update, decision, or request in the very first sentence.',
        example: 'Writing to request final approval on the updated 3-step vendor KYC workflow attached below.'
      },
      {
        letter: 'C',
        title: 'Context in 3 Bullets Max',
        timingOrWeight: 'Body',
        description: 'Use bullet points with bold lead-ins so the eye can scan key facts in 5 seconds.',
        example: '• Impact: Cuts onboarding delay by 2 days.\n• Risk Check: Reviewed by Legal on Tuesday.'
      },
      {
        letter: 'A',
        title: 'Action + Default Next Step',
        timingOrWeight: 'Close',
        description: 'Specify who does what by when, removing back-and-forth scheduling friction.',
        example: 'Please reply "Approved" by Friday 3 PM so we can push this live on Monday morning.'
      }
    ],
    teardown: {
      prompt: 'Emailing a recruiter 1 week after your final interview.',
      amateur:
        'Subject: Interview\n\nRespected Sir/Madam,\nI hope this email finds you in good health. I had given my interview last week on Wednesday for the Management Trainee role. I have not heard anything yet so kindly tell me when the result will come as I have other offers to consider. Thanking you in anticipation.',
      amateurFlaws: [
        'Vague one-word subject line ("Interview") gets lost in a recruiter’s inbox.',
        'Outdated colonial phrasing ("Respected Sir/Madam", "Thanking you in anticipation").',
        'Sounds impatient rather than warm and value-focused.'
      ],
      tcbBrew:
        'Subject: [Follow-Up] Management Trainee Final Round — S D Sandarsh\n\nHi Priya,\n\nThank you again for last Wednesday’s conversation regarding the Management Trainee role—our discussion on streamlining regional onboarding really reinforced my excitement for the team.\n\n• Quick Update: I’ve attached the 1-page sample onboarding checklist we discussed during the case round.\n• Next Steps: Could you share the expected timeline for final hiring decisions?\n\nWarm regards,\nS D Sandarsh',
      tcbStrengths: [
        'Searchable subject line with candidate name and role.',
        'Adds value (attaches a 1-page follow-up artifact) instead of just asking "any update?".',
        'Polite, peer-level professional tone.'
      ]
    },
    scenarios: [
      {
        id: 's1',
        context: 'Workplace Escalation — Flagging a Deadline Risk Early',
        prompt:
          'It is Wednesday noon. A client deck is due Thursday 5 PM, but the data engineering team hasn’t sent the Q3 export yet. How do you email your manager?',
        options: [
          {
            id: 'a',
            text: 'Wait until Thursday 5 PM and email: "Sorry, Data Team didn’t send the file so I couldn’t finish the deck."',
            isOptimal: false,
            feedback: 'Surprising your manager *at* the deadline destroys trust—always flag risks 24+ hours early with a mitigation plan.'
          },
          {
            id: 'b',
            text: 'Subject: [Timeline Update] Q3 Client Deck — Mitigation Plan for Data Dependency\n\nHi Rohan — Flagging a 4-hour dependency on the Q3 data export; Slide 1–8 are 100% complete, and I’ve drafted placeholder charts using Q2 benchmarks so we can still review narrative flow at 4 PM today.',
            isOptimal: true,
            feedback: 'Textbook B.L.U.F.! Flags the blocker early, shows what is already done, and brings a proactive workaround.'
          },
          {
            id: 'c',
            text: 'Send a 5-paragraph email CC’ing the VP complaining that the Data Team never replies on Slack.',
            isOptimal: false,
            feedback: 'Public blame-shifting creates hostility without solving the client deliverable.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'The B.L.U.F. Corporate Email Composer',
      instructions: 'Build an executive-ready email that gets instant replies from recruiters or managers.',
      fields: [
        {
          id: 'subject_topic',
          label: '1. [Action Tag] + Specific Subject Line',
          placeholder: 'e.g., [Follow-Up] Business Analyst Final Interview — Cohort 2026',
          defaultValue: '[Follow-Up] Business Analyst Final Round & Case Summary',
          helperText: 'Use tags like [Action Required], [Follow-Up], [Approval Needed], or [Update].'
        },
        {
          id: 'bluf_line',
          label: '2. B.L.U.F. Opening Sentence (The Core Ask / Update)',
          placeholder: 'e.g., Writing to share the 1-page case summary from yesterday’s final interview and check on next steps.',
          defaultValue: 'Writing to thank you for yesterday’s final-round discussion and share the 1-page KPI framework we discussed.',
          helperText: 'Put the main point in Sentence 1—no fluff.'
        },
        {
          id: 'cta_line',
          label: '3. Clear Call-to-Action & Timeline',
          placeholder: 'e.g., Please let me know the expected timeline for final onboarding decisions by Friday.',
          defaultValue: 'Could you share the expected timeline for final selection updates this week?',
          helperText: 'Make it effortless for the recipient to reply in one line.'
        }
      ]
    }
  },
  {
    id: 'behavioral-star',
    number: 5,
    track: 'Track A: Student Bundle',
    title: 'Behavioral Interview Mastery',
    subtitle: 'Turn campus projects and setbacks into compelling 90-second leadership stories.',
    frameworkName: 'The S.T.A.R.+L Method',
    frameworkShort: 'S.T.A.R.+L Method',
    duration: '25 mins',
    iconName: 'Award',
    overview:
      'Behavioral questions ("Tell me about a time you...") test how you behave under real pressure. Standard candidates ramble through the backstory and say "We did." Top 5% candidates use S.T.A.R.+L: spending 50% of their airtime on their personal Actions, quantifying the Result, and sealing the answer with the "+L" (Transferable Learning).',
    pillars: [
      {
        letter: 'S',
        title: 'Situation (Context in 2 Sentences)',
        timingOrWeight: '15% of Answer',
        description: 'Set the scene with time, team size, and stakes—do not spend more than 15 seconds here.',
        example: 'During our annual 800-person tech symposium, our primary registration server crashed 2 hours before doors opened.'
      },
      {
        letter: 'T',
        title: 'Task (Your Specific Ownership)',
        timingOrWeight: '15% of Answer',
        description: 'Clarify your exact responsibility in solving the problem.',
        example: 'As Operations Lead, I needed to check in 800 attendees without creating a 2-hour security bottleneck.'
      },
      {
        letter: 'A',
        title: 'Action ("I" Steps, Not "We")',
        timingOrWeight: '50% of Answer',
        description: 'Walk through 2–3 structured actions YOU initiated.',
        example: 'First, I exported the pre-registration CSV from our email backup. Second, I split volunteers into 4 alphabetical QR-check lanes using offline Google Sheets.'
      },
      {
        letter: 'R+L',
        title: 'Result + Learning (Metric & Takeaway)',
        timingOrWeight: '20% of Answer',
        description: 'State the measurable result and the permanent process upgrade you learned.',
        example: 'We checked in 95% of attendees within 28 minutes. That taught me to always build an offline-first fallback SOP for live events.'
      }
    ],
    teardown: {
      prompt: '"Tell me about a time a project didn’t go as planned."',
      amateur:
        '"In my 3rd semester, our group had to submit a marketing report. One guy in our group didn’t do his part until the last night, so the rest of us stayed up till 4 AM and finished it. It was very stressful but we got an A."',
      amateurFlaws: [
        'Sounds like a routine college complaint rather than a professional case study.',
        'Uses collective "we stayed up" instead of showing structured problem-solving.',
        'No preventative lesson learned (+L) on how to manage project milestones.'
      ],
      tcbBrew:
        '"During a 4-week consumer research project for 250 respondents, a teammate responsible for survey cleaning fell ill 48 hours before the faculty defense (S/T). Instead of rushing a manual patch, I re-prioritized the core variables, wrote a quick Python script to clean the 250 rows in 40 minutes, and held a 15-minute dry run with the remaining team (A). We delivered on schedule and scored in the top 5% of the cohort (R). More importantly, it taught me to institute 48-hour internal buffer checkpoints on every team project since (+L)."',
      tcbStrengths: [
        'Zero blame or whining—pure operational ownership.',
        'Clear 50% focus on specific technical and leadership actions.',
        'Closes with a mature +L takeaway that proves future reliability.'
      ]
    },
    scenarios: [
      {
        id: 's1',
        context: 'Final Round HR + Hiring Manager Interview',
        prompt:
          'The manager asks: "Tell me about your biggest professional or academic failure." Which approach wins the room?',
        options: [
          {
            id: 'a',
            text: '"Honestly, my biggest failure is that I am a perfectionist and sometimes work too hard on details."',
            isOptimal: false,
            feedback: 'Every hiring manager recognizes the "humble-brag perfectionist" cliché immediately—it signals low self-awareness.'
          },
          {
            id: 'b',
            text: 'Share a real early-stage miscalculation (e.g., skipping user validation on a hackathon prototype), explain how you owned the fix, and show how you applied that lesson to win a subsequent project.',
            isOptimal: true,
            feedback: 'Authentic accountability + documented growth (+L) is the #1 green flag in behavioral interviews.'
          },
          {
            id: 'c',
            text: 'Confess a critical flaw required for the job (e.g., "I’m terrible with deadlines and numbers") with no remediation.',
            isOptimal: false,
            feedback: 'Never pick a failure in a core competency of the role without showing a completed turnaround.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'The S.T.A.R.+L Story Architect',
      instructions: 'Build your signature 90-second behavioral story ready for any placement interview.',
      fields: [
        {
          id: 'st_context',
          label: '[S + T] Situation & Task (15–20 sec setup)',
          placeholder: 'e.g., During our 6-week capstone, client response rates dropped 50% below target 10 days before final submission...',
          defaultValue: 'During our 6-week market research capstone, survey response rates stalled at 35% of our target just 7 days before final analysis.',
          helperText: 'Keep the setup tight—state the stakes and your specific responsibility.'
        },
        {
          id: 'action_steps',
          label: '[A] Your Specific Actions (Use "I", not "We")',
          placeholder: 'e.g., I redesigned the 18-question form into a 90-second mobile flow and partnered with 3 student clubs for distribution...',
          defaultValue: 'I audited the drop-off point, compressed the 18-question survey into a 90-second mobile flow, and partnered with 3 student clubs for targeted distribution.',
          helperText: 'This is the heart of your answer—list 2–3 decisive actions you drove.'
        },
        {
          id: 'result_learning',
          label: '[R + L] Quantified Result + Transferable Learning',
          placeholder: 'e.g., Collected 410 responses (136% of goal) in 4 days. Learned to always pilot-test user friction before scaling.',
          defaultValue: 'We collected 410 verified responses (136% of target) within 4 days, teaching me to always pilot-test user friction before scaling outreach.',
          helperText: 'End with a hard number AND the permanent habit you built from it.'
        }
      ]
    }
  }
];
