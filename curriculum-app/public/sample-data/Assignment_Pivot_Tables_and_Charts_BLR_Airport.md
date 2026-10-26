# Department of Aviation & Aerospace Management
## Course: Introduction to Computing Skills (Z7AVA 26209)
### Laboratory Assignment: Flight Operations Analysis using Pivot Tables & Pivot Charts

---

## 1. Executive Scenario & Problem Statement

**Role:** Junior Operations Analyst  
**Organization:** Airport Operations Control Centre (AOCC), Kempegowda International Airport Bengaluru (BIAL / BLR)  
**Reporting To:** Head of Airside Operations & Passenger Experience  

### Context
Kempegowda International Airport (BLR) operates two busy passenger terminals:
- **Terminal 1 (T1):** Primarily services domestic low-cost carriers (IndiGo, Akasa Air, SpiceJet).
- **Terminal 2 (T2):** Services full-service domestic operations (Air India, Vistara) as well as all long-haul international flights (LHR, DXB, DOH, SIN, SFO).

The AOCC management team has compiled a sample batch of **50 commercial flight movements** spanning Morning, Afternoon, Evening, and Night departure waves. As an operations analyst, you are required to transform this flat operational log into an **Executive Analytical Dashboard** using **Pivot Tables** and **Pivot Charts**.

Your objective is to provide actionable intelligence regarding **passenger distribution**, **carrier on-time punctuality**, **root-cause turnaround delays**, and **terminal baggage handling bottlenecks**.

---

## 2. Dataset Overview & Data Dictionary

**File Name:** `05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv`  
**Records:** 50 flight movements (Rows 2–51) + 1 Header Row (Row 1)  
**Attributes:** 13 columns  

| Col # | Field Name | Data Type | Example Values | Operational Description |
|:---:|:---|:---|:---|:---|
| **A** | `Flight_ID` | Alphanumeric | `FL-101`, `FL-102` | Unique flight movement tracking identifier |
| **B** | `Airline` | Text | `IndiGo`, `Air India`, `Akasa Air`, `Vistara`, `SpiceJet` | Operating carrier |
| **C** | `Terminal` | Categorical | `T1`, `T2` | Departure passenger terminal |
| **D** | `Sector` | Route Code | `BLR-DEL`, `BLR-BOM`, `BLR-LHR`, `BLR-SFO` | Origin-Destination flight route |
| **E** | `Aircraft_Type`| Model | `A320neo`, `A321neo`, `B737-MAX8`, `B777-300ER`, `B787-8`, `ATR-72` | Aircraft equipment deployed |
| **F** | `Flight_Type` | Categorical | `Domestic`, `International` | Sector regulatory classification |
| **G** | `Time_Slot` | Categorical | `Morning`, `Afternoon`, `Evening`, `Night` | Operational departure bank |
| **H** | `Pax_Capacity` | Integer | `72`, `164`, `186`, `189`, `222`, `342` | Total passenger seats installed |
| **I** | `Pax_Booked` | Integer | `68`, `160`, `182`, `216`, `330` | Confirmed passenger manifest count |
| **J** | `Baggage_Pcs` | Integer | `75`, `185`, `245`, `410`, `620` | Total checked-in baggage units |
| **K** | `Status` | Categorical | `On-Time`, `Delayed`, `Cancelled` | Departure flight status |
| **L** | `Delay_Mins` | Integer | `0`, `15`, `30`, `45`, `65`, `90` | Turnaround delay duration in minutes |
| **M** | `Delay_Reason` | Text | `None`, `Late Inbound Aircraft`, `ATC Congestion`, `Technical Snag`, `Weather / Rain` | Primary delay attribution code |

---

## 3. Laboratory Tasks (Deliverables)

You must create **four separate Pivot Tables** and **four corresponding Pivot Charts** on separate worksheets (or clearly organized tabs):

```
Workbook Structure:
├── Tab 1: Raw_Data (Imported CSV)
├── Tab 2: Task1_Pax_Terminal (Table + Clustered Column Chart)
├── Tab 3: Task2_Punctuality_OTP (Table + 100% Stacked Bar Chart)
├── Tab 4: Task3_Delay_Bottlenecks (Table + Sorted Horizontal Bar Chart)
└── Tab 5: Task4_Baggage_Waves (Table + Dual-Axis Combo Chart)
```

---

### Task 1: Passenger Throughput by Airline & Terminal
- **Objective:** Determine total passenger traffic volume handled by each airline, split between Terminal 1 and Terminal 2.
- **Pivot Table Specifications:**
  - **Rows:** `Airline`
  - **Columns:** `Terminal`
  - **Values:** `Pax_Booked` (Summarized by: **SUM**)
  - **Filter (Page Filter):** `Flight_Type` (Allow toggling between All, Domestic, International)
  - **Number Formatting:** Number with thousand separator (e.g., `1,250`)
- **Pivot Chart Required:** **Clustered Column Chart**
  - Horizontal Axis: Airline
  - Legend (Series): Terminal 1 vs Terminal 2
  - Chart Title: *"Passenger Throughput by Airline & Terminal (BLR AOCC)"*
- **Managerial Insight Question:** Which carrier accounts for the single largest passenger volume in Terminal 1, and which carrier dominates Terminal 2?

---

### Task 2: Airline On-Time Performance (OTP) & Reliability
- **Objective:** Evaluate flight regularity and reliability by calculating the percentage breakdown of On-Time, Delayed, and Cancelled flights per airline.
- **Pivot Table Specifications:**
  - **Rows:** `Airline`
  - **Columns:** `Status` (`Cancelled`, `Delayed`, `On-Time`)
  - **Values:** `Flight_ID` (Summarized by: **COUNT**)
  - **Value Display Calculation:** **Show Values As % of Row Total**
  - **Number Formatting:** Percentage with 1 decimal place (e.g., `85.0%`)
- **Pivot Chart Required:** **100% Stacked Bar Chart** (or 100% Stacked Column Chart)
  - Horizontal Axis: 0% to 100%
  - Vertical Axis: Airlines
  - Color Palette: Green (On-Time), Amber/Orange (Delayed), Red (Cancelled)
  - Chart Title: *"Airline On-Time Performance (OTP) Regularity Rate"*
- **Managerial Insight Question:** Which airline demonstrates the highest on-time departure rate, and which airline presents the highest operational risk to airport slots?

---

### Task 3: Root-Cause Turnaround Delay Analysis
- **Objective:** Identify which operational snags cause the longest delays and isolate their frequency.
- **Pivot Table Specifications:**
  - **Row Filter:** Filter `Delay_Reason` to exclude `None` (focus only on delayed flights).
  - **Rows:** `Delay_Reason`
  - **Values:**
    1. `Delay_Mins` (Summarized by: **AVERAGE**, formatted to 1 decimal place)
    2. `Flight_ID` (Summarized by: **COUNT**, renamed to *"Incident Count"*)
  - **Sorting:** Sort the Pivot Table in **Descending Order** by Average Delay Minutes.
- **Pivot Chart Required:** **Horizontal Bar Chart**
  - Bars sorted from highest average delay to lowest.
  - Data Labels: Enabled on the bars showing exact average minutes.
  - Chart Title: *"Average Departure Delay Duration by Root Cause"*
- **Managerial Insight Question:** What single root cause results in the longest individual flight delay, and how does air traffic congestion compare to airline technical snags?

---

### Task 4: Hourly Departure Waves & Baggage Handling Demand
- **Objective:** Analyze passenger baggage congestion across the four departure banks (Morning, Afternoon, Evening, Night) to assist ground handling staff planning.
- **Pivot Table Specifications:**
  - **Rows:** `Time_Slot` (Ensure sorted in chronological sequence: *Morning → Afternoon → Evening → Night*)
  - **Values:**
    1. `Flight_ID` (Summarized by: **COUNT**, renamed to *"Scheduled Flights"*)
    2. `Baggage_Pcs` (Summarized by: **SUM**, renamed to *"Total Baggage Pieces"*)
- **Pivot Chart Required:** **Combo Chart (Clustered Column + Line on Secondary Axis)**
  - Primary Vertical Axis (Columns): Total Baggage Pieces
  - Secondary Vertical Axis (Line with Markers): Number of Scheduled Flights
  - Chart Title: *"Baggage Handling Demand vs. Flight Movements by Departure Bank"*
- **Managerial Insight Question:** Which time bank generates the peak strain on baggage make-up carousels, and does higher flight frequency always equal higher baggage volume?

---

### Task 5 (Bonus / Distinction Challenge): Interactive Slicer Dashboard
- Connect a dynamic **Slicer** for `Flight_Type` (Domestic vs International) and `Aircraft_Type` that filters both Task 1 and Task 4 simultaneously.

---

## 4. Step-by-Step Execution Guide: Microsoft Excel

### Step 1: Opening & Preparing the Data
1. Launch **Microsoft Excel**.
2. Go to **File > Open > Browse**, locate `05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv` and open it.
3. **CRITICAL FIRST STEP:** Immediately save the file as an Excel Workbook:
   - Click **File > Save As** (or press `F12`).
   - Change **Save as type** from *CSV (Comma delimited)* to **Excel Workbook (*.xlsx)**.
   - Name your file: `[Your_Roll_No]_[Your_Name]_Aviation_Pivot_Lab.xlsx`.
4. Double-click the sheet tab at the bottom and rename it to **`Raw_Data`**.
5. Select row 1, make it **Bold**, and enable auto-fit columns (`Ctrl + A`, then `Alt + H + O + I`).

---

### Step 2: Creating a Pivot Table in Excel
1. Click any single cell inside the data range (e.g., cell `A1`).
2. Go to the ribbon: **Insert > PivotTable** (Shortcut: `Alt + N + V + T`).
3. In the dialog box:
   - Verify Table/Range shows: `Raw_Data!$A$1:$M$51`.
   - Under *Choose where you want the PivotTable report to be placed*, select **New Worksheet**.
   - Click **OK**.
4. Rename the new sheet to **`Task1_Pax_Terminal`**.
5. Notice the **PivotTable Fields Pane** on the right side containing four drop zones:
   - **Filters (Report Filter)**
   - **Columns**
   - **Rows**
   - **Values**

---

### Step 3: Configuring Task 1 (Airline by Terminal)
1. In the Fields Pane:
   - Drag **`Airline`** into **Rows**.
   - Drag **`Terminal`** into **Columns**.
   - Drag **`Pax_Booked`** into **Values**.
   - Drag **`Flight_Type`** into **Filters**.
2. **Formatting Numbers:**
   - Right-click any number in the Pivot Table > select **Number Format...**
   - Choose **Number** > check **Use 1000 Separator (,)** > set Decimal places to **0** > Click **OK**.
3. **Inserting the Pivot Chart:**
   - Click inside the Pivot Table.
   - Go to **PivotTable Analyze** (or **Options**) tab on the ribbon > click **PivotChart**.
   - Choose **Column > Clustered Column** > Click **OK**.
4. **Customizing the Chart:**
   - Click the chart title and change it to: `Passenger Throughput by Airline & Terminal (BLR AOCC)`.
   - Right-click any gray field buttons on the chart > select **Hide All Field Buttons on Chart**.
   - Click the **`+`** icon on the top-right of the chart > check **Data Labels**.

---

### Step 4: Configuring Task 2 (100% Stacked Punctuality Matrix)
1. Go back to `Raw_Data` > **Insert > PivotTable > New Worksheet** > Rename tab to **`Task2_Punctuality_OTP`**.
2. Configure Fields:
   - Drag **`Airline`** to **Rows**.
   - Drag **`Status`** to **Columns**.
   - Drag **`Flight_ID`** to **Values** (defaults to `Count of Flight_ID`).
3. **Change Value Display to %:**
   - Right-click any value in the table > **Show Values As > % of Row Total**.
   - Right-click > **Number Format...** > **Percentage** with **1** decimal place.
4. **Inserting the Pivot Chart:**
   - Go to **PivotTable Analyze > PivotChart**.
   - Choose **Bar > 100% Stacked Bar** (or **Column > 100% Stacked Column**).
   - Right-click on the data series to apply aviation status colors:
     - *On-Time:* Green (`#10b981`)
     - *Delayed:* Amber (`#f59e0b`)
     - *Cancelled:* Crimson (`#ef4444`)

---

### Step 5: Configuring Task 3 (Root-Cause Delay Duration)
1. Create a new Pivot Table on a new sheet named **`Task3_Delay_Bottlenecks`**.
2. Configure Fields:
   - Drag **`Delay_Reason`** to **Rows**.
   - Click the drop-down arrow next to `Row Labels` in cell A3 > uncheck **None** (leaving only delay causes).
   - Drag **`Delay_Mins`** to **Values**.
     - Click the drop-down on `Sum of Delay_Mins` > **Value Field Settings...** > change to **Average** > rename Custom Name to `Average Delay (Mins)` > format as Number with **1 decimal place**.
   - Drag **`Flight_ID`** to **Values** > ensure it is set to **Count** > rename to `Affected Flights`.
3. **Sort Descending:**
   - Right-click any number in the `Average Delay (Mins)` column > **Sort > Sort Largest to Smallest**.
4. **Insert Pivot Chart:**
   - Insert a **Horizontal Bar Chart** (Clustered Bar).
   - Add data labels showing the average delay minutes.

---

### Step 6: Configuring Task 4 (Combo Chart for Baggage vs Flights)
1. Create a new Pivot Table on a new sheet named **`Task4_Baggage_Waves`**.
2. Configure Fields:
   - Drag **`Time_Slot`** to **Rows**.
   - Drag **`Baggage_Pcs`** to **Values** (`Sum of Baggage_Pcs`).
   - Drag **`Flight_ID`** to **Values** (`Count of Flight_ID`).
3. Reorder rows if needed: Drag `Morning`, `Afternoon`, `Evening`, `Night` into chronological order.
4. **Insert Combo Chart:**
   - Go to **PivotTable Analyze > PivotChart > Combo**.
   - For `Sum of Baggage_Pcs`: Choose **Clustered Column** (Primary Axis).
   - For `Count of Flight_ID`: Choose **Line with Markers** > Check the **Secondary Axis** box.
   - Click **OK**.

---

## 5. Step-by-Step Execution Guide: Google Sheets

### Step 1: Importing the Downloaded CSV into Google Sheets
*Google Sheets operates entirely in the cloud. You must import the `.csv` file before creating any pivot table.*

1. Open your web browser and navigate to **Google Sheets** (type [`sheets.new`](https://sheets.new) in the address bar).
2. Go to the top menu bar: click **File > Import**.
3. In the *Import file* modal, click the **Upload** tab on the right.
4. Drag and drop `05_Aviation_BLR_Airport_Pivot_Master_Dataset.csv` or click **Browse** to select it from your Downloads folder.
5. In the **Import location** dropdown dialog:
   - Select **Replace current sheet** (or **Insert new sheet(s)**).
   - **Separator type:** Leave as **Detect automatically** (or choose *Comma*).
   - **Convert text to numbers, dates, and formulas:** Ensure **Yes** is checked.
6. Click the green button: **Import data**.
7. Rename the sheet tab at the bottom left from `Sheet1` to **`Raw_Data`**.
8. Name your spreadsheet at the top left: `[Your_Roll_No]_[Your_Name]_Aviation_Pivot_Lab`.

---

### Step 2: Creating a Pivot Table in Google Sheets
1. Highlight all data columns by clicking cell **A1**, then pressing **`Ctrl + A`** (or select columns `A:M`).
2. In the top menu, go to: **Insert > Pivot table**.
3. In the *Create pivot table* prompt:
   - Data range should display: `Raw_Data!A1:M51`.
   - Under *Insert to*, select **New sheet**.
   - Click **Create**.
4. A new sheet named `Pivot Table 1` is created. Double-click the tab and rename it to **`Task1_Pax_Terminal`**.
5. The **Pivot table editor** sidebar appears on the right with four sections:
   - **Rows**
   - **Columns**
   - **Values**
   - **Filters**

---

### Step 3: Configuring Task 1 in Google Sheets
1. In the **Pivot table editor** sidebar:
   - Beside **Rows**, click **Add** > select **`Airline`**.
   - Beside **Columns**, click **Add** > select **`Terminal`**.
   - Beside **Values**, click **Add** > select **`Pax_Booked`**. Ensure *Summarize by* is set to **SUM**.
   - Beside **Filters**, click **Add** > select **`Flight_Type`** > click *Status* dropdown to test filtering.
2. **Format Numbers:**
   - Select the number cells in the pivot table.
   - Click **Format > Number > Number** (with comma separator, 0 decimals).
3. **Insert Chart:**
   - Highlight the generated pivot table range (including headers).
   - Go to menu: **Insert > Chart**.
   - In the **Chart editor** panel on the right:
     - Under the **Setup** tab: Set **Chart type** to **Column chart**.
     - Check **Use row 1 as headers** and **Use column A as labels**.
     - Under the **Customize** tab > **Chart & axis titles**: Set Title text to `Passenger Throughput by Airline & Terminal (BLR AOCC)`.
     - Under **Series**: Check **Data labels**.

---

### Step 4: Configuring Task 2 in Google Sheets (% of Row Total)
1. Go back to `Raw_Data` > **Insert > Pivot table > New sheet** > Rename to **`Task2_Punctuality_OTP`**.
2. Configure Editor:
   - **Rows:** Click *Add* > **`Airline`**.
   - **Columns:** Click *Add* > **`Status`**.
   - **Values:** Click *Add* > **`Flight_ID`**.
     - Set *Summarize by:* **COUNTA**.
     - Set *Show as:* **% of row**.
3. **Insert Chart:**
   - Select the table > **Insert > Chart**.
   - In **Chart editor (Setup)**: Select **100% stacked bar chart** or **100% stacked column chart**.
   - Under **Customize > Series**: Set custom bar colors (On-Time = Green, Delayed = Amber, Cancelled = Red).

---

### Step 5: Configuring Task 3 in Google Sheets (Sorted Delay Causes)
1. Create a Pivot Table on a new sheet named **`Task3_Delay_Bottlenecks`**.
2. Configure Editor:
   - **Rows:** Click *Add* > **`Delay_Reason`**.
     - Under *Order*, select **Descending**.
     - Under *Sort by*, select **AVERAGE of Delay_Mins**.
   - **Values (Field 1):** Click *Add* > **`Delay_Mins`** > Set *Summarize by:* **AVERAGE**.
   - **Values (Field 2):** Click *Add* > **`Flight_ID`** > Set *Summarize by:* **COUNTA**.
   - **Filters:** Click *Add* > **`Delay_Reason`** > uncheck **None** > click **OK**.
3. **Insert Chart:**
   - Select table > **Insert > Chart** > choose **Bar chart** (Horizontal).
   - Customize axis and enable data labels.

---

### Step 6: Configuring Task 4 in Google Sheets (Combo Chart)
1. Create a Pivot Table on a new sheet named **`Task4_Baggage_Waves`**.
2. Configure Editor:
   - **Rows:** Click *Add* > **`Time_Slot`**.
   - **Values (Field 1):** Click *Add* > **`Baggage_Pcs`** > *Summarize by:* **SUM**.
   - **Values (Field 2):** Click *Add* > **`Flight_ID`** > *Summarize by:* **COUNTA**.
3. **Insert Combo Chart:**
   - Highlight the table > **Insert > Chart**.
   - Under **Setup > Chart type**: Select **Combo chart**.
   - Under **Customize > Series**:
     - Select series `Sum of Baggage_Pcs` > Type: **Columns** > Axis: **Left axis**.
     - Select series `Count of Flight_ID` > Type: **Line** > Axis: **Right axis**.

---

## 6. Evaluation & Grading Rubric (50 Total Marks)

| Criterion | Max Marks | Excellent (Full Marks) | Needs Improvement |
|:---|:---:|:---|:---|
| **1. Data Import & Hygiene** | **5** | CSV imported without truncation; headers clean; workbook saved as `.xlsx` or named Google Sheet; tabs properly labeled. | Corrupted characters, unformatted headers, or left as flat CSV. |
| **2. Task 1: Passenger Analysis** | **10** | Correct cross-tabulation of Airline × Terminal; numbers formatted with commas; clean Clustered Column Chart with clear titles. | Incorrect values (Count instead of Sum); missing chart legend or labels. |
| **3. Task 2: Punctuality Matrix** | **10** | Correctly converted to `% of Row Total`; 100% Stacked Bar chart with appropriate status color coding. | Displayed raw counts instead of row percentages; cluttered chart. |
| **4. Task 3: Root-Cause Delays** | **10** | Filtered out `None`; calculated true Average Delay Mins; sorted descending; clear horizontal bar chart. | Included `None` rows (skewing averages); sorted alphabetically instead of by delay duration. |
| **5. Task 4: Baggage Waves** | **10** | Time slots sorted chronologically; dual-axis combo chart correctly shows baggage columns (left) and flight count line (right). | Single axis chart where flight counts are invisible due to scale mismatch. |
| **6. Managerial Insight Report** | **5** | Concise 1-page executive summary answering all 4 operational questions with actionable recommendations. | Vague observations repeating raw numbers without operational meaning. |

---

## 7. Submission Instructions for Students

1. **For Excel Users:**
   - Save your final file as: `[Roll_Number]_[Your_Name]_Pivot_Assignment.xlsx`.
   - Submit the `.xlsx` file on the LMS portal (Google Classroom / Microsoft Teams / Canvas).

2. **For Google Sheets Users:**
   - Click the blue **Share** button at the top right.
   - Under *General access*, change to **Anyone with the link can view** (or *Editor* if specified by trainer).
   - Click **Copy link** and submit the URL in the LMS assignment box.

**Submission Deadline:** End of Week 18 Laboratory Session.
