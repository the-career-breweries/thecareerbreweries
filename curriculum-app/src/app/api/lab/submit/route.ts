import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { analyzeXlsxBuffer } from '@/lib/xlsx-forensics';

export const dynamic = 'force-dynamic';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-submissions.json');
const ASSIGNMENTS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');

function getTargetAssignment(id?: string | null) {
  try {
    if (fs.existsSync(ASSIGNMENTS_PATH)) {
      const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, 'utf8'));
      if (id) {
        const found = (data.assignments || []).find((a: any) => a.id === id);
        if (found) return found;
      }
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
  assignmentId?: string;
  assignmentTitle?: string;
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
    maxMarks?: number;
    percentage?: number;
    gradeBand?: string;
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

    const assignmentIdParam = (formData.get('assignmentId') as string || '').trim();
    const targetAssignment = getTargetAssignment(assignmentIdParam);
    const expectedFileType = targetAssignment?.fileType || 'xlsx';

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

    // Run Forensic & AI Trap Engine with target assignment context
    let forensics;
    try {
      forensics = analyzeXlsxBuffer(buffer, file.name, targetAssignment);
    } catch (parseErr: any) {
      return NextResponse.json(
        { error: `Could not parse file structure: ${parseErr.message}` },
        { status: 400 }
      );
    }

    // Evaluate Micro-viva answers
    const expectedQ1 = (targetAssignment?.vivaQuestions?.q1?.answer || 'IndiGo').toLowerCase();
    const expectedQ2 = (targetAssignment?.vivaQuestions?.q2?.answer || '$').toLowerCase();

    const q1Normalized = q1.toLowerCase();
    const q2Normalized = q2.toLowerCase();

    const isQ1Correct = q1Normalized.includes(expectedQ1) || expectedQ1.includes(q1Normalized);
    const isQ2Correct = q2Normalized.includes(expectedQ2) || expectedQ2.includes(q2Normalized);
    const vivaCorrectCount = (isQ1Correct ? 1 : 0) + (isQ2Correct ? 1 : 0);
    const isVivaPassed = vivaCorrectCount === 2 && secondsTaken <= 60;

    let vivaPenaltyMultiplier = 1.0;
    if (vivaCorrectCount === 0) {
      vivaPenaltyMultiplier = 0.5; // 50% penalty on marks for failing both questions
      forensics.summaryFindings.push(
        `Micro-viva comprehension check failed (Q1: Fail, Q2: Fail, Time: ${secondsTaken}s) — 50% comprehension penalty applied`
      );
      if (forensics.flags?.isAiGenerator || forensics.flags?.isHoneypotTriggered) {
        forensics.integrityScore = Math.max(0, forensics.integrityScore - 20);
      }
    } else if (vivaCorrectCount === 1) {
      vivaPenaltyMultiplier = 0.85; // 15% penalty
      forensics.summaryFindings.push(
        `Micro-viva comprehension check partial (Q1: ${isQ1Correct ? 'Pass' : 'Fail'}, Q2: ${isQ2Correct ? 'Pass' : 'Fail'}, Time: ${secondsTaken}s)`
      );
    } else {
      forensics.summaryFindings.push(
        `Micro-viva comprehension verified: 2/2 questions passed in ${secondsTaken}s`
      );
    }

    // Scale autoGrade total to targetMaxMarks
    const targetMaxMarks = targetAssignment?.totalMarks || 50;
    const rawTotal50 = forensics.autoGradeEstimate.total;
    const penalizedTotal50 = rawTotal50 * vivaPenaltyMultiplier;
    const scaledScore = Number(((penalizedTotal50 / 50) * targetMaxMarks).toFixed(1));
    const scorePercentage = Math.round((scaledScore / targetMaxMarks) * 100);

    let gradeBand = 'O';
    if (scorePercentage < 50) gradeBand = 'F';
    else if (scorePercentage < 60) gradeBand = 'C';
    else if (scorePercentage < 70) gradeBand = 'B';
    else if (scorePercentage < 80) gradeBand = 'A';
    else if (scorePercentage < 90) gradeBand = 'A+';

    // Scale component breakdowns
    const scaledDataSetup = Number(((forensics.autoGradeEstimate.dataSetup / 10) * (targetMaxMarks * 0.2)).toFixed(1));
    const scaledTasks = Number((((forensics.autoGradeEstimate.tasks * vivaPenaltyMultiplier) / 30) * (targetMaxMarks * 0.6)).toFixed(1));
    const scaledAnalysis = Number(((forensics.autoGradeEstimate.analysis / 10) * (targetMaxMarks * 0.2)).toFixed(1));

    forensics.autoGradeEstimate = {
      dataSetup: scaledDataSetup,
      tasks: scaledTasks,
      analysis: scaledAnalysis,
      total: scaledScore
    };

    const submissionId = `SUB-${rollNo}-${Date.now().toString().slice(-6)}`;
    const newRecord: SubmissionRecord = {
      id: submissionId,
      assignmentId: targetAssignment?.id || 'blr-pivot-operations',
      assignmentTitle: targetAssignment?.title || 'Flight Operations Analysis using Pivot Tables & Charts',
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
        finalScore: scaledScore,
        maxMarks: targetMaxMarks,
        percentage: scorePercentage,
        gradeBand,
        instructorOverride: false,
        instructorRemarks: forensics.summaryFindings.join('; '),
        evaluatedAt: new Date().toISOString()
      }
    };

    const existingRecords = readSubmissions();
    // Replace previous submission if same rollNo AND same assignmentId, otherwise append
    const targetId = targetAssignment?.id || 'blr-pivot-operations';
    const filtered = existingRecords.filter((r: any) => {
      const isSameStudent = r.rollNo === rollNo;
      const rAsgnId = r.assignmentId || 'blr-pivot-operations';
      return !(isSameStudent && rAsgnId === targetId);
    });
    filtered.push(newRecord);
    writeSubmissions(filtered);

    return NextResponse.json({
      success: true,
      message: `Assignment successfully submitted and recorded for ${targetAssignment?.title || 'Course Lab'}.`,
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
