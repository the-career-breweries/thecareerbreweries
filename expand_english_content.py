import os

# Dictionary mapping week number to [Slide 1 bullet points, Slide 2 bullet points, Slide 3 bullet points]
content_map = {
    1: [
        "* **Nouns**: Identify people, places, things, or concepts (e.g., Captain, Tarmac, Safety).\n* **Pronouns**: Replace nouns to avoid repetitive text (e.g., He, She, They, It).\n* **Adjectives**: Modify and describe nouns to add specific detail (e.g., *Heavy* turbulence).",
        "* **Precision**: Use specific nouns (e.g., 'Boeing 737' instead of 'Plane') in professional logs.\n* **Clarity**: Ensure pronouns clearly refer to the correct subject to prevent critical miscommunications.\n* **Objectivity**: Avoid emotional adjectives in incident reports.",
        "* **Identify**: Highlight all nouns, pronouns, and adjectives in the provided flight manifest.\n* **Rewrite**: Correct the ambiguous pronouns in the sample email.\n* **Apply**: Draft a 3-sentence description of the classroom using precise vocabulary."
    ],
    2: [
        "* **Verbs**: Indicate actions or states of being (e.g., Fly, Inspect, Is).\n* **Adverbs**: Modify verbs, adjectives, or other adverbs (e.g., Fly *smoothly*, *Very* fast).\n* **Prepositions & Conjunctions**: Link words and show relationships (e.g., *In* the cabin, *And*, *But*).",
        "* **Action**: Use strong, active verbs in operational manuals rather than passive voice.\n* **Direction**: Pay strict attention to prepositions of direction and location (e.g., *To* the runway vs *From* the runway).\n* **Flow**: Use conjunctions to combine short, choppy sentences safely.",
        "* **Exercise 1**: Fill in the correct prepositions in the ATC transcript.\n* **Exercise 2**: Convert passive sentences to active verbs.\n* **Group Task**: Write a 5-step procedure using coordinating conjunctions."
    ],
    3: [
        "* **Simple Present**: Facts, habits, schedules (e.g., 'The flight departs at 10:00').\n* **Present Continuous**: Actions happening right now (e.g., 'We are boarding').\n* **Present Perfect**: Past actions with present relevance (e.g., 'The pilot has arrived').",
        "* **Daily Ops**: Routine daily logs rely heavily on the simple present tense.\n* **Live Updates**: Live updates to ATC or ground crew use present continuous.\n* **Handovers**: Shift handover reports often utilize present perfect to summarize completed prep work.",
        "* **Exercise 1**: Conjugate given verbs into all three present tenses.\n* **Exercise 2**: Write a live status update for a delayed flight using present continuous.\n* **Discussion**: When should you never use continuous tenses?"
    ],
    4: [
        "* **Simple Past**: Completed actions at a specific time (e.g., 'The plane landed').\n* **Past Continuous**: Interrupted past actions (e.g., 'I was inspecting the gear when...').\n* **Future Tenses**: Schedules, plans, or predictions (e.g., 'We will depart shortly').",
        "* **Incident Reports**: Must maintain strict consistency in past tenses to accurately reflect timelines.\n* **Passenger Announcements**: Rely heavily on clear future tenses to set expectations.\n* **Shift Briefings**: Combining past review and future forecasting.",
        "* **Exercise 1**: Convert a present-tense operations log into a past-tense incident report.\n* **Exercise 2**: Draft a boarding announcement using 'will' and 'going to'.\n* **Review**: Spot the tense consistency errors in the sample text."
    ],
    5: [
        "* **SVO Structure**: Subject (Who/What) + Verb (Action) + Object (Receiver).\n* **Clauses**: A group of words with a subject and verb (Independent vs Dependent).\n* **Phrases**: A group of words missing either a subject or a verb.",
        "* **Standardization**: SVO prevents ambiguity in high-stress aviation environments.\n* **Clarity**: Avoiding fragmented sentences ensures that instructions are legally and operationally sound.\n* **Brevity**: Short, structured sentences are easier to transmit over radio.",
        "* **Deconstruct**: Break down complex sentences into their core SVO components.\n* **Fix**: Identify and correct fragmented or run-on sentences in a maintenance log.\n* **Draft**: Write 5 perfect SVO sentences related to ground handling."
    ],
    6: [
        "* **Simple Sentence**: One independent clause (e.g., 'The doors are closed').\n* **Compound Sentence**: Two independent clauses joined by FANBOYS (e.g., 'The doors are closed, and we are ready').\n* **Complex Sentence**: One independent + one dependent clause.",
        "* **Emergency**: Use simple sentences for emergency instructions where processing time is critical.\n* **Analytical**: Use complex sentences for detailed analytical reports or policy documents.\n* **Flow**: Mix sentence types to keep written correspondence engaging.",
        "* **Combine**: Join pairs of simple sentences into compound sentences using correct conjunctions.\n* **Identify**: Label the sentence types in a sample aviation manual.\n* **Rewrite**: Simplify a complex paragraph into bulleted simple sentences."
    ],
    7: [
        "* **Active Vocabulary**: Words you understand and use frequently in speech and writing.\n* **Passive Vocabulary**: Words you recognize when you read or hear them, but rarely use yourself.\n* **Context Clues**: Guessing the meaning of an unknown word based on surrounding text.",
        "* **Professionalism**: Expanding active vocabulary enhances authority and clarity in business communications.\n* **Adaptability**: Using context clues prevents panic when reading dense, unfamiliar regulatory documents.\n* **Precision**: The right word saves time and prevents confusion.",
        "* **Exercise 1**: Use a dictionary to find and define 5 new aviation terms.\n* **Exercise 2**: Read a paragraph and deduce the meaning of 3 highlighted words using context clues.\n* **Application**: Write sentences actively using your newly learned words."
    ],
    8: [
        "* **Prefixes**: Added to the beginning of a word to alter its meaning (e.g., Un-, Pre-, Anti-).\n* **Suffixes**: Added to the end of a word to change its part of speech (e.g., -tion, -ly, -ment).\n* **Synonyms & Antonyms**: Words with identical or opposite meanings.",
        "* **Decoding**: Breaking unfamiliar technical terms into root, prefix, and suffix helps instantly deduce meaning.\n* **Variety**: Using synonyms prevents repetitive, boring writing in emails and reports.\n* **Clarity**: Antonyms help clearly contrast choices or states (e.g., Armed vs Disarmed).",
        "* **Matching**: Complete the synonym and antonym matching worksheet.\n* **Morphology**: Add the correct prefixes and suffixes to a list of base words to change their meaning.\n* **Rewrite**: Upgrade a basic email by replacing simple words with professional synonyms."
    ],
    9: [
        "* **Aircraft Anatomy**: Key terms like Fuselage, Empennage, Ailerons, Flaps, and Landing Gear.\n* **Airport Infrastructure**: Key terms like Tarmac, Taxiway, Apron, Gate, and Control Tower.\n* **Ground Handling**: Vocabulary relating to baggage, fueling, and pushback operations.",
        "* **Safety**: Accurately reporting maintenance issues requires knowing the exact terminology for aircraft parts.\n* **Logistics**: Ground crew must understand infrastructure terms to navigate the airport safely.\n* **Documentation**: Forms and logs utilize strict technical jargon.",
        "* **Diagram**: Label a blank diagram of an aircraft's anatomy.\n* **Map**: Identify key infrastructure points on an airport layout map.\n* **Role Play**: Report a maintenance issue to engineering using correct terminology."
    ],
    10: [
        "* **Phonetic Alphabet**: Standardized words representing letters (Alpha, Bravo, Charlie) to ensure clarity over radio.\n* **Standard Phraseology**: Strict ATC phrases (Roger, Wilco, Standby, Affirm, Negative).\n* **Readbacks**: Repeating instructions to confirm correct understanding.",
        "* **Eliminating Errors**: Radio static and accents can cause fatal misunderstandings; phonetics eliminate this risk.\n* **Global Standardization**: English is the international language of aviation; standard phraseology keeps it uniform.\n* **Efficiency**: 'Wilco' replaces 'I have received your message and will comply'.",
        "* **Drill**: Spell your full name and a sample flight number using the Phonetic Alphabet.\n* **Translate**: Convert a layman's sentence into proper ATC phraseology.\n* **Simulation**: Conduct a mock radio transmission requesting taxi clearance."
    ],
    11: [
        "* **Ticketing Jargon**: PNR, Itinerary, E-ticket, Codeshare, Overbooking.\n* **Boarding terms**: Gate No-show, Standby, Final Call, Upgrade.\n* **Special Categories**: UM (Unaccompanied Minor), PRM (Passenger with Reduced Mobility), VIP.",
        "* **Customer Service**: Clear communication with passengers regarding their ticketing and boarding status.\n* **Coordination**: Using acronyms like 'UM' quickly communicates special needs to the cabin crew.\n* **Efficiency**: Processing passengers at the gate requires rapid understanding of these terms.",
        "* **Quiz**: Match the passenger handling acronym to its full form and definition.\n* **Drafting**: Write a boarding announcement calling for PRMs and UMs first.\n* **Role Play**: Handle a passenger asking about their standby status at the gate."
    ],
    12: [
        "* **Integration**: Smoothly combining general grammar rules with technical aviation terminology.\n* **Acronym Management**: Knowing when to use an acronym and when to spell it out for the audience.\n* **Review**: Assessing mastery of Prefixes, Synonyms, and Technical vocabulary.",
        "* **Audience Awareness**: Professional email drafting requires knowing not to over-rely on jargon when speaking to passengers.\n* **Fluency**: Smoothly recalling technical terms without pausing during briefings.\n* **Accuracy**: Ensuring the correct term is used to prevent operational delays.",
        "* **Crossword**: Complete the comprehensive aviation vocabulary crossword puzzle.\n* **Proofreading**: Correct the misused aviation terms in a short operational report.\n* **Formative Assessment**: Take the Unit 2 vocabulary quiz."
    ],
    13: [
        "* **Active Reading**: Engaging with the text, asking questions, and taking notes, rather than passive scanning.\n* **Main Idea vs Details**: Separating the central point from the supporting evidence.\n* **The 5 Ws**: Identifying Who, What, Where, When, and Why in any document.",
        "* **Efficiency**: Quickly grasping the core message of company memos or policy updates saves time.\n* **Briefings**: Extracting the main idea from a pre-flight briefing document to share with the team.\n* **Prioritization**: Knowing what information is critical versus what is just background context.",
        "* **Extract**: Read a sample airline memo and extract the 5 Ws.\n* **Identify**: Highlight the main idea sentence in three different paragraphs.\n* **Summarize**: Write a one-sentence summary of a page-long article."
    ],
    14: [
        "* **Skimming**: Reading rapidly to get a general, macroscopic overview of the material.\n* **Techniques**: Focusing on titles, headings, bullet points, first sentences of paragraphs, and conclusions.\n* **Ignoring Fluff**: Training the brain to skip over adjectives and filler words.",
        "* **Volume Processing**: Processing large volumes of reports, emails, or daily industry news efficiently.\n* **Triage**: Quickly skimming an inbox to determine which emails are urgent.\n* **Preparation**: Skimming a document right before a meeting to grasp the agenda.",
        "* **Drill**: Skim a 2-page industry report in 60 seconds.\n* **Test**: Answer 3 general questions about the report's overarching theme.\n* **Draft**: Write a 2-sentence 'gist' summary based only on skimming."
    ],
    15: [
        "* **Scanning**: Reading rapidly to find specific microscopic facts, dates, numbers, or keywords.\n* **Visual Cues**: Using capital letters, numbers, bold text, and formatting to locate data.\n* **Tracking**: Using a finger or pen to guide the eyes quickly down a page.",
        "* **Manifests**: Locating specific passenger names on a dense flight manifest.\n* **Schedules**: Finding specific flight times, gate numbers, or equipment types on a timetable.\n* **Manuals**: Finding a specific regulation number in a 500-page compliance manual.",
        "* **Drill**: Scan a dense flight schedule timetable to find 5 specific connecting flights in under 2 minutes.\n* **Search**: Locate 3 specific regulatory clauses in a sample document.\n* **Race**: Compete to find specific data points in a text the fastest."
    ],
    16: [
        "* **Tech Docs**: Civil Aviation Requirements (CARs), Standard Operating Procedures (SOPs), and Safety Bulletins.\n* **Characteristics**: Strict, unambiguous text, heavily structured with legal/technical jargon.\n* **Imperatives**: Use of 'Shall', 'Must', 'Should', and 'May' in regulatory writing.",
        "* **Compliance**: Ensuring strict safety compliance by precisely following written manual instructions.\n* **Legal Liability**: Misinterpreting a 'shall' vs 'should' can result in regulatory fines or safety breaches.\n* **Execution**: Translating dense text into physical operational actions.",
        "* **Analyze**: Differentiate between 'mandatory' and 'recommended' actions in a sample CAR.\n* **Extract**: Pull the mandatory emergency steps from an airline SOP excerpt.\n* **Translate**: Rewrite a dense technical clause into plain English for a trainee."
    ],
    17: [
        "* **Fact vs Opinion**: Differentiating between objective reality and subjective belief or perspective.\n* **Inferences**: Reaching a logical conclusion based on evidence and reasoning, reading 'between the lines'.\n* **Tone & Intent**: Identifying the author's attitude (e.g., urgent, formal, frustrated).",
        "* **Complaint Resolution**: Evaluating passenger complaint letters objectively, separating emotional opinions from factual service failures.\n* **Incident Reports**: Identifying subjective bias in witness statements during an investigation.\n* **Critical Thinking**: Not taking all industry news or reports at face value without evaluating the evidence.",
        "* **Highlight**: Mark facts in green and opinions in red in a sample editorial article.\n* **Infer**: Read a polite but firm email from management and infer the underlying urgency.\n* **Discuss**: Compare two incident reports and identify which is more objective."
    ],
    18: [
        "* **Synthesis**: Combining skimming, scanning, and deep critical comprehension simultaneously.\n* **Time Management**: Applying the right reading strategy (skim vs scan vs deep read) based on the task.\n* **Review**: Assessing mastery of all Unit 3 reading techniques.",
        "* **Real-world Ops**: Rapidly assessing situational reports, manifests, and memos during active operations.\n* **Exams**: Preparing for standardized tests or regulatory exams that require quick text processing.\n* **Decision Making**: Making rapid decisions based on synthesized written data.",
        "* **Timed Assessment**: Complete a timed reading comprehension test covering multiple texts.\n* **Strategy Selection**: Given 5 tasks, identify whether skimming, scanning, or deep reading is appropriate.\n* **Peer Review**: Discuss the answers and strategies used in the assessment."
    ],
    19: [
        "* **Topic Sentence**: The first sentence that expresses the main idea of the paragraph.\n* **Supporting Sentences**: Details, data, and examples that back up the topic sentence.\n* **Concluding Sentence**: A wrap-up sentence that transitions to the next idea.\n* **Cohesion**: Using transition words (However, Therefore, Additionally) for flow.",
        "* **Clarity**: Organizing thoughts logically so the reader can follow operational updates easily.\n* **Professionalism**: Well-structured paragraphs reflect a structured, competent mind.\n* **Brevity**: Keeping paragraphs focused on a single topic prevents rambling and confusion.",
        "* **Identify**: Label the topic, supporting, and concluding sentences in a provided text.\n* **Draft**: Write a 5-sentence paragraph describing a daily routine using transition words.\n* **Edit**: Rewrite a rambling, unstructured paragraph into a cohesive one."
    ],
    20: [
        "* **Format**: Standard business block format (dates, addresses, salutations, sign-offs).\n* **Formal vs Informal**: Differences in vocabulary, tone, and structure based on the recipient.\n* **Salutations**: 'Dear Sir/Madam' vs 'Hi Team', and Sign-offs ('Sincerely', 'Best Regards').",
        "* **External Comms**: Drafting formal letters to stakeholders, regulatory bodies, or partners.\n* **Internal Comms**: Writing semi-formal memos to colleagues or informal notes to team members.\n* **Brand Image**: Every external letter represents the airline's professional brand.",
        "* **Format Check**: Correct the layout errors in a sample business letter.\n* **Draft (Formal)**: Write a formal letter requesting information about an aviation training seminar.\n* **Draft (Informal)**: Write an informal memo inviting the team to a brief meeting."
    ],
    21: [
        "* **BLUF**: Bottom Line Up Front - putting the most important information first.\n* **Subject Lines**: Crafting clear, actionable, and specific subject lines (e.g., 'ACTION REQUIRED: Shift Swap').\n* **Conciseness**: Using bullet points and short paragraphs to make emails skimmable.",
        "* **Inbox Management**: Ensuring your urgent requests are actually read and prioritized by busy managers.\n* **Digital Etiquette**: Avoiding 'Reply All' disasters, using CC/BCC correctly, and maintaining a professional signature.\n* **Efficiency**: Saving time for both the sender and the receiver.",
        "* **Critique**: Analyze a poorly written, rambling email and identify its flaws.\n* **Rewrite**: Create a strong, actionable subject line for 5 different email scenarios.\n* **Draft**: Write a concise email to a manager summarizing a shift handover using BLUF."
    ],
    22: [
        "* **Delivering Bad News**: Being direct but empathetic, offering alternatives when possible.\n* **Persuasive Writing**: Using logic, data, and benefits to convince stakeholders.\n* **The Sandwich Method**: Delivering negative feedback between two positive statements.",
        "* **De-escalation**: Calming irate customers or vendors through written text where tone of voice is absent.\n* **Leadership**: Persuading management to adopt a new process or approve a budget request.\n* **Diplomacy**: Maintaining positive relationships even when denying a request.",
        "* **Revise**: Rewrite an aggressive email draft into a polite, professional response.\n* **Draft**: Write an email to a passenger explaining that their baggage has been temporarily lost, offering solutions.\n* **Role Play (Written)**: Exchange persuasive emails with a partner negotiating a schedule change."
    ],
    23: [
        "* **Purpose of Reports**: Creating permanent, objective, factual records of events or operations.\n* **Structure**: Title, Executive Summary, Introduction, Findings/Body, Conclusion, Recommendations.\n* **Objectivity**: Sticking purely to verifiable facts, removing all personal bias and emotion.",
        "* **Incident Reporting**: Accurately documenting safety incidents, accidents, or delays for legal and regulatory review.\n* **Shift Reports**: Summarizing daily operations for the next shift to maintain continuity.\n* **Decision Making**: Providing management with the clear data needed to make operational changes.",
        "* **Outline**: Outline the required sections for a standard aviation incident report.\n* **Fact-Check**: Strip the emotional and biased language out of a witness statement.\n* **Draft**: Write a 3-sentence Executive Summary based on a page of raw operational data."
    ],
    24: [
        "* **Application**: Bringing paragraph structure, objective vocabulary, and formal tone together.\n* **Peer Review**: Actively reviewing and critiquing colleagues' work to catch errors.\n* **Proofreading**: Checking for grammar, tense consistency, spelling, and factual accuracy before submission.",
        "* **Quality Assurance**: Refining drafts to ensure 100% accuracy before submission to management or regulators.\n* **Collaboration**: Working as a team to finalize complex operational documents.\n* **Final Polish**: Ensuring the document reflects the highest level of professionalism.",
        "* **Draft**: Write a complete operational shift report based on a provided raw data scenario.\n* **Peer Review**: Swap reports with a partner and provide constructive feedback using a rubric.\n* **Assess**: Final Formative Assessment on Writing Skills."
    ],
    25: [
        "* **Hearing vs Listening**: Hearing is a passive biological function; listening is an active, psychological choice.\n* **The SOFTEN Technique**: Smile, Open posture, Forward lean, Touch (appropriate), Eye contact, Nod.\n* **Barriers**: Physical (noise), Psychological (bias), Semantic (jargon).",
        "* **Trust Building**: Active listening builds immediate rapport and trust with passengers.\n* **Safety**: Catching critical details from colleagues during handovers prevents accidents.\n* **Empathy**: Validating a speaker's feelings helps de-escalate tension.",
        "* **Identify**: List 3 personal barriers to listening you experience and how to overcome them.\n* **Pair Exercise**: One person speaks for 2 minutes, the other must listen silently and then paraphrase it back perfectly.\n* **Body Language**: Practice the SOFTEN technique in a 1-on-1 interview setup."
    ],
    26: [
        "* **Phonetics**: Mastering English vowel and consonant sounds to neutralize confusing accents.\n* **Word Stress**: The emphasis given to a certain syllable (e.g., RE-cord vs re-CORD changes noun to verb).\n* **Sentence Intonation**: The rise and fall of the voice (e.g., rising for questions, falling for statements).",
        "* **Clarity**: Preventing miscommunication over radio or PA systems where audio quality is poor.\n* **International Ops**: Ensuring smooth communication with international colleagues or passengers with different native accents.\n* **Professionalism**: Clear pronunciation projects confidence and authority.",
        "* **Drill**: Practice tongue twisters to improve articulation and consonant clarity.\n* **Marking**: Mark the correct word stress on a list of 20 common aviation terms.\n* **Read Aloud**: Practice reading a PA announcement with correct intonation and stress."
    ],
    27: [
        "* **Small Talk**: The art of light, informal conversation to build rapport and fill silence.\n* **Question Types**: Open-ended questions (require elaboration) vs Closed-ended questions (Yes/No answers).\n* **Greetings & Introductions**: Professional ways to introduce yourself and others.",
        "* **Customer Experience**: Creating a welcoming, hospitable environment for passengers from the moment they arrive.\n* **Team Dynamics**: Building positive relationships with colleagues and crew members during downtime.\n* **Information Gathering**: Using open-ended questions to gently extract necessary information from confused passengers.",
        "* **Role Play**: Role-play a conversation opening to build rapport with a nervous flyer.\n* **Convert**: Change a list of closed-ended questions into open-ended questions.\n* **Practice**: Conduct a 3-minute networking introduction with a classmate."
    ],
    28: [
        "* **Voice Modulation**: Controlling pitch, tone, and volume to convey meaning and keep attention.\n* **Pacing & Pausing**: Speaking at a deliberate speed and using pauses for emphasis, not filler words (um, uh).\n* **Public Speaking**: Techniques for PA announcements and pre-flight briefings.",
        "* **Authority**: Speaking authoritatively but calmly during safety briefings or emergencies establishes control.\n* **Comprehension**: Proper pacing ensures passengers actually understand the safety instructions.\n* **Overcoming Noise**: Projecting the voice from the diaphragm in high-noise environments like the tarmac.",
        "* **Record**: Record yourself reading a briefing and critique your own pacing and filler words.\n* **Modulation Drill**: Read the same sentence in 3 different tones (Urgent, Welcoming, Informative).\n* **Deliver**: Deliver a 1-minute safety briefing to the classroom without a microphone."
    ],
    29: [
        "* **Customer Service Scenarios**: Applying empathy, active listening, and clear speaking to assist passengers.\n* **Handling Disruptions**: Communicating effectively during flight delays, cancellations, or overbooking.\n* **Special Needs**: Respectfully communicating with PRMs (Passengers with Reduced Mobility) or UMs.",
        "* **Brand Reputation**: Maintaining customer satisfaction and airline loyalty even during operational failures.\n* **Problem Solving**: Transitioning from listening to the problem to clearly explaining the solution.\n* **Adaptability**: Adjusting communication style based on the passenger's age, culture, and emotional state.",
        "* **Role Play 1**: Assist a passenger who missed their connecting flight due to a delay.\n* **Role Play 2**: Explain baggage restrictions to a passenger who does not want to check their oversized bag.\n* **Feedback**: Provide peer feedback on tone, empathy, and clarity."
    ],
    30: [
        "* **Conflict Resolution**: De-escalating aggressive behavior and managing tension.\n* **The HEART Model**: Hear, Empathize, Apologize, Resolve, Thank.\n* **Inter-departmental Conflict**: Resolving clashes between ground staff and flight crew professionally.",
        "* **Safety & Security**: Preventing verbal conflicts from escalating into physical or security threats onboard.\n* **Team Cohesion**: Maintaining a professional working environment despite disagreements with colleagues.\n* **Resilience**: Managing personal stress and maintaining a calm exterior under pressure.",
        "* **De-escalation Drill**: Practice using a calm, lowered voice and open body language against a shouting partner.\n* **Role Play 1**: De-escalate an angry passenger demanding a free upgrade.\n* **Role Play 2**: Resolve a miscommunication conflict between the gate agent and the cabin crew."
    ]
}

base_paths = [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1'
]

for path in base_paths:
    for week_num in range(1, 31):
        file_path = os.path.join(path, f'week{week_num}.md')
        if not os.path.exists(file_path):
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if week_num in content_map:
            slide1, slide2, slide3 = content_map[week_num]
            
            # Replace occurrences of the placeholder
            placeholder = "Instructor will guide you through this concept."
            
            # We assume there are 2 placeholders for Concept/Application, and the third might say "Complete the exercises..." 
            # Wait, earlier I generated the third as "Complete the exercises provided by the instructor."
            placeholder_practice = "Complete the exercises provided by the instructor."
            
            # Replace first instance with slide1
            content = content.replace(placeholder, slide1, 1)
            # Replace second instance with slide2
            content = content.replace(placeholder, slide2, 1)
            # Replace third instance with slide3
            content = content.replace(placeholder_practice, slide3, 1)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

print("Expanded all 30 Communicative English markdown files with detailed content!")
