import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { analyzeXlsxBuffer } from '@/lib/xlsx-forensics';

export const dynamic = 'force-dynamic';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-submissions.json');
const ASSIGNMENTS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');

function getActiveAssignment() {
  try {
    if (fs.existsSync(ASSIGNMENTS_PATH)) {
      const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, 'utf8'));
      const activeId = data.activeAssignmentId;
      return (data.assignments || []).find((a: any) => a.id === activeId) || data.assignments?.[0] || null;
    }
  } catch (err) {
    console.error('Error reading active assignment:', err);
  }
  return null;
}

interface SubmissionRecord {
  id: string;
  rollNo: string;
  studentName: string;
  submittedAt: string;
  originalFilename: string;
  fileSize: number;
  viva: {
    q1Answer: string;
    q2Answer: string;
    isCorrect: boolean;
    secondsTaken: number;
  };
  forensics: ReturnType<typeof analyzeXlsxBuffer>;
  evaluation: {
    finalScore: number;
    instructorOverride: boolean;
    instructorRemarks: string;
    evaluatedAt: string | null;
  };
}

function readSubmissions(): SubmissionRecord[] {
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

function writeSubmissions(records: SubmissionRecord[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing submissions:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const rollNo = (formData.get('rollNo') as string || '').trim().toUpperCase();
    const studentName = (formData.get('studentName') as string || '').trim();
    const q1 = (formData.get('vivaQ1') as string || '').trim();
    const q2 = (formData.get('vivaQ2') as string || '').trim();
    const secondsTaken = parseInt(formData.get('secondsTaken') as string || '0', 10);

    if (!file || !rollNo || !studentName) {
      return NextResponse.json(
        { error: 'Missing required fields: file, rollNo, and studentName are mandatory.' },
        { status: 400 }
      );
    }

    const activeAssignment = getActiveAssignment();
    const expectedFileType = activeAssignment?.fileType || 'xlsx';

    const validExtensions = [`.${expectedFileType}`];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));

    if (!hasValidExt) {
      return NextResponse.json(
        { error: `Invalid file format. Please upload your assignment as a .${expectedFileType} file.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run Forensic & AI Trap Engine
    let forensics;
    try {
      forensics = analyzeXlsxBuffer(buffer, file.name);
    } catch (parseErr: any) {
      return NextResponse.json(
        { error: `Could not parse file structure: ${parseErr.message}` },
        { status: 400 }
      );
    }

    // Evaluate Micro-viva answers
    const expectedQ1 = (activeAssignment?.vivaQuestions?.q1?.answer || 'IndiGo').toLowerCase();
    const expectedQ2 = (activeAssignment?.vivaQuestions?.q2?.answer || '$').toLowerCase();

    const q1Normalized = q1.toLowerCase();
    const q2Normalized = q2.toLowerCase();

    const isQ1Correct = q1Normalized.includes(expectedQ1) || expectedQ1.includes(q1Normalized);
    const isQ2Correct = q2Normalized.includes(expectedQ2) || expectedQ2.includes(q2Normalized);
    const isVivaPassed = isQ1Correct && isQ2Correct && secondsTaken <= 60;

    if (!isVivaPassed) {
      forensics.summaryFindings.push(
        `Micro-viva comprehension check incomplete (Q1: ${isQ1Correct ? 'Pass' : 'Fail'}, Q2: ${isQ2Correct ? 'Pass' : 'Fail'}, Time: ${secondsTaken}s)`
      );
      // Comprehension check remark; do NOT mark submission suspicious if no AI/Python signatures exist
      if (forensics.flags?.isAiGenerator || forensics.flags?.isHoneypotTriggered) {
        forensics.integrityScore = Math.max(0, forensics.integrityScore - 15);
      }
    }

    const submissionId = `SUB-${rollNo}-${Date.now().toString().slice(-6)}`;
    const newRecord: SubmissionRecord = {
      id: submissionId,
      rollNo,
      studentName,
      submittedAt: new Date().toISOString(),
      originalFilename: file.name,
      fileSize: file.size,
      viva: {
        q1Answer: q1,
        q2Answer: q2,
        isCorrect: isVivaPassed,
        secondsTaken
      },
      forensics,
      evaluation: {
        finalScore: forensics.autoGradeEstimate.total,
        instructorOverride: false,
        instructorRemarks: '',
        evaluatedAt: null
      }
    };

    const existingRecords = readSubmissions();
    // Replace if same rollNo already submitted, otherwise append
    const filtered = existingRecords.filter((r) => r.rollNo !== rollNo);
    filtered.push(newRecord);
    writeSubmissions(filtered);

    return NextResponse.json({
      success: true,
      message: 'Assignment submitted and registered successfully.',
      submissionId,
      summary: {
        rollNo,
        studentName,
        submittedAt: newRecord.submittedAt,
        sheetsDetected: forensics.sheetNames,
        formulasFound: forensics.totalFormulasFound
      }
    });
  } catch (err: any) {
    console.error('Submission API error:', err);
    return NextResponse.json({ error: err.message || 'Server error occurred' }, { status: 500 });
  }
}
