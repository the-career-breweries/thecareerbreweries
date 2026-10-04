import json
import os

path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Radically expand Session 2 to cover all parts of speech, sentences, tenses, etc.
data['Communicative English']['2']['definitions'] = [
    {"term": "Noun", "definition": "A word used to identify any of a class of people, places, or things (e.g., Pilot, Airport, Happiness)."},
    {"term": "Pronoun", "definition": "A word that can function by itself as a noun phrase and that refers either to the participants in the discourse (e.g., I, you) or to someone or something mentioned elsewhere (e.g., she, it, this)."},
    {"term": "Verb", "definition": "A word used to describe an action, state, or occurrence (e.g., Fly, Communicate, Is)."},
    {"term": "Adjective", "definition": "A word or phrase naming an attribute, added to or grammatically related to a noun to modify or describe it (e.g., Clear, Professional, Huge)."},
    {"term": "Adverb", "definition": "A word or phrase that modifies or qualifies an adjective, verb, or other adverb, expressing a relation of place, time, circumstance, manner, cause, degree, etc. (e.g., Quickly, Very, Well)."},
    {"term": "Preposition", "definition": "A word governing, and usually preceding, a noun or pronoun and expressing a relation to another word (e.g., On, In, At)."},
    {"term": "Conjunction", "definition": "A word used to connect clauses or sentences or to coordinate words in the same clause (e.g., And, But, If)."},
    {"term": "Interjection", "definition": "An abrupt remark, made especially as an aside or interruption (e.g., Ah!, Wow!, Oh!)."},
    {"term": "Declarative Sentence", "definition": "A sentence that makes a statement and ends with a period."},
    {"term": "Interrogative Sentence", "definition": "A sentence that asks a question and ends with a question mark."},
    {"term": "Imperative Sentence", "definition": "A sentence that gives a command or makes a request, ending with a period or exclamation mark."},
    {"term": "Exclamatory Sentence", "definition": "A sentence that expresses strong feeling and ends with an exclamation mark."},
    {"term": "Subject-Verb Agreement", "definition": "The grammatical rule stating that the subject and verb must agree in number. A singular subject takes a singular verb, and a plural subject takes a plural verb."},
    {"term": "Simple Present Tense", "definition": "Used to describe habits, unchanging situations, general truths, and fixed arrangements."},
    {"term": "Present Continuous Tense", "definition": "Used to describe an action that is happening right now or in the near future."},
    {"term": "Present Perfect Tense", "definition": "Used to describe an action that happened at an unspecified time in the past or began in the past and continues to the present."},
    {"term": "Simple Past Tense", "definition": "Used to talk about a completed action in a time before now."},
    {"term": "Simple Future Tense", "definition": "Used to talk about things that haven't happened yet."}
]

data['Communicative English']['2']['keyConcepts'] = [
    {"title": "The 8 Parts of Speech", "explanation": "The fundamental building blocks of the English language that determine how words function in meaning as well as grammatically within the sentence."},
    {"title": "Types of Sentences", "explanation": "The four main sentence structures (Declarative, Interrogative, Imperative, Exclamatory) used to convey different intentions and tones in communication."},
    {"title": "Tenses", "explanation": "Grammatical forms that indicate the time of an action or event (past, present, future), allowing for accurate chronological storytelling and reporting."},
    {"title": "Subject-Verb Agreement (SVA)", "explanation": "The critical grammatical rule ensuring that singular subjects pair with singular verbs, and plural subjects pair with plural verbs, maintaining sentence clarity."}
]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
