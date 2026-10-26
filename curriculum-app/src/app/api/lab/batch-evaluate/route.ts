import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { evaluateBatchSubmissions } from '@/lib/batch-evaluator';

export const dynamic = 'force-dynamic';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-submissions.json');
const ASSIGNMENTS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');
const INSTRUCTOR_PASSKEY = '2525';

function readSubmissions(): any[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      fs.writeFileSync(SUBMISSIONS_PATH, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

function writeSubmissions(records: any[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing submissions:', err);
  }
}

function getAssignment(assignmentId?: string) {
  try {
    if (fs.existsSync(ASSIGNMENTS_PATH)) {
      const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, 'utf8'));
      if (assignmentId) {
        const found = (data.assignments || []).find((a: any) => a.id === assignmentId);
        if (found) return found;
      }
      const activeId = data.activeAssignmentId;
      return (data.assignments || []).find((a: any) => a.id === activeId) || data.assignments?.[0] || null;
    }
  } catch (err) {
    console.error('Error reading assignments:', err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const assignmentId = (formData.get('assignmentId') as string || '').trim();
    const passkey = (formData.get('passkey') as string || '').trim();

    if (passkey !== INSTRUCTOR_PASSKEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid instructor passkey.' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No ZIP archive provided. Please select a .zip file.' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload a .zip archive.' },
        { status: 400 }
      );
    }

    const assignment = getAssignment(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { success: false, error: 'Target assignment could not be found.' },
        { status: 404 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxMarksParam = formData.get('maxMarks') as string | null;
    const customMaxMarks = maxMarksParam && !isNaN(Number(maxMarksParam)) ? Math.max(1, Number(maxMarksParam)) : (assignment.totalMarks || 50);

    let summary;
    try {
      summary = evaluateBatchSubmissions(buffer, assignment, customMaxMarks);
    } catch (parseErr: any) {
      return NextResponse.json(
        { success: false, error: `Failed to process ZIP archive: ${parseErr.message}` },
        { status: 400 }
      );
    }

    if (summary.evaluatedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No valid submission files (.xlsx, .docx, .pptx) were found inside ${file.name}. Found ${summary.totalFilesParsed} total files.`
        },
        { status: 400 }
      );
    }

    // Merge evaluated submissions into the submissions database
    const existing = readSubmissions();
    const updated = [...existing];

    for (const newSub of summary.results) {
      const existingIdx = updated.findIndex(
        (e: any) => e.rollNo === newSub.rollNo && (e.assignmentId === newSub.assignmentId || !e.assignmentId)
      );
      if (existingIdx >= 0) {
        updated[existingIdx] = newSub;
      } else {
        updated.unshift(newSub);
      }
    }

    writeSubmissions(updated);

    return NextResponse.json({
      success: true,
      message: `Batch evaluation complete! Evaluated ${summary.evaluatedCount} submission(s) for "${assignment.title}".`,
      summary
    });
  } catch (err: any) {
    console.error('Batch evaluation error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Server error occurred during batch evaluation.' },
      { status: 500 }
    );
  }
}
