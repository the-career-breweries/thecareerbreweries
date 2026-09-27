import json
import os

data = {
  "Communicative English": {
    "1": {
      "keyConcepts": [
        {"title": "Orientation & Roadmap", "explanation": "Understanding the journey of the course, setting expectations, and identifying personal communication goals."},
        {"title": "The Communication Process", "explanation": "The fundamental cycle involving a sender, message, channel, receiver, and feedback."}
      ],
      "definitions": [
        {"term": "Communication", "definition": "The imparting or exchanging of information by speaking, writing, or using some other medium."},
        {"term": "Feedback", "definition": "Information about reactions to a product or a person's performance of a task, used as a basis for improvement."}
      ],
      "mnemonic": {
        "acronym": "SEND",
        "points": [
          "S - Sender (initiates)",
          "E - Encode (translates to message)",
          "N - Network (channel of communication)",
          "D - Decode (receiver understands)"
        ]
      },
      "btlQuestions": {
        "Remember": "Define the term 'Communication' in your own words.",
        "Understand": "Explain the role of feedback in the communication cycle.",
        "Apply": "Provide an example of non-verbal communication in a workplace setting.",
        "Analyze": "Compare and contrast verbal and non-verbal communication.",
        "Evaluate": "Assess the importance of active listening in effective communication.",
        "Create": "Design a communication model for a remote aviation team."
      },
      "referenceMaterial": {
        "primary": "Wren & Martin High School English Grammar and Composition, Chapter 1",
        "further": "Oxford Guide to Effective Writing and Speaking"
      }
    },
    "2": {
      "keyConcepts": [
        {"title": "Parts of Speech", "explanation": "The fundamental building blocks of the English language, including nouns, verbs, adjectives, and adverbs."},
        {"title": "Tenses", "explanation": "Grammatical forms that indicate the time of an action or event (past, present, future)."}
      ],
      "definitions": [
        {"term": "Noun", "definition": "A word used to identify any of a class of people, places, or things."},
        {"term": "Verb", "definition": "A word used to describe an action, state, or occurrence."}
      ],
      "mnemonic": {
        "acronym": "FANBOYS",
        "points": [
          "F - For",
          "A - And",
          "N - Nor",
          "B - But",
          "O - Or",
          "Y - Yet",
          "S - So"
        ]
      },
      "btlQuestions": {
        "Remember": "List the eight parts of speech.",
        "Understand": "Explain the difference between a common noun and a proper noun.",
        "Apply": "Identify the verbs in a given paragraph.",
        "Analyze": "Break down a complex sentence into its subject, verb, and object.",
        "Evaluate": "Critique a given text for grammatical accuracy.",
        "Create": "Construct a paragraph using all eight parts of speech."
      },
      "referenceMaterial": {
        "primary": "Wren & Martin High School English Grammar and Composition, Chapters 2-10",
        "further": "Cambridge English Grammar in Use"
      }
    }
  },
  "Computing Skills": {
    "1": {
      "keyConcepts": [
        {"title": "Hardware vs Software", "explanation": "Hardware refers to the physical components of a computer, while software refers to the programs and operating systems that run on it."},
        {"title": "Input/Output Devices", "explanation": "Tools used to send data to a computer (input) and receive data from a computer (output)."}
      ],
      "definitions": [
        {"term": "CPU (Central Processing Unit)", "definition": "The primary component of a computer that acts as its 'brain', performing most of the processing."},
        {"term": "RAM (Random Access Memory)", "definition": "A form of computer memory that can be read and changed in any order, typically used to store working data and machine code."}
      ],
      "mnemonic": {
        "acronym": "IPOS",
        "points": [
          "I - Input (Keyboard, Mouse)",
          "P - Process (CPU, RAM)",
          "O - Output (Monitor, Printer)",
          "S - Storage (Hard Drive, SSD)"
        ]
      },
      "btlQuestions": {
        "Remember": "Name three examples of input devices.",
        "Understand": "Describe the function of the motherboard.",
        "Apply": "Determine which type of storage is best for backing up a large video file.",
        "Analyze": "Differentiate between RAM and ROM.",
        "Evaluate": "Argue why an SSD is preferred over an HDD in modern laptops.",
        "Create": "Design a basic block diagram of a computer system."
      },
      "referenceMaterial": {
        "primary": "Introduction to Computers by Peter Norton, Chapter 1",
        "further": "CompTIA IT Fundamentals+ (FC0-U61) Study Guide"
      }
    },
    "2": {
      "keyConcepts": [
        {"title": "Operating Systems (OS)", "explanation": "System software that manages computer hardware, software resources, and provides common services for computer programs."},
        {"title": "Windows UI", "explanation": "The user interface of the Windows operating system, including the desktop, taskbar, start menu, and file explorer."}
      ],
      "definitions": [
        {"term": "Operating System", "definition": "The software that supports a computer's basic functions, such as scheduling tasks, executing applications, and controlling peripherals."},
        {"term": "GUI (Graphical User Interface)", "definition": "A visual way of interacting with a computer using items such as windows, icons, and menus."}
      ],
      "mnemonic": {
        "acronym": "WIMP",
        "points": [
          "W - Windows",
          "I - Icons",
          "M - Menus",
          "P - Pointer"
        ]
      },
      "btlQuestions": {
        "Remember": "List three popular operating systems.",
        "Understand": "Explain the purpose of the Windows Taskbar.",
        "Apply": "Use keyboard shortcuts to minimize all windows.",
        "Analyze": "Compare the Windows Start Menu with the macOS Launchpad.",
        "Evaluate": "Assess the importance of regular OS updates.",
        "Create": "Develop a customized Windows desktop layout for optimal productivity."
      },
      "referenceMaterial": {
        "primary": "Windows 11 Simplified by Paul McFedries",
        "further": "Microsoft Official Windows Support Documentation"
      }
    }
  }
}

# Add default blank templates for the rest up to 15
for i in range(3, 16):
    data["Communicative English"][str(i)] = {
        "keyConcepts": [{"title": "Concept 1", "explanation": "Explanation pending instructor input."}],
        "definitions": [{"term": "Term 1", "definition": "Definition pending instructor input."}],
        "mnemonic": {"acronym": "PENDING", "points": ["P - Pending"]},
        "btlQuestions": {
            "Remember": "Question pending.",
            "Understand": "Question pending.",
            "Apply": "Question pending.",
            "Analyze": "Question pending.",
            "Evaluate": "Question pending.",
            "Create": "Question pending."
        },
        "referenceMaterial": {"primary": "Syllabus textbook", "further": "Online resources"}
    }
    data["Computing Skills"][str(i)] = {
        "keyConcepts": [{"title": "Concept 1", "explanation": "Explanation pending instructor input."}],
        "definitions": [{"term": "Term 1", "definition": "Definition pending instructor input."}],
        "mnemonic": {"acronym": "PENDING", "points": ["P - Pending"]},
        "btlQuestions": {
            "Remember": "Question pending.",
            "Understand": "Question pending.",
            "Apply": "Question pending.",
            "Analyze": "Question pending.",
            "Evaluate": "Question pending.",
            "Create": "Question pending."
        },
        "referenceMaterial": {"primary": "Syllabus textbook", "further": "Online resources"}
    }

out_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
