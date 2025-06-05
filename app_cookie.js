const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Load cookies dari file
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set cookies
  await page.setCookie(...cookies);

  // Prepare GraphQL payload
  const graphqlPayload = {
    query: `
      query GetMarketData($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String, $viewerContext: MarketViewerContext) {
        product(id: $id) {
          id
          title
          listingType
          minimumBid(currencyCode: $currencyCode)
          market(currencyCode: $currencyCode) {
            state(country: $countryCode, market: $marketName) {
              lowestAsk { amount }
              highestBid { amount }
            }
          }
        }
      }
    `,
    variables: {
      id: "nike-reactx-rejuven8-light-orewood-brown",
      currencyCode: "USD",
      countryCode: "US",
      marketName: "US",
      viewerContext: "BUYER"
    },
    operationName: "GetMarketData"
  };

  // Buat request GraphQL dari browser context
  const result = await page.evaluate(async (payload) => {
    const response = await fetch("https://stockx.com/api/p/e", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Operation-Name": "GetMarketData",
        "App-Platform": "Iron",
        "Apollographql-Client-Name": "Iron",
        "Apollographql-Client-Version": "2025.06.01.00"
      },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    const json = await response.json();
    return json;
  }, graphqlPayload);

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
})();
