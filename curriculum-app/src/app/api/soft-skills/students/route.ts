import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const STUDENTS_PATH = path.join(process.cwd(), 'src', 'data', 'softskills-students.json');

function readStudents() {
  try {
    if (!fs.existsSync(STUDENTS_PATH)) {
      return [];
    }
    const data = fs.readFileSync(STUDENTS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading softskills-students:', err);
    return [];
  }
}

function writeStudents(records: any[]) {
  try {
    fs.writeFileSync(STUDENTS_PATH, JSON.stringify(records, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing softskills-students:', err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const students = readStudents();
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section');
    const tendency = searchParams.get('tendency');

    let filtered = students;
    if (section && section !== 'All') {
      filtered = filtered.filter((s: any) => s.section === section);
    }
    if (tendency && tendency !== 'All') {
      filtered = filtered.filter((s: any) => s.dominantTendency === tendency);
    }

    // Tendency stats
    const tendencyCounts: Record<string, number> = { Seeker: 0, Learner: 0, Leader: 0, Inquisitive: 0 };
    students.forEach((s: any) => {
      const t = s.dominantTendency;
      if (t) tendencyCounts[t] = (tendencyCounts[t] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      students: filtered,
      analytics: {
        totalStudents: students.length,
        tendencyCounts
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const students = readStudents();
    const rollNo = body.rollNo;

    const index = students.findIndex((s: any) => s.rollNo === rollNo);
    if (index >= 0) {
      students[index] = { ...students[index], ...body };
      writeStudents(students);
      return NextResponse.json({ success: true, student: students[index] });
    } else {
      students.push(body);
      writeStudents(students);
      return NextResponse.json({ success: true, student: body });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
