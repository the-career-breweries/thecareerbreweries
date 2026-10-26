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
 * Supports institutional formats like:
 *   - 26-AVA-034_Syed_Hisham_Hamza_Pivot_Assignment.xlsx -> rollNo: "26-AVA-034", studentName: "Syed Hisham Hamza"
 *   - PROVASAVBSC726053_Man Patel_Pivot_Assignment.xlsx -> rollNo: "PROV-ASAV-BSC-7-26-053", studentName: "Man Patel"
 *   - PROV_ASAV_BSC_7_26_019_Evlin Rose Shoji_Aviation_Pivot_Lab.xlsx -> rollNo: "PROV-ASAV-BSC-7-26-019", studentName: "Evlin Rose Shoji"
 *   - PROV-ASAV-BSC-7-26-046_DanielJaisonJ_Pivot_Assignment.xlsx -> rollNo: "PROV-ASAV-BSC-7-26-046", studentName: "Daniel Jaison J"
 *   - 26AVA018_Daniel Ntonja_Pivot_Assignment_New.xlsx -> rollNo: "26-AVA-018", studentName: "Daniel Ntonja"
 *   - 26AVA044PrathameshChavan_Pivot_Assignment.xlsx -> rollNo: "26-AVA-044", studentName: "Prathamesh Chavan"
 *   - 26_AVA_007_HarmainSehar_Pivot_Assignment.xlsx -> rollNo: "26-AVA-007", studentName: "Harmain Sehar"
 *   - 11 SIRI SAMHITHA R_Pivot_Assignment.xlsx -> rollNo: "26-AVA-011", studentName: "Siri Samhitha R"
 *   - Baba thanveer -pivot-Assignment.xlsx -> rollNo: "STU-...", studentName: "Baba Thanveer"
 */
const STOP_WORDS = new Set([
  'assignment', 'assinment', 'assognment', 'pivotassignment',
  'pivot', 'pivottable', 'pivottables', 'lab', 'exercise',
  'flight', 'aviation', 'operations', 'submission', 'task',
  'report', 'word', 'powerpoint', 'excel', 'master', 'final',
  'draft', 'copy', 'tables', 'charts', 'summary', 'blr',
  'airport', 'sheet', 'work', 'new', 'pax', 'terminal',
  'otp', 'sec', 'seca', 'secb', 'secc', 'section', 'bsc', 'prov', 'asav',
  'ava', 'bba', 'student', 'stu', 'xlsx', 'docx', 'pptx'
]);

export function parseStudentDetailsFromFilename(fullPathOrName: string): { rollNo: string; studentName: string } {
  const base = path.basename(fullPathOrName);
  
  // 1. Clean file extensions and duplicate extensions / copy suffixes
  let raw = base
    .replace(/\s*\(\d+\)(?:\.xlsx)?$/gi, '')
    .replace(/\s*copy(?:\.xlsx)?$/gi, '')
    .replace(/[-_ ]\d(?:\.xlsx|\.docx|\.pptx|\.csv|\.pdf)+$/gi, '')
    .replace(/(\.xlsx|\.docx|\.pptx|\.csv|\.pdf)+$/gi, '')
    .trim();

  let rollNo = '';
  let rollMatchStr = '';

  // 2. Identify and extract Roll Number

  // Pattern A: PROV style (e.g. PROV_ASAV_BSC_7_26_019, PROV-ASAV-BSC-7-26-049, PROVASAVBSC726053, PROV_ASAV_726042, PROV-ASAV-BSC-016)
  const provMatch = raw.match(/(PROV[-_ ]?(?:ASAV[-_ ]?)?(?:BSC[-_ ]?)?(?:[0-9]+[-_ ]*)+)/i);
  if (provMatch) {
    rollMatchStr = provMatch[1];
    const digitsOnly = rollMatchStr.replace(/[^0-9]/g, '');
    
    // Check if the string already had clear delimiter separated parts
    const parts = rollMatchStr.split(/[-_ ]+/).filter(p => /^[0-9]+$/.test(p));
    if (parts.length === 3) {
      if (parts[0] === '26' && parts[1] === '7') {
        rollNo = `PROV-ASAV-BSC-7-26-${parts[2].padStart(3, '0')}`;
      } else if (parts[0] === '7' && parts[1] === '26') {
        rollNo = `PROV-ASAV-BSC-7-26-${parts[2].padStart(3, '0')}`;
      } else {
        rollNo = `PROV-ASAV-BSC-${parts[0]}-${parts[1]}-${parts[2].padStart(3, '0')}`;
      }
    } else if (parts.length === 2) {
      rollNo = `PROV-ASAV-BSC-7-${parts[0]}-${parts[1].padStart(3, '0')}`;
    } else if (parts.length === 1 && parts[0].length >= 5) {
      const d = parts[0];
      const last3 = d.slice(-3);
      const batch = d.slice(-5, -3);
      const sec = d.slice(0, -5) || '7';
      rollNo = `PROV-ASAV-BSC-${sec}-${batch}-${last3}`;
    } else if (parts.length === 1 && parts[0].length === 3) {
      rollNo = `PROV-ASAV-BSC-7-26-${parts[0]}`;
    } else if (digitsOnly.length >= 5) {
      const last3 = digitsOnly.slice(-3);
      const batch = digitsOnly.slice(-5, -3);
      const sec = digitsOnly.slice(0, -5) || '7';
      rollNo = `PROV-ASAV-BSC-${sec}-${batch}-${last3}`;
    } else {
      rollNo = rollMatchStr.replace(/[_ ]/g, '-').replace(/-+$/, '').toUpperCase();
    }
  }

  // Pattern B: 26AVA043, 26-AVA-034, 26_AVA_007, 26AVA36, 26AVA044PrathameshChavan
  if (!rollNo) {
    const avaMatch = raw.match(/(?:^|[^A-Za-z0-9])([0-9]{2})[-_ ]?([A-Za-z]{3})[-_ ]?([0-9]{1,4})(?=[^0-9]|$)/i);
    if (avaMatch) {
      rollMatchStr = avaMatch[0].trim();
      const prefixYear = avaMatch[1];
      const dept = avaMatch[2].toUpperCase();
      const numPart = avaMatch[3].padStart(3, '0');
      rollNo = `${prefixYear}-${dept}-${numPart}`;
    }
  }

  // Pattern C: Leading sequence number (e.g. 010_DhyaanaVasudevan, 11 SIRI SAMHITHA R, 28_ShubhankarBhowmick)
  if (!rollNo) {
    const leadNumMatch = raw.match(/^([0-9]{1,3})[-_ ]+/);
    if (leadNumMatch) {
      rollMatchStr = leadNumMatch[0];
      rollNo = `26-AVA-${leadNumMatch[1].padStart(3, '0')}`;
    }
  }

  // 3. Remove detected roll string from candidate string
  let nameStr = raw;
  if (rollMatchStr) {
    nameStr = nameStr.replace(rollMatchStr, ' ');
  }

  // Also strip any residual PROVASAVBSC code or isolated PROV/ASAV/BSC tokens
  nameStr = nameStr.replace(/PROV[-_ ]?ASAV[-_ ]?BSC(?:[-_ ]?[0-9]+)*/gi, ' ');
  nameStr = nameStr.replace(/26[-_ ]?AVA[-_ ]?[0-9]*/gi, ' ');

  // 4. Normalize separators (underscores, hyphens, dots, parentheses) to spaces BEFORE keyword parsing!
  nameStr = nameStr.replace(/[-_./()+]/g, ' ');

  // 5. Expand CamelCase / PascalCase names (e.g. "DanielJaisonJ" -> "Daniel Jaison J", "AbdulazeezWajid" -> "Abdulazeez Wajid", "SecA" -> "Sec A")
  nameStr = nameStr
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  // Strip section descriptors like "Sec A", "Section A", "Sec 1" etc. now that spaces exist!
  nameStr = nameStr.replace(/\b(?:Sec|Section)\s+[A-Za-z0-9]\b/gi, ' ');

  // Specific name corrections for concatenated lowercase names
  nameStr = nameStr.replace(/\bnidhipatel\b/gi, 'Nidhi Patel');

  // 6. Tokenize words, filtering out any stop words
  const rawWords = nameStr.split(/\s+/).filter(Boolean);
  const filteredWords: string[] = [];

  for (let i = 0; i < rawWords.length; i++) {
    const w = rawWords[i];
    const lower = w.toLowerCase();
    
    // Check if it's a stop word
    if (STOP_WORDS.has(lower)) {
      continue;
    }
    
    // Ignore pure digits or isolated non-alpha junk
    if (!/[A-Za-z]/.test(w)) {
      continue;
    }

    filteredWords.push(w);
  }

  // 7. Format into proper Title Case
  let studentName = filteredWords
    .map(w => {
      // Single letter initials stay uppercase (e.g. "J", "M", "P", "N", "R", "S")
      if (w.length === 1) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();

  // Fallback for roll number if unparseable
  if (!rollNo) {
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    rollNo = `STU-${Math.abs(hash % 90000 + 10000)}`;
  }

  // Fallback for student name if unparseable
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
  maxMarks: number;
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
  assignment: AssignmentTemplate,
  customMaxMarks?: number
): BatchEvaluationSummary {
  const extractedFiles = unzipArchive(zipBuffer);
  const targetMaxMarks = customMaxMarks && customMaxMarks > 0 ? customMaxMarks : (assignment.totalMarks || 50);

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

    // Scale autoGrade to targetMaxMarks
    const rawTotal50 = forensics.autoGradeEstimate.total;
    const scaledScore = Number(((rawTotal50 / 50) * targetMaxMarks).toFixed(1));
    const scorePercentage = Math.round((scaledScore / targetMaxMarks) * 100);

    let gradeBand = 'O';
    if (scorePercentage < 40) gradeBand = 'F';
    else if (scorePercentage < 55) gradeBand = 'C';
    else if (scorePercentage < 70) gradeBand = 'B';
    else if (scorePercentage < 85) gradeBand = 'A';
    else if (scorePercentage < 95) gradeBand = 'A+';

    // Scale component breakdowns
    const scaledDataSetup = Number(((forensics.autoGradeEstimate.dataSetup / 5) * (targetMaxMarks * 0.1)).toFixed(1));
    const scaledTasks = Number(((forensics.autoGradeEstimate.tasks / 40) * (targetMaxMarks * 0.8)).toFixed(1));
    const scaledAnalysis = Number(((forensics.autoGradeEstimate.analysis / 5) * (targetMaxMarks * 0.1)).toFixed(1));

    forensics.autoGradeEstimate = {
      dataSetup: scaledDataSetup,
      tasks: scaledTasks,
      analysis: scaledAnalysis,
      total: scaledScore
    };

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
        finalScore: scaledScore,
        maxMarks: targetMaxMarks,
        percentage: scorePercentage,
        gradeBand,
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
    maxMarks: targetMaxMarks,
    assignmentTitle: assignment.title,
    assignmentId: assignment.id,
    evaluatedAt: new Date().toISOString(),
    results
  };
}
