// sdk/src/lib/blockchain.ts

export async function getWalletBalance(address: string) {
  const res = await fetch(`http://localhost:5000/api/native/${address}`)
  const data = await res.json()
  return data.balance
}

export async function getTokenBalances(address: string) {
  const res = await fetch(`http://localhost:5000/api/tokens/${address}`)
  const data = await res.json()
  return data.tokens
}

export async function getWalletNFTs(address: string) {
  const res = await fetch(`http://localhost:5000/api/nfts/${address}`)
  const data = await res.json()
  return data
}
