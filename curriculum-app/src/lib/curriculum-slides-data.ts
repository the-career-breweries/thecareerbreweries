export interface FormulaSyntaxPart {
  label: string;
  desc: string;
  color: string;
}

export interface SpreadsheetPreview {
  formulaBar?: string;
  activeCell?: string;
  headers: string[];
  rows: {
    values: (string | number)[];
    highlightCol?: number;
    highlightRow?: boolean;
    rowLabel?: string;
  }[];
  calloutText?: string;
}

export interface CurriculumSlide {
  id: string;
  unit: number; // 1 to 5
  unitTitle: string;
  topic: 'excel' | 'powerpoint' | 'word' | 'os' | 'digital';
  subtopicId: string;
  title: string;
  badge: string;
  objective: string;
  conceptSummary: string;
  formulaSyntax?: {
    formula: string;
    parts: FormulaSyntaxPart[];
  };
  spreadsheetPreview?: SpreadsheetPreview;
  stepByStep: { step: number; action: string; detail: string }[];
  commonPitfall: string;
  proTip: string;
  exerciseApplication?: string;
}

export const CURRICULUM_SLIDES: CurriculumSlide[] = [
  // ==========================================
  // UNIT 3: MICROSOFT EXCEL & ANALYTICAL SPREADSHEETS
  // ==========================================
  {
    id: 'excel-formula-structure',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'math_formulas',
    title: 'Formula Architecture, The "=" Prefix & Arithmetic Order of Operations',
    badge: 'CORE FOUNDATION',
    objective: 'Understand how Excel interprets spreadsheet formulas, arithmetic operators (+, -, *, /, ^), and precedence rules.',
    conceptSummary: 'Every spreadsheet formula must start with an equals sign (=). Without it, Excel treats the input as literal plain text. Formulas follow mathematical PEMDAS precedence: Parentheses first, followed by Exponentiation, Multiplication/Division, and Addition/Subtraction.',
    formulaSyntax: {
      formula: '= ( [Actual_Utilized] / [Capacity_Limit] ) * 100',
      parts: [
        { label: '=', desc: 'Mandatory formula prefix telling Excel to calculate', color: '#10b981' },
        { label: '(', desc: 'Enforces evaluation of numerator/denominator first', color: '#3b82f6' },
        { label: 'Actual / Capacity', desc: 'Cell references for flight utilization ratio', color: '#f59e0b' },
        { label: '* 100', desc: 'Multiplier operator converting ratio to percentage score', color: '#ec4899' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=(E2/D2)*100',
      activeCell: 'F2',
      headers: ['A: Flight_ID', 'B: Airline', 'C: Sector', 'D: Capacity', 'E: Actual', 'F: Load_Factor_%'],
      rows: [
        { values: ['6E-204', 'IndiGo', 'BLR-DEL', 180, 162, '90.00%'], highlightCol: 5, highlightRow: true },
        { values: ['AI-508', 'Air India', 'BLR-BOM', 160, 136, '85.00%'] },
        { values: ['QP-131', 'Akasa Air', 'BLR-HYD', 189, 172, '91.01%'] },
        { values: ['UK-812', 'Vistara', 'BLR-DEL', 164, 158, '96.34%'] }
      ],
      calloutText: 'Cell F2 computes =(E2/D2)*100 to determine IndiGo passenger seat occupancy percentage.'
    },
    stepByStep: [
      { step: 1, action: 'Select target cell', detail: 'Click on the empty cell where the calculated metric belongs (e.g. F2).' },
      { step: 2, action: 'Type the = trigger', detail: 'Press "=" on your keyboard. Notice the formula bar lights up with the checkmark and cancel icons.' },
      { step: 3, action: 'Click input cells', detail: 'Click cell E2 (Actual_Utilized), press "/", then click cell D2 (Capacity_Limit).' },
      { step: 4, action: 'Press Enter & AutoFill', detail: 'Press Enter to commit. Double-click the tiny square fill handle in the bottom-right corner of F2 to flash-fill down column F.' }
    ],
    commonPitfall: 'Typing raw numbers like "=162/180" instead of dynamic cell references "=(E2/D2)". Hardcoded numbers do not update when raw data values change and fail automated forensic evaluation.',
    proTip: 'Use parentheses liberally to avoid operator ambiguity. E.g., =(D2+E2)/2 calculates average correctly, while =D2+E2/2 only divides E2 by 2 before adding D2.',
    exerciseApplication: 'Essential for Task 1: Calculating load factors, average delays, and percentage metrics across 50 scheduled flight operations.'
  },
  {
    id: 'excel-statistical-aggregations',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'math_formulas',
    title: 'Core Aggregations: SUM, AVERAGE, MIN, MAX & Decimal ROUND',
    badge: 'STATISTICAL METRICS',
    objective: 'Implement standard statistical aggregations across columnar datasets and format decimals cleanly using the ROUND function.',
    conceptSummary: 'Aggregation functions collapse a continuous range of numbers (e.g. E2:E51) into a single summary KPI. The ROUND function prevents unsightly floating-point decimals by truncating and rounding figures to a fixed precision.',
    formulaSyntax: {
      formula: '=ROUND( AVERAGE( range ) , num_digits )',
      parts: [
        { label: '=ROUND(', desc: 'Outer function that trims resulting decimal places', color: '#10b981' },
        { label: 'AVERAGE(', desc: 'Inner statistical aggregation summing cells and dividing by count', color: '#3b82f6' },
        { label: 'E2:E51', desc: 'The continuous range containing 50 flight values', color: '#f59e0b' },
        { label: ', 2 )', desc: 'Specifies exactly two decimal places (e.g. 154.28)', color: '#ec4899' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=ROUND(AVERAGE(D2:D5), 2)',
      activeCell: 'B7',
      headers: ['A: KPI Metric', 'B: Calculated Value', 'C: Formula Applied', 'D: Delay_Mins'],
      rows: [
        { values: ['Fleet Total Volume', '8,420 pax', '=SUM(E2:E51)', '18'] },
        { values: ['Average Flight Delay', '14.65 mins', '=ROUND(AVERAGE(D2:D51), 2)', '0'] },
        { values: ['Maximum Delay Recorded', '75 mins', '=MAX(D2:D51)', '45'] },
        { values: ['Minimum Recorded Variance', '0 mins', '=MIN(D2:D51)', '12'] }
      ],
      calloutText: 'KPI cards in Task 1 utilize nested =ROUND(AVERAGE(...), 2) to maintain strict corporate reporting precision.'
    },
    stepByStep: [
      { step: 1, action: 'Choose summary cell', detail: 'Click on your Task 1 summary sheet KPI row.' },
      { step: 2, action: 'Type formula with range', detail: 'Type "=ROUND(AVERAGE(" and switch to your raw data tab to highlight the flight delay column range D2:D51.' },
      { step: 3, action: 'Set decimal places', detail: 'Type ", 2)" to enforce 2 decimal places and press Enter.' },
      { step: 4, action: 'Verify formatting', detail: 'Ensure the cell displays cleanly with comma thousand separators and two fixed decimal digits.' }
    ],
    commonPitfall: 'Using the toolbar "Decrease Decimal" button instead of the =ROUND() function. Toolbars only change the visual display format while the underlying floating decimal remains unrounded, causing tally discrepancies in audit checks.',
    proTip: 'Use =COUNT() to count numbers and =COUNTA() to count non-empty text cells like Flight Call Signs or Airport Station codes.',
    exerciseApplication: 'Directly tested in Task 1: Building Summary Totals and KPI variance summaries.'
  },
  {
    id: 'excel-logical-if-ifs',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'logical_functions',
    title: 'Conditional Decision Logic: IF, Nested IF & Multi-Condition IFS',
    badge: 'DECISION LOGIC',
    objective: 'Author logical test formulas that evaluate operational performance thresholds and automatically categorize records.',
    conceptSummary: 'The IF function evaluates a logical test (e.g. Delay > 15). If TRUE, it outputs one value; if FALSE, it outputs another. For multi-tier evaluations (e.g., Clean, Delayed, Critical), use nested IF statements or the modern =IFS() function with boolean AND/OR operators.',
    formulaSyntax: {
      formula: '=IF( Delay_Mins > 15 , "Non-Compliant" , "Standard" )',
      parts: [
        { label: '=IF(', desc: 'Conditional evaluation keyword', color: '#10b981' },
        { label: 'G2 > 15', desc: 'Logical Test: checks if delay variance exceeds 15 minutes', color: '#3b82f6' },
        { label: '"Non-Compliant"', desc: 'Value if TRUE: penalty status applied', color: '#ef4444' },
        { label: '"Standard"', desc: 'Value if FALSE: compliant schedule flag', color: '#059669' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=IF(D2>15, "Critical Disruption", IF(D2>0, "Minor Delay", "On-Time"))',
      activeCell: 'E2',
      headers: ['A: Flight_ID', 'B: Carrier', 'C: Sector', 'D: Delay_Mins', 'E: Operational_Status'],
      rows: [
        { values: ['6E-204', 'IndiGo', 'BLR-DEL', 18, 'Critical Disruption'], highlightCol: 4, highlightRow: true },
        { values: ['AI-508', 'Air India', 'BLR-BOM', 0, 'On-Time'] },
        { values: ['QP-131', 'Akasa Air', 'BLR-HYD', 8, 'Minor Delay'] },
        { values: ['SG-402', 'SpiceJet', 'BLR-CCU', 42, 'Critical Disruption'], highlightCol: 4 }
      ],
      calloutText: 'Nested IF automatically sorts each flight movement into operational compliance bands.'
    },
    stepByStep: [
      { step: 1, action: 'Identify criteria', detail: 'Determine your compliance threshold (e.g. Schedule Variance > 15 mins = Breach).' },
      { step: 2, action: 'Open formula', detail: 'In cell E2, type "=IF(D2>15, "Critical", "Clean")". Remember text outputs MUST be wrapped in double quotation marks.' },
      { step: 3, action: 'Add nested condition', detail: 'For 3 tiers: =IF(D2=0, "On-Time", IF(D2<=15, "Buffer Delay", "Critical Breach")).' },
      { step: 4, action: 'Apply conditional formatting', detail: 'Select Column E -> Home -> Conditional Formatting -> Highlight Cell Rules -> Equal To "Critical Breach" in light red fill.' }
    ],
    commonPitfall: 'Forgetting double quotes around text strings like =IF(D2>15, Delayed, Clean), which triggers a #NAME? error because Excel searches for a named range named "Delayed".',
    proTip: 'Combine with =AND() for range brackets: =IF(AND(D2>0, D2<=15), "Minor Delay", "Other"). Both conditions must be satisfied.',
    exerciseApplication: 'Mandatory for Task 2: Logical rules, flight compliance classification, and conditional formatting highlight tiers.'
  },
  {
    id: 'excel-vlookup-mastery',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'lookup_functions',
    title: 'VLOOKUP: Exact Matching, Table Locking & Error Handling',
    badge: 'VERTICAL LOOKUP',
    objective: 'Master the 4 parameters of VLOOKUP to dynamically retrieve data across tables while locking master references with $ absolute coordinates.',
    conceptSummary: 'VLOOKUP searches for a lookup value down the leftmost column of a master reference table and returns a corresponding value from a specified column number to the right. The 4th parameter must always be set to 0 or FALSE for exact operational matching.',
    formulaSyntax: {
      formula: '=VLOOKUP( lookup_value , table_array , col_index_num , [range_lookup] )',
      parts: [
        { label: 'lookup_value', desc: 'Cell containing the key you want to find (e.g. Flight ID "FL-108" in H2)', color: '#10b981' },
        { label: 'table_array', desc: 'Locked master table range with $ signs ($A$2:$F$50)', color: '#3b82f6' },
        { label: 'col_index_num', desc: 'Column count from left where target value resides (e.g. 4 for Delay)', color: '#f59e0b' },
        { label: 'FALSE / 0', desc: 'Strict exact match parameter (avoids approximate mismatch bugs)', color: '#ef4444' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=VLOOKUP(H2, $A$2:$F$50, 4, FALSE)',
      activeCell: 'I2',
      headers: ['A: Flight_ID', 'B: Airline', 'C: Sector', 'D: Delay_Mins', 'H: Query_ID', 'I: Retrieved_Delay'],
      rows: [
        { values: ['FL-101', 'IndiGo', 'BLR-DEL', 18, 'FL-103', '35 mins'], highlightCol: 5, highlightRow: true },
        { values: ['FL-102', 'Air India', 'BLR-BOM', 0, '', ''] },
        { values: ['FL-103', 'Akasa Air', 'BLR-HYD', 35, '', ''] }
      ],
      calloutText: 'When changing Query_ID in H2, cell I2 instantly retrieves the exact delay from Column D using VLOOKUP.'
    },
    stepByStep: [
      { step: 1, action: 'Define the lookup cell', detail: 'Type =VLOOKUP(H2, where H2 is the cell holding the search key.' },
      { step: 2, action: 'Lock the master table', detail: 'Select the data range A2:F50 and press F4 immediately to lock it into $A$2:$F$50.' },
      { step: 3, action: 'Count the column index', detail: 'Count columns starting from Column A = 1, B = 2, C = 3, D = 4. Enter "4".' },
      { step: 4, action: 'Enforce exact match', detail: 'Type ", FALSE)" or ", 0)" and press Enter. Wrap in =IFNA(..., "Not Found") for clean error suppression.' }
    ],
    commonPitfall: 'Forgetting the F4 dollar signs on the master table array (using A2:F50 instead of $A$2:$F$50). When dragged down, the search window shifts downwards and yields false #N/A errors.',
    proTip: 'Remember the golden limitation: VLOOKUP CANNOT look to its left! The lookup column must always be Column 1 of the selected table array.',
    exerciseApplication: 'Core component of Task 3: Automated reference retrieval and dynamic operational lookups.'
  },
  {
    id: 'excel-hlookup-matrix',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'lookup_functions',
    title: 'HLOOKUP: Horizontal Table Scanning & Parameter Tier Brackets',
    badge: 'HORIZONTAL LOOKUP',
    objective: 'Use HLOOKUP to retrieve values from horizontally structured matrix tables, fee schedules, or quarterly benchmarks.',
    conceptSummary: 'HLOOKUP operates identically to VLOOKUP, but searches horizontally across the top row (Row 1) of a table, then moves down a specified number of rows to retrieve the corresponding value.',
    formulaSyntax: {
      formula: '=HLOOKUP( lookup_value , table_array , row_index_num , [range_lookup] )',
      parts: [
        { label: 'lookup_value', desc: 'The header or tier code to find in Row 1 (e.g. "Tier-2")', color: '#10b981' },
        { label: 'table_array', desc: 'The horizontal matrix range locked with $ ($B$1:$F$4)', color: '#3b82f6' },
        { label: 'row_index_num', desc: 'Row number down from the top header to extract (e.g. Row 3)', color: '#f59e0b' },
        { label: 'FALSE / 0', desc: 'Exact match indicator', color: '#ef4444' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=HLOOKUP(B10, $B$1:$F$3, 2, FALSE)',
      activeCell: 'C10',
      headers: ['Parameter', 'Tier 1 (<500km)', 'Tier 2 (500-1500km)', 'Tier 3 (1500-3000km)', 'Tier 4 (>3000km)'],
      rows: [
        { values: ['Base Fuel Surcharge', 'INR 850', 'INR 1,450', 'INR 2,800', 'INR 4,500'], highlightRow: true },
        { values: ['Handling Fee Tier', 'Standard', 'Priority', 'Heavy Express', 'Long Haul'] }
      ],
      calloutText: 'HLOOKUP scans horizontally across the distance tier headers to extract the exact fuel surcharge.'
    },
    stepByStep: [
      { step: 1, action: 'Inspect table orientation', detail: 'Check if your key data headers are laid out across columns rather than vertically down rows.' },
      { step: 2, action: 'Type HLOOKUP syntax', detail: 'In destination cell, type "=HLOOKUP(B10, $B$1:$F$3, 2, FALSE)".' },
      { step: 3, action: 'Specify Row Index', detail: 'Enter the row index number (1 is header row, 2 is Row 2, etc.).' },
      { step: 4, action: 'Commit & Test', detail: 'Change the lookup input from "Tier 1" to "Tier 3" and verify that INR 2,800 updates dynamically.' }
    ],
    commonPitfall: 'Confusing Row Index with Column Index. In HLOOKUP, parameter 3 counts downward by rows, whereas in VLOOKUP it counts rightward by columns.',
    proTip: 'If your table layout frequently changes between horizontal and vertical, convert it with Copy -> Paste Special -> Transpose, or switch to modern XLOOKUP which handles both orientations effortlessly.',
    exerciseApplication: 'Useful for auxiliary lookups, fee matrices, and baggage weight tier tables.'
  },
  {
    id: 'excel-xlookup-modern',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'lookup_functions',
    title: 'XLOOKUP: The Modern 2-Way Replacement (Left-Lookups & Built-In Fallback)',
    badge: 'NEXT-GEN LOOKUP',
    objective: 'Implement XLOOKUP to overcome all VLOOKUP limitations: eliminate column counting, enable left-lookups, and handle missing records cleanly.',
    conceptSummary: 'XLOOKUP is Excel’s most powerful lookup tool. It decouples the lookup column from the return column, allowing lookups to the left and right. It defaults to exact match automatically and provides a built-in parameter for custom error text without needing =IFERROR().',
    formulaSyntax: {
      formula: '=XLOOKUP( lookup_val , lookup_array , return_array , [if_not_found] )',
      parts: [
        { label: 'lookup_val', desc: 'Cell with value to search (e.g. Flight ID in G2)', color: '#10b981' },
        { label: 'lookup_array', desc: 'Single column where search value exists ($A$2:$A$50)', color: '#3b82f6' },
        { label: 'return_array', desc: 'Single column to retrieve, even if located to the left! ($B$2:$B$50)', color: '#f59e0b' },
        { label: '"Not Found"', desc: 'Custom fallback string if the item does not exist (No #N/A!)', color: '#ec4899' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=XLOOKUP(G2, $A$2:$A$50, $B$2:$B$50, "Flight Not Found")',
      activeCell: 'H2',
      headers: ['A: Flight_ID', 'B: Carrier', 'C: Gate', 'G: Search_Box', 'H: Resolved_Carrier'],
      rows: [
        { values: ['FL-101', 'IndiGo', 'Gate 14', 'FL-199', 'TEST CALIBRATION'], highlightCol: 4, highlightRow: true },
        { values: ['FL-102', 'Air India', 'Gate 04', '', ''] },
        { values: ['FL-103', 'Akasa Air', 'Gate 09', '', ''] }
      ],
      calloutText: 'XLOOKUP requires zero column counting and never breaks when new columns are inserted into the sheet.'
    },
    stepByStep: [
      { step: 1, action: 'Enter search key', detail: 'Type "=XLOOKUP(G2," where G2 contains your search flight call sign.' },
      { step: 2, action: 'Highlight lookup column', detail: 'Select ONLY the key column $A$2:$A$50 and add a comma.' },
      { step: 3, action: 'Highlight return column', detail: 'Select the desired output column (e.g. $B$2:$B$50 for Carrier or $E$2:$E$50 for Actual Pax).' },
      { step: 4, action: 'Add fallback text', detail: 'Add `, "Record Not Found")` to protect against missing call signs and press Enter.' }
    ],
    commonPitfall: 'Mismatched array lengths: selecting A2:A50 for lookup_array and B2:B40 for return_array triggers a #VALUE! error. Both arrays MUST have identical row dimensions (50 rows by 50 rows).',
    proTip: 'XLOOKUP also supports 2-way matrix lookups by nesting another XLOOKUP inside the return_array: =XLOOKUP(G2, A2:A50, XLOOKUP(H1, B1:F1, B2:F50)).',
    exerciseApplication: 'Recommended standard for Task 3: Reference retrieval matrix and forensic calibration trap lookup.'
  },
  {
    id: 'excel-index-match',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'lookup_functions',
    title: 'INDEX + MATCH: Dynamic Coordinates & Universal Spreadsheet Interoperability',
    badge: 'UNIVERSAL DUAL LOOKUP',
    objective: 'Construct the classic INDEX + MATCH formula pair for robust 2-way lookups compatible across every version of Excel and Google Sheets.',
    conceptSummary: 'INDEX returns the value at a specified row and column coordinate inside a table. MATCH dynamically discovers the row position number of your key. Nesting MATCH inside INDEX creates a resilient lookup engine that never breaks when columns are reordered.',
    formulaSyntax: {
      formula: '=INDEX( return_range , MATCH( lookup_val , lookup_range , 0 ) )',
      parts: [
        { label: '=INDEX(', desc: 'Retrieves value from the coordinates inside return_range', color: '#10b981' },
        { label: '$B$2:$B$50', desc: 'The exact column of values you want to extract (e.g. Carrier Name)', color: '#3b82f6' },
        { label: 'MATCH(', desc: 'Discovers the exact row number where lookup_val is located', color: '#f59e0b' },
        { label: '0 ) )', desc: 'Flag 0 enforces strict exact match in MATCH function', color: '#ef4444' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: '=INDEX($B$2:$B$50, MATCH(G2, $A$2:$A$50, 0))',
      activeCell: 'H2',
      headers: ['A: Flight_ID', 'B: Airline', 'C: Sector', 'G: Target_ID', 'H: Dynamic_Match'],
      rows: [
        { values: ['FL-101', 'IndiGo', 'BLR-DEL', 'FL-102', 'Air India'], highlightCol: 4, highlightRow: true },
        { values: ['FL-102', 'Air India', 'BLR-BOM', '', ''] },
        { values: ['FL-103', 'Akasa Air', 'BLR-HYD', '', ''] }
      ],
      calloutText: 'MATCH finds that FL-102 is in Row 2; INDEX retrieves Row 2 of Airline column.'
    },
    stepByStep: [
      { step: 1, action: 'Open INDEX with return column', detail: 'Type "=INDEX($B$2:$B$50, " (where Column B is what you want to extract).' },
      { step: 2, action: 'Embed MATCH for row lookup', detail: 'Type "MATCH(G2, $A$2:$A$50, 0))" to calculate the row offset dynamically.' },
      { step: 3, action: 'Verify exact match flag 0', detail: 'Ensure the 3rd argument of MATCH is 0 for exact matching.' },
      { step: 4, action: 'Commit & Test', detail: 'Press Enter. Change target ID to verify dynamic updates.' }
    ],
    commonPitfall: 'Reversing the order of arguments: putting the lookup column in INDEX and the return column in MATCH. Remember: INDEX holds what you WANT; MATCH holds where to SEARCH.',
    proTip: 'INDEX + MATCH calculates significantly faster than VLOOKUP on large enterprise datasets (100,000+ rows) because Excel only loads the targeted columns into memory.',
    exerciseApplication: 'Alternative gold standard for Task 3 in environments where XLOOKUP is not available.'
  },
  {
    id: 'excel-pivot-tables',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'pivot_charts',
    title: 'Pivot Tables: 4-Quadrant Architecture, Value Field Settings & % of Row Total',
    badge: 'DATA SYNTHESIS',
    objective: 'Transform 50 raw operational flight logs into multi-dimensional executive summaries using Pivot Table quadrants and custom aggregations.',
    conceptSummary: 'Pivot Tables synthesize granular transaction records into structured cross-tabulations without writing a single line of formula code. Field lists are mapped across four quadrants: Filters (page level), Columns (horizontal dimensions), Rows (vertical grouping), and Values (mathematical summaries).',
    formulaSyntax: {
      formula: 'Quadrant Setup: Rows = [Airline] | Columns = [Terminal] | Values = [Sum of Actual_Pax]',
      parts: [
        { label: 'Rows', desc: 'Categorizes data vertically (e.g. IndiGo, Air India, Akasa)', color: '#10b981' },
        { label: 'Columns', desc: 'Breaks data across columns (e.g. Terminal 1 vs Terminal 2)', color: '#3b82f6' },
        { label: 'Values', desc: 'Numerical aggregations: Sum, Count, Average, or % of Total', color: '#f59e0b' },
        { label: 'Filters', desc: 'Page-level slicing (e.g. Flight_Type: Domestic only)', color: '#8b5cf6' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: 'Pivot Table Builder -> Value Field Settings -> Show Values As -> % of Row Total',
      activeCell: 'B4',
      headers: ['Row Labels (Airline)', 'Terminal 1 (T1)', 'Terminal 2 (T2)', 'Grand Total Volume', '% Share'],
      rows: [
        { values: ['IndiGo', '2,420 pax', '1,180 pax', '3,600 pax', '42.75%'], highlightRow: true },
        { values: ['Air India', '0 pax', '2,140 pax', '2,140 pax', '25.42%'] },
        { values: ['Akasa Air', '1,450 pax', '0 pax', '1,450 pax', '17.22%'] },
        { values: ['Vistara', '0 pax', '1,230 pax', '1,230 pax', '14.61%'] }
      ],
      calloutText: 'Pivot Table collapses 50 individual flight rows into a clean 4-row carrier volume and share analysis.'
    },
    stepByStep: [
      { step: 1, action: 'Select raw dataset', detail: 'Click anywhere inside raw data and press Ctrl + A to highlight the complete table.' },
      { step: 2, action: 'Insert Pivot Table', detail: 'Go to Insert -> PivotTable. Choose "New Worksheet" and rename tab to "Task4_Pivot_Dashboard".' },
      { step: 3, action: 'Drag Fields to Quadrants', detail: 'Drag "Airline" into Rows, "Terminal" into Columns, and "Actual_Pax" into Values.' },
      { step: 4, action: 'Configure Value Settings', detail: 'Click dropdown arrow on "Sum of Actual_Pax" -> Value Field Settings -> Show Values As -> % of Row Total if relative share is required.' }
    ],
    commonPitfall: 'Having blank header cells in the raw dataset. If any column lacks a header name, Excel displays "The PivotTable field name is not valid" and aborts creation.',
    proTip: 'Add interactive Slicers! Click anywhere in your Pivot Table -> PivotTable Analyze -> Insert Slicer -> check "Sector" or "Time_Slot" to generate instant one-click filter buttons.',
    exerciseApplication: 'Mandatory core requirement for Task 4: Multi-dimensional airline delay and terminal volume analysis.'
  },
  {
    id: 'excel-dynamic-charts',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'pivot_charts',
    title: 'Visual Management Dashboards: Clustered Column & Dual-Axis Combo Charts',
    badge: 'DATA VISUALIZATION',
    objective: 'Design clear, publication-quality analytical charts that highlight operational patterns with dual-axis scaling and data callouts.',
    conceptSummary: 'Charts convert numerical patterns into instant visual insights. When visualizing two metrics with drastically different units (e.g. Passenger Volume in thousands vs Delay Variance in minutes), a Dual-Axis Combo Chart assigns each metric to its own independent Y-axis scale.',
    formulaSyntax: {
      formula: 'Combo Chart Architecture: Primary Axis (Bar) = Passenger Headcount | Secondary Axis (Line) = Delay Minutes',
      parts: [
        { label: 'Clustered Column', desc: 'Vertical bars comparing categorical quantities (Airline Passenger Volume)', color: '#10b981' },
        { label: 'Secondary Axis', desc: 'Right-hand Y-axis scale for low-number metrics (0 to 60 minutes delay)', color: '#3b82f6' },
        { label: 'Line with Markers', desc: 'Continuous trendline traversing columns for delay variance', color: '#f59e0b' },
        { label: 'Data Labels', desc: 'Exact values labeled above key data points for executive clarity', color: '#ec4899' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: 'Chart Tools -> Change Chart Type -> Combo -> Custom Combination',
      activeCell: 'ChartArea',
      headers: ['Chart Deliverable: Executive Flight Performance Dashboard', 'Primary Y-Axis: Pax', 'Secondary Y-Axis: Mins'],
      rows: [
        { values: ['IndiGo: 3,600 Pax (Bar)', 'Axis: 0 to 4,000', 'Avg Delay: 12.4 mins (Line Marker)'] },
        { values: ['Air India: 2,140 Pax (Bar)', 'Axis: 0 to 4,000', 'Avg Delay: 24.8 mins (Line Marker)'] },
        { values: ['SpiceJet: 890 Pax (Bar)', 'Axis: 0 to 4,000', 'Avg Delay: 38.6 mins (Line Marker)'] }
      ],
      calloutText: 'Dual-Axis combo allows executives to spot that SpiceJet has lower passenger volume but highest average delay duration.'
    },
    stepByStep: [
      { step: 1, action: 'Select Pivot summary data', detail: 'Highlight the Carrier, Pax Volume, and Delay Minutes summary columns.' },
      { step: 2, action: 'Insert Combo Chart', detail: 'Go to Insert -> Charts -> Combo -> Create Custom Combo Chart.' },
      { step: 3, action: 'Assign Secondary Axis', detail: 'Set Pax Volume to "Clustered Column". Set Delay Minutes to "Line with Markers" and check the "Secondary Axis" box.' },
      { step: 4, action: 'Add Professional Polish', detail: 'Add meaningful Chart Title ("AOCC Peak Hour Schedule Variance by Carrier"), enable Data Labels, and format legend at the bottom.' }
    ],
    commonPitfall: 'Plotting delay minutes and passenger counts on the same axis without a secondary scale. Because passengers are in thousands (3,000) and delays are in dozens (15), the delay line appears flat at the very bottom of the chart.',
    proTip: 'Eliminate visual clutter! Remove heavy background gridlines and avoid 3D chart effects, which distort accurate visual comparison of bar heights.',
    exerciseApplication: 'Direct deliverable for Task 4 Visual Management: Creating the interactive Pivot Chart dashboard.'
  },
  {
    id: 'excel-data-validation',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'data_validation_cf',
    title: 'Data Validation: Dropdowns, Boundary Rules & Stop Alert Dialogs',
    badge: 'DATA INTEGRITY & GOVERNANCE',
    objective: '1. Problem: Unchecked typing errors corrupt formulas and manifests. 2. Need: Restrict inputs at entry. 3. Small Scale: In-cell airline dropdowns & seat bounds. 4. Large Scale: Master named ranges and dynamic formulas.',
    conceptSummary: 'Data Validation prevents human typing errors at the point of entry. Uncontrolled inputs cause downstream #N/A lookups and dangerous overbooking calculations. Enforcing discrete Lists, Whole Number boundaries, and Stop Alerts guarantees that only compliant data enters the operational system.',
    formulaSyntax: {
      formula: 'Data Validation > Allow: List | Source: =Approved_Airlines (or =K2:K6)',
      parts: [
        { label: '=', desc: 'Formula trigger pointing to master reference range', color: '#10b981' },
        { label: 'Approved_Airlines', desc: 'Named range or locked coordinates containing valid carriers', color: '#3b82f6' },
        { label: 'Whole Number', desc: 'Bounds passengers between 1 and =E2 (Max Certified Capacity)', color: '#f59e0b' },
        { label: 'Stop Alert', desc: 'Rejects unauthorized values and displays dialog with Retry/Cancel', color: '#ef4444' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: 'Data Validation: List = $K$2:$K$6 | Whole Number: 1..222',
      activeCell: 'B2',
      headers: ['A: Flight_ID', 'B: Airline (Dropdown ▼)', 'C: Destination', 'D: Aircraft', 'E: Capacity', 'F: Booked Pax', 'G: Gate'],
      rows: [
        { values: ['6E-2101', 'IndiGo [▼]', 'DEL', 'A321neo', 222, 216, 'G04'], highlightCol: 1, highlightRow: true },
        { values: ['AI-502', 'Air India', 'BOM', 'B777-300ER', 342, 328, 'G12'] },
        { values: ['QP-1354', 'Akasa Air', 'GOI', 'B737-MAX8', 189, 174, 'G06'] },
        { values: ['UK-832', 'Vistara', 'DEL', 'A320neo', 164, 158, 'G09'] }
      ],
      calloutText: 'Problem: Typos crash VLOOKUP. Solution: Cell B2 enforces dropdown list; Cell F2 enforces Whole Number <= E2 with a Stop Alert.'
    },
    stepByStep: [
      { step: 1, action: 'Define the Problem & Operational Need', detail: 'Identify rogue entries (e.g., "Indi-go" vs "IndiGo" or 900 pax on an A320) that break automated billing and flight dispatch.' },
      { step: 2, action: 'Implement Small-Scale List Validation', detail: 'Select B2:B10 -> Data Tab -> Data Validation -> Allow: List -> Source: "IndiGo, Air India, Akasa Air, SpiceJet, Vistara".' },
      { step: 3, action: 'Implement Capacity Bounds & Stop Alert', detail: 'Select F2:F10 -> Allow: Whole number -> Minimum: 1, Maximum: =E2. On Error Alert tab, set Style: Stop, Title: "Capacity Exceeded".' },
      { step: 4, action: 'Scale to Large Airport Operations', detail: 'Convert source to a Master Reference Sheet ($K$2:$K$20), use named ranges, and run "Circle Invalid Data" to audit vendor manifests.' }
    ],
    commonPitfall: 'Selecting "Decimal" instead of "Whole number" for passenger counts (allowing fractional passengers like 142.5), or leaving generic error messages that confuse coordinators.',
    proTip: 'Always provide an Input Message (e.g. "Select approved IATA carrier from dropdown"). It displays a helpful tooltip the moment the cell receives focus, preventing mistakes before they occur.',
    exerciseApplication: 'Core requirement for Module 5 and Dataset 6: Enforcing flight roster dropdowns and capacity limits.'
  },
  {
    id: 'excel-conditional-formatting',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'data_validation_cf',
    title: 'Conditional Formatting: Delay Spotlights, Heatmaps & Row Formulas',
    badge: 'VISUAL INTELLIGENCE',
    objective: '1. Problem: Walls of numeric data hide operational delays. 2. Need: Automated visual alerts. 3. Small Scale: Highlight cells > 15 mins. 4. Large Scale: In-cell data bars, baggage heatmaps, and full-row formula =$E2>15.',
    conceptSummary: 'Conditional Formatting dynamically restyles cells based on mathematical criteria. When an AOCC manifest contains hundreds of rows, controllers cannot scan individual numbers. Automated red highlights, 3-color baggage density heatmaps, and full-row highlighting spotlights critical delays instantly.',
    formulaSyntax: {
      formula: 'New Rule > Use a formula to determine which cells to format: =$E2>15',
      parts: [
        { label: '=$E', desc: 'Locks column E with absolute reference $ so every cell in the row checks Delay', color: '#10b981' },
        { label: '2', desc: 'Relative row reference allowing Excel to evaluate row 2, row 3, row 4 independently', color: '#3b82f6' },
        { label: '> 15', desc: 'Logical operator testing whether delay exceeds standard 15-minute tolerance', color: '#ef4444' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: 'Rule: =$E2>15 -> Format: Light Red Fill with Dark Red Text',
      activeCell: 'A3:H3',
      headers: ['A: Flight_ID', 'B: Airline', 'C: Sector', 'D: Terminal', 'E: Delay_Mins', 'F: Status', 'G: Baggage_kg', 'H: OTP_%'],
      rows: [
        { values: ['6E-521', 'IndiGo', 'BLR-DEL', 'T1', 8, 'On-Time', 3450, '92%'] },
        { values: ['AI-804', 'Air India', 'BLR-BOM', 'T2', 42, 'Delayed', 5820, '74%'], highlightCol: 4, highlightRow: true },
        { values: ['6E-204', 'IndiGo', 'BLR-HYD', 'T1', 0, 'On-Time', 2410, '95%'] },
        { values: ['QP-1332', 'Akasa Air', 'BLR-GOI', 'T1', 25, 'Delayed', 2790, '82%'], highlightCol: 4, highlightRow: true }
      ],
      calloutText: 'Problem: Scanning 500 rows takes minutes. Solution: Flights with delays > 15 mins instantly illuminate red across the entire row.'
    },
    stepByStep: [
      { step: 1, action: 'Define the Problem & Visual Need', detail: 'A table of black-and-white numbers delays critical ATC decisions. Visual alerting leverages preattentive perception to spotlight delays in 0.2 seconds.' },
      { step: 2, action: 'Small-Scale Highlight Rule', detail: 'Select Delay column E2:E10 -> Home -> Conditional Formatting -> Highlight Cells Rules -> Greater Than -> 15 -> Soft Red Fill.' },
      { step: 3, action: 'Large-Scale Gradient Heatmaps & Data Bars', detail: 'Apply 3-Color Scale (Green-Yellow-Red) to hold baggage weights (G2:G50) to visualize makeup area congestion; apply In-Cell Data Bars to passenger load factor.' },
      { step: 4, action: 'Master Technique: Full-Row Highlighting', detail: 'Select full data range A2:H50 -> New Rule -> Formula: "=$E2>15" -> Set fill. Notice column $E is locked while row 2 is relative.' }
    ],
    commonPitfall: 'Locking both column and row in custom formulas (e.g. =$E$2>15). This forces Excel to check only cell E2 for the entire table, causing all rows to turn red or none at all.',
    proTip: 'Keep rule hierarchy clean in "Manage Rules". Check "Stop If True" on severe delay alerts so secondary rules (like zebra striping) do not overwrite critical emergency formatting.',
    exerciseApplication: 'Essential for Module 6 and Dataset 7: Delay threshold monitoring and baggage load heatmaps.'
  },
  {
    id: 'excel-sorting-filtering',
    unit: 3,
    unitTitle: 'Unit 3: Microsoft Excel & Analytical Spreadsheets',
    topic: 'excel',
    subtopicId: 'data_validation_cf',
    title: 'AutoFilter (Ctrl+Shift+L) & Multi-Tier Custom Sorting',
    badge: 'DATA EXPLORATION',
    objective: '1. Problem: Vast chronological tables hide key records. 2. Need: Non-destructive filtering & multi-level sort. 3. Small Scale: AutoFilter Ctrl+Shift+L. 4. Large Scale: Multi-tier custom sort hierarchies and SUBTOTAL formulas.',
    conceptSummary: 'AutoFilter and Multi-Tier Sorting provide non-destructive data exploration. Sorting a single column without the entire range severs relational links (orphan rows). AutoFilter isolates specific carriers, terminals, and delay thresholds in seconds without altering underlying data.',
    formulaSyntax: {
      formula: 'AutoFilter Shortcut: Ctrl+Shift+L | Dynamic Aggregate: =SUBTOTAL( 109 , E2:E500 )',
      parts: [
        { label: 'Ctrl+Shift+L', desc: 'Universal keyboard toggle to show or hide header filter arrows', color: '#10b981' },
        { label: '=SUBTOTAL(', desc: 'Special calculation function that automatically ignores hidden filtered rows', color: '#3b82f6' },
        { label: '109', desc: 'Function code for SUM (ignoring rows hidden by manual filter)', color: '#f59e0b' },
        { label: 'E2:E500', desc: 'Range of operational numbers being dynamically summed', color: '#ec4899' }
      ]
    },
    spreadsheetPreview: {
      formulaBar: 'Filter: Terminal = "T1" AND Status = "Delayed" | Sort: Delay Mins (Desc)',
      activeCell: 'A1:H5',
      headers: ['A: Flight_ID ▼', 'B: Airline ▼', 'C: Sector ▼', 'D: Terminal ▼ [T1]', 'E: Delay_Mins ▼ [Z-A]', 'F: Status ▼ [Delayed]', 'G: Baggage_kg ▼'],
      rows: [
        { values: ['SG-401', 'SpiceJet', 'BLR-CCU', 'T1', 55, 'Delayed', 2550], highlightRow: true },
        { values: ['QP-1332', 'Akasa Air', 'BLR-GOI', 'T1', 25, 'Delayed', 2790], highlightRow: true },
        { values: ['QP-1405', 'Akasa Air', 'BLR-DEL', 'T1', 18, 'Delayed', 2840], highlightRow: true }
      ],
      calloutText: 'Problem: Scrolling through 1,000 mixed flights. Solution: AutoFilter narrows to 3 delayed T1 flights in 2 clicks; SUBTOTAL sums only visible load.'
    },
    stepByStep: [
      { step: 1, action: 'Define the Problem & Exploration Need', detail: 'Chronological data makes finding specific terminal delays tedious. Sorting only one column corrupts data integrity.' },
      { step: 2, action: 'Small-Scale AutoFilter Toggle', detail: 'Click inside table -> press Ctrl + Shift + L. Use Terminal dropdown to uncheck (Select All) and pick "T1". Use Number Filters -> Greater Than -> 15.' },
      { step: 3, action: 'Large-Scale Multi-Tier Sort Hierarchy', detail: 'Go to Data -> Sort -> Add Level. Level 1: Terminal (A-Z). Level 2: Status (Custom List: Delayed, Cancelled, On-Time). Level 3: Delay Mins (Largest to Smallest).' },
      { step: 4, action: 'Preserve Formulas with SUBTOTAL', detail: 'Never use standard =SUM() on filtered data (it counts hidden rows). Replace with =SUBTOTAL(109, Range) to calculate dynamic visible totals.' }
    ],
    commonPitfall: 'Highlighting only one column before sorting. Excel pops up "Sort Warning: Expand the Selection". If the operator clicks "Continue with current selection", flight IDs stay put while delay minutes shuffle randomly across passengers.',
    proTip: 'Convert your raw data range into an official Excel Table with Ctrl + T. Tables automatically enable AutoFilters, banded rows, structured formula references, and dynamic Slicer controls.',
    exerciseApplication: 'Core requirement for Module 7 and Dataset 7: Sorting and filtering multi-terminal AOCC manifests.'
  },

  // ==========================================
  // UNIT 2: MICROSOFT WORD & TECHNICAL DOCUMENTATION
  // ==========================================
  {
    id: 'word-styles-toc',
    unit: 2,
    unitTitle: 'Unit 2: Microsoft Word Proficiency & Business Documentation',
    topic: 'word',
    subtopicId: 'styles_toc',
    title: 'Typography Hierarchy, Heading Styles & Automated Table of Contents',
    badge: 'DOCUMENT ARCHITECTURE',
    objective: 'Apply standardized Heading Styles (Heading 1, Heading 2) to build a navigable document hierarchy and generate an automated Table of Contents.',
    conceptSummary: 'Professional SOPs rely on native Microsoft Word Styles rather than manual bolding and font size changes. Using defined styles enables instant automated Table of Contents (TOC) creation and Navigation Pane indexing.',
    stepByStep: [
      { step: 1, action: 'Configure Normal Style', detail: 'Right-click Normal Style -> Modify -> Set 11pt Calibri or Arial, 1.15 line spacing, 6pt after paragraph.' },
      { step: 2, action: 'Tag Document Headings', detail: 'Select primary section titles and click "Heading 1" (18pt Bold Primary). Select subsections and click "Heading 2" (14pt Semi-bold).' },
      { step: 3, action: 'Insert Page Break', detail: 'Position cursor on Page 2 where the index belongs. Press Ctrl + Enter.' },
      { step: 4, action: 'Generate TOC', detail: 'Go to References tab -> Table of Contents -> select Automatic Table 1. Word compiles page numbers automatically!' }
    ],
    commonPitfall: 'Manually typing dotted leader lines (e.g. "Section 1 ............ page 3"). When text is edited, manual dots break alignment and fail document control audits.',
    proTip: 'Whenever report content or page numbers change, right-click the TOC and click "Update Field -> Update Entire Table" to refresh all page numbers in one second.',
    exerciseApplication: 'Required for technical report documentation in Word assignments.'
  },
  {
    id: 'word-tables-manifest',
    unit: 2,
    unitTitle: 'Unit 2: Microsoft Word Proficiency & Business Documentation',
    topic: 'word',
    subtopicId: 'tabular_manifests',
    title: 'Technical Tables, Repeating Header Rows & AutoFit Alignment',
    badge: 'TABULAR MANIFESTS',
    objective: 'Construct multi-page technical inspection tables with repeating header rows across page breaks, precise column alignment, and shaded headers.',
    conceptSummary: 'Long technical flight manifests that span across multiple pages become illegible if headers disappear on page 2. Checking "Repeat as header row at the top of each page" ensures table headers duplicate cleanly across breaks.',
    stepByStep: [
      { step: 1, action: 'Insert Table Structure', detail: 'Go to Insert -> Table -> create a 5-column by 10-row matrix.' },
      { step: 2, action: 'Apply Professional Style', detail: 'Select table -> Table Design -> choose "Grid Table 4 - Accent 1" with a shaded top header row.' },
      { step: 3, action: 'Lock Repeating Headers', detail: 'Highlight Row 1 -> Table Layout tab -> click "Repeat Header Rows".' },
      { step: 4, action: 'Set Numeric Alignment', detail: 'Right-align numbers and percentages so decimals line up vertically; left-align descriptive text.' }
    ],
    commonPitfall: 'Manually copying and pasting the header row into page 2. If rows are added earlier in the document, the manual header moves into the middle of the table as an orphaned row.',
    proTip: 'Use "AutoFit to Window" on the Table Layout tab to guarantee table borders never spill over outside standard 1-inch printable page margins.',
    exerciseApplication: 'Standard format for Section 2: Technical Inspection Matrix and Flight Manifest SOPs.'
  },
  {
    id: 'word-section-breaks-headers',
    unit: 2,
    unitTitle: 'Unit 2: Microsoft Word Proficiency & Business Documentation',
    topic: 'word',
    subtopicId: 'headers_footers',
    title: 'Section Breaks, Independent Headers & Dual Page Numbering (Roman vs Arabic)',
    badge: 'SECTION UNLINKING',
    objective: 'Insert Next Page section breaks and unlink header/footer links to maintain independent preliminary (i, ii) and body (1, 2, 3) page numbering.',
    conceptSummary: 'Standard page breaks only start a new page under the same formatting. Section Breaks (Next Page) create independent document zones with unique headers, footers, orientations (portrait vs landscape), and page numbering sequences.',
    stepByStep: [
      { step: 1, action: 'Insert Section Break', detail: 'Go to end of Table of Contents -> Layout tab -> Breaks -> Section Break (Next Page).' },
      { step: 2, action: 'Unlink Header/Footer', detail: 'Double-click the header on Page 3 (Section 2) -> click "Link to Previous" in the Ribbon to turn it OFF.' },
      { step: 3, action: 'Configure Roman preliminary pages', detail: 'In Section 1 footer -> Page Number -> Format Page Numbers -> select Number Format: "i, ii, iii...".' },
      { step: 4, action: 'Configure Arabic body pages', detail: 'In Section 2 footer -> Page Number -> Format Page Numbers -> choose "1, 2, 3..." and set "Start at: 1".' }
    ],
    commonPitfall: 'Forgetting to toggle off "Link to Previous". When linked, modifying the header or deleting page numbers on the cover page will wipe them out across the entire report.',
    proTip: 'Use "Page X of Y" formatting in the bottom-right footer for official audit compliance so readers know if pages are missing.',
    exerciseApplication: 'Required for Section 3: Technical Headers, Footers & Numbering hierarchy.'
  },
  {
    id: 'word-mail-merge-dispatch',
    unit: 2,
    unitTitle: 'Unit 2: Microsoft Word Proficiency & Business Documentation',
    topic: 'word',
    subtopicId: 'mail_merge',
    title: 'Mail Merge: Automated Mass Dispatch Linked to External Excel Lists',
    badge: 'AUTOMATED DISPATCH',
    objective: 'Connect a standard business notice template to an external Excel recipient list to mass-generate personalized administrative letters.',
    conceptSummary: 'Mail Merge links a boilerplate letter in Microsoft Word with a database or spreadsheet in Excel. Placeholders called Merge Fields («Carrier_Name», «Penalty_Amount») are replaced dynamically with each recipient’s individual data record.',
    stepByStep: [
      { step: 1, action: 'Prepare Excel source data', detail: 'Ensure your Excel sheet has clean, single-row headers in Row 1 without merged cells.' },
      { step: 2, action: 'Initiate Mail Merge in Word', detail: 'Go to Mailings tab -> Start Mail Merge -> Letters.' },
      { step: 3, action: 'Attach Recipient Spreadsheet', detail: 'Click Select Recipients -> Use an Existing List -> browse and select your flight operations Excel file.' },
      { step: 4, action: 'Insert Merge Fields', detail: 'Place cursor in letter body -> click "Insert Merge Field" -> select «Station_Manager», «Airport_Code», «Compliance_Deadline».' },
      { step: 5, action: 'Preview & Complete', detail: 'Click "Preview Results" to verify data populates cleanly, then Finish & Merge.' }
    ],
    commonPitfall: 'Having formatted or merged cells in the top row of the Excel sheet. Mail Merge reads Row 1 as column titles; merged cells result in blank field names.',
    proTip: 'Use the "Rules -> If...Then...Else" button on the Mailings tab to insert custom text variations (e.g. if Delay > 15, print "Immediate Fine Imposed", else print "Warning Notice").',
    exerciseApplication: 'Required for Section 4: Automated Station Manager Dispatch template.'
  },

  // ==========================================
  // UNIT 4: MICROSOFT POWERPOINT & PROFESSIONAL PRESENTATIONS
  // ==========================================
  {
    id: 'ppt-slide-master',
    unit: 4,
    unitTitle: 'Unit 4: Microsoft PowerPoint & Professional Presentations',
    topic: 'powerpoint',
    subtopicId: 'slide_master',
    title: 'Slide Master Architecture: Global Branding, Font Hierarchy & 16:9 Widescreen',
    badge: 'GLOBAL TEMPLATE',
    objective: 'Build custom Slide Master layouts to ensure bulletproof brand consistency, footer timestamps, and automated slide numbering across team members.',
    conceptSummary: 'The Slide Master governs formatting across all slides in a presentation deck. Editing the top Master slide automatically updates colors, font pairings, footer notices, and logo placeholders across every slide in the deck.',
    stepByStep: [
      { step: 1, action: 'Enter Slide Master View', detail: 'Go to View tab -> click "Slide Master". Scroll to the very top primary master slide.' },
      { step: 2, action: 'Set Theme Colors & Fonts', detail: 'Click Colors -> select Navy/Emerald corporate palette. Click Fonts -> set Trebuchet MS (Headers) and Calibri (Body).' },
      { step: 3, action: 'Embed Footer & Page Numbers', detail: 'Check the Footer, Date, and Slide Number boxes. Apply institutional confidentiality text in the footer.' },
      { step: 4, action: 'Close Master View', detail: 'Click "Close Master View". When you click "New Slide", all custom layouts are available with locked branding.' }
    ],
    commonPitfall: 'Modifying slide layouts on individual slides instead of in Slide Master. When multiple team members merge slides, font sizes and alignments clash.',
    proTip: 'Use 24pt minimum font size for body bullet points and 36pt minimum for slide titles to ensure readability from the back of an executive boardroom.',
    exerciseApplication: 'Required for Slide Master Architecture in PowerPoint lab tasks.'
  },
  {
    id: 'ppt-smartart-infographics',
    unit: 4,
    unitTitle: 'Unit 4: Microsoft PowerPoint & Professional Presentations',
    topic: 'powerpoint',
    subtopicId: 'smartart_infographics',
    title: 'Visual Storytelling with SmartArt, Process Flows & Chevron Sequences',
    badge: 'PROCESS ARCHITECTURE',
    objective: 'Convert dense bullet lists into structured SmartArt diagrams (Process Flow, Cycle, or Hierarchy) to improve executive comprehension.',
    conceptSummary: 'Executive audiences retain visual diagrams up to 6 times better than blocks of bullet points. SmartArt structures operational workflows (e.g. Flight Gate Turnaround $\rightarrow$ Baggage Offloading $\rightarrow$ Refueling $\rightarrow$ Boarding) into clean, numbered sequences.',
    stepByStep: [
      { step: 1, action: 'Convert existing bullets', detail: 'Type your operational sequence as bullet points. Right-click the text box -> click "Convert to SmartArt".' },
      { step: 2, action: 'Choose Process Layout', detail: 'Select "Continuous Block Process", "Chevron List", or "Horizontal Hierarchy".' },
      { step: 3, action: 'Apply Contrast Colors', detail: 'Go to SmartArt Design tab -> Change Colors -> choose Accent Colors for high contrast against the background.' },
      { step: 4, action: 'Add Icons', detail: 'Insert relevant vector icons inside each process stage to enhance cognitive signposting.' }
    ],
    commonPitfall: 'Using overly decorative 3D bevels and shadow effects on SmartArt, which look dated and reduce visual legibility during screen sharing.',
    proTip: 'Press Shift + Tab inside the SmartArt text pane to promote an item, or Tab to indent it into a sub-stage.',
    exerciseApplication: 'Tested in Slide 3: Operational Process Flow diagram.'
  },
  {
    id: 'ppt-linked-charts-animations',
    unit: 4,
    unitTitle: 'Unit 4: Microsoft PowerPoint & Professional Presentations',
    topic: 'powerpoint',
    subtopicId: 'dynamic_charts',
    title: 'Linked Excel Charts, Subtle Entrance Animations & Presenter View Delivery',
    badge: 'EXECUTIVE DELIVERY',
    objective: 'Embed dynamically linked Excel charts into slides, configure sequenced entrance animations, and write briefing talk-tracks in Presenter Notes.',
    conceptSummary: 'Linked charts automatically update in PowerPoint when the underlying Excel data changes. Sequenced animations control audience focus by revealing chart series or bullet points one by one. Presenter View displays private notes and elapsed timers on the presenter’s monitor.',
    stepByStep: [
      { step: 1, action: 'Copy Chart from Excel', detail: 'In Excel, select your finished chart -> press Ctrl + C.' },
      { step: 2, action: 'Paste as Linked Data', detail: 'In PowerPoint -> Paste Special -> choose "Paste Link -> Microsoft Excel Chart Object".' },
      { step: 3, action: 'Sequence Entrance Animations', detail: 'Select the chart -> Animations tab -> choose "Fade". In Effect Options, select "By Series" or "By Category".' },
      { step: 4, action: 'Write Speaker Notes', detail: 'Click "Notes" in the bottom status bar and type your executive briefing talk-track (minimum 3 sentences).' }
    ],
    commonPitfall: 'Using jarring animations like "Spin", "Bounce", or "Fly In From Bottom". In corporate briefings, only subtle "Appear", "Fade", or "Wipe" (from left) are acceptable.',
    proTip: 'Press "B" on your keyboard during a presentation to black out the projector screen and refocus audience attention entirely on you as the speaker.',
    exerciseApplication: 'Mandatory for Slides 4 to 6: Analytical Charts, Sequenced Animations & Speaker Notes.'
  },

  // ==========================================
  // UNIT 1: COMPUTERS, OPERATING SYSTEMS & FILE INTEGRITY
  // ==========================================
  {
    id: 'os-file-extensions-diagnostics',
    unit: 1,
    unitTitle: 'Unit 1: Introduction to Computers & Operating Systems',
    topic: 'os',
    subtopicId: 'windows_files',
    title: 'File Extensions, OOXML Container Formats & Windows Diagnostics',
    badge: 'FILE INTEGRITY',
    objective: 'Understand spreadsheet and document container formats (.xlsx, .docx, .pptx, .csv) and use Task Manager diagnostics to monitor system resources.',
    conceptSummary: 'Modern Office files are compressed ZIP packages conforming to the Open Office XML (OOXML) standard. Renaming a .xlsx file to .zip exposes the internal XML metadata, worksheet data, and calculation tags that automated forensic auditing tools inspect.',
    stepByStep: [
      { step: 1, action: 'Show File Extensions in Windows', detail: 'Open File Explorer -> View -> Show -> check "File name extensions". Never rely on icons alone.' },
      { step: 2, action: 'Understand .CSV vs .XLSX', detail: '.CSV stores plain text separated by commas (no formulas or charts). .XLSX stores full calculation models, sheets, and cell formulas.' },
      { step: 3, action: 'Monitor Process Memory in Task Manager', detail: 'Press Ctrl + Shift + Esc to open Task Manager. Inspect CPU and RAM consumption when running heavy recalculations.' },
      { step: 4, action: 'Standard File Naming', detail: 'Always save submissions in standard format: [RollNo]_[YourName]_[ExerciseName].xlsx.' }
    ],
    commonPitfall: 'Saving an Excel model containing formulas as a .csv file. CSV files strip out all tabs, Pivot Tables, and formula definitions, irreversibly corrupting your work.',
    proTip: 'If an Excel file crashes or refuses to open, make a backup copy, change extension to .zip, and check whether sheet1.xml can be recovered.',
    exerciseApplication: 'Essential technical requirement for preparing, naming, and exporting laboratory files.'
  }
];

export function getAllCurriculumSlides(): CurriculumSlide[] {
  return CURRICULUM_SLIDES;
}

export function getSlidesForAssignment(assignment?: {
  topic?: string;
  subtopics?: string[];
  tasks?: { title?: string; targetSheetOrSection?: string }[];
}): CurriculumSlide[] {
  if (!assignment || !assignment.topic) {
    // Default to Excel core slides
    return CURRICULUM_SLIDES.filter((s) => s.topic === 'excel');
  }

  const topic = assignment.topic.toLowerCase();

  // If topic is excel, match based on subtopics/tasks or return comprehensive excel sequence
  if (topic === 'excel') {
    const excelSlides = CURRICULUM_SLIDES.filter((s) => s.topic === 'excel');

    // Tailored sequence for flight operations / pivot / lookup labs:
    const prioritizedIds = [
      'excel-formula-structure',
      'excel-statistical-aggregations',
      'excel-logical-if-ifs',
      'excel-vlookup-mastery',
      'excel-xlookup-modern',
      'excel-pivot-tables',
      'excel-dynamic-charts'
    ];

    const matched = prioritizedIds
      .map((id) => excelSlides.find((s) => s.id === id))
      .filter((s): s is CurriculumSlide => Boolean(s));

    return matched.length > 0 ? matched : excelSlides;
  }

  if (topic === 'powerpoint') {
    return CURRICULUM_SLIDES.filter((s) => s.topic === 'powerpoint');
  }

  if (topic === 'word') {
    return CURRICULUM_SLIDES.filter((s) => s.topic === 'word');
  }

  return CURRICULUM_SLIDES.filter((s) => s.unit === 3);
}
