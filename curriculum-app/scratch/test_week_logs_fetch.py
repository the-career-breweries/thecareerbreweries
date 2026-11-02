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

# Now test fetch_week_logs from generate_official_weekly_report
from generate_official_weekly_report import fetch_week_logs, categorize_official_activity

start_date = datetime.date(2026, 10, 26)
week_dates = [start_date + datetime.timedelta(days=i) for i in range(6)]

logs, tab_summary = fetch_week_logs(week_dates)
print(f"Total extracted logs: {len(logs)}")
total_hrs = sum(l['hours'] for l in logs)
print(f"Total hours across week: {total_hrs:.2f} hrs\n")

for d in week_dates:
    d_str = d.strftime("%Y-%m-%d")
    day_logs = [l for l in logs if l['date'] == d]
    day_h = sum(l['hours'] for l in day_logs)
    print(f"--- {d_str} ({d.strftime('%A')}): {day_h:.2f} hrs, {len(day_logs)} entries ---")
    for l in day_logs:
        print(f"  [{l['slot']}] {l['hours']}h | Category: '{l['category']}' | Activity: '{l['activity']}'")
