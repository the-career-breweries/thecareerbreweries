# 💻 Lecture 07

![Week 7 Illustration](/images/computing_w7_excel_formulas_1790189523842.jpg)

- MS Excel
- Formulas

- Syllabus: Formulas

---

# 🛠️ Lecture 07 


- **We will learn by doing** — follow each step on your computer.
- Open Excel and understand the grid: cells, rows (numbers), columns (letters)
- **Enter text and numbers in cells** — edit and delete data
- Write basic formulas using +, -, *, / operators
- Understand cell references (A1, B2) vs typing numbers directly
- Use AutoFill to copy formulas down a column
- Build a simple data table with calculated columns
- Format numbers as currency or decimal places
- Save workbooks as .xlsx files in Excel folder
- Open faculty demo file and practise along

---

# 🧠 Key Concept

- Formulas Explained: Cells, References & Operators

- A cell is one box in the grid, named by its column letter and row number (for example, A1 is column A, row 1). A formula is an instruction that always starts with an = sign and tells Excel to calculate something, instead of just displaying typed text or numbers.

- Basic arithmetic operators:

- Using a cell reference (A1) instead of typing a number directly means the formula updates automatically if the value in A1 later changes.

---

# 🧠 Key Concept

- AutoFill & Relative vs Absolute References

- AutoFill copies a formula down (or across) a range of cells automatically, by dragging the small square (the fill handle) at the bottom-right corner of a selected cell.


### 🔹 Relative Reference  (A1)
- Changes automatically when a formula is copied to a new cell. If =A1*2 in cell B1 is AutoFilled down, it becomes =A2*2 in B2, =A3*2 in B3, and so on.


### 🔹 Absolute Reference  ($A$1)
- Stays fixed on the same cell no matter where the formula is copied, because of the dollar signs. Useful for a fixed value such as a tax rate that every row should use.

---

# 💻 Hands-on Practice

- **Part 1** — Do This in class

1. Open Excel — new blank workbook — note cell A1 is active
2. In A1:A5 enter numbers: 10, 20, 30, 40, 50
3. In B1 type =A1*2 and press Enter — result should be 20
4. Click B1 — drag fill handle (small square) down to B5
5. In C1 type =A1+B1 — AutoFill down to C5
6. In D1 type =SUM(A1:A5) — check result is 150
7. Label columns in row above: Value | Double | Sum | Total

---

# 💻 Hands-on Practice

- **Part 2** — Continue in class

8. New sheet (click + at bottom) — create Ticket Sales table
9. Columns: Passenger, Fare (₹), Tax (10%), Total
10. Enter 4 passengers with fares: 4500, 6200, 3800, 7100
11. Tax formula in C2: =B2*0.1 — AutoFill down
12. Total formula in D2: =B2+C2 — AutoFill down
13. Format Fare column as Currency (₹)
14. Save As: Lab07_Formulas_YourName.xlsx in Excel folder

---

# 🤝 Class Activity

- Partner / Group Task

- **Pairs: Faculty gives a cargo problem** — 'Flight carries 120 passengers, avg baggage 18 kg each. Total cargo weight?' One student writes the formula on paper, other builds it in Excel. Compare answers. Try 2 more cargo scenarios.

---

# 📝 Your Task

- exercise

- Build a complete Ticket Sales sheet: columns Passenger, Route, Fare, Tax (18% GST), Total. Minimum 5 rows of realistic aviation data. Use formulas for Tax and Total (no manual calculations). Add a Grand Total row using SUM. Save as Lab07_TicketSales_YourName.xlsx.

- Quick Tips
- **Every formula starts with = sign** — without it, Excel treats it as text
- Click cells instead of typing references — fewer errors
- Drag fill handle (small square at cell corner) to copy formulas
- Relative references (A1) change when copied; $A$1 stays fixed
- **Use currency format for money** — Home tab  Number Format

---

# 📚 Learn More

- Watch These Videos (Part 1)

- Click links to review before/after class or during breaks:
1. Excel: Getting Started
- https://www.youtube.com/watch?v=lgIWIPDJuPo
2. Excel: Intro to Formulas
- https://www.youtube.com/watch?v=xc14gFFyiTw
3. Excel: Simple Formulas
- https://www.youtube.com/watch?v=O3QAPo6mi0s
4. Excel: Cell References
- https://www.youtube.com/watch?v=FbWh5yRjwSk

---

# 📚 Learn More

- Watch These Videos (Part 2)

- Click links to review before/after class or during breaks:
5. Excel: Basic Math
- https://www.youtube.com/watch?v=O3QAPo6mi0s

---

# 🏁 Wrap Up

- Recap & Homework

- Today we covered: Formulas
- Homework / Practice:
- Create Excel sheet with 8 numbers in column A. In column B, double each value using formula. Find Sum and Average in separate cells. Watch Intro to Formulas video.
- Questions? Ask in the next session.
- Save all your files before leaving the computer class.

---

# 🛠️ class Activity File

Please download the starting file below to follow along with today's hands-on exercise.

```download
Lecture_07_MS_Excel_Formulas_Demo.xlsx
```