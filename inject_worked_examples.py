import os

week20_content = """# Session 20: Formal and Informal Letter Writing

---

# Overview

Welcome to Session 20. Today we will be covering **Formal and Informal Letter Writing**.

Mastering professional correspondence is essential for interacting with airport authorities, civil aviation regulators, corporate partners, and passengers.

---

# 4.2.1 Core Concept

* **Format**: Standard full-block format (all elements aligned to the left margin, single-spaced paragraphs with double spacing between blocks).
* **Key Components**: Sender Details, Date, Reference Number, Inside Address, Subject Line, Formal Salutation, Structured Body, Sign-off, and Designation.
* **Formal vs Informal Tone**: Objective, respectful, concise vs conversational, colloquial, and relaxed.
* **Salutations & Sign-offs**:
  * Formal (Name unknown): *Dear Sir / Madam* → *Yours faithfully*
  * Formal (Name known): *Dear Mr. Deshmukh / Dr. Rao* → *Yours sincerely*
  * Semi-Formal / Internal: *Dear Team / Good morning Mr. Kapoor* → *Warm regards / Best regards*

---

# 4.2.2 Application

* **External Regulatory Comms**: Submitting security clearance, airport pass applications, or operational compliance letters to DGCA / BCAS.
* **Corporate & B2B Correspondence**: Drafting inter-airline ground handling agreements, catering contract renewals, and vendor inquiries.
* **Passenger Relations**: Issuing formal liability letters, baggage claim responses, and service recovery commitments.
* **Brand Representation**: A formal letter serves as an official legal and commercial document representing the airline.

---

# 4.2.3 Worked Example 1: Formal Request Letter

### Scenario: Airport Apron Pass Authorization Request to Airport Security

> **SKYLINE AIRWAYS LTD.**  
> Station Operations Office, Terminal 1, Kempegowda International Airport  
> Bengaluru, Karnataka - 560300  
> 
> **Ref:** SKA/BLR/OPS/2026/0419  
> **Date:** 12 October 2026  
> 
> The Chief Security Officer  
> Bureau of Civil Aviation Security (BCAS)  
> Alpha Building, KIA Campus, Devanahalli  
> Bengaluru - 560300  
> 
> **Subject: Request for issuance of Temporary Airfield Security Identification Badges (ASIB)**  
> 
> Dear Sir,  
> 
> I am writing to formally request the issuance of temporary Airfield Security Identification Badges (ASIB) for five newly inducted Ground Handling Executives joining our winter schedule turnaround operations.  
> 
> The candidates have successfully completed mandatory Basic Aviation Security (AVSEC) awareness training and background verification checks conducted by local law enforcement authorities. Their deployment on the apron is scheduled to commence on 1 November 2026.  
> 
> The completed security verification forms, police verification reports, and candidate identity dossiers are enclosed herewith for your review. We request you to kindly grant approval at your earliest convenience to facilitate mandatory airside badge processing.  
> 
> Thank you for your continued support and cooperation.  
> 
> Yours faithfully,  
> *(Signature)*  
> **Rahul Nambiar**  
> Station Manager — Operations  
> Skyline Airways Ltd.  
> *Enclosures: Form 4 (5 sets), AVSEC Certificates (5), Police Verification Copies (5)*

---

# 4.2.4 Worked Example 2: Formal Apology & Service Recovery Letter

### Scenario: Response to Corporate Passenger Regarding Damaged Luggage

> **STARLIGHT AIRLINES — CUSTOMER RELATIONS**  
> Chhatrapati Shivaji Maharaj International Airport, Mumbai - 400099  
> 
> **Ref:** STL/CR/2026/88412  
> **Date:** 14 October 2026  
> 
> Mr. Vikramaditya Sen  
> Managing Director, Apex Technologies Ltd.  
> Nariman Point, Mumbai - 400021  
> 
> **Subject: Formal Apology and Compensation Settlement — Baggage Reference #BOM66291**  
> 
> Dear Mr. Sen,  
> 
> Thank you for bringing the condition of your checked baggage on Flight ST-402 (Delhi to Mumbai, 11 October 2026) to our attention.  
> 
> On behalf of Starlight Airlines, please accept our sincere apologies for the damage sustained by your Samsonite hard-shell suitcase during ramp handling. We hold our baggage operations to the highest industry standards and deeply regret that your experience fell short of expectations.  
> 
> In accordance with our Baggage Liability Policy and carriage terms, we have approved a complete replacement reimbursement of **₹18,500**. The claim payment will be credited to your original corporate card within 3 to 5 business days. As an additional gesture of goodwill, our concierge has upgraded your frequent flyer tier to Platinum for the upcoming quarter.  
> 
> We value your continued trust and look forward to welcoming you aboard again soon.  
> 
> Yours sincerely,  
> *(Signature)*  
> **Ananya Sengupta**  
> Head of Guest Experience & Relations  
> Starlight Airlines India

---

# 4.2.5 Side-by-Side: Formal Letter vs. Internal Memo

| Structural Element | Formal External Letter | Internal Operational Memo |
| :--- | :--- | :--- |
| **Primary Audience** | Regulators (DGCA/BCAS), Corporate Clients, Legal partners | Station colleagues, Ramp crew, Cabin supervisors |
| **Heading / Header** | Full Letterhead + Inside Address + Ref No. | **MEMORANDUM** (TO, FROM, DATE, SUBJECT) |
| **Salutation** | *Dear Mr. Sen / Dear Sir or Madam* | *Team / Colleagues / All Shift Staff* (or none) |
| **Vocabulary & Tone** | Restrained, highly polished, passive/formal voice | Action-oriented, direct, active voice, bulleted |
| **Sign-Off** | *Yours faithfully / Yours sincerely* + Signature | *Regards / Station Ops Lead* + Contact Ext. |
| **Example Subject** | *Request for Tariff Approval for Winter 2026* | *Mandatory Apron PPE Compliance — Shift 2* |

---

# 4.2.6 Practice Exercises

* **Exercise 1 (Formal Inquiry)**: Draft an official letter from an airline training coordinator to a Flight Simulator Academy requesting quotations and slot availability for 12 type-rating recurrent checks.
* **Exercise 2 (Formal Apology)**: Draft a formal letter to an angry passenger whose pet carrier was misrouted, explaining the immediate veterinary care provided and offering full restitution.
* **Exercise 3 (Format Audit)**: Review a poorly aligned sample letter and rectify the indentations, salutation matching, and block punctuation.

---
"""

week21_content = """# Session 21: Professional Email Writing

---

# Overview

Welcome to Session 21. Today we will be covering **Professional Email Writing**.

In modern aviation operations, email is the primary operational link between operations control, flight dispatch, ramp management, airport stakeholders, and corporate leadership.

---

# 4.3.1 Core Concept

* **BLUF Principle**: **Bottom Line Up Front** — State your core message, decision, or required action in the very first sentence. Busy airline managers read emails on mobile devices between turnarounds.
* **High-Impact Subject Lines**:
  * Must specify: `[TAG/URGENCY] Specific Flight/Station + Action Required + Deadline`
  * Example: `[ACTION REQ - 14:00 IST] Bay 12 Refueling Clearance | Flight 6E-104`
* **Formatting for Readability**:
  * Never send a dense "wall of text".
  * Use bolding for deadlines, dates, and aircraft tail numbers.
  * Use bullet points for checklists, passenger counts, and delayed flights.
* **Email Etiquette (The Cardinal Rules)**:
  * **Reply All**: Use ONLY when every single recipient genuinely needs the update.
  * **CC vs BCC**: CC for information; BCC for privacy when mailing large passenger lists.

---

# 4.3.2 Application

* **Flight Dispatch & Ops Handover**: Communicating operational disruptions, weather diversions, and crew duty limits.
* **Ground Operations Coordination**: Coordinating quick turnarounds between fueling, catering, pushback tugs, and engineering.
* **Cross-Departmental Escalations**: Escalating unresolved ramp delays or passenger issues to station management with factual data.
* **Digital Traceability**: Every email serves as an auditable operational timestamp during regulatory incident investigations.

---

# 4.3.3 Worked Example 1: The "Before vs. After" (BLUF Clinic)

### The "Before" (Rambling, Unstructured — Poor Practice):

> **Subject:** Flight problem  
> 
> Hi Sir,  
> Today we had a lot of issues on the ramp because the fuel bowser came late and then the passengers for flight 402 were also boarding slowly because one passenger had three bags which didn't fit in the overhead bin. The cabin crew tried to shift them but couldn't. Then the pushback tug had some hydraulic pressure warning so the driver stopped. Because of all this we missed our slot and now the pilot says we have an ATC delay of 25 minutes. Can you please call Delhi ATC and see if we can get an earlier slot otherwise passenger connections in Delhi will be ruined? Thanks.

### The "After" (Crisp, Action-Oriented BLUF Model):

> **Subject:** [URGENT] Slot Revision Request for AI-402 (BLR-DEL) | Need Approval by 11:20 IST  
> 
> **BLUF:** Requesting Station Manager intervention with Delhi ATC Flow Control to revise departure slot for **AI-402** from **11:45 IST** to **11:25 IST** to protect 42 international transit connections.  
> 
> * **Flight:** AI-402 (VT-EXB, A321) | Bay 18  
> * **Original STD:** 10:55 IST | **Current Slot:** 11:45 IST (+50 min)  
> * **Root Causes of Ground Delay:**  
>   1. Late fuel bowser arrival (+12 min)  
>   2. Gate baggage offload due to cabin bin overflow (+8 min)  
> * **Current Status:** Doors closed, tug connected, aircraft 100% ready for immediate pushback.  
> * **Immediate Action Required:** Call ATC Flow Manager at Ext. 4410 to advance slot release.  
> 
> **Kavita Krishnan** | Turnaround Coordinator, Bay 18 | Ext: 204

---

# 4.3.4 Worked Example 2: Operational Shift Handover Email

### Scenario: Morning Shift Lead handing over to Evening Shift Lead

> **Subject:** HANDOVER REPORT: Terminal 2 Passenger Services (Morning Shift → Evening Shift) | 12 Oct 2026  
> 
> **TO:** evening-leads-blr@skyline.com  
> **CC:** stationmanager-blr@skyline.com  
> 
> **Hi Team,**  
> 
> Below is the operational handover summary for Morning Shift (06:00 – 14:30 IST):  
> 
> **1. Operational Performance:**  
> * Flights Handled: 18 departures, 16 arrivals | On-Time Performance (OTP): **94.4%**  
> * Total Pax: 4,820 | Special Assistance (PRM/Wheelchair): 38 passengers handled smoothly.  
> 
> **2. Disruptions & Ongoing Issues:**  
> * **Flight SK-714 (BLR-BOM):** Delayed 45 mins due to late incoming aircraft. 6 misconnected passengers rebooked on SK-722 (Departing 17:15 IST). Food vouchers distributed.  
> * **Self-Bag Drop Kiosk #04:** Offline due to conveyor sensor error. IT Ticket #49102 logged; technician expected on-site by 15:30 IST.  
> 
> **3. Action Items for Evening Shift:**  
> * [ ] Verify boarding gate readiness for heavy flight SK-101 (London Heathrow, STD 19:30).  
> * [ ] Monitor baggage reconciliation for 6 transit bags on flight SK-722.  
> * [ ] Ensure Kiosk #04 sensor test is witnessed and signed off before 16:30 rush.  
> 
> Good luck with the shift!  
> 
> **Arjun Namboodiri** | Shift Supervisor, Terminal 2 | Skyline Airways

---

# 4.3.5 Subject Line Clinic: Poor vs. High-Impact

| Poor / Vague Subject Line | Why It Fails | Professional / Action-Oriented Subject Line |
| :--- | :--- | :--- |
| `Meeting` | Zero context; recipient doesn't know priority or topic. | `[INVITE] Winter Schedule Turnaround Review | 14 Oct, 11:00 AM (Ops Conf Room)` |
| `Quick question` | Appears trivial; gets ignored during shift turnarounds. | `[URGENT QUERY] DGCA Dangerous Goods Declaration for Flight 312` |
| `Incident` | Alarming but lacks flight number, severity, or location. | `[INCIDENT REPORT] Ramp Scuff on VT-CIO Right Engine Cowling (Bay 24)` |
| `FYI` | Unclear if action is needed; easily deleted or lost. | `[FOR INFO ONLY] Updated Airport Apron Speed Limit Policy (Eff. 1 Nov)` |
| `Delay` | No flight, route, or duration indicated. | `[DELAY NOTIFICATION] SK-502 (BLR-HYD) Delayed 30m | ETA 16:45 IST` |

---

# 4.3.6 Practice Exercises

* **Exercise 1 (BLUF Transformation)**: Take a 150-word disorganized maintenance handover message and condense it into a structured, bulleted email with a clear BLUF header.
* **Exercise 2 (Subject Line Drafting)**: Create 4 subject lines for distinct scenarios: (a) An urgent caterer no-show, (b) Monthly station roster release, (c) Lost passport found at Gate 7, (d) Customer complaint escalation.
* **Exercise 3 (Replying to All Scenario)**: Analyze a real-world case study where a junior agent hit "Reply All" to 500 airport staff members and formulate the correct organizational email protocol.

---
"""

week22_content = """# Session 22: Advanced Email Scenarios

---

# Overview

Welcome to Session 22. Today we will be covering **Advanced Email Scenarios**.

In aviation, high-stakes written communication involves difficult conversations: delivering bad news, calming furious passengers, asserting boundaries, and persuading executive leadership.

---

# 4.4.1 Core Concept

* **Delivering Bad News (The "Sandwich" Method)**:
  1. **Positive Opening**: Validate the relationship, express appreciation, or acknowledge their situation.
  2. **The Pivot & Direct Bad News**: State the hard boundary or negative decision clearly, politely, and without defensive excuses.
  3. **The Constructive Alternative**: Offer actionable next steps, compensation, alternative bookings, or waivers.
* **De-escalation via Text (H.E.A.R.T. in Written Form)**:
  * **H**ear: Paraphrase the passenger's exact frustration so they know they have been understood.
  * **E**mpathize: Acknowledge the emotional impact (*"I completely appreciate how stressful missing your daughter's graduation must be"*).
  * **A**pologize: Express genuine regret for the disruption without making unauthorized legal admissions.
  * **R**esolve: Present concrete solutions and timeframes.
  * **T**hank: Thank them for their patience and for bringing the issue to light.
* **Persuasive Structure (Problem-Solution-Benefit)**:
  * State the operational bottleneck with data → Propose the solution → Quantify the cost vs. ROI benefit.

---

# 4.4.2 Application

* **Service Recovery & Passenger Retention**: Turning disgruntled passengers into long-term brand advocates through high-empathy communication.
* **Commercial & Vendor Negotiations**: Denying unjustified vendor invoices while preserving strategic partnerships.
* **Safety & Regulatory Boundary Setting**: Firmly declining operational compromises that violate DGCA Flight Duty Time Limitations (FDTL) or CAR safety limits.
* **Internal Leadership Proposals**: Securing budget or equipment approval from senior airline management.

---

# 4.4.3 Worked Example 1: Delivering Bad News (The Sandwich Method)

### Scenario: Baggage Delayed on Tight Connection

> **Subject:** Update & Delivery Arrangements: Delayed Baggage for Flight AI-802 (PIR #BLR10482)  
> 
> Dear Mr. Sharma,  
> 
> Thank you for choosing Air India for your journey from Delhi to Bengaluru today. *(Positive Opening)*  
> 
> During your connection in Delhi, your checked bag (Tag #009823) could not be transferred in time due to sudden ramp congestion and was not loaded onto your flight. We sincerely apologize for this disruption and the inconvenience caused upon your arrival. *(Direct Bad News with Empathetic Tone)*  
> 
> We have prioritized your bag on flight AI-804, arriving tonight at 23:45 IST. **You do not need to wait or return to the airport.** Our door-to-door courier service will deliver your bag directly to your hotel (*The Leela Palace*) by 08:30 AM tomorrow at no cost to you. Furthermore, you are entitled to interim emergency expense reimbursement of up to ₹3,500 via the secure claim link below:  
> 
> [🔗 Submit Interim Expense Receipts | Claim #BLR10482] *(Constructive Alternative & Actionable Solution)*  
> 
> We truly value your patience and will keep you updated with live courier dispatch details via SMS. *(Courteous Close)*  
> 
> Warm regards,  
> **Pooja Verma** | Lead — Baggage Guest Services, Kempegowda International Airport

---

# 4.4.4 Worked Example 2: De-escalating an Irate Frequent Flyer

### Scenario: Tier-1 Passenger Furious Over Unannounced Seat Downgrade

> **Subject:** Sincere Apologies & Seat Reassignment Details for Flight 6E-2401 (PNR: K8J2PQ)  
> 
> Dear Dr. Mehta,  
> 
> I am writing directly to address your experience regarding your seat reassignment on this morning's flight 6E-2401 from Mumbai to Chennai.  
> 
> I completely understand your intense frustration upon discovering that your pre-booked Emergency Exit seat (12A) was altered to a middle seat (18B) at the boarding gate. After a grueling week of surgeries, the last thing you should have encountered was unexpected discomfort and a lack of clear advance communication from our gate team. *(Hear & Empathize)*  
> 
> Please accept my personal and sincere apologies for this failure in our service standards. Due to an unavoidable last-minute aircraft substitution for mandatory engine safety checks, the replacement aircraft featured a different cabin layout with fewer extra-legroom seats. *(Apologize with Transparency, not Excuses)*  
> 
> To make this right, we have taken the following immediate steps:  
> 1. Processed a **100% refund of your seat reservation fee** (₹1,200), credited within 48 hours.  
> 2. Credited **5,000 Bonus Travel Points** to your 6E Rewards account.  
> 3. Blocked Emergency Exit seat 12F with complimentary Priority Boarding for your return flight 6E-2408 on Sunday. *(Resolve)*  
> 
> Thank you for taking the time to share your candid feedback. It allows us to train our boarding teams to communicate gauge changes with greater empathy and advance notice. *(Thank)*  
> 
> Respectfully yours,  
> **Rohit Manchanda** | Regional Guest Experience Manager, Western Region

---

# 4.4.5 Worked Example 3: Urgent Internal Escalation (BLUF)

### Scenario: Ramp Supervisor Escalating Maintenance Clearance Before ATC Slot Loss

> **Subject:** [URGENT - ACTION REQUIRED BY 14:15] Engineering Sign-Off for VT-ANQ / Flight 6E-241 (Bay 14)  
> 
> **BLUF:** Flight 6E-241 requires immediate Shift Lead Engineer sign-off on the Technical Logbook (Right Forward Door Seal Inspection) by **14:15 IST** to avoid losing our ATC departure slot and incurring a 45-minute flow penalty.  
> 
> * **Aircraft:** VT-ANQ (A320neo) | Bay 14  
> * **Scheduled Departure:** 14:25 IST | **ATC Slot Release:** 14:32 IST  
> * **Status:** Cabin boarding completed (180/180 passengers seated). Refueling and cargo loading 100% complete.  
> * **Blocker:** Physical technician inspection completed, but aircraft tech log requires licensed AME signature.  
> * **Required Action:** Shift Lead AME to report to Bay 14 cockpit or sign digital logbook immediately.  
> 
> For instant confirmation, please radio Ramp Lead on **Channel 4** or call mobile **+91-98450-XXXXX**.  
> 
> **Siddharth Nair** | Senior Ramp Operations Supervisor, Terminal 1

---

# 4.4.6 Worked Example 4: Persuasive Proposal to Senior Leadership

### Scenario: Proposing Handheld Barcode Scanners for Ground Handling Teams

> **Subject:** Business Proposal: Adoption of Ruggedized Handheld Scanners for Tarmac Turnarounds  
> 
> Dear Mr. Singhal,  
> 
> **Executive Summary:**  
> I am submitting a proposal to equip our Bangalore apron team with 8 ruggedized handheld baggage barcode scanners. This initiative will cut average aircraft turnaround time by **4.2 minutes** and eliminate manual baggage misrouting penalties.  
> 
> **1. The Problem:**  
> Currently, ramp handlers manually verify physical bag tags against paper manifests in poor lighting and bad weather. In September alone, this caused:  
> * 14 baggage misloads resulting in ₹4.2 Lakhs in courier restitution costs.  
> * Cumulative turnaround delays of 310 minutes across 42 flights.  
> 
> **2. The Proposed Solution:**  
> Deploying 8 Zebra TC57 Android rugged scanners integrated directly with our SITA BagManager system. Baggage handlers can scan tags at the conveyor belt in real-time, receiving instant audible confirmation.  
> 
> **3. Financial & Operational ROI:**  
> * **Capital Outlay:** ₹3.6 Lakhs (One-time hardware and dock procurement).  
> * **Monthly Savings:** ₹2.8 Lakhs in eliminated courier costs and OTP delay penalties.  
> * **Payback Period:** Under **45 days**.  
> 
> **Requested Next Step:**  
> I request a brief 15-minute slot during the Tuesday Operations Committee meeting to present the live unit demo.  
> 
> Best regards,  
> **Tanvi Kulkarni** | Assistant Manager — Process Optimization & Ground Ops

---

# 4.4.7 Practice Scenarios

* **Case 1 (Bad News - Delay)**: Write an email to the corporate travel desk of an MNC informing them that their chartered executive flight is delayed by 3 hours due to VIP airspace closure at Delhi. Use the Sandwich method.
* **Case 2 (De-escalation)**: A passenger's fragile musical instrument was damaged despite carrying a "Fragile" tag. Draft an empathetic, non-defensive email response using the H.E.A.R.T. framework.
* **Case 3 (Persuasion)**: Draft a persuasive email to the Airport Commercial Director requesting a 30-minute extension of night apron parking slots during peak festival charters.

---
"""

base_paths = [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1'
]

for bp in base_paths:
    os.makedirs(bp, exist_ok=True)
    with open(os.path.join(bp, 'week20.md'), 'w', encoding='utf-8') as f:
        f.write(week20_content)
    with open(os.path.join(bp, 'week21.md'), 'w', encoding='utf-8') as f:
        f.write(week21_content)
    with open(os.path.join(bp, 'week22.md'), 'w', encoding='utf-8') as f:
        f.write(week22_content)

print("Successfully injected worked-out example slides for Sessions 20, 21, and 22 into both BBA and B.Sc paths!")
