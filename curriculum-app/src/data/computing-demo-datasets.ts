export interface DemoDatasetColumn {
  key: string;
  header: string;
  excelCol: string; // 'A', 'B', 'C', etc.
  type: 'text' | 'number' | 'currency' | 'percentage' | 'formula';
  width?: string;
  description?: string;
}

export interface DemoDatasetRow {
  [key: string]: string | number;
}

export interface TeacherFormulaGuide {
  title: string;
  targetCell: string;
  formula: string;
  plainEnglishExplanation: string;
  aviationContext: string;
  expectedResult: string;
  commonStudentMistake: string;
}

export interface PivotExerciseGuide {
  title: string;
  objective: string;
  rows: string[];
  columns: string[];
  values: string[];
  filters?: string[];
  chartType: string;
  keyInsights: string;
}

export interface DemoDataset {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  category: 'functions_math' | 'logical_if' | 'vlookup_hlookup' | 'xlookup_advanced' | 'pivot_table_charts';
  filename: string;
  scenarioDescription: string;
  columns: DemoDatasetColumn[];
  rows: DemoDatasetRow[];
  lookupTables?: {
    title: string;
    description: string;
    range: string;
    columns: DemoDatasetColumn[];
    rows: DemoDatasetRow[];
  }[];
  horizontalTable?: {
    title: string;
    description: string;
    range: string;
    rowHeaders: string[];
    matrix: (string | number)[][];
  };
  teacherGuides: TeacherFormulaGuide[];
  pivotGuides?: PivotExerciseGuide[];
}

export const COMPUTING_DEMO_DATASETS: DemoDataset[] = [
  // -------------------------------------------------------------------------
  // DATASET 1: ESSENTIAL FUNCTIONS & STATISTICAL ANALYSIS
  // -------------------------------------------------------------------------
  {
    id: 'functions-math',
    title: '1. Essential Math & Statistical Functions',
    subtitle: 'IndiGo & Air India Daily Flight Revenue, Baggage & Passenger Manifest (BLR Hub)',
    topic: 'SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTIF, SUMIF, ROUND',
    category: 'functions_math',
    filename: '01_Aviation_Essential_Functions_Dataset.csv',
    scenarioDescription: 'This dataset represents a morning departure bank from Kempegowda International Airport (BLR). Use this sheet to demonstrate arithmetic operations (PEMDAS), standard aggregation functions, and single-criteria conditional functions (COUNTIF, SUMIF) in aviation financial and operational analysis.',
    columns: [
      { key: 'flight_no', header: 'Flight No', excelCol: 'A', type: 'text', description: 'ICAO/IATA flight designator' },
      { key: 'destination', header: 'Destination', excelCol: 'B', type: 'text', description: '3-letter IATA destination airport code' },
      { key: 'aircraft', header: 'Aircraft Type', excelCol: 'C', type: 'text', description: 'Operating aircraft family' },
      { key: 'pax_count', header: 'Passengers (Pax)', excelCol: 'D', type: 'number', description: 'Total checked-in onboard passengers' },
      { key: 'baggage_kg', header: 'Baggage (kg)', excelCol: 'E', type: 'number', description: 'Total hold baggage weight in kilograms' },
      { key: 'avg_fare_inr', header: 'Avg Fare (₹)', excelCol: 'F', type: 'currency', description: 'Base ticket price per passenger' },
      { key: 'revenue_inr', header: 'Total Revenue (₹)', excelCol: 'G', type: 'formula', description: '=D2*F2 (Pax * Fare)' },
    ],
    rows: [
      { flight_no: '6E 521', destination: 'DEL', aircraft: 'A321neo', pax_count: 218, baggage_kg: 3450, avg_fare_inr: 6400, revenue_inr: 1395200 },
      { flight_no: 'AI 804', destination: 'BOM', aircraft: 'B777-300ER', pax_count: 326, baggage_kg: 5820, avg_fare_inr: 8900, revenue_inr: 2901400 },
      { flight_no: '6E 204', destination: 'HYD', aircraft: 'A320neo', pax_count: 178, baggage_kg: 2410, avg_fare_inr: 3850, revenue_inr: 685300 },
      { flight_no: 'QP 1332', destination: 'GOI', aircraft: 'B737-MAX8', pax_count: 184, baggage_kg: 2790, avg_fare_inr: 4200, revenue_inr: 772800 },
      { flight_no: 'AI 506', destination: 'DEL', aircraft: 'B777-300ER', pax_count: 312, baggage_kg: 5600, avg_fare_inr: 9200, revenue_inr: 2870400 },
      { flight_no: '6E 718', destination: 'MAA', aircraft: 'ATR-72', pax_count: 68, baggage_kg: 890, avg_fare_inr: 2950, revenue_inr: 200600 },
      { flight_no: 'UK 815', destination: 'BOM', aircraft: 'A320neo', pax_count: 164, baggage_kg: 2600, avg_fare_inr: 5800, revenue_inr: 951200 },
      { flight_no: 'SG 401', destination: 'CCU', aircraft: 'B737-800', pax_count: 172, baggage_kg: 2550, avg_fare_inr: 5100, revenue_inr: 877200 },
      { flight_no: '6E 902', destination: 'COK', aircraft: 'ATR-72', pax_count: 70, baggage_kg: 920, avg_fare_inr: 3100, revenue_inr: 217000 },
      { flight_no: 'QP 1405', destination: 'DEL', aircraft: 'B737-MAX8', pax_count: 182, baggage_kg: 2840, avg_fare_inr: 6300, revenue_inr: 1146600 },
      { flight_no: 'AI 2811', destination: 'IXE', aircraft: 'A320neo', pax_count: 156, baggage_kg: 2280, avg_fare_inr: 3600, revenue_inr: 561600 },
      { flight_no: '6E 1104', destination: 'DXB', aircraft: 'A321neo', pax_count: 222, baggage_kg: 4400, avg_fare_inr: 14500, revenue_inr: 3219000 },
    ],
    teacherGuides: [
      {
        title: 'Total Station Passengers (SUM)',
        targetCell: 'D14',
        formula: '=SUM(D2:D13)',
        plainEnglishExplanation: 'Adds up all numbers in the passenger count range D2 through D13.',
        aviationContext: 'Terminal Operations Manager calculating total passenger throughput during the 06:00-09:00 morning departure wave.',
        expectedResult: '2,252 Passengers',
        commonStudentMistake: 'Writing =D2+D3+D4... manually instead of using the colon (:) range operator.'
      },
      {
        title: 'Average Flight Passenger Load (AVERAGE)',
        targetCell: 'D15',
        formula: '=AVERAGE(D2:D13)',
        plainEnglishExplanation: 'Calculates the arithmetic mean passenger load across all 12 departures.',
        aviationContext: 'Route Planning Team evaluating whether aircraft gauge and seat capacity matches current passenger demand.',
        expectedResult: '187.67 (≈ 188 Pax)',
        commonStudentMistake: 'Typing =AVG() instead of =AVERAGE(). Excel does not support AVG.'
      },
      {
        title: 'Heaviest Baggage Load (MAX) & Lightest (MIN)',
        targetCell: 'E14 & E15',
        formula: '=MAX(E2:E13) and =MIN(E2:E13)',
        plainEnglishExplanation: 'Identifies the extreme values in the baggage weight column.',
        aviationContext: 'Ground handling and ramp loading supervisors dispatching baggage belt loaders and high-capacity tugs.',
        expectedResult: 'MAX: 5,820 kg (AI 804) | MIN: 890 kg (6E 718 ATR-72)',
        commonStudentMistake: 'Selecting headers E1:E13, which can cause type errors if non-numeric values are mixed.'
      },
      {
        title: 'Total Active Departures (COUNT vs COUNTA)',
        targetCell: 'A14 & D14',
        formula: '=COUNT(D2:D13) vs =COUNTA(A2:A13)',
        plainEnglishExplanation: 'COUNT counts only cells with numeric values. COUNTA counts any cell that is NOT empty (including text flight numbers).',
        aviationContext: 'Auditing flight manifests: COUNT ensures passenger records are logged, while COUNTA verifies flight codes are entered.',
        expectedResult: 'Both return 12',
        commonStudentMistake: 'Using =COUNT(A2:A13) on flight strings, which returns 0 because A2:A13 contains text!'
      },
      {
        title: 'Filter Flights by Aircraft Type (COUNTIF)',
        targetCell: 'C14',
        formula: '=COUNTIF(C2:C13, "A320neo")',
        plainEnglishExplanation: 'Counts only the cells in C2:C13 whose text exactly matches "A320neo".',
        aviationContext: 'Engineering line maintenance scheduling ground turnaround equipment for the Airbus A320neo fleet.',
        expectedResult: '3 flights',
        commonStudentMistake: 'Forgetting quotation marks around text criteria: writing =COUNTIF(C2:C13, A320neo) causes #NAME? error.'
      },
      {
        title: 'Widebody Boeing 777 Revenue (SUMIF)',
        targetCell: 'G14',
        formula: '=SUMIF(C2:C13, "B777-300ER", G2:G13)',
        plainEnglishExplanation: 'Evaluates column C for "B777-300ER", and sums the matching values from revenue column G.',
        aviationContext: 'Finance team isolating long-haul widebody contribution from domestic narrowbody routes.',
        expectedResult: '₹57,71,800 (AI 804 + AI 506)',
        commonStudentMistake: 'Reversing the criteria and sum range: writing =SUMIF(G2:G13, "B777-300ER", C2:C13).'
      },
      {
        title: 'Rounded Average Ticket Fare (ROUND)',
        targetCell: 'F14',
        formula: '=ROUND(AVERAGE(F2:F13), -2)',
        plainEnglishExplanation: 'Averages the ticket fares and rounds to the nearest hundred (using negative num_digits -2).',
        aviationContext: 'Commercial pricing desk presenting rounded benchmark fare metrics in corporate management summaries.',
        expectedResult: '₹5,900 (Unrounded average is ₹5,887.50)',
        commonStudentMistake: 'Confusing positive and negative digits: ROUND(val, 2) rounds to 2 decimals, ROUND(val, -2) rounds to hundreds.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // DATASET 2: LOGICAL FUNCTIONS (IF, NESTED IF, IFS, AND, OR)
  // -------------------------------------------------------------------------
  {
    id: 'logical-if',
    title: '2. Logical Functions (IF, Nested IF, IFS, AND, OR)',
    subtitle: 'DGCA Flight Delay Compensation & Frequent Flyer Tier Assignment',
    topic: 'IF, Nested IF, IFS, AND, OR, Compound Conditions',
    category: 'logical_if',
    filename: '02_Aviation_Logical_IF_Nested_IF_Dataset.csv',
    scenarioDescription: 'This dataset covers passenger bookings affected by schedule disruptions at Delhi (DEL) and Bengaluru (BLR). Demonstrate how airline Customer Service Managers automate compensation entitlement according to DGCA CAR Section 3 rules, and how marketing teams assign Frequent Flyer Loyalty Tiers based on accumulated tier miles.',
    columns: [
      { key: 'pnr', header: 'PNR', excelCol: 'A', type: 'text', description: '6-character Passenger Name Record' },
      { key: 'pax_name', header: 'Passenger Name', excelCol: 'B', type: 'text', description: 'Customer full name' },
      { key: 'flight_no', header: 'Flight No', excelCol: 'C', type: 'text', description: 'Booked flight number' },
      { key: 'tier_miles', header: 'Tier Miles', excelCol: 'D', type: 'number', description: 'Accumulated annual frequent flyer miles' },
      { key: 'delay_hrs', header: 'Delay (Hours)', excelCol: 'E', type: 'number', description: 'Total departure delay at gate in hours' },
      { key: 'delay_reason', header: 'Delay Reason', excelCol: 'F', type: 'text', description: 'Root cause logged by Airline Dispatch' },
      { key: 'compensation_due', header: 'DGCA Comp (₹)', excelCol: 'G', type: 'formula', description: 'Calculated via IF / IFS logic' },
      { key: 'loyalty_status', header: 'Loyalty Tier', excelCol: 'H', type: 'formula', description: 'Calculated via Nested IF' },
      { key: 'lounge_access', header: 'Lounge Pass', excelCol: 'I', type: 'formula', description: 'Calculated via OR / AND logic' }
    ],
    rows: [
      { pnr: '6E-4019', pax_name: 'Rajesh Kulkarni', flight_no: '6E 521', tier_miles: 115000, delay_hrs: 4.5, delay_reason: 'Technical Snag', compensation_due: 5000, loyalty_status: 'Platinum Elite', lounge_access: 'YES' },
      { pnr: 'AI-8821', pax_name: 'Pooja Hegde', flight_no: 'AI 804', tier_miles: 62000, delay_hrs: 1.5, delay_reason: 'ATC Hold', compensation_due: 0, loyalty_status: 'Gold Wing', lounge_access: 'YES' },
      { pnr: 'QP-2210', pax_name: 'Arjun Nambiar', flight_no: 'QP 1332', tier_miles: 29500, delay_hrs: 5.0, delay_reason: 'Aircraft AOG', compensation_due: 5000, loyalty_status: 'Silver Crest', lounge_access: 'NO' },
      { pnr: '6E-9932', pax_name: 'Sunita Sharma', flight_no: '6E 204', tier_miles: 8400, delay_hrs: 0.0, delay_reason: 'On Time', compensation_due: 0, loyalty_status: 'Blue Base', lounge_access: 'NO' },
      { pnr: 'UK-7714', pax_name: 'Capt. Dhruv Sen', flight_no: 'UK 815', tier_miles: 142000, delay_hrs: 6.2, delay_reason: 'Technical Snag', compensation_due: 10000, loyalty_status: 'Platinum Elite', lounge_access: 'YES' },
      { pnr: 'SG-3310', pax_name: 'Deepak Roy', flight_no: 'SG 401', tier_miles: 18000, delay_hrs: 3.5, delay_reason: 'Weather Fog', compensation_due: 0, loyalty_status: 'Blue Base', lounge_access: 'NO' },
      { pnr: 'AI-1044', pax_name: 'Kavita Menon', flight_no: 'AI 506', tier_miles: 51000, delay_hrs: 2.0, delay_reason: 'Late Inbound', compensation_due: 0, loyalty_status: 'Gold Wing', lounge_access: 'YES' },
      { pnr: '6E-6651', pax_name: 'Aditya Prasad', flight_no: '6E 1104', tier_miles: 34000, delay_hrs: 4.0, delay_reason: 'Crew Sickness', compensation_due: 5000, loyalty_status: 'Silver Crest', lounge_access: 'NO' },
      { pnr: 'QP-9081', pax_name: 'Farhan Akhtar', flight_no: 'QP 1405', tier_miles: 75000, delay_hrs: 0.5, delay_reason: 'Ramp Congestion', compensation_due: 0, loyalty_status: 'Gold Wing', lounge_access: 'YES' },
      { pnr: 'AI-3012', pax_name: 'Meera Deshmukh', flight_no: 'AI 2811', tier_miles: 104000, delay_hrs: 7.0, delay_reason: 'Aircraft AOG', compensation_due: 10000, loyalty_status: 'Platinum Elite', lounge_access: 'YES' },
    ],
    teacherGuides: [
      {
        title: 'Basic IF: DGCA Delay Statutory Threshold',
        targetCell: 'G2',
        formula: '=IF(E2>=4, 5000, 0)',
        plainEnglishExplanation: 'If flight delay in cell E2 is 4 hours or more, return ₹5,000 statutory compensation; otherwise return 0.',
        aviationContext: 'DGCA CAR Section 3 stipulates mandatory compensation for controllable airline delays exceeding 4 hours.',
        expectedResult: 'Row 2 returns 5000 (delay is 4.5 hrs)',
        commonStudentMistake: 'Writing text in quotes for numbers like "5000", which prevents later summing with =SUM(G2:G11).'
      },
      {
        title: 'Compound IF with AND: Controllable Airline Fault',
        targetCell: 'G2 (Enhanced)',
        formula: '=IF(AND(E2>=4, F2="Technical Snag"), 5000, 0)',
        plainEnglishExplanation: 'Both conditions must be TRUE: delay must be >= 4 hours AND reason must be "Technical Snag". Weather delays are exempt.',
        aviationContext: 'Airlines are legally exempt from compensation when delays are caused by Force Majeure (severe weather, ATC restrictions).',
        expectedResult: 'Only compensates if delay is substantial AND airline-caused.',
        commonStudentMistake: 'Writing =IF(E2>=4 AND F2="Technical Snag") without wrapping AND as a function =IF(AND(...)).'
      },
      {
        title: 'Nested IF: Frequent Flyer Tier Classification',
        targetCell: 'H2',
        formula: '=IF(D2>=100000, "Platinum Elite", IF(D2>=50000, "Gold Wing", IF(D2>=25000, "Silver Crest", "Blue Base")))',
        plainEnglishExplanation: 'Evaluates tier miles step by step from highest to lowest threshold until a true condition is met.',
        aviationContext: 'Air India Flying Returns / IndiGo BluChip automatic loyalty tier ranking system.',
        expectedResult: 'Rajesh (115,000 miles) ➔ "Platinum Elite"',
        commonStudentMistake: 'Writing conditions in ascending order (e.g. IF(D2>=25000...)), which causes everyone with 100k miles to be trapped in Silver Crest!'
      },
      {
        title: 'Modern IFS Function (Cleaner Alternative)',
        targetCell: 'H2 (Alternative)',
        formula: '=IFS(D2>=100000, "Platinum Elite", D2>=50000, "Gold Wing", D2>=25000, "Silver Crest", TRUE, "Blue Base")',
        plainEnglishExplanation: 'Tests pairs of condition/value without needing multiple nested parentheses. TRUE acts as the default "ELSE".',
        aviationContext: 'Modern Office 365 & Google Sheets clean formula architecture for business logic.',
        expectedResult: 'Identical output to Nested IF, with zero parenthesis nesting errors.',
        commonStudentMistake: 'Forgetting the fallback TRUE at the end; if no conditions match and TRUE is absent, IFS returns #N/A.'
      },
      {
        title: 'Logical OR: VIP Lounge Access Authorization',
        targetCell: 'I2',
        formula: '=IF(OR(H2="Platinum Elite", H2="Gold Wing"), "YES", "NO")',
        plainEnglishExplanation: 'Grants lounge entry if the passenger holds EITHER Platinum Elite OR Gold Wing status.',
        aviationContext: 'Airside security and lounge reception barcode scanner logic at BIAL Terminal 2 080 Lounge.',
        expectedResult: 'Platinum & Gold = YES | Silver & Blue = NO',
        commonStudentMistake: 'Typing =IF(H2="Platinum Elite" OR "Gold Wing") instead of specifying the variable twice inside OR().'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // DATASET 3: LOOKUP FUNCTIONS (VLOOKUP & HLOOKUP)
  // -------------------------------------------------------------------------
  {
    id: 'vlookup-hlookup',
    title: '3. Lookup Functions (VLOOKUP & HLOOKUP)',
    subtitle: 'Air Cargo Air Waybill (AWB) Master & Fuel Burn Tariff Matrix',
    topic: 'VLOOKUP (Exact & Approximate Match), HLOOKUP (Horizontal Matrix)',
    category: 'vlookup_hlookup',
    filename: '03_Aviation_VLOOKUP_HLOOKUP_Tariffs.csv',
    scenarioDescription: 'This workbook features two parts: an active shipment transaction log (Columns A to G) and reference tables (Columns I to L for Airport Master, Columns N to P for Weight Rate Tiers, and Rows 11-13 for Aircraft Fuel Burn). Demonstrate exact matching (FALSE/0), approximate tier lookup (TRUE/1), and horizontal row lookups (HLOOKUP).',
    columns: [
      { key: 'awb_no', header: 'Air Waybill (AWB)', excelCol: 'A', type: 'text', description: 'Shipment tracking number' },
      { key: 'dest_code', header: 'Dest Code', excelCol: 'B', type: 'text', description: 'Target airport code' },
      { key: 'dest_city', header: 'Destination City', excelCol: 'C', type: 'formula', description: '=VLOOKUP(B2, $I$2:$L$8, 2, FALSE)' },
      { key: 'distance_km', header: 'Distance (km)', excelCol: 'D', type: 'formula', description: '=VLOOKUP(B2, $I$2:$L$8, 3, FALSE)' },
      { key: 'cargo_weight_kg', header: 'Weight (kg)', excelCol: 'E', type: 'number', description: 'Shipment gross weight' },
      { key: 'rate_per_kg', header: 'Rate/kg (₹)', excelCol: 'F', type: 'formula', description: '=VLOOKUP(E2, $N$2:$P$6, 2, TRUE) (Approx match)' },
      { key: 'total_freight_inr', header: 'Total Cost (₹)', excelCol: 'G', type: 'formula', description: '=(E2*F2) + Handling Fee' }
    ],
    rows: [
      { awb_no: 'AWB-9011', dest_code: 'DEL', dest_city: 'New Delhi', distance_km: 1740, cargo_weight_kg: 850, rate_per_kg: 85, total_freight_inr: 73450 },
      { awb_no: 'AWB-9012', dest_code: 'BOM', dest_city: 'Mumbai', distance_km: 840, cargo_weight_kg: 120, rate_per_kg: 100, total_freight_inr: 12950 },
      { awb_no: 'AWB-9013', dest_code: 'HYD', dest_city: 'Hyderabad', distance_km: 500, cargo_weight_kg: 45, rate_per_kg: 120, total_freight_inr: 6000 },
      { awb_no: 'AWB-9014', dest_code: 'MAA', dest_city: 'Chennai', distance_km: 290, cargo_weight_kg: 1400, rate_per_kg: 70, total_freight_inr: 98450 },
      { awb_no: 'AWB-9015', dest_code: 'GOI', dest_city: 'Goa Dabolim', distance_km: 560, cargo_weight_kg: 620, rate_per_kg: 85, total_freight_inr: 53350 },
      { awb_no: 'AWB-9016', dest_code: 'CCU', dest_city: 'Kolkata', distance_km: 1560, cargo_weight_kg: 90, rate_per_kg: 120, total_freight_inr: 11900 },
      { awb_no: 'AWB-9017', dest_code: 'COK', dest_city: 'Kochi', distance_km: 370, cargo_weight_kg: 2800, rate_per_kg: 55, total_freight_inr: 154500 },
      { awb_no: 'AWB-9018', dest_code: 'DEL', dest_city: 'New Delhi', distance_km: 1740, cargo_weight_kg: 350, rate_per_kg: 100, total_freight_inr: 36200 },
    ],
    lookupTables: [
      {
        title: 'Airport Master Reference Table (VLOOKUP Target)',
        description: 'Placed at range I2:L8. Demonstrates exact match lookups for city names, flight distance, and terminal surcharge fees.',
        range: 'I2:L8',
        columns: [
          { key: 'code', header: 'Airport Code', excelCol: 'I', type: 'text' },
          { key: 'city', header: 'City Name', excelCol: 'J', type: 'text' },
          { key: 'dist', header: 'Distance (km)', excelCol: 'K', type: 'number' },
          { key: 'fee', header: 'Terminal Handling (₹)', excelCol: 'L', type: 'currency' }
        ],
        rows: [
          { code: 'DEL', city: 'New Delhi', dist: 1740, fee: 1200 },
          { code: 'BOM', city: 'Mumbai', dist: 840, fee: 950 },
          { code: 'HYD', city: 'Hyderabad', dist: 500, fee: 600 },
          { code: 'MAA', city: 'Chennai', dist: 290, fee: 450 },
          { code: 'GOI', city: 'Goa Dabolim', dist: 560, fee: 650 },
          { code: 'CCU', city: 'Kolkata', dist: 1560, fee: 1100 },
          { code: 'COK', city: 'Kochi', dist: 370, fee: 500 },
        ]
      },
      {
        title: 'Cargo Weight Tier Discount Table (Approximate Match)',
        description: 'Placed at range N2:P6. Must be sorted in ascending order. Demonstrates approximate match (TRUE/1).',
        range: 'N2:P6',
        columns: [
          { key: 'min_kg', header: 'Min Weight (kg)', excelCol: 'N', type: 'number' },
          { key: 'rate', header: 'Rate per kg (₹)', excelCol: 'O', type: 'currency' },
          { key: 'tier', header: 'Tier Code', excelCol: 'P', type: 'text' }
        ],
        rows: [
          { min_kg: 0, rate: 120, tier: 'STANDARD' },
          { min_kg: 100, rate: 100, tier: 'BULK_1' },
          { min_kg: 500, rate: 85, tier: 'BULK_2' },
          { min_kg: 1000, rate: 70, tier: 'COMMERCIAL' },
          { min_kg: 2500, rate: 55, tier: 'HEAVY_CARGO' }
        ]
      }
    ],
    horizontalTable: {
      title: 'Aircraft Operational Parameter Table (HLOOKUP Target)',
      description: 'Placed at range I11:M13. Data is organized horizontally in rows across aircraft columns.',
      range: 'I11:M13',
      rowHeaders: [
        'Row 11: Aircraft Family',
        'Row 12: Fuel Burn (kg/hr)',
        'Row 13: Hourly Wet Lease (₹)'
      ],
      matrix: [
        ['Parameter', 'A320neo', 'B737-MAX8', 'ATR-72', 'B777-300ER'],
        ['Fuel Burn (kg/hr)', 2100, 2250, 680, 7500],
        ['Hourly Wet Lease (₹)', 185000, 192000, 95000, 480000]
      ]
    },
    teacherGuides: [
      {
        title: 'VLOOKUP Exact Match (City Name)',
        targetCell: 'C2',
        formula: '=VLOOKUP(B2, $I$2:$L$8, 2, FALSE)',
        plainEnglishExplanation: 'Searches for destination code B2 in the first column of the Airport Master ($I$2:$L$8) and extracts the 2nd column (City). FALSE enforces an exact character match.',
        aviationContext: 'Airside logistics dispatch resolving IATA airport codes into operational terminal destinations.',
        expectedResult: '"New Delhi"',
        commonStudentMistake: 'Forgetting the $ dollar signs on the table range ($I$2:$L$8); when dragged down, relative shift causes table reference to slide into blank rows.'
      },
      {
        title: 'VLOOKUP Exact Match with Column 3 (Distance)',
        targetCell: 'D2',
        formula: '=VLOOKUP(B2, $I$2:$L$8, 3, FALSE)',
        plainEnglishExplanation: 'Retrieves flight nautical/ground distance in kilometers from column 3 of the master table.',
        aviationContext: 'Flight dispatch estimating flight block hours and fuel endurance requirements.',
        expectedResult: '1740 km',
        commonStudentMistake: 'Typing column letter "K" instead of column index number 3.'
      },
      {
        title: 'VLOOKUP Approximate Match (Cargo Rate Tiers)',
        targetCell: 'F2',
        formula: '=VLOOKUP(E2, $N$2:$P$6, 2, TRUE)',
        plainEnglishExplanation: 'Searches for cargo weight E2 (850 kg) in N2:P6. Since 850 is between 500 and 1000, TRUE matches the closest smaller value (500 kg) and returns ₹85/kg.',
        aviationContext: 'Volume weight breaks in commercial air cargo pricing (IATA cargo tariff rules).',
        expectedResult: '₹85/kg',
        commonStudentMistake: 'Attempting approximate match on an unsorted table; VLOOKUP with TRUE produces unpredictable errors if column 1 is not in ascending order.'
      },
      {
        title: 'HLOOKUP Horizontal Parameter Extraction',
        targetCell: 'Class Demonstration',
        formula: '=HLOOKUP("A320neo", $I$11:$M$13, 2, FALSE)',
        plainEnglishExplanation: 'Searches horizontally across the top row (Row 11) for "A320neo", then moves down to Row 2 of the range to extract Fuel Burn.',
        aviationContext: 'Operations control comparing hourly fuel consumption across heterogeneous aircraft fleets.',
        expectedResult: '2,100 kg/hr',
        commonStudentMistake: 'Confusing row index with Excel row number: row_index 2 refers to the 2nd row of the selected range (Row 12), not Excel Row 2.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // DATASET 4: MODERN XLOOKUP (ADVANCED POWERHOUSE)
  // -------------------------------------------------------------------------
  {
    id: 'xlookup-advanced',
    title: '4. Modern XLOOKUP (Leftward Lookups & Fallbacks)',
    subtitle: 'Flight Crew Roster & Aircraft Maintenance Snag Dispatch',
    topic: 'XLOOKUP (Exact, Reverse/Leftward, [if_not_found], Range)',
    category: 'xlookup_advanced',
    filename: '04_Aviation_XLOOKUP_Crew_Snag_Master.csv',
    scenarioDescription: 'Demonstrate why Microsoft Excel 365 and Google Sheets introduced XLOOKUP to replace VLOOKUP and INDEX-MATCH. With XLOOKUP, columns can be searched leftward, missing values are handled gracefully with [if_not_found] without #N/A, and inserting columns never breaks formulas.',
    columns: [
      { key: 'emp_id', header: 'Staff ID', excelCol: 'A', type: 'text', description: 'Employee badge code' },
      { key: 'assigned_flight', header: 'Assigned Flight', excelCol: 'B', type: 'text', description: 'Flight code from daily roster' },
      { key: 'staff_name', header: 'Crew Name', excelCol: 'C', type: 'formula', description: '=XLOOKUP(A2, $H$2:$H$11, $I$2:$I$11)' },
      { key: 'role', header: 'Designation', excelCol: 'D', type: 'formula', description: '=XLOOKUP(A2, $H$2:$H$11, $J$2:$J$11)' },
      { key: 'aircraft_tail', header: 'Aircraft Tail No', excelCol: 'E', type: 'formula', description: '=XLOOKUP(B2, $M$2:$M$11, $L$2:$L$11) (LEFTWARD!)' },
      { key: 'snag_status', header: 'Tech Snag Alert', excelCol: 'F', type: 'formula', description: '=XLOOKUP(B2, $M$2:$M$11, $N$2:$N$11, "NO ACTIVE SNAG")' }
    ],
    rows: [
      { emp_id: 'EMP-101', assigned_flight: '6E 521', staff_name: 'Capt. Aarav Verma', role: 'Commander', aircraft_tail: 'VT-IZU', snag_status: 'NO ACTIVE SNAG' },
      { emp_id: 'EMP-102', assigned_flight: 'AI 804', staff_name: 'FO Sneha Patil', role: 'First Officer', aircraft_tail: 'VT-ALQ', snag_status: 'APU Valve Glitch' },
      { emp_id: 'EMP-103', assigned_flight: 'QP 1332', staff_name: 'Rohan Mehra', role: 'Cabin Lead', aircraft_tail: 'VT-YAA', snag_status: 'NO ACTIVE SNAG' },
      { emp_id: 'EMP-104', assigned_flight: '6E 204', staff_name: 'Capt. Priya Nair', role: 'Commander', aircraft_tail: 'VT-IFM', snag_status: 'Cabin Chime Sensor' },
      { emp_id: 'EMP-105', assigned_flight: '6E 9999', staff_name: 'Vikram Joshi', role: 'Flight Dispatcher', aircraft_tail: 'STANDBY', snag_status: 'STANDBY / NOT FLYING' },
      { emp_id: 'EMP-106', assigned_flight: 'UK 815', staff_name: 'Ananya Roy', role: 'Senior Purser', aircraft_tail: 'VT-TTB', snag_status: 'NO ACTIVE SNAG' },
      { emp_id: 'EMP-107', assigned_flight: 'SG 401', staff_name: 'Capt. Tariq Khan', role: 'Commander', aircraft_tail: 'VT-SGZ', snag_status: 'Radar Transponder Test' },
      { emp_id: 'EMP-108', assigned_flight: 'AI 506', staff_name: 'FO Neha Sharma', role: 'First Officer', aircraft_tail: 'VT-ALK', snag_status: 'NO ACTIVE SNAG' },
    ],
    lookupTables: [
      {
        title: 'Crew Personnel Database (Range H2:J11)',
        description: 'Reference table for staff ID lookups.',
        range: 'H2:J11',
        columns: [
          { key: 'ref_id', header: 'Staff ID', excelCol: 'H', type: 'text' },
          { key: 'ref_name', header: 'Full Name', excelCol: 'I', type: 'text' },
          { key: 'ref_role', header: 'Rank / Role', excelCol: 'J', type: 'text' }
        ],
        rows: [
          { ref_id: 'EMP-101', ref_name: 'Capt. Aarav Verma', ref_role: 'Commander' },
          { ref_id: 'EMP-102', ref_name: 'FO Sneha Patil', ref_role: 'First Officer' },
          { ref_id: 'EMP-103', ref_name: 'Rohan Mehra', ref_role: 'Cabin Lead' },
          { ref_id: 'EMP-104', ref_name: 'Capt. Priya Nair', ref_role: 'Commander' },
          { ref_id: 'EMP-105', ref_name: 'Vikram Joshi', ref_role: 'Flight Dispatcher' },
          { ref_id: 'EMP-106', ref_name: 'Ananya Roy', ref_role: 'Senior Purser' },
          { ref_id: 'EMP-107', ref_name: 'Capt. Tariq Khan', ref_role: 'Commander' },
          { ref_id: 'EMP-108', ref_name: 'FO Neha Sharma', ref_role: 'First Officer' }
        ]
      },
      {
        title: 'Aircraft Dispatch & Snag Board (Range L2:N11 - Leftward Key!)',
        description: 'Notice that Flight Number is in Column M, while Aircraft Tail Number is to its LEFT in Column L!',
        range: 'L2:N11',
        columns: [
          { key: 'ref_tail', header: 'Tail No (Col L)', excelCol: 'L', type: 'text' },
          { key: 'ref_flight', header: 'Flight No (Col M - KEY)', excelCol: 'M', type: 'text' },
          { key: 'ref_snag', header: 'Open Snag Log (Col N)', excelCol: 'N', type: 'text' }
        ],
        rows: [
          { ref_tail: 'VT-IZU', ref_flight: '6E 521', ref_snag: 'Nil' },
          { ref_tail: 'VT-ALQ', ref_flight: 'AI 804', ref_snag: 'APU Valve Glitch' },
          { ref_tail: 'VT-YAA', ref_flight: 'QP 1332', ref_snag: 'Nil' },
          { ref_tail: 'VT-IFM', ref_flight: '6E 204', ref_snag: 'Cabin Chime Sensor' },
          { ref_tail: 'VT-TTB', ref_flight: 'UK 815', ref_snag: 'Nil' },
          { ref_tail: 'VT-SGZ', ref_flight: 'SG 401', ref_snag: 'Radar Transponder Test' },
          { ref_tail: 'VT-ALK', ref_flight: 'AI 506', ref_snag: 'Nil' },
        ]
      }
    ],
    teacherGuides: [
      {
        title: 'Standard Exact XLOOKUP (No column counting!)',
        targetCell: 'C2',
        formula: '=XLOOKUP(A2, $H$2:$H$11, $I$2:$I$11)',
        plainEnglishExplanation: 'Looks up employee ID A2 in the lookup array H2:H11 and returns the matching name from return array I2:I11. Exact match is default!',
        aviationContext: 'Aviation crew planning extracting pilot records without memorizing static column index numbers.',
        expectedResult: '"Capt. Aarav Verma"',
        commonStudentMistake: 'Trying to pass the whole table like VLOOKUP. XLOOKUP requires two separate vectors: lookup_array and return_array.'
      },
      {
        title: 'Leftward / Reverse Lookup (Impossible in classic VLOOKUP)',
        targetCell: 'E2',
        formula: '=XLOOKUP(B2, $M$2:$M$11, $L$2:$L$11, "STANDBY")',
        plainEnglishExplanation: 'Looks up Flight Number in Column M, and extracts Tail Number from Column L which is to the LEFT! VLOOKUP cannot look left without restructuring the table.',
        aviationContext: 'Ground dispatch linking flight schedules to aircraft registration tails when ERP databases format keys in non-first columns.',
        expectedResult: 'VT-IZU',
        commonStudentMistake: 'Assuming lookup values must always be in the first column of the worksheet.'
      },
      {
        title: 'Built-in Missing Value Handling ([if_not_found])',
        targetCell: 'F2',
        formula: '=XLOOKUP(B2, $M$2:$M$11, $N$2:$N$11, "NO ACTIVE SNAG")',
        plainEnglishExplanation: 'If flight B2 has no recorded snag in the maintenance table, it cleanly outputs "NO ACTIVE SNAG" instead of the ugly #N/A error.',
        aviationContext: 'Daily airworthiness safety logs presented to the Chief Pilot before engine start.',
        expectedResult: 'Returns snag text if found, otherwise returns "NO ACTIVE SNAG".',
        commonStudentMistake: 'Nesting =IFERROR(VLOOKUP(...)) when XLOOKUP provides the 4th argument [if_not_found] natively.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // DATASET 5: PIVOT TABLES & PIVOT CHARTS MASTER DATASET (50+ ROWS)
  // -------------------------------------------------------------------------
  {
    id: 'pivot-table-charts',
    title: '5. Pivot Tables & Pivot Charts Master Dataset',
    subtitle: 'Kempegowda International Airport (BLR) 24-Hour Flight Traffic Manifest (50 Flights)',
    topic: 'Pivot Tables, Pivot Charts, Slicers, Summarization, Grouping',
    category: 'pivot_table_charts',
    filename: '05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv',
    scenarioDescription: 'A multi-dimensional operational dataset featuring 50 commercial departures and arrivals across 5 airlines (IndiGo, Air India, Akasa Air, Vistara, SpiceJet), Terminals 1 & 2, multiple aircraft gauges, flight types (Domestic/International), passenger loads, baggage counts, on-time status, and delay minutes. Designed specifically for drag-and-drop Pivot Table and Pivot Chart demonstrations.',
    columns: [
      { key: 'flight_id', header: 'Flight ID', excelCol: 'A', type: 'text', description: 'Unique flight key' },
      { key: 'airline', header: 'Airline', excelCol: 'B', type: 'text', description: 'Operating airline carrier' },
      { key: 'terminal', header: 'Terminal', excelCol: 'C', type: 'text', description: 'Terminal 1 or Terminal 2' },
      { key: 'sector', header: 'Sector (Route)', excelCol: 'D', type: 'text', description: 'Origin - Destination route pair' },
      { key: 'aircraft', header: 'Aircraft Type', excelCol: 'E', type: 'text', description: 'Aircraft model' },
      { key: 'flight_type', header: 'Flight Type', excelCol: 'F', type: 'text', description: 'Domestic vs International' },
      { key: 'time_slot', header: 'Time Slot', excelCol: 'G', type: 'text', description: 'Morning, Afternoon, Evening, Night' },
      { key: 'pax_capacity', header: 'Capacity', excelCol: 'H', type: 'number', description: 'Total passenger seats on aircraft' },
      { key: 'pax_booked', header: 'Pax Booked', excelCol: 'I', type: 'number', description: 'Actual passengers on board' },
      { key: 'baggage_pcs', header: 'Baggage (Pcs)', excelCol: 'J', type: 'number', description: 'Total checked baggage pieces' },
      { key: 'status', header: 'Flight Status', excelCol: 'K', type: 'text', description: 'On-Time, Delayed, Cancelled' },
      { key: 'delay_mins', header: 'Delay (Mins)', excelCol: 'L', type: 'number', description: 'Minutes behind scheduled gate departure' },
      { key: 'delay_reason', header: 'Delay Reason', excelCol: 'M', type: 'text', description: 'Root cause category' }
    ],
    rows: [
      { flight_id: 'FL-101', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 222, pax_booked: 216, baggage_pcs: 245, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-102', airline: 'Air India', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'B777-300ER', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 342, pax_booked: 330, baggage_pcs: 410, status: 'Delayed', delay_mins: 45, delay_reason: 'Late Inbound Aircraft' },
      { flight_id: 'FL-103', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 189, pax_booked: 182, baggage_pcs: 198, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-104', airline: 'Vistara', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 164, pax_booked: 160, baggage_pcs: 185, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-105', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-CCU', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 189, pax_booked: 171, baggage_pcs: 162, status: 'Delayed', delay_mins: 65, delay_reason: 'Technical Snag' },
      { flight_id: 'FL-106', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-HYD', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 186, pax_booked: 178, baggage_pcs: 190, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-107', airline: 'Air India', terminal: 'T2', sector: 'BLR-LHR', aircraft: 'B787-8', flight_type: 'International', time_slot: 'Morning', pax_capacity: 256, pax_booked: 248, baggage_pcs: 490, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-108', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-MAA', aircraft: 'ATR-72', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 72, pax_booked: 68, baggage_pcs: 75, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-109', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-GOI', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 189, pax_booked: 185, baggage_pcs: 210, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-110', airline: 'Vistara', terminal: 'T2', sector: 'BLR-BOM', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 164, pax_booked: 155, baggage_pcs: 170, status: 'Delayed', delay_mins: 20, delay_reason: 'ATC Congestion' },
      { flight_id: 'FL-111', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-COK', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 186, pax_booked: 174, baggage_pcs: 180, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-112', airline: 'Air India', terminal: 'T2', sector: 'BLR-BOM', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 180, pax_booked: 168, baggage_pcs: 195, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-113', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 189, pax_booked: 180, baggage_pcs: 205, status: 'Delayed', delay_mins: 35, delay_reason: 'Baggage Loading Hold' },
      { flight_id: 'FL-114', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-GOI', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 189, pax_booked: 165, baggage_pcs: 155, status: 'Cancelled', delay_mins: 0, delay_reason: 'Aircraft AOG' },
      { flight_id: 'FL-115', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DXB', aircraft: 'A321neo', flight_type: 'International', time_slot: 'Afternoon', pax_capacity: 222, pax_booked: 220, baggage_pcs: 460, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-116', airline: 'Vistara', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 188, pax_booked: 184, baggage_pcs: 215, status: 'Delayed', delay_mins: 15, delay_reason: 'ATC Congestion' },
      { flight_id: 'FL-117', airline: 'Air India', terminal: 'T2', sector: 'BLR-HYD', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 180, pax_booked: 162, baggage_pcs: 172, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-118', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-IXE', aircraft: 'ATR-72', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 72, pax_booked: 70, baggage_pcs: 78, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-119', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-HYD', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 189, pax_booked: 176, baggage_pcs: 192, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-120', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 189, pax_booked: 175, baggage_pcs: 168, status: 'Delayed', delay_mins: 80, delay_reason: 'Late Inbound Aircraft' },
      { flight_id: 'FL-121', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 222, pax_booked: 219, baggage_pcs: 250, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-122', airline: 'Air India', terminal: 'T2', sector: 'BLR-SFO', aircraft: 'B777-200LR', flight_type: 'International', time_slot: 'Evening', pax_capacity: 288, pax_booked: 282, baggage_pcs: 620, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-123', airline: 'Vistara', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 164, pax_booked: 161, baggage_pcs: 182, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-124', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 189, pax_booked: 184, baggage_pcs: 202, status: 'Delayed', delay_mins: 30, delay_reason: 'ATC Congestion' },
      { flight_id: 'FL-125', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-CCU', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 186, pax_booked: 180, baggage_pcs: 198, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-126', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 189, pax_booked: 168, baggage_pcs: 160, status: 'Delayed', delay_mins: 50, delay_reason: 'Crew Duty Exceeded' },
      { flight_id: 'FL-127', airline: 'Air India', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 192, pax_booked: 188, baggage_pcs: 220, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-128', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-SIN', aircraft: 'A321neo', flight_type: 'International', time_slot: 'Evening', pax_capacity: 222, pax_booked: 218, baggage_pcs: 440, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-129', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-GOI', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 189, pax_booked: 187, baggage_pcs: 212, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-130', airline: 'Vistara', terminal: 'T2', sector: 'BLR-HYD', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 164, pax_booked: 158, baggage_pcs: 165, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-131', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 186, pax_booked: 172, baggage_pcs: 186, status: 'Delayed', delay_mins: 25, delay_reason: 'ATC Congestion' },
      { flight_id: 'FL-132', airline: 'Air India', terminal: 'T2', sector: 'BLR-DXB', aircraft: 'A320neo', flight_type: 'International', time_slot: 'Night', pax_capacity: 180, pax_booked: 175, baggage_pcs: 390, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-133', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 189, pax_booked: 178, baggage_pcs: 195, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-134', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-MAA', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 189, pax_booked: 154, baggage_pcs: 140, status: 'Delayed', delay_mins: 75, delay_reason: 'Late Inbound Aircraft' },
      { flight_id: 'FL-135', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-HYD', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 186, pax_booked: 169, baggage_pcs: 175, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-136', airline: 'Vistara', terminal: 'T2', sector: 'BLR-BOM', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 164, pax_booked: 159, baggage_pcs: 172, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-137', airline: 'Air India', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'B777-300ER', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 342, pax_booked: 335, baggage_pcs: 420, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-138', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 222, pax_booked: 215, baggage_pcs: 242, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-139', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-CCU', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 189, pax_booked: 181, baggage_pcs: 196, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-140', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-HYD', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Morning', pax_capacity: 189, pax_booked: 162, baggage_pcs: 150, status: 'Cancelled', delay_mins: 0, delay_reason: 'Crew Sickness' },
      { flight_id: 'FL-141', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DOH', aircraft: 'A321neo', flight_type: 'International', time_slot: 'Morning', pax_capacity: 222, pax_booked: 212, baggage_pcs: 435, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-142', airline: 'Air India', terminal: 'T2', sector: 'BLR-BOM', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 180, pax_booked: 171, baggage_pcs: 188, status: 'Delayed', delay_mins: 40, delay_reason: 'Technical Snag' },
      { flight_id: 'FL-143', airline: 'Vistara', terminal: 'T2', sector: 'BLR-DEL', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 188, pax_booked: 182, baggage_pcs: 210, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-144', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-COK', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Afternoon', pax_capacity: 189, pax_booked: 179, baggage_pcs: 188, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-145', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 186, pax_booked: 183, baggage_pcs: 199, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-146', airline: 'Air India', terminal: 'T2', sector: 'BLR-MAA', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 180, pax_booked: 165, baggage_pcs: 178, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-147', airline: 'SpiceJet', terminal: 'T1', sector: 'BLR-DEL', aircraft: 'B737-800', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 189, pax_booked: 170, baggage_pcs: 165, status: 'Delayed', delay_mins: 90, delay_reason: 'Weather / Rain' },
      { flight_id: 'FL-148', airline: 'Vistara', terminal: 'T2', sector: 'BLR-CCU', aircraft: 'A320neo', flight_type: 'Domestic', time_slot: 'Evening', pax_capacity: 164, pax_booked: 157, baggage_pcs: 169, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-149', airline: 'Akasa Air', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'B737-MAX8', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 189, pax_booked: 186, baggage_pcs: 204, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
      { flight_id: 'FL-150', airline: 'IndiGo', terminal: 'T1', sector: 'BLR-BOM', aircraft: 'A321neo', flight_type: 'Domestic', time_slot: 'Night', pax_capacity: 222, pax_booked: 217, baggage_pcs: 248, status: 'On-Time', delay_mins: 0, delay_reason: 'None' },
    ],
    teacherGuides: [
      {
        title: 'Creating the Pivot Table Canvas in Excel',
        targetCell: 'Insert > PivotTable',
        formula: 'Select A1:M51 > Insert > PivotTable > New Worksheet',
        plainEnglishExplanation: 'Creates a dynamic aggregation engine from the 50-row aviation dataset without modifying the raw data.',
        aviationContext: 'Airport Operations Control Centre (AOCC) generating daily executive performance scorecards.',
        expectedResult: 'Empty PivotTable field pane appears on the right with Rows, Columns, Values, Filters.',
        commonStudentMistake: 'Selecting blank rows below row 51, which introduces "(blank)" categories into the analysis.'
      }
    ],
    pivotGuides: [
      {
        title: 'Exercise 1: Passenger Volume by Airline & Terminal',
        objective: 'Analyze how passenger traffic is distributed between Terminal 1 (Low-Cost Carriers) and Terminal 2 (Full-Service & International Carriers).',
        rows: ['Airline'],
        columns: ['Terminal'],
        values: ['Sum of Pax Booked'],
        filters: ['Flight Type'],
        chartType: 'Clustered Column Chart',
        keyInsights: 'IndiGo and Akasa dominate T1 volume; Air India and Vistara handle T2 premium traffic.'
      },
      {
        title: 'Exercise 2: On-Time Performance & Punctuality Breakdown',
        objective: 'Count flights across status categories (On-Time, Delayed, Cancelled) per airline to determine reliability.',
        rows: ['Airline'],
        columns: ['Flight Status'],
        values: ['Count of Flight ID'],
        filters: ['Time Slot'],
        chartType: '100% Stacked Bar Chart',
        keyInsights: 'IndiGo and Vistara demonstrate >85% On-Time performance; SpiceJet has higher delay and cancellation frequency.'
      },
      {
        title: 'Exercise 3: Root-Cause Delay Analysis (Average Delay Mins)',
        objective: 'Isolate which operational bottlenecks cause the longest delays across the airport.',
        rows: ['Delay Reason'],
        columns: [],
        values: ['Average of Delay Mins', 'Count of Flight ID'],
        filters: ['Terminal'],
        chartType: 'Horizontal Bar Chart',
        keyInsights: 'Weather and Late Inbound Aircraft generate the highest average delay minutes (60-90 mins per affected flight).'
      },
      {
        title: 'Exercise 4: Hourly Departure Bank Congestion (Time Slots)',
        objective: 'Track flight traffic concentration through Morning, Afternoon, Evening, and Night waves.',
        rows: ['Time Slot'],
        columns: ['Flight Type'],
        values: ['Count of Flight ID', 'Sum of Baggage Pcs'],
        filters: [],
        chartType: 'Line Chart or Area Chart',
        keyInsights: 'Morning and Evening waves exhibit peak baggage handling requirements (over 2,500 pieces per bank).'
      }
    ]
  }
];
