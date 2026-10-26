import path from 'path';
import zlib from 'zlib';
import { analyzeXlsxBuffer, ForensicResult } from './xlsx-forensics';
import { AssignmentTemplate } from './assignment-generator';

export interface UnzippedFile {
  path: string;
  name: string;
  buffer: Buffer;
}

/**
 * Pure Node.js Central Directory ZIP decompressor.
 * Extracts all files inside any standard ZIP archive, including nested directories.
 */
export function unzipArchive(buffer: Buffer): UnzippedFile[] {
  const result: UnzippedFile[] = [];

  // Locate End of Central Directory Record (EOCD signature: 0x06054b50)
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid or corrupted ZIP archive (EOCD signature not found). Please upload a valid .zip file.');
  }

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

  let currentOffset = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (buffer.readUInt32LE(currentOffset) !== 0x02014b50) {
      break;
    }

    const compressionMethod = buffer.readUInt16LE(currentOffset + 10);
    const compressedSize = buffer.readUInt32LE(currentOffset + 20);
    const uncompressedSize = buffer.readUInt32LE(currentOffset + 24);
    const filenameLen = buffer.readUInt16LE(currentOffset + 28);
    const extraLen = buffer.readUInt16LE(currentOffset + 30);
    const commentLen = buffer.readUInt16LE(currentOffset + 32);
    const localHeaderOffset = buffer.readUInt32LE(currentOffset + 42);

    const fullPath = buffer.toString('utf8', currentOffset + 46, currentOffset + 46 + filenameLen);
    currentOffset += 46 + filenameLen + extraLen + commentLen;

    // Filter out directories and OS metadata junk
    const normalizedPath = fullPath.replace(/\\/g, '/');
    if (
      normalizedPath.endsWith('/') ||
      normalizedPath.includes('__MACOSX') ||
      normalizedPath.includes('.DS_Store') ||
      normalizedPath.includes('Thumbs.db')
    ) {
      continue;
    }

    // Read local header
    if (buffer.readUInt32LE(localHeaderOffset) === 0x04034b50) {
      const localFilenameLen = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLen = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataStart = localHeaderOffset + 30 + localFilenameLen + localExtraLen;
      const compressedData = buffer.subarray(dataStart, dataStart + compressedSize);

      try {
        let uncompressedData: Buffer;
        if (compressionMethod === 8) {
          uncompressedData = zlib.inflateRawSync(compressedData);
        } else if (compressionMethod === 0) {
          uncompressedData = compressedData;
        } else {
          continue;
        }

        const name = path.basename(normalizedPath);
        result.push({
          path: normalizedPath,
          name,
          buffer: uncompressedData
        });
      } catch (err) {
        // Skip corrupted or unsupported inner entry
      }
    }
  }

  return result;
}

/**
 * Robust extractor for Student Roll Number and Name from arbitrary filenames
 * e.g. 26AVA101_RahulSharma_Pivot_Assignment.xlsx -> { rollNo: "26AVA101", studentName: "Rahul Sharma" }
 * e.g. Rahul Sharma - 26AVA101.xlsx -> { rollNo: "26AVA101", studentName: "Rahul Sharma" }
 */
export function parseStudentDetailsFromFilename(fullPathOrName: string): { rollNo: string; studentName: string } {
  const base = path.basename(fullPathOrName);
  const nameWithoutExt = base.replace(/\.[^/.]+$/, '');

  // 1. Identify Roll Number patterns
  const rollRegexes = [
    /\b([0-9]{2}[A-Za-z]{2,5}[0-9]{2,4}[A-Za-z]?)\b/i, // 26AVA101, 26AV101, 22BBA045
    /\b([A-Za-z]{2,5}[0-9]{3,5})\b/i,                  // AVA101, AV2026
    /\b([0-9]{6,10})\b/                                // Numeric ID
  ];

  let rollNo = '';
  for (const regex of rollRegexes) {
    const match = nameWithoutExt.match(regex);
    if (match) {
      rollNo = match[1].toUpperCase();
      break;
    }
  }

  // 2. Extract and clean Student Name
  let cleaned = nameWithoutExt;
  if (rollNo) {
    cleaned = cleaned.replace(new RegExp(rollNo, 'i'), '');
  }

  // Common stop words to strip from filename
  const stopWords = new Set([
    'assignment', 'lab', 'exercise', 'pivot', 'flight', 'aviation',
    'submission', 'task', 'report', 'word', 'powerpoint', 'excel',
    'master', 'final', 'draft', 'copy', 'tables', 'charts', 'blr',
    'airport', 'assignsubmission', 'file', 'student', 'data', 'xlsx',
    'docx', 'pptx', 'sheet', 'work'
  ]);

  cleaned = cleaned.replace(/[_\-()[\]0-9]+/g, ' ').trim();
  const words = cleaned
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.has(w.toLowerCase()));

  let studentName = words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .trim();

  // Deterministic fallback for Roll No if unparseable
  if (!rollNo) {
    let hash = 0;
    for (let i = 0; i < nameWithoutExt.length; i++) {
      hash = ((hash << 5) - hash) + nameWithoutExt.charCodeAt(i);
      hash |= 0;
    }
    rollNo = `STU-${Math.abs(hash % 90000 + 10000)}`;
  }

  // Fallback for Student Name if unparseable
  if (!studentName || studentName.length < 2) {
    studentName = `Student ${rollNo}`;
  }

  return { rollNo, studentName };
}

export interface BatchEvaluationSummary {
  totalFilesParsed: number;
  evaluatedCount: number;
  skippedCount: number;
  cleanCount: number;
  flaggedCount: number;
  highRiskCount: number;
  averageScore: number;
  assignmentTitle: string;
  assignmentId: string;
  evaluatedAt: string;
  results: any[];
}

/**
 * Processes an uploaded ZIP archive containing student submission files,
 * executes deep forensic & AI detection checks for each file, and computes grades.
 */
export function evaluateBatchSubmissions(
  zipBuffer: Buffer,
  assignment: AssignmentTemplate
): BatchEvaluationSummary {
  const extractedFiles = unzipArchive(zipBuffer);

  // Filter valid candidate office assignment files (.xlsx, .docx, .pptx)
  const validExtensions = ['.xlsx', '.docx', '.pptx', '.csv'];
  const assignmentFiles = extractedFiles.filter(f => {
    const ext = path.extname(f.name).toLowerCase();
    return validExtensions.includes(ext);
  });

  const results: any[] = [];
  const honeypots: string[] = [];
  if (assignment.honeypotInstruction) {
    const matches = assignment.honeypotInstruction.match(/['"]([A-Za-z0-9_\-]+)['"]/g) || [];
    matches.forEach(m => honeypots.push(m.replace(/['"]/g, '')));
  }

  for (const file of assignmentFiles) {
    const { rollNo, studentName } = parseStudentDetailsFromFilename(file.name);

    let forensics: ForensicResult;
    try {
      forensics = analyzeXlsxBuffer(file.buffer, file.name, honeypots);
    } catch (err: any) {
      forensics = {
        filename: file.name,
        fileSize: file.buffer.length,
        application: 'Corrupted / Unparseable',
        appVersion: '',
        totalTimeMinutes: 0,
        creator: 'Unknown',
        lastModifiedBy: 'Unknown',
        createdDate: '',
        modifiedDate: '',
        sheetNames: [],
        totalFormulasFound: 0,
        sampleFormulas: [],
        flags: {
          isAiGenerator: false,
          isHoneypotTriggered: false,
          isTrapRecordFound: false,
          hasZeroEditTime: true,
          hasMissingSheets: true,
          hasNoFormulas: true
        },
        integrityScore: 35,
        integrityLevel: 'high_risk',
        summaryFindings: [`Could not parse office file structure: ${err.message}`],
        autoGradeEstimate: {
          dataSetup: 0,
          tasks: 10,
          analysis: 0,
          total: 10
        }
      };
    }

    // Check if uploaded file format matched expected assignment fileType
    const expectedExt = `.${assignment.fileType || 'xlsx'}`;
    const fileExt = path.extname(file.name).toLowerCase();
    if (fileExt !== expectedExt) {
      forensics.summaryFindings.push(
        `File format discrepancy: Submitted as ${fileExt.toUpperCase()} but expected ${expectedExt.toUpperCase()}`
      );
      forensics.integrityScore = Math.max(0, forensics.integrityScore - 10);
    }

    const submissionId = `SUB-${rollNo}-${Date.now().toString().slice(-6)}`;
    const score = forensics.autoGradeEstimate.total;

    results.push({
      id: submissionId,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      rollNo,
      studentName,
      submittedAt: new Date().toISOString(),
      originalFilename: file.name,
      fileSize: file.buffer.length,
      viva: {
        q1Answer: 'Batch ZIP Submission',
        q2Answer: 'Batch ZIP Submission',
        isCorrect: true,
        secondsTaken: 0
      },
      forensics,
      evaluation: {
        finalScore: score,
        instructorOverride: false,
        instructorRemarks: forensics.summaryFindings.join('; '),
        evaluatedAt: new Date().toISOString()
      },
      batchEvaluated: true
    });
  }

  const cleanCount = results.filter(r => r.forensics.integrityLevel === 'clean').length;
  const flaggedCount = results.filter(r => r.forensics.integrityLevel !== 'clean').length;
  const highRiskCount = results.filter(r => r.forensics.integrityLevel === 'high_risk').length;
  const averageScore = results.length > 0
    ? Number((results.reduce((acc, r) => acc + r.evaluation.finalScore, 0) / results.length).toFixed(1))
    : 0;

  return {
    totalFilesParsed: extractedFiles.length,
    evaluatedCount: results.length,
    skippedCount: extractedFiles.length - results.length,
    cleanCount,
    flaggedCount,
    highRiskCount,
    averageScore,
    assignmentTitle: assignment.title,
    assignmentId: assignment.id,
    evaluatedAt: new Date().toISOString(),
    results
  };
}
