with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\app\globals.css', 'a', encoding='utf-8') as f:
    f.write("""

/* Escape Subtitle Mode for Widgets */
.escape-subtitle p, 
.escape-subtitle h1, 
.escape-subtitle h2, 
.escape-subtitle h3, 
.escape-subtitle h4, 
.escape-subtitle span, 
.escape-subtitle li {
  font-family: 'Inter', sans-serif !important;
  text-transform: none !important;
  text-shadow: none !important;
  text-align: left !important;
  white-space: normal !important;
  letter-spacing: normal !important;
  color: white !important;
}
.escape-subtitle p {
  font-size: 1.1rem !important;
  line-height: 1.5 !important;
  font-weight: 400 !important;
}
.escape-subtitle h3 {
  font-size: 1.5rem !important;
  font-weight: bold !important;
}
.escape-subtitle h4 {
  font-size: 1.1rem !important;
  font-weight: bold !important;
}
""")
