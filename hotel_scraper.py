import os
import time
import random
import requests
import hashlib
import io
import shutil
from PIL import Image
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def setup_driver():
    """Setup Chrome Driver with options."""
    chrome_options = Options()
    # chrome_options.add_argument("--headless") # Uncomment to run in background
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def download_image(url, folder_path, image_name, seen_hashes):
    """Download image with high quality and deduplication checks."""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            content = response.content
            
            # 1. Deduplication (Hash Check)
            img_hash = hashlib.md5(content).hexdigest()
            if img_hash in seen_hashes:
                print(f"⚠️ تم تخطي {image_name}: صورة مكررة.")
                return False
            
            # 2. Quality Check (Dimensions)
            try:
                img = Image.open(io.BytesIO(content))
                width, height = img.size
                
                if width < 1000:
                    print(f"⚠️ تم تخطي {image_name}: العرض {width}px أقل من 1000px المطلوب.")
                    return False
                    
            except Exception as e:
                print(f"⚠️ فشل قراءة الصورة {image_name}: {e}")
                return False

            # Save
            file_path = os.path.join(folder_path, image_name)
            with open(file_path, 'wb') as file:
                file.write(content)
                
            seen_hashes.add(img_hash)
            print(f"✅ تم تحميل: {image_name} (أبعاد: {width}x{height}, حجم: {len(content)//1024}KB)")
            return True
            
    except Exception as e:
        print(f"⚠️ فشل تحميل الصورة {image_name}: {e}")
    return False

def scrape_hotel_images(driver, hotel_name, area_name, num_images=5):
    """Scrape high-res images for a specific hotel."""
    print(f"\n🔍 جاري البحث عن صور: {hotel_name} ({area_name})...")
    
    # Create folder structure
    safe_area = "".join([c for c in area_name if c.isalpha() or c.isdigit() or c==' ' or c=='_']).strip()
    safe_hotel = "".join([c for c in hotel_name if c.isalpha() or c.isdigit() or c==' ' or c=='_']).strip()
    
    base_folder = "Makkah_Hotels_Database"
    hotel_folder = os.path.join(base_folder, safe_area, safe_hotel)
    
    # Clean up existing folder for this hotel
    if os.path.exists(hotel_folder):
        shutil.rmtree(hotel_folder)
        print(f"🧹 تم تنظيف المجلد القديم: {hotel_folder}")
    
    os.makedirs(hotel_folder)
    
    # Updated Search Query: 
    # - Removed sur:fmc (Option 1: Relaxed license)
    # - tbs=isz:l (Large images) for high quality
    search_query = f"{hotel_name} {area_name} hotel"
    search_url = f"https://www.google.com/search?q={search_query}&tbm=isch&tbs=isz:l"
    
    print(f"🔗 رابط البحث: {search_url}")
    driver.get(search_url)

    # Wait for images to load
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    except:
        print("⚠️ Page load timeout.")

    # Scroll down
    driver.execute_script("window.scrollBy(0, 1000);")
    time.sleep(3)

    # Find image thumbnails
    thumbnails = driver.find_elements(By.CSS_SELECTOR, "img.Q4LuWd, img.rg_i")
    
    if not thumbnails:
        print("   - لم يتم العثور على صور بالفئات المعروفة، جاري البحث العام...")
        all_imgs = driver.find_elements(By.TAG_NAME, "img")
        thumbnails = [img for img in all_imgs if img.size['width'] > 100]

    print(f"   - تم العثور على {len(thumbnails)} صورة محتملة.")
    
    seen_hashes = set()
    downloaded_count = 0
    
    for i, thumb in enumerate(thumbnails):
        if downloaded_count >= num_images:
            break
            
        try:
            # Try to get high-res via click
            try:
                driver.execute_script("arguments[0].click();", thumb)
                time.sleep(2)
                
                # Look for high-res candidates
                large_candidates = driver.find_elements(By.CSS_SELECTOR, "img[src^='http']")
                found_url = None
                
                # Filter for largest image on screen
                valid_candidates = []
                for img in large_candidates:
                    if img.size['width'] > 400: # Must be reasonably big on screen
                        valid_candidates.append(img)
                
                if valid_candidates:
                    # Pick the largest
                    best_img = max(valid_candidates, key=lambda x: x.size['width'] * x.size['height'])
                    src = best_img.get_attribute("src")
                    if src and not "encrypted-tbn0" in src:
                        found_url = src
                
                if found_url:
                     if download_image(found_url, hotel_folder, f"image_{downloaded_count+1}.jpg", seen_hashes):
                        downloaded_count += 1
                        continue

            except Exception as e:
                pass 
            
            # Fallback
            src = thumb.get_attribute("src")
            if src and src.startswith("http"):
                 if download_image(src, hotel_folder, f"image_{downloaded_count+1}.jpg", seen_hashes):
                    downloaded_count += 1

        except Exception as e:
            continue
            
    print(f"✨ تم الانتهاء من {hotel_name}: تم حفظ {downloaded_count} صور فريدة.")
    return hotel_folder, downloaded_count

def main():
    if not os.path.exists("hotels_list.txt"):
        print("❌ ملف hotels_list.txt غير موجود!")
        return

    # Read hotels
    hotels_data = []
    with open("hotels_list.txt", "r", encoding="utf-8") as f:
        for line in f:
            if "|" in line:
                parts = line.strip().split("|")
                if len(parts) >= 2:
                    hotels_data.append((parts[0].strip(), parts[1].strip()))
    
    if not hotels_data:
        print("❌ القائمة فارغة")
        return

    driver = setup_driver()
    processed_hotels = []
    
    try:
        for hotel_name, area_name in hotels_data:
            folder_path, count = scrape_hotel_images(driver, hotel_name, area_name)
            processed_hotels.append(f"{hotel_name} | {area_name} | مسار: {folder_path} | صور فريدة: {count}")
            
            sleep_time = random.uniform(5, 10)
            print(f"⏳ انتظار {sleep_time:.2f} ثانية...")
            time.sleep(sleep_time)
            
    finally:
        driver.quit()
        
        with open("Final_Hotels_Report.txt", "w", encoding="utf-8") as report:
            report.write("=== تقرير تحميل صور فنادق مكة (جودة عالية + حقوق) ===\n")
            report.write(f"تاريخ: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            for entry in processed_hotels:
                report.write(f"- {entry}\n")
        
        print("\n📝 تم إنشاء التقرير النهائي: Final_Hotels_Report.txt")
        print("🏁 تم الانتهاء.")

if __name__ == "__main__":
    main()
