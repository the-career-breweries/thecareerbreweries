export interface CrisisTurn {
  id: number;
  bossLine: string;
  bossPanicBpm: number;
  options: {
    id: string;
    label: string;
    employeeResponse: string;
    isOptimal: boolean;
    resultingBpm: number;
    coachNote: string;
  }[];
}

export interface RubricCaseStep {
  stepNumber: number;
  interviewerPrompt: string;
  rubricBadge: string;
  options: {
    id: string;
    candidateLine: string;
    isOptimal: boolean;
    buzzerLabel?: string;
    feedback: string;
  }[];
}

export interface ExecutiveCaseSimulation {
  id: string;
  title: string;
  hookBanner: string;
  roleContext: string;
  rubricBadges: string[];
  steps: RubricCaseStep[];
  takeaway: string;
}

export const FRIDAY_6PM_CRISIS_TURNS: CrisisTurn[] = [
  {
    id: 1,
    bossLine:
      'Boss (Friday 6:00 PM): "Hey, I want you to work on the weekend. We have a massive problem—Marketing just postponed our new Lakme lipstick launch by 2 months, and tomorrow’s factory production is already scheduled. We have ₹40 Crores of raw materials sitting idle and ₹10 Crores of blocked production capacity. We are going to lose ₹50 Crores!"',
    bossPanicBpm: 215,
    options: [
      {
        id: 'panic',
        label: 'Panic & Cancel Everything',
        employeeResponse: '"₹50 Crores?! Okay sir, I will cancel tomorrow’s factory run immediately and work all weekend to liquidate the raw materials!"',
        isOptimal: false,
        resultingBpm: 220,
        coachNote: '❌ You matched your boss’s panic and guaranteed a ₹10Cr capacity write-off without checking a single constraint.'
      },
      {
        id: 'clarify-shelf-life',
        label: 'Ask Root-Cause Question #1 (Shelf Life & Launch Volume)',
        employeeResponse: '"Got it, that makes sense why it looks alarming. Before we cancel tomorrow’s run, two quick questions: What is the shelf life of the raw materials right now, and how much quantity does Marketing actually need for the launch?"',
        isOptimal: true,
        resultingBpm: 165,
        coachNote: '✅ Calm, structured scoping! You immediately lowered the room’s heart rate from 215 bpm to 165 bpm.'
      }
    ]
  },
  {
    id: 2,
    bossLine:
      'Boss: "The shelf life of the raw materials is 4 months, and Marketing only expects half (50%) of the original launch quantity now. Fine, but we still have ₹40 Crores of raw material sitting there!"',
    bossPanicBpm: 165,
    options: [
      {
        id: 'reframe-and-repurpose',
        label: 'Ask Root-Cause Question #2 (Cross-SKU Compatibility & Reframe Delay)',
        employeeResponse: '"Wait—if shelf life is 4 months, then a 6-week launch delay isn’t actually destroying our inventory! We still have enough shelf life for launch. One more question: how much of these raw materials can we use for our other existing products?"',
        isOptimal: true,
        resultingBpm: 120,
        coachNote: '✅ Brilliant reframe! You separated a timing shift (6 weeks < 4 months shelf life) from an actual write-off.'
      },
      {
        id: 'halve-production',
        label: 'Cut Production by 50% & Leave Factory Idle',
        employeeResponse: '"Okay, then let’s just produce 50% tomorrow and leave the rest of the factory line idle."',
        isOptimal: false,
        resultingBpm: 175,
        coachNote: '❌ Leaving half the blocked factory capacity idle still wastes crores in fixed production slots.'
      }
    ]
  },
  {
    id: 3,
    bossLine:
      'Boss: "About 30% of the raw materials can be used in our other products. So you wouldn’t cancel production tomorrow? What would you do with the remaining factory slot?"',
    bossPanicBpm: 120,
    options: [
      {
        id: 'three-part-plan',
        label: 'Deliver the 3-Part Zero-Loss Operational Plan',
        employeeResponse: '"I wouldn’t cancel production completely. (1) Produce the 50% quantity we need for the launch using the at-risk raw material first, (2) Repurpose the 30% compatible material for our other products right now, and (3) Use the remaining tomorrow’s production slot for an existing fast-selling SKU that needs capacity. Total loss out of ₹50 Crore: Zero."',
        isOptimal: true,
        resultingBpm: 85,
        coachNote: '🏆 Masterclass! Boss: "Okay, I’m so relieved. How much of that ₹50Cr are we losing now? None!" Heart rate back to 85 bpm—and your weekend is saved.'
      },
      {
        id: 'wait-for-monday',
        label: 'Defer to Marketing on Monday',
        employeeResponse: '"Let’s pause the factory tomorrow and ask Marketing on Monday what they want to do with the slot."',
        isOptimal: false,
        resultingBpm: 155,
        coachNote: '❌ Tomorrow’s production slot is already paid for—waiting until Monday wastes the slot.'
      }
    ]
  }
];

export const EXECUTIVE_CASE_SIMULATIONS: ExecutiveCaseSimulation[] = [
  {
    id: 'amul-factory',
    title: 'Case 01: Amul Ice Cream Factory Manager (Quality Defect Crisis)',
    hookBanner: 'THIS CANDIDATE ALMOST GOT REJECTED—CAN YOU SCORE 10/10?',
    roleContext:
      'You are the Factory Manager for Amul Ice Cream. Your factory produces 10,000 tubs of ice cream every day. Yesterday, your quality team found that 2% of the tubs had a packaging defect.',
    rubricBadges: [
      'Clarifying Question',
      'Problem Framing',
      'Risk Assessment',
      'Decision Making (SKU Priority)'
    ],
    steps: [
      {
        stepNumber: 1,
        interviewerPrompt:
          'Interviewer: "Yesterday your quality team found that 2% of the 10,000 daily tubs had a packaging defect. What is your first move?"',
        rubricBadge: 'Clarifying Question',
        options: [
          {
            id: 'a',
            candidateLine: '"Were the ice cream tubs themselves contaminated, or is it strictly an external packaging issue?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Crucial first check: separate food-safety contamination risk from mechanical packaging risk.'
          },
          {
            id: 'b',
            candidateLine: '"I would immediately recall all ice cream shipped over the last month and shut down the plant."',
            isOptimal: false,
            buzzerLabel: '❌ Jumped to Panic Recall',
            feedback: '🚨 Buzzer! Never trigger a plant shutdown before asking whether the product inside is contaminated.'
          }
        ]
      },
      {
        stepNumber: 2,
        interviewerPrompt:
          'Interviewer: "No, the ice cream is perfectly fine. The issue is that the packaging seal isn’t reliable. What do you do?"',
        rubricBadge: 'Problem Framing',
        options: [
          {
            id: 'a',
            candidateLine: '"Then I would stop all factory production immediately until we identify the cause."',
            isOptimal: false,
            buzzerLabel: '❌ Poor Problem Framing',
            feedback: '🚨 Buzzer! Stopping all production immediately costs 10,000 tubs/day before you even check inventory buffers or whether the defect is isolated to one machine.'
          },
          {
            id: 'b',
            candidateLine: '"Since seal failure causes leakage in distribution, I first want to check how many days of inventory buffer we have while we isolate the faulty line."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) You balanced distribution leakage risk against losing 10,000 tubs/day of output.'
          }
        ]
      },
      {
        stepNumber: 3,
        interviewerPrompt:
          'Interviewer: "We have around 2 days of inventory. Should we just keep producing normally on all lines while we investigate, even though the defect could affect more tubs?"',
        rubricBadge: 'Risk Assessment',
        options: [
          {
            id: 'a',
            candidateLine: '"No—I would first isolate the affected production batch and test whether the seal defect is spreading across the entire line or coming from one specific machine."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Surgical risk containment! We discover the defect started on a single packaging machine that was changed yesterday.'
          },
          {
            id: 'b',
            candidateLine: '"Yes, since it is only 2%, let’s keep running at 100% and let retailers return any leaky tubs."',
            isOptimal: false,
            buzzerLabel: '❌ Ignored Brand Risk',
            feedback: '🚨 Buzzer! Shipping leaky dairy tubs ruins distributor trust and cold-chain hygiene.'
          }
        ]
      },
      {
        stepNumber: 4,
        interviewerPrompt:
          'Interviewer: "Good. You stop that faulty machine, quarantine yesterday’s batch for inspection, and switch to the backup line—but the backup line can only produce 7,000 tubs/day instead of 10,000. How do you handle the 3,000-tub shortfall?"',
        rubricBadge: 'Decision Making (SKU Priority)',
        options: [
          {
            id: 'a',
            candidateLine: '"I would prioritize our highest-demand SKUs (Stock Keeping Units), top-margin products, and core locations using the 7,000-tub capacity + our 2-day inventory buffer while we fix the machine."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Perfect commercial decision-making under capacity constraints!'
          },
          {
            id: 'b',
            candidateLine: '"I would cut every flavour and every retailer’s order by 30% across the board."',
            isOptimal: false,
            buzzerLabel: '❌ Blind Uniform Cut',
            feedback: '🚨 Buzzer! Cutting high-velocity flagship SKUs equally with slow-moving flavours hurts revenue.'
          }
        ]
      }
    ],
    takeaway: 'Never shut down an entire operation before isolating the batch, checking inventory buffer, and prioritizing high-demand SKUs.'
  },
  {
    id: 'colgate-supply-chain',
    title: 'Case 02: Colgate Toothpaste 10-Day Supplier Disruption',
    hookBanner: 'UNEXPECTED SUPPLY CHAIN QUESTION STUNS CANDIDATES',
    roleContext:
      'You are managing the supply chain for Colgate toothpaste. Your primary toothpaste-tube supplier tells you they cannot deliver for the next 10 days.',
    rubricBadges: [
      'Critical Thinking (Inventory Gap)',
      'Avoid Premature Jump',
      'Supplier Risk Assessment',
      'Viable Split-Sourcing Solution'
    ],
    steps: [
      {
        stepNumber: 1,
        interviewerPrompt:
          'Interviewer: "Your toothpaste tube supplier tells you they can’t deliver for the next 10 days. What is your first question?"',
        rubricBadge: 'Critical Thinking (Inventory Gap)',
        options: [
          {
            id: 'a',
            candidateLine: '"How many days of tube inventory do we currently have on hand?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Always quantify the buffer first. Interviewer: "We have 7 days of inventory—so a 3-day stockout exposure."'
          },
          {
            id: 'b',
            candidateLine: '"I would sue the supplier for breach of contract immediately."',
            isOptimal: false,
            buzzerLabel: '❌ Zero Operational Value',
            feedback: '🚨 Buzzer! Legal threats don’t keep factory lines running next week.'
          }
        ]
      },
      {
        stepNumber: 2,
        interviewerPrompt:
          'Interviewer: "We have 7 days of inventory. There is an alternate supplier available who charges ₹1.20 per tube (vs our current supplier’s ₹1.00). Do you place the full order with them immediately?"',
        rubricBadge: 'Avoid Premature Jump',
        options: [
          {
            id: 'a',
            candidateLine: '"Yes, place the order immediately—paying a 20% premium is worth avoiding a stockout!"',
            isOptimal: false,
            buzzerLabel: '❌ Jumped to Solution',
            feedback: '🚨 Buzzer! What if this vendor has never supplied Colgate before and fails quality specs or batch volume?'
          },
          {
            id: 'b',
            candidateLine: '"Before placing the order at a 20% premium, has this supplier ever supplied us before, and What is their quality & capacity profile?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) You resisted the urge to jump blindly at the first option!'
          }
        ]
      },
      {
        stepNumber: 3,
        interviewerPrompt:
          'Interviewer: "They have NEVER supplied us before. What do you check before wiring them an order?"',
        rubricBadge: 'Supplier Risk Assessment',
        options: [
          {
            id: 'a',
            candidateLine: '"I would first verify their quality certifications, material grade, and whether their tubes meet our filling-line specifications."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Vetting specs prevents buying 5 lakh unusable tubes.'
          },
          {
            id: 'b',
            candidateLine: '"Ask them for a 10% discount since we are a big brand."',
            isOptimal: false,
            buzzerLabel: '❌ Missed Quality Risk',
            feedback: '🚨 Buzzer! Price negotiation is useless if uncertified tubes jam your factory machines.'
          }
        ]
      },
      {
        stepNumber: 4,
        interviewerPrompt:
          'Interviewer: "Assume they pass quality checks—but they can only supply 10,000 tubes at a time, whereas we need 5 lakh tubes. What is your move?"',
        rubricBadge: 'Viable Split-Sourcing Solution',
        options: [
          {
            id: 'a',
            candidateLine: '"I would split the requirement: use the alternate supplier’s 10,000-unit batches at ₹1.20 strictly to bridge the critical 3-day stockout gap on priority lines, while keeping our core volume with the existing supplier once they resume on Day 10."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Partial de-risking via split sourcing! Score: 10/10 Strong Hire.'
          },
          {
            id: 'b',
            candidateLine: '"Cancel the existing supplier permanently and wait 50 batches for the small vendor."',
            isOptimal: false,
            buzzerLabel: '❌ Math Breakdown',
            feedback: '🚨 Buzzer! A 10,000-unit vendor cannot replace a 5-lakh industrial supply chain.'
          }
        ]
      }
    ],
    takeaway: 'Quantify the buffer gap first (10 days vs 7 days), vet uncertified vendors before ordering, and use split-sourcing when backup capacity is capped.'
  },
  {
    id: 'mumbai-1-rupee-house',
    title: 'Case 03: The ₹1 Mumbai House Investment Trap',
    hookBanner: 'I STILL CAN’T BELIEVE THE INTERVIEWER ASKED THIS',
    roleContext:
      'You are offered a house in Mumbai for just ₹1. Would you buy it or not?',
    rubricBadges: [
      'Clarifying Objective',
      'Unit Economics & Liabilities',
      'Clarifying Legalities',
      'End-to-End Decision Making'
    ],
    steps: [
      {
        stepNumber: 1,
        interviewerPrompt:
          'Interviewer: "You are offered a house in Mumbai for just 1 rupee. Would you buy it or not?"',
        rubricBadge: 'Clarifying Objective',
        options: [
          {
            id: 'a',
            candidateLine: '"Before I decide, can I understand our objective—are we trying to maximize financial profit by renting or selling it?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Never fall for an anchor price (₹1) before defining the objective and exit route (selling for profit).'
          },
          {
            id: 'b',
            candidateLine: '"Of course! A house in Mumbai for ₹1 is free money—I would sign immediately."',
            isOptimal: false,
            buzzerLabel: '❌ Fell for the Bait',
            feedback: '🚨 Buzzer! Naive buyers look only at purchase price and ignore hidden liabilities.'
          }
        ]
      },
      {
        stepNumber: 2,
        interviewerPrompt:
          'Interviewer: "Objective is to sell for profit. The house is 70 years old, needs ₹50 Lakhs of renovation to be livable, and can sell for ₹3 Crores after renovation. Do you buy it?"',
        rubricBadge: 'Unit Economics & Liabilities',
        options: [
          {
            id: 'a',
            candidateLine: '"₹3Cr exit minus ₹50L renovation looks attractive—but are there any outstanding loans, unpaid taxes, or legal liabilities attached to the property?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Smart due diligence! Interviewer reveals: "Yes, ₹80 Lakhs in outstanding liabilities."'
          },
          {
            id: 'b',
            candidateLine: '"Yes! ₹3 Crores minus ₹50 Lakhs is ₹2.5 Crores net profit—let’s buy it!"',
            isOptimal: false,
            buzzerLabel: '❌ Skipped Due Diligence',
            feedback: '🚨 Buzzer! When someone sells a ₹3Cr asset for ₹1, there is always a hidden liability or legal covenant.'
          }
        ]
      },
      {
        stepNumber: 3,
        interviewerPrompt:
          'Interviewer: "Even with ₹80L liabilities + ₹50L renovation (₹1.3Cr total cost), a ₹3Cr sale still leaves ₹1.7Cr profit. What else do you check before signing?"',
        rubricBadge: 'Clarifying Legalities',
        options: [
          {
            id: 'a',
            candidateLine: '"Are there any legal or heritage restrictions on what renovations we are allowed to do to the property?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) The killer question! Interviewer reveals: "Since it is an ancestral/heritage property, major renovations are legally prohibited—only minor repairs allowed."'
          },
          {
            id: 'b',
            candidateLine: '"Nothing else—₹1.7Cr profit margin is huge, I’ll buy it today."',
            isOptimal: false,
            buzzerLabel: '❌ Missed Regulatory Blocker',
            feedback: '🚨 Buzzer! You just bought an unlivable 70-year-old building that you are legally barred from renovating.'
          }
        ]
      },
      {
        stepNumber: 4,
        interviewerPrompt:
          'Interviewer: "Without major renovations, nobody can live in it and we cannot realize the ₹3Cr price. What is your final verdict and why?"',
        rubricBadge: 'End-to-End Decision Making',
        options: [
          {
            id: 'a',
            candidateLine: '"I would NOT buy it. Because the ₹3 Crore exit value depends on a major renovation we cannot legally execute—making the ₹1 purchase price completely irrelevant while saddling us with ₹80 Lakhs of debt."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Crystal-clear synthesis! Final Score: 10/10 Strong Hire.'
          },
          {
            id: 'b',
            candidateLine: '"I would still buy it for ₹1 and hope the law changes someday."',
            isOptimal: false,
            buzzerLabel: '❌ Sunk Liability Trap',
            feedback: '🚨 Buzzer! Taking on ₹80 Lakhs of immediate liabilities on pure hope is terrible capital allocation.'
          }
        ]
      }
    ],
    takeaway: 'The headline price (₹1) is irrelevant if legal constraints block the value-unlock mechanism while transferring ₹80L of liabilities onto your balance sheet.'
  },
  {
    id: 'dinosaur-curveball',
    title: 'Case 04: The Real Dinosaur Executive Curveball',
    hookBanner: 'THE DUMBEST INTERVIEW QUESTION... OR IS IT 🤯?',
    roleContext:
      'Your consulting client finds a real dinosaur. What will you advise them to do with it?',
    rubricBadges: [
      'Questioning Objective',
      'Clarifying 5 Constraints',
      'Practical Strategic Options',
      'Enterprise Unit-Economics Thinking'
    ],
    steps: [
      {
        stepNumber: 1,
        interviewerPrompt:
          'Interviewer: "So let’s say your client finds a real dinosaur. What will you advise them to do with it?"',
        rubricBadge: 'Questioning Objective',
        options: [
          {
            id: 'a',
            candidateLine: '"Before I recommend anything, can I understand the client’s business and objective—are they trying to maximize profit from the dinosaur, or is there another goal?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Zero panic at a bizarre prompt! Interviewer: "They own an amusement park and want to maximize profit."'
          },
          {
            id: 'b',
            candidateLine: '"Donate it to the government museum immediately because dinosaurs are dangerous."',
            isOptimal: false,
            buzzerLabel: '❌ Assumed Objective',
            feedback: '🚨 Buzzer! Never give advice before discovering who the client is and what they are optimizing for.'
          }
        ]
      },
      {
        stepNumber: 2,
        interviewerPrompt:
          'Interviewer: "They own an amusement park and want to maximize profit. What questions do you ask before advising them?"',
        rubricBadge: 'Clarifying 5 Constraints',
        options: [
          {
            id: 'a',
            candidateLine: '"I have 5 scoping questions: (1) Is the dinosaur alive? (2) Is it legal to own and display? (3) What is the annual maintenance cost? (4) How big is it? (5) How much could we sell it for today?"',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Structured 5-point scoping! Answers: Alive, Legal, ₹2Cr/year maintenance, 30ft tall, ₹8Cr immediate sale value.'
          },
          {
            id: 'b',
            candidateLine: '"What colour is the dinosaur and what species is it?"',
            isOptimal: false,
            buzzerLabel: '❌ Trivia Over Economics',
            feedback: '🚨 Buzzer! Focus on feasibility, legality, CapEx/OpEx, and liquidation value.'
          }
        ]
      },
      {
        stepNumber: 3,
        interviewerPrompt:
          'Interviewer: "It’s alive, legal, 30ft tall, costs ₹2Cr/year to maintain, and can be sold today for ₹8Cr. How do you structure their options?"',
        rubricBadge: 'Practical Strategic Options',
        options: [
          {
            id: 'a',
            candidateLine: '"I would present two clear options: Option 1 is sell it immediately for an ₹8 Crore guaranteed return. Option 2 is keep it as the centerpiece attraction of their amusement park if incremental visitor profits exceed the ₹2Cr annual maintenance cost."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Clean Mutually Exclusive (Liquidate vs. Operate) framing!'
          },
          {
            id: 'b',
            candidateLine: '"Definitely sell it for ₹8Cr because ₹2Cr maintenance is too expensive."',
            isOptimal: false,
            buzzerLabel: '❌ Ignored Cash-Flow Upside',
            feedback: '🚨 Buzzer! What if the dinosaur brings ₹15Cr/year in new ticket sales?'
          }
        ]
      },
      {
        stepNumber: 4,
        interviewerPrompt:
          'Interviewer: "Perfect. So which option would you ultimately tell the CEO to pick?"',
        rubricBadge: 'Enterprise Unit-Economics Thinking',
        options: [
          {
            id: 'a',
            candidateLine: '"I wouldn’t decide on the ₹8Cr sale figure alone. I would model (Incremental Visitors × Revenue Per Visitor − ₹2Cr Operating Cost) over its expected lifespan, and compare that Net Present Value against the ₹8Cr immediate sale."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) 10/10 STRONG HIRE! That is true CEO-level enterprise thinking.'
          },
          {
            id: 'b',
            candidateLine: '"Flip a coin between ₹8Cr cash today and keeping it."',
            isOptimal: false,
            buzzerLabel: '❌ No Decision Equation',
            feedback: '🚨 Buzzer! Always leave the interviewer with the exact unit-economics equation that governs the decision.'
          }
        ]
      }
    ],
    takeaway: 'Curveball questions test whether you stay calm, clarify the client’s objective first, scope legal/cost constraints, and compare liquidation value against recurring cash flow.'
  },
  {
    id: 'maggi-dilemma',
    title: 'Case 05: The Maggi Dilemma (Cost vs. Lead Time Optimization)',
    hookBanner: '98% OF PEOPLE GIVE THE WRONG ANSWER TO THIS QUESTION',
    roleContext:
      'You are the Supply Chain Manager for Maggi noodles packaging wrapper film. Your existing supplier provides packets at ₹100/kg with a 7-day lead time. A new supplier offers the exact same wrapper at ₹80/kg (20% cheaper), but with a 30-day lead time (4x longer). How do you decide?',
    rubricBadges: [
      'Inventory Carrying Cost Calculation',
      'Demand Volatility & Stockout Risk',
      'Strategic Split Sourcing (80/20)',
      'Total Cost of Ownership (TCO) Synthesis'
    ],
    steps: [
      {
        stepNumber: 1,
        interviewerPrompt:
          'Interviewer: "A new supplier offers you ₹80/kg vs ₹100/kg (a massive 20% discount!), but takes 30 days to deliver vs 7 days. Should we switch 100% of our orders to the new supplier immediately to save 20%?"',
        rubricBadge: 'Inventory Carrying Cost Calculation',
        options: [
          {
            id: 'a',
            candidateLine: '"No, not 100%. Moving from a 7-day to a 30-day lead time forces us to hold 4x more safety stock and working capital in our warehouses. If the inventory carrying cost, storage rent, and working capital interest exceed the 20% unit savings, we actually lose money."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Procurement 101! Purchase price is only one part of Total Cost of Ownership (TCO).'
          },
          {
            id: 'b',
            candidateLine: '"Yes, switch 100% immediately! A 20% direct margin reduction on raw material is huge for FMCG."',
            isOptimal: false,
            buzzerLabel: '❌ Ignored Working Capital',
            feedback: '🚨 Buzzer! 30-day lead time ties up crores in safety stock and leaves zero flexibility if demand spikes.'
          }
        ]
      },
      {
        stepNumber: 2,
        interviewerPrompt:
          'Interviewer: "What if Maggi launches an unexpected monsoon ad campaign and demand surges by 40% next week? What happens under the 30-day supplier?"',
        rubricBadge: 'Demand Volatility & Stockout Risk',
        options: [
          {
            id: 'a',
            candidateLine: '"We would face an immediate nationwide stockout. A 30-day supplier cannot react to a demand surge in 7 days. Empty supermarket shelves cost far more in brand loss and retailer penalties than the ₹20/kg saving."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Spot on! Agility and shelf availability in FMCG are sacred.'
          },
          {
            id: 'b',
            candidateLine: '"Tell supermarkets to wait 30 days until our cheaper shipments arrive from the new vendor."',
            isOptimal: false,
            buzzerLabel: '❌ Retailer Backlash',
            feedback: '🚨 Buzzer! Competitors like Yippee and Top Ramen will capture Maggi’s shelf space permanently.'
          }
        ]
      },
      {
        stepNumber: 3,
        interviewerPrompt:
          'Interviewer: "So should we just reject the new supplier and stay 100% with our existing ₹100/kg supplier with the 7-day lead time?"',
        rubricBadge: 'Strategic Split Sourcing (80/20)',
        options: [
          {
            id: 'a',
            candidateLine: '"Neither extreme! I would use a Strategic Split-Sourcing Model: contract 70% to 80% of our predictable baseline demand to the ₹80/kg supplier planned 30 days in advance to capture the 20% margin upside, while keeping 20% to 30% with the agile ₹100/kg 7-day supplier as a dynamic buffer."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) Masterful executive supply chain strategy! High margin + Zero stockout risk.'
          },
          {
            id: 'b',
            candidateLine: '"Yes, stay 100% with current supplier because safety is always more important than cost."',
            isOptimal: false,
            buzzerLabel: '❌ Left 20% Margin Uncaptured',
            feedback: '🚨 Buzzer! Throwing away a 20% cost reduction on high-volume baseline demand is lazy procurement.'
          }
        ]
      },
      {
        stepNumber: 4,
        interviewerPrompt:
          'Interviewer: "Brilliant. How would you summarize this strategic procurement decision to the Chief Supply Chain Officer in 30 seconds?"',
        rubricBadge: 'Total Cost of Ownership (TCO) Synthesis',
        options: [
          {
            id: 'a',
            candidateLine: '"I recommend an 80/20 Split-Sourcing Strategy. We capture direct unit savings on our stable base volume with the 30-day supplier at ₹80/kg, while maintaining our 7-day supplier at ₹100/kg as an agile shock-absorber for demand volatility and zero-stockout guarantee."',
            isOptimal: true,
            feedback: '🔔 Ding! (+2.5 pts) 10/10 STRONG HIRE! You balanced Cost, Working Capital, and Agility.'
          },
          {
            id: 'b',
            candidateLine: '"We will order half and half and see which supplier we like better after six months."',
            isOptimal: false,
            buzzerLabel: '❌ Unscientific 50/50 Guess',
            feedback: '🚨 Buzzer! Baseline vs. Buffer sizing must be tied to forecast predictability, not random guessing.'
          }
        ]
      }
    ],
    takeaway: 'Never pick between price and lead-time in extremes. Use an 80/20 split: low-cost long-lead supplier for predictable baseline volume, and agile short-lead supplier for volatility buffer.'
  }
];
