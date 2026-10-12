import os

week23_content = """# Session 23: Fundamentals of Report Writing

---

# Overview

Welcome to Session 23. Today we will be covering **Fundamentals of Report Writing**.

In aviation, formal reports are legal, operational, and regulatory documents. They record facts, establish safety accountability, satisfy Directorate General of Civil Aviation (DGCA) mandates, and drive process improvements across the airline.

---

# 4.5.1 Core Concept: Structural Architecture of Aviation Reports

* **The 6-Part Standard Structure**:
  1. **Header & Metadata**: Report Title, Reference No., Date, Station/Bay, Aircraft Registration (e.g., VT-ABC), Flight No., and Author.
  2. **Executive Summary**: A concise, stand-alone synopsis capturing the incident, immediate impact, and key finding.
  3. **Chronological Timeline**: Step-by-step sequence of events with exact 24-hour timestamps (IST/UTC).
  4. **Factual Findings**: Physical observations, instrument readings, witness statements, and damage evaluations.
  5. **Root Cause Analysis**: Examination of why the failure occurred (human factors, equipment, environment).
  6. **Corrective & Preventive Actions (CAPA)**: Concrete, time-bound recommendations to prevent recurrence.
* **The Prime Directive: Absolute Objectivity**:
  * Aviation reports document **what happened**, not opinions or emotional assumptions.
  * Use precise, neutral vocabulary; never assign personal blame or speculate before forensic inspection.

---

# 4.5.2 Application: Types of Operational Reports

* **Mandatory Occurrence Report (MOR)**: Mandated by DGCA CAR Section 5, Series F for safety hazards, bird strikes, emergency turnbacks, and apron collisions.
* **Ground Safety Incident Report (GSR)**: Internal report for ramp damage, pushback failures, jet bridge malfunctions, or luggage conveyor jams.
* **Daily Station Operations Report (DSOR)**: End-of-day summary of flight turnarounds, on-time performance (OTP), baggage reconciliation, and delay coding.
* **Cabin / Ramp Handover Discrepancy Report**: Shift-level technical or physical discrepancies passed to maintenance or the incoming supervisor.

---

# 4.5.3 Worked Example 1: Executive Summary Clinic (Weak vs. Professional)

### The "Before" (Vague, Speculative, Emotional — Poor Practice):

> **Executive Summary:**  
> On 11 October, our flight 6E-214 had a huge disaster at Bay 19 because the refueling team was totally careless and spilled kerosene everywhere on the hot tarmac. The driver panicked and passengers got terrified inside the cabin smelling jet fuel. We had to hold everything up for an hour and fire trucks rushed in with sirens. The vendor should be penalized immediately for their incompetence.

### The "After" (Precise, Objective, Factual — Aviation Industry Standard):

> **1.0 Executive Summary:**  
> On 11 October 2026 at 15:42 IST, an aviation turbine fuel (ATF) spillage of approximately 45 liters occurred during the turnaround refueling of flight 6E-214 (Aircraft: VT-IZU, Bay 19). The spillage resulted from a sudden gasket failure on the fuel bowser hydrant coupler. Ramp safety protocols were initiated immediately: refueling was halted, aircraft electrical power was isolated, and Airport Rescue and Fire Fighting (ARFF) applied foam containment. All 162 boarded passengers remained safe with cabin air conditioning isolated. The ramp was cleared and certified safe by 16:30 IST, resulting in a 48-minute technical departure delay. No injuries or structural airframe damage occurred.

---

# 4.5.4 Worked Example 2: Chronological Sequence of Events

### Standardized 24-Hour Time Sequence (Ramp Refueling Spillage):

| Timestamp (IST) | Event Description | Responsible Agent |
| :--- | :--- | :--- |
| **15:30** | Aircraft VT-IZU parked at Bay 19; chocks placed and ground power unit (GPU) connected. | Ramp Marshaling Crew |
| **15:38** | Fuel bowser #FB-09 connects hydrant dispenser to right wing fueling point. | Indian Oil Aviation Crew |
| **15:42** | Hydrant coupler seal ruptures under 40 PSI pressure; ATF spills onto tarmac apron. | Fuel Operator |
| **15:43** | Emergency dead-man shut-off switch engaged; fuel flow halted. Spill area: approx. 6m x 4m. | Refueling Lead |
| **15:44** | Ramp Supervisor initiates emergency protocol: radios Airport Fire Services & Ops Control. | Ramp Supervisor (Ext. 204) |
| **15:46** | ARFF foam tender units FT-02 and FT-04 arrive on scene; foam blanket laid down. | Airport Fire Services |
| **15:52** | Captain and Cabin Crew advised; passenger doors kept open with boarding bridge attached. | Station Duty Manager |
| **16:25** | Environmental hazardous material cleanup completed; hydrocarbon absorption pads disposed. | Airport Apron Safety Lead |
| **16:30** | Bay 19 inspected, cleared, and re-opened for operations. Boarding resumed. | Duty Apron Manager |

---

# 4.5.5 Factual Neutrality Clinic: Transforming Biased Language

| Biased / Subjective Statement | Flaw in Professional Writing | Objective Aviation Standard Statement |
| :--- | :--- | :--- |
| *"The careless tractor driver crashed into the cargo door."* | Assumes negligence; uses emotional verb *"crashed"*. | *"Baggage tug #T-12 made contact with the lower edge of the aft cargo door frame at 11:14 IST."* |
| *"The passenger was screaming hysterically for no reason."* | Dismissive and judgmental; ignores underlying cause. | *"The passenger spoke in a raised, agitated tone regarding a 3-hour flight delay."* |
| *"The maintenance team was completely clueless about the error."* | Disrespectful; lacks technical precision. | *"The maintenance technician was unable to clear the flap asymmetry alert via standard BITE test."* |
| *"It was obvious that weather was the real reason."* | Speculative; lacks meteorological telemetry data. | *"Precipitation and surface visibility of 600m below landing minima required diversion to Chennai."* |
| *"We narrowly avoided a catastrophic fire disaster."* | Sensationalist; exaggerates operational risk. | *"Emergency ARFF deployment successfully mitigated flammable vapor ignition risks."* |

---

# 4.5.6 Practice Exercises

* **Exercise 1 (Executive Summary Drafting)**: Read raw station dispatcher notes regarding a jet bridge canopy collision with an Airbus A320 door frame and draft a formal 4-sentence Executive Summary.
* **Exercise 2 (Language Scrubbing)**: Review a junior handling agent's emotional witness statement and rewrite all highlighted phrases into objective, legally sound operational language.
* **Exercise 3 (Timeline Construction)**: Arrange 8 disorganized dispatch time logs into a clean, synchronized Chronological Sequence table using 24-hour IST format.

---
"""

week24_content = """# Session 24: Report Writing Application & Review

---

# Overview

Welcome to Session 24. Today we will be covering **Report Writing Application & Review**.

This session brings together all writing fundamentals—structure, tone, chronology, and factual accuracy—by examining complete, end-to-end aviation reports and learning to conduct rigorous peer reviews.

---

# 4.6.1 Core Concept: The Quality Assurance & Review Cycle

* **The Four Pillars of Report Quality Assurance**:
  1. **Factual Integrity**: Every time, registration number, bay, and personnel name must match dispatch logs and radar logs.
  2. **Logical Flow**: The chronological sequence must clearly link the initial trigger to the outcome without gaps.
  3. **Regulatory Compliance**: Adherence to standard ICAO Annex 13 and DGCA CAR reporting classifications.
  4. **Tone & Voice**: Written predominantly in the third person and formal passive/objective voice (*"The aircraft was inspected"* rather than *"I checked the aircraft"*).
* **The Peer Review Process**:
  * Cross-checking drafts against the **5 Ws and 1 H** (Who, What, Where, When, Why, How).
  * Verifying that conclusions directly flow from the stated evidence, not unproven assumptions.

---

# 4.6.2 Application: Multi-Departmental & Legal Distribution

* **Regulatory Audits**: Reports are legally subpoenaed during DGCA safety audits, air safety directorate inquiries, and civil litigation.
* **Aviation Insurance Claims**: Underwriters require exact, forensic incident reports before approving airframe or apron liability payouts.
* **Aircraft Lease Compliance**: Lessors review maintenance discrepancy reports to ensure asset airworthiness and value protection.
* **Airline Safety Management System (SMS)**: Incident reports are fed into SMS risk matrices to identify recurring fleet vulnerabilities.

---

# 4.6.3 Worked Example 1: Full-Length Aviation Incident Report

### Comprehensive Airside Ground Incident Report

> **INCIDENT INVESTIGATION REPORT**  
> **Report Ref:** SKA/BLR/GSR/2026/088 | **Classification:** Ground Safety Discrepancy  
> **Date of Occurrence:** 14 October 2026 | **Time:** 08:42 IST  
> **Location:** Bay 21, Terminal 1, Kempegowda International Airport (VOBL)  
> **Aircraft:** Boeing 737-800 | **Registration:** VT-SNG | **Flight No.:** SG-108 (BLR - DEL)  
> 
> **1.0 Executive Summary**  
> During pushback operations of flight SG-108 from Bay 21 at 08:42 IST, the pushback tow-bar shear pin snapped under excessive angular deflection. The tow-bar separated from the aircraft nose landing gear (NLG) towing lug. The tug driver immediately applied brakes. The flight crew halted the aircraft via nosewheel braking. No personnel injuries occurred, and visual inspection by licensed AME confirmed zero airframe damage. The incident caused a 32-minute departure delay.  
> 
> **2.0 Sequence of Events**  
> * **08:35 IST:** Passenger boarding completed; pushback clearance received from Bangalore Ground Control (121.75 MHz).  
> * **08:38 IST:** Chocks pulled; tow-bar connected between Towbar Tractor #TB-04 and nose landing gear.  
> * **08:41 IST:** Pushback commenced along centerline toward Taxiway Alpha.  
> * **08:42 IST:** Tractor initiated an abrupt 45-degree starboard pivot to avoid an unauthorized catering truck entering the pushback safety zone.  
> * **08:42:15 IST:** Tow-bar shear pin ruptured by design to protect the NLG torque links. Audible fracture noted.  
> * **08:43 IST:** Tug driver and headset technician signaled Captain to set aircraft parking brakes. Aircraft secured safely.  
> * **08:52 IST:** Relief tow-bar dispatched; engineering inspection of NLG torque link and steering bypass pin completed (Nil defects).  
> * **09:14 IST:** Pushback completed successfully with replacement tractor; flight SG-108 airborne at 09:24 IST.  
> 
> **3.0 Findings & Damage Assessment**  
> * **Aircraft Inspection:** Nose gear steering cylinders, torque link assembly, and tires inspected by AME Licence #8491. Zero structural deformation or hydraulic leakage observed.  
> * **Equipment:** Tow-bar shear pin fractured cleanly as designed under rated overload threshold.  
> * **Apron Traffic:** Catering truck #CT-18 entered the sterile pushback circle without clearance from apron marshals.  
> 
> **4.0 Root Cause Analysis**  
> * **Direct Trigger:** Shear pin fracture induced by high shear load during emergency tractor evasive maneuver.  
> * **Contributing Factor:** Breach of airside vehicular corridor rules by catering vendor vehicle #CT-18 encroaching into active pushback envelope.  
> 
> **5.0 Corrective & Preventive Actions (CAPA)**  
> 1. Issue an Airside Safety Violation Notice to catering service provider for corridor encroachment.  
> 2. Mandate refresher training on airside vehicle right-of-way protocols for all third-party ramp drivers.  
> 3. Refit all station tow-bar assemblies with calibrated OEM shear pin batches (#SP-B738-REV3).  
> 
> **Prepared by:** Rajiv Menon (Lead Ramp Safety Officer)  
> **Approved by:** Capt. S. Chatterjee (Station Operations Director)

---

# 4.6.4 Worked Example 2: Daily Station Operations Report (DSOR)

### Sample End-of-Day Operations Summary

> **DAILY STATION OPERATIONS REPORT (DSOR)**  
> **Station:** BLR (Kempegowda Int'l Airport) | **Date:** 14 October 2026 | **Shift:** Full Day (00:01 – 23:59 IST)  
> 
> **1. Operational Summary:**  
> * **Scheduled Departures:** 32 | **Actual:** 32 | **Cancellations:** 0  
> * **On-Time Performance (OTP - D15):** **93.75%** (Target: 92.0%)  
> * **Total Departed Passengers:** 5,842 | **Load Factor:** 88.4%  
> * **Baggage Handled:** 6,110 bags | **Mishandled Baggage Rate (MBR):** 0.32 per 1,000 pax (Industry benchmark: <0.50)  
> 
> **2. Delay Analysis (2 Delays Total):**  
> * **Flight SG-108 (BLR-DEL):** Delayed 32 min | **Code 89 (Ground Equipment Failure)** — Tow-bar shear pin rupture.  
> * **Flight SG-405 (BLR-CCU):** Delayed 18 min | **Code 93 (Aircraft Rotation / Late Inbound)** — Late arrival from Pune due to runway congestion.  
> 
> **3. Safety & Ground Discrepancies:**  
> * One minor ground occurrence logged (Ref: GSR/2026/088). Zero personnel injuries, zero Lost Time Injuries (LTI).  
> * Apron vehicle spot-checks conducted: 14 vehicles inspected, 1 driver reprimanded for missing beacon light.  
> 
> **Duty Station Manager:** **Anita Fernandez** | Ext: 101

---

# 4.6.5 Incident Report Audit Rubric

| Evaluation Metric | Beginner Level (Needs Revision) | Aviation Industry Standard (Pass) |
| :--- | :--- | :--- |
| **1. Header & Identifiers** | Missing tail registration, bay number, or UTC/IST time format. | Full metadata with registration (VT-XXX), flight number, bay, and author. |
| **2. Chronology** | Gaps in time; events described out of sequential order. | Synchronized 24-hr timestamps showing exact progression of cause to effect. |
| **3. Objectivity** | Uses emotional words (*disaster*, *careless*, *foolish*); personal opinions. | 100% neutral, factual phrasing; cites measurements, speeds, and observations. |
| **4. Findings & Evidence** | Relies on rumor or unchecked hearsay. | Grounded in physical inspection, telemetry, CCTV review, or licensed engineer sign-off. |
| **5. Actionability (CAPA)** | Vague solutions (*"Be more careful in future"*). | Specific, measurable, time-bound actions with designated department owners. |

---

# 4.6.6 Unit 4 Capstone Exercise & Review

* **Comprehensive Capstone Assignment**:  
  You are the Station Safety Officer on duty. At 19:15 IST, during the turnaround of Flight AI-508 (Airbus A321, VT-PPQ) at Bay 08, a passenger loading bridge (aerobridge) canopy abruptly retracted due to a sensor glitch, tearing a 10cm rubber seal on the forward passenger boarding door.  
  
  **Your Task**: Draft a 5-section **Ground Safety Incident Report** covering:  
  1. Header & Identifiers  
  2. Executive Summary (3-4 sentences)  
  3. Chronological Sequence of Events (at least 6 timestamped entries)  
  4. Factual Findings & Engineering Damage Inspection  
  5. Corrective & Preventive Action Plan (CAPA)

---
"""

base_paths = [
    'curriculum-app/src/content/english-lessons/ug/bba-aviation/sem1',
    'curriculum-app/src/content/english-lessons/ug/bsc-aviation/sem1'
]

for bp in base_paths:
    os.makedirs(bp, exist_ok=True)
    with open(os.path.join(bp, 'week23.md'), 'w', encoding='utf-8') as f:
        f.write(week23_content)
    with open(os.path.join(bp, 'week24.md'), 'w', encoding='utf-8') as f:
        f.write(week24_content)

print("Successfully injected worked-out example slides for Sessions 23 and 24 into both BBA and B.Sc paths!")
