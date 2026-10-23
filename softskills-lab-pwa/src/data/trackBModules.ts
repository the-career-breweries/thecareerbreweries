import { ModuleData } from './trackAModules';

export const TRACK_B_MODULES: ModuleData[] = [
  {
    id: 'hostile-qa',
    number: 6,
    track: 'Track B: Professional Bundle',
    title: 'Hostile Interview & Trap Q&A Handling',
    subtitle: 'Disarm trap questions ("Why are you leaving?", career switches, KPI misses) without sounding defensive or fake.',
    frameworkName: 'The A.B.C. Forward Pivot (Acknowledge → Bridge → Control)',
    frameworkShort: 'A.B.C. Forward Pivot',
    duration: '20 mins',
    iconName: 'Brain',
    overview:
      'In lateral and executive interviews, questions like "Why are you leaving your current company?" or "Why did your last project miss its Q3 target?" are psychological traps. Candidates either give a fake cliché ("looking for growth opportunities") that the panel has heard 40 times that week, or tell the toxic truth ("my manager was toxic / never gave me a raise")—which immediately makes the interviewer think: "If they talk about their last company like this, what will they say about us someday?" The A.B.C. Forward Pivot keeps you honest, professional, and forward-looking.',
    pillars: [
      {
        letter: 'A',
        title: 'Acknowledge with Gratitude or Objective Fact',
        timingOrWeight: 'Step 1 (~5 sec)',
        description:
          'Never badmouth a previous employer, boss, or team—even if they deserve it. Open by honoring what you genuinely learned or stating the neutral business context.',
        example:
          'I have genuinely learned a tremendous amount in my current role—especially around scaling operations from zero to one.'
      },
      {
        letter: 'B',
        title: 'Bridge Away from the Past (The Growth Plateau)',
        timingOrWeight: 'Step 2 (~8 sec)',
        description:
          'Pivot smoothly from the past constraint to your forward trajectory. Frame the transition around outgrowing the current scope, never escaping a bad environment.',
        example:
          'However, I have reached a point where the learning curve has plateaued, and I am not growing at the pace I want to.'
      },
      {
        letter: 'C',
        title: 'Control the Frame (Running Towards This Role)',
        timingOrWeight: 'Step 3 (~10 sec)',
        description:
          'Anchor your answer on why THIS specific role and company represent the exact challenge you are running towards.',
        example:
          'I am looking for an environment where I can take ownership of larger cross-functional P&L challenges, and this role feels like the exact right arena for that.'
      }
    ],
    teardown: {
      prompt: 'Interviewer: "You have only been at your current company for 14 months. Why are you already looking to leave?"',
      amateur:
        '"Honestly, the work culture there has become very toxic after the new VP joined. They promised me a promotion and a 25% hike during appraisal, but froze budgets at the last minute. I am just looking for better growth opportunities and a healthier culture."',
      amateurFlaws: [
        'Triggers the #1 Hiring Red Flag: "If they trash their current boss in an interview, they will trash us too."',
        'Uses the dead cliché "looking for growth opportunities" with zero specificity.',
        'Positions you as someone running AWAY from pain rather than running TOWARDS impact.'
      ],
      tcbBrew:
        '"I have genuinely learned a lot over the last 14 months—especially when I led the CRM migration that cut ticket resolution time by 32%. Having stabilized that system, I have reached a point where my day-to-day scope has moved into maintenance mode. I want to be in an environment where I am building and scaling high-growth systems from scratch, and your upcoming APAC expansion is the exact challenge I want to run towards."',
      tcbStrengths: [
        'Zero negativity about the current employer—projects high emotional maturity.',
        'Drops a concrete proof metric (32% faster ticket resolution) inside a defensive question.',
        'Honest, professional, forward-looking: clearly running towards a bigger challenge.'
      ]
    },
    scenarios: [
      {
        id: 'hq-1',
        context: 'Scenario 1: The "Why Are You Leaving?" Trap',
        prompt:
          'The Hiring Manager leans forward and asks: "Be honest with me—why do you want to leave your current organization?" Which response applies the TCB A.B.C. Forward Pivot?',
        options: [
          {
            id: 'a',
            text: '"I am looking for better career growth opportunities and a place where my hard work is actually recognized."',
            isOptimal: false,
            feedback:
              'Too generic and subtly bitter. The interviewer has heard "looking for growth opportunities" 40 times this week, and "where my hard work is recognized" signals resentment.'
          },
          {
            id: 'b',
            text: '"I have genuinely learned a lot in my current role, but I have reached a point where I am not growing the way I want to. I am looking for an environment where I can take on bigger challenges, and this role feels like exactly that."',
            isOptimal: true,
            feedback:
              'Spot on! Honest, professional, and forward-looking. It honors your current experience while proving you are running towards a bigger challenge—not running away from a toxic boss.'
          },
          {
            id: 'c',
            text: '"There is a lot of internal politics and micromanagement in my department right now, so I want a fresh start."',
            isOptimal: false,
            feedback:
              'Fatal trap. Even if 100% true, speaking negatively about your previous employer in the interview room always costs you the offer.'
          }
        ]
      },
      {
        id: 'hq-2',
        context: 'Scenario 2: The Hostile "Why Should We Hire You Over Others?" Pushback',
        prompt:
          'A skeptical Director interrupts: "We have interviewed 15 candidates with your exact degree and years of experience this week. Why should we hire you?"',
        options: [
          {
            id: 'a',
            text: '"Because I have 3 years of experience in B2B sales, a strong academic track record, and I am a very dedicated team player who never misses deadlines."',
            isOptimal: false,
            feedback:
              'You just read your CV out loud again. They already know your years of experience—they are asking why you solve their future problem better than the other 14 candidates.'
          },
          {
            id: 'b',
            text: '"Based on everything we discussed today, you need someone who can build client relationships from scratch in a competitive market. I have done exactly that twice before—once with zero marketing budget, and once in a territory where we had no brand recognition. Both times, we hit target within 6 months. That is what I am bringing here."',
            isOptimal: true,
            feedback:
              'Masterclass! You named their exact business need, connected it to two high-constraint past proofs, and proved you are solving their future rather than selling your past.'
          },
          {
            id: 'c',
            text: '"If you give me one chance, I promise I will outwork everyone else in the department and prove my worth in 90 days."',
            isOptimal: false,
            feedback:
              'Sounds desperate rather than executive. Senior panels buy proven repeatability, not emotional promises.'
          }
        ]
      },
      {
        id: 'hq-3',
        context: 'Scenario 3: The "Biggest Weakness" Final Filter',
        prompt:
          'In the final 3 minutes of the interview, the panel asks: "What would you say is your biggest weakness?"',
        options: [
          {
            id: 'a',
            text: '"I am a bit of a perfectionist and sometimes I care too much about quality, which makes me work late hours."',
            isOptimal: false,
            feedback:
              'The classic fake humblebrag. Every time an interviewer hears "perfectionist," they write down: "Dishonest or unprepared."'
          },
          {
            id: 'b',
            text: '"I have realized that I sometimes hesitate to delegate because I feel I can finish certain tasks faster myself. In my previous role, I had a project where I kept taking smaller tasks back from my team, got overloaded, and realized I was limiting their ownership. So now I define ownership upfront, and I ask myself whether I genuinely need to do something myself before taking it back from my team."',
            isOptimal: true,
            feedback:
              'Selected! 10/10. Real non-disqualifying weakness + Real self-awareness of the team cost + Upfront ownership definition that prevents the 3 Red Flags (dodging, fake passion, perfectionist cliché).'
          },
          {
            id: 'c',
            text: '"I get impatient with slow teammates and usually end up redoing their work myself."',
            isOptimal: false,
            feedback:
              'Red flag for leadership roles—signals poor delegation and inability to coach peers.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'Live A.B.C. Forward Pivot Script Builder',
      instructions:
        'Craft your custom, zero-negativity answer to "Why are you leaving your current role / looking for a change?" so you sound composed and forward-looking.',
      fields: [
        {
          id: 'ack_learning',
          label: 'A — Acknowledge Genuine Learning in Current/Past Role',
          placeholder: 'e.g., I have genuinely learned a lot in my current role leading regional client onboarding',
          defaultValue: 'I have genuinely learned a lot in my current role managing enterprise client onboarding',
          helperText: 'Start with appreciation and 1 concrete area you mastered.'
        },
        {
          id: 'bridge_plateau',
          label: 'B — Bridge (The Growth Plateau)',
          placeholder: 'e.g., I have reached a point where my scope is largely maintenance rather than new growth',
          defaultValue: 'I have reached a point where I am not growing at the pace I want to because the role is now in steady-state maintenance',
          helperText: 'Explain why you are ready for the next level without criticizing your boss or company.'
        },
        {
          id: 'control_future',
          label: 'C — Control (What You Are Running Towards Here)',
          placeholder: 'e.g., taking on end-to-end product ownership in a fast-scaling B2B environment',
          defaultValue: 'taking on bigger cross-functional challenges where I can scale a product line from 1 to 10',
          helperText: 'Connect directly to the exact challenge of the new role.'
        }
      ]
    }
  },
  {
    id: 'salary-negotiation',
    number: 7,
    track: 'Track B: Professional Bundle',
    title: 'High-Stakes Salary & Offer Negotiation',
    subtitle: 'Never leave lakhs on the table. Master the Budget Flip, Market Anchoring, and Range Framing.',
    frameworkName: 'The F.A.R.E. Negotiation Protocol (Flip → Anchor → Range → Expand)',
    frameworkShort: 'F.A.R.E. Protocol',
    duration: '20 mins',
    iconName: 'CreditCard',
    overview:
      'Salary negotiation is never about desperation—it is about information. When asked "What are your salary expectations?", 90% of professionals make one of two costly mistakes: they quote a number that is too low because they are scared of losing the offer, or they quote a number that is too high without market basis and kill the conversation. The person who walks in more prepared always walks out with more money.',
    pillars: [
      {
        letter: 'F',
        title: 'Flip the Question First (Information Asymmetry)',
        timingOrWeight: 'Move 1 (Always Try First)',
        description:
          'Never give a number first if you can avoid it. Confidently and politely ask the recruiter or hiring manager what the approved budget band for the role looks like.',
        example:
          'Before I throw out a number, I would love to understand what the approved budget band for this role looks like on your end.'
      },
      {
        letter: 'A',
        title: 'Anchor with Objective Market Homework',
        timingOrWeight: 'Move 2 (If They Insist)',
        description:
          'If they insist you go first, never make it about your personal expenses or arbitrary "% hike on current CTC." Anchor on industry benchmarks for that role, experience level, and city.',
        example:
          'I have looked closely at what this role pays across the industry for this experience level in Bengaluru.'
      },
      {
        letter: 'R',
        title: 'Range Framing (Keep the Door Open)',
        timingOrWeight: 'Move 3 (The X-to-Y Band)',
        description:
          'Give a researched range (between X and Y, where X is your target walk-away floor) rather than a single rigid number, and signal collaborative flexibility.',
        example:
          'The market range sits between ₹18 LPA and ₹22 LPA, and I am happy to find the right number within that band.'
      },
      {
        letter: 'E',
        title: 'Expand Total Compensation Levers',
        timingOrWeight: 'Move 4 (Closing the Gap)',
        description:
          'If fixed base hits an internal HR ceiling, negotiate joining bonus, early 6-month appraisal review, retention bonus, or ESOPs instead of folding.',
        example:
          'If the fixed base is capped at ₹18.5 LPA for this band, can we bridge the ₹1.5L gap via a one-time sign-on bonus?'
      }
    ],
    teardown: {
      prompt: 'HR Head: "You are currently at ₹12 LPA. What are your salary expectations for this role?"',
      amateur:
        '"Since I am at ₹12 LPA right now, the standard industry hike is 20% to 30%, so I am expecting around ₹15 LPA. Actually, even ₹14.5 LPA is fine if the role is good."',
      amateurFlaws: [
        'Negotiates against yourself in real time (drops from ₹15L to ₹14.5L out of fear before HR even pushes back).',
        'Anchors on old salary + arbitrary percentage rather than the market value of the new role (which may have had a ₹18–20L budget!).',
        'Leaves ₹3–5 Lakhs per year on the table permanently.'
      ],
      tcbBrew:
        '"First, I’m really excited about the scope we discussed with the VP today. Before I share a specific figure, could you share the approved compensation band for this level? ... [If HR insists]: I have looked at what a Senior Product Analyst role with this scope pays across the industry in this city, and the range sits between ₹17.5 LPA and ₹20 LPA. I am happy to find the right number within that range based on the overall compensation structure."',
      tcbStrengths: [
        'Politely flips the question first to uncover hidden budget upside.',
        'Shows objective market preparation instead of emotional guesswork.',
        'Uses a strategic range (₹17.5L–₹20L) so the conversation stays open while positioning high worth.'
      ]
    },
    scenarios: [
      {
        id: 'sn-1',
        context: 'Scenario 1: The Screening Call Budget Trap',
        prompt:
          'During the first 10-minute screening call, the recruiter asks: "What is your expected CTC?" What is your very first move?',
        options: [
          {
            id: 'a',
            text: 'Quote a low, safe number (only 15% above your current CTC) so you are guaranteed to get shortlisted for the technical rounds.',
            isOptimal: false,
            feedback:
              'Never lowball out of fear. Once that low number is typed into the ATS during round 1, anchoring upward at the offer stage becomes 10x harder.'
          },
          {
            id: 'b',
            text: 'Flip the question confidently: "I’m focused on finding the right role fit first—could you share what the approved budget band for this position looks like?"',
            isOptimal: true,
            feedback:
              'Exact right move! You are not being difficult—you are being smart. Most recruiters will simply tell you the band.'
          },
          {
            id: 'c',
            text: 'Demand an aggressive 80% hike with no explanation so you have room to bargain down later.',
            isOptimal: false,
            feedback:
              'Throwing out an unsubstantiated high number kills the conversation before you even meet the hiring manager.'
          }
        ]
      },
      {
        id: 'sn-2',
        context: 'Scenario 2: When They Insist You Give a Number First',
        prompt:
          'The Hiring Manager smiles and says: "We don’t have a fixed band—tell me what number you have in mind." How do you respond?',
        options: [
          {
            id: 'a',
            text: '"I have looked at what this role pays across the industry, and for this experience level in this city, the range sits between ₹X and ₹Y. I am happy to find the right number within that."',
            isOptimal: true,
            feedback:
              'Bullseye! You showed you did your homework, gave a range so the door stays open, and positioned yourself as someone who knows their worth.'
          },
          {
            id: 'b',
            text: '"My rent and EMI expenses have gone up this year, so I need at least ₹18 LPA in hand."',
            isOptimal: false,
            feedback:
              'Companies never pay for personal lifestyle costs; they pay for market replacement value and business ROI.'
          },
          {
            id: 'c',
            text: '"Whatever you think is fair according to company policy works for me."',
            isOptimal: false,
            feedback:
              'Signals zero negotiation leverage and guarantees you will be placed at the very bottom of the pay band.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'Live F.A.R.E. Salary Script Synthesizer',
      instructions:
        'Build your word-for-word 2-step salary script (Step 1: The Budget Flip + Step 2: The Researched Range Anchor) so you never freeze when compensation comes up.',
      fields: [
        {
          id: 'role_title_city',
          label: 'Target Role & City',
          placeholder: 'e.g., Senior Operations Manager in Mumbai',
          defaultValue: 'Senior Operations Manager in Mumbai',
          helperText: 'Used to anchor your industry benchmark research.'
        },
        {
          id: 'range_floor_x',
          label: 'Range Floor (₹X LPA — Your Target Base)',
          placeholder: 'e.g., ₹18 LPA',
          defaultValue: '₹18 LPA',
          helperText: 'Make the bottom of your range a number you would genuinely be happy to sign at.'
        },
        {
          id: 'range_ceiling_y',
          label: 'Range Ceiling (₹Y LPA — Stretch Anchor)',
          placeholder: 'e.g., ₹21.5 LPA',
          defaultValue: '₹21.5 LPA',
          helperText: 'Typically 15–20% above your floor, backed by top-quartile market data.'
        }
      ]
    }
  },
  {
    id: 'managing-up',
    number: 8,
    track: 'Track B: Professional Bundle',
    title: 'Managing Up, Crisis Pushback & Executive Presence',
    subtitle: 'De-escalate 6 PM Friday panic calls, separate real risk from noise, and escalate with the 1-3-1 Rule.',
    frameworkName: 'The R.C.A. De-Escalation + 1-3-1 Rule',
    frameworkShort: 'R.C.A. + 1-3-1 Rule',
    duration: '25 mins',
    iconName: 'TrendingUp',
    overview:
      'What separates a junior executor from a future VP is how they behave when a boss calls in a panic at 6 PM on a Friday claiming "We are going to lose ₹50 Crores!" Amateurs either panic and cancel everything blindly, or dump raw problems back onto their manager’s lap. Executive communicators drop the room’s heart rate from 210 bpm to 85 bpm by asking 3 surgical clarifying questions, separating what is actually at risk from what is merely delayed, and presenting 1 clear problem, 3 viable options, and 1 decisive recommendation.',
    pillars: [
      {
        letter: 'R',
        title: 'Root-Cause Clarifying Questions (Drop the Panic)',
        timingOrWeight: 'Phase 1 (First 60 sec)',
        description:
          'When a stakeholder drops a massive crisis number, do not react emotionally. Ask 3 targeted constraint questions (shelf life, actual volume required, reusable capacity) to isolate the real bottleneck.',
        example:
          'Before we cancel tomorrow’s factory run: (1) What is the shelf life of the raw material? (2) How much volume does marketing actually need at launch? (3) How much material can be repurposed across other SKUs?'
      },
      {
        letter: 'C',
        title: 'Contain & Separate Real Risk from Perceived Loss',
        timingOrWeight: 'Phase 2 (Reframing)',
        description:
          'Show the stakeholder why the headline panic is solvable by separating sunk/perishable risk from timing shifts.',
        example:
          'Since the raw material has a 4-month shelf life, a 6-week launch delay does not destroy the ₹40Cr inventory—we shouldn’t cancel production blindly.'
      },
      {
        letter: 'A',
        title: 'Articulate the 1-3-1 Action Plan',
        timingOrWeight: 'Phase 3 (The Decision)',
        description:
          'Never ask a stressed leader "What do you want me to do?" Present 1 framed constraint, 3 concrete operational moves, and 1 recommended path forward.',
        example:
          'Here is what I recommend: (1) Produce the 50% launch quantity using at-risk material first, (2) Repurpose 30% material for adjacent products, and (3) Allocate the remaining factory slot to our fastest-selling existing SKU.'
      }
    ],
    teardown: {
      prompt:
        'Friday 6:00 PM Call — Panicking VP: "I need you to work all weekend. Marketing just postponed our new lipstick launch by 2 months! We have ₹40Cr of raw materials sitting in the factory and ₹10Cr of production capacity blocked for tomorrow. We are going to lose ₹50 Crores!"',
      amateur:
        '"Oh no, ₹50 crores?! Okay sir, I will cancel tomorrow’s entire factory production right now and tell the team to come in on Saturday and Sunday to figure out how to liquidate the raw materials at a discount!"',
      amateurFlaws: [
        'Matches the boss’s 210 bpm panic instead of stabilizing the room.',
        'Jumps straight to a destructive decision (canceling ₹10Cr of blocked factory capacity) without checking constraints.',
        'Turns a solvable scheduling shift into a guaranteed multi-crore write-off.'
      ],
      tcbBrew:
        '"Got it—let’s look at the numbers before we cancel tomorrow’s line. Three quick questions: First, what is the shelf life of those raw materials? [4 months]. Second, how much quantity does Marketing actually need for launch? [50%]. Third, how much of the raw material can be used in our other products? [30%].\n\nSo a 6-week delay is well within our 4-month shelf life. Instead of canceling production: (1) Let’s produce the required launch quantity using the at-risk raw material first, (2) Repurpose the 30% compatible material into other active lines, and (3) Use tomorrow’s remaining production slot for our fastest-selling existing SKU. Total loss out of ₹50Cr: Zero."',
      tcbStrengths: [
        'Uses 3 surgical clarifying questions to dismantle a ₹50Cr panic in under 90 seconds.',
        'Separates what is truly at risk from what is merely delayed.',
        'Delivers a complete 3-part operational solution that saves the weekend AND protects 100% of company margin.'
      ]
    },
    scenarios: [
      {
        id: 'mu-1',
        context: 'Scenario 1: The 6 PM Friday Crisis Call',
        prompt:
          'Your Director calls in a panic: a major client delayed their rollout by 6 weeks, and ₹40Cr of raw materials + ₹10Cr of factory capacity are scheduled for tomorrow. What is your FIRST move?',
        options: [
          {
            id: 'a',
            text: 'Immediately halt all factory lines to stop spending money, then ask the Director what they want you to do next.',
            isOptimal: false,
            feedback:
              'Halting a blocked production line without checking inventory shelf-life or alternate SKU demand guarantees wasted capacity.'
          },
          {
            id: 'b',
            text: 'Ask 3 calm root-cause clarifying questions (raw material shelf-life, revised launch volume needed, and cross-SKU material compatibility) to separate actual risk from delay.',
            isOptimal: true,
            feedback:
              'Executive precision! Clarifying constraints before prescribing solutions drops the room’s heart rate and uncovers zero-loss options.'
          },
          {
            id: 'c',
            text: 'Blame the Marketing team on the call for not warning Operations earlier.',
            isOptimal: false,
            feedback:
              'Finger-pointing during a live crisis destroys executive presence and solves zero operational problems.'
          }
        ]
      },
      {
        id: 'mu-2',
        context: 'Scenario 2: Escalating a Blocker to Senior Leadership (The 1-3-1 Rule)',
        prompt:
          'Your primary toothpaste-tube supplier suddenly informs you they cannot deliver for the next 10 days, and you only have 7 days of inventory left. How do you brief your VP?',
        options: [
          {
            id: 'a',
            text: '"Our supplier just backed out for 10 days and we only have 7 days of stock! What should we do?"',
            isOptimal: false,
            feedback:
              'This is "dumping the monkey" onto your boss’s desk—you brought raw panic with zero vetted options.'
          },
          {
            id: 'b',
            text: 'Immediately place an order for all 5 lakh tubes with an unvetted backup supplier at a 20% price premium without checking their quality certifications or batch capacity.',
            isOptimal: false,
            feedback:
              'Jumping to a solution without risk assessment! If the backup supplier hasn’t passed quality checks or can only supply 10,000 tubes at a time, you create a bigger crisis.'
          },
          {
            id: 'c',
            text: '"We have a 3-day stockout gap on tube supply (7 days inventory vs 10-day delay). I vetted an alternate supplier (certified quality, ₹1.20/tube vs ₹1.00, 10k batch limit). I recommend we split sourcing: use the alternate supplier strictly to bridge the 3-day gap while retaining our primary supplier for the core volume."',
            isOptimal: true,
            feedback:
              '10/10 Strong Hire thinking! You quantified the exact gap (3 days), vetted quality & capacity constraints, and proposed a de-risked split-sourcing decision.'
          }
        ]
      }
    ],
    brewBuilder: {
      title: 'Live 1-3-1 Executive Escalation Builder',
      instructions:
        'Turn any workplace blocker or crisis into a crisp 1-3-1 Executive Update (1 Quantified Problem, 3 Vetted Variables/Options, 1 Decisive Recommendation).',
      fields: [
        {
          id: 'one_problem',
          label: '1 — The Quantified Constraint (Separate Real Risk from Noise)',
          placeholder: 'e.g., Supplier delay of 10 days against 7 days of inventory creates a 3-day buffer gap',
          defaultValue: 'A 10-day supplier delay against our 7 days of on-hand inventory creates a 3-day stockout exposure on Line A',
          helperText: 'State the exact mathematical gap in one calm sentence.'
        },
        {
          id: 'three_checks',
          label: '3 — The Clarified Variables / Vetted Options',
          placeholder: 'e.g., Vetted backup vendor quality, confirmed 20% cost premium, and checked daily batch capacity',
          defaultValue: 'I have verified (1) raw material shelf-life stability, (2) backup supplier quality certifications, and (3) alternate line capacity of 7,000 units/day',
          helperText: 'Show the homework you already did before escalating.'
        },
        {
          id: 'one_recommendation',
          label: '1 — Your Recommended Decision',
          placeholder: 'e.g., Split the order to bridge the 3-day gap while prioritizing high-margin SKUs',
          defaultValue: 'split the order to bridge the 3-day gap and prioritize our highest-demand SKUs while the primary line resets',
          helperText: 'End with a clear, confident recommendation that only needs a "Yes" from your boss.'
        }
      ]
    }
  }
];
