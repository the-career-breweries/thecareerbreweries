# Practical Exam Answer Key & Screen-by-Screen Workflow Guide
## Step-by-Step Tutorial & Technical Solutions Manual for Computing Laboratory Tasks

---

## Table of Contents
1. [Master Workspace & Terminal Setup Workflow](#1-master-workspace--terminal-setup-workflow)
2. [Practice Drill A — Task 1: MS Word Operational Briefing Document](#2-practice-drill-a--task-1-ms-word-operational-briefing-document)
3. [Practice Drill A — Task 2: MS Excel Revenue Analytics & Column Charting](#3-practice-drill-a--task-2-ms-excel-revenue-analytics--column-charting)
4. [Practice Drill A — Task 3: MS PowerPoint Presentation, Slide Master & Animation](#4-practice-drill-a--task-3-ms-powerpoint-presentation-slide-master--animation)
5. [Practice Drill B — Task 1: MS Word 1-Page Curriculum Vitae (Strict Page Economy)](#5-practice-drill-b--task-1-ms-word-1-page-curriculum-vitae-strict-page-economy)
6. [Practice Drill B — Task 2: MS Excel Spares Inventory, Absolute Referencing & Reorder Alerts](#6-practice-drill-b--task-2-ms-excel-spares-inventory-absolute-referencing--reorder-alerts)
7. [Practice Drill B — Task 3: MS PowerPoint Technical Briefing & SmartArt Cycle](#7-practice-drill-b--task-3-ms-powerpoint-technical-briefing--smartart-cycle)
8. [Comprehensive Verification Key & Formula Master Matrix](#8-comprehensive-verification-key--formula-master-matrix)

---

## 1. Master Workspace & Terminal Setup Workflow

### Screen 0.1: Setting Up the Working Directory in Windows Explorer
```
+-----------------------------------------------------------------------------------+
| File Explorer  [ D:\ (or Desktop) ]                                               |
+-----------------------------------------------------------------------------------+
| [New Folder]  -->  Type: "RegNo_Name_ComputingLab" (e.g., 26AV101_Rahul_ComputingLab) |
|                                                                                   |
| > Important: Double-click to open this folder BEFORE starting any application!    |
| > Ensure "File name extensions" is CHECKED under View tab in File Explorer.       |
+-----------------------------------------------------------------------------------+
```

#### Step-by-Step Instructions:
1. Press `Windows Key + E` to launch **File Explorer**.
2. Navigate to the designated examination drive (e.g., `D:\` or `Desktop`).
3. Click **New Folder** (or press `Ctrl + Shift + N`).
4. Name the folder strictly as: `RegNo_Name_ComputingLab` *(replace with your actual Register Number and Name)*.
5. In the top File Explorer Ribbon, click **View** $\rightarrow$ check the box for **File name extensions**. *(This prevents double extension errors like `file.docx.docx`).*

---

## 2. Practice Drill A — Task 1: MS Word Operational Briefing Document

### Workflow Overview:
* **Target File Names:** `Task1_Word_RegNo.docx` AND `Task1_Word_RegNo.pdf`
* **Allocation:** ~35 Minutes | **Weightage:** 15 Marks

---

### Screen 1.1: Page Geometry Configuration
```
+-----------------------------------------------------------------------------------+
| Word Ribbon: Layout Tab                                                           |
+-----------------------------------------------------------------------------------+
| [Margins: Normal (1.0")]  |  [Orientation: Portrait]  |  [Size: A4 (21 x 29.7 cm)]|
+-----------------------------------------------------------------------------------+
```
1. Open Microsoft Word $\rightarrow$ create a **Blank Document**.
2. Go to **Layout** tab $\rightarrow$ click **Size** $\rightarrow$ select **A4** ($21\text{ cm} \times 29.7\text{ cm}$).
   * *Trap Prevention:* Do NOT leave as default US Letter ($8.5'' \times 11''$).
3. Click **Orientation** $\rightarrow$ select **Portrait**.
4. Click **Margins** $\rightarrow$ select **Normal** ($1.0''$ or $2.54\text{ cm}$ on Top, Bottom, Left, Right).

---

### Screen 1.2: Document Header & Memo Block
```
+-----------------------------------------------------------------------------------+
|                             OPERATIONAL BRIEFING                                  |
|                                                                                   |
| TO:      Flight Operations & Engineering Group                                    |
| FROM:    Logistics & Ground Support Office                                        |
| DATE:    15 November 2026                                                         |
| SUBJECT: Quarterly Ground Support Equipment Overhaul                              |
| --------------------------------------------------------------------------------- |
+-----------------------------------------------------------------------------------+
```
1. **Title:**
   * Type `OPERATIONAL BRIEFING`.
   * Highlight text $\rightarrow$ Home tab $\rightarrow$ Font: **Times New Roman**, Size: **18 pt**, Style: **Bold**, Alignment: **Center** (`Ctrl + E`).
   * Press `Enter`.
2. **Memo Header Lines:**
   * Align cursor to Left (`Ctrl + L`).
   * Type the header block using **Tab** for crisp vertical alignment:
     * `TO:` (Press `Tab`) `Flight Operations & Engineering Group`
     * `FROM:` (Press `Tab`) `Logistics & Ground Support Office`
     * `DATE:` (Press `Tab`) `15 November 2026`
     * `SUBJECT:` (Press `Tab`) `Quarterly Ground Support Equipment Overhaul`
   * Select only the labels (`TO:`, `FROM:`, `DATE:`, `SUBJECT:`) $\rightarrow$ apply **Bold** (`Ctrl + B`).
3. Add a bottom border or horizontal divider line: Home tab $\rightarrow$ Borders dropdown $\rightarrow$ **Bottom Border**.

---

### Screen 1.3: Body Paragraph Typography & Formatting
```
+-----------------------------------------------------------------------------------+
| Paragraph Dialog:                                                                 |
| Font: Calibri, 11 pt  |  Alignment: Justified (Ctrl+J)                           |
| Line Spacing: 1.5 lines  |  Spacing After: 6 pt                                   |
+-----------------------------------------------------------------------------------+
```
1. Type two operational paragraphs:
   > Ground support equipment plays a critical role in sustaining turn-around efficiency and ramp flight safety. Routine inspections and **preventive maintenance schedules** ensure that all active towing units, loaders, and auxiliary power carts comply with stringent civil aviation safety norms.
   > 
   > All department supervisors must verify that assigned ground handling units undergo mandatory **structural integrity audits** and fluid leak diagnostics before the specified deadline. Equipment failing to satisfy operational compliance must be tagged for **immediate technical service**.
2. **Apply Typography:**
   * Select both paragraphs (`Ctrl + A` or drag cursor).
   * Home tab $\rightarrow$ Font: **Calibri**, Size: **11 pt**.
   * Click **Justify** button (`Ctrl + J`) to ensure smooth left and right margins.
   * Open Paragraph Dialog (click small launcher arrow in Home $\rightarrow$ Paragraph group):
     * Set **Line spacing:** `1.5 lines`.
     * Set **Spacing After:** `6 pt` *(ensure Spacing Before is 0 pt)*.
     * Click **OK**.
3. Highlight key terms (`preventive maintenance schedules`, `structural integrity audits`, `immediate technical service`) and press `Ctrl + B` (**Bold**).

---

### Screen 1.4: Header & Dynamic Footer Insertion
```
+-----------------------------------------------------------------------------------+
| Header (Top Right): Department of Aviation Technology — Operations Division       |
|                                                                                   |
| ... [Page Content] ...                                                            |
|                                                                                   |
| Footer (Centered): Page 1 of 1                                                    |
+-----------------------------------------------------------------------------------+
```
1. **Running Header:**
   * Click **Insert** tab $\rightarrow$ **Header** $\rightarrow$ **Edit Header** (or double-click the top page margin).
   * Click **Align Right** (`Ctrl + R`).
   * Type: `Department of Aviation Technology — Operations Division`.
   * Format: Font Size: **9 pt**, Style: *Italic*.
2. **Dynamic "Page X of Y" Footer:**
   * Switch to footer (click **Go to Footer** on Header & Footer ribbon).
   * Click **Page Number** dropdown $\rightarrow$ **Bottom of Page**.
   * Scroll down to the **Page X of Y** section $\rightarrow$ select **Bold Numbers 2** (or standard **Page X of Y** centered).
   * Ensure it renders dynamically as `{PAGE} of {NUMPAGES}`.
   * Click **Close Header and Footer** (`Esc`).

---

### Screen 1.5: Table Insertion & Advanced Formatting
```
+-----------------------------------------------------------------------------------+
| [Unit ID]   | [Equipment Type]             | [Assigned Terminal] | [Service Due]  |
|   (Dark Blue Fill, Bold White Text, Centered Header Cells)                        |
|-------------+------------------------------+---------------------+----------------|
|   GSE-201   | Aircraft Towing Tractor      |     Apron Bay 4     |  05-Dec-2026   |
|   GSE-202   | Belt Loader System           |   Cargo Terminal 2  |  08-Dec-2026   |
|   GSE-203   | Ground Power Unit 90kVA      |    Gate 12 Stand    |  12-Dec-2026   |
|   GSE-204   | Cabin Air Conditioning Cart  |    Hangar 3 West    |  15-Dec-2026   |
+-----------------------------------------------------------------------------------+
```
1. Click below the second body paragraph $\rightarrow$ press `Enter`.
2. Click **Insert** $\rightarrow$ **Table** $\rightarrow$ drag grid to create **4 Columns $\times$ 5 Rows**.
3. **Data Entry:** Enter Unit ID, Equipment Type, Assigned Terminal, and Service Due Date.
4. **Header Row Styling:**
   * Select Row 1 (Header row) $\rightarrow$ **Table Design** tab $\rightarrow$ **Shading** $\rightarrow$ choose **Dark Blue** (or Dark Slate).
   * Select text in Row 1 $\rightarrow$ Font: **Bold**, Color: **White**.
5. **Column Alignments:**
   * Select Column 1 (`Unit ID`) $\rightarrow$ Table Layout tab $\rightarrow$ click **Align Center** (horizontal & vertical center).
   * Select Column 2 (`Equipment Type`) $\rightarrow$ click **Align Center Left**.
   * Select Column 3 (`Assigned Terminal`) $\rightarrow$ click **Align Center**.
   * Select Column 4 (`Service Due Date`) $\rightarrow$ click **Align Center**.
6. **Borders & Row Break Protection:**
   * Select entire table $\rightarrow$ **Table Design** $\rightarrow$ **Borders** $\rightarrow$ **All Borders** (1/2 pt solid border).
   * Right-click table $\rightarrow$ **Table Properties...** $\rightarrow$ **Row** tab $\rightarrow$ uncheck *"Allow row to break across pages"*.

---

### Screen 1.6: Saving `.docx` and Exporting to `.pdf`
1. Click **File** $\rightarrow$ **Save As** $\rightarrow$ Browse to `RegNo_Name_ComputingLab`.
   * File name: `Task1_Word_RegNo.docx` $\rightarrow$ Click **Save**.
2. Click **File** $\rightarrow$ **Export** $\rightarrow$ **Create PDF/XPS Document** (or Save As $\rightarrow$ Type: PDF).
   * File name: `Task1_Word_RegNo.pdf` $\rightarrow$ Click **Publish**.
3. Open the PDF in Edge/Acrobat to verify margins, table lines, and footer layout.

---

## 3. Practice Drill A — Task 2: MS Excel Revenue Analytics & Column Charting

### Workflow Overview:
* **Target File Name:** `Task2_Excel_RegNo.xlsx` (Sheet 1)
* **Allocation:** ~45 Minutes | **Weightage:** 20 Marks

---

### Screen 2.1: Grid Architecture & Parameter Cell Isolation
```
       A                 B                    C                D           E         F
1                                                                     [0.06] (Incentive Rate)
2
3  Sector Code      Sector Route       Revenue Target   Actual Revenue Incentive  Performance
4    SEC-11      Bengaluru — Mumbai        450000           520000
5    SEC-12      Bengaluru — Delhi         600000           580000
6    SEC-13      Bengaluru — Hyderabad     320000           365000
7    SEC-14      Bengaluru — Chennai       280000           280000
8    SEC-15      Bengaluru — Kolkata       420000           395000
```
1. Open Excel $\rightarrow$ Blank Workbook.
2. In cell **E1**, type: `0.06` (or `6%`). *(Label cell D1 as "Incentive Rate:" for clarity).*
3. In range **A3:F3**, enter headers: `Sector Code`, `Sector Route`, `Revenue Target`, `Actual Revenue`, `Incentive`, `Performance`.
4. Enter the sector data into range **A4:D8**.

---

### Screen 2.2: Grid Styling, Borders & Currency Formatting
1. **Header Styling:**
   * Select `A3:F3` $\rightarrow$ Home tab $\rightarrow$ **Bold** (`Ctrl + B`), Fill Color: **Light Gray** (or Soft Accent), Alignment: **Center** (Middle & Center).
2. **Borders:**
   * Select range `A3:F8` $\rightarrow$ Home tab $\rightarrow$ Borders dropdown $\rightarrow$ select **All Borders**.
3. **Currency Formatting:**
   * Select cells `C4:E8` (Target, Actual, Incentive).
   * Press **`Ctrl + 1`** (Format Cells dialog) $\rightarrow$ **Number** tab $\rightarrow$ **Currency**.
   * Decimal places: `2`. Symbol: `₹` (INR) or `$`.
   * Click **OK**.
   * *Check:* `450000` transforms to `₹ 450,000.00`.

---

### Screen 2.3: Absolute Reference Calculation for Incentive (Column E)
```
+-----------------------------------------------------------------------------------+
| Formula Bar:  fx  =D4*$E$1                                                        |
+-----------------------------------------------------------------------------------+
| Cell E4 = D4 * $E$1  -->  520000 * 0.06 = 31,200.00                               |
| (Drag AutoFill handle down from E4 to E8)                                         |
+-----------------------------------------------------------------------------------+
```
1. Click in cell **E4**.
2. Type: `=D4*`
3. Click on cell **E1**, then immediately press **`F4`** on your keyboard.
   * The formula will display: `=D4*$E$1`.
4. Press `Enter`. Result: `₹ 31,200.00`.
5. Hover over the bottom-right corner of cell E4 until the cursor turns into a black plus (`+` AutoFill handle).
6. Double-click or drag down through cell **E8**.

#### AutoFilled Formula Verification:
* Row 4 (`SEC-11`): `=D4*$E$1` $\rightarrow$ `₹ 31,200.00`
* Row 5 (`SEC-12`): `=D5*$E$1` $\rightarrow$ `₹ 34,800.00`
* Row 6 (`SEC-13`): `=D6*$E$1` $\rightarrow$ `₹ 21,900.00`
* Row 7 (`SEC-14`): `=D7*$E$1` $\rightarrow$ `₹ 16,800.00`
* Row 8 (`SEC-15`): `=D8*$E$1` $\rightarrow$ `₹ 23,700.00`

---

### Screen 2.4: Logical IF Function for Performance Evaluation (Column F)
```
+-----------------------------------------------------------------------------------+
| Formula Bar:  fx  =IF(D4>=C4, "Target Met", "Below Target")                       |
+-----------------------------------------------------------------------------------+
| Logic: If Actual Revenue (D4) >= Target Revenue (C4) --> "Target Met"             |
|        Otherwise                                     --> "Below Target"           |
+-----------------------------------------------------------------------------------+
```
1. Click in cell **F4**.
2. Type the formula:
   ```excel
   =IF(D4>=C4, "Target Met", "Below Target")
   ```
3. Press `Enter`. (Since $520,000 \ge 450,000$, cell F4 evaluates to **Target Met**).
4. Drag the AutoFill handle down through cell **F8**.

#### Evaluation Results Table:
| Sector | Target (C) | Actual (D) | Condition ($D \ge C$) | Result in F |
| :---: | :---: | :---: | :---: | :--- |
| SEC-11 | 450,000 | 520,000 | $520000 \ge 450000$ (True) | **Target Met** |
| SEC-12 | 600,000 | 580,000 | $580000 \ge 600000$ (False) | **Below Target** |
| SEC-13 | 320,000 | 365,000 | $365000 \ge 320000$ (True) | **Target Met** |
| SEC-14 | 280,000 | 280,000 | $280000 \ge 280000$ (True) | **Target Met** *(Boundary check)* |
| SEC-15 | 420,000 | 395,000 | $395000 \ge 420000$ (False) | **Below Target** |

---

### Screen 2.5: Summary Aggregate Statistics (Rows 9–11)
```
       A            B                    C               D           E       F
8    SEC-15  Bengaluru — Kolkata      420,000.00      395,000.00  23,700.00 Below Target
9            Total Actual Revenue                     =SUM(D4:D8)      --> 2,140,000.00
10           Average Actual Revenue                   =AVERAGE(D4:D8)  -->   428,000.00
11           Maximum Actual Revenue                   =MAX(D4:D8)      -->   580,000.00
```
1. In cell **B9**, type: `Total Actual Revenue`.
   * In cell **D9**, enter: `=SUM(D4:D8)`. Result: `₹ 2,140,000.00`.
2. In cell **B10**, type: `Average Actual Revenue`.
   * In cell **D10**, enter: `=AVERAGE(D4:D8)`. Result: `₹ 428,000.00`.
3. In cell **B11**, type: `Maximum Actual Revenue`.
   * In cell **D11**, enter: `=MAX(D4:D8)`. Result: `₹ 580,000.00`.
4. Apply **Bold** to cells `B9:D11` and ensure currency formatting is applied to `D9:D11`.

---

### Screen 2.6: Clustered Column Chart Construction
```
+-----------------------------------------------------------------------------------+
|               Quarterly Sector Revenue Performance                                |
|   600,000 |       [■]                                                             |
|   400,000 |   [■] [■]     [■]         [■]       ■ Revenue Target                  |
|   200,000 |   [■] [■] [■] [■] [■] [■] [■]       ■ Actual Revenue                  |
|         0 +----+-------+-------+-------+-------                                   |
|             SEC-11  SEC-12  SEC-13  SEC-14  SEC-15                                |
|                         Sectors                                                   |
+-----------------------------------------------------------------------------------+
```
1. **Selecting Data:**
   * Select cell range **`A3:A8`** (Sector Codes).
   * Hold **`Ctrl`** key down, then select cell range **`C3:D8`** (Target and Actual columns).
2. **Insert Chart:**
   * Go to **Insert** tab $\rightarrow$ Charts group $\rightarrow$ click **Insert Column or Bar Chart** $\rightarrow$ select **2-D Clustered Column**.
3. **Configure Chart Titles & Elements:**
   * **Chart Title:** Double-click title box $\rightarrow$ type: `Quarterly Sector Revenue Performance`.
   * Click the green **`+`** icon (Chart Elements) at the top right of the chart:
     * Check **Axis Titles**:
       * Primary Horizontal Axis Title: type `Sector Code`.
       * Primary Vertical Axis Title: type `Revenue (INR)`.
     * Check **Legend** $\rightarrow$ position at **Top** or **Right**.
4. **Positioning:** Move the chart neatly below row 12. Ensure it does not cover any calculation cells.
5. Save workbook as `Task2_Excel_RegNo.xlsx` inside `RegNo_Name_ComputingLab`.

---

## 4. Practice Drill A — Task 3: MS PowerPoint Presentation, Slide Master & Animation

### Workflow Overview:
* **Target File Name:** `Task3_PowerPoint_RegNo.pptx`
* **Allocation:** ~25 Minutes | **Weightage:** 10 Marks

---

### Screen 3.1: Widescreen Theme Setup & Slide Master Access
1. Open PowerPoint $\rightarrow$ Blank Presentation.
2. Go to **Design** tab $\rightarrow$ **Slide Size** $\rightarrow$ ensure **Widescreen (16:9)** is active.
3. Select an elegant corporate theme (e.g., *Slate*, *Facet*, or *Office Theme*).
4. Go to **View** tab $\rightarrow$ click **Slide Master**.

---

### Screen 3.2: Slide Master Universal Configuration
```
+-----------------------------------------------------------------------------------+
| Slide Master View (Select Top Parent Slide 1)                                     |
|                                                                                   |
|  [Master Title Style]                                                             |
|  [Master Text Styles]                                                             |
|                                                                                   |
|  [Aviation Computing & Technology Briefing]                       [ <#> ]         |
|  (Left Footer Placeholder)                                (Slide Number Field)    |
+-----------------------------------------------------------------------------------+
```
1. In the left slide thumbnail panel, scroll all the way to the top and click on **Slide 1 (the large Parent Master Slide)**.
2. **Universal Footer:**
   * Click inside the `<footer>` placeholder at the bottom left.
   * Type: `Aviation Computing & Technology Briefing`.
3. **Automated Slide Numbers:**
   * Go to **Insert** tab $\rightarrow$ click **Header & Footer** (or **Slide Number**).
   * In the dialog box:
     * Check **Slide number**.
     * Check **Footer**.
     * Check **Don't show on title slide** (optional, recommended for professional decks).
     * Click **Apply to All**.
4. Click **Slide Master** tab on Ribbon $\rightarrow$ click **Close Master View** (`X`).

---

### Screen 3.3: Slide 1 (Title Slide Construction)
1. In standard view, click on Slide 1 (Title Slide layout).
2. Title Box: Type `Next-Generation Avionics & Automation`.
3. Subtitle Box: Type `Presented by: [Your Name] | Reg No: [Your Reg No]`.
4. Formatting: Title in **Bold**, 36–40 pt; Subtitle in 18–20 pt.

---

### Screen 3.4: Slide 2 (Animated Content Delivery)
```
+-----------------------------------------------------------------------------------+
| Key Technological Pillars                                                         |
|                                                                                   |
| [1] Fly-By-Wire Digital Flight Control Systems                                    |
| [2] ADS-B Out Next-Gen Surveillance Systems                                       |
| [3] Global Navigation Satellite Systems (GNSS)                                    |
| [4] Real-Time Predictive Engine Health Monitoring                                 |
+-----------------------------------------------------------------------------------+
```
1. Click **Home** $\rightarrow$ **New Slide** $\rightarrow$ select **Title and Content**.
2. Title: Type `Key Technological Pillars`.
3. In the content body, type the 4 bullet points:
   * `Fly-By-Wire Digital Flight Control Systems`
   * `ADS-B Out Next-Gen Surveillance Systems`
   * `Global Navigation Satellite Systems (GNSS)`
   * `Real-Time Predictive Engine Health Monitoring`
4. **Applying Sequential Entrance Animations:**
   * Click the border of the content box to select all text.
   * Go to **Animations** tab $\rightarrow$ select **Fade** (or **Fly In**).
   * Click **Animation Pane** button to open the side panel.
   * In the Ribbon Timing group:
     * Ensure **Start:** is set to **On Click**.
   * Click `Effect Options` $\rightarrow$ ensure sequence is set to **By Paragraph**.
   * *Verification:* Numbered animation tags `[1]`, `[2]`, `[3]`, `[4]` will appear beside each bullet point.

---

### Screen 3.5: Slide 3 (SmartArt Process Integration)
```
+-----------------------------------------------------------------------------------+
| Flight Deck Systems Integration                                                   |
|                                                                                   |
|  +-------------------+      +-------------------+      +--------------------+     |
|  | Sensors & Data    | ---> | Central Flight    | ---> | Electronic Flight  |     |
|  | Probes            |      | Computers         |      | Displays           |     |
|  +-------------------+      +-------------------+      +--------------------+     |
+-----------------------------------------------------------------------------------+
```
1. Click **Home** $\rightarrow$ **New Slide** $\rightarrow$ select **Title and Content**.
2. Title: Type `Flight Deck Systems Integration`.
3. In the body box, click the **Insert a SmartArt Graphic** icon (or click `Insert` $\rightarrow$ `SmartArt`).
4. Select **Process** category $\rightarrow$ choose **Basic Process** $\rightarrow$ click **OK**.
5. In the three process shapes, enter:
   * Shape 1: `Sensors & Data Probes`
   * Shape 2: `Central Flight Computers`
   * Shape 3: `Electronic Flight Displays`
6. Click `SmartArt Design` tab $\rightarrow$ `Change Colors` $\rightarrow$ pick a professional accent palette (e.g., *Colorful Accent Colors*).

---

### Screen 3.6: Slide 4 (Conclusion & Universal Transition)
1. Click **New Slide** $\rightarrow$ **Title and Content**.
2. Title: Type `Summary & Future Roadmap`.
3. Body text:
   * `Digital avionics integration significantly reduces pilot workload and optimizes fuel efficiency.`
   * `Continuous automation remains the bedrock of modern commercial aviation safety.`
   * `Thank You — Questions & Discussion.`
4. **Apply Uniform Transition:**
   * Go to **Transitions** tab.
   * Select **Push** (or **Fade**).
   * In the Timing group, set **Duration:** to `1.00`.
   * Click **Apply To All**.
5. **Full Slideshow Audit:** Press **`F5`** to test the entire presentation from Slide 1. Press spacebar/arrow keys to verify that bullets appear one by one.
6. Save presentation as `Task3_PowerPoint_RegNo.pptx`.

---

## 5. Practice Drill B — Task 1: MS Word 1-Page Curriculum Vitae (Strict Page Economy)

### Workflow Overview:
* **Target File Names:** `Task1_Resume_RegNo.docx` AND `Task1_Resume_RegNo.pdf`
* **Mandatory Constraint:** The entire exported document **MUST fit on exactly 1 single page**. Any spill onto page 2 results in heavy penalties.

---

### Screen 4.1: Custom Margins for Page Economy
```
+-----------------------------------------------------------------------------------+
| Page Setup: Custom Margins                                                        |
| Top: 0.75"  |  Bottom: 0.75"  |  Left: 0.75"  |  Right: 0.75"  |  Size: A4         |
+-----------------------------------------------------------------------------------+
```
1. Open Word $\rightarrow$ Blank Document.
2. Layout tab $\rightarrow$ **Size** $\rightarrow$ **A4**.
3. Layout tab $\rightarrow$ **Margins** $\rightarrow$ **Custom Margins...**:
   * Top: `0.75 in` ($1.9\text{ cm}$)
   * Bottom: `0.75 in` ($1.9\text{ cm}$)
   * Left: `0.75 in` ($1.9\text{ cm}$)
   * Right: `0.75 in` ($1.9\text{ cm}$)
   * Click **OK**.

---

### Screen 4.2: Candidate Header Block & Divider
```
+-----------------------------------------------------------------------------------+
|                                 PRIYA SHARMA                                      |
|            priya.sharma@email.com | +91 98765 43210 | Bengaluru, India            |
|===================================================================================|
+-----------------------------------------------------------------------------------+
```
1. Type candidate full name: `PRIYA SHARMA`.
   * Format: **18 pt**, **Bold**, **Calibri**, **Center**.
2. Press `Enter`. Type contact line:
   * `priya.sharma@email.com | +91 98765 43210 | linkedin.com/in/priyasharma | Bengaluru, India`
   * Format: **10 pt**, Regular, **Center**.
3. Press `Enter`. Add solid dividing line:
   * Home tab $\rightarrow$ Borders dropdown $\rightarrow$ click **Borders and Shading...** $\rightarrow$ select a solid line ($1\text{ pt}$ or $1.5\text{ pt}$ width, Dark Blue color) $\rightarrow$ apply to **Bottom**.

---

### Screen 4.3: Standardized Section Headings
To guarantee consistent styling across all four sections, configure headline typography:
* **Font:** Calibri, **13 pt**, **Bold**, **ALL CAPS**.
* **Color:** Dark Blue (Hex `#1F4E79` or standard Dark Blue).
* **Paragraph Spacing:** Open Paragraph dialog $\rightarrow$ **Before: 4 pt**, **After: 2 pt**.

Create the 4 sections:
1. `PROFESSIONAL SUMMARY`
2. `EDUCATIONAL QUALIFICATIONS`
3. `TECHNICAL SKILLS & CERTIFICATIONS`
4. `ACADEMIC PROJECTS`

---

### Screen 4.4: Body Typography & Qualifications Table
1. **Under Professional Summary:**
   * Type a 3-sentence objective:
     > Motivated undergraduate aviation specialist with foundational training in airline flight operations, computing systems, and regulatory standards. Proven analytical aptitude with proficiency in spreadsheet modeling, database fundamentals, and operational logistics. Seeking an entry-level operational trainee role to contribute toward safety and efficiency.
   * Format: **Calibri 10.5 pt**, **Line spacing 1.15**, **Justified** (`Ctrl + J`).
2. **Under Educational Qualifications (Insert Table):**
   * Insert Table: **4 Columns $\times$ 4 Rows**.

| Qualification | Institution / Board | Year of Passing | Percentage / CGPA |
| :--- | :--- | :---: | :---: |
| B.Sc Aviation Science | Department of Aviation Studies | 2026 (Pursuing) | 8.6 CGPA |
| Higher Secondary (12th / PUC) | Department of Pre-University Education | 2023 | 86.4% |
| Secondary School (10th / SSLC) | Central Board of Secondary Education | 2021 | 89.2% |

   * **Styling:**
     * Header row: Light grey fill, **Bold**, centered.
     * Columns 1 and 2: Left-aligned (`Align Center Left`).
     * Columns 3 and 4: Centered (`Align Center`).
     * Table Properties $\rightarrow$ Row $\rightarrow$ uncheck *"Allow row to break across pages"*.
3. **Under Technical Skills (Bulleted List):**
   * `• Office Applications: Microsoft Word, Excel (Spreadsheet Modeling & IF Logic), PowerPoint`
   * `• Operating Systems & Tools: Windows 11 Enterprise, Command Prompt, Google Workspace`
   * `• Analytical Competencies: Inventory Control, Data Verification, Statistical Analysis`
   * Format: Compact list with `Spacing After: 2 pt`.

---

### Screen 4.5: Strict 1-Page Verification & PDF Export
```
+-----------------------------------------------------------------------------------+
| Page 1 of 1 Status Bar Verification                                              |
| [Page 1 of 1]  Words: 245  |  No spill onto Page 2!                               |
+-----------------------------------------------------------------------------------+
```
1. Look at the Word status bar at the bottom left: confirm it reads **Page 1 of 1**.
   * *If it shows Page 1 of 2:* Press `Backspace` at the end of the document to delete trailing blank paragraphs. If necessary, select the entire document and reduce font size from 10.5 pt to 10 pt.
2. Save as `Task1_Resume_RegNo.docx`.
3. Export as `Task1_Resume_RegNo.pdf`.
4. Open the PDF to visually confirm it is exactly 1 page.

---

## 6. Practice Drill B — Task 2: MS Excel Spares Inventory, Absolute Referencing & Reorder Alerts

### Workflow Overview:
* **Target File Name:** `Task2_Excel_RegNo.xlsx` (Sheet 1)
* **Allocation:** ~45 Minutes | **Weightage:** 20 Marks

---

### Screen 5.1: Grid Architecture & Initial Data Setup
```
       A            B                C              D              E             F             G             H
1                                                                [0.12] (Tax Rate)
2
3  Item Code   Description     Stock On Hand Unit Price (INR) Stock Value Reorder Point Reorder Alert  Tax Liability
4   SP-501   Hydraulic Seals        40            850
5   SP-502   Cockpit Bulbs          14            320                           20
6   SP-503   Spark Plugs            65           1450                           30
7   SP-504   Pitot Heating           8           4500                           10
8   SP-505   O-Ring Kits            82            210                           25
```
1. Cell **E1**: Type `0.12` (or `12%`).
2. Range **A3:H3**: Enter column headers.
3. Range **A4:D8**: Enter item codes, descriptions, stock quantities, and unit prices.
4. Range **F4:F8**: Enter reorder thresholds (`25`, `20`, `30`, `10`, `25`).
5. Format headers `A3:H3`: Bold, Light Green/Accent fill, Center alignment.
6. Apply **All Borders** to range `A3:H8`.

---

### Screen 5.2: Stock Value Calculation (Column E)
```
+-----------------------------------------------------------------------------------+
| Formula in E4:  =C4*D4   (Relative Reference: Stock On Hand * Unit Price)          |
+-----------------------------------------------------------------------------------+
```
1. In cell **E4**, type: `=C4*D4`.
2. Press `Enter`. Result: `₹ 34,000.00` ($40 \times 850$).
3. AutoFill down to **E8**.
   * Cell E5: `=C5*D5` $\rightarrow$ `₹ 4,480.00` ($14 \times 320$)
   * Cell E6: `=C6*D6` $\rightarrow$ `₹ 94,250.00` ($65 \times 1450$)
   * Cell E7: `=C7*D7` $\rightarrow$ `₹ 36,000.00` ($8 \times 4500$)
   * Cell E8: `=C8*D8` $\rightarrow$ `₹ 17,220.00` ($82 \times 210$)

---

### Screen 5.3: Absolute Reference Tax Calculation (Column H)
```
+-----------------------------------------------------------------------------------+
| Formula in H4:  =E4*$E$1  (Absolute Reference: Stock Value * Tax Rate in E1)      |
+-----------------------------------------------------------------------------------+
```
1. In cell **H4**, type: `=E4*$E$1` *(press `F4` to lock E1)*.
2. Press `Enter`. Result: `₹ 4,080.00` ($34,000 \times 0.12$).
3. AutoFill down to **H8**.
   * Cell H5: `=E5*$E$1` $\rightarrow$ `₹ 537.60`
   * Cell H6: `=E6*$E$1` $\rightarrow$ `₹ 11,310.00`
   * Cell H7: `=E7*$E$1` $\rightarrow$ `₹ 4,320.00`
   * Cell H8: `=E8*$E$1` $\rightarrow$ `₹ 2,066.40`
4. Format columns `D`, `E`, and `H` as **Currency (₹ with 2 decimal places)**.

---

### Screen 5.4: Logical IF Reorder Alert (Column G)
```
+-----------------------------------------------------------------------------------+
| Formula in G4:  =IF(C4<=F4, "REORDER IMMEDIATELY", "Stock Adequate")               |
+-----------------------------------------------------------------------------------+
| Logic: If Stock On Hand (C4) <= Reorder Point (F4) --> "REORDER IMMEDIATELY"      |
|        Otherwise                                   --> "Stock Adequate"           |
+-----------------------------------------------------------------------------------+
```
1. In cell **G4**, type:
   ```excel
   =IF(C4<=F4, "REORDER IMMEDIATELY", "Stock Adequate")
   ```
2. Press `Enter`. (Since $40 \le 25$ is False, outputs `Stock Adequate`).
3. AutoFill down to cell **G8**.

#### Reorder Alert Output Verification:
* Row 4 (`SP-501`): $40 \le 25$ $\rightarrow$ **Stock Adequate**
* Row 5 (`SP-502`): $14 \le 20$ $\rightarrow$ **REORDER IMMEDIATELY** *(Triggered!)*
* Row 6 (`SP-503`): $65 \le 30$ $\rightarrow$ **Stock Adequate**
* Row 7 (`SP-504`): $8 \le 10$ $\rightarrow$ **REORDER IMMEDIATELY** *(Triggered!)*
* Row 8 (`SP-505`): $82 \le 25$ $\rightarrow$ **Stock Adequate**

---

### Screen 5.5: Summary Statistical Metrics (Rows 9–11)
1. Cell **B9**: `Total Inventory Valuation` | Cell **E9**: `=SUM(E4:E8)` $\rightarrow$ `₹ 185,950.00`.
2. Cell **B10**: `Highest Stock Quantity` | Cell **C10**: `=MAX(C4:C8)` $\rightarrow$ `82`.
3. Cell **B11**: `Lowest Stock Quantity` | Cell **C11**: `=MIN(C4:C8)` $\rightarrow$ `8`.
4. Apply Bold styling and borders.

---

### Screen 5.6: Valuation Chart (Bar or Pie Chart)
1. Select range **`B3:B8`** (Descriptions), hold **`Ctrl`**, and select range **`E3:E8`** (Stock Value).
2. Go to **Insert** $\rightarrow$ **2-D Bar** (Clustered Bar) or **Pie Chart**.
3. Set Chart Title: `Inventory Valuation by Spare Item`.
4. Enable **Data Labels** via the Chart Elements (`+`) button.
5. Position chart directly beneath the data table.
6. Save workbook as `Task2_Excel_RegNo.xlsx`.

---

## 7. Practice Drill B — Task 3: MS PowerPoint Technical Briefing & SmartArt Cycle

### Workflow Overview:
* **Target File Name:** `Task3_PowerPoint_RegNo.pptx`
* **Allocation:** ~25 Minutes | **Weightage:** 10 Marks

---

### Screen 6.1: Theme & Slide Master Setup
1. Open PowerPoint $\rightarrow$ Blank Presentation $\rightarrow$ Design: **Widescreen (16:9)**.
2. View tab $\rightarrow$ **Slide Master** $\rightarrow$ select top **Parent Master Slide 1**.
3. In footer placeholder, type: `Safety Management Systems (SMS) — Operations Standards`.
4. Insert tab $\rightarrow$ **Header & Footer** $\rightarrow$ check **Slide number** and **Footer** $\rightarrow$ **Apply to All**.
5. Close Slide Master View.

---

### Screen 6.2: Slide 1 (Title Slide)
* Title: `Aviation Safety Management Systems (SMS)`
* Subtitle: `Framework & Risk Mitigation | Presented by: [Candidate Name, Reg No]`

---

### Screen 6.3: Slide 2 (Four Pillars & Sequential Animation)
* Title: `Four Pillars of ICAO Safety Management`
* Content:
  * `Safety Policy & Objectives`
  * `Safety Risk Management`
  * `Safety Assurance`
  * `Safety Promotion & Training`
* **Animation:** Select bullets $\rightarrow$ Animations tab $\rightarrow$ **Fade** or **Fly In** $\rightarrow$ Start: **On Click** $\rightarrow$ Effect Options: **By Paragraph**.

---

### Screen 6.4: Slide 3 (SmartArt Cycle Graphic)
```
+-----------------------------------------------------------------------------------+
| Risk Assessment & Hazard Mitigation Cycle                                         |
|                                                                                   |
|                 +----------------------------+                                    |
|                 | 1. Hazard Identification   |                                    |
|                 +-------------+--------------+                                    |
|                               |                                                   |
|                               v                                                   |
|  +-----------------------+         +-----------------------+                      |
|  | 4. Safety Monitoring  |         | 2. Risk Analysis      |                      |
|  +-----------------------+         +-----------+-----------+                      |
|               ^                                |                                  |
|               +---------------+----------------+                                  |
|                               v                                                   |
|                 +----------------------------+                                    |
|                 | 3. Control Implementation  |                                    |
|                 +----------------------------+                                    |
+-----------------------------------------------------------------------------------+
```
1. New Slide $\rightarrow$ Title: `Risk Assessment & Hazard Mitigation Cycle`.
2. Insert tab $\rightarrow$ **SmartArt** $\rightarrow$ **Cycle** category $\rightarrow$ choose **Block Cycle** (or **Radial Cycle**).
3. Type the 4 stages into the shapes:
   1. `Hazard Identification`
   2. `Risk Analysis`
   3. `Control Implementation`
   4. `Safety Monitoring`
4. Apply an attractive SmartArt color style.

---

### Screen 6.5: Slide 4 (Summary & Slide Transitions)
1. Title: `Continuous Safety Culture`.
2. Content:
   * `Proactive reporting culture ensures zero-tolerance towards unmanaged operational hazards.`
   * `Safety Assurance cycles guarantee continuous regulatory compliance and passenger safety.`
   * `Thank You — Questions Invited.`
3. Transitions tab $\rightarrow$ select **Wipe** (or **Push**) $\rightarrow$ Duration: `1.00` $\rightarrow$ click **Apply to All**.
4. Press **`F5`** to run through the complete slideshow.
5. Save presentation as `Task3_PowerPoint_RegNo.pptx`.

---

## 8. Comprehensive Verification Key & Formula Master Matrix

### 8.1 Practice Drill A Master Verification Matrix

| Task Component | Cell / Object | Exact Formula / Value | Verification Expected Output |
| :--- | :---: | :--- | :--- |
| **Excel Incentive Rate** | `E1` | `0.06` | Parameter Cell (Isolated) |
| **Incentive Formula** | `E4` | `=D4*$E$1` | `₹ 31,200.00` |
| **Incentive Formula** | `E5` | `=D5*$E$1` | `₹ 34,800.00` |
| **Incentive Formula** | `E6` | `=D6*$E$1` | `₹ 21,900.00` |
| **Incentive Formula** | `E7` | `=D7*$E$1` | `₹ 16,800.00` |
| **Incentive Formula** | `E8` | `=D8*$E$1` | `₹ 23,700.00` |
| **Performance Logic** | `F4` | `=IF(D4>=C4, "Target Met", "Below Target")` | `Target Met` |
| **Performance Logic** | `F5` | `=IF(D5>=C5, "Target Met", "Below Target")` | `Below Target` |
| **Performance Logic** | `F6` | `=IF(D6>=C6, "Target Met", "Below Target")` | `Target Met` |
| **Performance Logic** | `F7` | `=IF(D7>=C7, "Target Met", "Below Target")` | `Target Met` (Boundary $280k \ge 280k$) |
| **Performance Logic** | `F8` | `=IF(D8>=C8, "Target Met", "Below Target")` | `Below Target` |
| **Total Revenue** | `D9` | `=SUM(D4:D8)` | `₹ 2,140,000.00` |
| **Average Revenue** | `D10` | `=AVERAGE(D4:D8)` | `₹ 428,000.00` |
| **Maximum Revenue** | `D11` | `=MAX(D4:D8)` | `₹ 580,000.00` |

---

### 8.2 Practice Drill B Master Verification Matrix

| Task Component | Cell / Object | Exact Formula / Value | Verification Expected Output |
| :--- | :---: | :--- | :--- |
| **Excel Tax Rate** | `E1` | `0.12` | Parameter Cell (Isolated) |
| **Stock Value** | `E4` | `=C4*D4` | `₹ 34,000.00` |
| **Stock Value** | `E5` | `=C5*D5` | `₹ 4,480.00` |
| **Stock Value** | `E6` | `=C6*D6` | `₹ 94,250.00` |
| **Stock Value** | `E7` | `=C7*D7` | `₹ 36,000.00` |
| **Stock Value** | `E8` | `=C8*D8` | `₹ 17,220.00` |
| **Tax Liability** | `H4` | `=E4*$E$1` | `₹ 4,080.00` |
| **Tax Liability** | `H5` | `=E5*$E$1` | `₹ 537.60` |
| **Tax Liability** | `H6` | `=E6*$E$1` | `₹ 11,310.00` |
| **Tax Liability** | `H7` | `=E7*$E$1` | `₹ 4,320.00` |
| **Tax Liability** | `H8` | `=E8*$E$1` | `₹ 2,066.40` |
| **Reorder Alert** | `G4` | `=IF(C4<=F4, "REORDER IMMEDIATELY", "Stock Adequate")` | `Stock Adequate` ($40 > 25$) |
| **Reorder Alert** | `G5` | `=IF(C5<=F5, "REORDER IMMEDIATELY", "Stock Adequate")` | `REORDER IMMEDIATELY` ($14 \le 20$) |
| **Reorder Alert** | `G6` | `=IF(C6<=F6, "REORDER IMMEDIATELY", "Stock Adequate")` | `Stock Adequate` ($65 > 30$) |
| **Reorder Alert** | `G7` | `=IF(C7<=F7, "REORDER IMMEDIATELY", "Stock Adequate")` | `REORDER IMMEDIATELY` ($8 \le 10$) |
| **Reorder Alert** | `G8` | `=IF(C8<=F8, "REORDER IMMEDIATELY", "Stock Adequate")` | `Stock Adequate` ($82 > 25$) |
| **Total Valuation** | `E9` | `=SUM(E4:E8)` | `₹ 185,950.00` |
| **Highest Quantity** | `C10` | `=MAX(C4:C8)` | `82` |
| **Lowest Quantity** | `C11` | `=MIN(C4:C8)` | `8` |

---
*End of Answer Key & Step-by-Step Practical Workflow Guide.*
