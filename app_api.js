const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createObjectCsvWriter } = require("csv-writer");

const brand = "nike";
const category = "shoes";
const startPage = 1;
const endPage = 2;

const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const csvWriter = createObjectCsvWriter({
  path: path.join(outputDir, `stockx_${brand}.csv`),
  header: [
    { id: "product", title: "Product Name" },
    { id: "sku", title: "SKU" },
    { id: "description", title: "Description" },
    { id: "image", title: "Image URL" },
    { id: "url", title: "Product URL" },
  ],
  append: false,
});

(async () => {
  const allData = [];

  for (let page = startPage; page <= endPage; page++) {
    const url = `https://stockx.com/api/browse?_search=${brand}&category=${category}&page=${page}&limit=40`;
    console.log(`📦 Fetching page ${page}...`);

    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      });

      const products = res.data.Products || [];
      for (const p of products) {
        allData.push({
          product: p.title,
          sku: p.styleId,
          description: p.description || "",
          image: p.media.imageUrl,
          url: `https://stockx.com/${p.urlKey}`,
        });
      }
    } catch (err) {
      console.error(`❌ Failed to fetch page ${page}:`, err.message);
    }
  }

  await csvWriter.writeRecords(allData);
  console.log(`✅ Data berhasil disimpan ke: output/stockx_${brand}.csv`);
})();
