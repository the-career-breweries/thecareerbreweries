import json

path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\data\notes-content.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

computing_notes = {
    "3": {
      "keyConcepts": [{"title": "File System Organization", "explanation": "The logical structuring of files into directories and subdirectories for easy retrieval."}, {"title": "File Explorer Search", "explanation": "Using built-in search tools to locate files quickly."}],
      "definitions": [{"term": "Folder/Directory", "definition": "A storage space where many files can be placed into groups and organize the computer."}, {"term": "File Extension", "definition": "The suffix at the end of a filename (e.g., .docx, .pdf) that indicates the file type."}],
      "mnemonic": {"acronym": "COPS", "points": ["C - Create", "O - Organize", "P - Protect", "S - Search"]},
      "btlQuestions": {"Remember": "What is the purpose of a file extension?", "Understand": "Explain the difference between 'Save' and 'Save As'.", "Apply": "Create a nested folder structure for a given set of files.", "Analyze": "Analyze why a file might not open if its extension is changed.", "Evaluate": "Assess the benefits of cloud storage vs local storage for organization.", "Create": "Design a standard naming convention for your project files."},
      "referenceMaterial": {"primary": "Windows 11 File Management Guide", "further": "Microsoft Support"}
    },
    "4": {
      "keyConcepts": [{"title": "Document Creation", "explanation": "The fundamentals of opening, typing, editing, and saving a document in Microsoft Word."}, {"title": "Word UI Elements", "explanation": "Navigating the Ribbon, Quick Access Toolbar, and Status Bar."}],
      "definitions": [{"term": "Ribbon", "definition": "The strip of buttons and icons located above the work area in MS Office applications."}, {"term": "Cursor", "definition": "The flashing vertical line that indicates where text will be inserted."}],
      "mnemonic": {"acronym": "TOS", "points": ["T - Type", "O - Organize", "S - Save"]},
      "btlQuestions": {"Remember": "Identify the Ribbon in MS Word.", "Understand": "Explain the function of the Quick Access Toolbar.", "Apply": "Open a new blank document and type a paragraph.", "Analyze": "Compare the 'Home' tab with the 'Insert' tab features.", "Evaluate": "Determine the best file format to save a document for sharing.", "Create": "Draft a short introductory letter in Word."},
      "referenceMaterial": {"primary": "MS Word 2021 Step by Step", "further": "Office Training Center"}
    },
    "5": {
      "keyConcepts": [{"title": "Text Formatting", "explanation": "Applying styles like bold, italics, underline, and changing fonts and colors to emphasize text."}, {"title": "Paragraph Formatting", "explanation": "Adjusting alignment, line spacing, and indentation for readability."}],
      "definitions": [{"term": "Alignment", "definition": "The positioning of text relative to the margins (left, center, right, justified)."}, {"term": "Line Spacing", "definition": "The vertical distance between lines of text in a paragraph."}],
      "mnemonic": {"acronym": "FAS", "points": ["F - Font", "A - Alignment", "S - Spacing"]},
      "btlQuestions": {"Remember": "List the four types of text alignment.", "Understand": "Explain why justified alignment is often used in newspapers.", "Apply": "Format a provided text block to have 1.5 line spacing.", "Analyze": "Identify the formatting errors in a poorly structured document.", "Evaluate": "Critique the readability of a document based on its font choice.", "Create": "Format a professional resume template using distinct styles."},
      "referenceMaterial": {"primary": "MS Word 2021 Step by Step", "further": "Typography Basics"}
    },
    "6": {
      "keyConcepts": [{"title": "Inserting Tables", "explanation": "Organizing data into rows and columns within a Word document."}, {"title": "Report Structure", "explanation": "Using headers, footers, page numbers, and a table of contents."}],
      "definitions": [{"term": "Header/Footer", "definition": "Areas in the top and bottom margins of a page where you can insert text or graphics."}, {"term": "Table of Contents", "definition": "An organized list of the parts of a book or document."}],
      "mnemonic": {"acronym": "THP", "points": ["T - Table", "H - Header", "P - Page Number"]},
      "btlQuestions": {"Remember": "How do you insert a basic 3x3 table in Word?", "Understand": "Explain the benefit of using automated page numbers.", "Apply": "Build a basic tabular report for an inventory list.", "Analyze": "Differentiate between table borders and shading.", "Evaluate": "Review a report to ensure consistent header formatting.", "Create": "Construct a multi-page report complete with a Table of Contents."},
      "referenceMaterial": {"primary": "MS Word Advanced Features", "further": "Academic Writing Formatting Guidelines"}
    },
    "Mid-Sem": {
      "keyConcepts": [{"title": "Hardware & OS Revision", "explanation": "Reviewing core components of a PC and Windows navigation."}, {"title": "Word Processing Mastery", "explanation": "Ensuring competence in creating, formatting, and structuring Word documents."}],
      "definitions": [{"term": "Recap", "definition": "To state again the main points of what has been taught."}, {"term": "Competence", "definition": "The ability to do something successfully or efficiently."}],
      "mnemonic": {"acronym": "R&R", "points": ["R - Review", "R - Reinforce"]},
      "btlQuestions": {"Remember": "Recall the steps to save a Word document as a PDF.", "Understand": "Summarize the difference between hardware and software.", "Apply": "Complete an interactive quiz on OS navigation.", "Analyze": "Analyze your common errors when formatting tables.", "Evaluate": "Assess your readiness for the practical examination.", "Create": "Develop a quick-reference cheat sheet for Word shortcuts."},
      "referenceMaterial": {"primary": "Session 1-6 Notes", "further": "Practice Quizzes"}
    },
    "7": {
      "keyConcepts": [{"title": "Spreadsheet Basics", "explanation": "Understanding the grid structure of rows, columns, and cells."}, {"title": "Basic Operators & Formulas", "explanation": "Using mathematical operators (+, -, *, /) to perform calculations."}],
      "definitions": [{"term": "Cell", "definition": "The intersection of a row and a column in a spreadsheet."}, {"term": "Formula", "definition": "An expression that operates on values in a range of cells."}],
      "mnemonic": {"acronym": "BODMAS", "points": ["B - Brackets", "O - Order", "D - Division", "M - Multiplication", "A - Addition", "S - Subtraction (Excel follows this)"]},
      "btlQuestions": {"Remember": "What symbol must every Excel formula begin with?", "Understand": "Explain the difference between a row and a column.", "Apply": "Calculate the total cost of items using basic math operators.", "Analyze": "Identify why a formula is returning an error (e.g., #DIV/0!).", "Evaluate": "Compare the efficiency of manual calculation vs Excel formulas.", "Create": "Design a basic personal budget spreadsheet."},
      "referenceMaterial": {"primary": "Excel 2021 Formulas", "further": "Microsoft Support"}
    },
    "8": {
      "keyConcepts": [{"title": "Core Functions", "explanation": "Using pre-built formulas like SUM, AVERAGE, MIN, and MAX to analyze data rapidly."}, {"title": "Logical Functions", "explanation": "Using IF statements to perform conditional evaluations."}],
      "definitions": [{"term": "Function", "definition": "A predefined formula that performs calculations using specific values in a particular order."}, {"term": "Syntax", "definition": "The specific layout and order of elements in a function."}],
      "mnemonic": {"acronym": "SAMI", "points": ["S - SUM", "A - AVERAGE", "M - MIN/MAX", "I - IF"]},
      "btlQuestions": {"Remember": "List three common Excel functions.", "Understand": "Explain the three arguments required in an IF function.", "Apply": "Apply the AVERAGE function to a student's grade dataset.", "Analyze": "Deconstruct a nested IF statement.", "Evaluate": "Determine the best function to find the lowest sales figure in a year.", "Create": "Build a grading sheet that automatically assigns Pass/Fail using IF."},
      "referenceMaterial": {"primary": "Excel Data Analysis", "further": "ExcelJet Function Guide"}
    },
    "9": {
      "keyConcepts": [{"title": "Data Visualization", "explanation": "Representing numerical data graphically using charts."}, {"title": "Chart Types", "explanation": "Choosing the appropriate chart (Pie, Line, Column) based on the data type."}],
      "definitions": [{"term": "Chart", "definition": "A graphical representation of data."}, {"term": "Legend", "definition": "A key that explains the colors, symbols, or patterns used in a chart."}],
      "mnemonic": {"acronym": "PLC", "points": ["P - Pie (Parts of a whole)", "L - Line (Trends over time)", "C - Column (Comparisons)"]},
      "btlQuestions": {"Remember": "Identify the purpose of a Pie chart.", "Understand": "Explain when a Line chart is more appropriate than a Column chart.", "Apply": "Visualize a monthly sales dataset with a Column chart.", "Analyze": "Interpret a provided chart to find the highest performing month.", "Evaluate": "Critique a chart that uses misleading scales.", "Create": "Design a dashboard with three different chart types."},
      "referenceMaterial": {"primary": "Storytelling with Data", "further": "Excel Chart formatting guide"}
    },
    "10": {
      "keyConcepts": [{"title": "Sorting & Filtering", "explanation": "Organizing and narrowing down large datasets to find specific information."}, {"title": "Conditional Formatting", "explanation": "Applying specific formatting to cells that meet certain criteria to highlight trends."}],
      "definitions": [{"term": "Sorting", "definition": "Arranging data in a specified order (alphabetical, numerical, chronological)."}, {"term": "Filtering", "definition": "Hiding rows of data that do not meet specified criteria."}],
      "mnemonic": {"acronym": "SFC", "points": ["S - Sort", "F - Filter", "C - Condition"]},
      "btlQuestions": {"Remember": "Define Conditional Formatting.", "Understand": "Explain how filtering differs from deleting data.", "Apply": "Filter a dataset to show only sales above $1000.", "Analyze": "Analyze the impact of applying multiple filters to a large table.", "Evaluate": "Determine the best conditional formatting rule to highlight failing grades.", "Create": "Construct a dynamic inventory sheet that highlights low stock automatically."},
      "referenceMaterial": {"primary": "Excel Advanced Data Management", "further": "Data Analysis basics"}
    },
    "11": {
      "keyConcepts": [{"title": "Presentation Fundamentals", "explanation": "The basics of creating slides, choosing layouts, and adding text and images."}, {"title": "Design Principles", "explanation": "Keeping slides uncluttered, highly readable, and visually appealing."}],
      "definitions": [{"term": "Slide Layout", "definition": "The arrangement of placeholders for text, images, and other objects on a slide."}, {"term": "Placeholder", "definition": "A pre-formatted container on a slide into which content is placed."}],
      "mnemonic": {"acronym": "KISS", "points": ["K - Keep", "I - It", "S - Short &", "S - Simple"]},
      "btlQuestions": {"Remember": "How do you add a new slide in PowerPoint?", "Understand": "Explain why text contrast is important in presentation design.", "Apply": "Create a 3-slide presentation introducing yourself.", "Analyze": "Identify design flaws in a crowded, text-heavy slide.", "Evaluate": "Critique the balance of text vs images in a provided presentation.", "Create": "Design a visually compelling title slide for an aviation pitch."},
      "referenceMaterial": {"primary": "PowerPoint 2021 Basics", "further": "Presentation Zen"}
    },
    "12": {
      "keyConcepts": [{"title": "Themes and Master Slide", "explanation": "Applying consistent branding, fonts, and colors across all slides automatically."}, {"title": "Professional Consistency", "explanation": "Ensuring headers, logos, and footers remain strictly aligned throughout the deck."}],
      "definitions": [{"term": "Theme", "definition": "A predefined set of colors, fonts, and visual effects that you apply to your slides."}, {"term": "Slide Master", "definition": "The top slide in a hierarchy that stores information about the theme and slide layouts."}],
      "mnemonic": {"acronym": "TMC", "points": ["T - Theme", "M - Master", "C - Consistency"]},
      "btlQuestions": {"Remember": "What is the Slide Master?", "Understand": "Explain the benefit of editing the Slide Master instead of individual slides.", "Apply": "Apply a global logo to the bottom right corner of all slides using the Master.", "Analyze": "Compare a presentation with a cohesive theme vs one without.", "Evaluate": "Assess how brand consistency impacts audience perception.", "Create": "Develop a custom corporate theme for a mock airline."},
      "referenceMaterial": {"primary": "PowerPoint Advanced Design", "further": "Corporate Branding Guidelines"}
    },
    "13": {
      "keyConcepts": [{"title": "Internet Navigation", "explanation": "Using web browsers effectively, utilizing bookmarks, and understanding URLs."}, {"title": "Cloud Storage & Email", "explanation": "Storing files online (Google Drive, OneDrive) and basic professional email usage."}],
      "definitions": [{"term": "Cloud Storage", "definition": "A model of computer data storage in which digital data is stored in logical pools on multiple servers."}, {"term": "Bookmark", "definition": "A saved shortcut that directs your browser to a specific webpage."}],
      "mnemonic": {"acronym": "WEB", "points": ["W - World Wide Web", "E - Email", "B - Browser"]},
      "btlQuestions": {"Remember": "Name two popular cloud storage providers.", "Understand": "Explain the difference between CC and BCC in an email.", "Apply": "Navigate to a specific aviation authority website and bookmark it.", "Analyze": "Analyze the advantages of cloud storage over a USB drive.", "Evaluate": "Determine the most professional way to attach a large file to an email.", "Create": "Compose a professional email sharing a link to a cloud-stored document."},
      "referenceMaterial": {"primary": "Digital Literacy Fundamentals", "further": "Google Workspace Guide"}
    },
    "14": {
      "keyConcepts": [{"title": "Cyber Safety", "explanation": "Protecting digital identity, recognizing phishing attempts, and maintaining strong passwords."}, {"title": "Digital Etiquette", "explanation": "Professionalism and appropriate behavior when communicating online."}],
      "definitions": [{"term": "Phishing", "definition": "The fraudulent practice of sending emails purporting to be from reputable companies to induce individuals to reveal personal info."}, {"term": "Malware", "definition": "Software that is specifically designed to disrupt, damage, or gain unauthorized access to a computer system."}],
      "mnemonic": {"acronym": "STOP", "points": ["S - Stop", "T - Think", "O - Observe", "P - Proceed safely"]},
      "btlQuestions": {"Remember": "Define malware.", "Understand": "Explain how a strong password differs from a weak one.", "Apply": "Identify the signs of a phishing attempt in a provided sample email.", "Analyze": "Deconstruct a URL to determine if a website is secure (HTTPS vs HTTP).", "Evaluate": "Assess the risks of using public Wi-Fi without a VPN.", "Create": "Develop a set of cyber safety rules for a small office."},
      "referenceMaterial": {"primary": "Cybersecurity Basics", "further": "CISA Guidelines"}
    }
}

for key, val in computing_notes.items():
    data["Computing Skills"][key] = val

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
