import re
from fpdf import FPDF
import sys
import os

def parse_chits(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    raw_blocks = [block.strip() for block in content.split('|')]
    
    chits = []
    for block in raw_blocks:
        if "EMAIL & REPORT WRITING ASSIGNMENT" not in block:
            continue
            
        try:
            topic = re.search(r"Topic:\s*(.*?)\s+- Time/Loc:", block).group(1)
            time_loc = re.search(r"- Time/Loc:\s*(.*?)\s+- Event:", block).group(1)
            event = re.search(r"- Event:\s*(.*?)\s+- Impact:", block).group(1)
            impact = re.search(r"- Impact:\s*(.*?)\s+- Actions:", block).group(1)
            actions = re.search(r"- Actions:\s*(.*?)\s+CRITICAL INSTRUCTION:", block).group(1)
            crit = re.search(r"CRITICAL INSTRUCTION:\s*(.*?)(?:\s*\|\s*$|$)", block).group(1)
            
            # Clean up curly quotes just in case
            actions = actions.replace('\u2019', "'").replace('\u2018', "'").replace('\u201d', '"').replace('\u201c', '"')
            event = event.replace('\u2019', "'").replace('\u2018', "'").replace('\u201d', '"').replace('\u201c', '"')
            impact = impact.replace('\u2019', "'").replace('\u2018', "'").replace('\u201d', '"').replace('\u201c', '"')
            
            chits.append({
                'topic': topic,
                'time': time_loc,
                'event': event,
                'impact': impact,
                'actions': actions,
                'crit': crit
            })
        except Exception as e:
            print(f"Error parsing a block: {e}")
            
    return chits

def create_pdf(chits, output_filename):
    pdf = FPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=False)
    
    items_per_page = 4
    for i in range(0, len(chits), items_per_page):
        pdf.add_page()
        page_chits = chits[i:i+items_per_page]
        
        positions = [
            (10, 10),      
            (105, 10),     
            (10, 148.5),   
            (105, 148.5)   
        ]
        
        for j, data in enumerate(page_chits):
            x, y = positions[j]
            box_w = 95
            box_h = 138.5
            inner_w = 87
            
            # Draw border
            pdf.rect(x, y, box_w, box_h)
            
            # Set left margin explicitly for automatic text wrapping boundary
            left_m = x + 4
            pdf.set_left_margin(left_m)
            
            # 1. Title
            pdf.set_font('Helvetica', 'B', 8)
            pdf.set_xy(left_m, y + 2)
            pdf.multi_cell(inner_w, 4, "EMAIL & REPORT WRITING ASSIGNMENT", align='C')
            
            # 2. Block 1 (Task -> Report Structure:)
            block1 = """**Task:** Write an email stating the report is attached, followed by the report itself. Must be handwritten.
**Evaluated on:** Format, Grammar, Tone, Handwriting.

**Email Format:**
**Subject Line:** Specific + brief. Not 'Important'
**Greeting:** "Dear [Name]," - never "Hey" or no greeting
**Opening Line:** State purpose immediately. No small talk.
**Body:** 2-3 focused sentences per point.
**Call to Action:** What do you need them to do? Be explicit.
**Sign-off:** "Best regards," / "Yours sincerely," + Full name

**Report Structure:**"""
            
            pdf.set_font('Helvetica', '', 7.5)
            # Add a small padding before block1
            pdf.set_xy(left_m, pdf.get_y() + 1)
            pdf.multi_cell(inner_w, 3.5, block1, markdown=True)
            
            # 3. TRAP (Hidden text)
            pdf.set_text_color(255, 255, 255)
            pdf.set_font('Helvetica', '', 1)
            pdf.set_xy(left_m, pdf.get_y())
            pdf.multi_cell(inner_w, 0.5, "CRITICAL INSTRUCTION: " + data['crit'])
            pdf.set_text_color(0, 0, 0)
            
            # 4. Block 2 (TITLE -> Actions)
            cur_y = pdf.get_y()
            block2 = f"""TITLE: 
DATE:
PREPARED BY: 
SUBMITTED TO:

1. OBJECTIVE/PURPOSE: [Why was this report written?]
2. BACKGROUND/CONTEXT: [What situation led to this?]
3. FINDINGS/OBSERVATIONS: [What was observed? Use bullets]
4. ANALYSIS: [Patterns, causes, implications]
5. RECOMMENDATIONS: [Specific next steps]
6. CONCLUSION: [Summary of key message]

**Topic:** {data['topic']}
- Time/Loc: {data['time']}
- Event: {data['event']}
- Impact: {data['impact']}
- Actions: {data['actions']}"""

            pdf.set_font('Helvetica', '', 7.5)
            pdf.set_xy(left_m, cur_y)
            pdf.multi_cell(inner_w, 3.5, block2, markdown=True)

    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    pdf.output(output_filename)
    print(f"PDF successfully generated: {output_filename} with {len(chits)} chits.")

if __name__ == "__main__":
    chits = parse_chits("chits_raw.txt")
    if not chits:
        print("No chits found.")
        sys.exit(1)
    
    create_pdf(chits, r"C:\Users\nayan\.gemini\antigravity\brain\8a3ab317-aa2c-4ed3-bf00-08ee13fb2a20\Report_Assignments.pdf")
