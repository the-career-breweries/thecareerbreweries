import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SUBMISSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'lab-submissions.json');
const INSTRUCTOR_PASSKEY = '2525';

function readSubmissions() {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      return [];
    }
    const data = fs.readFileSync(SUBMISSIONS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const passkey = searchParams.get('passkey');

  if (passkey !== INSTRUCTOR_PASSKEY) {
    return NextResponse.json({ error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
  }

  const records = readSubmissions();
  return NextResponse.json({
    success: true,
    count: records.length,
    submissions: records
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { passkey, submissionId, finalScore, instructorRemarks } = body;

    if (passkey !== INSTRUCTOR_PASSKEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
    }

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required.' }, { status: 400 });
    }

    const records = readSubmissions();
    const target = records.find((r: any) => r.id === submissionId);

    if (!target) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    if (typeof finalScore === 'number') {
      target.evaluation.finalScore = Math.max(0, Math.min(50, finalScore));
      target.evaluation.instructorOverride = true;
    }

    if (typeof instructorRemarks === 'string') {
      target.evaluation.instructorRemarks = instructorRemarks;
    }

    target.evaluation.evaluatedAt = new Date().toISOString();

    writeSubmissions(records);

    return NextResponse.json({
      success: true,
      message: 'Evaluation updated successfully.',
      submission: target
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const passkey = searchParams.get('passkey');
  const submissionId = searchParams.get('id');
  const deleteAll = searchParams.get('all') === 'true' || submissionId === 'all';
  const assignmentId = searchParams.get('assignmentId');

  if (passkey !== INSTRUCTOR_PASSKEY) {
    return NextResponse.json({ error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
  }

  if (deleteAll) {
    if (assignmentId && assignmentId !== 'all') {
      const records = readSubmissions();
      const filtered = records.filter((r: any) => r.assignmentId !== assignmentId);
      writeSubmissions(filtered);
      return NextResponse.json({
        success: true,
        message: `All evaluations for assignment deleted successfully.`,
        count: filtered.length
      });
    }

    writeSubmissions([]);
    return NextResponse.json({
      success: true,
      message: 'All evaluations deleted successfully from master roster.',
      count: 0
    });
  }

  const records = readSubmissions();
  const filtered = records.filter((r: any) => r.id !== submissionId);
  writeSubmissions(filtered);

  return NextResponse.json({ success: true, message: 'Submission deleted.' });
}
