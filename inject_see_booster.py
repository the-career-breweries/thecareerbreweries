# -*- coding: utf-8 -*-
"""
inject_see_booster.py
Generates the comprehensive SEE High-Yield Supplementary Notes & Exam Booster Module
for Communicative English (Course Code: Z7AVA 26203 / Z7AVB 26203)
and integrates it directly into notes-content.json.
"""

import json
import os
import sys

NOTES_FILE = os.path.join(os.path.dirname(__file__), "curriculum-app", "src", "data", "notes-content.json")

def build_see_booster():
    # -------------------------------------------------------------
    # MODULE 1: Shannon-Weaver Communication Model in Aviation
    # -------------------------------------------------------------
    topic_1 = {
        "partBanner": "MODULE 1 · 5-MARK EXAM CORE: THEORETICAL FRAMEWORK",
        "title": "1. The Shannon-Weaver Mathematical Communication Model & The 4 Aviation Noise Barriers",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "Think of ordering food on Swiggy or Zomato: You (**Information Source**) decide you want a Margherita pizza; your mobile app encodes your order into digital data packets (**Transmitter**); the 5G cellular network carries the radio waves (**Channel**); the restaurant's kitchen tablet decodes the packets into a printed order slip (**Receiver**); and the pizza chef (**Destination**) bakes it. But if cellular network congestion corrupts the order (**Noise**), or if the chef misreads 'extra cheese' as 'no cheese' without sending an automated order confirmation back to your screen (**Feedback**), you end up hungry and frustrated.\n\n"
            "**Aviation Operational Reality:**\n"
            "Claude Shannon and Warren Weaver (1949) originally formulated this linear mathematical model for telecommunications at Bell Telephone Laboratories, but in modern aviation, it represents the life-or-death architecture of air traffic control and flight deck safety. On a turbulent monsoon approach into Kempegowda International Airport (BLR/VOBL), an Approach Controller (**Information Source**) recognizes that an arriving Airbus A320neo must descend to 4,000 feet and reduce speed to 180 knots to maintain safe radar wake turbulence separation. The controller's vocal cords and radio console encode this thought into standardized ICAO English (**Transmitter**) and broadcast it over VHF 125.4 MHz (**Channel**). Environmental thunderstorms, jet blast, and frequency carrier heterodyning inject severe **Noise**. The aircraft's VHF antenna and audio control box decode the radio transmission (**Receiver**) into acoustic sound in the Captain's headset (**Destination**).\n\n"
            "**The Critical Life-Saving Feedback Loop:**\n"
            "Aviation CANNOT function as a 1-way linear pipeline. Under ICAO Annex 10 standards, the Captain MUST transmit a verbatim **Active Readback** back to the controller. The controller performs **Hearback** (auditory confirmation). If the readback matches the original clearance, the circuit is closed and the aircraft descends. If any digit was corrupted, the controller immediately transmits 'Negative, I say again...'. Without this closed feedback loop, catastrophic mid-air collisions occur."
        ),
        "table": {
            "headers": ["Noise Barrier Category", "Everyday Plain English Analogy", "Aviation Operational Reality (Airport / Flight)", "Elimination & Mitigation Protocol"],
            "rows": [
                [
                    "**1. Physical / Acoustic Noise**",
                    "Trying to hold a phone conversation while walking past a loud construction jackhammer or standing on a horn-blaring Bangalore traffic junction.",
                    "110–130 dB apron jet engine roar (LEAP-1A / CFM56 turbofans), APU exhaust whine, VHF radio static, simultaneous microphone clicks (carrier heterodyne squeal), and high-wind slipstream buffeting.",
                    "Active Noise-Cancelling (ANC) aviation headsets (Bose A20/A30, David Clark), high-gain noise-canceling boom microphones, shielded VHF radios, and Controller-Pilot Data Link Communications (CPDLC digital ACARS text messages)."
                ],
                [
                    "**2. Physiological Noise**",
                    "Attempting to absorb a dense university grammar lecture while suffering from a throbbing migraine or after staying awake for 24 hours straight.",
                    "Severe circadian rhythm disruption during back-of-the-clock red-eye turnarounds (01:00–05:00 hrs), flight crew hearing fatigue, and sub-clinical hypoxia at 8,000 ft cabin altitude reducing cognitive processing speed.",
                    "Strict enforcement of DGCA Flight and Duty Time Limitations (FDTL), mandatory controlled flight deck rest protocols, supplemental oxygen use above regulatory altitudes, and dual-pilot cross-monitoring checklists."
                ],
                [
                    "**3. Psychological Noise**",
                    "Blanking out in an examination hall due to acute panic, where severe stress prevents your working memory from recalling simple memorized formulas.",
                    "High-stress cognitive tunnel vision following multiple Master Warning chimes, rush-to-depart mindset ('hurry-up syndrome' / 'get-there-itis' to avoid airport slot expiry), and steep cockpit authority gradients intimidating junior First Officers.",
                    "Crew Resource Management (CRM) psychological safety training, strict enforcement of the **Sterile Cockpit Rule** below 10,000 ft, and standardized Threat and Error Management (TEM) briefing routines."
                ],
                [
                    "**4. Semantic Noise**",
                    "A software engineer telling a layperson to 'kill the child process' (disturbing and incomprehensible due to specialized jargon clash).",
                    "Using ambiguous conversational slang (e.g. 'we are taking off' instead of 'ready for departure'), heavy non-standard regional accents, and homophones (e.g., confusing 'to two thousand' with 'to/too 2,000' or 'for four').",
                    "Mandatory ICAO English Language Proficiency (Level 4 Operational minimum, Level 6 Expert), universal ICAO standard phraseology (Doc 9432), and strict prohibition of casual conversational chit-chat on ATC frequencies."
                ]
            ]
        },
        "rule": {
            "title": "THE CLOSED-LOOP HEARBACK SAFETY THEOREM",
            "text": "**Linear Flow:** Information Source → Transmitter (Encoding) → Channel (under Noise) → Receiver (Decoding) → Destination.\n**The Mandatory Life-Saving Loop:** Destination → Transmitter (Verbatim Readback) → Channel → Receiver (Hearback Verification) → Information Source.\n*Transmission + Readback + Hearback = 100% Error Elimination.*"
        },
        "workedExample": {
            "title": "Worked Exam Scenario: ATC Landing Clearance under Severe High-Wind Squall (BLR Runway 09L)",
            "text": "An examination question asks you to trace a complete transmission using the Shannon-Weaver model during an adverse weather approach into Kempegowda International Airport Bengaluru (VOBL).",
            "everydayContext": "Verifying a delivery address over a poor phone connection: 'Did you say Flat 402 in Block B?' — 'Yes, 402 Block B, delivery confirmed.'",
            "aviationContext": "IndiGo Flight 6E-204 on final ILS approach to Runway 09L with 32-knot crosswind gusts, rain squall, and VHF radio static.",
            "steps": [
                "[STEP 1: INFORMATION SOURCE (Bangalore Tower Controller)]:",
                "Controller decides Runway 09L is clear and safe for landing, formulating clearance parameters (Runway 09L, Wind 080° at 22 knots gusting 32 knots).",
                "[STEP 2: TRANSMITTER (Encoding into ICAO Phraseology)]:",
                "Controller speaks into boom mic: 'IndiGo 204, Runway 09L, wind 080 degrees, 22 knots gusting 32, Cleared to Land.'",
                "[STEP 3: CHANNEL (VHF Radio 118.1 MHz)]:",
                "Electromagnetic radio waves broadcast from Bangalore ATC transmitter tower toward the aircraft.",
                "[STEP 4: NOISE SOURCES INJECTED]:",
                "Acoustic noise (rain pounding cockpit windshield at 140 knots) + Physical noise (atmospheric static crackle + momentary heterodyne squeal from another aircraft keying mic).",
                "[STEP 5: RECEIVER (Aircraft VHF Com 1 & Audio Control Panel)]:",
                "Aircraft antenna captures radio signal; audio panel filters static and routes audio to pilots' headsets.",
                "[STEP 6: DESTINATION (Captain / Pilot Flying & First Officer / Pilot Monitoring)]:",
                "Both pilots decode acoustic words in their headsets into cognitive understanding: 'We have permission to land on Runway 09L.'",
                "[STEP 7: FEEDBACK LOOP (Active Readback)]:",
                "First Officer presses Push-To-Talk (PTT) switch and transmits verbatim: 'Runway 09L, Cleared to land, IndiGo 204.'",
                "[STEP 8: HEARBACK CONFIRMATION (Loop Closed)]:",
                "Tower controller listens attentively to the readback. Every element matches the issued instruction. Zero transposition error. Safe touchdown executed."
            ],
            "verdict": "Had the pilot simply replied 'Roger, descending' (a linear model without feedback), an incorrect runway alignment (09L vs 09R) would have remained undetected, causing a disastrous runway incursion."
        },
        "memoryTrick": (
            "**S-T-C-R-D + F Mnemonic:**\n"
            "**S**afe **T**ransmissions **C**reate **R**eliable **D**epartures + **F**eedback!\n"
            "(**S**ource → **T**ransmitter → **C**hannel → **R**eceiver → **D**estination + **F**eedback Loop)\n\n"
            "**The 4 Noises (P-P-P-S):**\n"
            "• **P**hysical (Decibels & Static)\n"
            "• **P**hysiological (Fatigue & Hypoxia)\n"
            "• **P**sychological (Stress & Panic)\n"
            "• **S**emantic (Slang & Accents)"
        ),
        "examTip": (
            "CRITICAL 5-MARK EXAM WARNING:\n"
            "Never draw the Shannon-Weaver model as a 1-way horizontal line ending at Destination! A 1-way line is the telephonic model of 1949 that causes aviation disasters (like the Tenerife crash). In your university exam answer, ALWAYS draw the **Feedback Loop (Readback/Hearback)** returning from Destination back to Information Source, and explicitly explain how Active Readback eliminates noise!"
        ),
        "isTrap": True
    }

    # -------------------------------------------------------------
    # MODULE 2: Active vs. Passive Voice Grammar Architecture
    # -------------------------------------------------------------
    topic_2 = {
        "partBanner": "MODULE 2 · GRAMMAR ARCHITECTURE: 5-MARK EXAM TRANSFORMATIONS",
        "title": "2. Active vs. Passive Voice: Mechanical Conversion Rules & Blame-Free Aviation Safety Documentation",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "In daily conversation, Active Voice is personal and direct: 'Chef Rohan baked the chocolate truffle cake.' The person doing the action (Chef Rohan) stands proudly first. In Passive Voice, the spotlight moves to the object: 'The chocolate truffle cake was baked by Chef Rohan' (or simply 'The cake was baked'). We use passive voice when the object is more important than who made it, or when the maker is obvious.\n\n"
            "**Aviation Operational & Legal Necessity:**\n"
            "In commercial aviation safety management systems (SMS), incident reporting, and maintenance engineering logs, Passive Voice is not merely a stylistic option—it is a mandatory legal requirement under **ICAO Annex 13 ('Aircraft Accident and Incident Investigation')** and **DGCA Civil Aviation Requirements (CAR Section 5)**.\n\n"
            "**Why is Passive Voice Mandatory in Aviation Incident Reports?**\n"
            "1. **Establishes a Just, Blame-Free Culture:** Active voice assigns personal blame ('Tug Driver Ramesh snapped the nose landing gear shear pin'). This induces fear, defensiveness, and under-reporting of incidents. Passive voice ('The nose landing gear shear pin was sheared during pushback operations') focuses objectively on the mechanical failure, the operational force, and preventive maintenance.\n"
            "2. **Keeps the Focus on the Aircraft & Hazards:** In technical safety logs, the aircraft, engine, passenger safety system, or regulatory directive is paramount. Who performed the action is secondary or documented in sign-off stamp blocks."
        ),
        "table": {
            "headers": ["Tense / Grammatical Mood", "Active Operational Sentence", "Passive Safety Log Transformation", "Aviation Context & Procedural Rationale"],
            "rows": [
                [
                    "**Simple Present**",
                    "The ramp agent inspects the cargo hold fire suppression seals before departure.",
                    "The cargo hold fire suppression seals **are inspected** before departure.",
                    "Routine pre-departure ground checklist; focus remains on the safety hardware, not the individual handler."
                ],
                [
                    "**Present Continuous**",
                    "The ground refueling crew is refueling the Airbus A321neo with 12,000 kg of Jet A-1.",
                    "The Airbus A321neo **is being refueled** with 12,000 kg of Jet A-1.",
                    "Real-time ramp operations status board; highlights aircraft departure readiness for flight dispatch."
                ],
                [
                    "**Simple Past**",
                    "The aircraft maintenance engineer discovered metal shavings in the Number 2 engine oil filter.",
                    "Metal shavings **were discovered** in the Number 2 engine oil filter.",
                    "Aircraft Technical Logbook (TLB) snag entry; emphasizes the hazardous contaminant rather than who held the flashlight."
                ],
                [
                    "**Past Continuous**",
                    "Air traffic control was vectoring six widebody aircraft into holding patterns during the thunderstorm.",
                    "Six widebody aircraft **were being vectored** into holding patterns during the thunderstorm.",
                    "Airspace safety incident investigation report; objectively records traffic congestion density."
                ],
                [
                    "**Present Perfect**",
                    "The cabin safety inspector has verified all eight overwing emergency escape slide pressure gauges.",
                    "All eight overwing emergency escape slide pressure gauges **have been verified**.",
                    "Pre-flight airworthiness certification sign-off; documents safety compliance as a verified state."
                ],
                [
                    "**Past Perfect**",
                    "The ground handler had disconnected the high-pressure towbar before the Captain released the brakes.",
                    "The high-pressure towbar **had been disconnected** before the parking brake **was released**.",
                    "Chronological sequence of events in a ramp collision investigation report."
                ],
                [
                    "**Simple Future & Modals**",
                    "Aviation security officers must confiscate all lithium power banks exceeding 160 Watt-hours.",
                    "All lithium power banks exceeding 160 Watt-hours **must be confiscated**.",
                    "BCAS / DGCA mandatory regulatory security directive; emphasizes universal enforcement over screener identity."
                ],
                [
                    "**Modal Perfect**",
                    "The flight dispatcher should have cross-checked the updated NOTAM regarding Runway 27 threshold displacement.",
                    "The updated NOTAM regarding Runway 27 threshold displacement **should have been cross-checked**.",
                    "DGCA safety audit finding; identifies systemic procedural lapse in flight planning without personal attack."
                ]
            ]
        },
        "rule": {
            "title": "THE 3 MECHANICAL TRANSFORMATION LAWS & THE 'ZOMBIE TEST'",
            "text": (
                "**Law 1 (Object-Subject Swap):** The Active Object becomes the Passive Subject. The Active Subject moves to the end ('by...') or is dropped entirely for blame-free reporting.\n"
                "**Law 2 (Auxiliary 'BE' Insertion):** Insert the correct tense form of the verb 'to be' (is/are, was/were, being, been).\n"
                "**Law 3 (Past Participle V3):** The primary lexical verb ALWAYS converts into its V3 Past Participle form.\n"
                "**The 'By Zombies' Test:** If you can append the phrase 'by zombies' after the verb phrase and the sentence makes grammatical sense, it is in PASSIVE VOICE! (e.g., 'The clearance was issued [by zombies]' → Passive!)."
            )
        },
        "workedExample": {
            "title": "5 High-Yield Exam Practice Sentence Pairs (Active Commands → Passive Safety Logs)",
            "text": "Transform each active operational sentence into an objective, blame-free passive voice safety log entry.",
            "everydayContext": "Active: 'The chef overcooked the pasta.' → Passive: 'The pasta was overcooked.' (Focus on the meal quality, not blaming the chef).",
            "aviationContext": "Converting active airline ground commands into standardized ICAO/DGCA technical logs.",
            "steps": [
                "[PAIR 1: RAMP MARSHALLING]:",
                "• Active: 'The ground marshaller directed the Boeing 777 into Bay 14 using illuminated wands.'",
                "• Passive: 'The Boeing 777 was directed into Bay 14 using illuminated wands.' [Agent omitted - standard procedure].",
                "[PAIR 2: GROUND DAMAGE INCIDENT]:",
                "• Active: 'The tractor operator accidentally sheared the landing gear torque link pin during pushback.'",
                "• Passive: 'The landing gear torque link pin was sheared during pushback operations.' [Blame-free safety reporting].",
                "[PAIR 3: SECURITY SCREENING]:",
                "• Active: 'CISF security screeners are currently screening all registered cabin baggage for undeclared power banks.'",
                "• Passive: 'All registered cabin baggage is currently being screened for undeclared power banks.'",
                "[PAIR 4: PASSENGER DELAY BROADCAST]:",
                "• Active: 'The station duty manager will announce a 90-minute technical delay to all passengers at Gate 12.'",
                "• Passive: 'A 90-minute technical delay will be announced to all passengers at Gate 12.'",
                "[PAIR 5: AVIONICS CALIBRATION]:",
                "• Active: 'The avionics engineer must calibrate the weather radar transceivers prior to monsoon operations.'",
                "• Passive: 'The weather radar transceivers must be calibrated prior to monsoon operations.'"
            ],
            "verdict": "Notice how every passive rewrite eliminates personal finger-pointing and keeps the focus 100% on the aircraft, component, or safety procedure."
        },
        "memoryTrick": (
            "**B-V-3 Formula:**\n"
            "**B**E auxiliary + **V**erb in **3**rd Form = Safe, Objective, Blame-Free Flight!\n\n"
            "Ask yourself: *Who did it?* = ACTIVE. *What happened to the aircraft?* = PASSIVE."
        ),
        "examTip": (
            "THE TENSE-LOCK EXAM RULE:\n"
            "When converting active voice to passive voice, NEVER change the tense of the sentence! If the active sentence is Simple Past ('inspected'), the passive MUST be Simple Past ('was inspected'), NOT Present Perfect ('has been inspected'). If the active is Present Continuous ('is fueling'), the passive MUST retain 'being' ('is being fueled'). Changing the tense loses 1 full mark per sentence!"
        ),
        "isTrap": True
    }

    # -------------------------------------------------------------
    # MODULE 3: Master Glossary of 30 Essential Aviation Acronyms
    # -------------------------------------------------------------
    topic_3 = {
        "partBanner": "MODULE 3 · REGULATORY & OPERATIONAL VOCABULARY: MASTER GLOSSARY",
        "title": "3. Master Glossary of 30 High-Frequency Aviation Acronyms, Regulators & Operational Terms",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "Think of common digital acronyms: 'Wi-Fi', 'SIM', 'UPI', 'GPS', and 'ATM'. Everyone uses them in conversation, but in an examination, you are expected to write the exact full expansion, explain what it does in plain language, and illustrate its real-world application.\n\n"
            "**Aviation Operational Reality:**\n"
            "Aviation is the most acronym-dense industry in the world. High-speed radio transmissions and digital flight dispatch systems require extreme data compression. Pilots, controllers, flight dispatchers, and airport managers must communicate complex regulatory and technical concepts in fractions of a second. In your Semester End Examination (SEE), questions regularly test 5 to 10 of these terms in 2-mark definitions or 5-mark short-answer questions. To achieve 100% marks, you must provide: (1) Exact Expansion, (2) Plain English Meaning, and (3) Operational Context at an Indian or international airport."
        ),
        "table": {
            "headers": ["Acronym / Term", "Full Official Expansion", "Plain English Meaning", "Aviation Operational & Exam Context"],
            "rows": [
                [
                    "**1. ICAO**",
                    "International Civil Aviation Organization",
                    "A specialized United Nations agency that sets global technical standards, safety protocols, and air navigation policies for civil aviation worldwide.",
                    "Headquartered in Montreal, Canada. Publishes 19 international Annexes (e.g., Annex 13 for accident investigation, Annex 14 for aerodromes) adhered to by all member states."
                ],
                [
                    "**2. IATA**",
                    "International Air Transport Association",
                    "The global trade association of commercial airlines that simplifies ticketing, commercial standards, baggage codes, and passenger handling rules.",
                    "Assigns 3-letter airport codes (BLR, DEL, BOM, DXB) and 2-letter airline codes (AI, 6E, QP). Manages the Billing and Settlement Plan (BSP) for airline ticketing."
                ],
                [
                    "**3. DGCA**",
                    "Directorate General of Civil Aviation",
                    "India's national civil aviation regulatory body responsible for safety oversight, pilot and engineer licensing, aircraft airworthiness, and aerodrome certification.",
                    "Headquartered in New Delhi. Issues mandatory Civil Aviation Requirements (CARs) under the Aircraft Rules 1937 and regulates Indian carriers like IndiGo and Air India."
                ],
                [
                    "**4. NOTAM**",
                    "Notice to Airmen / Notice to Air Missions",
                    "A real-time official telecommunication notice warning pilots and dispatchers of temporary hazards, runway closures, or unserviceable navigation aids.",
                    "Mandatory pre-flight briefing document (e.g., 'NOTAM: Kempegowda Runway 09R closed between 06:00 and 09:00 UTC for rubber removal')."
                ],
                [
                    "**5. METAR**",
                    "Meteorological Aerodrome Report",
                    "A standardized coded weather report issued at 30- or 60-minute intervals describing observed surface weather conditions at a specific airport.",
                    "Contains wind speed/direction, visibility, weather phenomena (rain, mist, fog), cloud ceiling, temperature/dew point, and altimeter setting (QNH)."
                ],
                [
                    "**6. TAF**",
                    "Terminal Aerodrome Forecast",
                    "A forward-looking weather forecast for an airport area valid for 24 to 30 hours, used by flight dispatchers and pilots for route planning.",
                    "Examined during pre-flight planning to ensure destination and alternate airports will have weather above minimum regulatory landing limits upon arrival."
                ],
                [
                    "**7. FOD**",
                    "Foreign Object Debris / Foreign Object Damage",
                    "Any loose item, tool, trash, baggage strap, or pebble on runways, taxiways, or aprons that can be sucked into jet engines or cut aircraft tires.",
                    "Airport safety sweeps are conducted daily. Ingested FOD causes billions of dollars in fan blade and engine compressor damage globally every year."
                ],
                [
                    "**8. AOG**",
                    "Aircraft on Ground",
                    "A critical high-priority maintenance status indicating that an aircraft is grounded at an airport due to a technical defect and cannot fly.",
                    "Triggers emergency expedited shipping of spare parts and engineers; costs airlines thousands of dollars per hour in delayed flights and hotel compensation."
                ],
                [
                    "**9. GSE**",
                    "Ground Support Equipment",
                    "All motorized and non-motorized vehicles and machinery that service aircraft parked on the airport apron/ramp between flights.",
                    "Includes pushback tugs, baggage conveyor belt loaders, high-loader scissor trucks, ground power units, refueler bowsers, and passenger boarding stairs."
                ],
                [
                    "**10. MEL**",
                    "Minimum Equipment List",
                    "A DGCA-approved operator document listing specific non-critical aircraft instruments or systems that may be inoperative for safe flight dispatch.",
                    "Derived from the Master MEL (MMEL). Allows flight dispatch under strict limitations if redundant backup systems exist (e.g., one out of three VHF radios inoperative)."
                ],
                [
                    "**11. CRM**",
                    "Crew Resource Management",
                    "Structured human factors training designed to optimize communication, teamwork, situational awareness, and decision-making across all crew members.",
                    "Introduced to eliminate human-error crashes; empowers First Officers and cabin crew to speak up assertively using the Two-Challenge Rule without fear of Captain hierarchy."
                ],
                [
                    "**12. IROP**",
                    "Irregular Operations",
                    "Severe airline operational disruptions caused by external events (thunderstorms, fog, radar outage, industrial strike) affecting multiple scheduled flights.",
                    "Requires station managers to activate contingency SOPs: passenger re-booking, duty meal distribution, aircraft rescheduling, and hotel accommodation."
                ],
                [
                    "**13. PNR**",
                    "Passenger Name Record",
                    "A unique 6-character alphanumeric code generated in an airline's reservation system containing a passenger's full booking itinerary and ticket details.",
                    "Primary data key used at check-in kiosks and boarding gates (e.g., PNR: J8K3L9) to link passenger identity, seat selection, special meal requests, and baggage tags."
                ],
                [
                    "**14. OTP**",
                    "On-Time Performance",
                    "A core operational efficiency metric calculating the percentage of scheduled flights that depart or arrive within 15 minutes of scheduled time (A14/D14).",
                    "Published monthly by the DGCA in India; heavily marketed by airlines (IndiGo, Akasa Air) to establish punctuality reputation among corporate business travelers."
                ],
                [
                    "**15. CAR**",
                    "Civil Aviation Requirements",
                    "Mandatory regulatory directives and safety instructions issued by the DGCA under the Indian Aircraft Rules 1937 to enforce civil aviation compliance.",
                    "Divided into thematic sections: CAR Section 3 (Air Transport & Passenger Rights), CAR Section 5 (Air Safety & Accidents), CAR Section 7 (Flight Crew Licensing)."
                ],
                [
                    "**16. ATC**",
                    "Air Traffic Control",
                    "A ground-based service whose personnel direct aircraft movements on taxiways, during takeoff/landing, and through controlled airspace to prevent collisions.",
                    "Subdivided into Ground Control, Tower Control, Terminal Approach Control (TMA), and Area Control Centers (ACC) to guarantee standard separation."
                ],
                [
                    "**17. EFB**",
                    "Electronic Flight Bag",
                    "An aviation-certified tablet computer (iPad) in the cockpit that replaces paper navigation charts, flight manuals, checklists, and performance tables.",
                    "Reduces flight deck workload and aircraft weight; provides real-time moving maps, runway takeoff performance calculations, and live digital weather overlays."
                ],
                [
                    "**18. AFS**",
                    "Airside Safety / Aeronautical Fixed Service",
                    "(1) Regulatory safety protocols governing personnel, driving, and machinery inside the airside perimeter; (2) Global telecommunications network linking ATC stations.",
                    "Focuses on vehicle speed limits, mandatory Airside Driving Permits (ADP), high-visibility PPE compliance, and zero-accident airside ground operations."
                ],
                [
                    "**19. BIAL**",
                    "Bangalore International Airport Limited",
                    "The public-private consortium that owns, operates, and manages Kempegowda International Airport Bengaluru (BLR/VOBL).",
                    "Alliance University's local primary operational hub; oversees Terminal 1, the garden-themed Terminal 2, dual parallel runways, and airside cargo logistics."
                ],
                [
                    "**20. CISF**",
                    "Central Industrial Security Force",
                    "India's premier paramilitary security force responsible for perimeter protection, passenger frisking, and pre-embarkation security at commercial airports.",
                    "Guards airside access security gates, mans Pre-Embarkation Security Checkpoints (PESC), and screens carry-on baggage under BCAS guidelines."
                ],
                [
                    "**21. APU**",
                    "Auxiliary Power Unit",
                    "A small gas-turbine jet engine located in the unpressurized tail cone of an aircraft supplying electrical AC power and air conditioning when main engines are off.",
                    "Provides electrical power and pneumatic bleed air to start the main turbofan engines at the gate, saving expensive jet fuel compared to running main engines."
                ],
                [
                    "**22. GPU**",
                    "Ground Power Unit",
                    "An apron mobile diesel generator vehicle or fixed aerobridge cable that supplies 115V AC / 400Hz electricity to a parked aircraft at the passenger stand.",
                    "Allows the aircraft to shut down both its main engines and its onboard APU, substantially reducing ramp noise, fuel burn, and ground greenhouse gas emissions."
                ],
                [
                    "**23. FIR**",
                    "Flight Information Region",
                    "A designated geographic airspace division within which flight information services, alerting services, and air traffic control are provided to all aircraft.",
                    "India's sovereign airspace is divided into four primary FIRs: Mumbai, Delhi, Kolkata, and Chennai (with a sub-FIR at Guwahati), coordinating international flights."
                ],
                [
                    "**24. VMC**",
                    "Visual Meteorological Conditions",
                    "Atmospheric weather conditions (visibility, cloud clearance, ceiling) equal to or better than specified regulatory minimums, allowing visual flight.",
                    "Under VMC, pilots can look out of the cockpit windows to navigate, steer, and maintain separation from terrain and other aircraft (Visual Flight Rules - VFR)."
                ],
                [
                    "**25. IMC**",
                    "Instrument Meteorological Conditions",
                    "Weather conditions (dense fog, low clouds, torrential monsoon rain) where visibility drops below VMC minimums, requiring instrument navigation.",
                    "Requires Instrument Flight Rules (IFR) clearances, precision Instrument Landing Systems (ILS), and continuous radar vectoring by Air Traffic Control."
                ],
                [
                    "**26. TCAS**",
                    "Traffic Alert and Collision Avoidance System",
                    "An airborne avionics system that interrogates transponders of nearby aircraft and commands vertical avoidance maneuvers independent of ground ATC.",
                    "Issues two levels of audio-visual alerts: Traffic Advisory ('Traffic, Traffic') and Resolution Advisory ('Climb, Climb' or 'Descend, Descend') to prevent collisions."
                ],
                [
                    "**27. SID**",
                    "Standard Instrument Departure",
                    "A published standard flight route designed to guide an aircraft safely from runway takeoff up to the en-route cruising airway structure.",
                    "Guarantees terrain and obstacle clearance over surrounding mountains and cities, while streamlining departure traffic and reducing ATC radio congestion."
                ],
                [
                    "**28. STAR**",
                    "Standard Terminal Arrival Route",
                    "A published standard flight route guiding an arriving aircraft from the en-route cruising airway down to the initial approach fix of the destination runway.",
                    "Standardizes traffic inflow, establishes step-down altitude and speed limits, and reduces the need for verbal radar vectoring during high-density arrivals."
                ],
                [
                    "**29. UTC / Zulu**",
                    "Coordinated Universal Time",
                    "The primary global atomic time standard referenced to 0° longitude (Greenwich Meridian) used universally across all aviation flight plans, logs, and ATC calls.",
                    "India Standard Time (IST) is UTC + 05:30. UTC eliminates confusion caused by crossing multiple regional time zones and daylight saving adjustments."
                ],
                [
                    "**30. CAPA**",
                    "Corrective and Preventive Action",
                    "A formal quality and safety management process that analyzes an incident's root cause, implements immediate fixes, and installs preventive barriers against recurrence.",
                    "Standard requirement in airline and airport safety audits (DGCA CAR Section 5 / IOSA) after any ground handling accident, bird strike, or technical snag."
                ]
            ]
        },
        "rule": {
            "title": "THE 3-PART HIGH-SCORING EXAM FORMULA FOR ACRONYMS",
            "text": (
                "Whenever an examination question asks to 'Define / Explain the following terms: NOTAM, MEL, FOD, AOG, CRM':\n"
                "1. **Full Expansion:** Write the exact official title (e.g. NOTAM = Notice to Airmen / Notice to Air Missions).\n"
                "2. **Plain English Meaning:** Provide a 1-line everyday explanation of what it does.\n"
                "3. **Operational Context:** Give a concrete airport/flight operational scenario (e.g. 'FOD sweeps on Bangalore Runway 09L prevent CFM56 engine ingestion')."
            )
        },
        "workedExample": {
            "title": "Worked 5-Mark Question: 'Explain the operational significance of FOD, MEL, and TCAS.'",
            "text": "Model answer demonstrating how to structure high-scoring responses for 5-mark glossary questions.",
            "everydayContext": "Answering what 'GPS', 'RAM', and 'ABS' mean by providing their full form, function, and car/phone usage.",
            "aviationContext": "Explaining the safety and economic implications of runway debris, dispatch deferrals, and airborne anti-collision systems.",
            "steps": [
                "[1. FOD (FOREIGN OBJECT DEBRIS / DAMAGE)]:",
                "• Full Expansion: Foreign Object Debris / Foreign Object Damage.",
                "• Meaning: Any loose material, bolt, luggage strap, or gravel on airside pavements that poses a hazard to aircraft.",
                "• Operational Significance: Ingested FOD into high-bypass jet engines causes severe compressor blade damage, uncontained engine fires, and tire blowouts on takeoff. Daily FOD sweeps on Bangalore Runway 09L are mandatory under DGCA CAR Section 4.",
                "[2. MEL (MINIMUM EQUIPMENT LIST)]:",
                "• Full Expansion: Minimum Equipment List.",
                "• Meaning: A regulator-approved document that permits an aircraft to fly with specific inoperative components under strictly defined conditions.",
                "• Operational Significance: Prevents unnecessary flight cancellations for non-critical snags (e.g. one inoperative passenger reading light or one redundant cockpit communication radio), ensuring airline On-Time Performance (OTP) without compromising safety.",
                "[3. TCAS (TRAFFIC ALERT AND COLLISION AVOIDANCE SYSTEM)]:",
                "• Full Expansion: Traffic Alert and Collision Avoidance System.",
                "• Meaning: An autonomous airborne transponder-interrogating radar that provides collision avoidance guidance to pilots independent of ground ATC.",
                "• Operational Significance: In the event of an impending mid-air collision, TCAS issues synchronized vertical Resolution Advisories (RAs)—commanding one aircraft to 'Climb' and the other to 'Descend'. Under ICAO rules, pilot compliance with a TCAS RA is mandatory and overrides contradictory ATC instructions."
            ],
            "verdict": "Clear, bulleted points featuring expansion, definition, and operational context ensure 5/5 full marks."
        },
        "memoryTrick": (
            "**The 4 Operational Acronym Clusters:**\n"
            "1. **Regulators & Standards:** ICAO (Global UN), IATA (Airlines Commercial), DGCA (India Safety), CAR (India Rules).\n"
            "2. **Weather & Flight Environment:** METAR (Observed Now), TAF (Forecast Later), NOTAM (Hazards/Closures), FOD (Debris), VMC (Visual Eyes), IMC (Instrument Clouds).\n"
            "3. **Cockpit Systems & Navigation:** ATC (Ground Directors), TCAS (Mid-Air Radar), SID (Takeoff Highway), STAR (Landing Highway), MEL (Go/No-Go List), EFB (Cockpit iPad), APU (Tail Engine), GPU (Ground Plug), UTC/Zulu (Global Clock).\n"
            "4. **Airport Station & Ground Ops:** AOG (Grounded Plane), GSE (Ramp Trucks), CRM (Crew Teamwork), IROP (Disruptions), PNR (6-Digit Booking), OTP (Punctuality %), BIAL (Bangalore Airport), CISF (Security Friskers), AFS (Airside Safety), CAPA (Safety Fix)."
        ),
        "examTip": (
            "BEWARE OF ACRONYM EXPANSION TRAPS:\n"
            "• ICAO is Civil Aviation, NOT Commercial Aviation!\n"
            "• IATA is Air Transport, NOT Air Traffic!\n"
            "• METAR is Meteorological Aerodrome Report, NOT Terminal Air Report!\n"
            "• FOD is Foreign Object Debris (the item) and Foreign Object Damage (the consequence)!\n"
            "Write the exact words in the exam to avoid losing easy marks."
        ),
        "isTrap": True
    }

    # -------------------------------------------------------------
    # MODULE 4: Operational Circulars & Passenger Safety Advisories
    # -------------------------------------------------------------
    topic_4 = {
        "partBanner": "MODULE 4 · PROFESSIONAL WRITING FORMATS: 5-MARK TEMPLATES",
        "title": "4. Official Operational Circulars vs Passenger Safety Advisory Bulletins: Architecture & Worked Models",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "Think of the difference between an internal apartment society maintenance notice warning maintenance staff not to overload the service elevator (strict rules, disciplinary consequences) versus a colorful resident flyer explaining how to segregate wet and dry kitchen waste (educational, polite, step-by-step instructions with icons). One enforces employee compliance; the other educates and persuades the public.\n\n"
            "**Aviation Operational Reality:**\n"
            "Aviation communication spans two sharply distinct audiences: internal airside operational personnel (ramp drivers, baggage handlers, refuelers, engineers) and the traveling public (passengers). When airport authorities need to mandate airside safety rules (such as ramp vehicle speed limits or mandatory PPE), they issue an **Official Operational Circular**—a legally binding internal directive written in authoritative, imperative language with specific penalty clauses. Conversely, when communicating critical safety risks to passengers (such as why power banks and loose lithium batteries cannot go into checked baggage), airlines issue a **Passenger Safety Advisory Bulletin**—a customer-centric, visually structured educational document using persuasive, clear, and reassuring plain English."
        ),
        "table": {
            "headers": ["Document Type", "Primary Audience & Purpose", "Tone & Language Register", "Structural Elements & Distribution"],
            "rows": [
                [
                    "**Formal Business Letter**",
                    "External parties: Regulators (DGCA), aircraft vendors (Boeing/Airbus), corporate clients, aggrieved passengers.",
                    "Diplomatic, respectful, courteous, highly structured, legally binding.",
                    "7-part Block Format: Letterhead, Reference No., Date, Inside Address, Subject, Salutation, 3-part Body, Sign-off block. Sent via post/courier."
                ],
                [
                    "**Internal Office Memo**",
                    "Internal colleagues, department heads, station team members.",
                    "Concise, direct, action-oriented, professional, BLUF (Bottom Line Up Front).",
                    "Header block: TO, FROM, DATE, SUBJECT. Bulleted action items, target completion dates, department contact. Distributed via email/intranet."
                ],
                [
                    "**Official Operational Circular**",
                    "All station-wide / airside enterprise employees, ground handling agencies, contractors.",
                    "Authoritative, formal, imperative ('Shall / Must / Strictly Prohibited'), legally binding.",
                    "Letterhead, Circular Reference ID, Issue Date, Distribution List, Subject Header, Context/Rationale, Numbered Mandatory Directives, Penalties & Disciplinary Action, Authorized Sign-off (COO/Head of Airside Ops)."
                ],
                [
                    "**Passenger Safety Advisory Bulletin**",
                    "The traveling public, ticketed passengers, airport visitors.",
                    "Informative, polite, clear, reassuring, firm yet customer-friendly, educational.",
                    "Catchy Headline, Visual Warning Banner/Icon, Plain-English Explanation of Risk, Clear Two-Column 'DO's & DON'Ts' Box, Permissible Limits (Watt-hour specs), Emergency Actions, Customer Helpline links."
                ]
            ]
        },
        "rule": {
            "title": "THE TONE AND AUDIENCE DIRECTIVE RULE",
            "text": (
                "**Circulars Enforce Compliance:** Use imperative modal verbs ('Personnel SHALL wear PPE', 'Vehicles MUST NOT exceed 15 km/h'). Include explicit penalty clauses for non-compliance.\n"
                "**Advisories Inspire Cooperation:** Use customer-centric, explanatory language ('For your safety, please ensure', 'Help us keep your flight secure'). Never use threatening employee disciplinary language in a passenger bulletin!"
            )
        },
        "workedExample": {
            "title": "Complete Worked Models: Official Operational Circular & Passenger Safety Advisory",
            "text": "Full structural templates and completed models for both 5-mark examination formats.",
            "everydayContext": "Comparing a factory safety directive posted on a shop-floor noticeboard with a customer safety flyer inside an elevator.",
            "aviationContext": "An internal airside circular enforcing apron speed limits at BIAL, and a passenger advisory explaining the ban on power banks in checked baggage.",
            "steps": [
                "### MODEL 1: OFFICIAL OPERATIONAL CIRCULAR (Internal Airside Directive)",
                "BANGALORE INTERNATIONAL AIRPORT LIMITED (BIAL)",
                "DIRECTORATE OF AIRSIDE SAFETY & OPERATIONS",
                "Ref ID: BIAL/AIRSIDE/OPS-CIR/2026/04 | Date: 15 October 2026",
                "DISTRIBUTION: All Ground Handling Agencies (AISATS, Bird, Menzies), Airline Station Managers, Apron Controllers, GSE Fleet Operators.",
                "SUBJECT: MANDATORY ENFORCEMENT OF AIRSIDE VEHICLE SPEED LIMITS, DRIVER PERMIT (ADP) COMPLIANCE, AND PERSONAL PROTECTIVE EQUIPMENT (PPE) USAGE",
                "1. BACKGROUND & OPERATIONAL CONTEXT:",
                "Recent airside safety audits conducted across the Apron and Perimeter Service Roads revealed repeated violations of vehicular speed limits and unfastened hi-vis PPE vests during peak night turnarounds (22:00–04:00 hrs). Airside traffic accidents represent an unacceptable hazard to personnel, aircraft fuselages, and ground equipment.",
                "2. MANDATORY OPERATIONAL DIRECTIVES:",
                "Effective 00:01 hrs, 20 October 2026, all personnel and ground operators must strictly comply with the following directives:",
                "• Maximum Speed Limits: Under no circumstances shall any GSE or vehicle exceed 15 km/h on airside service roads or 5 km/h within 15 meters of any parked aircraft stand (aircraft perimeter safety zone).",
                "• Compulsory PPE: All personnel entering the airside perimeter must wear fluorescent high-visibility reflective vests (Class 2 minimum), steel-toed safety shoes, and hearing protection (ear defenders) in active engine noise zones.",
                "• Mobile Phone Prohibition: Operating any motorized vehicle while speaking on a mobile phone, texting, or using headphones is strictly prohibited.",
                "• Vehicle Pre-Shift Checks: Daily pre-shift brake, reverse-horn, and beacon checks must be recorded in the GSE Daily Inspection Register before vehicle dispatch.",
                "3. PENALTIES & DISCIPLINARY ACTIONS FOR NON-COMPLIANCE:",
                "• First Violation: Immediate 14-day suspension of Airside Driving Permit (ADP) and mandatory safety re-briefing.",
                "• Second Violation: Permanent cancellation of ADP, de-badging of airside entry pass, and an administrative fine of ₹10,000 levied on the employing contractor.",
                "Sd/- Captain Rajeshwar Rao, Head of Airside Operations & Safety, BIAL.",
                "--------------------------------------------------------------------------------",
                "### MODEL 2: PASSENGER SAFETY ADVISORY BULLETIN (Customer-Facing Public Notice)",
                "AIR INDIA / INDIAN CIVIL AVIATION NETWORK",
                "DIRECTORATE OF FLIGHT SAFETY & CUSTOMER CARE",
                "HEADLINE: PACK SMART, FLY SAFE: CRITICAL PASSENGER ADVISORY ON LITHIUM BATTERIES & POWER BANKS",
                "[SAFETY ALERT]: Did you know that loose lithium-ion power banks can cause severe in-flight fires if packed inside aircraft cargo holds? Help us keep your flight safe!",
                "1. THE SCIENCE IN PLAIN ENGLISH:",
                "Lithium-ion batteries store immense electrical energy. If damaged, short-circuited, or crushed in the pressurized cargo hold beneath the aircraft, they can experience Thermal Runaway (rapid internal overheating leading to smoke and sudden fire). In the passenger cabin, our crew is equipped with specialized fire containment bags and halon extinguishers to neutralize any smoking battery immediately.",
                "2. DO's AND DON'Ts SUMMARY:",
                "• DO carry ALL portable power banks, spare mobile phone batteries, and e-cigarettes exclusively in your CABIN HAND BAGGAGE.",
                "• DO verify that your power bank capacity is clearly labeled and does not exceed 100 Watt-hours (Wh) (approx. 27,000 mAh). Batteries between 101Wh and 160Wh require prior airline check-in approval.",
                "• DO inform cabin crew immediately if your mobile phone slips into seat mechanics—do NOT adjust your seat, as crushing the battery triggers fire.",
                "• DO NOT pack power banks, e-cigarettes, or loose spare batteries inside your CHECKED BAGGAGE under any circumstances. If detected at automated inline X-ray screening, your bag will be offloaded.",
                "• DO NOT charge power banks using onboard seat power sockets during takeoff, taxi, or landing.",
                "• DO NOT carry damaged, swollen, cracked, or counterfeit lithium-ion power banks onboard the aircraft.",
                "3. PERMISSIBLE CAPACITY FORMULA: Watt-hours (Wh) = (mAh × Volts) / 1000. (A 20,000 mAh battery operating at 3.7V = 74 Wh → Approved for cabin baggage!).",
                "For assistance, speak with our Airport Customer Care Desk or visit www.dgca.gov.in / www.airindia.com/baggage-safety."
            ],
            "verdict": "Compare the two models: The Circular uses imperative legal commands for employees; the Advisory uses polite educational persuasion for passengers. Both prevent catastrophic aviation hazards."
        },
        "memoryTrick": (
            "**The C-A-R-E Writing Rule:**\n"
            "• **C**irculars enforce Compliance (Staff/Ref No/Penalties).\n"
            "• **A**dvisories provide Awareness (Passengers/Do's & Don'ts).\n"
            "• **R**eference IDs validate authority.\n"
            "• **E**very audience demands its own tone."
        ),
        "examTip": (
            "THE 6-ELEMENT CIRCULAR CHECKLIST:\n"
            "If an exam question asks you to draft an Operational Circular, you MUST include all 6 structural elements: (1) Organization Letterhead, (2) Reference Number, (3) Date, (4) Distribution Line, (5) Numbered Mandatory Directives, and (6) Penalties / Sign-off Block. Missing the Reference Number or the Penalty clause costs 2 marks out of 5!"
        ),
        "isTrap": True
    }

    # -------------------------------------------------------------
    # MODULE 5: Pre-Flight CRM Briefing Protocol
    # -------------------------------------------------------------
    topic_5 = {
        "partBanner": "MODULE 5 · HUMAN FACTORS & FLIGHT DECK PROTOCOLS: 10-MARK CASE STUDY",
        "title": "5. Pre-Flight Crew Resource Management (CRM) Briefing Protocol: Adverse Weather & Severe Turbulence Coordination",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "Imagine a lead surgeon preparing for a complex open-heart surgery. Before making the first incision, the chief surgeon gathers the assistant surgeons, anesthesiologists, and scrub nurses, saying: 'Today's patient has severe asthma. If anyone notices unusual oxygen drops, equipment malfunction, or sees me making an error, stop me immediately. Speak up loud and clear.' This briefing dissolves intimidation, establishes trust, and saves lives.\n\n"
            "**Aviation Operational Reality:**\n"
            "Aviation history proved through tragic accidents (such as Tenerife 1977 and United 173) that technical flying skill alone cannot prevent crashes—human communication failure is the primary threat. Crew Resource Management (CRM) is the operational discipline of utilizing all available resources (people, equipment, procedures) to promote safety and enhance efficiency. The Pre-Flight CRM Briefing is the Captain's primary leadership tool to establish **Psychological Safety**, calibrate crew situational awareness, brief meteorological hazards (like convective storm cells and Clear-Air Turbulence - CAT), coordinate cabin safety chimes, enforce the **Sterile Cockpit Rule** below 10,000 ft, and empower all crew members to intervene using the **Two-Challenge Rule**."
        ),
        "table": {
            "headers": ["CRM Protocol Pillar", "Core Operational Function", "Aviation Operational Standard (ICAO / DGCA)", "Failure Consequence if Omitted"],
            "rows": [
                [
                    "**1. Captain's Tone & Psychological Safety**",
                    "Dissolves authoritarian cockpit hierarchy; explicitly invites all crew members to voice safety concerns without fear of reprisal.",
                    "Inclusive leadership style: 'Safety is our shared responsibility. My rank does not outrank safety.'",
                    "Junior First Officers or cabin attendants stay silent during critical navigational errors due to fear or intimidation."
                ],
                [
                    "**2. Meteorological & Route Threat Briefing (TEM)**",
                    "Identifies convective thunderstorm cells (Cumulonimbus - CB), squall lines, and Clear-Air Turbulence (CAT) using SIGWX and radar charts.",
                    "Threat and Error Management (TEM): Briefs cloud tops (FL450), holding fuel reserves (45 mins), and diversion alternates (Jaipur / Lucknow).",
                    "Surprise entry into severe convective turbulence causing passenger injuries, structural stress, or unplanned fuel exhaustion."
                ],
                [
                    "**3. Cockpit-to-Cabin Turbulence Coordination**",
                    "Establishes precise interphone and chime communication protocols for impending turbulence layers.",
                    "Chime codes: Single chime = routine/seatbelt; Double chime = 'Cabin crew take seats immediately, lock galley carts, suspend hot service'.",
                    "Flight attendants thrown against cabin ceiling, scalding hot beverage spills, and broken bones during sudden CAT."
                ],
                [
                    "**4. The Sterile Cockpit Rule**",
                    "Prohibits non-operational conversation, eating, or non-essential interphone calls during critical flight phases below 10,000 ft.",
                    "Mandatory FAA / DGCA regulation: 100% crew focus on ATC frequencies, instrument cross-checks, and visual traffic scanning.",
                    "Divided attention during takeoff or landing approach leading to missed altitude constraints, wrong runway alignments, or CFIT accidents."
                ],
                [
                    "**5. The Two-Challenge Rule**",
                    "Standardized protocol empowering a subordinate crew member to question and, if necessary, take over aircraft control during an uncorrected safety deviation.",
                    "Challenge 1: State deviation factually. Challenge 2: Issue urgent corrective command. If unacknowledged: Co-pilot declares 'I have control'.",
                    "Controlled Flight Into Terrain (CFIT) or loss of control while a Captain experiences cognitive lockup, tunnel vision, or medical incapacitation."
                ]
            ]
        },
        "rule": {
            "title": "THE CRM GOLDEN SAFETY EQUATION & THE TWO-CHALLENGE ALGORITHM",
            "text": (
                "**The Golden CRM Equation:** Psychological Safety + Advance Threat Briefing + Coordinated Chime Codes + Sterile Cockpit Discipline = Zero Preventable Human Error Accidents.\n\n"
                "**The Two-Challenge Algorithm:**\n"
                "• **Challenge 1 (Inquiry / Non-confrontational):** State observation factually: *'Captain, cleared altitude is 5,000 ft; we are descending through 4,700 ft.'*\n"
                "• **Challenge 2 (Urgent Command):** If no corrective action within 2 seconds: *'Captain, altitude deviation! Level off immediately!'*\n"
                "• **Control Takeover:** If still no response: *'I have control!'* First Officer assumes manual control, levels off aircraft, and informs ATC."
            )
        },
        "workedExample": {
            "title": "Full Worked Pre-Flight CRM Briefing Script: Convective Monsoon Storms & Severe CAT",
            "text": "A complete, standardized multi-turn dialogue between Captain, First Officer, and In-Flight Service Manager (IFSM) in the flight crew briefing room.",
            "everydayContext": "A surgical team pre-operation safety huddle or an expedition leader briefing mountain climbers before entering an avalanche zone.",
            "aviationContext": "Air India Flight AI-508 (Bengaluru VOBL to Delhi VIDP) operating an Airbus A320neo, cruising at FL360 with severe convective pre-monsoon squall lines over central India.",
            "steps": [
                "[SCENARIO DETAILS]:",
                "• Flight: Air India AI-508 | Route: Bengaluru (BLR) to Delhi (DEL) | Aircraft: Airbus A320neo (VT-EXV)",
                "• Flight Level: FL360 | Block Time: 2 hours 35 minutes | Alternate Airports: Lucknow (LKO) and Jaipur (JAI)",
                "• Crew Present: Captain Vikram Anand (PIC), First Officer Sneha Sharma (Co-Pilot), IFSM Priya Menon (Cabin Manager)",
                "--------------------------------------------------------------------------------",
                "[STAGE 1: CAPTAIN ESTABLISHES TONE & PSYCHOLOGICAL SAFETY]:",
                "Captain Vikram: 'Good afternoon team. Welcome to Flight AI-508 to Delhi. We have an estimated flying time of 2 hours and 35 minutes. Sneha is Pilot Flying for this sector, and I will be Pilot Monitoring. Before we review the weather, I want to emphasize our core crew principle: While I am legally in command as Pilot in Command, safety is our shared responsibility. If anyone sees an altitude bust, an unbriefed deviation, an unusual noise, or feels uncomfortable with a situation, speak up immediately. My four stripes do not outrank safety. I expect open, proactive communication from everyone in this room.'",
                "[STAGE 2: METEOROLOGICAL THREAT & ROUTE BRIEFING (TEM)]:",
                "First Officer Sneha: 'Thank you, Captain. Looking at our SIGWX charts and latest satellite imagery, we have active pre-monsoon convective thunderstorms along our route over the Deccan Plateau between Hyderabad and Nagpur. Radar indicates isolated Cumulonimbus (CB) tops reaching up to Flight Level 450. Additionally, SIGMET 3 forecasts moderate to severe Clear-Air Turbulence (CAT) between FL280 and FL340 near the sub-tropical jet stream boundary. We have loaded 45 minutes of extra holding fuel, giving us 2.8 tons above contingency. Our planned cruising level is FL360, but we will request lateral deviations from Chennai and Nagpur ATC early to skirt around storm cells.'",
                "[STAGE 3: COCKPIT-TO-CABIN TURBULENCE COORDINATION & CHIME PROTOCOL]:",
                "Captain Vikram: 'Priya, this turbulence is significant. We want zero passenger or crew injuries today. Here is our plan: During initial climb out of Bangalore, we expect light chop. We will keep the seatbelt sign ON until passing FL200. When we approach the convective weather zone near Nagpur—approximately 50 minutes after takeoff—we will give you an interphone call at least 10 minutes in advance. When you hear a DOUBLE CHIME (Ding-Dong) from the cockpit, that is your immediate signal: Suspend hot beverage and meal service instantly, stow and brake all meal carts in the galleys, lock the coffee pots, and take your jumpseats with full harnesses fastened. Do not worry about unfinished passenger service; passenger and crew physical safety comes first.'",
                "IFSM Priya: 'Understood, Captain. Double chime means immediate service suspension, carts secured, and crew seated. We will ensure seatbelt compliance is strictly audited before departure and announce the expected turbulence to passengers early so they remain seated.'",
                "[STAGE 4: STERILE COCKPIT RULE ENFORCEMENT]:",
                "Captain Vikram: 'Sneha and Priya, let's re-commit to our Sterile Cockpit Rule. Below 10,000 feet—during pushback, taxi, takeoff, climb, and descent—there will be zero non-operational chatter. Only flight-related callouts and ATC communications. Priya, the interphone should only be used below 10,000 feet in the event of an urgent emergency like fire, smoke, medical collapse, or security threat. Above 10,000 feet, you will hear a single chime indicating sterile cockpit is released.'",
                "[STAGE 5: RE-AFFIRMING THE TWO-CHALLENGE RULE]:",
                "First Officer Sneha: 'Understood, Captain. And to confirm our assertive communication protocol: If I observe any flight path deviation, approach parameter exceedance, or unstable condition, I will execute the Two-Challenge Rule. If you do not respond to my second challenge, I will immediately take control of the aircraft.'",
                "Captain Vikram: 'Confirmed, Sneha. Exactly as trained. Any questions from anyone? No? Let's conduct our pre-flight exterior walkaround and ensure a safe, smooth flight for our passengers.'"
            ],
            "verdict": "Notice how the briefing systematically covers all 5 pillars: Leadership tone, Weather threats, Cabin chime sync, Sterile Cockpit limits, and Two-Challenge intervention. This structured dialogue scores full marks in any CRM case study."
        },
        "memoryTrick": (
            "**The C-M-C-S-T 5-Pillar Mnemonic:**\n"
            "• **C**aptain opens safety climate.\n"
            "• **M**et threats & fuel briefed.\n"
            "• **C**abin chime codes synced.\n"
            "• **S**terile cockpit below 10,000 ft.\n"
            "• **T**wo-Challenge Rule saves lives."
        ),
        "examTip": (
            "HOW TO SCORE 10/10 IN A CRM CASE STUDY QUESTION:\n"
            "When an exam prompt presents a scenario ('Draft a Pre-Flight CRM Briefing for a flight facing severe convective weather'), do NOT write vague paragraphs about teamwork! Structure your response using these exact 5 headings: (1) Captain's Psychological Safety Climate, (2) Route & Weather Threats (SIGWX/CBs/Fuel), (3) Cockpit-Cabin Coordination & Chime Protocol, (4) Sterile Cockpit Rule (below 10,000 ft), and (5) The Two-Challenge Rule with exact dialogue."
        ),
        "isTrap": False
    }

    # -------------------------------------------------------------
    # MODULE 6: Crisis Communication Matrix & Passenger Rights
    # -------------------------------------------------------------
    topic_6 = {
        "partBanner": "MODULE 6 · CRISIS MANAGEMENT & PASSENGER ADVOCACY: 10-MARK CASE STUDY",
        "title": "6. Station Crisis Communication Matrix, Montreal Convention & DGCA Passenger Charter Rights",
        "premise": (
            "**Everyday Plain English Analogy:**\n"
            "Imagine a sudden, complete electrical blackout and Wi-Fi crash at a bustling mega-mall during Diwali shopping. If security guards panic, customer service desks give conflicting explanations, and shoppers are trapped without water or guidance, riots and stampedes erupt. But if a central incident manager takes the microphone, gives honest updates every 15 minutes, organizes water distribution, and clearly explains how refunds will be processed, panic transforms into patient cooperation.\n\n"
            "**Aviation Operational Reality:**\n"
            "Commercial aviation is vulnerable to sudden, systemic station crises—such as total ATC radar computer failure, lightning strikes disabling airfield lighting, or a disabled aircraft blocking the primary runway during peak hub hours. During such disruptions, communication cannot be chaotic. Airport operators and airlines must activate a **Multi-Stakeholder Crisis Communication SOP** structured across three synchronized operational tiers. Concurrently, airline passenger service managers must possess flawless knowledge of regulatory passenger compensation frameworks—specifically the **Montreal Convention (1999)** for international carriage and the **DGCA Passenger Charter (CAR Section 3, Series M, Part IV)** for domestic Indian operations—to protect passenger welfare, prevent consumer court lawsuits, and defend brand integrity."
        ),
        "table": {
            "headers": ["Crisis Matrix Operational Tier", "Primary Stakeholders & Leadership", "Core Strategic Actions", "Communication Channels & Protocols"],
            "rows": [
                [
                    "**Tier 1: Airborne Traffic & ATC Separation (Sky Safety)**",
                    "Senior Air Traffic Controllers, Watch Supervisory Officer (WSO), Approach Control, En-route ACCs.",
                    "Instantly transition from radar vectoring to **Procedural Non-Radar Separation** (enforcing 15-minute longitudinal time separation and 1,000 ft vertical step-downs). Establish holding patterns over inbound navigational fixes. Declare airport Ground Stop for departures. Coordinate airspace diversions with adjacent FIRs (Chennai, Mumbai, Hyderabad).",
                    "VHF Emergency Guard 121.5 MHz, primary Tower/Approach frequencies, standard ICAO emergency phraseology, CPDLC datalink broadcast."
                ],
                [
                    "**Tier 2: Airport Emergency Operations Center - EOC (Ground & Station Flow)**",
                    "BIAL Duty Terminal Manager, Airline Station Managers (IndiGo, Air India, Akasa), CISF Commandant, Ground Handlers (AISATS/Menzies), Medical Teams.",
                    "Convene physical and virtual EOC within 10 minutes. Allocate auxiliary apron parking stands for diverted aircraft. Dispatch Ground Power Units (GPUs) and mobile air conditioning carts to keep passengers cool onboard grounded aircraft. Coordinate with CISF to control terminal concourse overcrowding and manage passenger disembarkation gates.",
                    "Airside TETRA Trunked Radio Network (Channel 1 Emergency Operations), dedicated encrypted station WhatsApp incident command group."
                ],
                [
                    "**Tier 3: Media, Public & Passenger Communications (Information Integrity)**",
                    "Airport Corporate Communications Spokesperson, Airline Customer Experience Managers, Digital Social Media Desk.",
                    "Enforce the **Single Source of Truth** protocol: strictly prohibit unauthorized ground employees from giving speculative statements to news media. Issue the first official verified bilingual press statement within 20 minutes. Synchronize Flight Information Display Systems (FIDS) with realistic Estimated Departure Times (ETDs) updated every 30 minutes. Deploy ground care teams with bottled water, snacks, and mobile battery chargers.",
                    "Official Twitter/X broadcasts, airport public address system, synchronized airline SMS/WhatsApp customer alerts, airport website emergency banner."
                ]
            ]
        },
        "rule": {
            "title": "THE 3-TIER CRISIS FORMULA & THE SINGLE SOURCE OF TRUTH",
            "text": (
                "**Tier 1 (Sky):** Keep airplanes safely separated using procedural non-radar rules.\n"
                "**Tier 2 (Station):** Keep airport gates, power, food, and security moving through the EOC.\n"
                "**Tier 3 (Spoken):** Speak with one synchronized, empathetic voice across media and passenger channels.\n"
                "*The Single Source of Truth Principle:* In a crisis, silence breeds panic, while speculation breeds lawsuits. Communicate verified facts within 20 minutes, even if the fact is: 'We are investigating and will update in 15 minutes.'"
            )
        },
        "workedExample": {
            "title": "Full Worked Model: Crisis Service Recovery Letter under DGCA Passenger Charter",
            "text": "A complete, legally compliant, high-empathy formal business service recovery letter from an Airline Station Customer Care Manager to an affected passenger following a 4.5-hour radar blackout delay.",
            "everydayContext": "A hotel general manager writing a formal apology letter with refund credits after a power transformer explosion ruined a wedding banquet.",
            "aviationContext": "Akasa Air Station Customer Experience Manager addressing a delayed passenger under DGCA CAR Section 3, Series M, Part IV at Kempegowda International Airport.",
            "steps": [
                "AKASA AIRWAYS LIMITED",
                "DIRECTORATE OF GUEST EXPERIENCE & STATION SERVICES",
                "Terminal 1, Kempegowda International Airport Bengaluru (BLR/VOBL) - 560300",
                "Ref: AKASA/BLR/CUST-REC/2026/8821 | Date: 16 October 2026",
                "To:",
                "Dr. Arvind Swaminathan, MD",
                "42, Crescent Avenue, Sadashivnagar, Bengaluru - 560080",
                "PNR: QP-9X4M2 | Flight: QP-1342 (Bengaluru to Mumbai)",
                "SUBJECT: FORMAL SERVICE APOLOGY & REGULATORY COMPENSATION ADVISORY REGARDING FLIGHT QP-1342 DELAY",
                "Dear Dr. Swaminathan,",
                "1. SINCERE APOLOGY & OPERATIONAL CONTEXT:",
                "On behalf of the entire Akasa Air team, please accept our sincere apologies for the extensive delay and distress you experienced yesterday, 15 October 2026, while traveling on Flight QP-1342 from Bengaluru to Mumbai. As briefed at the airport, an unprecedented total failure of the primary air traffic control radar and airfield lighting systems occurred at Kempegowda International Airport at 18:30 hrs, requiring Air Traffic Control to enforce an immediate nationwide Ground Stop to ensure aircraft separation and passenger safety.",
                "2. OUR IMMEDIATE STATION CARE ACTIONS:",
                "While this catastrophic infrastructure outage was entirely beyond airline control, our primary obligation was your comfort and well-being. During the 4.5-hour delay at Gate 14, our station care team provided complimentary hot meals, refreshments, and bottled water, as well as priority charging facilities.",
                "3. REGULATORY COMPLIANCE & STATUTORY COMPENSATION (DGCA CAR SECTION 3):",
                "In strict compliance with the Directorate General of Civil Aviation (DGCA) Passenger Charter of Rights (CAR Section 3, Series M, Part IV), we wish to advise you of your statutory recovery entitlements:",
                "• Statutory Delay Compensation: In accordance with DGCA norms for delays exceeding 4 hours, we have processed a statutory compensation credit of ₹5,000 (Rupees Five Thousand Only) directly to your original payment method (Bank Reference: HDFC-TXN-902811), which will reflect within 3 to 5 business days.",
                "• Travel Voucher Credit: As a gesture of our deep appreciation for your patience and goodwill, we have credited an additional Akasa Travel Voucher worth ₹3,500 to your registered mobile number and email, valid across our entire domestic network for 12 months.",
                "• Baggage Priority: Your registered checked bag (Tag: QP-881204) was safeguarded throughout the delay and prioritized for immediate delivery upon landing at Mumbai Chhatrapati Shivaji Maharaj International Airport.",
                "4. OUR ONGOING COMMITMENT TO SAFETY & SERVICE:",
                "At Akasa Air, safety is our highest operational virtue. We never compromise on safety, even when technical disruptions test our operational schedule. We thank you for your patience, gracious understanding, and continued patronage. Should you require any further documentation for travel insurance reconciliation, our Guest Support Directorate remains at your personal disposal at guestcare@akasaair.com or +91 9606 112233.",
                "Yours sincerely,",
                "Sd/-",
                "Meenakshi Sundaram",
                "Station Customer Experience Manager, Bengaluru International Airport",
                "Akasa Airways Limited"
            ],
            "verdict": "This letter exemplifies perfect crisis communication: It combines genuine human empathy, transparent explanation, documented immediate care, and exact statutory regulatory compliance under the DGCA Passenger Charter."
        },
        "memoryTrick": (
            "**The 3-T Crisis Matrix:**\n"
            "• **Tier 1 (Sky):** Keep planes apart (Non-radar procedural separation).\n"
            "• **Tier 2 (Station):** Keep gates and power moving (EOC + CISF + Ground handlers).\n"
            "• **Tier 3 (Spoken):** Speak with one truth (Single Source + 20-min press release).\n\n"
            "**DGCA Passenger Rights Mnemonic (M-D-C):**\n"
            "• **M**eals & drinks at 2+ hours.\n"
            "• **D**iversion / Full Refund choice at 4+ hours.\n"
            "• **C**ompensation & Hotel for overnight delays (>6 hrs)."
        ),
        "examTip": (
            "SCORING HIGH ON PASSENGER RIGHTS QUESTIONS:\n"
            "When an exam question asks about passenger rights during flight delays or cancellations:\n"
            "1. Name the exact regulatory instruments: **The Montreal Convention (1999)** for international flights (governed by Special Drawing Rights - SDRs up to 1,288 SDRs for baggage), and the **DGCA Passenger Charter (CAR Section 3, Series M, Part IV)** for domestic Indian operations.\n"
            "2. State the exact time thresholds: 2 hours (snacks/tea), 4 hours (full meal + refund/alternate flight), overnight (hotel + transfers).\n"
            "3. State the compensation brackets: ₹5,000 (block time < 1 hr), ₹7,500 (1–2 hrs), ₹10,000 (> 2 hrs).\n"
            "Citing these exact legal figures earns top marks!"
        ),
        "isTrap": False
    }

    # -------------------------------------------------------------
    # MASTER QUICK REVISION TABLE (Everything on One Page)
    # -------------------------------------------------------------
    quick_revision = [
        {
            "topic": "Shannon-Weaver Communication Model",
            "rememberThis": "Source → Transmitter (Encode) → Channel (under Noise) → Receiver (Decode) → Destination. Active Readback and Hearback form the essential closed feedback loop that eliminates errors before action is taken."
        },
        {
            "topic": "The 4 Aviation Noise Barriers",
            "rememberThis": "Physical/Acoustic (110–130 dB jet roar, static); Physiological (crew fatigue, hypoxia); Psychological (stress, rush-to-depart); Semantic (ambiguous slang, non-standard phraseology). Overcome via ANC headsets, standard ICAO phraseology, and CRM."
        },
        {
            "topic": "Active vs. Passive Voice in Safety Logs",
            "rememberThis": "Passive voice (Object + BE + V3) is legally mandatory in ICAO Annex 13 / DGCA CAR Section 5 incident reports to ensure blame-free, objective reporting focused on mechanical components rather than personalizing fault."
        },
        {
            "topic": "Key Aviation Acronyms (Regulators & Weather)",
            "rememberThis": "ICAO (UN Global Standards), IATA (Airlines Commercial/Codes), DGCA (India Safety Regulator), NOTAM (Real-time Hazard Notices), METAR (Present Weather Report), TAF (Future Aerodrome Forecast)."
        },
        {
            "topic": "Key Aviation Acronyms (Ops & Safety)",
            "rememberThis": "FOD (Foreign Object Debris/Damage), AOG (Aircraft on Ground), MEL (Minimum Equipment List), CRM (Crew Resource Management), TCAS (Airborne Anti-Collision), SID/STAR (Takeoff/Arrival Flight Highways), PNR (6-digit Passenger Record)."
        },
        {
            "topic": "Operational Circular vs Passenger Advisory",
            "rememberThis": "Circular: Internal, authoritative directives for airside staff with reference IDs and penalties ('Shall/Must'). Advisory: Public-facing, educational notice with catchy headline, science explanation, and clear Do's & Don'ts."
        },
        {
            "topic": "Pre-Flight CRM Briefing (5 Pillars)",
            "rememberThis": "1. Captain's Psychological Safety, 2. Threat & Weather Briefing (CB tops/CAT/fuel), 3. Cockpit-Cabin Chime Coordination, 4. Sterile Cockpit below 10,000 ft, 5. Two-Challenge Rule with takeover clause."
        },
        {
            "topic": "Station Crisis SOP & DGCA Passenger Rights",
            "rememberThis": "3-Tier Crisis Matrix: Tier 1 Sky (Procedural separation), Tier 2 Station (EOC coordination), Tier 3 Spoken (Single Source of Truth). DGCA Charter: Meals at 2h delay, full refund/alternate at 4h, hotel for overnight delays, statutory compensation up to ₹10,000."
        }
    ]

    # -------------------------------------------------------------
    # BLOOM'S TAXONOMY EXAM QUESTION BANK (BTL 1 to BTL 6)
    # -------------------------------------------------------------
    btl_questions = {
        "BTL 1 - Remember (Recall Facts & Definitions)": (
            "1. Define the Shannon-Weaver communication model and list its six constituent elements.\n"
            "2. State the full expansions and one-line operational meanings for: ICAO, DGCA, NOTAM, METAR, TAF, FOD, AOG, MEL, CRM, and TCAS."
        ),
        "BTL 2 - Understand (Explain Principles & Compare)": (
            "1. Explain why Passive Voice is procedurally and legally mandatory in aviation technical logbooks and safety incident reports under ICAO Annex 13 standards.\n"
            "2. Contrast an Official Operational Circular with a Passenger Safety Advisory Bulletin in terms of primary audience, communicative purpose, linguistic tone, and structural layout."
        ),
        "BTL 3 - Apply (Execute Grammar & Operational Conversions)": (
            "Transform the following active operational sentences into objective, blame-free passive voice safety logs:\n"
            "(a) 'The marshaller guided the Boeing 787 into Bay 18 using illuminated wands.'\n"
            "(b) 'The ramp technician accidentally sheared the landing gear torque link pin during pushback.'\n"
            "(c) 'CISF security screeners are screening all checked baggage for undeclared lithium batteries.'\n"
            "(d) 'Air Traffic Control cleared Flight 6E-402 for an immediate ILS approach on Runway 09L.'\n"
            "(e) 'The airline ground agent will announce a 2-hour weather delay to all passengers at Gate 8.'"
        ),
        "BTL 4 - Analyze (Diagnose Barriers & Communication Breakdown)": (
            "Analyze the four categories of aviation noise barriers (Acoustic, Physiological, Psychological, Semantic) in the context of an ATC landing clearance during a monsoon squall. How does the closed-loop active readback mechanism prevent catastrophic aviation accidents like the Tenerife disaster?"
        ),
        "BTL 5 - Evaluate (Assess Human Factors & Emergency Protocols)": (
            "Evaluate the effectiveness of the Two-Challenge Rule and the Sterile Cockpit Rule during an adverse weather approach. Under what operational conditions is a junior First Officer ethically and procedurally obligated to take control of an aircraft from a senior Captain?"
        ),
        "BTL 6 - Create (Author Operational Protocols & Corporate Correspondence)": (
            "1. Draft a comprehensive Pre-Flight CRM Briefing dialogue between Captain, First Officer, and In-Flight Cabin Manager for a commercial flight departing Bengaluru to Delhi facing severe convective thunderstorm cells and Clear-Air Turbulence.\n"
            "2. Draft a formal, empathetic, and legally compliant Service Recovery Letter from an Airline Station Customer Experience Manager to a stranded premium passenger following a 4.5-hour radar blackout delay at Kempegowda International Airport, ensuring full adherence to the DGCA Passenger Charter (CAR Section 3, Series M, Part IV)."
        )
    }

    # Assembling the master booster data object
    see_booster_data = {
        "courseCode": "Z7AVA 26203 / Z7AVB 26203",
        "author": "S D Sandarsh | Communicative English, Soft Skills & Employability Trainer (+91 97437 11584)",
        "subtitle": "B.Sc. Aviation & BBA Aviation Management (Batch 2026) · Semester End Examination (SEE) Supplementary Notes & Exam Booster · Alliance University",
        "howToUse": [
            "**Audited Against Official SEE Papers:** Directly engineered to address 6 critical high-yield question formats (carrying 5 to 10 marks each) audited across official SEE Question Papers (Set 1, Set 2, and 5 Model Question Papers).",
            "**Dual-Context Pedagogy:** Every theoretical rule and concept begins with a familiar everyday plain English analogy before examining the exact airport or airline operational reality.",
            "**Exam Scoring Strategy (5 & 10 Marks):** Always state formal definitions first, draw the diagrams or 4-column comparison tables, cite realistic airline operations (IndiGo, Air India, Akasa, BIAL), and cite official regulatory bodies (ICAO Annex 13, DGCA CARs, Montreal Convention 1999).",
            "**Multi-Page Clean PDF Print:** Click the 'Print / Save as PDF' button at the top right. All tables, callout boxes, and case study templates are formatted with page-break preservation rules for clean multi-page student study prints."
        ],
        "parts": [
            {
                "title": "Part 1 · Theoretical Models & Grammar Architecture",
                "items": [
                    "Module 1: The Shannon-Weaver Model & 4 Aviation Noises (5-Mark Exam Core)",
                    "Module 2: Active vs. Passive Voice Grammar Architecture (5-Mark Exam Transformations)"
                ]
            },
            {
                "title": "Part 2 · Operational Vocabulary & Professional Writing",
                "items": [
                    "Module 3: Master Glossary of 30 Essential Aviation Acronyms & Regulatory Terms",
                    "Module 4: Operational Circulars vs Passenger Safety Advisory Bulletins (5-Mark Templates)"
                ]
            },
            {
                "title": "Part 3 · Human Factors, CRM & Crisis Management",
                "items": [
                    "Module 5: Pre-Flight CRM Briefing Protocol: Adverse Weather & Severe Turbulence (10-Mark Case Study)",
                    "Module 6: Station Crisis SOP, Montreal Convention & DGCA Passenger Charter Rights (10-Mark Case Study)"
                ]
            }
        ],
        "topics": [topic_1, topic_2, topic_3, topic_4, topic_5, topic_6],
        "quickRevision": quick_revision,
        "btlQuestions": btl_questions,
        "referenceMaterial": {
            "primary": "ICAO Annex 13 (Aircraft Accident Investigation), ICAO Doc 9432 (Manual of Radiotelephony), DGCA Civil Aviation Requirements (CAR Section 3, Series M, Part IV & Section 5), Shannon & Weaver (1949) 'The Mathematical Theory of Communication'.",
            "further": "FAA Advisory Circular AC 120-51E (Crew Resource Management Training), Montreal Convention (1999) Liability Framework, DGCA Air Safety Circulars."
        }
    }

    return see_booster_data

def main():
    if not os.path.exists(NOTES_FILE):
        print(f"Error: {NOTES_FILE} not found.")
        sys.exit(1)

    with open(NOTES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "Communicative English" not in data:
        data["Communicative English"] = {}

    english_data = data["Communicative English"]
    booster = build_see_booster()

    # Save dedicated booster keys
    english_data["see-booster"] = booster
    english_data["see-exam-booster"] = booster
    english_data["see-high-yield"] = booster
    print("Injected 'see-booster', 'see-exam-booster', and 'see-high-yield' into Communicative English.")

    # Cross-enrich individual units so students also discover these topics when revising by Unit:
    # Unit 1: Add Shannon-Weaver & Active/Passive Voice if not already present
    if "unit-1" in english_data and isinstance(english_data["unit-1"], dict):
        u1_topics = english_data["unit-1"].setdefault("topics", [])
        existing_titles = [t.get("title", "") for t in u1_topics]
        if not any("Shannon-Weaver" in t for t in existing_titles):
            u1_topics.append(booster["topics"][0])
            print("Enriched Unit 1 with Module 1: Shannon-Weaver Model.")
        if not any("Active vs. Passive" in t for t in existing_titles):
            u1_topics.append(booster["topics"][1])
            print("Enriched Unit 1 with Module 2: Active vs. Passive Voice Architecture.")

    # Unit 2: Add Master Glossary of 30 Acronyms
    if "unit-2" in english_data and isinstance(english_data["unit-2"], dict):
        u2_topics = english_data["unit-2"].setdefault("topics", [])
        existing_titles = [t.get("title", "") for t in u2_topics]
        if not any("Master Glossary" in t for t in existing_titles):
            u2_topics.append(booster["topics"][2])
            print("Enriched Unit 2 with Module 3: Master Glossary of 30 Aviation Acronyms.")

    # Unit 4: Add Operational Circulars vs Passenger Advisories
    if "unit-4" in english_data and isinstance(english_data["unit-4"], dict):
        u4_topics = english_data["unit-4"].setdefault("topics", [])
        existing_titles = [t.get("title", "") for t in u4_topics]
        if not any("Operational Circulars" in t for t in existing_titles):
            u4_topics.append(booster["topics"][3])
            print("Enriched Unit 4 with Module 4: Operational Circulars vs Passenger Advisories.")

    # Unit 5: Add Pre-Flight CRM Briefing Protocol & Crisis Matrix
    if "unit-5" in english_data and isinstance(english_data["unit-5"], dict):
        u5_topics = english_data["unit-5"].setdefault("topics", [])
        existing_titles = [t.get("title", "") for t in u5_topics]
        if not any("Crew Resource Management" in t for t in existing_titles):
            u5_topics.append(booster["topics"][4])
            print("Enriched Unit 5 with Module 5: Pre-Flight CRM Briefing Protocol.")
        if not any("Crisis Communication" in t for t in existing_titles):
            u5_topics.append(booster["topics"][5])
            print("Enriched Unit 5 with Module 6: Crisis Communication Matrix & Passenger Rights.")

    # Write back to file with clean indentation
    with open(NOTES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {NOTES_FILE}. Total size: {os.path.getsize(NOTES_FILE):,} bytes.")

if __name__ == "__main__":
    main()
