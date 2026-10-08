import json

detailed_notes = {
    "1": {
        "keyConcepts": [
            {"title": "Parts of Speech Basics", "explanation": "Nouns, pronouns, and adjectives form the fundamental building blocks of descriptive and declarative sentences."}
        ],
        "definitions": [
            {"term": "Noun", "definition": "A word identifying a person, place, thing, or idea."},
            {"term": "Pronoun", "definition": "A word that takes the place of a noun to avoid repetition."},
            {"term": "Adjective", "definition": "A word that describes or clarifies a noun."}
        ],
        "mnemonic": "NPA (Nouns, Pronouns, Adjectives)",
        "btlQuestions": {"Remember": "What is a noun?", "Understand": "Explain how an adjective modifies a noun.", "Apply": "Identify the pronouns in a flight announcement."},
        "referenceMaterial": {"primary": "Wren & Martin High School English Grammar"}
    },
    "2": {
        "keyConcepts": [
            {"title": "Action and Connection", "explanation": "Verbs drive the action, adverbs modify it, and prepositions/conjunctions link ideas together."}
        ],
        "definitions": [
            {"term": "Verb", "definition": "An action or state of being."},
            {"term": "Preposition", "definition": "Shows the relationship of a noun to another word (e.g., in, on, at)."}
        ],
        "mnemonic": "VAC (Verbs, Adverbs, Conjunctions)",
        "btlQuestions": {"Remember": "List 5 prepositions.", "Apply": "Construct a sentence using a coordinating conjunction."},
        "referenceMaterial": {"primary": "Wren & Martin High School English Grammar"}
    },
    "3": {
        "keyConcepts": [
            {"title": "Present Tenses Overview", "explanation": "Understanding Simple, Continuous, Perfect, and Perfect Continuous present tenses for accurate current-time reporting."}
        ],
        "definitions": [
            {"term": "Present Perfect", "definition": "An action that happened at an unspecified time before now, or started in the past and continues."}
        ],
        "mnemonic": "SCPP (Simple, Continuous, Perfect, Perfect Continuous)",
        "btlQuestions": {"Understand": "Differentiate between simple present and present continuous.", "Apply": "Write an aviation status report using present perfect."},
        "referenceMaterial": {"primary": "Cambridge English Grammar in Use"}
    },
    "4": {
        "keyConcepts": [
            {"title": "Past & Future Consistency", "explanation": "Maintaining correct tense usage when reporting past incidents or projecting future schedules."}
        ],
        "definitions": [
            {"term": "Future Continuous", "definition": "Indicates an action that will occur over a period of time in the future."}
        ],
        "mnemonic": "Timeline Checking",
        "btlQuestions": {"Remember": "How do you form the past perfect tense?", "Evaluate": "Assess a paragraph for tense consistency errors."},
        "referenceMaterial": {"primary": "Cambridge English Grammar in Use"}
    },
    "5": {
        "keyConcepts": [
            {"title": "SVO Model", "explanation": "Subject-Verb-Object is the standard English sentence structure ensuring clarity."}
        ],
        "definitions": [
            {"term": "Clause", "definition": "A group of words containing a subject and a predicate."},
            {"term": "Phrase", "definition": "A group of words missing either a subject or a verb."}
        ],
        "mnemonic": "SVO (Subject, Verb, Object)",
        "btlQuestions": {"Analyze": "Break down a complex sentence into its SVO components.", "Create": "Draft 5 SVO sentences related to ground handling."},
        "referenceMaterial": {"primary": "Wren & Martin High School English Grammar"}
    },
    "6": {
        "keyConcepts": [
            {"title": "Sentence Typology", "explanation": "Simple, Compound, Complex, and Compound-Complex sentences."}
        ],
        "definitions": [
            {"term": "Compound Sentence", "definition": "Two independent clauses joined by a coordinating conjunction."}
        ],
        "mnemonic": "FANBOYS (For, And, Nor, But, Or, Yet, So)",
        "btlQuestions": {"Remember": "What are the FANBOYS conjunctions?", "Apply": "Combine two simple sentences into a complex sentence."},
        "referenceMaterial": {"primary": "Wren & Martin High School English Grammar"}
    },
    "7": {
        "keyConcepts": [
            {"title": "Vocabulary Building Strategies", "explanation": "Techniques for transitioning words from passive recognition to active usage."}
        ],
        "definitions": [
            {"term": "Active Vocabulary", "definition": "Words you understand and use frequently."},
            {"term": "Passive Vocabulary", "definition": "Words you understand when reading/hearing but rarely use."}
        ],
        "mnemonic": "Context Clues",
        "btlQuestions": {"Understand": "Explain the difference between active and passive vocabulary.", "Apply": "Use a dictionary to find context-specific meanings."},
        "referenceMaterial": {"primary": "Oxford Advanced Learner's Dictionary"}
    },
    "8": {
        "keyConcepts": [
            {"title": "Word Morphology", "explanation": "Using roots, prefixes, and suffixes to deduce the meaning of unfamiliar words."}
        ],
        "definitions": [
            {"term": "Prefix", "definition": "A morpheme added to the beginning of a word to alter its meaning (e.g., pre-, un-)."},
            {"term": "Synonym", "definition": "A word having the same or nearly the same meaning as another."}
        ],
        "mnemonic": "RPS (Root, Prefix, Suffix)",
        "btlQuestions": {"Analyze": "Deconstruct the word 'unpredictable'.", "Create": "List 3 synonyms and antonyms for 'efficient'."},
        "referenceMaterial": {"primary": "Merriam-Webster Vocabulary Builder"}
    },
    "9": {
        "keyConcepts": [
            {"title": "Aircraft & Infrastructure Terminology", "explanation": "Specific jargon used to describe aircraft anatomy and airport layouts."}
        ],
        "definitions": [
            {"term": "Fuselage", "definition": "The main body of an aircraft."},
            {"term": "Tarmac/Apron", "definition": "The area where aircraft are parked, unloaded or loaded, refueled, or boarded."}
        ],
        "mnemonic": "FAR (Fuselage, Apron, Runway)",
        "btlQuestions": {"Remember": "Define the term 'Empennage'.", "Apply": "Label a diagram of airport infrastructure."},
        "referenceMaterial": {"primary": "Aviation English by Henry Emery"}
    },
    "10": {
        "keyConcepts": [
            {"title": "Flight Ops & ATC Language", "explanation": "The standardized, unambiguous language used by Air Traffic Control and pilots."}
        ],
        "definitions": [
            {"term": "Phonetic Alphabet", "definition": "A set of standardized words used to represent letters in oral communication (e.g., Alpha, Bravo)."},
            {"term": "Roger", "definition": "I have received all of your last transmission."}
        ],
        "mnemonic": "Alpha, Bravo, Charlie...",
        "btlQuestions": {"Apply": "Spell your name using the ICAO phonetic alphabet.", "Analyze": "Interpret an ATC clearance instruction."},
        "referenceMaterial": {"primary": "ICAO Standard Phraseology Guide"}
    },
    "11": {
        "keyConcepts": [
            {"title": "Passenger Handling Jargon", "explanation": "Terms used in ticketing, boarding, and customer service."}
        ],
        "definitions": [
            {"term": "PNR", "definition": "Passenger Name Record; a digital certificate allowing passengers to do online check-in."},
            {"term": "No-show", "definition": "A passenger who fails to arrive for their scheduled flight."}
        ],
        "mnemonic": "PNR Details",
        "btlQuestions": {"Remember": "What does PNR stand for?", "Apply": "Draft a boarding announcement using proper terminology."},
        "referenceMaterial": {"primary": "Aviation English by Henry Emery"}
    },
    "12": {
        "keyConcepts": [
            {"title": "Vocabulary Integration", "explanation": "Applying newly learned general and technical vocabulary into fluent sentences."}
        ],
        "definitions": [
            {"term": "Acronym", "definition": "An abbreviation formed from the initial letters of other words and pronounced as a word."}
        ],
        "mnemonic": "Use it or lose it",
        "btlQuestions": {"Evaluate": "Review a short report and correct misused aviation terms.", "Create": "Write a 5-sentence summary using 10 new vocabulary words."},
        "referenceMaterial": {"primary": "Aviation English by Henry Emery"}
    },
    "13": {
        "keyConcepts": [
            {"title": "Reading Comprehension Basics", "explanation": "Transitioning from passive decoding to active interpretation of text."}
        ],
        "definitions": [
            {"term": "Main Idea", "definition": "The central point or thought the author wants to communicate to readers."}
        ],
        "mnemonic": "5 Ws (Who, What, Where, When, Why)",
        "btlQuestions": {"Understand": "Identify the main idea of a given business memo.", "Analyze": "Extract supporting details from a text."},
        "referenceMaterial": {"primary": "Oxford Guide to Effective Reading"}
    },
    "14": {
        "keyConcepts": [
            {"title": "Skimming", "explanation": "Reading rapidly to get a general overview of the material."}
        ],
        "definitions": [
            {"term": "Skimming", "definition": "Glancing quickly through a text to grasp the gist."}
        ],
        "mnemonic": "Skim for the Gist",
        "btlQuestions": {"Apply": "Skim a 2-page report and summarize it in 3 sentences within 2 minutes."},
        "referenceMaterial": {"primary": "Speed Reading Techniques"}
    },
    "15": {
        "keyConcepts": [
            {"title": "Scanning", "explanation": "Reading rapidly in order to find specific facts or keywords."}
        ],
        "definitions": [
            {"term": "Scanning", "definition": "Searching a text quickly for a specific piece of information."}
        ],
        "mnemonic": "Scan for Specifics",
        "btlQuestions": {"Apply": "Scan a flight schedule to find the departure time for flight AI-204."},
        "referenceMaterial": {"primary": "Speed Reading Techniques"}
    },
    "16": {
        "keyConcepts": [
            {"title": "Reading Technical Documents", "explanation": "Navigating CARs, SOPs, and manuals which require absolute precision."}
        ],
        "definitions": [
            {"term": "SOP", "definition": "Standard Operating Procedure; step-by-step instructions compiled by an organization."},
            {"term": "CAR", "definition": "Civil Aviation Requirements."}
        ],
        "mnemonic": "Attention to Detail",
        "btlQuestions": {"Analyze": "Extract the mandatory safety steps from an airline SOP excerpt."},
        "referenceMaterial": {"primary": "DGCA CAR Manuals"}
    },
    "17": {
        "keyConcepts": [
            {"title": "Critical Reading", "explanation": "Differentiating between fact, opinion, and recognizing the author's tone."}
        ],
        "definitions": [
            {"term": "Inference", "definition": "A conclusion reached on the basis of evidence and reasoning."},
            {"term": "Fact vs Opinion", "definition": "Objective reality vs subjective belief."}
        ],
        "mnemonic": "Read Between the Lines",
        "btlQuestions": {"Evaluate": "Differentiate the factual statements from the opinions in an editorial piece."},
        "referenceMaterial": {"primary": "Critical Thinking Skills by Stella Cottrell"}
    },
    "18": {
        "keyConcepts": [
            {"title": "Reading Synthesis", "explanation": "Combining skimming, scanning, and critical reading under time constraints."}
        ],
        "definitions": [
            {"term": "Synthesis", "definition": "Combining a number of things into a coherent whole."}
        ],
        "mnemonic": "Skim, Scan, Synthesize",
        "btlQuestions": {"Evaluate": "Complete a timed reading comprehension test assessing all Unit 3 skills."},
        "referenceMaterial": {"primary": "Course Handouts"}
    },
    "19": {
        "keyConcepts": [
            {"title": "Paragraph Structure", "explanation": "A strong paragraph contains a topic sentence, supporting details, and a concluding sentence."}
        ],
        "definitions": [
            {"term": "Topic Sentence", "definition": "A sentence that expresses the main idea of the paragraph in which it occurs."},
            {"term": "Cohesion", "definition": "The grammatical and lexical linking within a text or sentence that holds a text together."}
        ],
        "mnemonic": "TSC (Topic, Support, Conclusion)",
        "btlQuestions": {"Create": "Draft a cohesive paragraph explaining the importance of punctuality in aviation."},
        "referenceMaterial": {"primary": "Oxford Guide to Effective Writing"}
    },
    "20": {
        "keyConcepts": [
            {"title": "Letter Writing", "explanation": "Mastering the standard formats and tone for formal and informal correspondence."}
        ],
        "definitions": [
            {"term": "Block Format", "definition": "A letter format where all text is aligned to the left margin."}
        ],
        "mnemonic": "Clear & Courteous",
        "btlQuestions": {"Apply": "Write a formal letter requesting information about an aviation training seminar."},
        "referenceMaterial": {"primary": "Business Communication Strategies"}
    },
    "21": {
        "keyConcepts": [
            {"title": "Professional Emails", "explanation": "Crafting clear subject lines, appropriate salutations, and concise body text."}
        ],
        "definitions": [
            {"term": "Email Etiquette", "definition": "The principles of behavior that one should use when writing or answering email messages."}
        ],
        "mnemonic": "BLUF (Bottom Line Up Front)",
        "btlQuestions": {"Create": "Draft a concise email to your manager summarizing a shift handover."},
        "referenceMaterial": {"primary": "Business Communication Strategies"}
    },
    "22": {
        "keyConcepts": [
            {"title": "Advanced Email Scenarios", "explanation": "Handling difficult situations like irate customers, delivering bad news, or persuading stakeholders."}
        ],
        "definitions": [
            {"term": "Tone", "definition": "The attitude of a writer toward a subject or an audience, conveyed through word choice."}
        ],
        "mnemonic": "Empathy First",
        "btlQuestions": {"Evaluate": "Revise an aggressive email draft into a polite, professional response to an angry passenger."},
        "referenceMaterial": {"primary": "Crucial Conversations"}
    },
    "23": {
        "keyConcepts": [
            {"title": "Report Writing Fundamentals", "explanation": "Structuring formal business and incident reports objectively with data and charts."}
        ],
        "definitions": [
            {"term": "Executive Summary", "definition": "A short document or section of a document that summarizes a longer report."}
        ],
        "mnemonic": "Objective Data Presentation",
        "btlQuestions": {"Analyze": "Outline the sections required for a standard aviation incident report."},
        "referenceMaterial": {"primary": "Technical Communication by Raman & Sharma"}
    },
    "24": {
        "keyConcepts": [
            {"title": "Report Application", "explanation": "Drafting operational shift reports and performing peer reviews."}
        ],
        "definitions": [
            {"term": "Constructive Feedback", "definition": "Feedback intended to help the recipient improve, delivered in a positive and supportive manner."}
        ],
        "mnemonic": "Review & Refine",
        "btlQuestions": {"Create": "Draft a complete operational shift report based on a provided scenario."},
        "referenceMaterial": {"primary": "Course Case Studies"}
    },
    "25": {
        "keyConcepts": [
            {"title": "Active Listening", "explanation": "Listening with all senses, focusing entirely on the speaker, and providing feedback."}
        ],
        "definitions": [
            {"term": "Active Listening", "definition": "A communication technique requiring the listener to fully concentrate, understand, respond, and remember what is being said."},
            {"term": "Paraphrasing", "definition": "Expressing the meaning of the speaker using different words to confirm understanding."}
        ],
        "mnemonic": "SOFTEN (Smile, Open posture, Forward lean, Touch, Eye contact, Nod)",
        "btlQuestions": {"Understand": "Explain the difference between hearing and listening."},
        "referenceMaterial": {"primary": "Active Listening Techniques"}
    },
    "26": {
        "keyConcepts": [
            {"title": "Phonetics and Pronunciation", "explanation": "Mastering English vowel/consonant sounds, word stress, and sentence intonation."}
        ],
        "definitions": [
            {"term": "Intonation", "definition": "The rise and fall of the voice in speaking."},
            {"term": "Word Stress", "definition": "The emphasis given to a certain syllable in a word."}
        ],
        "mnemonic": "Rise and Fall",
        "btlQuestions": {"Apply": "Demonstrate the difference in intonation between a statement and a question."},
        "referenceMaterial": {"primary": "English Pronunciation in Use"}
    },
    "27": {
        "keyConcepts": [
            {"title": "Everyday Conversation", "explanation": "Mastering greetings, small talk, building rapport, and giving clear instructions."}
        ],
        "definitions": [
            {"term": "Open-ended Question", "definition": "A question that requires a full answer using the subject's own knowledge or feelings (cannot be answered with 'yes' or 'no')."}
        ],
        "mnemonic": "Ask, Listen, Respond",
        "btlQuestions": {"Create": "Role-play a conversation opening to build rapport with a new colleague."},
        "referenceMaterial": {"primary": "Conversational English Skills"}
    },
    "28": {
        "keyConcepts": [
            {"title": "Professional Speaking in Aviation", "explanation": "Techniques for PA announcements, pre-flight briefings, and speaking in high-noise environments."}
        ],
        "definitions": [
            {"term": "Voice Modulation", "definition": "Controlling or adjusting the voice (pitch, tone, volume) to convey meaning effectively."}
        ],
        "mnemonic": "Pacing & Clarity",
        "btlQuestions": {"Apply": "Deliver a standard cabin safety announcement using proper voice modulation."},
        "referenceMaterial": {"primary": "Aviation Communication Guidelines"}
    },
    "29": {
        "keyConcepts": [
            {"title": "Customer Service Role Plays", "explanation": "Applying communication skills to handle general inquiries, special needs, and delays."}
        ],
        "definitions": [
            {"term": "Empathy", "definition": "The ability to understand and share the feelings of another."}
        ],
        "mnemonic": "Acknowledge & Assist",
        "btlQuestions": {"Evaluate": "Role-play assisting a passenger whose flight has been significantly delayed."},
        "referenceMaterial": {"primary": "Customer Service in Aviation"}
    },
    "30": {
        "keyConcepts": [
            {"title": "Conflict Resolution", "explanation": "De-escalating aggressive behavior and managing onboard or inter-departmental conflicts."}
        ],
        "definitions": [
            {"term": "De-escalation", "definition": "Techniques used to reduce the intensity of a conflict or potentially violent situation."}
        ],
        "mnemonic": "HEART (Hear, Empathize, Apologize, Resolve, Thank)",
        "btlQuestions": {"Create": "Demonstrate de-escalation techniques in a simulated onboard conflict scenario."},
        "referenceMaterial": {"primary": "Conflict Resolution Handouts"}
    }
}

file_path = 'curriculum-app/src/data/notes-content.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['Communicative English'] = detailed_notes

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Notes updated for all 30 sessions!")
