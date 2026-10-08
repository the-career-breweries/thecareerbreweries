# Session 14: Cell Referencing

---

# Overview

Welcome to Session 14. Today we will be covering the following topics:

* **3.4.1 Understanding Relative cell referencing**
* **3.4.2 Understanding Absolute cell referencing ($)**
* **3.4.3 Mixed cell referencing**
* **3.4.4 Naming ranges for easier formula reading**
* **3.4.5 Identifying and fixing formula errors (#DIV/0!, #REF!)**
* **3.4.6 Hands-on: Calculating tax with absolute references**

---

# 3.4.1 Understanding Relative cell referencing

* **Definition:** A cell reference that automatically changes when copied to another cell.
* **How it works:** Excel doesn't remember 'Cell A2'. It remembers 'One cell to the left'.
* **Default Behavior:** All cell references (e.g., `A1`) are relative by default. This is why AutoFill works so smoothly for row-by-row calculations.

---

# 3.4.2 Understanding Absolute cell referencing ($)

* **Definition:** A cell reference that is 'locked' and does NOT change when copied.
* **The Dollar Sign (`$`):** Used to lock references. `$A$1` means both Column A and Row 1 are locked.
* **Shortcut:** Press `F4` while typing a cell reference to instantly apply dollar signs.
* **Use Case:** When multiplying an entire column of ticket prices by a single, static 'Tax Rate' cell located at the top of the sheet.

---

# 3.4.3 Mixed cell referencing

* **Definition:** Locking only the Row OR the Column, but not both.
* **Locking the Column (`$A1`):** As you drag across, the column stays A, but the row number changes as you drag down.
* **Locking the Row (`A$1`):** As you drag down, the row stays 1, but the column letter changes as you drag across.
* **Use Case:** Creating a multiplication table or complex two-way matrices.

---

# 3.4.4 Naming ranges for easier formula reading

* **Name Box:** The box to the left of the Formula bar. 
* **How to name:** Select a cell (e.g., `B1` containing a tax rate) -> click the Name Box -> type `TaxRate` -> press Enter.
* **Benefit:** You can now write formulas like `=TicketPrice * TaxRate` instead of `=A2 * $B$1`. It makes formulas absolute automatically and easy to read.

---

# 3.4.5 Identifying and fixing formula errors (#DIV/0!, #REF!)

* **`#DIV/0!`:** You are dividing a number by zero or an empty cell.
* **`#NAME?`:** Excel doesn't recognize text in your formula (usually a typo, like typing `=SUMM(A1:A5)` instead of SUM).
* **`#REF!`:** The formula refers to a cell that is not valid (usually because you deleted the row or column the formula was relying on).
* **`######`:** Not an error! The column is just too narrow to display the number. Double-click to AutoFit.

---

# 3.4.6 Hands-on: Calculating tax with absolute references

* **Step 1:** Type 'Tax Rate' in cell E1 and '15%' in cell F1.
* **Step 2:** In your data table, create a 'Tax Amount' column.
* **Step 3:** Write the formula `=Cost * $F$1` (Press F4 to lock F1).
* **Step 4:** Drag the formula down. Check the bottom rows to ensure they are still multiplying by F1.
* **Step 5:** Change F1 to '18%'. Watch all taxes update instantly.

---

