import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ASSIGNMENTS_FILE = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');

function getAssignment(id?: string | null) {
  try {
    if (!fs.existsSync(ASSIGNMENTS_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_FILE, 'utf-8'));
    if (id) {
      const found = (data.assignments || []).find((a: any) => a.id === id);
      if (found) return found;
    }
    const activeId = data.activeAssignmentId;
    return (data.assignments || []).find((a: any) => a.id === activeId) || data.assignments?.[0] || null;
  } catch (err) {
    console.error('Error fetching assignment for instructions:', err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const asgn = getAssignment(id);

    // If PDF exists on disk, stream it
    if (asgn?.assignmentPdfFilename) {
      const pdfPath = path.join(process.cwd(), 'public', 'sample-data', asgn.assignmentPdfFilename);
      if (fs.existsSync(pdfPath)) {
        const fileBuffer = fs.readFileSync(pdfPath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${asgn.assignmentPdfFilename}"`
          }
        });
      }
    }

    if (!asgn) {
      return NextResponse.json({ success: false, error: 'Assignment not found.' }, { status: 404 });
    }

    // Generate comprehensive instruction manual
    const lines: string[] = [
      '================================================================================',
      `DEPARTMENT OF AVIATION & AEROSPACE STUDIES`,
      `COMPUTING SKILLS & LABORATORY PRACTICUM (COURSE: ${asgn.courseCode || 'Z7AVA 26209'})`,
      '================================================================================',
      '',
      `EXERCISE:   ${asgn.exerciseNumber || 'LAB EXERCISE'}`,
      `TITLE:      ${asgn.title}`,
      `MAX MARKS:  ${asgn.totalMarks || 15} MARKS TOTAL`,
      `DEADLINE:   ${asgn.deadline}`,
      `FORMAT:     .${asgn.fileType || 'xlsx'} Workbook strictly required`,
      '',
      '--------------------------------------------------------------------------------',
      '1. OPERATIONAL SCENARIO & ANALYST ROLE BRIEFING',
      '--------------------------------------------------------------------------------',
      `Role:         ${asgn.role?.title || 'Data Analyst'}`,
      `Organization: ${asgn.role?.organization || 'Aviation Operations Unit'}`,
      '',
      `Context:`,
      `${asgn.role?.context || asgn.scenario}`,
      '',
      `Mandate:`,
      `${asgn.role?.mandate || 'Execute analytical model using formulas and pivot tables.'}`,
      '',
      '--------------------------------------------------------------------------------',
      '2. DATASET ATTRIBUTES (RAW DATA SCHEMA)',
      '--------------------------------------------------------------------------------',
      ...(asgn.role?.attributes || []).map(
        (attr: any, idx: number) => `  ${idx + 1}. [${attr.col}] — ${attr.desc}`
      ),
      '',
      '--------------------------------------------------------------------------------',
      '3. LABORATORY TASKS SPECIFICATION (ONE WORKSHEET PER TASK)',
      '--------------------------------------------------------------------------------',
      ...(asgn.tasks || []).map((t: any) => [
        `TASK ${t.id}: ${t.title} (${t.marks} Marks)`,
        `Target Sheet: ${t.targetSheetOrSection}`,
        `Description:  ${t.description}`,
        t.config ? `Configuration:\n${Object.entries(t.config).map(([k, v]) => `    • ${k}: ${v}`).join('\n')}` : '',
        t.chartOrVisual ? `Visual Deliverable: ${t.chartOrVisual}` : '',
        t.analysisQuestion ? `Analysis Question:  ${t.analysisQuestion}` : '',
        ''
      ].filter(Boolean).join('\n')),
      '',
      '--------------------------------------------------------------------------------',
      '4. ACADEMIC INTEGRITY & FORENSIC STANDARDS',
      '--------------------------------------------------------------------------------',
      '• Submissions are audited via automated OOXML metadata inspection.',
      '• Direct formula tags (<f>) are mandatory. Values must NOT be hardcoded.',
      '• Use of AI generation scripts (e.g. openpyxl, ChatGPT Code Interpreter) will be flagged.',
      '• Save your file strictly as: [RollNo]_[YourName]_LabExercise.xlsx',
      '  Example: 26AVA101_RahulSharma_LabExercise.xlsx',
      '',
      '================================================================================',
      'Course Instructor / Evaluator • Department of Aviation & Aerospace Studies',
      '================================================================================'
    ];

    const textContent = lines.join('\n');
    const safeName = (asgn.title || 'Assignment').replace(/[^a-zA-Z0-9_-]/g, '_');

    return new NextResponse(textContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}_Instructions_Manual.txt"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate instructions' }, { status: 500 });
  }
}
