import os
import shutil

app_path = r"G:\My Drive\Alliance University\Alliance University - Aviation\Procedural\erp_app.py"

with open(app_path, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize line endings
content = content.replace("\r\n", "\n")

ca_patch = """import streamlit as st
import socket
socket.setdefaulttimeout(30)
import os
import shutil

# Ensure CA bundle is on fast local disk to avoid Google Drive virtual filesystem latency/SSLEOFError
_temp_pem = os.path.join(os.environ.get('TEMP', os.path.expanduser('~')), 'cacert.pem')
if not os.path.exists(_temp_pem):
    try:
        import certifi
        shutil.copyfile(certifi.where(), _temp_pem)
    except Exception:
        pass
if os.path.exists(_temp_pem):
    os.environ['REQUESTS_CA_BUNDLE'] = _temp_pem
    os.environ['SSL_CERT_FILE'] = _temp_pem

from copy import deepcopy
import datetime"""

old_top = """import streamlit as st
import socket
socket.setdefaulttimeout(30)
from copy import deepcopy
import os
import datetime"""

if old_top in content:
    content = content.replace(old_top, ca_patch, 1)
    print("Top CA patch applied.")
else:
    print("Could not find old_top, checking if already patched...")

old_auth = """def authenticate_sheets():
    script_dir = get_script_dir()
    token_path = os.path.join(script_dir, 'token.json')
    creds_path = os.path.join(script_dir, 'credentials.json')
    
    creds = None
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    if not creds or not creds.valid or creds.expired:
        if creds and creds.refresh_token:
            try:
                creds.refresh(Request())
                with open(token_path, 'w') as token:
                    token.write(creds.to_json())
            except Exception as e:
                print(f"Token refresh failed: {e}. Re-authenticating...")
                if os.path.exists(token_path):
                    os.remove(token_path)
                flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                creds = flow.run_local_server(port=0)
                with open(token_path, 'w') as token:
                    token.write(creds.to_json())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
            with open(token_path, 'w') as token:
                token.write(creds.to_json())
    return gspread.authorize(creds)"""

new_auth = """def authenticate_sheets():
    script_dir = get_script_dir()
    token_path = os.path.join(script_dir, 'token.json')
    creds_path = os.path.join(script_dir, 'credentials.json')
    
    creds = None
    if os.path.exists(token_path):
        try:
            creds = Credentials.from_authorized_user_file(token_path, SCOPES)
        except Exception:
            creds = None
            
    if not creds or not creds.valid or creds.expired:
        if creds and creds.refresh_token:
            import time
            for attempt in range(3):
                try:
                    creds.refresh(Request())
                    with open(token_path, 'w') as token:
                        token.write(creds.to_json())
                    break
                except Exception as e:
                    print(f"Token refresh attempt {attempt+1} failed: {e}")
                    if "invalid_grant" in str(e).lower():
                        if os.path.exists(token_path):
                            os.remove(token_path)
                        flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
                        creds = flow.run_local_server(port=0)
                        with open(token_path, 'w') as token:
                            token.write(creds.to_json())
                        break
                    if attempt == 2:
                        raise e
                    time.sleep(1)
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
            with open(token_path, 'w') as token:
                token.write(creds.to_json())
    return gspread.authorize(creds)"""

if old_auth in content:
    content = content.replace(old_auth, new_auth, 1)
    print("authenticate_sheets patch applied.")
else:
    print("Could not find old_auth.")

with open(app_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching complete.")
