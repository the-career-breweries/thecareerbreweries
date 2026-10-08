# Session 19: Basic Data Analysis Tools

---

# Overview

Welcome to Session 19. Today we will be covering the following topics:

* **3.9.1 Using Conditional Formatting (Highlight cell rules)**
* **3.9.2 Conditional Formatting (Data bars and color scales)**
* **3.9.3 Removing duplicates from a dataset**
* **3.9.4 Text to Columns (Splitting data)**
* **3.9.5 Data Validation (Creating drop-down lists)**
* **3.9.6 Hands-on: Cleaning and validating crew records**

---

# 3.9.1 Using Conditional Formatting (Highlight cell rules)

* **Definition:** Changes the color/formatting of a cell automatically based on its value.
* **Highlight Cell Rules:** Home Tab -> Conditional Formatting.
  * *Greater/Less Than:* E.g., Highlight all delays > 30 mins in Red.
  * *Text that Contains:* E.g., Highlight the word 'Cancelled' with a red background.

---

# 3.9.2 Conditional Formatting (Data bars and color scales)

* **Data Bars:** Fills the cell with a colored bar proportional to the cell's value. Creates a mini-bar chart directly inside the cell!
* **Color Scales:** Applies a heat-map gradient to a range of numbers (e.g., Green for high revenue, Red for low revenue).
* **Icon Sets:** Adds mini icons (like traffic lights or arrows) based on thresholds.

---

# 3.9.3 Removing duplicates from a dataset

* **The Problem:** Data entry errors often result in the same passenger or invoice being entered twice.
* **The Solution:** Highlight the dataset -> Data Tab -> Remove Duplicates.
* **How it works:** You check the boxes for columns that must be identical to count as a duplicate. Excel deletes the copies and keeps the first unique instance.

---

# 3.9.4 Text to Columns (Splitting data)

* **Purpose:** Splits data from one column into multiple columns based on a delimiter (like a comma or space).
* **Use Case:** You export data and get 'Lastname, Firstname' in one cell. You want them in two separate cells.
* **Steps:** Highlight the column -> Data Tab -> Text to Columns -> Delimited -> Choose 'Comma' -> Finish.

---

# 3.9.5 Data Validation (Creating drop-down lists)

* **Purpose:** Restricts what users can type into a cell to prevent errors.
* **Drop-Down Lists:** Data Tab -> Data Validation -> Allow: List.
  * *Source:* Type items separated by commas (e.g., `Economy, Business, First`) or select a range of cells.
* **Benefit:** Ensures perfect data consistency (no more fixing 'Econ', 'Eco', 'Economy' typos).

---

# 3.9.6 Hands-on: Cleaning and validating crew records

* **Step 1:** Select the 'Crew Class' column and apply Data Validation to create a drop-down list (Pilot, Copilot, Cabin Crew).
* **Step 2:** Select the dataset and click 'Remove Duplicates' to clean up accidental double-entries.
* **Step 3:** Use Text-to-Columns to split a 'Full Name' column into 'First Name' and 'Last Name'.
* **Step 4:** Apply Conditional Formatting to highlight all 'Expired' certifications in Red.

---

