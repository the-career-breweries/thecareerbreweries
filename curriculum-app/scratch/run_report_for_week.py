import os
import sys
import datetime

sys.stdout.reconfigure(encoding='utf-8')
PRO_DIR = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural"
os.chdir(PRO_DIR)
sys.path.append(PRO_DIR)

# Set fast CA bundle
temp_pem = os.path.join(os.environ.get('TEMP', os.path.expanduser('~')), 'cacert.pem')
if os.path.exists(temp_pem):
    os.environ['REQUESTS_CA_BUNDLE'] = temp_pem
    os.environ['SSL_CERT_FILE'] = temp_pem

import generate_official_weekly_report as rep

start_date = datetime.date(2026, 10, 26)
week_dates = [start_date + datetime.timedelta(days=i) for i in range(6)]

print(f"Running report for {week_dates[0]} to {week_dates[-1]}...")
logs, tab_summary = rep.fetch_week_logs(week_dates)

out_filename = f"Weekly_Work_Report_Sandarsh_{week_dates[0].strftime('%Y-%m-%d')}_to_{week_dates[-1].strftime('%Y-%m-%d')}.docx"
out_path = os.path.join(PRO_DIR, out_filename)

rep.build_docx_report(logs, week_dates, out_path)
print(f"Report built: {out_path}")

# Now inspect tables in the generated docx
import docx
doc = docx.Document(out_path)
print(f"Total tables: {len(doc.tables)}")

t1 = doc.tables[1]
print("\n--- Table 1 (Hours Summary) ---")
for r in t1.rows:
    print(" | ".join(c.text.strip() for c in r.cells))

t2 = doc.tables[2]
print("\n--- Table 2 (Day-by-Day Hours) ---")
for r in t2.rows:
    print(" | ".join(c.text.strip().replace('\n', ' ') for c in r.cells))
