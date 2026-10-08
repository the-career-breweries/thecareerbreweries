import os
import shutil

sessions = [
    (1, "Computer Hardware Basics", "1.1.1 Introduction to computing devices and lab safety\\n1.1.2 Identifying central processing units (CPU) and memory\\n1.1.3 Exploring input devices (keyboard, mouse, scanners)\\n1.1.4 Exploring output devices (monitors, printers)\\n1.1.5 Understanding storage devices (HDD, SSD, USB)\\n1.1.6 Hands-on: Examining hardware components"),
    (2, "Software Fundamentals", "1.2.1 Difference between hardware and software\\n1.2.2 Types of software: System vs Application\\n1.2.3 Common application software used in aviation\\n1.2.4 Understanding software licenses and open-source\\n1.2.5 Installing and uninstalling basic applications\\n1.2.6 Hands-on: Exploring installed software in the lab"),
    (3, "Operating Systems - Interface & Navigation", "1.3.1 Introduction to Operating Systems (Windows)\\n1.3.2 Navigating the desktop, taskbar, and start menu\\n1.3.3 Managing windows (minimize, maximize, snap)\\n1.3.4 Customizing system settings and display\\n1.3.5 Understanding user accounts and security\\n1.3.6 Hands-on: Personalizing the OS environment"),
    (4, "File Management & Organization", "1.4.1 Understanding the file system hierarchy\\n1.4.2 Creating, renaming, and deleting folders\\n1.4.3 Moving and copying files (Cut, Copy, Paste)\\n1.4.4 File extensions and default applications\\n1.4.5 Searching for files and using filters\\n1.4.6 Hands-on: Organizing a disorganized folder structure"),
    (5, "System Maintenance & Review", "1.5.1 Basic system troubleshooting (Task Manager)\\n1.5.2 Safely connecting and disconnecting peripherals\\n1.5.3 Using built-in diagnostic tools\\n1.5.4 Best practices for file backups\\n1.5.5 Unit 1 comprehensive review and Q&A\\n1.5.6 Practical Assessment: System navigation and file management"),

    (6, "Document Creation and Basic Formatting", "2.1.1 Introduction to MS Word interface and Ribbon\\n2.1.2 Creating, saving, and opening documents\\n2.1.3 Text selection and cursor movement shortcuts\\n2.1.4 Basic font formatting (Bold, Italic, Underline, Color)\\n2.1.5 Using Format Painter and Clear Formatting\\n2.1.6 Hands-on: Drafting a basic aviation memo"),
    (7, "Paragraph Formatting and Layout", "2.2.1 Paragraph alignment and justification\\n2.2.2 Line spacing and paragraph spacing\\n2.2.3 Creating bulleted and numbered lists\\n2.2.4 Multilevel lists for complex documents\\n2.2.5 Indentations and tab stops\\n2.2.6 Hands-on: Formatting an employee policy document"),
    (8, "Working with Tables and Visuals", "2.3.1 Inserting and drawing tables\\n2.3.2 Adding/deleting rows and columns\\n2.3.3 Merging and splitting cells\\n2.3.4 Applying table styles and shading\\n2.3.5 Inserting images, shapes, and SmartArt\\n2.3.6 Hands-on: Creating a flight schedule table"),
    (9, "Page Layout and Document Finalization", "2.4.1 Setting page margins, orientation, and size\\n2.4.2 Adding headers, footers, and page numbers\\n2.4.3 Using page breaks and section breaks\\n2.4.4 Spelling & Grammar check and Thesaurus\\n2.4.5 Print preview and printing options (PDF export)\\n2.4.6 Hands-on: Formatting a multi-page incident report"),
    (10, "Advanced Reporting & Review", "2.5.1 Using Styles for consistent document formatting\\n2.5.2 Generating a Table of Contents automatically\\n2.5.3 Adding cover pages and watermarks\\n2.5.4 Introduction to Mail Merge for bulk letters\\n2.5.5 Unit 2 comprehensive review and Q&A\\n2.5.6 Practical Assessment: End-to-end report creation"),

    (11, "Introduction to Spreadsheets", "3.1.1 MS Excel interface: Workbooks and Worksheets\\n3.1.2 Navigating cells, rows, and columns\\n3.1.3 Data entry techniques (Text, Numbers, Dates)\\n3.1.4 Using AutoFill and Flash Fill\\n3.1.5 Selecting ranges and non-adjacent cells\\n3.1.6 Hands-on: Creating a basic passenger list"),
    (12, "Formatting Cells and Worksheets", "3.2.1 Number formatting (Currency, Percentages, Dates)\\n3.2.2 Font and border formatting\\n3.2.3 Cell alignment, Wrap Text, and Merge & Center\\n3.2.4 Adjusting row height and column width\\n3.2.5 Inserting/deleting rows, columns, and sheets\\n3.2.6 Hands-on: Formatting a ticketing sales report"),
    (13, "Basic Mathematical Formulas", "3.3.1 Understanding formula syntax and the = sign\\n3.3.2 Basic operators: Addition, Subtraction\\n3.3.3 Basic operators: Multiplication, Division\\n3.3.4 Order of operations (PEMDAS) in Excel\\n3.3.5 Copying formulas across cells\\n3.3.6 Hands-on: Calculating basic baggage fees"),
    (14, "Cell Referencing", "3.4.1 Understanding Relative cell referencing\\n3.4.2 Understanding Absolute cell referencing ($)\\n3.4.3 Mixed cell referencing\\n3.4.4 Naming ranges for easier formula reading\\n3.4.5 Identifying and fixing formula errors (#DIV/0!, #REF!)\\n3.4.6 Hands-on: Calculating tax with absolute references"),
    (15, "Essential Functions (Statistical)", "3.5.1 Introduction to Excel Functions\\n3.5.2 Using SUM and AutoSum\\n3.5.3 Using AVERAGE\\n3.5.4 Using MIN and MAX\\n3.5.5 Using COUNT and COUNTA\\n3.5.6 Hands-on: Analyzing daily passenger counts"),
    (16, "Logical and Text Functions", "3.6.1 Understanding the IF function\\n3.6.2 Nested IF functions for complex logic\\n3.6.3 Text functions: CONCATENATE\\n3.6.4 Text functions: UPPER, LOWER, PROPER\\n3.6.5 Text functions: LEFT, RIGHT, MID\\n3.6.6 Hands-on: Formatting and evaluating passenger data"),
    (17, "Data Management and Sorting", "3.7.1 Sorting data alphabetically and numerically\\n3.7.2 Multi-level sorting\\n3.7.3 Applying basic filters to data sets\\n3.7.4 Advanced number and text filters\\n3.7.5 Finding and replacing data\\n3.7.6 Hands-on: Filtering a large flight manifest"),
    (18, "Visualizing Data with Charts", "3.8.1 Importance of data visualization\\n3.8.2 Creating Column and Bar charts\\n3.8.3 Creating Pie and Line charts\\n3.8.4 Formatting chart elements (Titles, Legends, Labels)\\n3.8.5 Changing chart types and source data\\n3.8.6 Hands-on: Visualizing quarterly revenue"),
    (19, "Basic Data Analysis Tools", "3.9.1 Using Conditional Formatting (Highlight cell rules)\\n3.9.2 Conditional Formatting (Data bars and color scales)\\n3.9.3 Removing duplicates from a dataset\\n3.9.4 Text to Columns (Splitting data)\\n3.9.5 Data Validation (Creating drop-down lists)\\n3.9.6 Hands-on: Cleaning and validating crew records"),
    (20, "Printing and Excel Review", "3.10.1 Page layout, orientation, and scaling\\n3.10.2 Setting print areas and page breaks\\n3.10.3 Repeating rows/columns as print titles\\n3.10.4 Adding headers and footers in Excel\\n3.10.5 Comprehensive Unit 3 review\\n3.10.6 Practical Assessment: Data entry to chart creation"),

    (21, "Introduction to PowerPoint", "4.1.1 The PowerPoint interface and workspace\\n4.1.2 Creating a new blank presentation\\n4.1.3 Adding, duplicating, and deleting slides\\n4.1.4 Understanding different slide layouts\\n4.1.5 Adding and formatting text in placeholders\\n4.1.6 Hands-on: Building a 5-slide company intro"),
    (22, "Design Themes and Templates", "4.2.1 Applying and modifying built-in design themes\\n4.2.2 Customizing theme colors and fonts\\n4.2.3 Formatting slide backgrounds\\n4.2.4 Working with the Slide Master for global changes\\n4.2.5 Creating a custom corporate template\\n4.2.6 Hands-on: Applying consistent branding to slides"),
    (23, "Inserting Media and Visuals", "4.3.1 Inserting and formatting images and icons\\n4.3.2 Drawing and styling shapes and text boxes\\n4.3.3 Using SmartArt for process flows and hierarchies\\n4.3.4 Inserting tables and charts into slides\\n4.3.5 Embedding video and audio clips\\n4.3.6 Hands-on: Creating a visual safety briefing"),
    (24, "Animations and Transitions", "4.4.1 Applying slide transitions\\n4.4.2 Customizing transition timing and effects\\n4.4.3 Animating text and objects (Entrance, Emphasis)\\n4.4.4 Using the Animation Pane for sequencing\\n4.4.5 Best practices: Avoiding presentation fatigue\\n4.4.6 Hands-on: Animating a step-by-step process"),
    (25, "Presentation Delivery & Review", "4.5.1 Adding speaker notes to slides\\n4.5.2 Setting up the slideshow and using Presenter View\\n4.5.3 Printing handouts and notes pages\\n4.5.4 Exporting presentations to PDF or Video\\n4.5.5 Unit 4 comprehensive review and Q&A\\n4.5.6 Practical Assessment: Delivering a final presentation"),

    (26, "Internet Basics and Web Browsing", "5.1.1 Introduction to the Internet and WWW\\n5.1.2 Using web browsers (Chrome, Edge, Firefox)\\n5.1.3 Understanding URLs and domains\\n5.1.4 Effective search engine techniques\\n5.1.5 Managing bookmarks and browsing history\\n5.1.6 Hands-on: Researching aviation industry trends"),
    (27, "Professional Email Management", "5.2.1 Introduction to email clients (Outlook, Gmail)\\n5.2.2 Composing, replying, and forwarding emails\\n5.2.3 Using CC and BCC appropriately\\n5.2.4 Attaching files and understanding size limits\\n5.2.5 Organizing inbox using folders, labels, and filters\\n5.2.6 Hands-on: Drafting and organizing business emails"),
    (28, "Cloud Storage and Collaboration", "5.3.1 Concept of Cloud Computing and Storage\\n5.3.2 Introduction to Google Drive / OneDrive\\n5.3.3 Uploading, organizing, and syncing files\\n5.3.4 Sharing files and setting permission levels\\n5.3.5 Real-time collaboration in Docs/Sheets/Slides\\n5.3.6 Hands-on: Co-authoring a shared document"),
    (29, "Cyber Safety and Security Basics", "5.4.1 Importance of cybersecurity in aviation\\n5.4.2 Recognizing phishing emails and scams\\n5.4.3 Creating and managing strong passwords\\n5.4.4 Understanding malware, viruses, and antivirus\\n5.4.5 Safe browsing and downloading practices\\n5.4.6 Hands-on: Security settings and password audit"),
    (30, "Digital Communication Tools & Review", "5.5.1 Introduction to video conferencing (Zoom, Teams)\\n5.5.2 Setting up and scheduling a virtual meeting\\n5.5.3 Screen sharing and meeting etiquette\\n5.5.4 Professional instant messaging (Slack, Teams chat)\\n5.5.5 Unit 5 comprehensive review and Q&A\\n5.5.6 Practical Assessment: Integrated digital skills test"),
]

def create_markdown(session_num, title, topics):
    unit_num = (session_num - 1) // 5 + 1
    
    # Simple markdown format
    md = f"# Session {session_num}: {title}\\n\\n"
    md += "---\\n\\n"
    md += "# Overview\\n\\n"
    md += "Welcome to Session {}. Today we will be covering the following topics:\\n\\n".format(session_num)
    
    for t in topics.split("\\n"):
        md += f"* **{t}**\\n"
        
    md += "\\n---\\n\\n"
    
    for t in topics.split("\\n"):
        if "Hands-on" in t or "Assessment" in t:
            md += f"# {t}\\n\\n"
            md += "Follow the instructor's demonstration in the lab to complete this exercise.\\n\\n"
            md += "---\\n\\n"
        else:
            md += f"# {t}\\n\\n"
            md += "Instructor will guide you through this concept.\\n\\n"
            md += "---\\n\\n"
    
    return md

# Target directories
dirs = [
    r"curriculum-app\\src\\content\\computing-skills\\ug\\bba-aviation\\sem1",
    r"curriculum-app\\src\\content\\computing-skills\\ug\\bsc-aviation\\sem1"
]

for d in dirs:
    if os.path.exists(d):
        # Clean existing files
        for f in os.listdir(d):
            if f.endswith('.md'):
                os.remove(os.path.join(d, f))
                
        # Generate new 30 weeks
        for num, title, topics in sessions:
            filename = os.path.join(d, f"week{num}.md")
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(create_markdown(num, title, topics))
        print(f"Generated 30 sessions in {d}")
