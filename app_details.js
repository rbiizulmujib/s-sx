const puppeteer = require("puppeteer");


const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

const brand = "nike";
const category = "shoes";
const startPage = 1;
const endPage = 25;

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });



  const cookies = [
    {
        "domain": "stockx.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_selected_region",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "ID"
    },
    {
        "domain": "stockx.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_ip_region",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "ID"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1783642885.110814,
        "hostOnly": true,
        "httpOnly": false,
        "name": "mfaLogin",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "err"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1780634113,
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_product_visits",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "74"
    },
    {
        "domain": "stockx.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "loggedIn",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "76a6a026-3f9b-11f0-a79a-12568e98116f"
    },
    {
        "domain": "stockx.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "is_gdpr",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "false"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1780630110.39024,
        "hostOnly": true,
        "httpOnly": false,
        "name": "language_code",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "en"
    },
    {
        "domain": ".stockx.com",
        "expirationDate": 1751682098.491343,
        "hostOnly": false,
        "httpOnly": false,
        "name": "rbuid",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "rbos-0aaab44c-4511-4f55-8f4d-90badca112d9"
    },
    {
        "domain": ".stockx.com",
        "expirationDate": 1783418496.235497,
        "hostOnly": false,
        "httpOnly": false,
        "name": "stockx_device_id",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "e132c15e-e35d-4988-bed8-36bc2aa95b67"
    },
    {
        "domain": "stockx.com",
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_preferred_market_activity",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": null,
        "value": "sales"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1749097709.389395,
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_session",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "45605895-6ba6-4b05-8d6a-8e51459d9496"
    },
    {
        "domain": ".stockx.com",
        "expirationDate": 1749095913.111364,
        "hostOnly": false,
        "httpOnly": false,
        "name": "stockx_session_id",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "ca725639-8825-412f-bc49-d8de88718c83"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1783654110.390022,
        "hostOnly": true,
        "httpOnly": false,
        "name": "token",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5USkNNVVEyUmpBd1JUQXdORFk0TURRelF6SkZRelV4TWpneU5qSTNNRFJGTkRZME0wSTNSQSJ9.eyJodHRwczovL3N0b2NreC5jb20vY3VzdG9tZXJfdXVpZCI6Ijc2YTZhMDI2LTNmOWItMTFmMC1hNzlhLTEyNTY4ZTk4MTE2ZiIsImh0dHBzOi8vc3RvY2t4LmNvbS9nYV9ldmVudCI6IlJlZ2lzdGVyZWQiLCJodHRwczovL3N0b2NreC5jb20vZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuc3RvY2t4LmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMzUwMjY2NjI4ODUyMzY0MTA2NiIsImF1ZCI6ImdhdGV3YXkuc3RvY2t4LmNvbSIsImlhdCI6MTc0OTA4Mjg4NCwiZXhwIjoxNzQ5MTI2MDg0LCJzY29wZSI6Im9mZmxpbmVfYWNjZXNzIiwiYXpwIjoiT1Z4cnQ0VkpxVHg3TElVS2Q2NjFXMER1Vk1wY0ZCeUQifQ.t8MO7ZcIzqStAP0Li-ujl6tXqKr7cUDWSzr5PelquJdNAuMFmncEZnVVFnhBgmCLOlQPacP7eNBmrzS7nx7zsdIYKhqqdb0muTKc3Sz4Au6hv-wqil6waPKbCsw7bVMlkBOHu3pnSw3otbccrHLT7mLXM9tBAL9hJ7_rO-b9xZt32OakcDvWqy6FVNs4fhleqTxEcoKeC12Q2cBMtZkOdOxIsrlTOrHEeGESOAseeDHp0lsV70bBekm815JdXIkO1zqyWO7q-MMrtDBaAiyPaW8FiAbL01TTTLRF072wGvj7GxJxJhEOXmdAYhPdKOzgDUEbbDM5AyS2qEtJEC8RPQ"
    }
];

  const page = await browser.newPage();
  await page.setCookie(...cookies);

  let productLinks = [];

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const listUrl = `https://stockx.com/brands/${brand}?category=${category}&page=${pageNum}`;
    console.log(`⏳ Scraping Page ${pageNum}: ${listUrl}`);
    await page.goto(listUrl, { waitUntil: "networkidle2", timeout: 120000 });

    await sleep(2000); // delay untuk hindari blocking

    const links = await page.evaluate(() => {
      const items = document.querySelectorAll(".css-uq2vx8 a");
      return Array.from(items).map((el) => el.href);
    });

    productLinks = [...productLinks, ...links];
    console.log(productLinks);
  }

  console.log(`🔗 Total produk ditemukan: ${productLinks.length}`);

  const productDetails = [];

  for (const [i, link] of productLinks.entries()) {
    try {
      console.log(`🔍 (${i + 1}/${productLinks.length}) ${link}`);
      await page.goto(link, { waitUntil: "networkidle2", timeout: 120000 });
      await sleep(Math.floor(Math.random() * 3000) + 2000); // delay 2–5s

      const data = await page.evaluate(() => {
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.innerText.trim() : "";
        };
    const getImg = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    return el.currentSrc || el.src || (el.srcset ? el.srcset.split(',')[0].trim().split(' ')[0] : null);
    };


        return {
          product: getText(".chakra-heading.css-1qzfqqa"),
          sku: getText(".chakra-text.css-1u8lk7u"),
          description: getText(".chakra-text.css-1k2nzv4"),
          image: getImg('[data-component="SingleImage"] img'),
        };
      });

      data.url = link;
      productDetails.push(data);
      console.log(productDetails);
    } catch (err) {
      console.warn(`⚠️ Gagal ambil data dari ${link}: ${err.message}`);
    }
  }

  await csvWriter.writeRecords(productDetails);
  console.log(`✅ Data berhasil disimpan ke: output/stockx_${brand}.csv`);

  await browser.close();
})();
