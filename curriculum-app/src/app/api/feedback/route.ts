import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('feedbacks').orderBy('createdAt', 'desc').get();
    const feedbacks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error reading feedback from Firebase:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Create new feedback entry mapping expected fields
    const newFeedback = {
      ...body,
      createdAt: new Date().toISOString()
    };
    
    // Save to Firebase directly to ensure permanence across deployments
    const docRef = await adminDb.collection('feedbacks').add(newFeedback);
    
    return NextResponse.json({ success: true, id: docRef.id, feedback: newFeedback });
  } catch (error) {
    console.error('Error saving feedback to Firebase:', error);
    return NextResponse.json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}
