# Session 20: Advanced Data Control & Analysis
## Unit 3: Spreadsheet Software (Final Capstone Session)

---

# Overview & Operational Agenda

Welcome to Session 20 — the capstone session of Unit 3: Spreadsheet Software. Today we bridge foundational formulas with enterprise-grade data governance and analytical intelligence:

* **Part I: Data Validation** — Preventing data corruption at the point of entry.
* **Part II: Conditional Formatting** — Dynamic visual intelligence, heatmaps, and threshold alerting.
* **Part III: Sorting & AutoFilters** — Multi-tier data hierarchy, custom lists, and non-destructive slicing.
* **Part IV: Hands-On Flight Manifest Laboratory** — Live interactive simulator demonstration.

Every core concept is presented using our 4-stage operational framework:
1. **Problem Statement**
2. **Operational Need**
3. **Small-Scale Implementation**
4. **Large-Scale Enterprise Deployment**

---

# 1. Data Validation: Problem Statement

* **The Spreadsheet Crisis:** In a live aviation operations environment, a spreadsheet without validation rules is an uncontrolled vulnerability.
* **Common Uncontrolled Entry Disasters:**
  * **Typographical Discrepancies:** Airline entered as *"Indi-go"*, *"Indigo Air"*, *"6E"*, or *"indgo"*. When an operations dashboard runs `=VLOOKUP()` or `=COUNTIF()`, every mismatched spelling produces `#N/A` or drops critical passenger volume.
  * **Physically Impossible Numbers:** A ground handler inadvertently enters `-45` or `950` passengers on an Airbus A320 with a maximum certified capacity of `186` seats.
  * **Invalid Temporal Data:** Departure dates entered in the past, or inverted international date formats (`MM/DD/YYYY` vs `DD/MM/YYYY`) causing flight turnaround calculations to crash.
  * **Corrupted Aircraft Registrations:** Lowercase, spaced, or truncated tail numbers (e.g. `vt-ifv` instead of standard ICAO `VT-IFV`).
* **Consequence:** Inaccurate aircraft weight & balance manifests, erroneous fuel uplift figures, and hours wasted on forensic data cleansing.

---

# 2. Data Validation: The Operational Need

* **Core Philosophy:** *Prevent errors at the point of entry rather than troubleshooting broken spreadsheets downstream.*
* **What Data Validation Enforces:**
  * **Discrete In-Cell Dropdowns:** Confines data entry strictly to an approved list of items (e.g., IATA airline codes, terminal names, flight status categories).
  * **Numeric Range Boundaries:** Enforces physical bounds using Whole Number or Decimal constraints (e.g., Baggage Weight: `0.00` to `32.00 kg`; Pax: `1` to Aircraft Capacity).
  * **Date & Time Verification:** Enforces that scheduled departure times fall within the current operational flight plan window.
  * **Text Length Restrictions:** Guarantees exact character counts (e.g., PNR must be exactly 6 alphanumeric characters).
* **User Feedback & Exception Handling:**
  * **Input Messages:** Contextual pop-up tooltips that instruct users on acceptable formats before they begin typing.
  * **Error Alerts:**
    * **Stop (Strict):** Completely rejects illegal entries; user cannot proceed without correcting or cancelling.
    * **Warning (Soft):** Alerts the user of an anomaly but permits override with authorization.
    * **Information:** Notes an irregular entry for audit tracking.

---

# 3. Data Validation: Small-Scale Problem Implementation

* **Scenario:** A gate coordinator is logging passenger loads and gate assignments for 4 morning flights at Kempegowda International Airport (BLR).

```
+------------+--------------------+----------------+-----------------+
| Flight No  | Airline (Dropdown) | Booked Pax     | Gate (Dropdown) |
+------------+--------------------+----------------+-----------------+
| 6E 2101    | IndiGo             | 178 (Max: 186) | G04             |
| AI 502     | Air India          | 242 (Max: 256) | G12             |
| QP 1354    | Akasa Air          | 180 (Max: 189) | G06             |
| UK 832     | Vistara            | 158 (Max: 164) | G09             |
+------------+--------------------+----------------+-----------------+
```

* **Step-by-Step Excel Ribbon Implementation:**
  1. **Select Column B (Airline):** Navigate to `Data Tab -> Data Validation` (Shortcut: `Alt + A + V + V`).
  2. **Set Validation Criteria:** On the *Settings* tab, set `Allow:` to **List**.
  3. **Provide Allowed Carriers:** In the *Source:* box, type:
     `IndiGo, Air India, Akasa Air, SpiceJet, Vistara`
  4. **Set Passenger Capacity Constraint:** Select Column C (Pax). Set `Allow:` to **Whole number**, `Data:` to **between**, `Minimum:` **1**, and `Maximum:` **186**.
  5. **Configure Stop Alert:** Click the *Error Alert* tab. Set `Style:` to **Stop**, `Title:` *"Overcapacity Violation"*, and `Error message:` *"Booked passengers cannot exceed certified aircraft capacity (186)."*

---

# 4. Data Validation: Large-Scale Enterprise Deployment

* **Enterprise Scenario:** Airport Operations Control Centre (AOCC) managing 500+ daily flights across Terminal 1 and Terminal 2 with 30+ simultaneous dispatchers.
* **1. Master Reference Tables & Named Ranges:**
  * In large multi-user workbooks, hardcoding dropdown strings inside the validation dialog is unmaintainable.
  * Instead, create a dedicated hidden lookup sheet: `Ref_Airlines!$A$2:$A$15`.
  * Name the range using Name Box: `Approved_Airlines`.
  * Set Data Validation source to `=Approved_Airlines`. Updating the master list automatically propagates across all 500 rows.
* **2. Dynamic Formula-Based Validation:**
  * Enforce dynamic equipment-dependent limits using custom formulas:
    `=C2<=VLOOKUP(B2, Fleet_Master!$A$2:$D$50, 3, FALSE)`
    *(Ensures an A321 can accept up to 222 pax, while an ATR-72 is strictly capped at 78 pax on the same column).*
* **3. Auditing Existing Datasets:**
  * When receiving raw vendor spreadsheets: Click `Data Tab -> Data Validation -> Circle Invalid Data`.
  * Excel instantly draws bright red ellipses around every cell that violates the integrity rules, spotlighting non-compliant entries in seconds.

---

# 5. Conditional Formatting: Problem Statement

* **The Data Deluge:** An AOCC flight operations controller monitors a master manifest containing 500 rows and 15 columns of raw departure metrics.
* **The Cognitive Failure:**
  * In a standard black-and-white spreadsheet, a flight delayed by `95 minutes` looks visually identical to a flight departing `on-time` (`0 minutes`).
  * To locate critical delays, an operations supervisor must scan row-by-row through hundreds of numeric values.
  * In time-critical turnarounds, this manual scan takes 3–5 minutes. By the time an ATC delay or gate conflict is spotted, the aircraft has already missed its departure slot.
* **The Goal:** Make operational anomalies, performance bottlenecks, and critical thresholds leap out visually and instantaneously without requiring the user to read individual numbers.

---

# 6. Conditional Formatting: The Operational Need

* **Core Principle:** *Transform raw tabular numbers into an automated visual management dashboard that leverages preattentive human visual processing.*
* **4 Operational Formatting Paradigms:**
  1. **Highlight Cells Rules (Threshold Spotlighting):**
     * Immediately flags values exceeding regulatory or operational benchmarks (e.g. Delays `> 15 mins` colored soft red with dark red text).
  2. **Color Scales / Heatmaps (Density & Load Distribution):**
     * Applies a continuous 3-color gradient across a numeric range (e.g., Baggage Weight: Green for light loads `< 1,500 kg`, Yellow for moderate, Deep Red for heavy widebodies `> 5,000 kg`).
  3. **In-Cell Data Bars (Relative Performance Benchmarking):**
     * Draws horizontal bars inside the cell proportional to its magnitude. Enables immediate visual comparison of passenger load factors across flights without opening a separate chart window.
  4. **Icon Sets (Traffic Light Status Indicators):**
     * Assigns Green Circles (On-Time), Yellow Triangles (Moderate Delay 1–15 mins), and Red Crosses (Critical Delay > 15 mins).

---

# 7. Conditional Formatting: Small-Scale Problem Implementation

* **Scenario:** A station manager needs to monitor delays across 6 regional departures.

```
+------------+-------------+-------------+------------+--------------------+
| Flight No  | Destination | Scheduled   | Delay Mins | Visual Formatting  |
+------------+-------------+-------------+------------+--------------------+
| 6E 521     | DEL         | 06:00       | 8          | Normal (White)     |
| AI 804     | BOM         | 06:15       | 42         | [RED ALERT FILL]   |
| 6E 204     | HYD         | 06:30       | 0          | Normal (White)     |
| QP 1332    | GOI         | 06:45       | 25         | [RED ALERT FILL]   |
| UK 815     | BOM         | 07:00       | 12         | Normal (White)     |
| SG 401     | CCU         | 07:15       | 55         | [RED ALERT FILL]   |
+------------+-------------+-------------+------------+--------------------+
```

* **Step-by-Step Excel Implementation:**
  1. **Select Target Range:** Highlight cells `D2:D7` (Delay Mins).
  2. **Open Highlight Rules:** `Home Tab -> Conditional Formatting -> Highlight Cells Rules -> Greater Than...`
  3. **Enter Threshold:** Type `15` in the dialog box.
  4. **Choose Formatting Preset:** Select `Light Red Fill with Dark Red Text`. Click **OK**.
  5. **Dynamic Reaction:** Change cell `D3` from `42` to `5`. Notice the red fill vanishes instantly! Real-time reactivity eliminates manual cell repainting.

---

# 8. Conditional Formatting: Large-Scale Enterprise Deployment

* **Enterprise Requirement:** Highlighting only a single cell in column D is insufficient for busy apron teams. When a flight is in critical delay, the **entire flight row** (from Flight No to Gate) must turn amber or red.
* **The Master Formula Technique: Mixed Cell Referencing (`=$E2>15`):**
  1. **Select the Full Data Range:** Highlight `A2:H500` (do NOT select header row 1).
  2. **Create New Rule:** `Home Tab -> Conditional Formatting -> New Rule`.
  3. **Select Rule Type:** *"Use a formula to determine which cells to format"*.
  4. **Enter Formula with Column Anchor:**
     `=$E2>15`
  5. **The Secret of the `$` Anchor:**
     * The `$` before column `E` locks evaluation strictly to the Delay column.
     * The absence of `$` before row `2` allows Excel to evaluate each row independently (`$E2`, `$E3`, `$E4`...).
     * Result: Every cell in row 3 turns red because `E3>15`, while row 4 remains clean.
* **Managing Rule Precedence:**
  * `Home -> Conditional Formatting -> Manage Rules`. Use the Up/Down arrows to position critical Stop rules at the top, and enable *"Stop If True"* to prevent conflicting styles.

---

# 9. Sorting & Filters: Problem Statement

* **The Manifest Chaos:** AOCC systems receive flight records chronologically as flight plans are filed.
* **The Operational Roadblocks:**
  * **Unstructured Browsing:** A Terminal 1 duty manager must wade through hundreds of Terminal 2, Cargo, and International flights to find their assigned domestic departures.
  * **Scrambled Data Integrity (The "Orphan Row" Disaster):** An untrained operator highlights *only* Column D and clicks "Sort A-Z". Excel sorts only that column, severing flight numbers from their true destinations and passenger counts.
  * **Destructive Deletion Traps:** Operators who delete non-matching rows to isolate specific flights permanently destroy raw historical operational data.
* **The Objective:** Enable instant, non-destructive isolation, grouping, and prioritization of flight records while preserving total data integrity.

---

# 10. Sorting & Filters: The Operational Need

* **Core Principles:**
  * **AutoFilter (`Ctrl + Shift + L`):** Dynamically collapses the table to display only records satisfying precise criteria, while temporarily hiding non-matching rows without deleting them.
  * **Multi-Tier Sorting:** Arranges records hierarchically across multiple operational priorities (e.g. Primary sort by Terminal, Secondary sort by Airline, Tertiary sort by Delay).
* **Multi-Dimensional Filter Criteria:**
  * **Text Filters:** *Equals, Contains, Begins With* (e.g. Flight No begins with "6E").
  * **Number Filters:** *Top 10, Above Average, Between* (e.g. Baggage load between 2,000 kg and 4,000 kg).
  * **Filter by Color:** Directly filter rows matching Conditional Formatting red fills to instantly isolate all delayed flights for crisis briefings.
* **Dynamic Formula Interaction:**
  * Standard `=SUM(E2:E500)` continues adding hidden filtered rows!
  * Enterprise standard: Use `=SUBTOTAL(109, E2:E500)` so metrics recalculate dynamically based *only* on currently visible filtered rows.

---

# 11. Sorting & Filters: Small-Scale Problem Implementation

* **Scenario:** A gate supervisor needs to find all delayed departures departing specifically from Terminal 1.

```
+------------+---------+----------+----------+------------+------------+
| Flight No  | Airline | Sector   | Terminal | Delay Mins | Status     |
+------------+---------+----------+----------+------------+------------+
| 6E 521     | IndiGo  | BLR-DEL  | T1       | 8          | On-Time    |
| AI 804     | Air Ind | BLR-BOM  | T2       | 42         | Delayed    |
| 6E 204     | IndiGo  | BLR-HYD  | T1       | 0          | On-Time    |
| QP 1332    | Akasa   | BLR-GOI  | T1       | 25         | Delayed    |
| AI 506     | Air Ind | BLR-DEL  | T2       | 65         | Delayed    |
| 6E 718     | IndiGo  | BLR-MAA  | T1       | 5          | On-Time    |
| SG 401     | SpiceJ  | BLR-CCU  | T1       | 55         | Delayed    |
+------------+---------+----------+----------+------------+------------+
```

* **Step-by-Step AutoFilter Execution:**
  1. **Activate Filters:** Click anywhere in the dataset and press `Ctrl + Shift + L`. Notice the filter arrows appear on Row 1 headers.
  2. **Filter by Terminal:** Click dropdown arrow on `Terminal` -> Uncheck `(Select All)` -> Check `T1`. Rows 2 and 5 (T2 flights) vanish from view.
  3. **Filter by Delay:** Click dropdown arrow on `Delay Mins` -> `Number Filters -> Greater Than...` -> Enter `15`.
  4. **Outcome:** Only 2 flights remain: `QP 1332` (25m) and `SG 401` (55m). Total time: 5 seconds.
  5. **Clear Filters:** Click `Data -> Clear` or press `Alt + A + C` to restore the entire manifest.

---

# 12. Sorting & Filters: Large-Scale Enterprise Deployment

* **Enterprise Manifest:** Managing the daily BLR departure wave (1,000+ flights).
* **Multi-Tier Custom Sorting Hierarchy:**
  * In a multi-terminal airport, sorting simply by flight number is operationally meaningless.
  * Go to `Data Tab -> Sort` (Shortcut: `Alt + A + S + S`).
  * Configure the 3-Tier Sort Engine:
    * **Level 1 (Primary):** `Terminal` -> *Cell Values* -> **A to Z** (Separates T1 low-cost from T2 international).
    * **Level 2 (Secondary):** `Status` -> *Cell Values* -> **Custom List**: `Delayed, Cancelled, On-Time` (Surfaces critical flights to the very top).
    * **Level 3 (Tertiary):** `Delay Mins` -> *Cell Values* -> **Largest to Smallest** (Ranks worst delays first).
* **AutoFilter Slicers & Excel Tables (`Ctrl + T`):**
  * Convert raw range into an official Excel Table by pressing `Ctrl + T`.
  * Insert visual **Slicers** (`Table Design -> Insert Slicer -> Terminal, Airline, Status`).
  * Operators can click touch-friendly buttons (`[IndiGo] [Delayed]`) on tablet screens at gate podia without touching dropdown menus.

---

# 13. Operational Comparison & Architecture Summary

* **How the Three Pillars Complement Each Other:**

| Pillar | Operational Purpose | Key Excel Tools | Primary Failure Avoided |
| :--- | :--- | :--- | :--- |
| **Data Validation** | **Entry Gatekeeper** | Dropdown Lists, Whole Number Limits, Stop Alerts | Garbled spellings, invalid capacities, corrupted formulas |
| **Conditional Formatting** | **Visual Spotlight** | Highlight Rules, Color Scales, `=$E2>15` custom formulas | Overlooking high-risk delays and congested baggage belts |
| **Sorting & Filters** | **Data Exploration** | AutoFilter (`Ctrl+Shift+L`), Multi-Tier Custom Sort, Slicers | Manual scrolling, data corruption via single-column sorting |

* **Best Practice Workflow for Every Aviation Workbook:**
  1. **Step 1:** Establish Data Validation on raw entry columns before issuing sheet to coordinators.
  2. **Step 2:** Layer Conditional Formatting to dynamically spotlight operational exceptions.
  3. **Step 3:** Enable AutoFilters (`Ctrl+Shift+L`) and Multi-Tier Sort for executive briefings.

---

# 14. Interactive Demonstration Laboratory

* **Spreadsheet Core Essentials Workshop — Modules 5, 6 & 7:**
  * Now we transition from lecture slides to our live hands-on simulator.
  * Explore the active tabs below:
    * **Module 5:** Test in-cell dropdowns and trigger an authentic Excel Stop Alert dialog.
    * **Module 6:** Adjust delay sliders and toggle heatmap gradients and full-row highlighting.
    * **Module 7:** Toggle terminal filters and execute multi-tier hierarchical sorting.

```excel-core-workshop
```

---

# 15. Student Practice Tasks & Takeaways

* **Post-Session Hands-On Exercise:**
  1. **Dataset 6 (Data Validation):** Download `06_Aviation_Data_Validation_Dataset.csv` from the Datasets Hub. Apply list validation to Column B and configure a Stop Alert for aircraft capacity limits.
  2. **Dataset 7 (Conditional Formatting & Filters):** Download `07_Aviation_Conditional_Formatting_Filters_Dataset.csv`. Implement a 15-minute delay highlight rule, a 3-color baggage gradient, and execute a 2-tier sort (Terminal A-Z, Delay Descending).
  3. **Verification:** Submit your completed workbook to the Computing Lab Portal for automated rubric evaluation.
* **Congratulations!** You have completed all 10 core sessions of Unit 3: Spreadsheet Software!
