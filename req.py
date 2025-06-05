import requests
import json

url = "https://stockx.com/api/p/e"

payload = "{\"query\":\"query GetMarketData($id: String!, $currencyCode: CurrencyCode, $countryCode: String!, $marketName: String, $viewerContext: MarketViewerContext) { product(id: $id) { id description styleId urlKey listingType title uuid contentGroup sizeDescriptor productCategory lockBuying lockSelling media { imageUrl } minimumBid(currencyCode: $currencyCode) market(currencyCode: $currencyCode) { state(country: $countryCode, market: $marketName) { lowestAsk { amount chainId } highestBid { amount } askServiceLevels { expressExpedited { count lowest { amount chainId inventoryType } delivery { expectedDeliveryDate latestDeliveryDate } } expressStandard { count lowest { amount inventoryType } delivery { expectedDeliveryDate latestDeliveryDate } } standard { count lowest { amount chainId } } } numberOfAsks numberOfBids } salesInformation { lastSale salesLast72Hours } statistics(market: $marketName, viewerContext: $viewerContext) { lastSale { amount changePercentage changeValue sameFees } } } variants { id market(currencyCode: $currencyCode) { state(country: $countryCode, market: $marketName) { lowestAsk { amount chainId } highestBid { amount } askServiceLevels { expressExpedited { count lowest { amount chainId inventoryType } delivery { expectedDeliveryDate latestDeliveryDate } } expressStandard { count lowest { amount chainId inventoryType } delivery { expectedDeliveryDate latestDeliveryDate } } standard { count lowest { amount chainId } } } numberOfAsks numberOfBids } salesInformation { lastSale salesLast72Hours } statistics(market: $marketName, viewerContext: $viewerContext) { lastSale { amount changePercentage changeValue sameFees } } } } } }\",\"variables\":{\"id\":\"nike-reactx-rejuven8-triple-black\",\"currencyCode\":\"USD\",\"countryCode\":\"US\",\"marketName\":\"US\",\"viewerContext\":\"BUYER\"}}"
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': 'en-US',
  'Origin': 'https://stockx.com',
  'Referer': 'https://stockx.com/nike-reactx-rejuven8-light-orewood-brown',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'App-Platform': 'Iron',
  'App-Version': '2025.06.01.00',
  'X-Stockx-Device-Id': '7cc8ad65-484e-4461-87cb-5ac510171df1',
  'X-Stockx-Session-Id': 'fee66fb3-b402-4aaa-a718-faf7a2b4b605',
  'Apollographql-Client-Version': '2025.06.01.00',
  'Apollographql-Client-Name': 'Iron',
  'X-Operation-Name': 'GetMarketData',
  'Selected-Country': 'ID',
  'Sec-Ch-Ua-Platform': '"macOS"',
  'Sec-Ch-Ua': '"Not.A/Brand";v="99", "Chromium";v="136"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Prefers-Color-Scheme': 'dark',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cookie': 'stockx_device_id=7cc8ad65-484e-4461-87cb-5ac510171df1; stockx_session_id=fee66fb3-b402-4aaa-a718-faf7a2b4b605; stockx_session=c0d5ef77-097c-4267-9bb0-3c32714e50a2; language_code=en; stockx_selected_region=ID; ... (lanjutkan semua cookie Anda di sini); _pxhd=NST0xEAueZtxtkNskYYy37tHxwcqtEhNHkl4Ot3T8f8fcAMzqARBqhFP/VPaMTyWtIfPBydn8K17dpodtg5kWA==:0I5it0X3mzUCAbKlcZVIo94OeBUpMcWKbwY5Yia29pa874FgLhCIF5Eal2X5z6MRHFT7ep/Irg0nlfX7H7OZgH1HlfLfz4yKEorEMsMXQYKxIyEQcxyHOC8UFblvYrKP30DDGE5vxDqgJXYRdJyn2A=='
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
