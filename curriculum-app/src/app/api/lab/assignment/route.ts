import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ASSIGNMENTS_FILE = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');
const INSTRUCTOR_PASSKEY = '2525';

function readAssignmentsData() {
  try {
    if (!fs.existsSync(ASSIGNMENTS_FILE)) {
      return { activeAssignmentId: 'blr-pivot-operations', assignments: [] };
    }
    const raw = fs.readFileSync(ASSIGNMENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading assignments data:', err);
    return { activeAssignmentId: 'blr-pivot-operations', assignments: [] };
  }
}

function writeAssignmentsData(data: any) {
  try {
    fs.writeFileSync(ASSIGNMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving assignments data:', err);
    return false;
  }
}

function sanitizeAssignmentForStudent(assignment: any) {
  if (!assignment) return null;
  const clone = JSON.parse(JSON.stringify(assignment));
  if (clone.vivaQuestions) {
    if (clone.vivaQuestions.q1) {
      delete clone.vivaQuestions.q1.answer;
    }
    if (clone.vivaQuestions.q2) {
      delete clone.vivaQuestions.q2.answer;
    }
  }
  delete clone.honeypotInstruction;
  return clone;
}

// GET /api/lab/assignment
// Public for students to fetch active and archived assignments; includes raw answers if instructor passkey provided
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passkey = searchParams.get('passkey');
    const targetId = searchParams.get('id');

    const data = readAssignmentsData();
    const active = data.assignments.find((a: any) => a.id === data.activeAssignmentId) || data.assignments[0] || null;
    const selected = targetId
      ? (data.assignments.find((a: any) => a.id === targetId) || active)
      : active;

    if (passkey === INSTRUCTOR_PASSKEY) {
      return NextResponse.json({
        success: true,
        activeAssignmentId: data.activeAssignmentId,
        activeAssignment: active,
        assignment: selected,
        assignments: data.assignments
      });
    }

    return NextResponse.json({
      success: true,
      activeAssignmentId: data.activeAssignmentId,
      activeAssignment: sanitizeAssignmentForStudent(active),
      assignment: sanitizeAssignmentForStudent(selected),
      assignments: (data.assignments || []).map(sanitizeAssignmentForStudent)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/lab/assignment?passkey=2525
// Save new generated assignment
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passkey = searchParams.get('passkey');

    if (passkey !== INSTRUCTOR_PASSKEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
    }

    const body = await req.json();
    const { assignment, publishNow } = body;

    if (!assignment || !assignment.title || !assignment.topic) {
      return NextResponse.json({ success: false, error: 'Missing required assignment fields.' }, { status: 400 });
    }

    const data = readAssignmentsData();
    const newId = assignment.id || `asgn-${Date.now()}`;
    const fullAssignment = {
      ...assignment,
      id: newId,
      createdAt: new Date().toISOString()
    };

    // Replace if exists, else append
    const existingIdx = data.assignments.findIndex((a: any) => a.id === newId);
    if (existingIdx >= 0) {
      data.assignments[existingIdx] = fullAssignment;
    } else {
      data.assignments.unshift(fullAssignment);
    }

    if (publishNow) {
      data.activeAssignmentId = newId;
    }

    writeAssignmentsData(data);

    return NextResponse.json({
      success: true,
      message: publishNow ? 'Assignment saved and published to Student Portal!' : 'Assignment saved to Library.',
      activeAssignmentId: data.activeAssignmentId,
      assignment: fullAssignment
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error creating assignment.' }, { status: 500 });
  }
}

// PATCH /api/lab/assignment?passkey=2525
// Switch active assignment
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passkey = searchParams.get('passkey');

    if (passkey !== INSTRUCTOR_PASSKEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
    }

    const body = await req.json();
    const { activeAssignmentId } = body;

    const data = readAssignmentsData();
    const found = data.assignments.find((a: any) => a.id === activeAssignmentId);

    if (!found) {
      return NextResponse.json({ success: false, error: 'Target assignment not found.' }, { status: 404 });
    }

    data.activeAssignmentId = activeAssignmentId;
    writeAssignmentsData(data);

    return NextResponse.json({
      success: true,
      message: `Active assignment switched to: ${found.title}`,
      activeAssignmentId: data.activeAssignmentId,
      activeAssignment: found
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error updating assignment.' }, { status: 500 });
  }
}

// DELETE /api/lab/assignment?passkey=2525&id=asgn-123
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passkey = searchParams.get('passkey');
    const id = searchParams.get('id');

    if (passkey !== INSTRUCTOR_PASSKEY) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Invalid instructor passkey.' }, { status: 401 });
    }

    if (!id || id === 'blr-pivot-operations') {
      return NextResponse.json({ success: false, error: 'Cannot delete default BLR Operations assignment.' }, { status: 400 });
    }

    const data = readAssignmentsData();
    data.assignments = data.assignments.filter((a: any) => a.id !== id);

    if (data.activeAssignmentId === id) {
      data.activeAssignmentId = 'blr-pivot-operations';
    }

    writeAssignmentsData(data);

    return NextResponse.json({
      success: true,
      message: 'Assignment removed from library.',
      activeAssignmentId: data.activeAssignmentId
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error deleting assignment.' }, { status: 500 });
  }
}
