# Session 15: Essential Functions (Statistical)

---

# Overview

Welcome to Session 15. Today we will be covering the following topics:

* **3.5.1 Introduction to Excel Functions**
* **3.5.2 Using SUM and AutoSum**
* **3.5.3 Using AVERAGE**
* **3.5.4 Using MIN and MAX**
* **3.5.5 Using COUNT and COUNTA**
* **3.5.6 Hands-on: Analyzing daily passenger counts**

---

# 3.5.1 Introduction to Excel Functions

* **Formulas vs Functions:** A formula is an equation you write manually (`=A1+A2+A3`). A function is a pre-programmed calculation built into Excel (`=SUM(A1:A3)`).
* **Syntax Structure:** `=FUNCTION_NAME(argument1, argument2)`.
* **Arguments:** The data inside the parentheses that the function needs to calculate (usually a range of cells).

---

# 3.5.2 Using SUM and AutoSum

* **`=SUM(range)`:** Adds all numbers in a range of cells.
  * *Example:* `=SUM(B2:B10)` calculates total revenue.
* **AutoSum (Shortcut `Alt + =`):** The fastest tool in Excel. Click the empty cell below a column of numbers, press `Alt + =`, and Excel automatically writes the SUM function for you.

---

# 3.5.3 Using AVERAGE

* **`=AVERAGE(range)`:** Calculates the arithmetic mean of a range of cells.
  * *Example:* `=AVERAGE(C2:C20)` finds the average passenger age or average ticket price.
* **Important Note:** Empty cells are ignored by the AVERAGE function, but cells containing a '0' are included and will drag the average down.

---

# 3.5.4 Using MIN and MAX

* **`=MAX(range)`:** Finds the largest (maximum) number in a range.
  * *Example:* `=MAX(D2:D50)` finds the highest ticket price paid.
* **`=MIN(range)`:** Finds the smallest (minimum) number in a range.
  * *Example:* `=MIN(D2:D50)` finds the lowest ticket price paid.

---

# 3.5.5 Using COUNT and COUNTA

* **`=COUNT(range)`:** Counts the number of cells that contain ONLY NUMBERS.
* **`=COUNTA(range)`:** Counts the number of cells that are NOT EMPTY (includes text, numbers, errors).
  * *Use Case:* Use COUNTA on a 'Passenger Name' column to see how many people are on the manifest. Using COUNT would return 0 because names are text.

---

# 3.5.6 Hands-on: Analyzing daily passenger counts

* **Step 1:** Open the `Daily_Manifest` dataset.
* **Step 2:** Use `=COUNTA()` to determine the total number of passengers boarded.
* **Step 3:** Use `=AVERAGE()` on the baggage weight column.
* **Step 4:** Use `=MAX()` and `=MIN()` to find the heaviest and lightest bags.
* **Step 5:** Use AutoSum to find the total combined baggage weight.

---

