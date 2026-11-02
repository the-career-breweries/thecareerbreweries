import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_english_cdap():
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
        hrun = hp.add_run("Course Delivery and Assessment Plan | Communicative English (ENG 1) | Alliance School of Aviation")
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
        [("Course Code", True), ("ENG 1", False), ("Course Title", True), ("Communicative English", False)],
        [("Credits", True), ("2 Credits", False), ("Course Type", True), ("Ability Enhancement Course (AEC / Core)", False)],
        [("L – T – P – S – C", True), ("2 – 0 – 0 – 0 – 2", False), ("Contact Hours / Week", True), ("2 Hours / Week", False)],
        [("Total Contact Hours", True), ("30 Hours", False), ("Total Sessions", True), ("30 Sessions × 55 Minutes", False)],
        [("Academic Year", True), ("2026–27", False), ("Semester", True), ("First Semester (Sem 1)", False)],
        [("Delivery Window", True), ("03 August 2026 – 13 November 2026", False), ("Course Version", True), ("Version 1.0 (Revised 2026)", False)],
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
        [("Course Instructor", True), ("Mr. Sandarsh\nAssistant Professor / Faculty of Aviation Studies\nAlliance School of Aviation, Central Campus, Alliance University\nEmail: sandarsh@alliance.edu.in | Mobile: +91 98450 00000", False)],
        [("Office Hours", True), ("Monday to Friday: 09:00 AM – 04:30 PM (Prior appointment via email / Alliance LMS)", False)],
        [("Course Description & Rationale", True), ("This course aims to enhance students’ proficiency in English for academic, professional, and aviation-specific communication. It focuses on the core pillars of language acquisition: grammatical precision, functional and aeronautical vocabulary, critical reading comprehension, structured technical writing, and effective listening and speaking. Emphasis is placed on practical usage of English within airline, airport, air traffic services, corporate aviation, and customer-facing service industry environments. Through communicative tasks, situational dialogues, simulation role-plays, and technical document drafting, students develop the fluency, clarity, and confidence required to meet both academic rigor and international aviation communication standards (including ICAO language proficiency expectations).", False)]
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
        "1. To improve grammatical accuracy and structural syntax for professional spoken and written communication.\n"
        "2. To develop expansive general and technical aeronautical vocabulary for aviation-related communication.\n"
        "3. To enhance critical reading, skimming, scanning, and analytical comprehension of aviation manuals, industry reports, and academic texts.\n"
        "4. To develop structured writing competence for formal correspondence, standard operating procedures, flight/incident reports, and professional emails.\n"
        "5. To strengthen auditory comprehension, phonetics, pronunciation, conversational fluency, and role-play capabilities in operational aviation contexts."
    )
    tbl_obj.rows[0].cells[1].paragraphs[0].text = obj_text
    for p in tbl_obj.rows[0].cells[1].paragraphs:
        for r in p.runs:
            r.font.size = Pt(9)

    # PEOs & POs in Table
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

    # Institutional Policies Table
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
        ("Attendance Policy", "Students are required to maintain a minimum of 75% attendance in theory sessions to be eligible to appear for the Semester End Examination (SEE) as mandated by Alliance University academic regulations. Medical leave must be substantiated with official documentation submitted to the Dean's Office within 3 days."),
        ("Plagiarism & Academic Integrity", "All assignments, written reports, and project presentations must reflect original student work. Plagiarism exceeding 10% similarity index (checked via Turnitin/Urkund) will result in immediate rejection, zero marks, and disciplinary referral under University Academic Dishonesty Regulations."),
        ("LMS & Submission Guidelines", "All course materials, reading handouts, assignment briefs, and slide decks are hosted on Alliance Learning Management System (LMS). Submissions after the stipulated deadline will incur a daily penalty of 10% deduction unless granted prior approval.")
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
    
    p_co_intro = doc.add_paragraph("On successful completion of the course Communicative English (ENG 1), students will be able to:")
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
        ("CO 1", "Explain the fundamentals of grammar, including parts of speech, tenses, sentence structure, and voice with technical precision.", "BTL 2 (Understanding)"),
        ("CO 2", "Apply vocabulary development techniques and appropriate technical vocabulary in airline, airport, and aviation operational communication.", "BTL 3 (Applying)"),
        ("CO 3", "Analyze written texts, operational bulletins, and aviation incident case studies using comprehension, skimming, scanning, and analytical interpretation.", "BTL 4 (Analyzing)"),
        ("CO 4", "Produce structured paragraphs, formal letters, operational occurrence reports, and professional emails adhering to aviation industry standards.", "BTL 6 (Creating)"),
        ("CO 5", "Demonstrate effective listening and spoken communication through accurate pronunciation, phonetics, professional dialogues, and aviation simulation role-plays.", "BTL 3 (Applying)")
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
    
    p_ass_intro = doc.add_paragraph("In alignment with Alliance University academic regulations, assessment is categorized into continuous During Semester Assessment (DSA - 60%) and the final Semester End Examination (SEE - 40%). Passing requires a minimum of 50% in DSA and 50% in SEE with a cumulative aggregate of 50%.")
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
        ("1", "Assignment", "Individual written assignment on grammar mechanics, aviation terminology worksheets, and sentence transformations.", "CO 1, CO 4", "Units 1–4", "10 Marks", "Twice (Weeks 4 & 10)"),
        ("2", "Presentation", "Individual / paired oral presentation on an assigned aviation operational topic, assessed on pronunciation, clarity, and vocabulary.", "CO 2, CO 3", "Units 1–3", "15 Marks", "Twice (Weeks 6 & 11)"),
        ("3", "Case Study", "Written case analysis of aviation communication breakdowns (e.g., Tenerife disaster, Avianca 052) and drafting corrective operational memos.", "CO 4, CO 5", "Units 1–5", "15 Marks", "Continuous (Weeks 8 & 13)"),
        ("4", "Mid-Semester Exam", "Centralized written examination assessing grammatical mastery, technical vocabulary, and reading comprehension.", "CO 1, CO 2, CO 3", "Units 1–3", "20 Marks", "Once (Week 8)"),
        ("Total DSA", "During Semester Assessment", "Cumulative Continuous Evaluation across four assessment instruments", "CO 1–5", "Units 1–5", "60 Marks", "Continuous"),
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
    see_row.cells[2].text = "Comprehensive summative examination (2 Hours duration) covering grammar, vocabulary, reading comprehension, and professional technical writing."
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
            
    # Direct catalogue mapping from Page 37 of BSc catalogue
    mapping_data = [
        ["CO 1", "2", "1", "—", "—", "—", "1", "—", "—", "2", "1", "1", "—", "—", "—", "1.4"],
        ["CO 2", "2", "1", "—", "—", "—", "1", "—", "1", "3", "1", "2", "1", "—", "—", "1.7"],
        ["CO 3", "2", "2", "—", "—", "—", "1", "—", "—", "3", "2", "1", "1", "—", "—", "1.8"],
        ["CO 4", "2", "2", "—", "—", "—", "2", "—", "1", "3", "2", "2", "1", "1", "—", "2.0"],
        ["CO 5", "2", "1", "—", "—", "—", "2", "—", "2", "3", "2", "2", "1", "1", "—", "2.0"],
        ["Avg.", "2.0", "1.4", "—", "—", "—", "1.4", "—", "0.8", "2.8", "1.6", "1.6", "0.8", "0.4", "—", "1.8"]
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
    
    p_tdap_intro = doc.add_paragraph("Chronological schedule of micro-level topics delivered across the 15-week instructional semester (03 August 2026 – 13 November 2026). Classes are scheduled twice weekly (Mondays and Wednesdays).")
    p_tdap_intro.paragraph_format.space_after = Pt(4)
    
    tbl_tdap = doc.add_table(rows=31, cols=10)
    tbl_tdap.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tbl_tdap)
    
    tdap_headers = ["Sl.", "Module", "Proposed Date", "Topic & Micro-Level Syllabus Content", "CO / BTL", "Actual Date", "Reference / Advance Reading Material", "Teaching Learning Outcome (TLO)", "Instructional Method", "Assessment Method for TLO"]
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

    # Exactly 30 sessions matching the 5 units of 6 hours each!
    sessions_data = [
        # UNIT 1: Fundamentals of Grammar (6 Hours)
        (1, "Unit 1: Grammar", "03/08/2026", "1.1 Course Orientation & Diagnostic Assessment; English in Aviation; Parts of Speech I: Nouns, Pronouns, and Aviation Terminology Classification", "CO 1\nBTL 2", "", "Murphy, Ch. 69–74;\nRaman & Sharma, Ch. 15", "Identify and correctly classify nouns and pronouns in airline operational contexts.", "Lecture, Diagnostic Grammar Quiz", "In-class Diagnostic Quiz"),
        (2, "Unit 1: Grammar", "05/08/2026", "1.2 Parts of Speech II: Action Verbs, Helping/Auxiliary Verbs, Transitive & Intransitive Verbs in Aviation Operational Commands", "CO 1\nBTL 2", "", "Murphy, Ch. 21–25;\nRizvi, Ch. 12", "Differentiate and employ appropriate verb forms in cockpit-cabin and ground instructions.", "Interactive Lecture, Sentence Drills", "Worksheet Exercise"),
        (3, "Unit 1: Grammar", "10/08/2026", "1.3 Parts of Speech III: Adjectives, Adverbs, Prepositions of Time and Place in Flight Schedules and Ground Movement", "CO 1\nBTL 2", "", "Murphy, Ch. 98–103;\nKumar & Lata, Ch. 8", "Apply prepositions and adverbs accurately to describe aircraft location and schedules.", "Board Work, Pair Exercises", "Formative Worksheet"),
        (4, "Unit 1: Grammar", "12/08/2026", "1.4 Tenses I: Simple Present, Present Continuous, and Present Perfect in Describing Real-Time Airline Operations and Routine Checks", "CO 1\nBTL 2", "", "Murphy, Ch. 1–9;\nRaman & Sharma, Ch. 16", "Construct error-free present tense sentences describing real-time flight operations.", "Flipped Class, Contextual Drills", "Short Writing Prompt"),
        (5, "Unit 1: Grammar", "17/08/2026", "1.5 Tenses II: Past and Future Tenses; Formulating Clear Statements for Flight Logbook Entries and Delay Explanations", "CO 1\nBTL 2", "", "Murphy, Ch. 10–19;\nRizvi, Ch. 13", "Use past and future tenses appropriately to log past occurrences and future dispatches.", "Lecture, Incident Log Analysis", "Logbook Writing Task"),
        (6, "Unit 1: Grammar", "19/08/2026", "1.6 Sentence Structure: Simple, Compound, Complex Sentences; Active vs. Passive Voice in Standard Operating Procedures (SOPs)", "CO 1\nBTL 2", "", "Murphy, Ch. 42–46;\nRaman & Sharma, Ch. 17", "Convert passive SOP statements to active directives and construct cohesive sentences.", "Interactive Workshop, Peer Review", "Assignment 1 (Part A)"),
        
        # UNIT 2: Vocabulary Development (6 Hours)
        (7, "Unit 2: Vocabulary", "24/08/2026", "2.1 Vocabulary Expansion Techniques: Word Formation, Roots, Prefixes, and Suffixes in Aeronautics and Science", "CO 2\nBTL 3", "", "Raman & Sharma, Ch. 18;\nOxford Word Skills", "Deconstruct and form complex aeronautical terms using Greek and Latin root affixes.", "Lecture, Etymology Workshop", "Vocabulary Flashcards"),
        (8, "Unit 2: Vocabulary", "26/08/2026", "2.2 Synonyms and Antonyms in Aviation Communication; Precision vs. Ambiguity; Avoiding Fatal Verbal Misunderstandings", "CO 2\nBTL 3", "", "Kumar & Lata, Ch. 9;\nICAO Doc 9835", "Select unambiguous synonyms to replace vague expressions in operational speech.", "Case Demonstration, Group Drill", "In-class Quiz"),
        (9, "Unit 2: Vocabulary", "31/08/2026", "2.3 Technical Aeronautical Vocabulary I: Aircraft Components, Aerodynamics, Cockpit Instrumentation, Flight Control Surfaces", "CO 2\nBTL 3", "", "Kannan, Ch. 4;\nFAA Pilot Handbook Ch. 3", "Identify and accurately define 30 essential airframe, powerplant, and avionics components.", "Visual Slide Presentation, Labeling", "Terminology Test"),
        (10, "Unit 2: Vocabulary", "02/09/2026", "2.4 Technical Aeronautical Vocabulary II: Airport Airside/Landside Zones, Ramp Handling, Passenger Terminal Operations", "CO 2\nBTL 3", "", "Ashford, Airport Operations Ch. 1–2", "Apply standard terms for apron parking, pushback, marshalling, baggage, and check-in.", "Interactive Walkthrough, Video Clip", "Assignment 1 (Part B)"),
        (11, "Unit 2: Vocabulary", "07/09/2026", "2.5 Aviation Acronyms, Abbreviations & Regulatory Bodies: ICAO, IATA, DGCA, FAA, AAI, NOTAM, METAR, TAF, ATC", "CO 2\nBTL 3", "", "DGCA CAR Section 3;\nIATA Handbook", "Decode and expand standard aeronautical acronyms and weather bulletin abbreviations.", "Lecture, Decryption Exercises", "Acronym Decryption Drill"),
        (12, "Unit 2: Vocabulary", "09/09/2026", "2.6 Collocations and Idiomatic Expressions in Corporate Aviation; Standard Aviation Phraseology vs. Plain English Usage", "CO 2\nBTL 3", "", "Murphy, Ch. 115–120;\nICAO Annex 10", "Differentiate when to apply standard phraseology versus clear plain conversational English.", "Comparative Analysis, Dialogue Drill", "Presentation 1 (Oral)"),
        
        # UNIT 3: Reading Skills (6 Hours)
        (13, "Unit 3: Reading", "14/09/2026", "3.1 Mechanics of Reading: Overcoming Sub-vocalization, Enhancing Eye Span, Adjusting Speed for Technical Reading", "CO 3\nBTL 4", "", "Rizvi, Ch. 7;\nBritish Council Reading", "Demonstrate improved reading rate while retaining 80%+ comprehension of technical passages.", "Reading Lab Drills, Pacing Exercise", "Speed Reading Test"),
        (14, "Unit 3: Reading", "16/09/2026", "3.2 Reading Strategies I: Skimming Flight Schedules, NOTAMs, Weather Advisories, and Management Briefs for Core Gist", "CO 3\nBTL 4", "", "Raman & Sharma, Ch. 7;\nNOTAM Samples", "Skim authentic NOTAMs and meteorological advisories within 60 seconds to identify crucial data.", "Timed Reading Activity, Q&A", "Skimming Worksheet"),
        (15, "Unit 3: Reading", "21/09/2026", "3.3 Reading Strategies II: Scanning Flight Operations Manuals (FOM), Aircraft Operating Handbooks, and Safety Circulars", "CO 3\nBTL 4", "", "FAA Airplane Flying Handbook;\nDGCA Circulars", "Scan dense operational manuals rapidly to locate specific emergency memory items and limits.", "Information Retrieval Challenge", "Scanning Speed Task"),
        (16, "Unit 3: Reading", "23/09/2026", "3.4 Intensive Reading & Critical Comprehension: Analysis of Aviation Safety Incident Investigation Reports", "CO 3\nBTL 4", "", "AAIB / NTSB Incident Briefs;\nRizvi, Ch. 8", "Analyze root causes, factual findings, and contributing human factors from accident briefs.", "Group Case Study, Dissection", "Incident Analysis Report"),
        (17, "Unit 3: Reading", "28/09/2026", "3.5 Critical Reading & Fact vs. Opinion: Interpreting Airline Commercial Strategy Reports and Aviation Policy Whitepapers", "CO 3\nBTL 4", "", "CAPA Aviation Market Reports;\nKumar & Lata, Ch. 6", "Distinguish factual operational data from marketing projections in airline trade articles.", "Critical Seminar, Debate", "Critical Reading Summary"),
        (18, "Unit 3: Reading", "30/09/2026", "3.6 Interpreting Graphic Information: Aeronautical Charts, Passenger Manifests, On-Time Performance (OTP) Bar Charts", "CO 3\nBTL 4", "", "Raman & Sharma, Ch. 12;\nAirlines Financial Reports", "Convert graphical data (OTP charts, load factors) into coherent written analytical commentary.", "Data Analysis Workshop", "Data Interpretation Task\n(Mid-Sem Prep)"),
        
        # MID-SEMESTER EXAMINATION WINDOW (Conducted between Sessions 18 and 19)
        
        # UNIT 4: Writing Skills (6 Hours)
        (19, "Unit 4: Writing", "05/10/2026", "4.1 Paragraph Architecture: Topic Sentence, Supporting Coherence, Transitional Connectors in Aviation Management Writing", "CO 4\nBTL 6", "", "Raman & Sharma, Ch. 8;\nMurphy, Appendix 7", "Compose logically structured, unified paragraphs on aviation topics using transitional signposts.", "Writing Workshop, Peer Feedback", "Paragraph Drafting Task"),
        (20, "Unit 4: Writing", "07/10/2026", "4.2 Professional Letter Writing: Formal Business Letters, Customer Grievance Replies, Airline Compensation Inquiries", "CO 4\nBTL 6", "", "Rizvi, Ch. 16;\nKumar & Lata, Ch. 14", "Draft formal business correspondence addressing passenger lost baggage and delayed flight claims.", "Model Analysis, Draft & Edit", "Letter Writing Exercise"),
        (21, "Unit 4: Writing", "12/10/2026", "4.3 Professional Email Writing: Email Etiquette, Subject Lines, Concise Drafting of Shift Handover Memos & Urgent Advisories", "CO 4\nBTL 6", "", "Raman & Sharma, Ch. 11;\nCorporate Comm Handouts", "Produce concise, unambiguous work emails adhering to high-stakes aviation email protocols.", "Interactive Email Simulator", "Assignment 2 (Email Task)"),
        (22, "Unit 4: Writing", "14/10/2026", "4.4 Technical Report Writing I: Format, Purpose, Structural Anatomy of Flight Disruption & Turnaround Delay Reports", "CO 4\nBTL 6", "", "Rizvi, Ch. 18–19;\nAirline Ground Manual", "Structure a formal Delay & Disruption Report detailing aircraft turnaround bottlenecks.", "Structural Layout Drills", "Report Skeleton Draft"),
        (23, "Unit 4: Writing", "19/10/2026", "4.5 Technical Report Writing II: Drafting an Aviation Safety Incident & Mandatory Occurrence Report (MOR)", "CO 4\nBTL 6", "", "DGCA CAR Section 5;\nICAO Annex 13", "Write a complete Mandatory Occurrence Report documenting bird strike / runway incursion scenario.", "Collaborative Writing Studio", "Incident Report Submission\n(Case Study Mark)"),
        (24, "Unit 4: Writing", "21/10/2026", "4.6 Standard Operating Procedure (SOP) Drafting: Writing Clear, Imperative, Step-by-Step Directives for Ramp Safety", "CO 4\nBTL 6", "", "Airport Safety Manual;\nKumar & Lata, Ch. 16", "Formulate clear, sequenced SOP checklist instructions for apron marshalling and FOD inspection.", "SOP Blueprinting Activity", "SOP Document Rubric"),
        
        # UNIT 5: Listening & Speaking Skills (6 Hours)
        (25, "Unit 5: Spoken Comm", "26/10/2026", "5.1 Active Listening Mechanics: Listening for Specific Details, Note-taking from Air Traffic Audio Feeds, Minimizing Distractions", "CO 5\nBTL 3", "", "Rizvi, Ch. 3–4;\nLiveATC.net Audio Samples", "Accurately transcribe and extract key flight levels, headings, and clearances from ATC audio.", "Audio Listening Lab, Transcription", "Listening Transcription Test"),
        (26, "Unit 5: Spoken Comm", "28/10/2026", "5.2 Phonetics & Pronunciation: English Vowels, Consonants, Word Stress, Sentence Intonation, Neutralizing Mother Tongue Influence", "CO 5\nBTL 3", "", "Cambridge English Pronunciation;\nSwan, Phonetics Guide", "Pronounce problematic English phonemes correctly and apply appropriate sentence rhythm.", "Acoustic Drill, Minimal Pairs", "Pronunciation Voice Clip"),
        (27, "Unit 5: Spoken Comm", "02/11/2026", "5.3 ICAO Phonetic Alphabet, Numerical Transmissions, and Standard Aviation Pronunciation Drills (Alfa to Zulu)", "CO 5\nBTL 3", "", "ICAO Annex 10, Vol. II;\nDGCA Radiotelephony Manual", "Recite and decode tail numbers, squawk codes, waypoint designations with 100% phonetic accuracy.", "Call-and-Response Drills", "Oral Phonetic Quiz"),
        (28, "Unit 5: Spoken Comm", "04/11/2026", "5.4 Professional Conversation Practice: Customer Service Dialogues, Boarding Gate Announcements, Handling Distressed Flyers", "CO 5\nBTL 3", "", "Kannan, Ch. 9;\nAirline PA Scripts", "Deliver calm, polite, and authoritative public address (PA) announcements during weather delays.", "Simulation Role-Play, Mic Practice", "Announcement Audio Task"),
        (29, "Unit 5: Spoken Comm", "09/11/2026", "5.5 High-Stakes Aviation Simulation: Pilot–Controller Readback/Hearback, Ramp Controller–Tug Driver Coordination", "CO 5\nBTL 3", "", "FAA Pilot/Controller Glossary;\nICAO Doc 9432", "Execute standardized readback/hearback protocols avoiding callsign confusion and readback errors.", "Paired Simulation Workshop", "Presentation 2 (Role-Play)"),
        (30, "Unit 5: Spoken Comm", "11/11/2026", "5.6 Group Discussion & Capstone Spoken Evaluation: Course Synthesis, Feedback, Remedial Guidance, and Viva Voce", "CO 5\nBTL 3", "", "Course Synthesis Dossier;\nRaman & Sharma, Ch. 6", "Articulate sound operational viewpoints in a professional group discussion on aviation safety culture.", "Moderated Group Discussion", "Capstone Viva Voce &\nCourse Outcome Attainment")
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
    p_tb.add_run("1. Murphy, R. (2019). Essential English Grammar with Answers (4th ed.). Cambridge University Press. [ISBN: 978-1108586627]\n"
                 "2. Raman, M., & Sharma, S. (2020). Technical Communication: Principles and Practice (3rd ed.). Oxford University Press. [ISBN: 978-0199457496]")
    
    add_sub_header("6.2 Recommended Reference Books")
    p_rb = doc.add_paragraph()
    p_rb.add_run("1. Rizvi, M. A. (2018). Effective Technical Communication (2nd ed.). McGraw-Hill Education. [ISBN: 978-9352605736]\n"
                 "2. Kumar, S., & Lata, P. (2020). Communication Skills (2nd ed.). Oxford University Press. [ISBN: 978-0190122119]\n"
                 "3. Kannan, S. P. (2019). Communicative English for Professionals. MJP Publishers. [ISBN: 978-8180943484]\n"
                 "4. Swan, M. (2016). Practical English Usage (4th ed.). Oxford University Press. [ISBN: 978-0194202466]\n"
                 "5. International Civil Aviation Organization (ICAO). (2010). Manual on the Implementation of ICAO Language Proficiency Requirements (Doc 9835, 2nd ed.). Montreal: ICAO.")

    add_sub_header("6.3 E-Books, Online Modules & MOOC Resources")
    p_eb = doc.add_paragraph()
    p_eb.add_run("1. Cambridge English Online — Grammar, Vocabulary, and Communication Interactive Labs (https://www.cambridgeenglish.org/learning-english/)\n"
                 "2. British Council — LearnEnglish Professional and Business Communication Pods (https://learnenglish.britishcouncil.org/)\n"
                 "3. NPTEL — English Language for Competitive Exams & Technical Communication (IIT Madras / Swayam Platform)\n"
                 "4. Coursera Credit Course — Conversational English Skills & Communication in the 21st Century Workplace (University of California, Irvine)")

    add_sub_header("6.4 Prescribed Case Studies (Curriculum Aligned)")
    p_cs = doc.add_paragraph()
    p_cs.add_run("1. Case Study 1: Exploring the Principled Communicative Approach in Action: A Secondary School ESL & Professional Training Case Study (Curriculum Mandated).\n"
                 "2. Case Study 2: Enhancing English Language Communicative Skills Instruction using the Integrated Approach in Aviation Operations (Curriculum Mandated).\n"
                 "3. Aviation Industry Case 3: The Tenerife Airport Disaster (1977) — Critical Analysis of Radio Communication Ambiguity ('At takeoff') and Non-Standard Phraseology.\n"
                 "4. Aviation Industry Case 4: Avianca Flight 052 Fuel Exhaustion Incident — Misinterpretation of 'Priority' vs. 'Emergency' in ATC Communications.")

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
        ("1", "ICAO Language Proficiency Requirements (LPRs) Level 4–6 Rating Scales: Pronunciation, Structure, Vocabulary, Fluency, Comprehension, Interactions", "BTL 4", "Analyze international aviation benchmark scales and benchmark self-competency for commercial pilot / ATC eligibility.", "CO 2, CO 5", "PO 8, PO 9"),
        ("2", "Aviation Crisis Communication & Press Briefing Management during Aircraft Incidents / Emergency Operations", "BTL 6", "Formulate press statements and internal executive briefs during simulated operational emergencies avoiding liability traps.", "CO 4", "PO 4, PO 9"),
        ("3", "Cross-Cultural Communication & Diversity Dynamics in International Cabin and Flight Operations", "BTL 3", "Identify intercultural communication barriers and adapt speech patterns in multinational cabin crew and passenger environments.", "CO 2, CO 5", "PO 9, PO 11")
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
    gl_row.cells[0].text = "Week 11\n(Oct 2026)"
    gl_row.cells[1].text = "Standard Operating Phraseology & Aeronautical English in Commercial Airline Operations"
    gl_row.cells[2].text = "Capt. Arvind Sharma / Senior Line Training Captain"
    gl_row.cells[3].text = "Air India / Commercial Airline Operations"
    gl_row.cells[4].text = "CO 2, CO 5"
    gl_row.cells[5].text = "PO 2, PO 9"
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
    iv_row.cells[0].text = "Week 13\n(Nov 2026)"
    iv_row.cells[1].text = "Kempegowda International Airport (BLR) / Air Traffic Control Tower & Airline OCC"
    iv_row.cells[2].text = "Bangalore International Airport Ltd (BIAL), Devanahalli, Bengaluru"
    iv_row.cells[3].text = "Observe live radio communications between ATC, ground apron control, and aircraft dispatches; inspect flight clearance coordination."
    iv_row.cells[4].text = "CO 3, CO 5"
    iv_row.cells[5].text = "PO 1, PO 9"
    style_data_row(iv_row, is_even=False, align_center_cols=[0, 4, 5])

    doc.add_page_break()

    # --- SECTION 9: ASSESSMENT RUBRICS ---
    add_section_header("9. Comprehensive Assessment Rubrics")
    
    p_rub_intro = doc.add_paragraph("Criterion-referenced 5-level scoring rubrics established for standardized evaluation of DSA components.")
    p_rub_intro.paragraph_format.space_after = Pt(4)
    
    # 9.1 Assignment Rubric
    add_sub_header("9.1 Assessment Rubric: Written Assignment (10 Marks | CO 1, CO 4)")
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
        ("Grammatical Accuracy & Syntax", "Flawless sentence structure; zero errors in tenses, subject-verb agreement, and voice; highly sophisticated syntax.", "Occasional minor grammatical slips that do not impede clarity; solid sentence variety.", "Noticeable grammatical errors in complex sentences, but basic sentence structures are sound.", "Frequent errors in tenses, prepositions, or sentence fragments that hinder smooth reading.", "Pervasive grammatical inaccuracies, fragmented sentences, and faulty syntax throughout."),
        ("Aviation Vocabulary & Precision", "Extensive and highly accurate use of technical aeronautical terms and operational collocations without ambiguity.", "Good use of aviation terminology; minor instances of imprecise phrasing.", "Adequate vocabulary; relies somewhat on generic words rather than precise aviation terminology.", "Limited aviation vocabulary; frequent misuse of basic industry terminology.", "Extremely impoverished vocabulary; inappropriate or wholly inaccurate word choices."),
        ("Content Organization & Cohesion", "Exceptional paragraph unity; seamless logical progression with effective transitional phrases; clear topic sentences.", "Well-structured paragraphs with clear transitions and logical flow.", "Recognizable structure with topic sentences, but transitions between ideas are occasionally abrupt.", "Loose organization; paragraphs lack focus, unity, or supporting development.", "Disorganized, fragmented ideas lacking coherent paragraphing or logical flow."),
        ("Mechanics, Formatting & Originality", "Flawless mechanics (spelling, punctuation, capitalization); professional formatting; zero plagiarism (<5%).", "Clean presentation; minor punctuation slips; fully original work (<10% similarity).", "Acceptable formatting; multiple spelling/punctuation errors; original effort.", "Messy presentation; poor adherence to formatting guidelines; marginal original thought.", "Careless formatting; gross mechanical errors; high similarity index requiring rework.")
    ]
    for idx, r_vals in enumerate(r1_data):
        row = tbl_r1.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[])

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 9.2 Presentation Rubric
    add_sub_header("9.2 Assessment Rubric: Oral Presentation & Viva (15 Marks | CO 2, CO 3, CO 5)")
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
        ("Phonetics, Pronunciation & Fluency", "Impeccable pronunciation; clear articulation; native-like stress/intonation; zero mother-tongue interference (MTI).", "Clear articulation with minimal MTI; smooth delivery with natural conversational pacing.", "Understandable pronunciation; moderate MTI; occasional hesitant pauses or pacing irregularities.", "Heavy MTI; frequent mispronunciations of key technical terms that create listener strain.", "Inaudible, heavily distorted pronunciation; severe hesitation and disjointed delivery."),
        ("Content Depth & Aviation Domain Mastery", "Masterful, in-depth explanation of aviation topic; highly factual, updated, and analytically rigorous.", "Comprehensive coverage of topic; sound understanding of operational concepts.", "Covers basic facts accurately but lacks depth, critical insight, or operational application.", "Superficial presentation with notable gaps in factual understanding of aviation topic.", "Inaccurate, incomplete, or irrelevant content demonstrating no research."),
        ("Visual Aids & Slide Design", "Professional visual deck; clean typography, high-res aviation schematics, concise bullet points, no text-overload.", "Well-designed slides with clear visual structure and relevant supporting charts/images.", "Acceptable slides, though somewhat crowded with text; basic visual layout.", "Cluttered slides with walls of text, poor contrast, or distracting formatting.", "Unformatted, unreadable slides or absence of visual aids."),
        ("Poise, Body Language & Q&A Response", "Commanding presence; excellent eye contact; poised posture; authoritative and articulate responses to questions.", "Confident demeanor; good eye contact; addresses audience questions accurately.", "Moderate confidence; occasionally reads from notes; adequately answers simple questions.", "Noticeable nervousness; relies heavily on reading slides; struggles with audience questions.", "Severe anxiety; avoids eye contact; unable to address basic questions regarding the topic.")
    ]
    for idx, r_vals in enumerate(r2_data):
        row = tbl_r2.rows[idx + 1]
        for c_idx, val in enumerate(r_vals):
            row.cells[c_idx].text = val
        style_data_row(row, is_even=(idx % 2 == 1), align_center_cols=[])

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # 9.3 Case Study Rubric
    add_sub_header("9.3 Assessment Rubric: Aviation Communication Incident Case Study (15 Marks | CO 4, CO 5)")
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
        ("Problem Identification & Incident Timeline", "Precisely identifies root communication failures, distinguishing language barriers from technical issues; accurate timeline.", "Accurately identifies principal communication issues and reconstructs incident sequence.", "Identifies main communication breakdown but conflates presenting symptoms with root causes.", "Vague identification of operational problem; significant facts in incident timeline omitted.", "Misunderstands the case; wholly misidentifies why the communication breakdown occurred."),
        ("Application of Human Factors & ICAO Standards", "Rigorous application of CRM (Crew Resource Management), ICAO language standards, and readback-hearback rules.", "Sound application of CRM and standard operational communication frameworks.", "Basic mention of aviation communication rules with limited depth of application to the case.", "Superficial or incorrect references to aviation regulations and operational protocols.", "Zero application of aviation safety frameworks or communication regulations."),
        ("Corrective Operational Action Plan", "Proposes innovative, practical, and highly compliant SOP revisions, training drills, or phraseology protocols.", "Offers workable, realistic recommendations to prevent communication recurrence.", "Proposes generic solutions lacking specific procedural detail or aviation operational context.", "Impractical, vague, or operationally unfeasible suggestions.", "Fails to provide actionable recommendations or remedial measures."),
        ("Written Presentation & Technical Structure", "Exemplary professional case memo format; crisp executive summary; structured headings; flawless technical syntax.", "Well-structured report with clear headings and professional technical tone.", "Adequately formatted with minor structural inconsistencies or informal expressions.", "Poorly structured report; colloquial phrasing; difficult to follow operational logic.", "Disorganized, incomplete submission failing to meet formal report requirements.")
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
        ("1", "Course code (ENG 1), credit structure (2-0-0-0-2), contact hours (30 hrs), and syllabus verified against 2026–2030 Catalogue.", "Verified & Confirmed"),
        ("2", "Program Outcomes (PO 1–12) and Program Specific Outcomes (PSO 1–4) aligned with Department of Aviation Handbook.", "Verified & Confirmed"),
        ("3", "All 30 session dates mapped chronologically across August–November 2026 excluding university gazetted holidays.", "Reconciled with Calendar"),
        ("4", "During Semester Assessment (DSA - 60 Marks) and Semester End Examination (SEE - 40 Marks) weightages calibrated to University norms.", "Calibrated & Confirmed"),
        ("5", "Prescribed textbooks (Murphy 4th Ed., Raman & Sharma 3rd Ed.) and reference resources cross-checked for library and digital availability.", "Available in AU Library"),
        ("6", "Assessment rubrics established for Assignment (10M), Presentation (15M), and Case Study (15M) components.", "Integrated in Plan"),
        ("7", "Course shell created on Alliance Learning Management System (LMS) with digital reading handouts and assignment submission links.", "Active on LMS")
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
        r"G:\My Drive\Alliance University\Alliance University - Aviation\CDAP_Communicative_English_ENG1.docx",
        r"C:\Users\nayan\OneDrive\Desktop\Alliance University - Aviation\CDAP_Communicative_English_ENG1.docx",
        r"C:\Users\S D SANDARSH\.gemini\antigravity\brain\d928efdd-1be9-4266-91cd-9e5ed10b9212\CDAP_Communicative_English_ENG1.docx"
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
    paths = create_english_cdap()
    print("CDAP English Generation Complete!")
