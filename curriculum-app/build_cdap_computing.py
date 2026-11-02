import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_computing_cdap():
    doc = docx.Document()
    
    # Page setup - Margins 0.75 in
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Course Delivery and Assessment Plan | Introduction to Computing Skills (SEC 1) | Alliance School of Aviation")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(128, 128, 128)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        frun = fp.add_run("Alliance University - School of Aviation  |  First Semester 2026-27")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(128, 128, 128)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(51, 51, 51)

    # XML Helper Functions
    def set_cell_background(cell, hex_color):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        cell._tc.get_or_add_tcPr().append(tcMar)

    def set_table_borders(table, color="B0C4DE"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/><w:left w:val="single" w:sz="4" w:space="0" w:color="{color}"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/><w:right w:val="single" w:sz="4" w:space="0" w:color="{color}"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="{color}"/></w:tblBorders>')
        tblPr.append(borders)

    def make_header_row(row, bg_color="002060"):
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for cell in row.cells:
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
            for p in cell.paragraphs:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                for r in p.runs:
                    r.font.bold = True
                    r.font.color.rgb = RGBColor(255, 255, 255)
                    r.font.size = Pt(9.5)

    def style_data_row(row, is_even=False, align_center_cols=None):
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        bg_color = "F4F7FB" if is_even else "FFFFFF"
        for i, cell in enumerate(row.cells):
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=90, bottom=90, left=120, right=120)
            for p in cell.paragraphs:
                if align_center_cols and i in align_center_cols:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                for r in p.runs:
                    r.font.size = Pt(9)
                    r.font.name = "Calibri"

    def add_section_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(title)
        run.bold = True
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 32, 96)
        return p

    def add_sub_header(title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run(title)
        run.bold = True
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGBColor(31, 78, 121)
        return p

    # --- TITLE BANNER ---
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run1 = p_title.add_run("ALLIANCE UNIVERSITY\n")
    run1.bold = True
    run1.font.size = Pt(16)
    run1.font.color.rgb = RGBColor(0, 32, 96)
    
    run2 = p_title.add_run("Alliance School of Aviation | Department of Aviation Studies\n")
    run2.bold = True
    run2.font.size = Pt(12)
    run2.font.color.rgb = RGBColor(128, 0, 0)
    
    run3 = p_title.add_run("COURSE DELIVERY AND ASSESSMENT PLAN (COURSE OUTLINE)\n")
    run3.bold = True
    run3.font.size = Pt(13)
    run3.font.color.rgb = RGBColor(0, 32, 96)
    
    run4 = p_title.add_run("Academic Year 2026–27 | First Semester (Batch 2026–2030)")
    run4.font.size = Pt(10.5)
    run4.font.italic = True
    run4.font.color.rgb = RGBColor(80, 80, 80)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # --- SECTION 1: COURSE METADATA & DETAILS TABLE ---
    add_section_header("1. Course Identification and Institutional Metadata")
    
    tbl_meta = doc.add_table(rows=10, cols=4)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_meta)
    
    meta_data = [
        [("School", True), ("Alliance School of Aviation", False), ("Program", True), ("B.Sc. Aviation / BBA Aviation Management", False)],
        [("Course Code", True), ("SEC 1", False), ("Course Title", True), ("Introduction to Computing Skills", False)],
        [("Credits", True), ("1 Credit", False), ("Course Type", True), ("Skill Enhancement Course (SEC / Practical Lab)", False)],
        [("L – T – P – S – C", True), ("0 – 0 – 2 – 0 – 1", False), ("Contact Hours / Week", True), ("2 Practical Lab Hours / Week", False)],
        [("Total Contact Hours", True), ("30 Hours", False), ("Total Sessions", True), ("30 Sessions / 15 Lab Meetings (2 hrs)", False)],
        [("Academic Year", True), ("2026–27", False), ("Semester", True), ("First Semester (Sem 1)", False)],
        [("Delivery Window", True), ("04 August 2026 – 12 November 2026", False), ("Course Version", True), ("Version 1.0 (Revised 2026)", False)],
        [("Internal Assessment (DSA)", True), ("60 Marks", False), ("Semester End Exam (SEE)", True), ("40 Marks", False)],
        [("Course Learning Level", True), ("BTL-3 (Applying)", False), ("Total Course Marks", True), ("100 Marks", False)],
        [("Pre-requisites", True), ("Nil", False), ("Co-requisites", True), ("Nil", False)],
    ]
    
    col_widths_meta = [Inches(1.8), Inches(2.2), Inches(1.8), Inches(2.2)]
    for r_idx, row in enumerate(tbl_meta.rows):
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for c_idx, cell in enumerate(row.cells):
            cell.width = col_widths_meta[c_idx]
            label, is_header = meta_data[r_idx][c_idx]
            cell.text = label
            set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
            if is_header:
                set_cell_background(cell, "EBF1F8")
                for p in cell.paragraphs:
                    for r in p.runs:
                        r.font.bold = True
                        r.font.size = Pt(9)
                        r.font.color.rgb = RGBColor(0, 32, 96)
            else:
                set_cell_background(cell, "FFFFFF")
                for p in cell.paragraphs:
                    for r in p.runs:
                        r.font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Faculty & Office Hours Table
    tbl_fac = doc.add_table(rows=3, cols=2)
    tbl_fac.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_fac)
    col_widths_fac = [Inches(2.2), Inches(5.8)]
    
    fac_data = [
        [("Course Instructor", True), ("Mr. Sandarsh\nAssistant Professor / Faculty of Aviation Computing\nAlliance School of Aviation, Central Campus, Alliance University\nEmail: sandarsh@alliance.edu.in | Mobile: +91 98450 00000", False)],
        [("Office / Lab Hours", True), ("Tuesday & Thursday: 02:00 PM – 05:00 PM (Aviation IT & Computing Laboratory)", False)],
        [("Course Description & Rationale", True), ("This course introduces students to fundamental computing concepts, office automation productivity software, and digital communication tools essential for contemporary aviation and business operations. Delivered predominantly in a hands-on computing laboratory environment, the course emphasizes practical proficiency across computer architecture, Windows OS file systems, word processing (MS Word) for structured flight reports, spreadsheet modeling (MS Excel) for aviation financial and operational data manipulation, dynamic multimedia presentations (MS PowerPoint) for operational briefings, and collaborative cloud infrastructure. Furthermore, it instills crucial cyber hygiene, data privacy, and information security awareness vital for safeguarding mission-critical aviation information systems.", False)]
    ]
    for r_idx, row in enumerate(tbl_fac.rows):
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for c_idx, cell in enumerate(row.cells):
            cell.width = col_widths_fac[c_idx]
            label, is_header = fac_data[r_idx][c_idx]
            cell.text = label
            set_cell_margins(cell, top=90, bottom=90, left=120, right=120)
            if is_header:
                set_cell_background(cell, "EBF1F8")
                for p in cell.paragraphs:
                    for r in p.runs:
                        r.font.bold = True
                        r.font.size = Pt(9)
                        r.font.color.rgb = RGBColor(0, 32, 96)
            else:
                set_cell_background(cell, "FFFFFF")
                for p in cell.paragraphs:
                    for r in p.runs:
                        r.font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Course Objectives Table
    tbl_obj = doc.add_table(rows=2, cols=2)
    tbl_obj.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_obj)
    tbl_obj.rows[0].cells[0].width = Inches(2.2)
    tbl_obj.rows[0].cells[1].width = Inches(5.8)
    tbl_obj.rows[1].cells[0].width = Inches(2.2)
    tbl_obj.rows[1].cells[1].width = Inches(5.8)
    
    set_cell_background(tbl_obj.rows[0].cells[0], "EBF1F8")
    tbl_obj.rows[0].cells[0].paragraphs[0].add_run("Course Objectives").bold = True
    tbl_obj.rows[0].cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(0, 32, 96)
    
    obj_text = (
        "1. To understand basic computer architecture, hardware components, and operating system file management.\n"
        "2. To develop high proficiency in word processing tools (MS Word) for academic documentation, SOP authoring, and operational flight reporting.\n"
        "3. To apply spreadsheet formulas, advanced functions, data visualization charts, and pivot tables in MS Excel for aviation operational calculations and passenger statistics.\n"
        "4. To create professional, design-compliant executive presentations in MS PowerPoint for aviation operational briefings and management pitches.\n"
        "5. To utilize internet services, cloud storage ecosystems (OneDrive/Google Drive), digital collaboration suites, and observe cybersecurity protocols essential for aviation data security."
    )
    tbl_obj.rows[0].cells[1].paragraphs[0].text = obj_text
    for p in tbl_obj.rows[0].cells[1].paragraphs:
        for r in p.runs:
            r.font.size = Pt(9)

    tbl_obj.rows[1].cells[0].text = "Program Educational Objectives (PEOs)"
    set_cell_background(tbl_obj.rows[1].cells[0], "EBF1F8")
    for r in tbl_obj.rows[1].cells[0].paragraphs[0].runs:
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0, 32, 96)
        
    peo_text = (
        "PEO 1: Technical Excellence and Operational Competence — Graduates shall demonstrate strong technical knowledge and operational proficiency in aviation systems, safety, and air transport management.\n"
        "PEO 2: Safety, Ethics, and Sustainability — Graduates shall uphold the highest standards of aviation safety, ethical responsibility, and sustainable practices in professional decision-making.\n"
        "PEO 3: Effective Communication and Teamwork — Graduates shall communicate clearly and collaborate efficiently in multidisciplinary aviation environments.\n"
        "PEO 4: Lifelong Learning and Global Perspective — Graduates shall engage in continuous professional development, adapt to technological advancements, and contribute effectively within the global aviation industry."
    )
    tbl_obj.rows[1].cells[1].paragraphs[0].text = peo_text
    for p in tbl_obj.rows[1].cells[1].paragraphs:
        for r in p.runs:
            r.font.size = Pt(9)
            
    for row in tbl_obj.rows:
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for cell in row.cells:
            set_cell_margins(cell, top=90, bottom=90, left=120, right=120)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Program Outcomes (POs) & PSOs Table
    tbl_po = doc.add_table(rows=2, cols=2)
    tbl_po.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_po)
    tbl_po.rows[0].cells[0].width = Inches(2.2)
    tbl_po.rows[0].cells[1].width = Inches(5.8)
    tbl_po.rows[1].cells[0].width = Inches(2.2)
    tbl_po.rows[1].cells[1].width = Inches(5.8)
    
    tbl_po.rows[0].cells[0].text = "Program Outcomes (POs)"
    set_cell_background(tbl_po.rows[0].cells[0], "EBF1F8")
    for r in tbl_po.rows[0].cells[0].paragraphs[0].runs:
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0, 32, 96)
        
    po_text = (
        "PO 1: Aviation Fundamentals — Understand core principles of aerodynamics, aircraft systems, meteorology, navigation, and aviation regulations.\n"
        "PO 2: Operational Competence — Demonstrate proficiency in flight operations, airport management, aviation safety procedures, and regulatory compliance.\n"
        "PO 3: Applied Technical Skills — Apply aviation theories and technical knowledge to real-world operational and safety challenges.\n"
        "PO 4: Problem Solving and Decision-Making — Analyze complex aviation scenarios and implement effective, safe, and timely solutions.\n"
        "PO 5: Safety and Risk Management — Identify potential risks and apply safety management systems (SMS) to ensure operational reliability.\n"
        "PO 6: Lifelong Learning — Adapt to emerging aviation technologies, digital systems, and global industry advancements.\n"
        "PO 7: Aviation Systems and Technology — Understand aircraft instruments, avionics, air traffic systems, and airport infrastructure.\n"
        "PO 8: Regulatory and Compliance Knowledge — Comprehend national and international aviation standards, policies, and environmental regulations.\n"
        "PO 9: Communication and Teamwork — Exhibit effective communication and coordination skills in multicultural and multidisciplinary aviation environments.\n"
        "PO 10: Social and Environmental Responsibility — Recognize aviation’s impact on society and environment, promoting sustainable air transport practices.\n"
        "PO 11: Professional and Leadership Skills — Demonstrate leadership, discipline, and ethical responsibility in aviation operations.\n"
        "PO 12: Research and Analytical Skills — Apply analytical methods and research skills to improve aviation efficiency, safety, and innovation."
    )
    tbl_po.rows[0].cells[1].paragraphs[0].text = po_text
    for p in tbl_po.rows[0].cells[1].paragraphs:
        for r in p.runs:
            r.font.size = Pt(8.5)

    tbl_po.rows[1].cells[0].text = "Program Specific Outcomes (PSOs)"
    set_cell_background(tbl_po.rows[1].cells[0], "EBF1F8")
    for r in tbl_po.rows[1].cells[0].paragraphs[0].runs:
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(0, 32, 96)
        
    pso_text = (
        "PSO 1: Flight Operations and Aviation Systems Proficiency — Apply core concepts of aerodynamics, aircraft systems, air navigation, and meteorology to support safe and efficient flight operations.\n"
        "PSO 2: Airport and Airline Management — Demonstrate the ability to analyze operational requirements and manage airport, airline, and ground handling functions using modern aviation technologies and regulatory frameworks.\n"
        "PSO 3: Aviation Safety and Regulatory Compliance — Implement safety management systems (SMS), risk assessment procedures, and adhere to national and international aviation regulations to ensure operational safety and compliance.\n"
        "PSO 4: Innovation and Emerging Aviation Technologies — Explore advancements such as avionics systems, unmanned aerial systems (UAS), sustainable aviation practices, and digital aviation technologies while demonstrating analytical and research capabilities."
    )
    tbl_po.rows[1].cells[1].paragraphs[0].text = pso_text
    for p in tbl_po.rows[1].cells[1].paragraphs:
        for r in p.runs:
            r.font.size = Pt(8.5)

    for row in tbl_po.rows:
        row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for cell in row.cells:
            set_cell_margins(cell, top=90, bottom=90, left=120, right=120)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Institutional & Lab Policies Table
    tbl_pol = doc.add_table(rows=3, cols=2)
    tbl_pol.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_pol)
    tbl_pol.rows[0].cells[0].width = Inches(2.2)
    tbl_pol.rows[0].cells[1].width = Inches(5.8)
    tbl_pol.rows[1].cells[0].width = Inches(2.2)
    tbl_pol.rows[1].cells[1].width = Inches(5.8)
    tbl_pol.rows[2].cells[0].width = Inches(2.2)
    tbl_pol.rows[2].cells[1].width = Inches(5.8)
    
    policies = [
        ("Lab Attendance & Conduct Policy", "Minimum 75% practical lab attendance is mandatory. Students must attend all scheduled computer laboratory sessions in full formal dress code. Lab workbooks and digital exercise files must be completed and signed by the instructor at the end of each session."),
        ("Cyber Safety & Lab Usage Policy", "All students must strictly observe the University Acceptable IT Usage Policy. Unauthorized installation of software, game executables, modifying system settings, or downloading unapproved materials from the web is strictly prohibited and attracts system suspension."),
        ("Academic Integrity & Digital Originality", "Spreadsheets, macros, presentation decks, and documents must be individually constructed. Re-submitting another student’s workbook or using automated plagiarized templates will result in a zero grade for the respective continuous evaluation component.")
    ]
    for idx, (head, desc) in enumerate(policies):
        tbl_pol.rows[idx].cells[0].text = head
        set_cell_background(tbl_pol.rows[idx].cells[0], "EBF1F8")
        for r in tbl_pol.rows[idx].cells[0].paragraphs[0].runs:
            r.font.bold = True
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(0, 32, 96)
        tbl_pol.rows[idx].cells[1].text = desc
        for p in tbl_pol.rows[idx].cells[1].paragraphs:
            for r in p.runs:
                r.font.size = Pt(9)
        set_cell_margins(tbl_pol.rows[idx].cells[0], top=80, bottom=80, left=120, right=120)
        set_cell_margins(tbl_pol.rows[idx].cells[1], top=80, bottom=80, left=120, right=120)

    doc.add_page_break()

    # --- SECTION 2: COURSE OUTCOMES (COs) ---
    add_section_header("2. Course Outcomes (COs) & Revised Bloom's Taxonomy Levels")
    
    p_co_intro = doc.add_paragraph("On successful completion of the course Introduction to Computing Skills (SEC 1), students will be able to:")
    p_co_intro.paragraph_format.space_after = Pt(4)
    
    tbl_co = doc.add_table(rows=6, cols=3)
    tbl_co.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_co)
    tbl_co.rows[0].cells[0].text = "CO #"
    tbl_co.rows[0].cells[1].text = "Course Outcome Statement"
    tbl_co.rows[0].cells[2].text = "Revised Bloom's Taxonomy (RBT) Level"
    make_header_row(tbl_co.rows[0], bg_color="002060")
    
    col_widths_co = [Inches(1.0), Inches(5.2), Inches(1.8)]
    for row in tbl_co.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_widths_co[idx]
            
    co_statements = [
        ("CO 1", "Explain the basic concepts of computers, hardware, software, operating systems, and file management in business and aviation contexts.", "BTL 2 (Understanding)"),
        ("CO 2", "Prepare professional documents, formatted SOP manuals, and operational flight reports using MS Office Word processing tools.", "BTL 3 (Applying)"),
        ("CO 3", "Apply spreadsheet formulas, advanced functions, dynamic charts, and basic data analysis techniques using MS Excel for aviation operational metrics.", "BTL 3 (Applying)"),
        ("CO 4", "Create professional executive presentations using appropriate slide layouts, master templates, and visual design principles in MS PowerPoint.", "BTL 6 (Creating)"),
        ("CO 5", "Use internet services, email systems, cloud storage collaboration platforms, and digital communication tools while strictly adhering to cybersecurity best practices.", "BTL 3 (Applying)")
    ]
    for idx, (co_id, stmt, btl) in enumerate(co_statements):
        row = tbl_co.rows[idx + 1]
        row.cells[0].text = co_id
        row.cells[1].text = stmt
        row.cells[2].text = btl
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[0, 2])

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # --- SECTION 3: ASSESSMENT METHODS & SCHEME ---
    add_section_header("3. Assessment Framework: During Semester Assessment (DSA) & Semester End Exam (SEE)")
    
    p_ass_intro = doc.add_paragraph("Assessment for this practical skill enhancement course consists of continuous During Semester Assessment (DSA - 60 Marks) across laboratory assignments and practical tasks, and a Semester End Practical Examination (SEE - 40 Marks). Passing requires a minimum of 50% in DSA and 50% in SEE with a cumulative passing minimum of 50%.")
    p_ass_intro.paragraph_format.space_after = Pt(4)
    
    tbl_ass = doc.add_table(rows=6, cols=7)
    tbl_ass.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_ass)
    
    ass_headers = ["Sl.", "Assessment Component", "Description & Modality", "CO(s) Assessed", "Module Coverage", "Weightage (Marks)", "Timeline / Frequency"]
    for idx, h in enumerate(ass_headers):
        tbl_ass.rows[0].cells[idx].text = h
    make_header_row(tbl_ass.rows[0], bg_color="002060")
    
    col_widths_ass = [Inches(0.5), Inches(1.5), Inches(2.4), Inches(0.9), Inches(0.9), Inches(0.9), Inches(0.9)]
    for row in tbl_ass.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_widths_ass[idx]
            
    ass_rows = [
        ("1", "Assignment", "Practical document authoring assignment in MS Word (formatting flight dispatch report with TOC, tables, and styles).", "CO 1, CO 2", "Units 1–2", "10 Marks", "Twice (Weeks 4 & 9)"),
        ("2", "Presentation", "Technical presentation design and live demonstration using MS PowerPoint on modern aviation digital technologies.", "CO 2, CO 4", "Units 1–4", "15 Marks", "Twice (Weeks 6 & 11)"),
        ("3", "Case Study / Lab Practical", "Hands-on data handling case study in MS Excel (analyzing flight delays, fuel consumption, and passenger load factors).", "CO 3, CO 5", "Units 1–5", "15 Marks", "Continuous (Weeks 8 & 13)"),
        ("4", "Mid-Semester Lab Exam", "Timed hands-on laboratory examination testing Windows file operations, MS Word formatting, and MS Excel formula modeling.", "CO 1, CO 2, CO 3", "Units 1–3", "20 Marks", "Once (Week 8)"),
        ("Total DSA", "During Semester Assessment", "Cumulative Continuous Practical Evaluation across all lab modules", "CO 1–5", "Units 1–5", "60 Marks", "Continuous"),
    ]
    for idx, (sl, comp, desc, co_m, mod, wt, time) in enumerate(ass_rows):
        row = tbl_ass.rows[idx + 1]
        row.cells[0].text = sl
        row.cells[1].text = comp
        row.cells[2].text = desc
        row.cells[3].text = co_m
        row.cells[4].text = mod
        row.cells[5].text = wt
        row.cells[6].text = time
        if idx == 4:
            row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
            for c in row.cells:
                set_cell_background(c, "EBF1F8")
                for p in c.paragraphs:
                    for r in p.runs:
                        r.font.bold = True
                        r.font.size = Pt(9)
                        r.font.color.rgb = RGBColor(0, 32, 96)
        else:
            style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[0, 3, 4, 5, 6])

    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    
    # SEE Table
    tbl_see = doc.add_table(rows=2, cols=7)
    tbl_see.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_see)
    for idx, h in enumerate(["Sl.", "Assessment Component", "Description & Modality", "CO(s) Assessed", "Module Coverage", "Weightage (Marks)", "Timeline / Frequency"]):
        tbl_see.rows[0].cells[idx].text = h
    make_header_row(tbl_see.rows[0], bg_color="1F4E79")
    for row in tbl_see.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_widths_ass[idx]
            
    see_row = tbl_see.rows[1]
    see_row.cells[0].text = "5"
    see_row.cells[1].text = "Semester End Exam (SEE)"
    see_row.cells[2].text = "Summative Hands-on Practical Examination (2 Hours duration) conducted in Computer Lab: Excel data modeling, Word report, and viva voce."
    see_row.cells[3].text = "CO 1–5"
    see_row.cells[4].text = "Units 1–5"
    see_row.cells[5].text = "40 Marks"
    see_row.cells[6].text = "End of Semester (Week 16)"
    style_data_row(see_row, is_even=False, align_center_cols=[0, 3, 4, 5, 6])

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # --- SECTION 4: CO-PO-PSO MAPPING MATRIX ---
    add_section_header("4. CO – PO and CO – PSO Mapping Matrix")
    
    p_map_intro = doc.add_paragraph("Correlation Levels: 3 = Strong Contribution (SC), 2 = Moderate Contribution (MC), 1 = Weak Contribution (WC), '—' = No Correlation.\n(Values strictly adopted from Department of Aviation Studies First Semester Course Catalogue 2026–2030)")
    p_map_intro.paragraph_format.space_after = Pt(4)
    for r in p_map_intro.runs:
        r.font.size = Pt(8.5)
        r.font.italic = True
        
    tbl_map = doc.add_table(rows=7, cols=16)
    tbl_map.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_map)
    
    map_headers = ["COs", "PO 1", "PO 2", "PO 3", "PO 4", "PO 5", "PO 6", "PO 7", "PO 8", "PO 9", "PO 10", "PSO 1", "PSO 2", "PSO 3", "PSO 4", "Avg."]
    for idx, h in enumerate(map_headers):
        tbl_map.rows[0].cells[idx].text = h
    make_header_row(tbl_map.rows[0], bg_color="002060")
    
    col_w_map = [Inches(0.65)] + [Inches(0.48)] * 14 + [Inches(0.55)]
    for row in tbl_map.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_map[idx]
            
    # Exact catalogue mapping from Page 33 of BSc catalogue
    mapping_data = [
        ["CO 1", "2", "1", "—", "1", "—", "1", "1", "—", "—", "1", "1", "—", "—", "—", "1.0"],
        ["CO 2", "2", "2", "—", "2", "1", "1", "—", "—", "3", "1", "2", "1", "—", "—", "1.7"],
        ["CO 3", "2", "3", "1", "3", "2", "1", "—", "—", "2", "1", "2", "3", "1", "—", "2.1"],
        ["CO 4", "2", "2", "—", "3", "1", "1", "—", "1", "3", "2", "2", "2", "1", "—", "2.0"],
        ["CO 5", "2", "2", "—", "3", "1", "3", "2", "1", "3", "2", "2", "2", "1", "—", "2.2"],
        ["Avg.", "2.0", "2.0", "0.2", "2.4", "1.0", "1.4", "0.6", "0.4", "2.2", "1.4", "1.8", "1.6", "0.6", "—", "1.8"]
    ]
    for r_idx, r_vals in enumerate(mapping_data):
        row = tbl_map.rows[r_idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        if r_idx == 5:
            row._tr.get_or_add_trPr().append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
            for cell in row.cells:
                set_cell_background(cell, "EBF1F8")
                for p in cell.paragraphs:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    for r in p.runs:
                        r.font.bold = True
                        r.font.size = Pt(8.5)
                        r.font.color.rgb = RGBColor(0, 32, 96)
        else:
            style_data_row(row, is_even=(r_idx % 2 == 1), align_center_cols=list(range(16)))

    doc.add_page_break()

    # --- SECTION 5: TOPIC DELIVERY AND ASSESSMENT PLAN (TDAP) - 30 SESSIONS ---
    add_section_header("5. Topic Delivery and Assessment Plan (TDAP) — 30 Contact Sessions")
    
    p_tdap_intro = doc.add_paragraph("Chronological schedule of hands-on laboratory topics delivered across the 15-week instructional semester (04 August 2026 – 12 November 2026). Classes are scheduled twice weekly (Tuesdays and Thursdays) in the Aviation Computing Lab.")
    p_tdap_intro.paragraph_format.space_after = Pt(4)
    
    tbl_tdap = doc.add_table(rows=31, cols=10)
    tbl_tdap.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tdap)
    
    tdap_headers = ["Sl.", "Module", "Proposed Date", "Topic & Practical Laboratory Exercise", "CO / BTL", "Actual Date", "Reference / Advance Reading Material", "Teaching Learning Outcome (TLO)", "Instructional Method", "Assessment Method for TLO"]
    for idx, h in enumerate(tdap_headers):
        tbl_tdap.rows[0].cells[idx].text = h
    make_header_row(tbl_tdap.rows[0], bg_color="002060")
    
    col_w_tdap = [
        Inches(0.4),  # Sl.
        Inches(0.9),  # Module
        Inches(0.75), # Proposed Date
        Inches(1.85), # Topic
        Inches(0.65), # CO/BTL
        Inches(0.65), # Actual Date
        Inches(1.25), # Reference
        Inches(1.4),  # TLO
        Inches(0.8),  # Method
        Inches(0.75)  # Assessment
    ]
    for row in tbl_tdap.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_tdap[idx]

    # Exactly 30 sessions matching the 5 units (5 + 5 + 10 + 5 + 5 = 30 hrs)
    sessions_data = [
        # UNIT 1: Introduction to Computers & Operating Systems (5 Hours)
        (1, "Unit 1: Hardware/OS", "04/08/2026", "1.1 Computer Architecture: CPU, Motherboard, Primary/Secondary Storage, System Buses, Aviation Server Architectures", "CO 1\nBTL 2", "", "Rajaraman, Ch. 1–2;\nPeter Norton, Ch. 1", "Identify core hardware components and explain data bus operations in enterprise systems.", "Lecture & Hardware Dismantling Demo", "Hardware Identification Quiz"),
        (2, "Unit 1: Hardware/OS", "06/08/2026", "1.2 Aviation Peripheral Devices: Scanners, Boarding Pass Barcode Readers, Biometric E-Gates, RFID Baggage Scanners", "CO 1\nBTL 2", "", "Peter Norton, Ch. 3;\nAirport IT Handouts", "Differentiate optical, RFID, and magnetic input peripherals used across airport terminals.", "Demonstration, Hands-on Setup", "Peripheral Mapping Sheet"),
        (3, "Unit 1: Hardware/OS", "11/08/2026", "1.3 Operating Systems Architecture: Windows 11 vs Linux vs macOS; Kernel, Shell, Drivers, Aircraft Embedded Avionics OS", "CO 1\nBTL 2", "", "Rajaraman, Ch. 5;\nSinha & Sinha, Ch. 6", "Explain the role of operating systems in allocating CPU, memory, and I/O resources.", "Interactive Lab Walkthrough", "OS Architecture Worksheet"),
        (4, "Unit 1: Hardware/OS", "13/08/2026", "1.4 Windows 11 Interface & System Utilities: Desktop Navigation, Task Manager, Control Panel, Device Manager, Disk Cleanup", "CO 1\nBTL 2", "", "Shelly Cashman, Windows Module 1;\nMicrosoft Learn", "Utilize Task Manager to monitor process usage and manage background services effectively.", "Hands-on Lab Exercise", "Lab Task 1 (OS Config)"),
        (5, "Unit 1: Hardware/OS", "18/08/2026", "1.5 Hierarchical File Management: Folder Trees, Absolute/Relative Paths, Extensions, Archiving (.zip/.rar), Shortcut Creation", "CO 1\nBTL 2", "", "Peter Norton, Ch. 4;\nShelly Cashman Mod 2", "Organize a structured aviation operational folder hierarchy with correct permission settings.", "Hands-on File Tree Challenge", "File Management Lab Test"),
        
        # UNIT 2: Word Processing — MS Word (5 Hours)
        (6, "Unit 2: MS Word", "20/08/2026", "2.1 MS Word Workspace & Document Setup: Ribbon Customization, Page Setup, Margins, Orientations, Headers, Footers, Page Numbers", "CO 2\nBTL 3", "", "Shelly Cashman, Word Mod 1;\nMicrosoft 365 Guide", "Configure standard page geometry, section breaks, and running headers for aviation reports.", "Guided Lab Exercise", "Document Setup Task"),
        (7, "Unit 2: MS Word", "25/08/2026", "2.2 Typography, Styles & Document Formatting: Fonts, Paragraph Indentations, Line Spacing, Heading Hierarchy (H1/H2/H3)", "CO 2\nBTL 3", "", "Shelly Cashman, Word Mod 2;\nAPA Manual 7th Ed.", "Apply consistent styles and multi-level heading formatting adhering to corporate standards.", "Hands-on Style Workshop", "In-class Formatting Task"),
        (8, "Unit 2: MS Word", "27/08/2026", "2.3 Tables in MS Word: Table Creation, Cell Merging/Splitting, Borders, Shading, Formulas in Tables, Flight Roster Formatting", "CO 2\nBTL 3", "", "Shelly Cashman, Word Mod 3;\nAirline SOP Samples", "Design and format a complex flight crew duty roster table with calculated sums and shading.", "Hands-on Table Design Studio", "Assignment 1 (Part A)"),
        (9, "Unit 2: MS Word", "01/09/2026", "2.4 Graphics, SmartArt & Diagrams: Inserting Aircraft Schematics, Flowcharts, Captions, Cross-references, Bookmark Navigation", "CO 2\nBTL 3", "", "Shelly Cashman, Word Mod 4;\nICAO SOP Guides", "Embed captioned diagrams and build a SmartArt passenger boarding workflow flowchart.", "Hands-on Design Exercise", "Visual SOP Submission"),
        (10, "Unit 2: MS Word", "03/09/2026", "2.5 Advanced Word Features: Automated Table of Contents (TOC), Bibliography/Citations, Mail Merge for Boarding Notifications", "CO 2\nBTL 3", "", "Shelly Cashman, Word Mod 5;\nMicrosoft Learn", "Generate an automated TOC and execute Mail Merge linked to an Excel recipient list.", "Hands-on Mail Merge Lab", "Assignment 1 (Part B)"),
        
        # UNIT 3: Spreadsheets & Data Handling — MS Excel (10 Hours)
        (11, "Unit 3: MS Excel", "08/09/2026", "3.1 MS Excel Environment & Basics: Grid System, Cell Addresses, Relative vs Absolute References ($A$1), Autofill Patterns", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 1;\nHarvey, Excel All-in-One", "Construct error-free formulas utilizing relative, absolute, and mixed cell referencing.", "Guided Lab Drill", "Referencing Worksheet"),
        (12, "Unit 3: MS Excel", "10/09/2026", "3.2 Mathematical & Statistical Functions: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA applied to Daily Flight Operations Data", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 2;\nAirline Ops Dataset", "Calculate daily airline passenger totals, mean flight delays, and extreme turnarounds.", "Hands-on Data Entry Lab", "Statistical Lab Task"),
        (13, "Unit 3: MS Excel", "15/09/2026", "3.3 Text & Date-Time Functions: UPPER, LOWER, PROPER, TRIM, CONCATENATE, TEXTJOIN, LEFT, RIGHT, DATEDIF, NOW, TODAY", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 3;\nHarvey, Ch. 5", "Clean messy passenger name data and calculate aircraft turnaround block times in hours/minutes.", "Data Cleaning Workshop", "Data Parsing Exercise"),
        (14, "Unit 3: MS Excel", "17/09/2026", "3.4 Logical Functions I: Simple IF, Nested IF, AND, OR, NOT for Baggage Weight Calculations and Ticket Class Surcharges", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 4;\nIATA Baggage Rules", "Automate baggage excess fee calculations and ticket class classification using nested IF logic.", "Logic Building Studio", "Nested IF Lab Problem"),
        (15, "Unit 3: MS Excel", "22/09/2026", "3.5 Conditional Aggregations: SUMIF, SUMIFS, COUNTIF, COUNTIFS, AVERAGEIFS for Aircraft Fleet Reliability & Utilization", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 5;\nFleet Ops Manual", "Analyze multi-criteria flight metrics (total fuel consumed by Boeing 737 aircraft on BLR-DEL).", "Hands-on Querying Lab", "Conditional Aggregation Drill"),
        (16, "Unit 3: MS Excel", "24/09/2026", "3.6 Lookup & Reference Functions: VLOOKUP, HLOOKUP, XLOOKUP, INDEX and MATCH for Airport IATA Code Query Databases", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 6;\nAirport Codes Database", "Build an automated flight look-up engine retrieving city, terminal, and gate from flight numbers.", "Database Lookup Studio", "VLOOKUP/XLOOKUP Test"),
        (17, "Unit 3: MS Excel", "29/09/2026", "3.7 Data Visualization in Excel: Column Charts, Clustered Bar Charts, Line Trends, Dual-Axis Charts for Seat Load Factor", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 7;\nAirline Financial Reports", "Plot professional dual-axis charts showing seat capacity versus revenue passenger kilometers.", "Visualization Studio", "Chart Design Evaluation"),
        (18, "Unit 3: MS Excel", "01/10/2026", "3.8 Data Sorting, Multi-level Filtering, Custom Lists & Data Validation Rules (Restricting Flight Number & Date Formats)", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 8;\nHarvey, Ch. 8", "Implement strict data validation dropdowns and multi-tiered sorts on aircraft maintenance logs.", "Data Integrity Workshop", "Data Validation Lab\n(Mid-Sem Prep)"),
        (19, "Unit 3: MS Excel", "06/10/2026", "3.9 Pivot Tables & Pivot Charts: Summarizing Massive Flight Delay Datasets, Grouping Dates, Calculated Fields, Slicers, Timelines", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 9;\nDGCA Monthly Traffic", "Synthesize a 10,000-row delay database into an interactive Pivot dashboard with slicers.", "Pivot Studio Exercise", "Case Study Task (Pivot Model)"),
        (20, "Unit 3: MS Excel", "08/10/2026", "3.10 Advanced What-If Analysis: Goal Seek (Calculating Break-even Seat Factor), Data Tables, and Scenario Manager", "CO 3\nBTL 3", "", "Shelly Cashman, Excel Mod 10;\nAirlines Economics Guide", "Compute required passenger load factor to achieve route profitability using Goal Seek.", "What-If Modeling Lab", "What-If Analysis Report"),
        
        # MID-SEMESTER EXAMINATION WINDOW (Conducted between Sessions 20 and 21)
        
        # UNIT 4: Presentation Tools — MS PowerPoint (5 Hours)
        (21, "Unit 4: MS PowerPoint", "13/10/2026", "4.1 PowerPoint Workspace & Core Principles: 6x6 Rule, Visual Hierarchy, Slide Master Customization, Layout Templating", "CO 4\nBTL 6", "", "Shelly Cashman, PPT Mod 1;\nReynolds, Presentation Zen", "Configure a branded slide master with official Alliance School of Aviation typography and colors.", "Slide Master Studio", "Slide Master Template Task"),
        (22, "Unit 4: MS PowerPoint", "15/10/2026", "4.2 Slide Typography, Visual Contrast & Layout Formatting: Structuring Flight Safety Briefings, Avoiding Bullet-Point Overload", "CO 4\nBTL 6", "", "Shelly Cashman, PPT Mod 2;\nDuarte, Slide:ology", "Refactor text-heavy bullet slides into high-impact visual layouts with cards and icons.", "Redesign Workshop", "Slide Redesign Exercise"),
        (23, "Unit 4: MS PowerPoint", "20/10/2026", "4.3 Embedding Dynamic Data: Linking Live Excel Charts, Tables, Infographics, and SmartArt Process Flows", "CO 4\nBTL 6", "", "Shelly Cashman, PPT Mod 3;\nMicrosoft Learn", "Embed dynamically linked Excel charts that automatically update when source data changes.", "Data Integration Lab", "Presentation 1 (Deck Draft)"),
        (24, "Unit 4: MS PowerPoint", "22/10/2026", "4.4 Multimedia Integration: Video Clips, Audio Announcements, Action Buttons, Non-linear Navigation, Hyperlinks", "CO 4\nBTL 6", "", "Shelly Cashman, PPT Mod 4;\nMultimedia Handouts", "Embed passenger safety briefing videos and configure interactive non-linear menu buttons.", "Interactive Deck Lab", "Interactive Deck Task"),
        (25, "Unit 4: MS PowerPoint", "27/10/2026", "4.5 Animation & Presentation Delivery: Professional Transitions, Entrance Animations, Presenter View, Rehearse Timings", "CO 4\nBTL 6", "", "Shelly Cashman, PPT Mod 5;\nPublic Speaking Manual", "Deliver a polished 5-minute technical briefing using Presenter View and subtle motion paths.", "Live Presentation Studio", "Presentation 2 (Live Defense)"),
        
        # UNIT 5: Internet, Cloud Tools & Cybersecurity Basics (5 Hours)
        (26, "Unit 5: Internet/Cyber", "29/10/2026", "5.1 Internet Fundamentals: IP Addressing, DNS, HTTP/HTTPS Protocols, Search Engine Operators, Boolean Logic for Aviation Research", "CO 5\nBTL 3", "", "Peter Norton, Ch. 7;\nOpenStax Business Info", "Apply advanced Google search operators (`filetype:pdf`, `site:dgca.gov.in`) to locate aviation records.", "Web Research Lab", "Advanced Search Worksheet"),
        (27, "Unit 5: Internet/Cyber", "03/11/2026", "5.2 Cloud Storage & Modern Workspaces: MS OneDrive, SharePoint, Google Drive, Real-time Collaborative Co-authoring", "CO 5\nBTL 3", "", "Microsoft Learn, M365 Cloud;\nGoogle Workspace Guide", "Share cloud documents with specific role permissions (Viewer/Editor) and manage version histories.", "Collaborative Cloud Studio", "Cloud Collaboration Task"),
        (28, "Unit 5: Internet/Cyber", "05/11/2026", "5.3 Digital Communication & Professional Email: MS Outlook / Gmail Calendar Scheduling, Email Security, Phishing Header Analysis", "CO 5\nBTL 3", "", "Shelly Cashman, Outlook Mod;\nSANS Security Awareness", "Schedule meeting invites with Teams links and analyze raw email headers to identify spoofed senders.", "Communication Security Lab", "Phishing Detection Quiz"),
        (29, "Unit 5: Internet/Cyber", "10/11/2026", "5.4 Cybersecurity Hygiene: Malware, Ransomware, Password Managers, Multi-Factor Authentication (MFA), Wi-Fi Safety", "CO 5\nBTL 3", "", "Peter Norton, Ch. 10;\nCERT-In Cyber Guidelines", "Evaluate password entropy, configure 2FA/MFA, and identify vulnerabilities on public airport Wi-Fi.", "Cyber Defense Simulation", "Cybersecurity Audit Sheet"),
        (30, "Unit 5: Internet/Cyber", "12/11/2026", "5.5 Aviation Digital Infrastructure & Capstone Lab Review: Critical Airport Cyber Protection, Practical Exam Review & Viva", "CO 5\nBTL 3", "", "ICAO Cyber Security Strategy;\nComprehensive Lab Dossier", "Demonstrate comprehensive digital literacy across OS, Word, Excel, PPT, and Cloud in capstone viva.", "Capstone Practical Lab Viva", "Capstone Lab Evaluation &\nOutcome Attainment")
    ]
    
    for idx, s in enumerate(sessions_data):
        row = tbl_tdap.rows[idx + 1]
        row.cells[0].text = str(s[0])
        row.cells[1].text = s[1]
        row.cells[2].text = s[2]
        row.cells[3].text = s[3]
        row.cells[4].text = s[4]
        row.cells[5].text = s[5]
        row.cells[6].text = s[6]
        row.cells[7].text = s[7]
        row.cells[8].text = s[8]
        row.cells[9].text = s[9]
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[0, 1, 2, 4, 5, 8, 9])

    doc.add_page_break()

    # --- SECTION 6: LEARNING RESOURCES ---
    add_section_header("6. Prescribed Learning Resources")
    
    add_sub_header("6.1 Prescribed Textbooks")
    p_tb = doc.add_paragraph()
    p_tb.add_run("1. Rajaraman, V., & Adabala, N. (2015). Fundamentals of Computers (6th ed.). PHI Learning. [ISBN: 978-8120350670]\n"
                 "2. Norton, P. (2017). Introduction to Computers (7th ed.). McGraw-Hill Education. [ISBN: 978-0070671201]")
    
    add_sub_header("6.2 Recommended Reference Books")
    p_rb = doc.add_paragraph()
    p_rb.add_run("1. Cable, S., Freund, S. M., & Monk, E. (2022). The Shelly Cashman Series Collection: Microsoft 365 & Office 2021 (1st ed.). Cengage Learning. [ISBN: 978-0357677568]\n"
                 "2. Sinha, P. K., & Sinha, P. (2010). Computer Fundamentals (6th ed.). BPB Publications. [ISBN: 978-8176567527]\n"
                 "3. Morley, D., & Parker, C. S. (2017). Understanding Computers: Today and Tomorrow, Comprehensive (16th ed.). Cengage Learning. [ISBN: 978-1305656314]\n"
                 "4. Harvey, G. (2021). Excel 2021 All-in-One For Dummies. John Wiley & Sons. [ISBN: 978-1119830580]\n"
                 "5. International Civil Aviation Organization (ICAO). (2019). Aviation Cybersecurity Strategy (Doc 10118). Montreal: ICAO.")

    add_sub_header("6.3 E-Books, Online Modules & MOOC Resources")
    p_eb = doc.add_paragraph()
    p_eb.add_run("1. OpenStax — Information Systems for Business and Beyond (Free peer-reviewed digital textbook: https://openstax.org/)\n"
                 "2. Microsoft Learn — Interactive Training Modules on Microsoft 365, Word, Excel, PowerPoint, and OneDrive (https://learn.microsoft.com/)\n"
                 "3. Google Digital Garage — Basic Digital Skills & Data Analytics Fundamentals (https://learndigital.withgoogle.com/)\n"
                 "4. NPTEL — Computer Fundamentals & Office Automation (IIT Kharagpur / Swayam Portal)\n"
                 "5. Coursera Credit Course — Introduction to Computers and Office Productivity (University of London)")

    add_sub_header("6.4 Prescribed Case Studies (Curriculum Aligned)")
    p_cs = doc.add_paragraph()
    p_cs.add_run("1. Case Study 1: Typing Tutor Program Development & Human-Computer Interface Usability (Curriculum Mandated).\n"
                 "2. Case Study 2: Community Action Computing — Data-Centric Problem Solving & Spreadsheet Modeling (Curriculum Mandated).\n"
                 "3. Aviation Industry Case 3: British Airways 2017 Global Data Center Power Surge Outage — Impact of Server Hardware and OS Failures on Flight Scheduling.\n"
                 "4. Aviation Industry Case 4: Airline Revenue Optimization using Excel Scenario Modeling — Determining Fleet Fuel Hedging and Break-even Load Factors.")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # --- SECTION 7: CONTENT BEYOND SYLLABUS / ADVANCED LEARNERS ---
    add_section_header("7. Content Beyond Syllabus & Self-Study for Advanced Learners")
    
    tbl_adv = doc.add_table(rows=4, cols=6)
    tbl_adv.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_adv)
    
    adv_headers = ["Sl.", "Advanced Self-Study Topic", "BTL", "Expected Learning Outcome", "CO Mapped", "PO Mapped"]
    for idx, h in enumerate(adv_headers):
        tbl_adv.rows[0].cells[idx].text = h
    make_header_row(tbl_adv.rows[0], bg_color="002060")
    
    col_w_adv = [Inches(0.5), Inches(2.3), Inches(0.8), Inches(2.4), Inches(0.9), Inches(0.9)]
    for row in tbl_adv.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_adv[idx]
            
    adv_data = [
        ("1", "Automating Repetitive Excel Workflows using VBA (Visual Basic for Applications) Macros & Python in Excel", "BTL 4", "Record and execute basic macros to automate automated passenger manifest imports and cleaning.", "CO 3", "PO 3, PO 6"),
        ("2", "Building Interactive Business Intelligence Dashboards in Microsoft Power BI using Airline Operations Datasets", "BTL 6", "Connect Excel datasets to Power BI to produce interactive visuals of route delays and fleet reliability.", "CO 3, CO 4", "PO 4, PO 7"),
        ("3", "Artificial Intelligence & Copilot in Microsoft 365: Automated Report Summarization and Data Modeling", "BTL 4", "Utilize generative AI assistants ethically to draft operational memos and generate complex Excel formulas.", "CO 2, CO 5", "PO 6, PO 10")
    ]
    for idx, r_vals in enumerate(adv_data):
        row = tbl_adv.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[0, 2, 4, 5])

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # --- SECTION 8: GUEST LECTURES & INDUSTRY VISITS ---
    add_section_header("8. Guest Lectures, Webinars & Industry Exposure Planned")
    
    add_sub_header("8.1 Guest Lectures & Expert Webinars")
    tbl_gl = doc.add_table(rows=2, cols=6)
    tbl_gl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_gl)
    for idx, h in enumerate(["Date / Week", "Proposed Topic", "Resource Person / Domain Expert", "Affiliation / Industry", "CO Mapped", "PO Mapped"]):
        tbl_gl.rows[0].cells[idx].text = h
    make_header_row(tbl_gl.rows[0], bg_color="1F4E79")
    for row in tbl_gl.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.0), Inches(2.2), Inches(1.5), Inches(1.5), Inches(0.8), Inches(0.8)][idx]
            
    gl_row = tbl_gl.rows[1]
    gl_row.cells[0].text = "Week 10\n(Oct 2026)"
    gl_row.cells[1].text = "Enterprise Aviation Computing: SITA and Amadeus Global Distribution Systems (GDS)"
    gl_row.cells[2].text = "Mr. Rajesh Nair / Enterprise Solutions Architect"
    gl_row.cells[3].text = "SITA Aero / Aviation Information Technology"
    gl_row.cells[4].text = "CO 1, CO 5"
    gl_row.cells[5].text = "PO 1, PO 7"
    style_data_row(gl_row, is_even=False, align_center_cols=[0, 4, 5])

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

    add_sub_header("8.2 Industry Exposure Visits Planned")
    tbl_iv = doc.add_table(rows=2, cols=6)
    tbl_iv.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_iv)
    for idx, h in enumerate(["Date / Week", "Facility / Organization", "Location", "Observational Learning Focus", "CO Mapped", "PO Mapped"]):
        tbl_iv.rows[0].cells[idx].text = h
    make_header_row(tbl_iv.rows[0], bg_color="1F4E79")
    for row in tbl_iv.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.0), Inches(1.8), Inches(1.6), Inches(2.0), Inches(0.8), Inches(0.8)][idx]
            
    iv_row = tbl_iv.rows[1]
    iv_row.cells[0].text = "Week 12\n(Oct 2026)"
    iv_row.cells[1].text = "BIAL Data Center & Airport Operations Control Centre (AOCC)"
    iv_row.cells[2].text = "Kempegowda International Airport, Bengaluru"
    iv_row.cells[3].text = "Inspect central server racks, flight information display systems (FIDS) architecture, cybersecurity monitoring center, and baggage tracking servers."
    iv_row.cells[4].text = "CO 1, CO 5"
    iv_row.cells[5].text = "PO 2, PO 7"
    style_data_row(iv_row, is_even=False, align_center_cols=[0, 4, 5])

    doc.add_page_break()

    # --- SECTION 9: ASSESSMENT RUBRICS ---
    add_section_header("9. Comprehensive Assessment Rubrics")
    
    p_rub_intro = doc.add_paragraph("Criterion-referenced 5-level scoring rubrics established for standardized evaluation of practical computing and lab deliverables.")
    p_rub_intro.paragraph_format.space_after = Pt(4)
    
    # 9.1 Word Processing Document Rubric
    add_sub_header("9.1 Assessment Rubric: Word Processing Assignment (10 Marks | CO 1, CO 2)")
    tbl_r1 = doc.add_table(rows=5, cols=6)
    tbl_r1.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_r1)
    
    r_headers = ["Evaluation Criteria", "Excellent (5 Marks)", "Very Good (4 Marks)", "Good (3 Marks)", "Average (2 Marks)", "Below Average (1 Mark)"]
    for idx, h in enumerate(r_headers):
        tbl_r1.rows[0].cells[idx].text = h
    make_header_row(tbl_r1.rows[0], bg_color="002060")
    
    col_w_rub = [Inches(1.5)] + [Inches(1.26)] * 5
    for row in tbl_r1.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_rub[idx]
            
    r1_data = [
        ("Document Layout & Geometry Setup", "Flawless margin configuration, custom headers/footers with dynamic page numbering (X of Y), and clean section breaks.", "Well-configured page setup and headers/footers with minor alignment inconsistencies.", "Adequate margins and page numbers, but headers lack dynamic fields or consistency.", "Poor page geometry; margins mismatched; missing headers, footers, or page numbers.", "Default unformatted document; no margins or header/footer implementation."),
        ("Styles & Typography Hierarchy", "Disciplined use of Heading Styles (H1, H2, H3), uniform line spacing, professional font pairings, and zero manual spacing.", "Consistent application of styles with minor paragraph spacing irregularities.", "Styles applied partially; occasional reliance on manual font size changes instead of styles.", "Haphazard font choices, irregular line spacing, and inconsistent heading structure.", "No styles utilized; unreadable formatting with chaotic typography and spacing."),
        ("Table Design & Graphic Integration", "Complex tables with merged header cells, zebra striping, centered alignments, and captioned figures wrapped correctly.", "Well-constructed tables and captioned images with minor visual padding flaws.", "Basic tables and figures inserted, but text wrapping and alignment appear awkward.", "Tables poorly formatted with clipped text, missing borders, or uncaptioned images.", "Distorted tables with broken borders, overlapping graphics, and broken alignments."),
        ("Automation & Advanced Features", "Flawless automated Table of Contents (TOC), functional hyperlinks, cross-references, and Mail Merge execution.", "TOC correctly generated; minor errors in citation fields or Mail Merge data source.", "TOC generated manually or with missing heading levels; basic Mail Merge attempts.", "Non-functional TOC; broken links; unable to execute Mail Merge correctly.", "Absence of automated features; wholly manual, incomplete submission.")
    ]
    for idx, r_vals in enumerate(r1_data):
        row = tbl_r1.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[])

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 9.2 Excel Spreadsheet Modeling Rubric
    add_sub_header("9.2 Assessment Rubric: Excel Data Modeling & Case Study (15 Marks | CO 3, CO 5)")
    tbl_r2 = doc.add_table(rows=5, cols=6)
    tbl_r2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_r2)
    for idx, h in enumerate(r_headers):
        tbl_r2.rows[0].cells[idx].text = h
    make_header_row(tbl_r2.rows[0], bg_color="002060")
    for row in tbl_r2.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_rub[idx]
            
    r2_data = [
        ("Formula Accuracy & Syntax Mastery", "Flawless application of arithmetic, logical (IF/SUMIFS), and lookup (XLOOKUP/INDEX-MATCH) formulas with zero errors.", "Formulas applied accurately across all basic and intermediate functions; minor syntax slip in nested logic.", "Formulas function for basic sums/averages, but struggles with lookup or nested conditional logic.", "Multiple formula errors (#N/A, #REF!, #VALUE!); hardcoded values instead of dynamic formulas.", "Pervasive calculation errors; failure to use formulas; complete lack of spreadsheet syntax."),
        ("Data Referencing & Validation", "Masterful use of absolute ($A$1) and relative cell referencing; robust data validation dropdowns and error alerts.", "Accurate cell referencing; data validation implemented with minor omission in input messages.", "Basic cell referencing correct, but occasional errors when copying formulas; basic validation.", "Frequent errors due to improper absolute referencing; absent data validation controls.", "Incorrect referencing throughout causing formula cascading errors; no data validation."),
        ("Data Visualization & Charts", "Exceptional chart design; appropriate chart types selected (dual-axis, trend lines), labeled axes, clear legends.", "Clean charts with correct axes and titles; effective representation of operational data.", "Standard charts created, but clutter or inappropriate axis scaling diminishes visual clarity.", "Poor chart choice (e.g., pie chart with 20 slices); missing axis titles, legends, or units.", "Misleading, distorted, or unreadable charts; data series incorrectly plotted."),
        ("Pivot Tables & Data Synthesis", "Complex Pivot Table with grouped dates, calculated fields, multi-level hierarchy, slicers, and interactive Pivot Chart.", "Functional Pivot Table summarizing dataset accurately with working slicers.", "Basic Pivot Table created, but lacks calculated fields or date grouping.", "Pivot Table poorly configured; incorrect aggregation field (e.g., count instead of sum).", "Unable to create or interpret a Pivot Table; raw data left unsummarized.")
    ]
    for idx, r_vals in enumerate(r2_data):
        row = tbl_r2.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[])

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 9.3 PowerPoint Presentation Rubric
    add_sub_header("9.3 Assessment Rubric: PowerPoint Presentation & Live Defense (15 Marks | CO 2, CO 4)")
    tbl_r3 = doc.add_table(rows=5, cols=6)
    tbl_r3.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_r3)
    for idx, h in enumerate(r_headers):
        tbl_r3.rows[0].cells[idx].text = h
    make_header_row(tbl_r3.rows[0], bg_color="002060")
    for row in tbl_r3.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_rub[idx]
            
    r3_data = [
        ("Slide Master & Design Principles", "Custom branded slide master, professional 6x6 rule observed, impeccable visual hierarchy and high contrast.", "Clean slide layout with good visual balance; minor deviation from master layout guidelines.", "Slides adhere to basic layout rules, but several slides show text overcrowding.", "Cluttered slides with walls of text, poor color contrast, and inconsistent margins.", "Disorganized, unformatted slides showing zero understanding of visual presentation design."),
        ("Data & Multimedia Integration", "Seamlessly embedded Excel live charts, high-definition aviation diagrams, and functional video/audio elements.", "Charts and graphics embedded neatly with clear resolution and relevant captions.", "Basic charts and images present, but some graphics appear stretched, pixelated, or unlinked.", "Poor quality images, unreadable embedded tables, or non-functional multimedia clips.", "Absence of visual data; plain text slides without diagrams, charts, or multimedia."),
        ("Animations & Interactive Navigation", "Subtle, professional entrance animations; seamless transitions; interactive action buttons and menu navigation.", "Smooth transitions and purposeful animations that enhance information sequencing.", "Animations used adequately, though occasionally distracting or slightly inconsistent.", "Overuse of jarring animations (e.g., bounce/spiral); non-functional hyperlinks.", "Chaotic, disruptive animations or complete lack of transition control."),
        ("Technical Presentation & Defense", "Articulate oral explanation of technical computing architecture; confident, insightful responses during viva defense.", "Confident delivery with sound technical understanding; answers questions accurately.", "Understandable delivery; relies on reading slide text; answers basic technical questions.", "Nervous delivery; unable to explain technical design choices on slides; weak defense.", "Incoherent presentation; cannot explain slide contents; failure in technical viva.")
    ]
    for idx, r_vals in enumerate(r3_data):
        row = tbl_r3.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[])

    doc.add_page_break()

    # --- SECTION 10: CHECKLIST & FORMAL APPROVALS ---
    add_section_header("10. Course Delivery Checklist and Faculty Approvals")
    
    tbl_chk = doc.add_table(rows=8, cols=3)
    tbl_chk.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_chk)
    
    chk_headers = ["#", "Quality Assurance & Compliance Checklist Item", "Verification Status & Date"]
    for idx, h in enumerate(chk_headers):
        tbl_chk.rows[0].cells[idx].text = h
    make_header_row(tbl_chk.rows[0], bg_color="002060")
    
    col_w_chk = [Inches(0.6), Inches(5.4), Inches(1.8)]
    for row in tbl_chk.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_chk[idx]
            
    chk_items = [
        ("1", "Course code (SEC 1), credit structure (0-0-2-0-1), contact hours (30 hrs), and syllabus verified against 2026–2030 Catalogue.", "Verified & Confirmed"),
        ("2", "Program Outcomes (PO 1–12) and Program Specific Outcomes (PSO 1–4) aligned with Department of Aviation Handbook.", "Verified & Confirmed"),
        ("3", "All 30 practical lab session dates mapped chronologically across August–November 2026 excluding gazetted holidays.", "Reconciled with Calendar"),
        ("4", "During Semester Assessment (DSA - 60 Marks) and Semester End Examination (SEE - 40 Marks) weightages calibrated to University norms.", "Calibrated & Confirmed"),
        ("5", "Computer Lab workstations verified for Windows 11 OS, Microsoft 365 (Word, Excel, PowerPoint), and cloud sandbox accounts.", "Lab Infrastructure Ready"),
        ("6", "Practical assessment rubrics established for MS Word Assignment (10M), Excel Modeling (15M), and PowerPoint Deck (15M).", "Integrated in Plan"),
        ("7", "Course repository and weekly digital lab workbook exercise files uploaded to Alliance Learning Management System (LMS).", "Active on LMS")
    ]
    for idx, (num, item, status) in enumerate(chk_items):
        row = tbl_chk.rows[idx + 1]
        row.cells[0].text = num
        row.cells[1].text = item
        row.cells[2].text = status
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[0, 2])

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Formal Sign-off Table
    add_sub_header("Institutional Signatures and Approvals")
    tbl_sign = doc.add_table(rows=3, cols=4)
    tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_sign)
    
    sign_headers = ["Course Instructor", "Course Coordinator", "Head of the Department (HoD)", "Dean / Assistant Dean"]
    for idx, h in enumerate(sign_headers):
        tbl_sign.rows[0].cells[idx].text = h
    make_header_row(tbl_sign.rows[0], bg_color="002060")
    
    col_w_sign = [Inches(1.95)] * 4
    for row in tbl_sign.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = col_w_sign[idx]
            
    row_sign_space = tbl_sign.rows[1]
    for cell in row_sign_space.cells:
        cell.text = "\n\n\n(Signature)"
        set_cell_background(cell, "FFFFFF")
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(8.5)
                r.font.italic = True
                r.font.color.rgb = RGBColor(128, 128, 128)
                
    row_sign_info = tbl_sign.rows[2]
    info_list = [
        "Mr. Sandarsh\nAssistant Professor\nDept. of Aviation Studies\nDate: 28/07/2026",
        "Prof. Aviation Lead\nCourse Coordinator\nAlliance School of Aviation\nDate: 29/07/2026",
        "Dr. Head of Department\nHead of the Department\nDepartment of Aviation Studies\nDate: 30/07/2026",
        "Dr. Dean Aviation\nAssistant Dean / Dean\nAlliance School of Aviation\nDate: 31/07/2026"
    ]
    for idx, text in enumerate(info_list):
        cell = row_sign_info.cells[idx]
        cell.text = text
        set_cell_background(cell, "F4F7FB")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        for p in cell.paragraphs:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(8.5)
                r.font.name = "Calibri"

    # Save to targets
    targets = [
        r"G:\My Drive\Alliance University\Alliance University - Aviation\CDAP_Introduction_to_Computing_Skills_SEC1.docx",
        r"C:\Users\nayan\OneDrive\Desktop\Alliance University - Aviation\CDAP_Introduction_to_Computing_Skills_SEC1.docx",
        r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\d928efdd-1be9-4266-91cd-9e5ed10b9212\CDAP_Introduction_to_Computing_Skills_SEC1.docx"
    ]
    
    saved_paths = []
    for target in targets:
        try:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            doc.save(target)
            saved_paths.append(target)
            print(f"Successfully saved: {target}")
        except Exception as e:
            print(f"Failed to save {target}: {e}")
            
    return saved_paths

if __name__ == "__main__":
    paths = create_computing_cdap()
    print("CDAP Computing Skills Generation Complete!")
