# Session 16: Logical and Text Functions

---

# Overview

Welcome to Session 16. Today we will be covering the following topics:

* **3.6.1 Understanding the IF function**
* **3.6.2 Nested IF functions for complex logic**
* **3.6.3 Text functions: CONCATENATE**
* **3.6.4 Text functions: UPPER, LOWER, PROPER**
* **3.6.5 Text functions: LEFT, RIGHT, MID**
* **3.6.6 Hands-on: Formatting and evaluating passenger data**

---

# 3.6.1 Understanding the IF function

* **The IF Function:** Tests a condition and returns one value if True, and another if False.
* **Syntax:** `=IF(logical_test, value_if_true, value_if_false)`
* **Example:** `=IF(B2>23, "Overweight", "OK")`. If the bag in B2 is over 23kg, print 'Overweight'. Otherwise, print 'OK'.
* **Operators:** `>`, `<`, `=`, `>=`, `<=`, `<>` (not equal to).

---

# 3.6.2 Nested IF functions for complex logic

* **Definition:** Placing an IF function *inside* another IF function to test multiple conditions.
* **Example:** `=IF(B2>32, "Reject", IF(B2>23, "Fee", "OK"))`.
  * Logic flow: Is it over 32? Yes -> Reject. No -> Is it over 23? Yes -> Fee. No -> OK.
* **Modern Alternative:** Excel now has the `=IFS()` function which is much easier to read for multiple conditions.

---

# 3.6.3 Text functions: CONCATENATE

* **Purpose:** Joins (concatenates) text from multiple cells into one single cell.
* **Syntax:** `=CONCATENATE(A2, " ", B2)` or using the ampersand `=A2 & " " & B2`.
* **Use Case:** You have 'First Name' in column A and 'Last Name' in column B. You use this to combine them into a 'Full Name' column. Always remember to add `" "` to insert a space!

---

# 3.6.4 Text functions: UPPER, LOWER, PROPER

* **`=UPPER(text)`:** Converts all text to UPPERCASE (e.g., 'john' -> 'JOHN'). Useful for standardizing airport codes (jfk -> JFK).
* **`=LOWER(text)`:** Converts all text to lowercase.
* **`=PROPER(text)`:** Capitalizes the first letter of each word (e.g., 'john doe' -> 'John Doe'). Excellent for cleaning up messy passenger name entries.

---

# 3.6.5 Text functions: LEFT, RIGHT, MID

* **Purpose:** Extracts specific characters from a text string.
* **`=LEFT(text, num)`:** Extracts characters from the far left (e.g., `=LEFT("Boeing737", 6)` returns "Boeing").
* **`=RIGHT(text, num)`:** Extracts characters from the far right.
* **`=MID(text, start_num, num)`:** Extracts characters from the middle (e.g., extracting the middle numbers from a PNR).

---

# 3.6.6 Hands-on: Formatting and evaluating passenger data

* **Step 1:** You have a messy list of passenger names in all lowercase. Create a new column and use `=PROPER()` to fix them.
* **Step 2:** Use `=LEFT()` to extract the 3-letter airport code from a routing string (e.g., "JFK-LHR").
* **Step 3:** Use an `=IF()` statement to flag passengers whose frequent flyer miles are > 50,000 as "VIP".

---

