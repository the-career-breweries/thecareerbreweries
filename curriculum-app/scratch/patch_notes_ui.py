import re

# 1. Rename "Generate Notes" to "Notes" in page.tsx files
page_files = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\communicative-english\page.tsx',
    r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\computing-skills\page.tsx'
]

for filepath in page_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change "Generate Notes" to "Notes"
    content = content.replace('<span>Generate Notes</span>', '<span>Notes</span>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update NotesTemplate.tsx
notes_template_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\components\NotesTemplate.tsx'
with open(notes_template_path, 'r', encoding='utf-8') as f:
    notes_content = f.read()

# Update the handlePrint function to change document.title temporarily
old_handle_print = r"const handlePrint = \(\) => \{\s*window\.print\(\);\s*\};"
new_handle_print = """const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${courseName}_${sessionName}_NotesbySD`.replace(/[^a-zA-Z0-9_]/g, '_');
    window.print();
    document.title = originalTitle;
  };"""
notes_content = re.sub(old_handle_print, new_handle_print, notes_content)

# Add custom print CSS for page breaks and margins
old_css = r"@media print \{\s*body \* \{ visibility: hidden; \}\s*\.printable-notes-container, \.printable-notes-container \* \{ visibility: visible; \}\s*\.printable-notes-container \{ position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; padding: 0 !important; \}\s*\.no-print \{ display: none !important; \}\s*\}"
new_css = """@media print {
          @page { margin: 15mm; }
          body * { visibility: hidden; }
          .printable-notes-container, .printable-notes-container * { visibility: visible; }
          .printable-notes-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          section { page-break-inside: avoid; margin-bottom: 2rem; }
          h1, h2, h3 { page-break-after: avoid; }
          .definition-box { page-break-inside: avoid; }
        }"""
notes_content = re.sub(old_css, new_css, notes_content)

# Update definition mapping to add 'definition-box' class
notes_content = notes_content.replace(
    """<div key={i} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}>""",
    """<div key={i} className="definition-box" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #94a3b8' }}>"""
)

# Replace "Generate Notes: " header in UI to just "Notes: " (optional but matches request spirit)
notes_content = notes_content.replace('>Generate Notes:', '>Notes:')

# Add Author details block just before Feedback section
author_block = """{/* Author Signature */}
          <section className="no-break" style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderLeft: '4px solid #4f46e5', borderRadius: '0 8px 8px 0', pageBreakInside: 'avoid' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b' }}>S D Sandarsh</p>
            <p style={{ margin: '0.25rem 0', color: '#475569', fontSize: '0.95rem' }}>Communicative English, Soft Skills & Employability Trainer</p>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem' }}>+91 97437 11584</p>
          </section>

          {/* 6. Feedback QR Code */}"""
notes_content = notes_content.replace('{/* 6. Feedback QR Code */}', author_block)

with open(notes_template_path, 'w', encoding='utf-8') as f:
    f.write(notes_content)
