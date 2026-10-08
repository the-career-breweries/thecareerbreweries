from PIL import Image, ImageDraw, ImageFont
import os

img_path = "curriculum-app/public/images/excel-blank-workbook.png"
output_path = "curriculum-app/public/images/excel-fully-labelled.png"

img = Image.open(img_path).convert("RGBA")
draw = ImageDraw.Draw(img)

# Try to load Arial, otherwise default
try:
    font = ImageFont.truetype("arial.ttf", 18)
    bold_font = ImageFont.truetype("arialbd.ttf", 22)
except IOError:
    font = ImageFont.load_default()
    bold_font = font

def draw_pointer_annotation(draw, box, text, text_pos, color="red"):
    # Draw the bounding box around the UI element
    draw.rectangle(box, outline=color, width=3)
    
    # Calculate box center/edge for the line
    bx_mid = (box[0] + box[2]) // 2
    by_mid = (box[1] + box[3]) // 2
    by_bottom = box[3]
    bx_right = box[2]
    
    # Text background box
    text_bbox = draw.textbbox((0, 0), text, font=bold_font)
    tw = text_bbox[2] - text_bbox[0]
    th = text_bbox[3] - text_bbox[1]
    
    tx, ty = text_pos
    
    # Draw line from text center to box edge depending on relative position
    line_start = (tx + tw//2, ty)
    line_end = (bx_mid, by_bottom)
    
    if tx > box[2]: # Text is to the right
        line_start = (tx, ty + th//2)
        line_end = (bx_right, by_mid)
    elif ty > box[3]: # Text is below
        line_start = (tx + tw//2, ty)
        line_end = (bx_mid, by_bottom)
    elif ty < box[1]: # Text is above
        line_start = (tx + tw//2, ty + th)
        line_end = (bx_mid, box[1])
    else: # Text is left
        line_start = (tx + tw, ty + th//2)
        line_end = (box[0], by_mid)

    draw.line([line_start, line_end], fill=color, width=2)
    
    # Draw a little circle at the end of the line
    r = 4
    draw.ellipse([line_end[0]-r, line_end[1]-r, line_end[0]+r, line_end[1]+r], fill=color)
    
    # Draw text background
    pad = 6
    draw.rectangle([tx - pad, ty - pad, tx + tw + pad, ty + th + pad], fill="white", outline=color, width=2)
    
    # Draw text
    draw.text((tx, ty), text, fill="black", font=bold_font)

# 1. Ribbon
draw_pointer_annotation(draw, [0, 30, 1024, 140], "The Ribbon", (450, 60), "blue")

# 2. Name Box
draw_pointer_annotation(draw, [10, 145, 120, 170], "Name Box", (80, 220), "darkorange")

# 3. Formula Bar
draw_pointer_annotation(draw, [150, 145, 900, 170], "Formula Bar", (400, 220), "purple")

# 4. Columns
draw_pointer_annotation(draw, [35, 175, 1000, 195], "Columns (A, B... to XFD)\nMax: 16,384", (650, 220), "green")

# 5. Rows
draw_pointer_annotation(draw, [0, 195, 35, 580], "Rows (1, 2...)\nMax: 1,048,576", (100, 450), "darkred")

# 6. Active Cell
# Box around cell D5
draw_pointer_annotation(draw, [210, 275, 275, 295], "Active Cell (e.g. D5)", (350, 300), "magenta")

# 7. Grid
grid_text = "The Grid (Worksheet Area)"
grid_bbox = draw.textbbox((0,0), grid_text, font=bold_font)
gw = grid_bbox[2] - grid_bbox[0]
gh = grid_bbox[3] - grid_bbox[1]
tx, ty = 400, 450
pad = 10
draw.rectangle([tx - pad, ty - pad, tx + gw + pad, ty + gh + pad], fill="#f0f0f0", outline="gray", width=2)
draw.text((tx, ty), grid_text, fill="black", font=bold_font)

img.save(output_path)
print("Cleaner annotated image saved.")
