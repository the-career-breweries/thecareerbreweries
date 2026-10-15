# -*- coding: utf-8 -*-
"""
generate_see_booster_docs.py
Generates both publication-grade PDF and DOCX documents for the
SEE High-Yield Supplementary Notes & Exam Booster Module
(Communicative English - Course Code: Z7AVA 26203 / Z7AVB 26203).
"""

import json
import os
import re
import subprocess
import shutil
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

NOTES_JSON_PATH = os.path.join(os.path.dirname(__file__), "curriculum-app", "src", "data", "notes-content.json")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
DESKTOP_DIR = r"C:\Users\S D SANDARSH\Desktop\Sem End Exam"
APP_PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "curriculum-app", "public")
PROJECT_ROOT = os.path.dirname(__file__)

def format_markdown_html(text):
    if not text:
        return ""
    # Bold
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    # Newlines
    text = text.replace("\n", "<br/>")
    return text

def build_html_document(data):
    html_lines = []
    html_lines.append("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SEE High-Yield Supplementary Notes - Communicative English</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 14mm 16mm 14mm;
    @bottom-right {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 8pt;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #64748b;
    }
    @bottom-left {
      content: "Alliance School of Aviation Studies · Communicative English (Z7AVA 26203 / Z7AVB 26203)";
      font-size: 8pt;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #64748b;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 9pt;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .cover-header {
    border-bottom: 2px solid #0f2942;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .institution-badge {
    color: #0284c7;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 4px;
  }

  h1.doc-title {
    color: #0f2942;
    font-size: 18pt;
    font-weight: 900;
    margin: 0 0 4px 0;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  h2.doc-subtitle {
    color: #0284c7;
    font-size: 11pt;
    font-weight: 700;
    margin: 0 0 6px 0;
  }

  .meta-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 8pt;
    color: #475569;
    background: #f1f5f9;
    padding: 6px 12px;
    border-radius: 4px;
    border-left: 3px solid #0f2942;
  }

  .meta-item strong {
    color: #0f2942;
  }

  .callout-box {
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #2563eb;
    padding: 10px 14px;
    border-radius: 4px;
    margin: 14px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .callout-title {
    color: #1e3a8a;
    font-size: 8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 0 0 4px 0;
  }

  .callout-box ul {
    margin: 0;
    padding-left: 18px;
    color: #1e3a8b;
    font-size: 8.5pt;
    line-height: 1.5;
  }

  .toc-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 14px 0 20px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .toc-card {
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    overflow: hidden;
  }

  .toc-card-header {
    background: #0f2942;
    color: #ffffff;
    padding: 6px 10px;
    font-size: 7.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .toc-card-body {
    padding: 8px 10px;
    background: #ffffff;
    font-size: 8pt;
    color: #334155;
    line-height: 1.45;
  }

  .part-banner {
    background: #0f2942;
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 3px;
    font-weight: 800;
    font-size: 8.5pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 22px 0 10px 0;
    page-break-after: avoid;
    break-after: avoid;
  }

  h3.topic-title {
    color: #0f2942;
    font-size: 11.5pt;
    font-weight: 800;
    margin: 12px 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #e2e8f0;
    page-break-after: avoid;
    break-after: avoid;
  }

  .premise-text {
    font-size: 8.8pt;
    color: #334155;
    line-height: 1.55;
    margin: 0 0 12px 0;
  }

  table.notes-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.2pt;
    page-break-inside: auto;
    break-inside: auto;
  }

  table.notes-table th {
    background-color: #0f2942 !important;
    color: #ffffff !important;
    font-weight: 700;
    padding: 7px 10px;
    text-align: left;
    border: 1px solid #0f2942;
    letter-spacing: 0.02em;
    font-size: 8pt;
  }

  table.notes-table td {
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    line-height: 1.45;
    vertical-align: top;
  }

  table.notes-table tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .rule-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 4px solid #16a34a;
    padding: 9px 12px;
    border-radius: 4px;
    margin: 12px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .rule-title {
    color: #15803d;
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 4px 0;
  }

  .rule-body {
    color: #166534;
    font-size: 8.5pt;
    line-height: 1.5;
    margin: 0;
  }

  .worked-example-box {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-left: 4px solid #0284c7;
    padding: 11px 14px;
    border-radius: 4px;
    margin: 12px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .worked-title {
    color: #0369a1;
    font-size: 8.2pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 6px 0;
  }

  .worked-body {
    color: #0c4a6e;
    font-size: 8.4pt;
    line-height: 1.5;
  }

  .dual-context-pill {
    background: #ffffff;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid #e0f2fe;
    margin-bottom: 6px;
    font-size: 8.2pt;
  }

  .steps-container {
    background: #ffffff;
    padding: 9px 12px;
    border-radius: 4px;
    border: 1px solid #e0f2fe;
    margin: 8px 0;
    font-size: 8.2pt;
  }

  .step-line {
    margin-bottom: 3px;
    line-height: 1.45;
  }

  .step-header {
    margin-top: 8px;
    margin-bottom: 4px;
    font-weight: 800;
    color: #0369a1;
    font-size: 8.2pt;
  }

  .worked-verdict {
    margin-top: 6px;
    font-weight: 700;
    color: #0369a1;
    font-size: 8.4pt;
  }

  .memory-box {
    background: #faf5ff;
    border: 1px solid #e9d5ff;
    border-left: 4px solid #9333ea;
    padding: 9px 12px;
    border-radius: 4px;
    margin: 10px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .memory-title {
    color: #7e22ce;
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 4px 0;
  }

  .memory-body {
    color: #581c87;
    font-size: 8.4pt;
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
  }

  .exam-tip-box {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-left: 4px solid #f59e0b;
    padding: 9px 12px;
    border-radius: 4px;
    margin: 10px 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .exam-tip-title {
    color: #b45309;
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 4px 0;
  }

  .exam-tip-body {
    color: #78350f;
    font-size: 8.4pt;
    line-height: 1.5;
    margin: 0;
  }

  .footer-ref {
    margin-top: 24px;
    padding: 10px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 8pt;
    color: #475569;
    page-break-inside: avoid;
    break-inside: avoid;
  }
</style>
</head>
<body>
""")

    # Cover Header
    html_lines.append(f"""
<div class="cover-header">
  <div class="institution-badge">Alliance School of Aviation Studies · Alliance University · Semester I</div>
  <h1 class="doc-title">SEE High-Yield Supplementary Notes &amp; Exam Booster</h1>
  <h2 class="doc-subtitle">{data.get('subtitle', '')}</h2>
  <div class="meta-bar">
    <div class="meta-item"><strong>Course Code:</strong> {data.get('courseCode', 'Z7AVA 26203 / Z7AVB 26203')}</div>
    <div class="meta-item">|</div>
    <div class="meta-item"><strong>Instructor / Trainer:</strong> {data.get('author', 'S D Sandarsh (+91 97437 11584)')}</div>
    <div class="meta-item">|</div>
    <div class="meta-item"><strong>Audited Against:</strong> Official SEE Papers (Set 1, Set 2 &amp; 5 Model Question Papers)</div>
    <div class="meta-item">|</div>
    <div class="meta-item"><strong>Target:</strong> 6 Missing Core Topics (5 to 10 Marks Each)</div>
  </div>
</div>
""")

    # How to use callout
    if "howToUse" in data:
        html_lines.append("""
<div class="callout-box">
  <div class="callout-title">How to Use This Exam Booster Module</div>
  <ul>
""")
        for pt in data["howToUse"]:
            html_lines.append(f"    <li>{format_markdown_html(pt)}</li>")
        html_lines.append("""  </ul>
</div>
""")

    # Table of Contents Grid
    if "parts" in data:
        html_lines.append('<div class="toc-grid">')
        for part in data["parts"]:
            html_lines.append(f"""
  <div class="toc-card">
    <div class="toc-card-header">{part.get('title', '')}</div>
    <div class="toc-card-body">
""")
            for item in part.get("items", []):
                html_lines.append(f"      <div>• {item}</div>")
            html_lines.append("""    </div>
  </div>""")
        html_lines.append('</div>')

    # Topics 1 to 6
    for topic in data.get("topics", []):
        html_lines.append(f"""
<div class="topic-container">
  <div class="part-banner">{topic.get('partBanner', '')}</div>
  <h3 class="topic-title">{topic.get('title', '')}</h3>
  <div class="premise-text">{format_markdown_html(topic.get('premise', ''))}</div>
""")

        # Table
        if "table" in topic:
            table = topic["table"]
            html_lines.append('<table class="notes-table"><thead><tr>')
            for h in table.get("headers", []):
                html_lines.append(f"  <th>{format_markdown_html(h)}</th>")
            html_lines.append('</tr></thead><tbody>')
            for row in table.get("rows", []):
                html_lines.append('<tr>')
                for cell in row:
                    html_lines.append(f"  <td>{format_markdown_html(str(cell))}</td>")
                html_lines.append('</tr>')
            html_lines.append('</tbody></table>')

        # Rule Box
        if "rule" in topic:
            rule = topic["rule"]
            html_lines.append(f"""
  <div class="rule-box">
    <div class="rule-title">{rule.get('title', 'Rule')}</div>
    <div class="rule-body">{format_markdown_html(rule.get('text', ''))}</div>
  </div>
""")

        # Worked Example Box
        if "workedExample" in topic:
            we = topic["workedExample"]
            html_lines.append(f"""
  <div class="worked-example-box">
    <div class="worked-title">{we.get('title', 'Worked Example')}</div>
    <div class="worked-body">
""")
            if we.get("text"):
                html_lines.append(f"      <div style='margin-bottom: 6px;'>{format_markdown_html(we['text'])}</div>")
            if we.get("everydayContext"):
                html_lines.append(f"      <div class='dual-context-pill'><strong style='color:#0369a1;'>Everyday Example:</strong> {format_markdown_html(we['everydayContext'])}</div>")
            if we.get("aviationContext"):
                html_lines.append(f"      <div class='dual-context-pill'><strong style='color:#0369a1;'>Aviation Application:</strong> {format_markdown_html(we['aviationContext'])}</div>")
            if we.get("steps"):
                html_lines.append("      <div class='steps-container'>")
                for step in we["steps"]:
                    is_h = step.startswith("[") and step.endswith("]:") or step.startswith("###") or step.startswith("---")
                    css_class = "step-header" if is_h else "step-line"
                    html_lines.append(f"        <div class='{css_class}'>{format_markdown_html(step)}</div>")
                html_lines.append("      </div>")
            if we.get("verdict"):
                html_lines.append(f"      <div class='worked-verdict'>Key Takeaway: {format_markdown_html(we['verdict'])}</div>")
            html_lines.append("    </div>\n  </div>")

        # Memory Trick Box
        if "memoryTrick" in topic:
            html_lines.append(f"""
  <div class="memory-box">
    <div class="memory-title">Memory Trick / Mnemonic</div>
    <div class="memory-body">{format_markdown_html(topic['memoryTrick'])}</div>
  </div>
""")

        # Exam Tip Box
        if "examTip" in topic:
            tip_title = "Common Exam Trap" if topic.get("isTrap") else "High-Yield Exam Tip"
            html_lines.append(f"""
  <div class="exam-tip-box">
    <div class="exam-tip-title">{tip_title}</div>
    <div class="exam-tip-body">{format_markdown_html(topic['examTip'])}</div>
  </div>
""")
        html_lines.append("</div>")

    # Master Quick Revision Table
    if "quickRevision" in data:
        html_lines.append("""
<div style="page-break-before: always;">
  <div class="part-banner">Quick Revision · Everything on One Page</div>
  <table class="notes-table">
    <thead>
      <tr>
        <th style="width: 28%;">Topic / Rule</th>
        <th>Essential Exam Principle to Remember</th>
      </tr>
    </thead>
    <tbody>
""")
        for item in data["quickRevision"]:
            html_lines.append(f"""
      <tr>
        <td><strong>{format_markdown_html(item.get('topic', ''))}</strong></td>
        <td>{format_markdown_html(item.get('rememberThis', ''))}</td>
      </tr>
""")
        html_lines.append("""
    </tbody>
  </table>
</div>
""")

    # Bloom's Taxonomy Question Bank
    if "btlQuestions" in data:
        html_lines.append("""
<div style="margin-top: 18px;">
  <div class="part-banner">Bloom's Taxonomy (BTL 1 to 6) Question Bank</div>
  <table class="notes-table">
    <thead>
      <tr>
        <th style="width: 25%;">Bloom's Taxonomy Level</th>
        <th>Sample Question &amp; Expected Student Output</th>
      </tr>
    </thead>
    <tbody>
""")
        for lvl, q in data["btlQuestions"].items():
            html_lines.append(f"""
      <tr>
        <td><strong>{format_markdown_html(lvl)}</strong></td>
        <td>{format_markdown_html(q)}</td>
      </tr>
""")
        html_lines.append("""
    </tbody>
  </table>
</div>
""")

    # Prescribed Reference Material
    if "referenceMaterial" in data:
        ref = data["referenceMaterial"]
        html_lines.append(f"""
<div class="footer-ref">
  <div style="font-weight: 800; color: #0f2942; margin-bottom: 4px; text-transform: uppercase; font-size: 8pt;">Prescribed Reference Material &amp; Regulatory Sources:</div>
  <div><strong>Primary:</strong> {ref.get('primary', '')}</div>
  <div style="margin-top: 2px;"><strong>Further Reading:</strong> {ref.get('further', '')}</div>
  <div style="margin-top: 6px; font-weight: 600; color: #0284c7;">Author: S D Sandarsh | Communicative English, Soft Skills &amp; Employability Trainer (+91 97437 11584)</div>
</div>
""")

    html_lines.append("</body></html>")
    return "\n".join(html_lines)


def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_borders(cell, top="CCCCCC", bottom="CCCCCC", left="CCCCCC", right="CCCCCC", sz="4"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{top}"/>'
        f'  <w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{left}"/>'
        f'  <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{bottom}"/>'
        f'  <w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{right}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'  <w:top w:w="{top}" w:type="dxa"/>'
        f'  <w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'  <w:left w:w="{left}" w:type="dxa"/>'
        f'  <w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_markdown_paragraph(doc, text, style='Normal', space_after=Pt(6)):
    p = doc.add_paragraph(style=style)
    p.paragraph_format.space_after = space_after
    p.paragraph_format.line_spacing = 1.15
    
    # Simple markdown parser for bold
    parts = re.split(r"(\*\*[^*]+\*\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            run = p.add_run(part[2:-2])
            run.bold = True
        else:
            p.add_run(part)
    return p

def build_docx_document(data, output_docx_path):
    doc = Document()
    
    # Configure A4 Margins (0.65 in ~ 16.5 mm)
    for sec in doc.sections:
        sec.top_margin = Inches(0.65)
        sec.bottom_margin = Inches(0.65)
        sec.left_margin = Inches(0.65)
        sec.right_margin = Inches(0.65)
        sec.page_width = Inches(8.27)
        sec.page_height = Inches(11.69)
        
        # Add Header & Footer
        header = sec.header
        hp = header.paragraphs[0]
        hp.text = "Alliance School of Aviation Studies · Communicative English (Z7AVA 26203 / Z7AVB 26203)"
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hp.runs[0].font.size = Pt(8)
        hp.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    # Document Header
    p_inst = doc.add_paragraph()
    r_inst = p_inst.add_run("ALLIANCE SCHOOL OF AVIATION STUDIES · ALLIANCE UNIVERSITY")
    r_inst.bold = True
    r_inst.font.size = Pt(9)
    r_inst.font.color.rgb = RGBColor(2, 132, 199)
    p_inst.paragraph_format.space_after = Pt(2)

    p_title = doc.add_paragraph()
    r_title = p_title.add_run("SEE High-Yield Supplementary Notes & Exam Booster")
    r_title.bold = True
    r_title.font.size = Pt(20)
    r_title.font.color.rgb = RGBColor(15, 41, 66)
    p_title.paragraph_format.space_after = Pt(2)

    p_sub = doc.add_paragraph()
    r_sub = p_sub.add_run(data.get("subtitle", "B.Sc. Aviation & BBA Aviation Management (Batch 2026)"))
    r_sub.font.size = Pt(11)
    r_sub.bold = True
    r_sub.font.color.rgb = RGBColor(2, 132, 199)
    p_sub.paragraph_format.space_after = Pt(8)

    # Metadata Box Table
    meta_table = doc.add_table(rows=1, cols=1)
    meta_cell = meta_table.cell(0, 0)
    set_cell_background(meta_cell, "F1F5F9")
    set_cell_borders(meta_cell, top="0F2942", bottom="0F2942", left="0F2942", right="0F2942", sz="18")
    set_cell_margins(meta_cell, top=120, bottom=120, left=180, right=180)
    mp = meta_cell.paragraphs[0]
    mp.paragraph_format.space_after = Pt(0)
    mp.paragraph_format.line_spacing = 1.2
    
    r1 = mp.add_run("Course Code: ")
    r1.bold = True
    mp.add_run(f"{data.get('courseCode', 'Z7AVA 26203 / Z7AVB 26203')}  |  ")
    r2 = mp.add_run("Instructor / Trainer: ")
    r2.bold = True
    mp.add_run(f"{data.get('author', 'S D Sandarsh (+91 97437 11584)')}\n")
    r3 = mp.add_run("Audited Against: ")
    r3.bold = True
    mp.add_run("Official SEE Question Papers (Set 1, Set 2 & 5 Model Question Papers)  |  ")
    r4 = mp.add_run("Target: ")
    r4.bold = True
    mp.add_run("6 Missing Core Exam Topics (5–10 Marks Each)")
    for run in mp.runs:
        run.font.size = Pt(8.5)
        run.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # How to Use Callout Box
    if "howToUse" in data:
        hu_table = doc.add_table(rows=1, cols=1)
        hu_cell = hu_table.cell(0, 0)
        set_cell_background(hu_cell, "F0F7FF")
        set_cell_borders(hu_cell, top="BFDBFE", bottom="BFDBFE", left="2563EB", right="BFDBFE", sz="24")
        set_cell_margins(hu_cell, top=140, bottom=140, left=180, right=180)
        hup = hu_cell.paragraphs[0]
        r_hu_title = hup.add_run("HOW TO USE THIS EXAM BOOSTER MODULE")
        r_hu_title.bold = True
        r_hu_title.font.size = Pt(9)
        r_hu_title.font.color.rgb = RGBColor(30, 58, 138)
        hup.paragraph_format.space_after = Pt(4)
        
        for pt in data["howToUse"]:
            bp = hu_cell.add_paragraph(style='List Bullet')
            bp.paragraph_format.space_after = Pt(3)
            bp.paragraph_format.line_spacing = 1.15
            # Parse bold
            for part in re.split(r"(\*\*[^*]+\*\*)", pt):
                if part.startswith("**") and part.endswith("**"):
                    r = bp.add_run(part[2:-2])
                    r.bold = True
                else:
                    r = bp.add_run(part)
                r.font.size = Pt(8.5)
                r.font.color.rgb = RGBColor(30, 58, 138)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Topics 1 to 6
    for t_idx, topic in enumerate(data.get("topics", [])):
        # Part Banner
        pb = doc.add_paragraph()
        pb.paragraph_format.space_before = Pt(14)
        pb.paragraph_format.space_after = Pt(2)
        r_pb = pb.add_run(topic.get("partBanner", ""))
        r_pb.bold = True
        r_pb.font.size = Pt(8.5)
        r_pb.font.color.rgb = RGBColor(2, 132, 199)

        # Title
        p_t = doc.add_paragraph()
        r_t = p_t.add_run(topic.get("title", ""))
        r_t.bold = True
        r_t.font.size = Pt(13)
        r_t.font.color.rgb = RGBColor(15, 41, 66)
        p_t.paragraph_format.space_after = Pt(6)

        # Premise
        premise_text = topic.get("premise", "")
        for para in premise_text.split("\n\n"):
            para = para.strip()
            if para:
                add_markdown_paragraph(doc, para, space_after=Pt(6))

        # Table
        if "table" in topic:
            table_data = topic["table"]
            headers = table_data.get("headers", [])
            rows = table_data.get("rows", [])
            
            t = doc.add_table(rows=len(rows) + 1, cols=len(headers))
            t.alignment = WD_TABLE_ALIGNMENT.CENTER
            
            # Header Row
            hdr_cells = t.rows[0].cells
            for c_idx, h_text in enumerate(headers):
                hdr_cells[c_idx].text = h_text.replace("**", "")
                set_cell_background(hdr_cells[c_idx], "0F2942")
                set_cell_margins(hdr_cells[c_idx], top=100, bottom=100, left=120, right=120)
                set_cell_borders(hdr_cells[c_idx], top="0F2942", bottom="0F2942", left="0F2942", right="0F2942", sz="4")
                p = hdr_cells[c_idx].paragraphs[0]
                p.runs[0].font.bold = True
                p.runs[0].font.size = Pt(8)
                p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
            
            # Data Rows
            for r_idx, row in enumerate(rows):
                row_cells = t.rows[r_idx + 1].cells
                bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
                for c_idx, cell_value in enumerate(row):
                    set_cell_background(row_cells[c_idx], bg_color)
                    set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=120, right=120)
                    set_cell_borders(row_cells[c_idx], top="CBD5E1", bottom="CBD5E1", left="CBD5E1", right="CBD5E1", sz="4")
                    p = row_cells[c_idx].paragraphs[0]
                    p.paragraph_format.line_spacing = 1.15
                    p.paragraph_format.space_after = Pt(0)
                    # parse bold
                    for part in re.split(r"(\*\*[^*]+\*\*)", str(cell_value)):
                        if part.startswith("**") and part.endswith("**"):
                            r = p.add_run(part[2:-2])
                            r.bold = True
                        else:
                            r = p.add_run(part)
                        r.font.size = Pt(8)
                        r.font.color.rgb = RGBColor(30, 41, 59)

            doc.add_paragraph().paragraph_format.space_after = Pt(8)

        # Rule Box
        if "rule" in topic:
            rule = topic["rule"]
            r_table = doc.add_table(rows=1, cols=1)
            r_cell = r_table.cell(0, 0)
            set_cell_background(r_cell, "F0FDF4")
            set_cell_borders(r_cell, top="BBF7D0", bottom="BBF7D0", left="16A34A", right="BBF7D0", sz="24")
            set_cell_margins(r_cell, top=120, bottom=120, left=160, right=160)
            rp = r_cell.paragraphs[0]
            r_head = rp.add_run(rule.get("title", "RULE"))
            r_head.bold = True
            r_head.font.size = Pt(8.5)
            r_head.font.color.rgb = RGBColor(21, 128, 61)
            rp.paragraph_format.space_after = Pt(4)
            
            for line in rule.get("text", "").split("\n"):
                if line.strip():
                    lp = r_cell.add_paragraph()
                    lp.paragraph_format.space_after = Pt(2)
                    lp.paragraph_format.line_spacing = 1.15
                    for part in re.split(r"(\*\*[^*]+\*\*)", line):
                        if part.startswith("**") and part.endswith("**"):
                            r = lp.add_run(part[2:-2])
                            r.bold = True
                        else:
                            r = lp.add_run(part)
                        r.font.size = Pt(8.2)
                        r.font.color.rgb = RGBColor(22, 101, 52)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # Worked Example Box
        if "workedExample" in topic:
            we = topic["workedExample"]
            w_table = doc.add_table(rows=1, cols=1)
            w_cell = w_table.cell(0, 0)
            set_cell_background(w_cell, "F0F9FF")
            set_cell_borders(w_cell, top="BAE6FD", bottom="BAE6FD", left="0284C7", right="BAE6FD", sz="24")
            set_cell_margins(w_cell, top=140, bottom=140, left=160, right=160)
            
            wp = w_cell.paragraphs[0]
            w_head = wp.add_run(we.get("title", "WORKED EXAMPLE"))
            w_head.bold = True
            w_head.font.size = Pt(9)
            w_head.font.color.rgb = RGBColor(3, 105, 161)
            wp.paragraph_format.space_after = Pt(4)

            if we.get("everydayContext"):
                ep = w_cell.add_paragraph()
                ep.paragraph_format.space_after = Pt(3)
                r_elbl = ep.add_run("Everyday Example: ")
                r_elbl.bold = True
                r_elbl.font.color.rgb = RGBColor(3, 105, 161)
                r_etxt = ep.add_run(we["everydayContext"])
                r_elbl.font.size = Pt(8.2)
                r_etxt.font.size = Pt(8.2)

            if we.get("aviationContext"):
                ap = w_cell.add_paragraph()
                ap.paragraph_format.space_after = Pt(4)
                r_albl = ap.add_run("Aviation Application: ")
                r_albl.bold = True
                r_albl.font.color.rgb = RGBColor(3, 105, 161)
                r_atxt = ap.add_run(we["aviationContext"])
                r_albl.font.size = Pt(8.2)
                r_atxt.font.size = Pt(8.2)

            if we.get("steps"):
                for step in we["steps"]:
                    sp = w_cell.add_paragraph()
                    sp.paragraph_format.space_after = Pt(2)
                    sp.paragraph_format.line_spacing = 1.15
                    is_h = step.startswith("[") and step.endswith("]:") or step.startswith("###") or step.startswith("---")
                    for part in re.split(r"(\*\*[^*]+\*\*)", step):
                        if part.startswith("**") and part.endswith("**"):
                            r = sp.add_run(part[2:-2])
                            r.bold = True
                        else:
                            r = sp.add_run(part)
                        r.font.size = Pt(8.2)
                        if is_h:
                            r.bold = True
                            r.font.color.rgb = RGBColor(3, 105, 161)
                        else:
                            r.font.color.rgb = RGBColor(12, 74, 110)

            if we.get("verdict"):
                vp = w_cell.add_paragraph()
                vp.paragraph_format.space_before = Pt(4)
                vp.paragraph_format.space_after = Pt(2)
                r_vlbl = vp.add_run("Key Takeaway: ")
                r_vlbl.bold = True
                r_vlbl.font.color.rgb = RGBColor(3, 105, 161)
                r_vtxt = vp.add_run(we["verdict"])
                r_vlbl.font.size = Pt(8.4)
                r_vtxt.font.size = Pt(8.4)

            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # Memory Trick Box
        if "memoryTrick" in topic:
            m_table = doc.add_table(rows=1, cols=1)
            m_cell = m_table.cell(0, 0)
            set_cell_background(m_cell, "FAF5FF")
            set_cell_borders(m_cell, top="E9D5FF", bottom="E9D5FF", left="9333EA", right="E9D5FF", sz="24")
            set_cell_margins(m_cell, top=100, bottom=100, left=160, right=160)
            mp = m_cell.paragraphs[0]
            r_mhead = mp.add_run("MEMORY TRICK / MNEMONIC")
            r_mhead.bold = True
            r_mhead.font.size = Pt(8.2)
            r_mhead.font.color.rgb = RGBColor(126, 34, 206)
            mp.paragraph_format.space_after = Pt(3)

            for line in topic["memoryTrick"].split("\n"):
                if line.strip():
                    mlp = m_cell.add_paragraph()
                    mlp.paragraph_format.space_after = Pt(2)
                    for part in re.split(r"(\*\*[^*]+\*\*)", line):
                        if part.startswith("**") and part.endswith("**"):
                            r = mlp.add_run(part[2:-2])
                            r.bold = True
                        else:
                            r = mlp.add_run(part)
                        r.font.size = Pt(8.2)
                        r.font.color.rgb = RGBColor(88, 28, 135)
            doc.add_paragraph().paragraph_format.space_after = Pt(6)

        # Exam Tip Box
        if "examTip" in topic:
            et_table = doc.add_table(rows=1, cols=1)
            et_cell = et_table.cell(0, 0)
            set_cell_background(et_cell, "FFFBEB")
            set_cell_borders(et_cell, top="FDE68A", bottom="FDE68A", left="F59E0B", right="FDE68A", sz="24")
            set_cell_margins(et_cell, top=100, bottom=100, left=160, right=160)
            etp = et_cell.paragraphs[0]
            tip_head = "COMMON EXAM TRAP" if topic.get("isTrap") else "HIGH-YIELD EXAM TIP"
            r_ethead = etp.add_run(tip_head)
            r_ethead.bold = True
            r_ethead.font.size = Pt(8.2)
            r_ethead.font.color.rgb = RGBColor(180, 83, 9)
            etp.paragraph_format.space_after = Pt(3)

            for line in topic["examTip"].split("\n"):
                if line.strip():
                    etlp = et_cell.add_paragraph()
                    etlp.paragraph_format.space_after = Pt(2)
                    for part in re.split(r"(\*\*[^*]+\*\*)", line):
                        if part.startswith("**") and part.endswith("**"):
                            r = etlp.add_run(part[2:-2])
                            r.bold = True
                        else:
                            r = etlp.add_run(part)
                        r.font.size = Pt(8.2)
                        r.font.color.rgb = RGBColor(120, 53, 15)
            doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Master Quick Revision Table
    if "quickRevision" in data:
        doc.add_page_break()
        p_qr_head = doc.add_paragraph()
        r_qrh = p_qr_head.add_run("Quick Revision · Everything on One Page")
        r_qrh.bold = True
        r_qrh.font.size = Pt(14)
        r_qrh.font.color.rgb = RGBColor(15, 41, 66)
        p_qr_head.paragraph_format.space_after = Pt(8)

        qr_rows = data["quickRevision"]
        qrt = doc.add_table(rows=len(qr_rows) + 1, cols=2)
        qrt.alignment = WD_TABLE_ALIGNMENT.CENTER
        qrt.rows[0].cells[0].text = "Topic / Rule"
        qrt.rows[0].cells[1].text = "Essential Exam Principle to Remember"
        for c in qrt.rows[0].cells:
            set_cell_background(c, "0F2942")
            set_cell_margins(c, top=100, bottom=100, left=120, right=120)
            set_cell_borders(c, top="0F2942", bottom="0F2942", left="0F2942", right="0F2942", sz="4")
            p = c.paragraphs[0]
            p.runs[0].font.bold = True
            p.runs[0].font.size = Pt(8.5)
            p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

        for i, item in enumerate(qr_rows):
            rc = qrt.rows[i + 1].cells
            bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
            for cell, text in zip(rc, [item.get("topic", ""), item.get("rememberThis", "")]):
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
                set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left="CBD5E1", right="CBD5E1", sz="4")
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15
                for part in re.split(r"(\*\*[^*]+\*\*)", text):
                    if part.startswith("**") and part.endswith("**"):
                        r = p.add_run(part[2:-2])
                        r.bold = True
                    else:
                        r = p.add_run(part)
                    r.font.size = Pt(8.2)
                    r.font.color.rgb = RGBColor(30, 41, 59)

        doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Bloom's Taxonomy Question Bank
    if "btlQuestions" in data:
        p_btl_head = doc.add_paragraph()
        r_btlh = p_btl_head.add_run("Bloom's Taxonomy (BTL 1 to 6) Question Bank")
        r_btlh.bold = True
        r_btlh.font.size = Pt(14)
        r_btlh.font.color.rgb = RGBColor(15, 41, 66)
        p_btl_head.paragraph_format.space_after = Pt(8)

        btl_items = list(data["btlQuestions"].items())
        btlt = doc.add_table(rows=len(btl_items) + 1, cols=2)
        btlt.alignment = WD_TABLE_ALIGNMENT.CENTER
        btlt.rows[0].cells[0].text = "Bloom's Taxonomy Level"
        btlt.rows[0].cells[1].text = "Sample Exam Question Format"
        for c in btlt.rows[0].cells:
            set_cell_background(c, "0F2942")
            set_cell_margins(c, top=100, bottom=100, left=120, right=120)
            set_cell_borders(c, top="0F2942", bottom="0F2942", left="0F2942", right="0F2942", sz="4")
            p = c.paragraphs[0]
            p.runs[0].font.bold = True
            p.runs[0].font.size = Pt(8.5)
            p.runs[0].font.color.rgb = RGBColor(255, 255, 255)

        for i, (lvl, q) in enumerate(btl_items):
            rc = btlt.rows[i + 1].cells
            bg = "F8FAFC" if i % 2 == 1 else "FFFFFF"
            for cell, text in zip(rc, [lvl, q]):
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
                set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left="CBD5E1", right="CBD5E1", sz="4")
                p = cell.paragraphs[0]
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.15
                for part in re.split(r"(\*\*[^*]+\*\*)", text):
                    if part.startswith("**") and part.endswith("**"):
                        r = p.add_run(part[2:-2])
                        r.bold = True
                    else:
                        r = p.add_run(part)
                    r.font.size = Pt(8.2)
                    r.font.color.rgb = RGBColor(30, 41, 59)

        doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Reference Box
    if "referenceMaterial" in data:
        ref = data["referenceMaterial"]
        r_table = doc.add_table(rows=1, cols=1)
        rcell = r_table.cell(0, 0)
        set_cell_background(rcell, "F8FAFC")
        set_cell_borders(rcell, top="CBD5E1", bottom="CBD5E1", left="0F2942", right="CBD5E1", sz="18")
        set_cell_margins(rcell, top=120, bottom=120, left=160, right=160)
        rp = rcell.paragraphs[0]
        r_lbl = rp.add_run("PRESCRIBED REFERENCE MATERIAL & REGULATORY SOURCES\n")
        r_lbl.bold = True
        r_lbl.font.size = Pt(8.5)
        r_lbl.font.color.rgb = RGBColor(15, 41, 66)

        rp1 = rcell.add_paragraph()
        rp1.paragraph_format.space_after = Pt(2)
        r_p1 = rp1.add_run("Primary: ")
        r_p1.bold = True
        rp1.add_run(ref.get("primary", ""))
        for r in rp1.runs:
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(71, 85, 105)

        rp2 = rcell.add_paragraph()
        rp2.paragraph_format.space_after = Pt(4)
        r_p2 = rp2.add_run("Further Reading: ")
        r_p2.bold = True
        rp2.add_run(ref.get("further", ""))
        for r in rp2.runs:
            r.font.size = Pt(8)
            r.font.color.rgb = RGBColor(71, 85, 105)

        rp3 = rcell.add_paragraph()
        rp3.paragraph_format.space_after = Pt(0)
        r_auth = rp3.add_run("Author: S D Sandarsh | Communicative English, Soft Skills & Employability Trainer (+91 97437 11584)")
        r_auth.bold = True
        r_auth.font.size = Pt(8.5)
        r_auth.font.color.rgb = RGBColor(2, 132, 199)

    doc.save(output_docx_path)
    print(f"Successfully generated DOCX: {output_docx_path} ({os.path.getsize(output_docx_path):,} bytes)")


def main():
    with open(NOTES_JSON_PATH, "r", encoding="utf-8") as f:
        full_data = json.load(f)

    see_booster_data = full_data.get("Communicative English", {}).get("see-booster", {})
    if not see_booster_data:
        print("Error: see-booster data not found in notes-content.json")
        return

    # 1. Generate HTML
    html_content = build_html_document(see_booster_data)
    temp_html_path = os.path.join(PROJECT_ROOT, "temp_see_booster.html")
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Wrote temporary HTML to {temp_html_path}")

    # 2. Convert HTML to PDF via headless Chrome
    temp_pdf_path = os.path.join(PROJECT_ROOT, "SEE_Communicative_English_High_Yield_Supplementary_Notes.pdf")
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={temp_pdf_path}",
        temp_html_path
    ]
    print("Running Headless Chrome for PDF export...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Chrome error:", res.stderr)
    else:
        print(f"Generated PDF: {temp_pdf_path} ({os.path.getsize(temp_pdf_path):,} bytes)")

    # 3. Generate DOCX
    temp_docx_path = os.path.join(PROJECT_ROOT, "SEE_Communicative_English_High_Yield_Supplementary_Notes.docx")
    print("Generating DOCX via python-docx...")
    build_docx_document(see_booster_data, temp_docx_path)

    # 4. Copy to Target Locations
    targets = [
        DESKTOP_DIR,
        APP_PUBLIC_DIR
    ]

    for target in targets:
        if os.path.exists(target):
            # Copy PDF
            dest_pdf = os.path.join(target, "SEE_Communicative_English_High_Yield_Supplementary_Notes.pdf")
            shutil.copy2(temp_pdf_path, dest_pdf)
            print(f"Copied PDF -> {dest_pdf}")

            # Copy DOCX
            dest_docx = os.path.join(target, "SEE_Communicative_English_High_Yield_Supplementary_Notes.docx")
            shutil.copy2(temp_docx_path, dest_docx)
            print(f"Copied DOCX -> {dest_docx}")

    # Clean up temp HTML if desired, or keep for review
    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)

    print("\n--- ALL SUPPLEMENTARY NOTES DOCUMENTS GENERATED SUCCESSFULLY ---")

if __name__ == "__main__":
    main()
