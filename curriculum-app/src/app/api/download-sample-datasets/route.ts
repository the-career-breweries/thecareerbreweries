import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Pre-computed CRC32 table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c >>> 0;
}

function calculateCRC32(buf: Buffer): number {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ ~0) >>> 0;
}

interface ZipEntry {
  filename: string;
  data: Buffer;
}

function createZipBuffer(entries: ZipEntry[]): Buffer {
  const localHeadersAndData: Buffer[] = [];
  const centralDirHeaders: Buffer[] = [];
  let currentOffset = 0;

  // DOS timestamp for 2026-10-23 10:00:00
  const dosTime = 0x5000;
  const dosDate = 0x5d4b;

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.filename, 'utf8');
    const uncompressedData = entry.data;
    const crc = calculateCRC32(uncompressedData);
    const compressedData = zlib.deflateRawSync(uncompressedData);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed (2.0)
    localHeader.writeUInt16LE(0, 6);          // General purpose bit flag
    localHeader.writeUInt16LE(8, 8);          // Compression method: Deflate
    localHeader.writeUInt16LE(dosTime, 10);   // File time
    localHeader.writeUInt16LE(dosDate, 12);   // File date
    localHeader.writeUInt32LE(crc, 14);       // CRC32
    localHeader.writeUInt32LE(compressedData.length, 18);   // Compressed size
    localHeader.writeUInt32LE(uncompressedData.length, 22); // Uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26);      // Filename length
    localHeader.writeUInt16LE(0, 28);                       // Extra field length

    const fileBlock = Buffer.concat([localHeader, filenameBuf, compressedData]);
    localHeadersAndData.push(fileBlock);

    // Central Directory Header
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0);   // Central directory signature
    cdHeader.writeUInt16LE(20, 4);           // Version made by
    cdHeader.writeUInt16LE(20, 6);           // Version needed
    cdHeader.writeUInt16LE(0, 8);            // Flags
    cdHeader.writeUInt16LE(8, 10);           // Deflate
    cdHeader.writeUInt16LE(dosTime, 12);     // Time
    cdHeader.writeUInt16LE(dosDate, 14);     // Date
    cdHeader.writeUInt32LE(crc, 16);         // CRC32
    cdHeader.writeUInt32LE(compressedData.length, 20);   // Compressed size
    cdHeader.writeUInt32LE(uncompressedData.length, 24); // Uncompressed size
    cdHeader.writeUInt16LE(filenameBuf.length, 28);      // Filename length
    cdHeader.writeUInt16LE(0, 30);                       // Extra length
    cdHeader.writeUInt16LE(0, 32);                       // Comment length
    cdHeader.writeUInt16LE(0, 34);                       // Disk start
    cdHeader.writeUInt16LE(0, 36);                       // Internal attrs
    cdHeader.writeUInt32LE(0x81a40000, 38);               // External attrs (standard file)
    cdHeader.writeUInt32LE(currentOffset, 42);           // Relative offset of local header

    centralDirHeaders.push(Buffer.concat([cdHeader, filenameBuf]));
    currentOffset += fileBlock.length;
  }

  const centralDirOffset = currentOffset;
  const centralDirBuffer = Buffer.concat(centralDirHeaders);
  const centralDirSize = centralDirBuffer.length;

  // End of Central Directory Record (EOCD)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);                  // EOCD signature
  eocd.writeUInt16LE(0, 4);                           // Disk number
  eocd.writeUInt16LE(0, 6);                           // Start disk
  eocd.writeUInt16LE(entries.length, 8);               // Entries on this disk
  eocd.writeUInt16LE(entries.length, 10);              // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);              // Central directory size
  eocd.writeUInt32LE(centralDirOffset, 16);            // Central directory offset
  eocd.writeUInt16LE(0, 20);                          // Comment length

  return Buffer.concat([...localHeadersAndData, centralDirBuffer, eocd]);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileParam = searchParams.get('file');

  const sampleDataDir = path.join(process.cwd(), 'public', 'sample-data');

  const filesToInclude = [
    '01_Aviation_Essential_Functions_Dataset.csv',
    '02_Aviation_Logical_IF_Nested_IF_Dataset.csv',
    '03_Aviation_VLOOKUP_HLOOKUP_Tariffs.csv',
    '04_Aviation_XLOOKUP_Crew_Snag_Master.csv',
    '05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv',
    'README_Trainer_Demonstration_Instructions.txt'
  ];

  // If specific file requested, serve directly
  if (fileParam) {
    const matchedFile = filesToInclude.find(f => 
      f.toLowerCase().includes(fileParam.toLowerCase()) || 
      f.startsWith(fileParam.padStart(2, '0'))
    );

    if (matchedFile) {
      const filePath = path.join(sampleDataDir, matchedFile);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          headers: {
            'Content-Type': matchedFile.endsWith('.csv') ? 'text/csv; charset=utf-8' : 'text/plain; charset=utf-8',
            'Content-Disposition': `attachment; filename="${matchedFile}"`
          }
        });
      }
    }
  }

  // Default: Return complete ZIP package
  const entries: ZipEntry[] = [];
  for (const filename of filesToInclude) {
    const filePath = path.join(sampleDataDir, filename);
    if (fs.existsSync(filePath)) {
      entries.push({
        filename,
        data: fs.readFileSync(filePath)
      });
    }
  }

  if (entries.length === 0) {
    return NextResponse.json({ error: 'Sample files not found on disk' }, { status: 404 });
  }

  const zipBuffer = createZipBuffer(entries);

  // Cache zip on disk in public/sample-data so static downloads also work immediately
  try {
    const staticZipPath = path.join(sampleDataDir, 'Aviation_ICS_Student_Practice_Datasets_Batch2026.zip');
    fs.writeFileSync(staticZipPath, zipBuffer);
  } catch (err) {
    console.error('Failed to cache zip on disk:', err);
  }

  return new NextResponse(new Uint8Array(zipBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="Aviation_ICS_Student_Practice_Datasets_Batch2026.zip"',
      'Content-Length': zipBuffer.length.toString(),
      'Cache-Control': 'no-cache'
    }
  });
}
