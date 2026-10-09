import os, glob
import re

paths = glob.glob('curriculum-app/src/content/lessons/ug/*/sem1/week5.md')

clean_html = """<div style="background: rgba(0,0,0,0.6); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); margin-bottom: 2rem">
<h3 style="color: #ef4444; margin-bottom: 1rem;">Scenario</h3>
<p style="font-size: 1.2rem; margin-bottom: 2rem;">A Platinum member is screaming at the counter because their first-class seat was downgraded due to an aircraft swap.</p>
<h3 style="color: #10b981; margin-bottom: 1rem;">Your Task</h3>
<p style="font-size: 1.2rem;">Use the H.E.A.R.T. model to de-escalate.</p>
</div>"""

for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to replace whatever the LIVE SIMULATION section became, up to the Actors.
    pattern = re.compile(r'# LIVE SIMULATION.*?\*\*Actor 1:\*\*', re.DOTALL)
    
    new_content = f"# LIVE SIMULATION\n\n{clean_html}\n\n**Actor 1:**"
    
    content = pattern.sub(new_content, content)
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
