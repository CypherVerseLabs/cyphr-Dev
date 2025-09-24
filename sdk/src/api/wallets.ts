// src/api/wallets.ts

import { authFetch, setClientId as setWalletClientId } from '../lib/authFetch'

export function setClientId(id: string | undefined) {
  setWalletClientId(id)
}

export async function getWalletTransactions(address: string) {
  return authFetch(`/wallets/${address}/transactions`)
}

export async function getNativeBalance(address: string) {
  return authFetch(`/native/${address}`)
}

export async function getTokenBalances(address: string) {
  return authFetch(`/tokens/${address}`)
}

export async function getWalletNFTs(address: string) {
  return authFetch(`/nfts/${address}`)
}
