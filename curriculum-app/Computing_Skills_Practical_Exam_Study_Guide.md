# Introduction to Computing Skills (Practical)
## Comprehensive Laboratory Examination Preparation Guide & Hands-On Practice Manual

---

## Table of Contents
1. [Exam Architecture, Time Management & Submission Protocol](#1-exam-architecture-time-management--submission-protocol)
2. [Module 1: Advanced MS Word Document Engineering](#2-module-1-advanced-ms-word-document-engineering)
3. [Module 2: MS Excel Spreadsheet Modeling, Logic & Visual Analytics](#3-module-2-ms-excel-spreadsheet-modeling-logic--visual-analytics)
4. [Module 3: MS PowerPoint Slide Master, Multimedia & Animation](#4-module-3-ms-powerpoint-slide-master-multimedia--animation)
5. [Module 4: High-Yield Viva Voce Question Bank & Model Answers](#5-module-4-high-yield-viva-voce-question-bank--model-answers)
6. [Module 5: Independent Hands-On Practice Drills (Mock Exams)](#6-module-5-independent-hands-on-practice-drills-mock-exams)
7. [Module 6: Pre-Submission Checklist & Common Deduction Traps](#7-module-6-pre-submission-checklist--common-deduction-traps)

---

## 1. Exam Architecture, Time Management & Submission Protocol

### 1.1 Examination Parameters
* **Total Marks:** 50 Marks
* **Time Allowed:** 2 Hours (120 Minutes)
* **Mode:** Practical Laboratory Terminal Examination
* **Software Environment:** Microsoft Office Suite (Word, Excel, PowerPoint) on Windows OS

### 1.2 Recommended 120-Minute Time Allocation Plan
To prevent running out of time, adhere strictly to the following schedule:

```mermaid
flowchart LR
    A["00-05 min<br>Folder Setup"] --> B["05-40 min<br>MS Word (15M)"]
    B --> C["40-85 min<br>MS Excel (20M)"]
    C --> D["85-110 min<br>PowerPoint (10M)"]
    D --> E["110-120 min<br>Audit & Viva (5M)"]
```

| Phase | Component | Allocated Time | Target Deliverable | Weightage |
| :--- | :--- | :--- | :--- | :--- |
| **Setup** | Terminal Workspace | 5 mins | Root directory creation on designated drive | Pre-requisite |
| **Task 1** | MS Word Task | 35 mins | `.docx` native file + exported `.pdf` | 15 Marks |
| **Task 2** | MS Excel Task | 45 mins | `.xlsx` dynamic model with formulas & chart | 20 Marks |
| **Task 3** | MS PowerPoint Task | 25 mins | `.pptx` deck with Slide Master & animations | 10 Marks |
| **Task 4** | Audit & Oral Viva | 15 mins | File naming verification + 2 viva answers | 5 Marks |

### 1.3 Directory & File Nomenclature Protocol
> [!IMPORTANT]
> Disorganized desktop saving or incorrect filenames lead to automatic deductions during examiner spot-checks.

1. **Root Directory Creation:**
   * Open File Explorer (`Windows Key + E`).
   * Navigate to the target drive (e.g., `D:\` or `Desktop` as specified by lab supervisors).
   * Create a new folder using the standard pattern:
     $$\text{Pattern: } \texttt{RegNo\_Name\_ComputingLab}$$
     *(Example: `26AV0102_ArjunSharma_ComputingLab`)*

2. **Standardized Deliverable Filenames:**
   * **Task 1:** `Task1_Word_RegNo.docx` AND `Task1_Word_RegNo.pdf` (or `Task1_Resume_RegNo.docx` / `.pdf` depending on task type).
   * **Task 2:** `Task2_Excel_RegNo.xlsx`
   * **Task 3:** `Task3_PowerPoint_RegNo.pptx`

---

## 2. Module 1: Advanced MS Word Document Engineering

### 2.1 Page Setup & Geometric Margins
Every professional document must have its physical geometry configured before adding content.

* **Menu Path:** `Layout` $\rightarrow$ `Page Setup`
* **Page Size:** Set to **A4** ($21.0\text{ cm} \times 29.7\text{ cm}$ or $8.27'' \times 11.69''$). *Never leave as default US Letter.*
* **Orientation:** **Portrait** (unless landscape orientation is explicitly specified).
* **Margins:**
  * **Standard / Normal:** Exactly $1.0\text{ inch}$ ($2.54\text{ cm}$) on Top, Bottom, Left, and Right.
  * **Compact / Custom (e.g., for 1-Page Resumes or Summaries):** Exactly $0.75\text{ inch}$ ($1.9\text{ cm}$) or $0.5\text{ inch}$ ($1.27\text{ cm}$) uniform margins.
  * *Procedure:* Click `Layout` $\rightarrow$ `Margins` $\rightarrow$ `Custom Margins...` $\rightarrow$ enter values into Top, Bottom, Left, Right.

### 2.2 Typographic Hierarchy & Paragraph Spacing
Examiners evaluate typographic consistency and visual readability.

| Document Level | Recommended Font Family | Font Size | Styling | Alignment | Paragraph Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Document Title** | Times New Roman / Calibri | $18\text{ pt}$ | **Bold**, ALL CAPS | Centered | Before: $0\text{ pt}$, After: $12\text{ pt}$ |
| **Section Headings** | Calibri / Arial | $12\text{--}14\text{ pt}$ | **Bold**, Dark Accent | Left-aligned | Before: $6\text{ pt}$, After: $3\text{ pt}$ |
| **Body Paragraphs** | Calibri / Times New Roman | $10.5\text{--}11\text{ pt}$ | Regular | **Justified** | Line Spacing: $1.15$ or $1.5$; After: $6\text{ pt}$ |
| **Header / Footer** | Calibri / Arial | $8.5\text{--}9\text{ pt}$ | Regular or *Italic* | Left / Right / Center | Single spaced |

#### Key Technical Controls:
1. **Paragraph Justification:**
   * Select body paragraphs $\rightarrow$ press `Ctrl + J` (or click `Home` $\rightarrow$ `Paragraph` $\rightarrow$ `Justify`). This aligns both left and right edges smoothly.
2. **Line Spacing & Spacing After:**
   * Select text $\rightarrow$ click `Home` $\rightarrow$ `Paragraph dialog launcher` (small arrow bottom right).
   * Set **Line Spacing** to `1.5 lines` (or `Multiple: 1.15`).
   * Set **Spacing After** to `6 pt`.
   * *Trap:* Do NOT press `Enter` multiple times to create paragraph gaps; use Spacing After to maintain uniform vertical rhythm.

### 2.3 Running Headers & Dynamic Page Numbering
> [!CAUTION]
> Never type page numbers manually into a footer (e.g. typing "Page 1 of 1"). If content shifts, typed numbers will not update, resulting in heavy examiner penalties.

#### Inserting a Running Header:
1. Double-click the top margin of the page (or click `Insert` $\rightarrow$ `Header` $\rightarrow$ `Edit Header`).
2. Type the institutional/organizational title (e.g., `Department of Computing Studies`).
3. Format font to $9\text{ pt}$, *Italic*, and align right (`Ctrl + R`).

#### Inserting Dynamic "Page X of Y" Footer:
1. Double-click the bottom margin (or click `Insert` $\rightarrow$ `Footer` $\rightarrow$ `Edit Footer`).
2. Click `Insert` $\rightarrow$ `Page Number` $\rightarrow$ `Bottom of Page`.
3. Scroll down to the **Page X of Y** category and choose **Bold Numbers 2** (Centered) or standard **Page X of Y**.
4. Word will insert dynamic XML fields: `{PAGE}` and `{NUMPAGES}`.

### 2.4 Professional Table Construction & Formatting
Tables must be structured with clear visual contrast and appropriate alignment rules.

#### Step-by-Step Table Setup:
1. **Insertion:** `Insert` $\rightarrow$ `Table` $\rightarrow$ specify row and column dimensions.
2. **Header Row Styling:**
   * Select the top row $\rightarrow$ `Table Design` $\rightarrow$ `Shading` $\rightarrow$ pick Dark Blue, Dark Slate, or Light Grey.
   * Format header text as **Bold**, contrasting color (White text on dark fill, or Black on light fill).
   * Set alignment to Center (`Layout` $\rightarrow$ `Alignment` $\rightarrow$ `Align Center`).
3. **Data Cell Alignment Conventions:**
   * **Codes, IDs, Serial Numbers:** Centered (`Align Center`).
   * **Textual Descriptions / Names:** Left-aligned (`Align Center Left`).
   * **Dates / Quantities:** Centered or Right-aligned.
   * **Monetary Figures:** Right-aligned (`Align Center Right`) for decimal decimal stacking.
4. **Preventing Awkward Table Row Breaks:**
   * Select entire table $\rightarrow$ Right-click $\rightarrow$ `Table Properties...`.
   * Under the **Row** tab:
     * Uncheck **"Allow row to break across pages"** (ensures multi-line cells do not split awkwardly across page breaks).
     * For multi-page tables, check **"Repeat as header row at the top of each page"**.

### 2.5 The "Strict 1-Page" Budgeting Strategy (for Resumes / Briefs)
When an exam task mandates a strict 1-page deliverable, accidental spills onto page 2 carry strict penalties. Use this tuning sequence:

1. **Margins:** Reduce margins from `1.0 in` to `0.75 in` or `0.6 in`.
2. **Font Size:** Reduce body text from `11 pt` to `10.5 pt` or `10 pt`.
3. **Line Spacing:** Switch from `1.5` to `1.15` or `1.10`.
4. **Paragraph Spacing:** Reduce `Spacing After` on headers and paragraphs from `6 pt` to `3 pt` or `2 pt`.
5. **Table Row Heights:** Select table $\rightarrow$ `Layout` $\rightarrow$ set `Height` to `0.22 in` and remove extra empty lines inside cells.

### 2.6 PDF Exporting Protocol
* Click `File` $\rightarrow$ `Export` $\rightarrow$ `Create PDF/XPS Document`.
* Alternatively: Click `File` $\rightarrow$ `Save As` $\rightarrow$ change "Save as type" dropdown to **PDF (*.pdf)**.
* Verify the exported PDF immediately in Adobe Acrobat or web browser to confirm zero orphan lines or accidental page spills.

---

## 3. Module 2: MS Excel Spreadsheet Modeling, Logic & Visual Analytics

### 3.1 Spreadsheet Grid Hygiene & Aesthetic Standards
An examiner inspecting an Excel sheet checks clarity, alignment, and formatting before checking formulas.

* **Header Row:** Distinct fill color (light grey, soft blue, or muted green), **Bold** text, centered horizontally and vertically.
* **Gridlines & Borders:** Select table range $\rightarrow$ `Home` $\rightarrow$ `Borders` $\rightarrow$ `All Borders`. Add `Thick Outside Border` around the perimeter.
* **Column Widths:** Double-click the column boundary header (e.g. between column B and C) to AutoFit contents so no text is truncated (`###` display error).

### 3.2 Number & Currency Formatting
Numbers should never appear as raw unformatted digits.

* **Standard Currency Formatting:**
  1. Select cells containing currency values (costs, sales, totals).
  2. Right-click $\rightarrow$ `Format Cells...` (or press `Ctrl + 1`).
  3. Under the **Number** tab, select **Currency**.
  4. Set **Decimal places:** `2`.
  5. Select **Symbol:** `₹` (INR) or `$` (USD) as required by the scenario.
  6. Example transformation: `145000` becomes `₹145,000.00`.

### 3.3 The Core Principle: Relative vs. Absolute Cell Referencing (`$`)
Understanding the dollar sign (`$`) is the single most tested concept in Excel practical examinations.

#### Concept Breakdown:
* **Relative Reference (`A1`):** When copied or AutoFilled down or across, both the column letter and row number adjust automatically relative to the new position.
  * Example: `=C4 * D4` in row 4 becomes `=C5 * D5` in row 5.
* **Absolute Reference (`$A$1`):** Both column and row are locked with dollar signs (`$`). No matter where you copy or drag the formula, it permanently points to that exact cell.
* **Mixed Reference (`$A1` or `A$1`):** Locks only the column or only the row.

```
       Relative:              Absolute:
     +------------+         +------------+
Row 4|  =D4 * E1  |       Row 4| =D4 * $E$1 |
     +------------+         +------------+
           |                      |
           v (Drag down)          v (Drag down)
     +------------+         +------------+
Row 5|  =D5 * E2  | <FAIL!Row 5| =D5 * $E$1 | <PASS!
     +------------+ (E2=0)  +------------+ (Locked)
```

#### Why Absolute Referencing is Mandatory for Parameter Cells:
When a calculation relies on an isolated reference cell (such as a Commission Rate, Tax Rate, Discount Percentage, or Currency Conversion factor in cell `E1`):
* Formula in row 4: `=D4 * $E$1`
* When dragged down to row 5, the data cell adjusts to `D5`, but `$E$1` stays locked on the parameter cell.
* *Keyboard Shortcut:* While typing or editing a cell reference, press **`F4`** once to toggle automatically between `E1` $\rightarrow$ `$E$1` $\rightarrow$ `E$1` $\rightarrow$ `$E1`.

### 3.4 Logical Decision Modeling with the `IF()` Function
The `IF()` function tests a logical condition and branches into two outcomes.

$$\texttt{Syntax: } =IF(\text{logical\_test},\; \text{value\_if\_true},\; \text{value\_if\_false})$$

#### Essential Comparison Operators:
| Operator | Meaning | Example |
| :---: | :--- | :--- |
| `>=` | Greater than or equal to | `=IF(D4 >= C4, "Target Met", "Below Target")` |
| `<=` | Less than or equal to | `=IF(C4 <= F4, "REORDER", "Stock Adequate")` |
| `>` | Strictly greater than | `=IF(E4 > 50000, "High Value", "Standard")` |
| `<` | Strictly less than | `=IF(D4 < 100, "Low", "Normal")` |
| `=` | Exactly equal to | `=IF(A4 = "Active", "Yes", "No")` |
| `<>` | Not equal to | `=IF(B4 <> 0, "Valid", "Zero Error")` |

> [!WARNING]
> Pay strict attention to boundary conditions. If a rubric states *"Reorder when stock reaches or drops below threshold"*, the condition is `C4 <= F4`. Using `C4 < F4` excludes the exact threshold number and causes mark deductions.

### 3.5 Core Aggregate & Summary Statistical Functions
Always use built-in Excel functions rather than manual arithmetic chains.

| Statistical Metric | Correct Function Syntax | Incorrect Manual Method (Deduction) |
| :--- | :--- | :--- |
| **Sum Total** | `=SUM(D4:D8)` | `=D4 + D5 + D6 + D7 + D8` |
| **Arithmetic Mean** | `=AVERAGE(D4:D8)` | `=(D4 + D5 + D6 + D7 + D8) / 5` |
| **Highest Value** | `=MAX(D4:D8)` | Looking up manually and typing the number |
| **Lowest Value** | `=MIN(D4:D8)` | Looking up manually and typing the number |
| **Item Count** | `=COUNT(D4:D8)` | Typing `5` manually |

### 3.6 Professional Data Visualization (Charts)
Examiners require clean, properly titled charts that visually represent tabular data without clutter.

#### Creating a 2D Clustered Column or Bar Chart:
1. **Range Selection:**
   * Select category labels (e.g., Representative Names or Item Codes in `A3:A8`).
   * Hold **`Ctrl`** and select data series values (e.g., Target in `C3:C8` and Actual in `D3:D8`).
2. **Chart Insertion:**
   * Click `Insert` $\rightarrow$ `Charts` $\rightarrow$ `2-D Column` $\rightarrow$ **Clustered Column** (or `2-D Bar`).
3. **Mandatory Chart Elements:**
   * **Chart Title:** Double-click default title and replace with a descriptive name (e.g., *Quarterly Sales Performance Analysis*).
   * **Axis Titles:** Click chart $\rightarrow$ `+` icon (Chart Elements) $\rightarrow$ check **Axis Titles** $\rightarrow$ label horizontal axis (e.g., *Sales Representatives*) and vertical axis (e.g., *Revenue in INR*).
   * **Legend:** Ensure legend clearly distinguishes between Series 1 and Series 2.
   * **Data Labels (optional/for Pie Charts):** Enable to show direct percentages or values on the bars/slices.
4. **Placement:** Move and scale the chart neatly directly below the calculation table; never let it overlap grid data.

### 3.7 Formula Auditing Shortcut
* **`Ctrl + ~` (Grave Accent / Tilde):** Toggles the active worksheet between showing calculated numeric values and showing the underlying formulas across every cell.
* Examiners use this shortcut during terminal spot checks to verify that formulas are present.

---

## 4. Module 3: MS PowerPoint Slide Master, Multimedia & Animation

### 4.1 Master Widescreen Canvas Setup
* **Aspect Ratio:** Ensure modern **16:9 Widescreen** is configured.
  * `Design` $\rightarrow$ `Slide Size` $\rightarrow$ select **Widescreen (16:9)**. *(Do not leave in legacy 4:3 standard format).*
* **Theme Selection:** Pick a clean, professional theme (e.g., *Office Theme*, *Facet*, *Slate*, or *Integral*). Avoid overly decorative, high-contrast distracting themes.

### 4.2 Slide Master Architecture
> [!IMPORTANT]
> The Slide Master is the central blueprint for the presentation. Typing footers, logos, or slide numbers manually on individual slides violates standard corporate workflow and results in mark deductions.

#### Configuring Universal Footers & Slide Numbers in Slide Master:
1. Click `View` $\rightarrow$ `Slide Master`.
2. Scroll to the very top in the left thumbnail panel and select the **Master Slide** (Slide 1, the top parent slide).
3. Any item added to this parent slide automatically cascades across all layouts in the deck.
4. **Configuring the Footer:**
   * Click inside the `<footer-placeholder>` box at the bottom.
   * Type the required text (e.g., `Institutional Briefing — Department of Computing`).
5. **Enabling Dynamic Slide Numbers:**
   * Click inside the `<#>` placeholder.
   * Click `Insert` $\rightarrow$ `Slide Number` $\rightarrow$ check **Slide number** and **Footer** $\rightarrow$ click **Apply to All**.
6. **Closing Slide Master:**
   * Click `Slide Master` tab $\rightarrow$ click **Close Master View** (`X`).
   * Verify on your standard slide deck that every slide displays the footer and correct numbering.

### 4.3 Content Structuring: Bullets vs. SmartArt Graphics
Examiners deduct marks when multi-item classifications or workflows are dumped as plain text paragraphs.

#### When to Use SmartArt:
* **Processes / Lifecycles:** Use *Basic Process* or *Step Down Process*.
* **Lists / Categories / Domains:** Use *Horizontal Bullet List*, *Vertical Block List*, or *Grouped List*.
* **Hierarchies / Models:** Use *Hierarchy List* or *Diverging Radial*.

#### How to Insert & Configure SmartArt:
1. Click `Insert` $\rightarrow$ `SmartArt` $\rightarrow$ select category (e.g., **Process** or **List**).
2. Type concise header titles and 1-line definitions directly into the text pane.
3. Click `SmartArt Design` $\rightarrow$ `Change Colors` $\rightarrow$ select a clean palette matching your presentation theme.

### 4.4 Object Animations vs. Slide Transitions
A fundamental distinction tested in both practical execution and viva voce:

```
+-------------------------------------------------------------------------+
| SLIDE TRANSITION: Motion that occurs between Slide 1 and Slide 2        |
| (Affects the entire canvas when changing slides)                         |
+-------------------------------------------------------------------------+
       |
       v
+-------------------------------------------------------------------------+
| OBJECT ANIMATION: Motion that occurs inside Slide 2                     |
| (Affects individual text boxes, bullet points, charts, or images)        |
+-------------------------------------------------------------------------+
```

#### Applying Sequential "On-Click" Bullet Animations:
1. Select the content text box containing bullet points.
2. Click `Animations` tab $\rightarrow$ select an Entrance effect: **Fade** or **Fly In** (avoid noisy animations like Bounce or Swivel).
3. Open the **Animation Pane** (`Animations` $\rightarrow$ `Animation Pane`).
4. Ensure the start trigger is set to **Start: On Click**.
5. In `Effect Options`, ensure sequence is set to **By Paragraph**. This guarantees bullets appear sequentially one-by-one as the presenter clicks, rather than all at once.

#### Applying a Uniform Slide Transition:
1. Select Slide 1.
2. Click `Transitions` tab $\rightarrow$ choose a subtle transition (e.g., **Push**, **Fade**, or **Wipe**).
3. Set **Duration** to `1.00 second`.
4. Click **"Apply To All"** in the Timing group. This ensures visual consistency across the entire presentation.

### 4.5 Slide Show Presentation Shortcuts
* **`F5`:** Starts the full-screen slide show from the very first slide.
* **`Shift + F5`:** Starts the slide show from the currently selected slide.
* **`Esc`:** Exits the slide show and returns to editing view.
* **`B` / `W`:** Toggles the screen to pure Black (`B`) or pure White (`W`) during a live presentation.

---

## 5. Module 4: High-Yield Viva Voce Question Bank & Model Answers

Examiners typically pose 2 to 3 conceptual and technical questions during terminal inspection. Study these model answers:

### Category A: MS Excel & Formula Engineering
**Q1. Why is Absolute Cell Referencing (`$E$1`) necessary when calculating a parameter-based column in Excel?**
> **Model Answer:** An absolute reference locks both column and row coordinates using dollar signs (`$`). When a formula is AutoFilled down across multiple rows, relative references change (e.g., `D4` becomes `D5`), but `$E$1` remains permanently fixed to the single parameter cell (such as a tax or commission rate), preventing zero values or `#VALUE!` errors.

**Q2. What is the fundamental difference between saving a workbook as `.xlsx` versus `.csv`?**
> **Model Answer:** `.xlsx` is Excel's native OpenXML workbook format that preserves multiple sheets, cell formatting, font styles, formulas, and interactive charts. `.csv` (Comma-Separated Values) is a plain-text format that stores only raw text and numbers separated by commas on a single sheet, stripping away all formulas, formatting, and charts.

**Q3. In an IF formula, why is `<=` used instead of `<` when evaluating threshold limits?**
> **Model Answer:** The `<=` (less than or equal to) operator includes the exact threshold boundary value itself. If an alert must trigger when stock reaches an exact threshold (e.g., 20 units), using `<=` triggers the alert at 20, whereas `<` would fail to trigger until stock drops to 19.

**Q4. What is the keyboard shortcut to view all formulas across the entire Excel sheet simultaneously?**
> **Model Answer:** Pressing `Ctrl + ~` (tilde / grave accent) toggles the sheet between displaying calculated cell values and displaying the underlying raw formulas.

**Q5. Why is `=SUM(A1:A5)` preferred over `=A1+A2+A3+A4+A5`?**
> **Model Answer:** `=SUM()` is scalable, automatically incorporates rows inserted within the range, and ignores text values within cells, whereas manual addition chains break if rows are added, require tedious manual updates, and return `#VALUE!` errors if text is encountered.

---

### Category B: MS Word Typography & Document Layout
**Q6. What is the difference between saving a document as `.docx` versus exporting as `.pdf`?**
> **Model Answer:** `.docx` is an editable document format used for ongoing drafting and revisions. A `.pdf` (Portable Document Format) is a standardized, fixed-layout document that preserves exact fonts, margins, page breaks, and alignments across all devices, operating systems, and printers without shifting text.

**Q7. Why must page numbers be inserted using dynamic Header/Footer fields rather than typed manually?**
> **Model Answer:** Typed numbers are static and must be manually rewritten on every page. Dynamic fields (such as `{PAGE}` and `{NUMPAGES}`) automatically recalculate the correct page numbers and total counts whenever text is edited, added, or deleted across the document.

**Q8. What settings in MS Word control page economy when fitting content onto exactly one single page?**
> **Model Answer:** Page economy is controlled by reducing custom page margins (e.g., $0.75''$ or $0.5''$), reducing font body sizes (to $10\text{--}10.5\text{ pt}$), decreasing line spacing (e.g., to $1.15$), and adjusting paragraph before/after spacing (e.g., $2\text{--}4\text{ pt}$).

**Q9. How can you prevent an MS Word table row from breaking awkwardly across two pages?**
> **Model Answer:** Select the table, open `Table Properties` $\rightarrow$ `Row` tab, and uncheck "Allow row to break across pages". Additionally, check "Repeat as header row at the top of each page" for headers.

**Q10. What does the Format Painter tool do across Microsoft Office applications?**
> **Model Answer:** Format Painter copies all typography, font sizing, color, paragraph spacing, and border formatting from a selected source element and applies it directly to target content with a single click (or double-click for multiple applications).

---

### Category C: MS PowerPoint & Presentation Engineering
**Q11. How does the Slide Master save time and ensure design consistency?**
> **Model Answer:** The Slide Master serves as the central design template. Adding a corporate logo, running footer, standardized typography, or dynamic slide numbers to the Slide Master automatically applies those changes to all slides in the deck, eliminating repetitive manual formatting.

**Q12. What is the difference between a Slide Transition and an Object Animation?**
> **Model Answer:** A Slide Transition is the motion effect applied to the whole slide canvas when moving from one slide to the next. An Object Animation is motion applied to specific elements (text boxes, bullet points, charts, shapes) within a single slide.

**Q13. Why is a SmartArt graphic superior to standard bullet points in a professional presentation?**
> **Model Answer:** SmartArt organizes information into clear visual structures—such as processes, hierarchies, and matrices—improving audience comprehension, visual engagement, and retention far better than plain walls of bulleted text.

**Q14. What keyboard shortcut begins a slide show from the currently selected slide?**
> **Model Answer:** Pressing `Shift + F5` starts the slide show from the active slide, whereas pressing `F5` starts the presentation from Slide 1.

**Q15. Why should bullet point animations be set to appear "On Click" sequentially rather than all at once?**
> **Model Answer:** Sequential "On Click" delivery prevents cognitive overload, keeps the audience's attention focused on the specific point being discussed, and prevents listeners from reading ahead of the speaker.

---

### Category D: Windows File Systems & Operating Standards
**Q16. Why is proper file nomenclature and folder organization crucial during practical examinations?**
> **Model Answer:** System administrators and examiners evaluate candidates on operational discipline. Standardized root folders (e.g., `RegNo_Name_ComputingLab`) and explicit filenames prevent file collisions, accidental overwrites, and ensure files can be located and graded efficiently.

**Q17. What happens if a file is left open in Microsoft Word or Excel while attempting to copy or move it in File Explorer?**
> **Model Answer:** Windows creates temporary lock files (`~$filename`) while applications are running. Attempting to move or rename the file generates a "File In Use / Sharing Violation" error until the application is closed.

---

## 6. Module 5: Independent Hands-On Practice Drills (Mock Exams)

*Practice these two complete, self-contained mock tasks on your computer. They replicate the exact skills, rubrics, and technical challenges of the practical examination without using confidential exam questions.*

```
================================================================================
                    PRACTICE DRILL A (MOCK EXAM 1)
================================================================================
```

### Drill A — Task 1: MS Word Operational Briefing Document (15 Marks)
* **Scenario:** You are an Operations Coordinator preparing an internal briefing memo regarding fleet logistics and maintenance tracking.
* **File Deliverables:** `Task1_Word_RegNo.docx` AND `Task1_Word_RegNo.pdf`.

1. **Page Setup:** Configure Page Size to **A4**, Orientation to **Portrait**, and Margins to **Normal (1.0 inch on all 4 sides)**.
2. **Memo Header Block:**
   * At the top, type `OPERATIONAL BRIEFING` in **18 pt**, **Bold**, **Times New Roman**, **Centered**.
   * Add memo lines with **Bold labels**:
     * **TO:** Flight Operations & Engineering Group
     * **FROM:** Logistics & Ground Support Office
     * **DATE:** 15 November 2026
     * **SUBJECT:** Quarterly Ground Support Equipment Overhaul
3. **Paragraph Typography:**
   * Type two paragraphs (minimum 40 words each) detailing scheduling and safety standards.
   * Format: **Calibri**, **11 pt**, **Line Spacing 1.5**, **Justified**, **Space After: 6 pt**.
   * Format at least three key operational terms in **Bold**.
4. **Header & Footer:**
   * **Header:** Right-aligned text: `Department of Aviation Technology — Operations Division` (9 pt, Italic).
   * **Footer:** Dynamic **Page X of Y** numbering, centered.
5. **Table Construction:**
   * Insert a 4-column by 5-row table below the paragraphs:

| Unit ID | Equipment Type | Assigned Terminal | Service Due Date |
| :---: | :--- | :---: | :---: |
| GSE-201 | Aircraft Towing Tractor | Apron Bay 4 | 05-Dec-2026 |
| GSE-202 | Belt Loader System | Cargo Terminal 2 | 08-Dec-2026 |
| GSE-203 | Ground Power Unit 90kVA | Gate 12 Stand | 12-Dec-2026 |
| GSE-204 | Cabin Air Conditioning Cart | Hangar 3 West | 15-Dec-2026 |

   * **Table Formatting:** Header row filled with Dark Slate / Dark Blue with bold white text. Center-align columns 1, 3, and 4; Left-align column 2. Apply solid grid borders.
6. **Export:** Save as `.docx` and export as `.pdf`. Verify layout in PDF viewer.

---

### Drill A — Task 2: MS Excel Performance Analytics & Charting (20 Marks)
* **Scenario:** You are analyzing regional route revenue against targets for an aviation logistics carrier.
* **File Deliverable:** Save workbook as `Task2_Excel_RegNo.xlsx` on Sheet 1.

1. **Grid Setup:**
   * Place the incentive benchmark rate of **6% (0.06)** in isolated cell **E1**.
   * Enter the table below starting at cell **A3:D8**:

| Sector Code | Sector Route | Revenue Target | Actual Revenue |
| :---: | :--- | :---: | :---: |
| SEC-11 | Bengaluru — Mumbai | 450000 | 520000 |
| SEC-12 | Bengaluru — Delhi | 600000 | 580000 |
| SEC-13 | Bengaluru — Hyderabad | 320000 | 365000 |
| SEC-14 | Bengaluru — Chennai | 280000 | 280000 |
| SEC-15 | Bengaluru — Kolkata | 420000 | 395000 |

2. **Formatting:**
   * Header row `A3:F3`: **Bold**, light grey fill, centered.
   * Apply **All Borders** to range `A3:F8`.
   * Format all monetary values in Revenue Target, Actual Revenue, and Incentive as **Currency (₹ with commas and 2 decimals)**.
3. **Formulas & Absolute Referencing:**
   * In cell **E4**, calculate Incentive: $=\text{Actual Revenue} \times \text{Incentive Rate in E1}$.
   * You **must** use an absolute reference (`=$E$1`) so the formula can be dragged down through `E8` without error.
4. **Logical IF Performance Evaluation:**
   * In cell **F4**, write an IF formula:
     $$\text{Condition: If Actual Revenue } \ge \text{ Revenue Target, display "Target Met"; otherwise display "Below Target".}$$
   * AutoFill down through row 8.
5. **Summary Metrics:**
   * In row 9: Calculate Total Actual Revenue using `=SUM()`.
   * In row 10: Calculate Average Actual Revenue using `=AVERAGE()`.
   * In row 11: Find Maximum Actual Revenue using `=MAX()`.
6. **Data Visualization (Chart):**
   * Create a **2D Clustered Column Chart** comparing *Revenue Target* vs *Actual Revenue* across all 5 sectors.
   * Add Chart Title: `Quarterly Sector Revenue Performance`.
   * Include visible Axis Titles, a clear Legend, and position the chart neatly below the summary rows.

---

### Drill A — Task 3: MS PowerPoint Presentation & Animation (10 Marks)
* **Topic:** *Next-Generation Avionics & Automation*
* **File Deliverable:** `Task3_PowerPoint_RegNo.pptx`.

1. **Canvas Setup:** 4-slide presentation in **Widescreen (16:9)** using a professional corporate theme.
2. **Slide Master:**
   * Open Slide Master.
   * Configure running footer: `Aviation Computing & Technology Briefing` on the left.
   * Configure automated **Slide Numbering** on the right.
   * Close Slide Master; verify footer and numbers appear across all slides.
3. **Slide 1 (Title):**
   * Title: `Next-Generation Avionics & Automation`
   * Subtitle: `Presented by: [Candidate Name] | Reg No: [Candidate Reg No]`
4. **Slide 2 (Content & Animation):**
   * Title: `Key Technological Pillars`
   * 4 bullet points: (a) Fly-By-Wire Digital Control, (b) ADS-B Surveillance Systems, (c) Satellite-Based Navigation (GNSS), (d) Predictive Engine Health Monitoring.
   * Apply an **Entrance Animation** (Fade or Fly In) configured to appear **On Click sequentially**.
5. **Slide 3 (SmartArt Graphic):**
   * Title: `Flight Deck Systems Integration`
   * Insert a **SmartArt Process or List Graphic** categorizing:
     * *Sensors & Data Probes* $\rightarrow$ *Central Flight Computers* $\rightarrow$ *Electronic Flight Displays*.
6. **Slide 4 (Summary & Transition):**
   * Title: `Summary & Future Roadmap`
   * Two closing sentences and a formal `Thank You`.
   * Apply a uniform **Slide Transition** (Fade or Push, 1.0 second duration) to **all 4 slides**.

---

```
================================================================================
                    PRACTICE DRILL B (MOCK EXAM 2)
================================================================================
```

### Drill B — Task 1: MS Word Professional 1-Page Curriculum Vitae (15 Marks)
* **Scenario:** You are preparing a standardized 1-page professional CV for technical aviation internship placement.
* **Deliverables:** `Task1_Resume_RegNo.docx` AND `Task1_Resume_RegNo.pdf`.
* **Strict Rule:** The exported PDF document must fit on **exactly ONE single page**.

1. **Page Setup:** Page Size: **A4**; Orientation: **Portrait**; Custom Margins: **0.75 inch on all 4 sides**.
2. **Candidate Header Block:**
   * Candidate Name: **18 pt**, **Bold**, **Calibri**, **Centered**.
   * Contact Line: `email@domain.com | +91 98765 43210 | linkedin.com/in/profile | Bengaluru, India` (10 pt, Centered).
   * Insert a horizontal dividing border line separating header from body.
3. **Section Headlines:**
   * Four distinct sections:
     1. `PROFESSIONAL SUMMARY`
     2. `EDUCATIONAL QUALIFICATIONS`
     3. `TECHNICAL SKILLS & CERTIFICATIONS`
     4. `ACADEMIC PROJECTS`
   * Format headlines: **13 pt**, **Bold**, **ALL CAPS**, Dark Blue / Accent fill, with **4 pt spacing before** and **2 pt after**.
4. **Body Text & Lists:**
   * Font: **Calibri 10.5 pt**, **1.15 line spacing**, **Justified**.
   * Under Technical Skills, create a clean bulleted list grouped by category (Office Applications, Operating Systems, Analysis Tools).
5. **Qualifications Table:**
   * Under Educational Qualifications, insert a 4-column by 4-row table:

| Qualification | Institution / Board | Year of Passing | Percentage / CGPA |
| :---: | :--- | :---: | :---: |
| B.Sc Aviation Science | Department of Aviation Studies | 2026 (Pursuing) | 8.6 CGPA |
| Higher Secondary (12th / PUC) | Department of Pre-University Education | 2023 | 86.4% |
| Secondary School (10th / SSLC) | Central Board of Secondary Education | 2021 | 89.2% |

   * Shaded header row (light grey fill, bold text), clean borders, centered alignment for columns 1, 3, and 4.
6. **PDF Verification:** Export to PDF and verify that the layout fits seamlessly on **1 page without spilling onto page 2**.

---

### Drill B — Task 2: MS Excel Spares Inventory & Reorder Modeling (20 Marks)
* **Scenario:** You are an inventory controller tracking aircraft spare parts stock levels and automated reorder alerts.
* **File Deliverable:** Save workbook as `Task2_Excel_RegNo.xlsx` on Sheet 1.

1. **Data Entry & Grid Setup:**
   * Enter the statutory sales tax rate of **12% (0.12)** in isolated cell **E1**.
   * Enter the table below starting at cell **A3:E8**:

| Item Code | Description | Stock On Hand | Unit Price (INR) | Reorder Point |
| :---: | :--- | :---: | :---: | :---: |
| SP-501 | Hydraulic Pressure Seals | 40 | 850 | 25 |
| SP-502 | Cockpit Halogen Bulbs | 14 | 320 | 20 |
| SP-503 | Aviation Spark Plugs | 65 | 1450 | 30 |
| SP-504 | Pitot Tube Heating Elements | 8 | 4500 | 10 |
| SP-505 | Rubber O-Ring Repair Kits | 82 | 210 | 25 |

2. **Formatting:**
   * Headers in `A3:G3`: **Bold**, light green/accent fill, centered.
   * Apply **All Borders** to range `A3:G8`.
   * Format Unit Price, Inventory Valuation, and Tax Liability as **Currency (₹ with 2 decimal places)**.
3. **Inventory Valuation Calculation:**
   * In cell **E4**, calculate Total Inventory Valuation:
     $$=\text{Stock On Hand} \times \text{Unit Price} \quad (=\text{C4} \times \text{D4})$$
   * AutoFill down through `E8`.
4. **Absolute Reference Tax Calculation:**
   * In cell **H4** (Tax Liability), calculate tax:
     $$=\text{Inventory Valuation} \times \text{Tax Rate in E1} \quad (=\text{E4} \times \$E\$1)$$
   * Use an **absolute reference (`$E$1`)** so the formula can be dragged down through `H8` without error.
5. **Logical IF Reorder Alert:**
   * In cell **G4**, write an IF formula:
     $$\text{Formula: } =IF(C4 \le F4, \text{"REORDER IMMEDIATELY"}, \text{"Stock Adequate"})$$
   * AutoFill down through row 8.
   * *Verify:* Items SP-502 (14 $\le$ 20) and SP-504 (8 $\le$ 10) must display `REORDER IMMEDIATELY`.
6. **Summary Metrics:**
   * In row 9: Calculate Total Inventory Valuation using `=SUM(E4:E8)`.
   * In row 10: Find Highest Stock On Hand using `=MAX(C4:C8)`.
   * In row 11: Find Lowest Stock On Hand using `=MIN(C4:C8)`.
7. **Charting:**
   * Create a **2D Clustered Bar Chart** or **Pie Chart** displaying *Inventory Valuation* for all 5 spare parts.
   * Add Chart Title: `Inventory Valuation by Spare Item`.
   * Enable visible Data Labels and position chart below the data table.

---

### Drill B — Task 3: MS PowerPoint Technical Briefing & SmartArt (10 Marks)
* **Topic:** *Aviation Safety Management Systems (SMS)*
* **File Deliverable:** `Task3_PowerPoint_RegNo.pptx`.

1. **Widescreen Canvas:** 4-slide presentation in **16:9 Widescreen** using a clean modern theme.
2. **Slide Master:**
   * Configure running footer: `Safety Management Systems (SMS) — Operations Standards`.
   * Configure dynamic slide numbers.
   * Verify it appears uniformly across all 4 slides.
3. **Slide 1 (Title):**
   * Title: `Aviation Safety Management Systems (SMS)`
   * Subtitle: `Framework & Risk Mitigation | Presented by: [Your Name, Reg No]`
4. **Slide 2 (Core Pillars & Animation):**
   * Title: `Four Pillars of ICAO Safety Management`
   * 4 bullet points: (a) Safety Policy & Objectives, (b) Safety Risk Management, (c) Safety Assurance, (d) Safety Promotion.
   * Apply an **Entrance Animation** (Fade / Fly In) configured to appear **On Click sequentially**.
5. **Slide 3 (SmartArt Graphic):**
   * Title: `Risk Assessment & Hazard Mitigation Cycle`
   * Insert a **SmartArt Cycle or Process Graphic** illustrating:
     * *Hazard Identification* $\rightarrow$ *Risk Analysis* $\rightarrow$ *Control Implementation* $\rightarrow$ *Safety Monitoring*.
6. **Slide 4 (Conclusion & Transitions):**
   * Title: `Continuous Safety Culture`
   * Two summary points and closing `Thank You`.
   * Apply a uniform **Slide Transition** (Wipe or Push, 1.0s duration) across all 4 slides.

---

## 7. Module 6: Pre-Submission Checklist & Common Deduction Traps

Before notifying the examiner for terminal inspection, review this checklist:

### 7.1 The Zero-Deduction Checklist

| Area | Verification Task | Completed? |
| :--- | :--- | :---: |
| **Workspace** | Folder named `RegNo_Name_ComputingLab` created on correct drive | [ ] |
| **Workspace** | All 4 deliverable files present inside folder with exact filenames | [ ] |
| **MS Word** | Page size confirmed as **A4**; margins confirmed (1.0" or 0.75") | [ ] |
| **MS Word** | Body text justified (`Ctrl + J`); line spacing configured (1.15 or 1.5) | [ ] |
| **MS Word** | Header present; Footer contains dynamic **Page X of Y** field | [ ] |
| **MS Word** | Table formatted with colored header, contrasting text, and clean borders | [ ] |
| **MS Word** | PDF exported and verified; strict 1-page limit verified (if applicable) | [ ] |
| **MS Excel** | Parameter cell (Tax/Commission in `E1`) locked using `$E$1` | [ ] |
| **MS Excel** | Formula verified with `Ctrl + ~` to ensure no hardcoded numbers | [ ] |
| **MS Excel** | Logical `IF` statement correctly uses `<=` or `>=` operator | [ ] |
| **MS Excel** | Currency formatting applied with comma separators and 2 decimals | [ ] |
| **MS Excel** | Chart has descriptive Title, Axis Labels, Legend, and does not overlap data | [ ] |
| **PowerPoint** | Aspect ratio is 16:9 Widescreen | [ ] |
| **PowerPoint** | Running footer and slide numbers configured in **Slide Master** | [ ] |
| **PowerPoint** | Bullet animations configured to appear **On Click sequentially** | [ ] |
| **PowerPoint** | Slide transition applied uniformly with **"Apply to All"** | [ ] |
| **PowerPoint** | Presentation tested in full-screen slide show mode (`F5`) | [ ] |

### 7.2 Examiner Deduction Rules (Avoid These Costly Errors!)

| Common Mistake | Typical Penalty | How to Avoid |
| :--- | :---: | :--- |
| **Relative reference used instead of absolute (`=D4*E1`)** | **-3.0 Marks** | Always use `$E$1` or press `F4` when referencing an isolated rate cell. |
| **Hardcoded calculation in Excel (`=D4*0.08`)** | **-2.0 Marks** | Always reference the cell containing the rate rather than typing numbers. |
| **Manual arithmetic instead of functions (`=D4+D5+...`)** | **-1.0 Mark/ea** | Always use `=SUM()`, `=AVERAGE()`, `=MAX()`, `=MIN()`. |
| **Inverted logic in IF function (`<` instead of `<=`)** | **-2.0 Marks** | Read boundary conditions carefully; use `<=` or `>=` when limits are inclusive. |
| **Typed slide footer/number on individual slides** | **-1.5 Marks** | Always enter footers and page numbers via `View` $\rightarrow$ `Slide Master`. |
| **All bullets animating at once instead of on-click** | **-0.5 to -1.0 M** | In Animation Pane, set `Effect Options` $\rightarrow$ `By Paragraph` and `Start: On Click`. |
| **Hardcoded page numbers in Word footer** | **-1.5 Marks** | Use `Insert` $\rightarrow$ `Page Number` $\rightarrow$ `Page X of Y` field code. |
| **1-Page document spilling onto page 2 in PDF** | **-2.0 Marks** | Check PDF output; reduce margins, line spacing, or table row heights. |
| **Wrong chart type (e.g., Pie instead of Clustered Column)** | **-1.5 Marks** | Choose the exact chart category specified in the instructions. |
| **Disorganized files / files saved on Desktop root** | **-1.0 to -1.5 M** | Always create the folder `RegNo_Name_ComputingLab` first and save directly inside. |

---
*End of Study Guide & Practical Preparation Manual.*
