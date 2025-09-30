export function getBuyUrl({
  apiKey,
  walletAddress,
  fiatCurrency = 'USD',
  cryptoCurrency = 'ETH',
  amount,
}: {
  apiKey: string
  walletAddress: string
  fiatCurrency?: string
  cryptoCurrency?: string
  amount?: number
}) {
  return `https://global.transak.com?apiKey=${apiKey}&cryptoCurrencyCode=${cryptoCurrency}&walletAddress=${walletAddress}&fiatCurrency=${fiatCurrency}&fiatAmount=${amount}`
}
