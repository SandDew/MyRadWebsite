import os
from PIL import Image

input_folder = os.path.dirname(os.path.abspath(__file__))

image_files = [
    f for f in os.listdir(input_folder)
    if f.lower().endswith(('.png', '.jpg', '.jpeg'))
]

if len(image_files) > 40:
    print("More than 40 images found. Cancelling conversion.")
else:
    for filename in image_files:
        file_path = os.path.join(input_folder, filename)
        img = Image.open(file_path)
        webp_path = os.path.join(input_folder, os.path.splitext(filename)[0] + ".webp")
        img.save(webp_path, "WEBP", lossless=True)
        print(f"Converted: {filename} -> {os.path.basename(webp_path)}")