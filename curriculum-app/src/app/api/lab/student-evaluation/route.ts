import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-submissions.json');
const ROSTER_PATH = path.join(process.cwd(), 'src', 'data', 'aviation-students.json');
const ASSIGNMENTS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');

function readSubmissions(): any[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) return [];
    return JSON.parse(fs.readFileSync(SUBMISSIONS_PATH, 'utf8'));
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

function readRoster(): any[] {
  try {
    if (!fs.existsSync(ROSTER_PATH)) return [];
    return JSON.parse(fs.readFileSync(ROSTER_PATH, 'utf8'));
  } catch (err) {
    console.error('Error reading roster:', err);
    return [];
  }
}

function getActiveAssignment(): any {
  try {
    if (fs.existsSync(ASSIGNMENTS_PATH)) {
      const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_PATH, 'utf8'));
      const activeId = data.activeAssignmentId;
      return (data.assignments || []).find((a: any) => a.id === activeId) || data.assignments?.[0] || null;
    }
  } catch (err) {
    console.error('Error reading assignment:', err);
  }
  return null;
}

/**
 * Normalizes input roll number to find exact match across formats:
 * - PROV/ASAV/BSC/7/26/019 -> 019
 * - PROV-ASAV-BSC-7-26-019 -> 019
 * - 26-AVA-019 -> 019
 * - 019 or 19 -> 019
 */
function extractRollDigits(input: string): string | null {
  const parts = input.trim().replace(/[^0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (parts.length > 0) {
    const last = parts[parts.length - 1];
    return last.padStart(3, '0');
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryRoll = (searchParams.get('rollNo') || '').trim();

    if (!queryRoll) {
      return NextResponse.json(
        { error: 'Please enter your Roll Number to check your evaluation.' },
        { status: 400 }
      );
    }

    const normalizedDigits = extractRollDigits(queryRoll);
    const submissions = readSubmissions();
    const roster = readRoster();
    const activeAssignment = getActiveAssignment();

    // 1. Try finding in submissions
    let matchSub = submissions.find(s => {
      if (!s.rollNo) return false;
      const subClean = s.rollNo.toUpperCase().replace(/[\/\\]/g, '-');
      const queryClean = queryRoll.toUpperCase().replace(/[\/\\]/g, '-');
      if (subClean === queryClean) return true;

      // Match by 3-digit suffix
      if (normalizedDigits) {
        const subDigits = extractRollDigits(s.rollNo);
        if (subDigits && subDigits === normalizedDigits) return true;
      }
      return false;
    });

    // 2. Try finding student in the master roster
    let rosterMatch = roster.find(r => {
      const rClean = r.rollNo.toUpperCase().replace(/[\/\\]/g, '-');
      const queryClean = queryRoll.toUpperCase().replace(/[\/\\]/g, '-');
      if (rClean === queryClean) return true;
      if (normalizedDigits && extractRollDigits(r.rollNo) === normalizedDigits) return true;
      return false;
    });

    if (!matchSub && !rosterMatch) {
      return NextResponse.json(
        {
          found: false,
          error: `Roll Number "${queryRoll}" was not found in the course roster. Please verify your roll number (e.g. PROV-ASAV-BSC-7-26-019 or 26-AVA-019 or 019).`
        },
        { status: 404 }
      );
    }

    // If found in roster but no submission record
    if (!matchSub && rosterMatch) {
      return NextResponse.json({
        found: true,
        submitted: false,
        student: {
          rollNo: rosterMatch.rollNo,
          name: rosterMatch.name,
          slNo: rosterMatch.slNo
        },
        assignment: {
          title: activeAssignment?.title || 'Flight Operations Analysis using Pivot Tables & Charts',
          courseCode: activeAssignment?.courseCode || 'Z7AVA 26209',
          totalMarks: activeAssignment?.totalMarks || 15
        },
        message: `Welcome, ${rosterMatch.name}. No evaluated submission is currently registered for your roll number (${rosterMatch.rollNo}). If you recently submitted, please check back after evaluation.`
      });
    }

    // Found submission record
    const maxMarks = matchSub.evaluation?.maxMarks || activeAssignment?.totalMarks || 15;
    const finalScore = matchSub.evaluation?.finalScore ?? 0;
    const scorePercentage = matchSub.evaluation?.percentage || Math.round((finalScore / maxMarks) * 100);

    let gradeLetter = 'F';
    if (scorePercentage >= 90) gradeLetter = 'A+';
    else if (scorePercentage >= 80) gradeLetter = 'A';
    else if (scorePercentage >= 70) gradeLetter = 'B+';
    else if (scorePercentage >= 60) gradeLetter = 'B';
    else if (scorePercentage >= 50) gradeLetter = 'C';

    const accuracy = matchSub.forensics?.resultAccuracy || {
      percentage: scorePercentage,
      status: scorePercentage >= 90 ? 'High Precision' : scorePercentage >= 75 ? 'Satisfactory' : 'Discrepancies Flagged',
      dataSetupAccuracy: 100,
      computationalAccuracy: 90,
      analysisAccuracy: 85
    };

    const isAi = Boolean(matchSub.forensics?.flags?.isAiGenerator || matchSub.forensics?.flags?.isHoneypotTriggered);
    const resolvedIntegrityLevel = isAi ? (matchSub.forensics?.integrityLevel || 'suspicious') : 'clean';
    const resolvedIntegrityScore = isAi ? (matchSub.forensics?.integrityScore ?? 50) : 100;

    const aiTools = {
      detected: isAi,
      toolNames: isAi
        ? (matchSub.forensics?.aiToolsUsed?.toolNames || ['ChatGPT / Claude Code Interpreter (openpyxl)'])
        : ['None Detected (Authentic Microsoft Office / Google Sheets)'],
      reasons: isAi
        ? (matchSub.forensics?.aiToolsUsed?.reasons || matchSub.forensics?.summaryFindings?.filter((f: string) => !f.includes('Authentic')) || [])
        : []
    };

    return NextResponse.json({
      found: true,
      submitted: true,
      submission: {
        id: matchSub.id,
        rollNo: matchSub.rollNo || rosterMatch?.rollNo,
        studentName: matchSub.studentName || rosterMatch?.name,
        submittedAt: matchSub.submittedAt,
        assignmentTitle: matchSub.assignmentTitle || activeAssignment?.title || 'Flight Operations Analysis using Pivot Tables & Charts',
        courseCode: activeAssignment?.courseCode || 'Z7AVA 26209',
        score: finalScore,
        maxMarks,
        scorePercentage,
        gradeLetter,
        instructorRemarks: matchSub.evaluation?.instructorRemarks || 'Evaluation completed. Work verified against institutional computing standards.',
        evaluatedAt: matchSub.evaluation?.evaluatedAt || matchSub.submittedAt,
        instructorOverride: Boolean(matchSub.evaluation?.instructorOverride),
        resultAccuracy: accuracy,
        aiToolsUsed: aiTools,
        forensics: {
          application: matchSub.forensics?.application || 'Microsoft Excel',
          totalFormulasFound: matchSub.forensics?.totalFormulasFound || 0,
          sampleFormulas: matchSub.forensics?.sampleFormulas || [],
          allFormulas: matchSub.forensics?.allFormulas || matchSub.forensics?.sampleFormulas || [],
          formulaTypes: matchSub.forensics?.formulaTypes || [],
          totalTimeMinutes: matchSub.forensics?.totalTimeMinutes ?? 0,
          integrityScore: resolvedIntegrityScore,
          integrityLevel: resolvedIntegrityLevel,
          summaryFindings: matchSub.forensics?.summaryFindings || [],
          sheetNames: matchSub.forensics?.sheetNames || []
        }
      }
    });
  } catch (err: any) {
    console.error('Student evaluation lookup error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while retrieving evaluation.' },
      { status: 500 }
    );
  }
}
