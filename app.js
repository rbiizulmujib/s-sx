const puppeteer = require("puppeteer");
const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");

// === CONFIGURABLE PARAMETERS ===
const brand = "nike";
const category = "shoes";
const startPage = 1;
const endPage = 2; // Ganti sesuai keinginan user

// === CSV Setup ===
const csvWriter = createObjectCsvWriter({
  path: "stockx_nike_shoes.csv",
  header: [
    { id: "product", title: "Product Name" },
    { id: "url", title: "URL" },
  ],
  append: false,
});

// === COOKIES ===
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
        "expirationDate": 1780630063,
        "hostOnly": true,
        "httpOnly": false,
        "name": "stockx_product_visits",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "72"
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
        "expirationDate": 1780626057.173312,
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
        "domain": ".stockx.com",
        "expirationDate": 1749091862.877558,
        "hostOnly": false,
        "httpOnly": false,
        "name": "stockx_session_id",
        "path": "/",
        "sameSite": "lax",
        "secure": true,
        "session": false,
        "storeId": null,
        "value": "da5b0a69-113c-4368-a022-0cd80c5bd1bf"
    },
    {
        "domain": "stockx.com",
        "expirationDate": 1783650059.172532,
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

(async () => {
  const browser = await puppeteer.launch({
    headless: "shell", // change to true for headless
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setCookie(...cookies);

  let allData = [];

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const url = `https://stockx.com/brands/${brand}?category=${category}&page=${pageNum}`;
    console.log(`⏳ Scraping Page ${pageNum}: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

    const products = await page.evaluate(() => {
      const items = document.querySelectorAll(".css-uq2vx8 a");
      return Array.from(items).map((el) => ({
        product: el.innerText.trim(),
        url: el.href,
      }));
    });

    allData = [...allData, ...products];
    console.log(allData);
  }

  await csvWriter.writeRecords(allData);
  console.log(`✅ Total produk tersimpan: ${allData.length}`);
  await browser.close();
})();