import requests
import json
import os

cloud_name = 'l4eozknq'
upload_preset = 'lywlehez'

images = [
    r'C:\Projects\tcb-soft-skills\curriculum-app\public\images\slides\abstract_art_1.jpg',
    r'C:\Projects\tcb-soft-skills\curriculum-app\public\images\slides\abstract_art_2.jpg',
    r'C:\Projects\tcb-soft-skills\curriculum-app\public\images\slides\abstract_art_3.jpg'
]

urls = []

for img_path in images:
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    with open(img_path, 'rb') as f:
        files = {'file': f}
        data = {'upload_preset': upload_preset}
        response = requests.post(url, files=files, data=data)
        if response.status_code == 200:
            urls.append(response.json()['secure_url'])
        else:
            print("Error uploading:", response.text)

print(urls)

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week3.md', 'w', encoding='utf-8') as f:
    f.write(f"""# Art Interpretation
*Session 3: Observational Skills & Expression*

---

```absurd-abstract
image: {urls[0]}
question: Look closely at this painting for 30 seconds. What story is being told by the clash of gold and dark blue?
reveal: There is no wrong answer. It represents finding harmony in chaos—a critical skill in aviation management!
```

---

```absurd-abstract
image: {urls[1]}
question: A glowing red door in an empty frozen wasteland. Does this represent an escape, or a trap?
reveal: It is up to the observer. In conflicts, a sudden "exit" can be a solution or a dangerous diversion.
```

---

```absurd-abstract
image: {urls[2]}
question: An airplane shattering into neon glass. How does this relate to managing a sudden crisis or a change in plans?
reveal: Every shattered piece is an opportunity to rebuild a new structure. Flexibility is key.
```
""")
