# Session 11: Introduction to Spreadsheets

---

# Overview

Welcome to Session 11. Today we will be covering the following topics:

* **3.1.1 MS Excel interface: Workbooks and Worksheets**
* **3.1.2 Navigating cells, rows, and columns**
* **3.1.3 Data entry techniques (Text, Numbers, Dates)**
* **3.1.4 Using AutoFill and Flash Fill**
* **3.1.5 Selecting ranges and non-adjacent cells**
* **3.1.6 Hands-on: Creating a basic passenger list**

---

# 3.1.1 MS Excel interface: Workbooks and Worksheets

![Fully Labelled Excel Workbook](/images/excel-fully-labelled.png)

* **The Ribbon:** The tabbed toolbar at the top (File, Home, Insert, etc.) containing all commands.
* **Name Box (Address Bar):** Located top-left. Shows the active cell's address (e.g., `A1`). When selecting multiple cells, it briefly shows the dimensions, like `3R x 3C` (3 Rows by 3 Columns).
* **Formula Bar:** The long white bar next to the Name Box used to view, enter, or edit data and formulas.
* **The Grid:** The massive workspace composed of intersecting vertical columns and horizontal rows.
  * *Column Nomenclature:* Labeled alphabetically (A, B, C... to XFD). Total = **16,384 columns**.
  * *Row Nomenclature:* Labeled numerically (1, 2, 3...). Total = **1,048,576 rows**.
  * *Cell Nomenclature:* Identified by Column Letter + Row Number (e.g., `C4`).
* **Workbook vs Worksheet:**
  * *Workbook:* The entire `.xlsx` file itself.
  * *Worksheet:* A single page/tab within the workbook (e.g., `Sheet1` at the bottom left).

---

# 3.1.2 Navigating cells, rows, and columns

* **Columns:** Vertical pillars identified by Letters (A, B, C...). Excel has up to 16,384 columns.
* **Rows:** Horizontal lines identified by Numbers (1, 2, 3...). Excel has over 1 million rows.
* **Cells:** The intersection of a row and column, identified by its address (e.g., `B4`).
* **Navigation Shortcuts:** 
  * `Ctrl + Arrow Keys`: Jump to the edge of a data block.
  * `Ctrl + Home`: Jump to cell A1.

---

# 3.1.3 Data entry techniques (Text, Numbers, Dates)

* **Text (Labels):** Automatically aligns to the Left. Used for names, categories.
* **Numbers (Values):** Automatically aligns to the Right. Used for calculations.
* **Dates:** Excel treats dates as serial numbers. (e.g., Type `1/15/26` or `15-Jan`).
* **Editing Cells:** Double-click a cell or press `F2` to edit its contents without deleting the existing data.

---

# 3.1.4 Using AutoFill and Flash Fill

* **AutoFill (Fill Handle):** The small green square in the bottom-right corner of an active cell. Click and drag it to copy data or continue a series (e.g., Jan, Feb, Mar... or 1, 2, 3...).
* **Flash Fill (`Ctrl + E`):** Automatically extracts or combines data based on a pattern you provide.
  * *Example:* If Column A is 'John' and Column B is 'Doe', type 'John Doe' in Column C, press `Ctrl + E`, and Excel fills the rest.

---

# 3.1.5 Selecting ranges and non-adjacent cells

* **Selecting a Range:** Click and drag from the top-left cell to the bottom-right cell. Address is written as `A1:C5`.
* **Selecting Entire Columns/Rows:** Click the Column Letter (A) or Row Number (1) header.
* **Selecting Non-Adjacent Cells:** Hold down the `Ctrl` key while clicking different cells or dragging different ranges.

---

# 3.1.6 Hands-on: Creating a basic passenger list

* **Step 1:** Open a blank Workbook.
* **Step 2:** In row 1, type headers: Passenger Name, PNR, Flight No, Seat, Date.
* **Step 3:** Enter 5 rows of dummy data.
* **Step 4:** Use AutoFill to drag a sequential date down the Date column.
* **Step 5:** Save the file as `Passenger_List.xlsx`.

---

