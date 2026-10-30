import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ENGLISHSCORE_PATH = path.join(process.cwd(), 'src', 'data', 'softskills-englishscore.json');

function readRecords() {
  try {
    if (!fs.existsSync(ENGLISHSCORE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(ENGLISHSCORE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading softskills-englishscore:', err);
    return [];
  }
}

function writeRecords(records: any[]) {
  try {
    fs.writeFileSync(ENGLISHSCORE_PATH, JSON.stringify(records, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing softskills-englishscore:', err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const records = readRecords();
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section');
    const cefr = searchParams.get('cefr');

    let filtered = records;
    if (section && section !== 'All') {
      filtered = filtered.filter((r: any) => r.section === section);
    }
    if (cefr && cefr !== 'All') {
      filtered = filtered.filter((r: any) => r.cefrLevel === cefr);
    }

    // Compute cohort statistics
    const totalStudents = records.length;
    const cefrCounts: Record<string, number> = { 'Pre-A1': 0, 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0, 'C1': 0 };
    let totalScoreSum = 0;

    records.forEach((r: any) => {
      const lvl = r.cefrLevel || 'A1';
      cefrCounts[lvl] = (cefrCounts[lvl] || 0) + 1;
      totalScoreSum += Number(r.overallScore) || 0;
    });

    const averageScore = totalStudents > 0 ? Math.round(totalScoreSum / totalStudents) : 0;

    return NextResponse.json({
      success: true,
      records: filtered,
      analytics: {
        totalStudents,
        averageScore,
        cefrCounts,
        bridgeNeededCount: (cefrCounts['Pre-A1'] || 0) + (cefrCounts['A1'] || 0),
        placementReadyCount: (cefrCounts['B1'] || 0) + (cefrCounts['B2'] || 0) + (cefrCounts['C1'] || 0)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const records = readRecords();

    const rollNo = body.rollNo;
    const existingIndex = records.findIndex((r: any) => r.rollNo === rollNo);

    const overallScore = Number(body.overallScore) || 0;
    let cefrLevel = body.cefrLevel;
    if (!cefrLevel) {
      if (overallScore >= 500) cefrLevel = 'C1';
      else if (overallScore >= 400) cefrLevel = 'B2';
      else if (overallScore >= 300) cefrLevel = 'B1';
      else if (overallScore >= 200) cefrLevel = 'A2';
      else cefrLevel = 'A1';
    }

    const newRecord = {
      id: body.id || `es-${Date.now()}`,
      rollNo: rollNo,
      studentName: body.studentName || 'Student',
      program: body.program || 'B.Sc Aviation',
      section: body.section || 'Section A',
      attemptType: body.attemptType || 'Baseline Diagnostic',
      testDate: body.testDate || new Date().toISOString().split('T')[0],
      overallScore: overallScore,
      cefrLevel: cefrLevel,
      grammar: Number(body.grammar) || 0,
      vocabulary: Number(body.vocabulary) || 0,
      reading: Number(body.reading) || 0,
      listening: Number(body.listening) || 0,
      screenshotUrl: body.screenshotUrl || '',
      verified: true
    };

    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...newRecord };
    } else {
      records.push(newRecord);
    }

    writeRecords(records);
    return NextResponse.json({ success: true, record: newRecord });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
