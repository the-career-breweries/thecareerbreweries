import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ASSIGNMENTS_FILE = path.join(process.cwd(), 'src', 'data', 'lab-assignments.json');

function getAssignment(id?: string | null) {
  try {
    if (!fs.existsSync(ASSIGNMENTS_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(ASSIGNMENTS_FILE, 'utf-8'));
    if (id) {
      const found = (data.assignments || []).find((a: any) => a.id === id);
      if (found) return found;
    }
    const activeId = data.activeAssignmentId;
    return (data.assignments || []).find((a: any) => a.id === activeId) || data.assignments?.[0] || null;
  } catch (err) {
    console.error('Error fetching assignment for raw data:', err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const assignment = getAssignment(id);

    // 1. If assignment has a designated local CSV file that exists, stream it
    if (assignment?.sampleDatasetFilename) {
      const filePath = path.join(process.cwd(), 'public', 'sample-data', assignment.sampleDatasetFilename);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="${assignment.sampleDatasetFilename}"`
          }
        });
      }
    }

    // Default BLR dataset fallback if available
    const defaultFile = path.join(process.cwd(), 'public', 'sample-data', '05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv');
    if ((!assignment || assignment.id === 'blr-pivot-operations') && fs.existsSync(defaultFile)) {
      const fileBuffer = fs.readFileSync(defaultFile);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv"'
        }
      });
    }

    // 2. Dynamically synthesize realistic aviation dataset for generated assignment
    const attributes = assignment?.role?.attributes || [
      { col: 'Record_ID', desc: 'Unique Identifier' },
      { col: 'Carrier_Or_Unit', desc: 'Operating Entity' },
      { col: 'Station_Sector', desc: 'Route Sector' },
      { col: 'Capacity_Limit', desc: 'Planned Capacity' },
      { col: 'Actual_Utilized', desc: 'Actual Volume' },
      { col: 'Operating_Cost', desc: 'Operating Cost' },
      { col: 'Status_Flag', desc: 'Compliance Status' },
      { col: 'Variance_Minutes', desc: 'Variance' }
    ];

    const headers = attributes.map((a: any) => a.col).join(',');
    const carriers = ['IndiGo', 'Air India', 'Akasa Air', 'Vistara', 'SpiceJet', 'Air India Express'];
    const sectors = ['BLR-DEL', 'BLR-BOM', 'BLR-HYD', 'BLR-CCU', 'BLR-MAA', 'BLR-COK', 'BLR-GOI', 'BLR-DXB', 'BLR-SIN', 'BLR-LHR'];
    const statuses = ['On-Schedule', 'On-Schedule', 'On-Schedule', 'Delayed', 'Delayed', 'Disrupted'];

    const rows: string[] = [];
    rows.push(headers);

    for (let i = 1; i <= 50; i++) {
      const recId = `REC-${100 + i}`;
      const carrier = carriers[(i * 3 + 1) % carriers.length];
      const sector = sectors[(i * 2) % sectors.length];
      const capacity = 150 + ((i * 13) % 150);
      const utilized = Math.round(capacity * (0.75 + ((i % 25) / 100)));
      const cost = Math.round(capacity * 3200 + ((i * 1700) % 20000));
      const status = statuses[i % statuses.length];
      const variance = status === 'On-Schedule' ? 0 : 15 + ((i * 7) % 65);

      rows.push(`${recId},${carrier},${sector},${capacity},${utilized},${cost},${status},${variance}`);
    }

    // Include standard calibration record (Trap 3)
    rows.push('FL-199,SYSTEM_CALIBRATION_TEST,BLR-TEST,100,100,10000,Calibration,0');

    const csvContent = rows.join('\n');
    const safeName = (assignment?.title || 'Assignment').replace(/[^a-zA-Z0-9_-]/g, '_');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}_Raw_Data.csv"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate raw data' }, { status: 500 });
  }
}
