# 💻 Lecture 08

![Week 8 Illustration](/images/computing_w8_excel_functions_1790189540316.jpg)

- MS Excel
- Functions

- Syllabus: Functions

---

# 🛠️ Lecture 08 


- **We will learn by doing** — follow each step on your computer.
- Understand functions as ready-made formulas: =SUM(), =AVERAGE()
- Use SUM to add ranges of numbers quickly
- Use AVERAGE, MAX, MIN, COUNT for statistical analysis
- Apply IF function for conditional results (Pass/Fail)
- Combine multiple functions in one sheet
- Use AutoSum button for quick calculations
- Label function results clearly in adjacent cells
- **Format results** — decimal places, percentages
- Build a complete marks/attendance analysis sheet

---

# 🧠 Key Concept

- What Is a Function? SUM, AVERAGE, MAX, MIN, COUNT

- A function is a ready-made formula built into Excel that performs a common calculation on a range of cells, without needing to write out the arithmetic by hand.

- The five most common functions:

---

# 🧠 Key Concept

- The IF Function Explained

- The IF function checks whether a condition is true or false, and returns a different result for each case. It always needs three parts, separated by commas:

- =IF(condition, value_if_true, value_if_false)

- Example: =IF(A1=40,"Pass","Fail") displays “Pass” if the value in A1 is 40 or above, and “Fail” otherwise.
- COUNTIF counts how many cells in a range meet a condition — for example, =COUNTIF(C1:C10,"Pass") counts how many cells contain the word Pass.

---

# 💻 Hands-on Practice

- **Part 1** — Do This in class

1. Open Lab07 or new sheet — enter 10 test scores in A1:A10 (45–95 range)
2. In B1 type =SUM(A1:A10) — label in C1: 'Total'
3. In B2 type =AVERAGE(A1:A10) — label: 'Average'
4. In B3 type =MAX(A1:A10) — label: 'Highest'
5. In B4 type =MIN(A1:A10) — label: 'Lowest'
6. In B5 type =COUNT(A1:A10) — label: 'Count'
7. Try AutoSum button (Home tab) — select A1:A10 — verify matches SUM

---

# 💻 Hands-on Practice

- **Part 2** — Continue in class

8. Add column B header: Marks — move functions to column D
9. In C1 type =IF(A1=40,"Pass","Fail") — press Enter
10. AutoFill IF formula down to C10 — count Pass vs Fail manually
11. In D1 type =COUNTIF(C1:C10,"Pass") — label: 'Passed'
12. Create Attendance sheet: 12 student names, 5 days (P/A marks)
13. Use COUNTIF to count Present days for each student
14. Save As: Lab08_Functions_YourName.xlsx in Excel folder

---

# 🤝 Class Activity

- Partner / Group Task

- Teams of 3: Each team gets different pass mark (35, 40, 50). Build IF formulas for 8 students. Compare: how many pass/fail changes with different cutoffs? Present one insight to class.

---

# 📝 Your Task

- exercise

- Complete Class Test Analysis sheet: 12 students with Name and Marks columns. Calculate: Total, Average, Highest, Lowest, Pass Count (≥40), Fail Count (<40) using functions. Add IF column showing Pass/Fail. Highlight highest score in bold. Save as Lab08_ClassTest_YourName.xlsx.

- Quick Tips
- Functions are ready-made formulas: =SUM(), =AVERAGE(), =IF()
- IF needs three parts: =IF(condition, value_if_true, value_if_false)
- Use AutoSum (Σ) button on Home tab for quick SUM
- COUNT counts numbers; COUNTA counts non-empty cells
- **Always label your results** — don't leave mystery numbers

---

# 📚 Learn More

- Watch These Videos (Part 1)

- Click links to review before/after class or during breaks:
1. Excel: Functions
- https://www.youtube.com/watch?v=-9d4m79twdA
2. IF Function in Excel Tutorial
- https://www.youtube.com/watch?v=2mzGsJtJvLc
3. Excel: COUNTIF and SUMIF
- https://www.youtube.com/watch?v=H3nzCAv6d1A
4. Excel: Statistical Functions
- https://www.youtube.com/watch?v=-9d4m79twdA

---

# 📚 Learn More

- Watch These Videos (Part 2)

- Click links to review before/after class or during breaks:
5. Excel: Getting Started
- https://www.youtube.com/watch?v=lgIWIPDJuPo

---

# 🏁 Wrap Up

- Recap & Homework

- Today we covered: Functions
- Homework / Practice:
- Practice SUM and AVERAGE on 12 numbers. Build IF formula for grading: A (≥80), B (≥60), C (≥40), Fail (<40). Try one COUNTIF. Watch IF function video.
- Questions? Ask in the next session.
- Save all your files before leaving the computer class.

---

# 🛠️ class Activity File

Please download the starting file below to follow along with today's hands-on exercise.

```download
Lecture_08_MS_Excel_Functions_Demo.xlsx
```