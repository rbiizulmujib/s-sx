import csv
import os
import requests
from urllib.parse import urlparse
import re

CSV_FILE = "image_clean.csv"
BASE_OUTPUT_DIR = "downloads"
os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)

# List varian imgXX.jpg
IMG_NUMBERS = [1, 10, 29, 7, 24, 19, 33]

def sanitize_filename(name):
    return "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).strip()

def get_image_url_variant(original_url, number):
    return re.sub(r'img\d{2}\.jpg', f'img{int(number):02}.jpg', original_url)

def is_valid_url(url):
    try:
        res = requests.head(url, allow_redirects=True, timeout=5)
        return res.status_code == 200
    except:
        return False

def download_image(url, save_path):
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        with open(save_path, 'wb') as f:
            f.write(res.content)
        return True
    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")
        return False

with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        product_name = row.get("Product Name", "").strip()
        image_url = row.get("Image URL", "").strip()
        sku = row.get("SKU", "").strip()
        description = row.get("Description", "").strip()
        product_url = row.get("Product URL", "").strip()  # <- kolom yang dimaksud

        if not product_name or not image_url:
            continue

        folder_name = sanitize_filename(product_name)
        folder_path = os.path.join(BASE_OUTPUT_DIR, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        # Simpan CSV per produk
        product_csv_path = os.path.join(folder_path, "data.csv")
        with open(product_csv_path, 'w', newline='', encoding='utf-8') as prod_csv:
            writer = csv.DictWriter(prod_csv, fieldnames=["Product Name", "SKU", "Description", "Product URL"])
            writer.writeheader()
            writer.writerow({
                "Product Name": product_name,
                "SKU": sku,
                "Description": description,
                "Product URL": product_url  # ← Kolom yang benar
            })

        # Download semua varian gambar
        for num in IMG_NUMBERS:
            img_url = get_image_url_variant(image_url, num)
            img_url_clean = img_url.split('?')[0]
            filename = f"img{int(num):02}.jpg"
            save_path = os.path.join(folder_path, filename)

            if is_valid_url(img_url_clean):
                print(f"✅ Downloading {filename} from {img_url_clean}")
                download_image(img_url_clean, save_path)
            else:
                print(f"⏭️ Skipped: {img_url_clean} (not found)")

print("🎉 Semua produk selesai diproses.")
