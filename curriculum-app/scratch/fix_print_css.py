import re

notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# 1. Update the CSS block
old_css_start = notes_content.find('<style dangerouslySetInnerHTML={{__html: `')
old_css_end = notes_content.find('`}} />', old_css_start) + len('`}} />')

new_css = """<style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 15mm; }
          
          /* Force all containers to expand fully and remove scrollbars/clipping */
          html, body, main, div {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            position: static !important;
          }
          
          body * { visibility: hidden; }
          
          .notes-modal-overlay,
          .notes-modal-overlay *,
          .printable-notes-container, 
          .printable-notes-container * { 
            visibility: visible; 
          }
          
          .notes-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            width: 100% !important;
          }
          
          .printable-notes-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }

          .no-print, .no-print * { display: none !important; }
          
          section { page-break-inside: avoid; margin-bottom: 2rem; }
          h1, h2, h3 { page-break-after: avoid; }
          .definition-box { page-break-inside: avoid; }
          
          .print-watermark {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: fixed !important;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            color: rgba(15, 23, 42, 0.08) !important;
            z-index: -1;
            pointer-events: none;
            text-align: center;
            width: 100%;
            visibility: visible !important;
          }
          
          .print-watermark * {
            visibility: visible !important;
          }
        }
        
        @media screen {
          .print-watermark { display: none; }
        }
      `}} />"""

notes_content = notes_content[:old_css_start] + new_css + notes_content[old_css_end:]

# 2. Add the watermark div inside printable-notes-container
watermark_html = """
          {/* Watermark for Print */}
          <div className="print-watermark">
            <p style={{ fontWeight: 'bold', fontSize: '48px', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>S D Sandarsh</p>
            <p style={{ fontSize: '24px', margin: '15px 0', fontWeight: '500' }}>Communicative English, Soft Skills & Employability Trainer</p>
            <p style={{ fontSize: '24px', margin: 0, fontWeight: '500' }}>+91 97437 11584</p>
          </div>
"""

# Find where to insert watermark (just after <div className="printable-notes-container" ... >)
container_start = notes_content.find('<div className="printable-notes-container"')
container_end = notes_content.find('>', container_start) + 1

notes_content = notes_content[:container_end] + watermark_html + notes_content[container_end:]

# 3. Remove the old Author Signature block
old_author_block_start = notes_content.find('{/* Author Signature */}')
if old_author_block_start != -1:
    old_author_block_end = notes_content.find('{/* 6. Feedback QR Code */}', old_author_block_start)
    if old_author_block_end != -1:
        notes_content = notes_content[:old_author_block_start] + notes_content[old_author_block_end:]


with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
