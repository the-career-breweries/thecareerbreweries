import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const EVIDENCE_PATH = path.join(process.cwd(), 'src', 'data', 'softskills-evidence.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'soft-skills');

function readEvidence() {
  try {
    if (!fs.existsSync(EVIDENCE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(EVIDENCE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading softskills-evidence:', err);
    return [];
  }
}

function writeEvidence(records: any[]) {
  try {
    fs.writeFileSync(EVIDENCE_PATH, JSON.stringify(records, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing softskills-evidence:', err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    const evidence = readEvidence();
    const searchParams = request.nextUrl.searchParams;
    const topicSlug = searchParams.get('topicSlug');
    const category = searchParams.get('category');
    const section = searchParams.get('section');

    let filtered = evidence;
    if (topicSlug && topicSlug !== 'all') {
      filtered = filtered.filter((e: any) => e.topicSlug === topicSlug);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((e: any) => e.category === category);
    }
    if (section && section !== 'all') {
      filtered = filtered.filter((e: any) => e.section === section);
    }

    filtered.sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ success: true, evidence: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let record: any = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const topicSlug = formData.get('topicSlug') as string || 'general';
      const section = formData.get('section') as string || 'Section A';
      const studentRollNo = formData.get('studentRollNo') as string || '';
      const studentName = formData.get('studentName') as string || '';
      const category = formData.get('category') as string || 'activity';
      const caption = formData.get('caption') as string || '';
      const mediaType = formData.get('mediaType') as string || 'photo';
      const externalUrl = formData.get('url') as string || '';

      let fileUrl = externalUrl;

      if (file && file.size > 0) {
        if (!fs.existsSync(UPLOAD_DIR)) {
          fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${topicSlug}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, filename);
        const arrayBuffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
        fileUrl = `/uploads/soft-skills/${filename}`;
      }

      record = {
        id: `ev-${Date.now()}`,
        topicSlug,
        section,
        studentRollNo,
        studentName,
        mediaType,
        category,
        url: fileUrl,
        caption,
        uploadedAt: new Date().toISOString()
      };
    } else {
      const body = await request.json();
      record = {
        id: `ev-${Date.now()}`,
        topicSlug: body.topicSlug || 'general',
        section: body.section || 'Section A',
        studentRollNo: body.studentRollNo || '',
        studentName: body.studentName || '',
        mediaType: body.mediaType || 'photo',
        category: body.category || 'activity',
        url: body.url || '',
        caption: body.caption || '',
        uploadedAt: new Date().toISOString()
      };
    }

    const evidence = readEvidence();
    evidence.unshift(record);
    writeEvidence(evidence);

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
