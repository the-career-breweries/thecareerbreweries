import os
import shutil

base_dir = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\english-lessons\ug'
orientation_path = r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\orientation-english.md'
streams = ['bsc-aviation', 'bba-aviation']

for stream in streams:
    sem1_dir = os.path.join(base_dir, stream, 'sem1')
    
    week1_path = os.path.join(sem1_dir, 'week1.md')
    week2_path = os.path.join(sem1_dir, 'week2.md')
    
    # week1.md actually has the Grammar content, so we move it to week2.md
    if os.path.exists(week1_path):
        # The generic week2.md was generated, so we just overwrite it with the rich week1.md content
        shutil.copy(week1_path, week2_path)
    
    # Now copy orientation-english.md into week1.md
    if os.path.exists(orientation_path):
        shutil.copy(orientation_path, week1_path)

print("Restored original rich content to Week 2, and set Week 1 to Orientation.")
