import os
import json
import shutil
from PIL import Image
from pathlib import Path

# Configuration
# Try to find the correct source directory
POSSIBLE_SOURCES = [
    r"C:\Users\GAMA\Desktop\HaramStay\فندق دار الوافدين",
    r"C:\Users\GAMA\Desktop\My_Hotels\فندق دار الوافدين"
]

SOURCE_DIR = None
for path in POSSIBLE_SOURCES:
    if os.path.exists(path):
        SOURCE_DIR = path
        break

if not SOURCE_DIR:
    print("Error: Could not find 'فندق دار الوافدين' in Desktop folders.")
    exit(1)

PROJECT_ROOT = os.getcwd()
READY_DIR = os.path.join(PROJECT_ROOT, "ready_to_upload", "dar_al_wafideen")
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public", "images", "dar_al_wafideen")

# Hotel Data
HOTEL_DATA = {
    "name": "فندق دار الوافدين",
    "distance_to_haram": "800 متر",
    "price_per_night": "300 ريال",
    "last_10_days_price": "8000 ريال",
    "images": []
}

def process_images():
    # Clean and create directories
    for directory in [READY_DIR, PUBLIC_DIR]:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory)
        print(f"Cleaned and created directory: {directory}")

    print(f"Reading from: {SOURCE_DIR}")
    
    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not files:
        print("No image files found in source directory.")
        return

    print(f"Found {len(files)} images. Starting conversion...")

    processed_count = 0
    for i, filename in enumerate(files, 1):
        source_path = os.path.join(SOURCE_DIR, filename)
        new_filename = f"dar_al_wafideen_{i}.webp"
        
        # Paths for both locations
        ready_path = os.path.join(READY_DIR, new_filename)
        public_path = os.path.join(PUBLIC_DIR, new_filename)

        try:
            with Image.open(source_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new(img.mode[:-1], img.size, (255, 255, 255))
                    background.paste(img, img.split()[-1])
                    img = background.convert('RGB')
                elif img.mode != 'RGB':
                    img = img.convert('RGB')

                # Save as WebP to both locations
                img.save(ready_path, 'WEBP', quality=80, optimize=True)
                img.save(public_path, 'WEBP', quality=80, optimize=True)
                
                HOTEL_DATA["images"].append(new_filename)
                print(f"Converted: {filename} -> {new_filename}")
                processed_count += 1
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

    # Save metadata to both locations
    for directory in [READY_DIR, PUBLIC_DIR]:
        metadata_path = os.path.join(directory, "metadata.json")
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(HOTEL_DATA, f, ensure_ascii=False, indent=4)
    
    print(f"\nProcessing complete!")
    print(f"Successfully converted {processed_count} images.")
    print(f"Saved to: {READY_DIR} and {PUBLIC_DIR}")

if __name__ == "__main__":
    process_images()
