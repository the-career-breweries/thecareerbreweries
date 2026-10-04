import json

path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Fix the wrong sentence types
wrong_terms = ["Declarative Sentence", "Interrogative Sentence", "Imperative Sentence", "Exclamatory Sentence"]
data['Communicative English']['2']['definitions'] = [
    d for d in data['Communicative English']['2']['definitions'] if d['term'] not in wrong_terms
]

# Add the correct ones
correct_terms = [
    {"term": "Simple Sentence", "definition": "A sentence consisting of only one independent clause, with a single subject and predicate."},
    {"term": "Compound Sentence", "definition": "A sentence containing two or more independent clauses joined by a coordinating conjunction (e.g., for, and, nor, but, or, yet, so)."},
    {"term": "Complex Sentence", "definition": "A sentence containing one independent clause and at least one dependent (subordinate) clause."},
    {"term": "Compound-Complex Sentence", "definition": "A sentence having two or more independent clauses and one or more dependent clauses."}
]

# Insert them after the parts of speech
data['Communicative English']['2']['definitions'] = data['Communicative English']['2']['definitions'][:8] + correct_terms + data['Communicative English']['2']['definitions'][8:]

# 2. Update the key concept explanation
for concept in data['Communicative English']['2']['keyConcepts']:
    if concept['title'] == "Types of Sentences":
        concept['explanation'] = "The structural classification of sentences based on the number and type of clauses they contain: Simple, Compound, Complex, and Compound-Complex."

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
