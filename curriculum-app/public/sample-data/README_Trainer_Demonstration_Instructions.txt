========================================================================================
INTRODUCTION TO COMPUTING SKILLS (ICS) - SPREADSHEET DEMO WORKBOOK SUITE
Course Code: Z7AVA 26209 / Z7AVB 26209 | Alliance University (B.Sc & BBA Aviation)
Author: S D Sandarsh | Communicative English & Soft Skills Trainer (+91 97437 11584)
========================================================================================

Welcome to the official live demonstration dataset package for Unit 3: Microsoft Excel 
& Data Analysis. These 5 datasets are custom-architected for aviation operations, cargo 
logistics, passenger loyalty, crew scheduling, and terminal throughput.

----------------------------------------------------------------------------------------
FILE 1: 01_Aviation_Essential_Functions_Dataset.csv
TOPIC: Essential Mathematical & Statistical Functions
----------------------------------------------------------------------------------------
Scenario: BLR Kempegowda Airport Morning Bank Flight Revenue & Baggage Manifest (12 Flights)
Demonstration Goals:
1. Total Passengers Handled:
   Cell D14 -> =SUM(D2:D13)                     [Result: 2,252 Pax]
2. Average Flight Passenger Load:
   Cell D15 -> =AVERAGE(D2:D13)                 [Result: 187.67 Pax]
3. Heaviest Baggage Load:
   Cell E14 -> =MAX(E2:E13)                     [Result: 5,820 kg (B777-300ER)]
4. Lightest Regional Baggage Load:
   Cell E15 -> =MIN(E2:E13)                     [Result: 890 kg (ATR-72)]
5. Active Flights Checked-in (Numeric vs Text):
   Cell D16 -> =COUNT(D2:D13)                   [Result: 12]
   Cell A16 -> =COUNTA(A2:A13)                  [Result: 12]
   *Teaching Note: Emphasize that =COUNT(A2:A13) returns 0 because A2:A13 are strings!
6. Filter Flights by Aircraft Family (COUNTIF):
   Cell C14 -> =COUNTIF(C2:C13, "A320neo")       [Result: 3 Flights]
7. Widebody High-Yield Revenue (SUMIF):
   Cell G14 -> =SUMIF(C2:C13, "B777-300ER", G2:G13) [Result: ₹57,71,800]
8. Rounded Average Ticket Fare:
   Cell F14 -> =ROUND(AVERAGE(F2:F13), -2)      [Result: ₹5,900]

----------------------------------------------------------------------------------------
FILE 2: 02_Aviation_Logical_IF_Nested_IF_Dataset.csv
TOPIC: Logical Functions (IF, Nested IF, IFS, AND, OR)
----------------------------------------------------------------------------------------
Scenario: DGCA Flight Delay Compensation & Loyalty Tier Status Allocation
Demonstration Goals:
1. Basic Statutory IF (DGCA 4-Hour Threshold):
   Cell G2 -> =IF(E2>=4, 5000, 0)
2. Compound Condition with AND (Airline Controllable Fault):
   Cell G2 -> =IF(AND(E2>=4, F2="Technical Snag"), 5000, 0)
3. Nested IF (4-Tier Frequent Flyer Ranking):
   Cell H2 -> =IF(D2>=100000, "Platinum Elite", IF(D2>=50000, "Gold Wing", IF(D2>=25000, "Silver Crest", "Blue Base")))
4. Modern Clean IFS (Alternative):
   Cell H2 -> =IFS(D2>=100000, "Platinum Elite", D2>=50000, "Gold Wing", D2>=25000, "Silver Crest", TRUE, "Blue Base")
5. Logical OR (Lounge Entry Authorization):
   Cell I2 -> =IF(OR(H2="Platinum Elite", H2="Gold Wing"), "YES", "NO")

----------------------------------------------------------------------------------------
FILE 3: 03_Aviation_VLOOKUP_HLOOKUP_Tariffs.csv
TOPIC: Lookups (Exact Match, Approximate Match, Horizontal Lookups)
----------------------------------------------------------------------------------------
Scenario: Air Cargo Waybill Dispatch & Aircraft Parameter Matrix
Reference Tables:
- Range I2:L8  -> Airport Master (Code, City, Distance, Handling Fee)
- Range N2:P6  -> Cargo Weight Discount Tiers (0kg, 100kg, 500kg, 1000kg, 2500kg)
- Range I11:M13 -> Aircraft Operational Parameters (Fuel Burn & Hourly Charter Rate)

Demonstration Goals:
1. Exact Match VLOOKUP (Destination City):
   Cell C2 -> =VLOOKUP(B2, $I$2:$L$8, 2, FALSE)
   *Teaching Note: Emphasize why $I$2:$L$8 must have absolute dollar signs!
2. Exact Match VLOOKUP (Distance km):
   Cell D2 -> =VLOOKUP(B2, $I$2:$L$8, 3, FALSE)
3. Approximate Match VLOOKUP (Cargo Rate Discount Tier):
   Cell F2 -> =VLOOKUP(E2, $N$2:$P$6, 2, TRUE)
   *Teaching Note: Explain that TRUE matches the largest value less than or equal to weight.
4. Total Freight Cost Calculation:
   Cell G2 -> =(E2*F2) + VLOOKUP(B2, $I$2:$L$8, 4, FALSE)
5. Horizontal Matrix Lookup (HLOOKUP):
   Formula -> =HLOOKUP("A320neo", $I$11:$M$13, 2, FALSE)  [Fuel Burn: 2,100 kg/hr]
   Formula -> =HLOOKUP("B777-300ER", $I$11:$M$13, 3, FALSE) [Charter: ₹4,80,000/hr]

----------------------------------------------------------------------------------------
FILE 4: 04_Aviation_XLOOKUP_Crew_Snag_Master.csv
TOPIC: Modern XLOOKUP (Leftward Lookups, Defaults, Column Independence)
----------------------------------------------------------------------------------------
Scenario: Flight Crew Rostering & Line Maintenance Snag Board
Reference Tables:
- Range H2:J9  -> Staff Database (ID, Name, Role)
- Range L2:N8  -> Snag Board (Tail No in Col L, Flight No in Col M, Snag Log in Col N)

Demonstration Goals:
1. Standard Exact XLOOKUP (No column counting):
   Cell C2 -> =XLOOKUP(A2, $H$2:$H$9, $I$2:$I$9)
   Cell D2 -> =XLOOKUP(A2, $H$2:$H$9, $J$2:$J$9)
2. Leftward / Reverse Lookup (Impossible with normal VLOOKUP):
   Cell E2 -> =XLOOKUP(B2, $M$2:$M$8, $L$2:$L$8, "STANDBY")
   *Teaching Note: Key is in Column M; target is to the LEFT in Column L!
3. Native Missing Value Handling ([if_not_found]):
   Cell F2 -> =XLOOKUP(B2, $M$2:$M$8, $N$2:$N$8, "NO ACTIVE SNAG")
   *Teaching Note: Replaces clumsy =IFERROR(VLOOKUP(...)) syntax.

----------------------------------------------------------------------------------------
FILE 5: 05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv
TOPIC: Pivot Tables, Pivot Charts & Interactive Slicers (50 Flights)
----------------------------------------------------------------------------------------
Scenario: Kempegowda International Airport (BLR) 24-Hour Operations
Steps to Demonstrate in Excel:
1. Select any cell in the table (A1:M51) -> Press Ctrl + T (Format as Table).
2. Click Insert -> PivotTable -> New Worksheet.

Exercise 1: Airline Traffic across Terminals
- Drag 'Airline' to ROWS
- Drag 'Terminal' to COLUMNS
- Drag 'Pax_Booked' to VALUES (Set to 'Sum of Pax_Booked')
- Insert Pivot Chart -> Clustered Column Chart.

Exercise 2: Airline On-Time Performance & Punctuality
- Drag 'Airline' to ROWS
- Drag 'Status' to COLUMNS
- Drag 'Flight_ID' to VALUES (Set to 'Count of Flight_ID')
- Right-click value -> Show Values As -> % of Row Total.
- Insert Pivot Chart -> 100% Stacked Bar Chart.

Exercise 3: Root-Cause Delay Pareto
- Drag 'Delay_Reason' to ROWS
- Drag 'Delay_Mins' to VALUES (Set to 'Average of Delay_Mins')
- Filter out 'None' (On-Time flights).
- Insert Pivot Chart -> Horizontal 2D Bar Chart.

Exercise 4: Interactive Dashboard Slicers
- Click inside Pivot Table -> PivotTable Analyze -> Insert Slicer.
- Check 'Terminal' and 'Flight_Type'.
- Demonstrate clicking 'T1' vs 'T2' to see the charts instantly re-render!
========================================================================================
