import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SESSIONS_PATH = path.join(process.cwd(), 'src', 'data', 'softskills-sessions.json');

function readSessions() {
  try {
    if (!fs.existsSync(SESSIONS_PATH)) {
      fs.writeFileSync(SESSIONS_PATH, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(SESSIONS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading softskills-sessions:', err);
    return [];
  }
}

function writeSessions(records: any[]) {
  try {
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(records, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing softskills-sessions:', err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessions = readSessions();
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section');
    const topicSlug = searchParams.get('topicSlug');

    let filtered = sessions;
    if (section && section !== 'All') {
      filtered = filtered.filter((s: any) => s.section === section);
    }
    if (topicSlug && topicSlug !== 'all') {
      filtered = filtered.filter((s: any) => s.topicSlug === topicSlug);
    }

    // Sort newest first
    filtered.sort((a: any, b: any) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());

    // Compute KPIs
    const totalSessions = sessions.length;
    const totalStudentsReached = sessions.reduce((acc: number, s: any) => acc + (s.studentCount || 0), 0);
    const compliantCount = sessions.filter((s: any) => s.isCompliant48h !== false).length;
    const complianceRate = totalSessions > 0 ? Math.round((compliantCount / totalSessions) * 100) : 100;

    return NextResponse.json({
      success: true,
      sessions: filtered,
      kpis: {
        totalSessions,
        totalStudentsReached,
        complianceRate,
        compliantCount
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessions = readSessions();

    const now = new Date();
    const sessionDate = body.sessionDate ? new Date(body.sessionDate) : now;
    const hoursDifference = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);
    const isCompliant48h = hoursDifference <= 48;

    const newRecord = {
      id: `sess-${Date.now()}`,
      sessionNumber: sessions.length + 1,
      sessionDate: body.sessionDate || now.toISOString().split('T')[0],
      campus: body.campus || 'Alliance University',
      program: body.program || 'B.Sc Aviation',
      section: body.section || 'Section A',
      instructorName: body.instructorName || 'S D Sandarsh',
      durationMinutes: Number(body.durationMinutes) || 40,
      topicId: body.topicId || '',
      topicSlug: body.topicSlug || '',
      topicTitle: body.topicTitle || '',
      subtopicsCovered: Array.isArray(body.subtopicsCovered) ? body.subtopicsCovered : [body.subtopicsCovered || ''],
      activityTitle: body.activityTitle || '',
      studentCount: Number(body.studentCount) || 30,
      engagementLevel: body.engagementLevel || 'High',
      observedCefr: body.observedCefr || 'A2',
      complementarySessionNeeded: Boolean(body.complementarySessionNeeded),
      evidenceLinks: Array.isArray(body.evidenceLinks) ? body.evidenceLinks : (body.evidenceLinks ? [body.evidenceLinks] : []),
      materialsUsed: body.materialsUsed || '',
      notes: body.notes || '',
      loggedAt: now.toISOString(),
      isCompliant48h
    };

    sessions.unshift(newRecord);
    writeSessions(sessions);

    return NextResponse.json({ success: true, session: newRecord });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
