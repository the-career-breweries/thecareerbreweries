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
  allFormulas?: string[];
  formulaTypes?: string[];
  resultAccuracy?: {
    percentage: number;
    status: string;
    dataSetupAccuracy: number;
    computationalAccuracy: number;
    analysisAccuracy: number;
  };
  aiToolsUsed?: {
    detected: boolean;
    toolNames: string[];
    reasons: string[];
  };
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
 * Performs deep forensic analysis on an uploaded .xlsx, .docx, or .pptx file
 */
export function analyzeXlsxBuffer(
  buffer: Buffer,
  originalFilename: string,
  extraHoneypots?: string[]
): ForensicResult {
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

  // 3. Analyze xl/workbook.xml for sheet names (or Word sections or PowerPoint slides)
  if (files['xl/workbook.xml']) {
    const wbXml = files['xl/workbook.xml'].toString('utf8');
    const sheetRegex = /<sheet[^>]+name="([^"]+)"/gi;
    let match: RegExpExecArray | null;
    while ((match = sheetRegex.exec(wbXml)) !== null) {
      sheetNames.push(match[1]);
    }
  } else if (files['word/document.xml']) {
    sheetNames.push('Document Body');
    if (Object.keys(files).some(k => k.startsWith('word/header'))) sheetNames.push('Header Sections');
    if (Object.keys(files).some(k => k.startsWith('word/footer'))) sheetNames.push('Footer Sections');
    if (Object.keys(files).some(k => k.includes('footnotes'))) sheetNames.push('Footnotes');
  } else if (files['ppt/presentation.xml']) {
    const slideKeys = Object.keys(files).filter(k => k.startsWith('ppt/slides/slide') && k.endsWith('.xml'));
    slideKeys.sort().forEach((k, idx) => {
      sheetNames.push(`Slide ${idx + 1}`);
    });
  }

  // 4. Analyze worksheets, word documents, or slides for formulas, text & honeypots
  for (const [name, content] of Object.entries(files)) {
    // Excel sheets
    if (name.startsWith('xl/worksheets/sheet') && name.endsWith('.xml')) {
      const xml = content.toString('utf8');
      allSheetXmlContent += ' ' + xml;

      const fRegex = /<f[^>]*>(.*?)<\/f>/gi;
      let fMatch: RegExpExecArray | null;
      while ((fMatch = fRegex.exec(xml)) !== null) {
        formulas.push(fMatch[1]);
      }
    }
    // Word document content
    else if (name.startsWith('word/') && name.endsWith('.xml')) {
      const xml = content.toString('utf8');
      allSheetXmlContent += ' ' + xml;
    }
    // PowerPoint slide content
    else if (name.startsWith('ppt/slides/') && name.endsWith('.xml')) {
      const xml = content.toString('utf8');
      allSheetXmlContent += ' ' + xml;
    }
  }

  // Check shared strings for text honeypots
  let sharedStrings = '';
  if (files['xl/sharedStrings.xml']) {
    sharedStrings = files['xl/sharedStrings.xml'].toString('utf8');
  }

  const combinedSearchText = (allSheetXmlContent + ' ' + sharedStrings).toUpperCase();

  // 5. Evaluate Traps
  // Trap 1: AI Code Interpreter / openpyxl / python generator (ChatGPT Code Interpreter, Claude Artifacts, DeepSeek Python sandbox)
  const isPythonAiScript =
    /openpyxl|python|xlsxwriter|pandas|python-docx|python-pptx|pandoc/i.test(application) ||
    /openpyxl|python|pandoc/i.test(creator) ||
    /openpyxl|python|pandoc/i.test(lastModifiedBy);

  const isOpenAiDirect =
    /openai/i.test(creator) ||
    /openai/i.test(lastModifiedBy) ||
    /openai/i.test(application);

  const isAiGenerator = isPythonAiScript || isOpenAiDirect;

  // Trap 2: Prompt Injection Honeypot keywords (LLM output copying)
  const isCustomHoneypot =
    extraHoneypots &&
    extraHoneypots.some(
      (token) => token && token.trim().length > 1 && combinedSearchText.includes(token.trim().toUpperCase())
    );

  const isHoneypotTriggered =
    combinedSearchText.includes('_OPS') ||
    combinedSearchText.includes('OP-AI') ||
    combinedSearchText.includes('AOCC-AI') ||
    combinedSearchText.includes('VERIFIED BY AOCC') ||
    combinedSearchText.includes('FLIGHT-DISPATCH-AI') ||
    combinedSearchText.includes('MANDATE-AI') ||
    Boolean(isCustomHoneypot);

  // Trap 3: Dataset Poison Pill / Trap Record
  const isTrapRecordFound =
    combinedSearchText.includes('FL-199') ||
    combinedSearchText.includes('SYSTEM_CALIBRATION_TEST') ||
    combinedSearchText.includes('SIMULATION_TEST');

  // Zero edit time flag (only if it's Office format without editing time logged)
  const isOfficeApp = application.toLowerCase().includes('excel') || application.toLowerCase().includes('word') || application.toLowerCase().includes('powerpoint') || application.toLowerCase().includes('libreoffice');
  const hasZeroEditTime = isOfficeApp && totalTimeMinutes === 0;

  // Sheet / Section presence check
  const isExcel = originalFilename.toLowerCase().endsWith('.xlsx') || !!files['xl/workbook.xml'];
  const requiredSheets = ['Raw_Data', 'Task1', 'Task2', 'Task3', 'Task4'];
  const missingSheetsCount = isExcel ? requiredSheets.filter((req) =>
    !sheetNames.some((s) => s.toLowerCase().includes(req.toLowerCase()))
  ).length : 0;
  const hasMissingSheets = isExcel && missingSheetsCount > 2;

  // Formula check (applicable to spreadsheets)
  const hasNoFormulas = isExcel && formulas.length === 0;

  // 6. Compute Findings & Integrity Level
  const summaryFindings: string[] = [];
  let integrityScore = 100;

  if (isOpenAiDirect) {
    summaryFindings.push('Direct ChatGPT / OpenAI signature detected in file metadata');
    integrityScore -= 50;
  } else if (isPythonAiScript) {
    summaryFindings.push('AI Code Interpreter (Python openpyxl) detected in file metadata');
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

  // Distinct formulas & formula types for student report card
  const uniqueFormulas = Array.from(new Set(formulas));
  const formulaTypesSet = new Set<string>();
  formulas.forEach((f) => {
    const fnMatch = f.match(/([A-Z_]+)\s*\(/i);
    if (fnMatch) formulaTypesSet.add(fnMatch[1].toUpperCase());
  });
  const formulaTypes = Array.from(formulaTypesSet);

  // Result accuracy calculation
  const dataSetupAccuracy = Math.round((dataSetup / 5) * 100);
  const computationalAccuracy = Math.round((tasks / 40) * 100);
  const analysisAccuracy = Math.round((analysis / 5) * 100);
  const accuracyPercentage = Math.round(((dataSetup + tasks + analysis) / 50) * 100);
  const accuracyStatus =
    accuracyPercentage >= 90 ? 'High Precision' : accuracyPercentage >= 75 ? 'Satisfactory' : 'Discrepancies Flagged';

  // AI Tools Used Detection
  const aiToolNames: string[] = [];
  const aiReasons: string[] = [];

  if (isOpenAiDirect) {
    aiToolNames.push('ChatGPT / OpenAI');
    aiReasons.push('Direct OpenAI generation signature recorded in document metadata');
  } else if (isPythonAiScript) {
    aiToolNames.push('ChatGPT / Claude Code Interpreter (openpyxl)');
    aiReasons.push('Synthetically built using Python openpyxl (standard backend for ChatGPT Code Interpreter & Claude Artifacts)');
  }

  if (isHoneypotTriggered) {
    aiToolNames.push('LLM Assistant (ChatGPT / Claude / Gemini / DeepSeek)');
    aiReasons.push('Invisible prompt-injection honeypot token detected inside workbook cells');
  }

  if (hasZeroEditTime && !isAiGenerator) {
    aiToolNames.push('Synthetic File Generator (0m Edit Time)');
    aiReasons.push('0 minutes active editing time recorded in file metadata');
  }

  const isAiDetected = isAiGenerator || isHoneypotTriggered || hasZeroEditTime;
  if (aiToolNames.length === 0) {
    aiToolNames.push('None Detected (Authentic Microsoft Office / Google Sheets)');
  }

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
    allFormulas: uniqueFormulas.slice(0, 25),
    formulaTypes,
    resultAccuracy: {
      percentage: accuracyPercentage,
      status: accuracyStatus,
      dataSetupAccuracy,
      computationalAccuracy,
      analysisAccuracy
    },
    aiToolsUsed: {
      detected: isAiDetected,
      toolNames: aiToolNames,
      reasons: aiReasons
    },
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
