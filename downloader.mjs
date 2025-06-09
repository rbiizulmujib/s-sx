import fs from 'fs-extra';
import csvParser from 'csv-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pLimit from 'p-limit';
import { finished } from 'stream/promises';

const CSV_FILE = 'image_clean.csv';
const OUTPUT_DIR = 'downloads';
const IMG_NUMBERS = [1, 10, 29, 7, 24, 19, 33];
const MAX_CONCURRENT_DOWNLOADS = 10;

// __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sanitizeFilename = (name) =>
  name.replace(/[^a-z0-9_\- ]/gi, '').trim();

const hasImg01 = (url) => /img01\.jpg/.test(url);

const replaceImgNumberInUrl = (url, number) =>
  url.replace(/img\d{2}\.jpg/, `img${number.toString().padStart(2, '0')}.jpg`);

async function isValidUrl(url) {
  try {
    const res = await axios.head(url, { timeout: 5000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function downloadImage(url, savePath) {
  try {
    const res = await axios.get(url, { responseType: 'stream', timeout: 10000 });
    await fs.ensureFile(savePath);
    await finished(res.data.pipe(fs.createWriteStream(savePath)));
    return true;
  } catch {
    return false;
  }
}

async function processProduct(index, total, row) {
  const productName = row['Product Name']?.trim();
  const imageUrl = row['Image URL']?.trim();
  const sku = row['SKU']?.trim();
  const description = row['Description']?.trim();
  const productUrl = row['Product URL']?.trim();

  if (!productName || !imageUrl) return;

  const folderName = sanitizeFilename(productName);
  const folderPath = path.join(__dirname, OUTPUT_DIR, folderName);
  await fs.ensureDir(folderPath);

  // Save CSV
  const csvContent = `Product Name,SKU,Description,Product URL\n"${productName}","${sku}","${description}","${productUrl}"\n`;
  await fs.writeFile(path.join(folderPath, 'data.csv'), csvContent, 'utf8');

  console.log(`[${index}/${total}] ⏳ Downloading images for: ${productName}`);

  const limit = pLimit(MAX_CONCURRENT_DOWNLOADS);
  const downloadTasks = [];

  const safeName = sanitizeFilename(productName);

  if (hasImg01(imageUrl)) {
    for (const num of IMG_NUMBERS) {
      const imgUrl = replaceImgNumberInUrl(imageUrl, num); // Tetap sertakan query
      const prefix = num.toString().padStart(2, '0');
      const fileName = `${prefix} - ${safeName}.jpg`;
      const savePath = path.join(folderPath, fileName);

      downloadTasks.push(limit(async () => {
        if (await isValidUrl(imgUrl)) {
          const ok = await downloadImage(imgUrl, savePath);
          console.log(ok
            ? `   ✅ ${fileName}`
            : `   ❌ Gagal download ${fileName}`);
        } else {
          console.log(`   ⏭️ ${fileName} tidak ditemukan`);
        }
      }));
    }
  } else {
    // Tidak pakai IMG_NUMBERS, hanya download satu gambar
    const fileName = `00 - ${safeName}.jpg`;
    const savePath = path.join(folderPath, fileName);
    if (await isValidUrl(imageUrl)) {
      const ok = await downloadImage(imageUrl, savePath);
      console.log(ok
        ? `   ✅ ${fileName}`
        : `   ❌ Gagal download ${fileName}`);
    } else {
      console.log(`   ⏭️ ${fileName} tidak ditemukan`);
    }
  }

  await Promise.all(downloadTasks);
}

async function main() {
  const products = [];
  const stream = fs.createReadStream(path.join(__dirname, CSV_FILE)).pipe(csvParser());
  for await (const row of stream) products.push(row);

  for (let i = 0; i < products.length; i++) {
    await processProduct(i + 1, products.length, products[i]);
  }

  console.log('\n🎉 Semua produk selesai diproses.');
}

main();
