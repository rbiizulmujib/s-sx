const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://stockx.com/nike-reactx-rejuven8-triple-black', { waitUntil: 'networkidle2' });

  const result = await page.evaluate(async () => {
    const res = await fetch('/api/p/e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Operation-Name': 'GetMarketData'
      },
      body: JSON.stringify({
        operationName: 'GetMarketData',
        variables: {
          id: 'nike-reactx-rejuven8-triple-black',
          currencyCode: 'USD',
          countryCode: 'US',
          marketName: 'US',
          viewerContext: 'BUYER'
        },
        query: `query GetMarketData($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String, $viewerContext: MarketViewerContext) {
          product(id: $id) {
            title
            styleId
            description
            media { imageUrl }
          }
        }`
      })
    });
    return await res.json();
  });

  console.log(result.data.product);
  await browser.close();
})();
