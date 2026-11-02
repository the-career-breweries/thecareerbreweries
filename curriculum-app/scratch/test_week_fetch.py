import sys
import datetime
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural')

# Ensure fast local CA bundle
temp_pem = os.path.join(os.environ.get('TEMP', os.path.expanduser('~')), 'cacert.pem')
if os.path.exists(temp_pem):
    os.environ['REQUESTS_CA_BUNDLE'] = temp_pem
    os.environ['SSL_CERT_FILE'] = temp_pem

from erp_app import fetch_week_logs_from_official_sheet

start_date = datetime.date(2026, 10, 26)
week_dates = [start_date + datetime.timedelta(days=i) for i in range(6)]
print('Week dates:', [d.strftime('%Y-%m-%d') for d in week_dates])

sheet_logs, editor_logs = fetch_week_logs_from_official_sheet(week_dates)
print('Total sheet_logs count:', len(sheet_logs))
for log in sheet_logs:
    print(f"  {log['date_str']} ({log['day']}) [{log['category']}]: {log['activity']} ({log['hours']}h)")

print('\nEditor logs dates:', list(editor_logs.keys()))
for d_str, entries in editor_logs.items():
    valid = [e for e in entries if e.get('Category') or e.get('Description')]
    print(f"  {d_str}: {len(valid)} entries")
