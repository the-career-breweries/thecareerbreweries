# Session 17: Data Management and Sorting

---

# Overview

Welcome to Session 17. Today we will be covering the following topics:

* **3.7.1 Sorting data alphabetically and numerically**
* **3.7.2 Multi-level sorting**
* **3.7.3 Applying basic filters to data sets**
* **3.7.4 Advanced number and text filters**
* **3.7.5 Finding and replacing data**
* **3.7.6 Hands-on: Filtering a large flight manifest**

---

# 3.7.1 Sorting data alphabetically and numerically

* **Sorting:** Reordering rows of data based on the contents of one column.
* **A to Z / Z to A:** Sorts text alphabetically, dates chronologically, and numbers lowest-to-highest.
* **How to Sort:** Click *any single cell* in the column you want to sort by, go to Data Tab -> Click A-Z.
* **Warning:** Never highlight a single column and sort! It will scramble the data. Just click one cell, and Excel will sort the whole row.

---

# 3.7.2 Multi-level sorting

* **Purpose:** Sorting by multiple columns sequentially.
* **Example:** Sort by 'Destination' (A-Z), and *then* by 'Departure Time' (Newest to Oldest).
* **How to do it:** Data Tab -> Sort (the big square button). Add a level for the primary sort, click 'Add Level', and set the secondary sort.

---

# 3.7.3 Applying basic filters to data sets

* **Filters:** Hide rows of data that do not meet your criteria. The data isn't deleted, just temporarily hidden.
* **How to apply:** Click anywhere in your data -> Data Tab -> Filter (funnel icon). Drop-down arrows appear on headers.
* **Basic usage:** Click a drop-down, uncheck 'Select All', and check only 'Delayed' to view only delayed flights.

---

# 3.7.4 Advanced number and text filters

* **Number Filters:** Allows logical filtering (e.g., Greater Than, Less Than, Between). 
  * *Example:* Filter 'Ticket Price' -> Greater Than -> 500.
* **Text Filters:** Allows pattern matching.
  * *Example:* Filter 'Destination' -> Contains -> 'York' (will find New York, Yorkshire).
* **Clearing Filters:** Data Tab -> Clear to view all data again.

---

# 3.7.5 Finding and replacing data

* **Find (`Ctrl + F`):** Searches the entire worksheet for a specific word, number, or phrase.
* **Replace (`Ctrl + H`):** Finds a value and replaces it with another.
  * *Use Case:* An airline changes its code from 'AI' to 'AIA'. You can instantly find all 'AI' entries and replace them with 'AIA' across 10,000 rows.

---

# 3.7.6 Hands-on: Filtering a large flight manifest

* **Step 1:** Turn on Filters for the manifest table.
* **Step 2:** Filter the 'Status' column to show only 'Checked-In' passengers.
* **Step 3:** Apply a Number Filter to show passengers with baggage > 20kg.
* **Step 4:** Clear all filters.
* **Step 5:** Perform a Multi-level Sort: By Class (First, Business, Econ) then by Name (A-Z).

---

