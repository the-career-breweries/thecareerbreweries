import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'instructor-signature.jpg'),
    'C:/Users/S D SANDARSH/.gemini/antigravity/brain/8a3ab317-aa2c-4ed3-bf00-08ee13fb2a20/.user_uploaded/media_1793024820145_69c10f6f.jpg'
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const buffer = fs.readFileSync(p);

        // Also ensure it is cached in public directory for direct static serving
        try {
          const publicDir = path.join(process.cwd(), 'public');
          if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
          }
          const publicDest = path.join(publicDir, 'instructor-signature.jpg');
          if (!fs.existsSync(publicDest)) {
            fs.copyFileSync(p, publicDest);
          }
        } catch (copyErr) {
          // ignore
        }

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      }
    } catch (e) {
      // try next path
    }
  }

  return new NextResponse('Signature image not found', { status: 404 });
}
