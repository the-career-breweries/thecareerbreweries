from PIL import Image, ImageDraw, ImageFont
import os

img_path = "curriculum-app/public/images/excel-blank-workbook.png"
output_path = "curriculum-app/public/images/excel-fully-labelled.png"

img = Image.open(img_path).convert("RGBA")
draw = ImageDraw.Draw(img)

# Try to load a nice font, fallback to default
try:
    font = ImageFont.truetype("arial.ttf", 16)
    title_font = ImageFont.truetype("arialbd.ttf", 20)
except IOError:
    font = ImageFont.load_default()
    title_font = font

def draw_annotation(draw, box, text, color="red"):
    # Draw rectangle
    draw.rectangle(box, outline=color, width=3)
    
    # Text background
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_w = text_bbox[2] - text_bbox[0]
    text_h = text_bbox[3] - text_bbox[1]
    
    # Put text box above or inside depending on space
    x1, y1, x2, y2 = box
    text_x = x1 + 5
    text_y = y1 - text_h - 10
    
    if text_y < 0:
        text_y = y1 + 5 # Move inside if it goes off top
    
    draw.rectangle([text_x - 2, text_y - 2, text_x + text_w + 2, text_y + text_h + 2], fill=color)
    draw.text((text_x, text_y), text, fill="white", font=font)

# 1. Ribbon
draw_annotation(draw, [0, 30, 1024, 140], "The Ribbon (Commands & Tools)", "blue")

# 2. Name Box
draw_annotation(draw, [5, 145, 100, 175], "Name Box (Address or e.g. 3Rx3C)", "darkorange")

# 3. Formula Bar
draw_annotation(draw, [150, 145, 900, 175], "Formula Bar", "purple")

# 4. Columns
draw_annotation(draw, [35, 175, 1000, 195], "Column Nomenclature (A, B, C...) Max: 16,384 columns", "green")

# 5. Rows
draw_annotation(draw, [0, 195, 35, 580], "Row Nomenclature (1, 2, 3...)\nMax: 1,048,576 rows", "darkred")

# 6. Active Cell
# Approximate cell D5
draw_annotation(draw, [180, 275, 250, 295], "Cell (e.g. D5)", "magenta")

# 7. Grid
# Just write large text in the middle
grid_text = "The Grid (Worksheet Area)"
grid_bbox = draw.textbbox((0,0), grid_text, font=title_font)
gw = grid_bbox[2] - grid_bbox[0]
gh = grid_bbox[3] - grid_bbox[1]
draw.rectangle([400-5, 350-5, 400+gw+5, 350+gh+5], fill="gray")
draw.text((400, 350), grid_text, fill="white", font=title_font)

img.save(output_path)
print("Annotated image saved.")
