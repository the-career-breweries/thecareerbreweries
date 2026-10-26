import zlib from 'zlib';

export interface ForensicResult {
  filename: string;
  fileSize: number;
  application: string;
  appVersion: string;
  totalTimeMinutes: number;
  creator: string;
  lastModifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  sheetNames: string[];
  totalFormulasFound: number;
  sampleFormulas: string[];
  flags: {
    isAiGenerator: boolean;
    isHoneypotTriggered: boolean;
    isTrapRecordFound: boolean;
    hasZeroEditTime: boolean;
    hasMissingSheets: boolean;
    hasNoFormulas: boolean;
  };
  integrityScore: number; // 0 to 100
  integrityLevel: 'clean' | 'suspicious' | 'high_risk';
  summaryFindings: string[];
  autoGradeEstimate: {
    dataSetup: number; // out of 5
    tasks: number;     // out of 40
    analysis: number;  // out of 5
    total: number;     // out of 50
  };
}

/**
 * Extracts a map of filenames to Buffer from a ZIP/XLSX buffer using Central Directory
 */
export function extractXlsxFiles(buffer: Buffer): Record<string, Buffer> {
  const files: Record<string, Buffer> = {};

  // Find End of Central Directory Record (EOCD signature: 0x06054b50)
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid or corrupted .xlsx archive (EOCD not found).');
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

    const filename = buffer.toString('utf8', currentOffset + 46, currentOffset + 46 + filenameLen);
    currentOffset += 46 + filenameLen + extraLen + commentLen;

    // Read local header to locate data
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
        files[filename] = uncompressedData;
      } catch (err) {
        // Skip corrupted inner entry if any
      }
    }
  }

  return files;
}

/**
 * Performs deep forensic analysis on an uploaded .xlsx file
 */
export function analyzeXlsxBuffer(buffer: Buffer, originalFilename: string): ForensicResult {
  const files = extractXlsxFiles(buffer);

  let application = 'Unknown';
  let appVersion = '';
  let totalTimeMinutes = 0;
  let creator = 'Unknown';
  let lastModifiedBy = 'Unknown';
  let createdDate = '';
  let modifiedDate = '';
  const sheetNames: string[] = [];
  const formulas: string[] = [];
  let allSheetXmlContent = '';

  // 1. Analyze docProps/app.xml
  if (files['docProps/app.xml']) {
    const appXml = files['docProps/app.xml'].toString('utf8');
    const appMatch = appXml.match(/<Application>(.*?)<\/Application>/i);
    if (appMatch) application = appMatch[1];

    const verMatch = appXml.match(/<AppVersion>(.*?)<\/AppVersion>/i);
    if (verMatch) appVersion = verMatch[1];

    const timeMatch = appXml.match(/<TotalTime>(.*?)<\/TotalTime>/i);
    if (timeMatch) totalTimeMinutes = parseInt(timeMatch[1], 10) || 0;
  }

  // 2. Analyze docProps/core.xml
  if (files['docProps/core.xml']) {
    const coreXml = files['docProps/core.xml'].toString('utf8');
    const creatorMatch = coreXml.match(/<dc:creator[^>]*>(.*?)<\/dc:creator>/i);
    if (creatorMatch) creator = creatorMatch[1];

    const modByMatch = coreXml.match(/<cp:lastModifiedBy[^>]*>(.*?)<\/cp:lastModifiedBy>/i);
    if (modByMatch) lastModifiedBy = modByMatch[1];

    const createdMatch = coreXml.match(/<dcterms:created[^>]*>(.*?)<\/dcterms:created>/i);
    if (createdMatch) createdDate = createdMatch[1];

    const modifiedMatch = coreXml.match(/<dcterms:modified[^>]*>(.*?)<\/dcterms:modified>/i);
    if (modifiedMatch) modifiedDate = modifiedMatch[1];
  }

  // 3. Analyze xl/workbook.xml for sheet names
  if (files['xl/workbook.xml']) {
    const wbXml = files['xl/workbook.xml'].toString('utf8');
    const sheetRegex = /<sheet[^>]+name="([^"]+)"/gi;
    let match: RegExpExecArray | null;
    while ((match = sheetRegex.exec(wbXml)) !== null) {
      sheetNames.push(match[1]);
    }
  }

  // 4. Analyze worksheets for formulas & honeypots
  for (const [name, content] of Object.entries(files)) {
    if (name.startsWith('xl/worksheets/sheet') && name.endsWith('.xml')) {
      const xml = content.toString('utf8');
      allSheetXmlContent += ' ' + xml;

      const fRegex = /<f[^>]*>(.*?)<\/f>/gi;
      let fMatch: RegExpExecArray | null;
      while ((fMatch = fRegex.exec(xml)) !== null) {
        formulas.push(fMatch[1]);
      }
    }
  }

  // Check shared strings for text honeypots
  let sharedStrings = '';
  if (files['xl/sharedStrings.xml']) {
    sharedStrings = files['xl/sharedStrings.xml'].toString('utf8');
  }

  const combinedSearchText = (allSheetXmlContent + ' ' + sharedStrings).toUpperCase();

  // 5. Evaluate Traps
  // Trap 1: AI Code Interpreter / openpyxl / python generator
  const isAiGenerator =
    /openpyxl|python|xlsxwriter|pandas/i.test(application) ||
    /openpyxl|python/i.test(creator) ||
    /openpyxl|python/i.test(lastModifiedBy);

  // Trap 2: Prompt Injection Honeypot keywords
  const isHoneypotTriggered =
    combinedSearchText.includes('_OPS') ||
    combinedSearchText.includes('OP-AI') ||
    combinedSearchText.includes('AOCC-AI') ||
    combinedSearchText.includes('VERIFIED BY AOCC');

  // Trap 3: Dataset Poison Pill / Trap Record
  const isTrapRecordFound =
    combinedSearchText.includes('FL-199') ||
    combinedSearchText.includes('SYSTEM_CALIBRATION_TEST') ||
    combinedSearchText.includes('SIMULATION_TEST');

  // Zero edit time flag (only if it's Excel format without editing time logged)
  const hasZeroEditTime =
    application.toLowerCase().includes('excel') && totalTimeMinutes === 0;

  // Sheet presence check
  const requiredSheets = ['Raw_Data', 'Task1', 'Task2', 'Task3', 'Task4'];
  const missingSheetsCount = requiredSheets.filter((req) =>
    !sheetNames.some((s) => s.toLowerCase().includes(req.toLowerCase()))
  ).length;
  const hasMissingSheets = missingSheetsCount > 2;

  // Formula check
  const hasNoFormulas = formulas.length === 0;

  // 6. Compute Findings & Integrity Level
  const summaryFindings: string[] = [];
  let integrityScore = 100;

  if (isAiGenerator) {
    summaryFindings.push(`AI code generator detected in file metadata (Application: ${application})`);
    integrityScore -= 50;
  }

  if (isHoneypotTriggered) {
    summaryFindings.push('Invisible prompt injection honeypot token detected inside workbook cells');
    integrityScore -= 40;
  }

  if (isTrapRecordFound) {
    summaryFindings.push('Trap calibration record (FL-199) was left unfiltered in analysis');
    integrityScore -= 20;
  }

  if (hasZeroEditTime) {
    summaryFindings.push('File metadata registers 0 minutes total editing time (instant generation)');
    integrityScore -= 15;
  }

  if (hasNoFormulas) {
    summaryFindings.push('No formula tags (<f>) detected in worksheets; values may be hardcoded');
    integrityScore -= 20;
  }

  if (summaryFindings.length === 0) {
    summaryFindings.push('Authentic authoring signature confirmed via Microsoft Excel / Google Sheets');
  }

  let integrityLevel: 'clean' | 'suspicious' | 'high_risk' = 'clean';
  if (integrityScore < 60) {
    integrityLevel = 'high_risk';
  } else if (integrityScore < 85) {
    integrityLevel = 'suspicious';
  }

  // 7. Auto Grade Calculation
  let dataSetup = 5;
  if (!sheetNames.some((s) => s.toLowerCase().includes('raw'))) dataSetup -= 2;
  if (hasMissingSheets) dataSetup -= 1;

  let tasks = 36;
  if (formulas.length >= 4) tasks = 40;
  else if (formulas.length >= 2) tasks = 32;
  else if (hasNoFormulas) tasks = 24;

  let analysis = 5;
  if (isTrapRecordFound) analysis -= 2;

  const total = Math.max(0, Math.min(50, dataSetup + tasks + analysis));

  return {
    filename: originalFilename,
    fileSize: buffer.length,
    application,
    appVersion,
    totalTimeMinutes,
    creator,
    lastModifiedBy,
    createdDate,
    modifiedDate,
    sheetNames,
    totalFormulasFound: formulas.length,
    sampleFormulas: formulas.slice(0, 5),
    flags: {
      isAiGenerator,
      isHoneypotTriggered,
      isTrapRecordFound,
      hasZeroEditTime,
      hasMissingSheets,
      hasNoFormulas
    },
    integrityScore: Math.max(0, integrityScore),
    integrityLevel,
    summaryFindings,
    autoGradeEstimate: {
      dataSetup,
      tasks,
      analysis,
      total
    }
  };
}
