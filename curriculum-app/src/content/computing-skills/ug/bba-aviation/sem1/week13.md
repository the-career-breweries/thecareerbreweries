# Session 13: Basic Mathematical Formulas

---

# Overview

Welcome to Session 13. Today we will be covering the following topics:

* **3.3.1 Understanding formula syntax and the = sign**
* **3.3.2 Basic operators: Addition, Subtraction**
* **3.3.3 Basic operators: Multiplication, Division**
* **3.3.4 Order of operations (PEMDAS) in Excel**
* **3.3.5 Copying formulas across cells**
* **3.3.6 Hands-on: Calculating basic baggage fees**

---

# 3.3.1 Understanding formula syntax and the = sign

* **The Golden Rule:** Every single formula and function in Excel MUST start with an Equals Sign (`=`).
* **Formula Bar:** The white bar above the grid where the active formula is displayed.
* **Syntax Example:** `=A1+B1` tells Excel to add the value inside cell A1 to the value inside B1.
* **Constants vs References:** `=5+10` is static. `=A1+B1` is dynamic and updates automatically if A1 changes.

---

# 3.3.2 Basic operators: Addition, Subtraction

* **Addition (`+`):** Example: `=C2+D2` (Adds base fare + taxes).
* **Subtraction (`-`):** Example: `=E2-F2` (Calculates gross weight minus fuel).
* **Usage:** Click the cell where you want the answer -> Type `=` -> Click the first cell -> Type the operator -> Click the second cell -> Press `Enter`.

---

# 3.3.3 Basic operators: Multiplication, Division

* **Multiplication (`*`):** Uses the asterisk. Example: `=B2*C2` (Calculates Ticket Price * Number of Tickets).
* **Division (`/`):** Uses the forward slash. Example: `=TotalCost/12` (Calculates monthly cost).
* **Error Prevention:** Dividing by an empty cell or zero will result in a `#DIV/0!` error.

---

# 3.3.4 Order of operations (PEMDAS) in Excel

* **PEMDAS Rule:** Excel calculates in this strict order: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.
* **Example without parentheses:** `=5+2*3` results in 11 (2*3 happens first).
* **Example with parentheses:** `=(5+2)*3` results in 21 (5+2 happens first).
* **Application:** Always use `( )` to group calculations and force the correct order.

---

# 3.3.5 Copying formulas across cells

* **The Process:** Once you write a formula in the top cell, click the AutoFill handle (bottom right square) and drag it down the column.
* **Relative Referencing:** Excel is smart. If your formula is `=A2+B2`, and you copy it down to row 3, Excel automatically changes the formula to `=A3+B3`.
* **Efficiency:** You only ever need to write a formula once per column.

---

# 3.3.6 Hands-on: Calculating basic baggage fees

* **Step 1:** Create columns for 'Base Fare', 'Baggage Fee', and 'Total Cost'.
* **Step 2:** In the first 'Total Cost' cell, type `=`. Click the Base Fare cell, type `+`, click the Baggage Fee cell, and press Enter.
* **Step 3:** Use the AutoFill handle to drag the formula down for all 10 passengers.
* **Step 4:** Verify that row 5's formula correctly references row 5 data.

---

