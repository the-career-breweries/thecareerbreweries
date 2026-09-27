import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to our local JSON file for storing feedback
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'feedback.json');

export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading feedback data:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Create new feedback entry
    const newFeedback = {
      id: Date.now().toString(),
      ...body,
      submittedAt: new Date().toISOString()
    };
    
    let currentData = [];
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, 'utf8');
      if (fileData) {
        currentData = JSON.parse(fileData);
      }
    } else {
        // Create directory if it doesn't exist
        const dir = path.dirname(dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    
    // Add to top of list
    currentData.unshift(newFeedback);
    
    // Write back to file
    fs.writeFileSync(dataFilePath, JSON.stringify(currentData, null, 2));
    
    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}
