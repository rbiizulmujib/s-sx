import csv
import os
import requests
import re
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

CSV_FILE = input("Masukan CSV file: ")
BASE_OUTPUT_DIR = "downloads"
MAX_WORKERS = 10  # jumlah download paralel sekaligus

IMG_NUMBERS = [1, 10, 29, 7, 24, 19, 33]

os.makedirs(BASE_OUTPUT_DIR, exist_ok=True)

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
    except:
        return False

def process_product(index, total, row):
    product_name = row.get("Product Name", "").strip()
    image_url = row.get("Image URL", "").strip()
    sku = row.get("SKU", "").strip()
    description = row.get("Description", "").strip()
    product_url = row.get("Product URL", "").strip()

    if not product_name or not image_url:
        return

    folder_name = sanitize_filename(product_name)
    folder_path = os.path.join(BASE_OUTPUT_DIR, folder_name)
    os.makedirs(folder_path, exist_ok=True)

    # Simpan file data.csv di folder produk
    csv_path = os.path.join(folder_path, "data.csv")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["Product Name", "SKU", "Description", "Product URL"])
        writer.writeheader()
        writer.writerow({
            "Product Name": product_name,
            "SKU": sku,
            "Description": description,
            "Product URL": product_url
        })

    print(f"[{index}/{total}] ⏳ Downloading images for: {product_name}")

    # Kumpulkan URL valid
    valid_tasks = []
    for num in IMG_NUMBERS:
        variant_url = get_image_url_variant(image_url, num).split('?')[0]
        filename = f"img{int(num):02}.jpg"
        save_path = os.path.join(folder_path, filename)

        if is_valid_url(variant_url):
            valid_tasks.append((variant_url, save_path))

    # Download semua gambar valid secara paralel (max 10 sekaligus)
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_url = {executor.submit(download_image, url, path): url for url, path in valid_tasks}
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                result = future.result()
                print(f"   ✅ Downloaded: {os.path.basename(url)}")
            except Exception as e:
                print(f"   ❌ Failed: {url} ({e})")

def main():
    with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
        reader = list(csv.DictReader(csvfile))
        total = len(reader)
        for i, row in enumerate(reader, start=1):
            process_product(i, total, row)

    print("\n🎉 Semua gambar & data selesai diproses.")

if __name__ == "__main__":
    main()
