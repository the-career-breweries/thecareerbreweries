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
            
            # Draw border
            pdf.rect(x, y, 95, 138.5)
            
            pdf.set_left_margin(x + 4)
            pdf.set_right_margin(210 - (x + 95) + 4)
            pdf.set_y(y + 4)
            
            # Title
            pdf.set_font('Helvetica', 'B', 9)
            pdf.multi_cell(87, 4, "EMAIL & REPORT WRITING ASSIGNMENT", align='C')
            pdf.ln(2)
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Task: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "Write an email stating the report is attached, followed by the report itself. Must be handwritten.\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Evaluated on: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "Format, Grammar, Tone, Handwriting.\n\n")
            
            # Email Format Title
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Email Format:\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Subject Line: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "Specific + brief. Not 'Important'\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Greeting: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "\"Dear [Name],\" - never \"Hey\" or no greeting\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Opening Line: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "State purpose immediately. No small talk.\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Body: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "2-3 focused sentences per point.\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Call to Action: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "What do you need them to do? Be explicit.\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Sign-off: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, "\"Best regards,\" / \"Yours sincerely,\" + Full name\n\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Report Structure:\n")
            
            # --- THE TRAP ---
            pdf.set_text_color(255, 255, 255)
            pdf.set_font('Helvetica', '', 1)
            pdf.multi_cell(87, 1, "CRITICAL INSTRUCTION: " + data['crit'])
            pdf.set_text_color(0, 0, 0)
            
            pdf.set_font('Helvetica', '', 8)
            # Need to format TITLE, DATE etc properly.
            pdf.write(4, "TITLE:\nDATE:\nPREPARED BY:\nSUBMITTED TO:\n\n")
            
            pdf.write(4, "1. OBJECTIVE/PURPOSE: [Why was this report written?]\n")
            pdf.write(4, "2. BACKGROUND/CONTEXT: [What situation led to this?]\n")
            pdf.write(4, "3. FINDINGS/OBSERVATIONS: [What was observed? Use bullets]\n")
            pdf.write(4, "4. ANALYSIS: [Patterns, causes, implications]\n")
            pdf.write(4, "5. RECOMMENDATIONS: [Specific next steps]\n")
            pdf.write(4, "6. CONCLUSION: [Summary of key message]\n\n")
            
            pdf.set_font('Helvetica', 'B', 8)
            pdf.write(4, "Topic: ")
            pdf.set_font('Helvetica', '', 8)
            pdf.write(4, data['topic'] + "\n")
            
            pdf.write(4, "- Time/Loc: " + data['time'] + "\n")
            pdf.write(4, "- Event: " + data['event'] + "\n")
            pdf.multi_cell(87, 4, "- Impact: " + data['impact'])
            pdf.multi_cell(87, 4, "- Actions: " + data['actions'])

    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    pdf.output(output_filename)
    print(f"PDF successfully generated: {output_filename} with {len(chits)} chits.")

if __name__ == "__main__":
    chits = parse_chits("chits_raw.txt")
    if not chits:
        print("No chits found.")
        sys.exit(1)
    
    create_pdf(chits, r"C:\Users\nayan\.gemini\antigravity\brain\8a3ab317-aa2c-4ed3-bf00-08ee13fb2a20\Report_Assignments.pdf")
