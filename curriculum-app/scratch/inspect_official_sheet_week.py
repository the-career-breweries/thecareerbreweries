import os
import sys
import gspread
from google.oauth2.credentials import Credentials

sys.stdout.reconfigure(encoding='utf-8')

temp_pem = os.path.join(os.environ.get('TEMP', os.path.expanduser('~')), 'cacert.pem')
if os.path.exists(temp_pem):
    os.environ['REQUESTS_CA_BUNDLE'] = temp_pem
    os.environ['SSL_CERT_FILE'] = temp_pem

token_path = r'G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\token.json'
creds = Credentials.from_authorized_user_file(token_path, ['https://www.googleapis.com/auth/spreadsheets'])
client = gspread.authorize(creds)

sh = client.open_by_key('19cj4vR7M_vfANDGZB5Yh2liJ8zBx_dpkRysWNHJCuY4')

# Find worksheet with gid 1542540812
target_ws = None
for ws in sh.worksheets():
    if ws.id == 1542540812:
        target_ws = ws
        break

if target_ws:
    print(f'Found worksheet for gid 1542540812: "{target_ws.title}"')
else:
    print('gid 1542540812 not found directly')

# Check week tabs
week_tabs = ['26/10/2026', '27/10/2026', '28/10/2026', '29/10/2026', '30/10/2026', '31/10/2026']
for t in week_tabs:
    try:
        ws = sh.worksheet(t)
        all_vals = ws.get_all_values()
        headers = all_vals[0] if all_vals else []
        sandarsh_row = None
        for idx, r in enumerate(all_vals):
            if len(r) > 1 and 'sandarsh' in r[1].lower():
                sandarsh_row = (idx + 1, r)
                break
        if sandarsh_row:
            row_num, row_data = sandarsh_row
            print(f"\nTab [{t}] (Row {row_num}):")
            for h, v in zip(headers, row_data):
                if v.strip():
                    print(f"  {h}: {v}")
        else:
            print(f"\nTab [{t}]: Sandarsh NOT FOUND in {len(all_vals)} rows")
    except Exception as e:
        print(f"\nTab [{t}]: Error: {e}")
