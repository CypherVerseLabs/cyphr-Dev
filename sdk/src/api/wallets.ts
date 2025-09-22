// src/Api/wallets.ts

import { authFetch } from "../../../src/lib/authFetch"

// ✅ Fetch wallet transactions
export async function getWalletTransactions(address: string) {
  return authFetch(`/wallets/${address}/transactions`)
}

// ✅ Fetch native token balance (ETH, MATIC, etc.)
export async function getNativeBalance(address: string) {
  return authFetch(`/native/${address}`)
}

// ✅ Fetch ERC-20 token balances
export async function getTokenBalances(address: string) {
  return authFetch(`/tokens/${address}`)
}

// ✅ Fetch NFTs (ERC-721 and ERC-1155)
export async function getWalletNFTs(address: string) {
  return authFetch(`/nfts/${address}`)
}