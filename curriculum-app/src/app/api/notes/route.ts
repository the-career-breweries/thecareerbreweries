import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'notes-content.json');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const course = searchParams.get('course');
  const session = searchParams.get('session');

  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'Notes data not found' }, { status: 404 });
    }
    
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    if (course && session) {
      if (data[course] && data[course][session]) {
        return NextResponse.json(data[course][session]);
      }
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading notes data:', error);
    return NextResponse.json({ error: 'Failed to load notes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { course, session, content } = await req.json();
    
    if (!course || !session || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    let currentData: any = {};
    if (fs.existsSync(dataFilePath)) {
      currentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } else {
      const dir = path.dirname(dataFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!currentData[course]) {
      currentData[course] = {};
    }
    
    currentData[course][session] = content;
    
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving notes data:', error);
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
  }
}
