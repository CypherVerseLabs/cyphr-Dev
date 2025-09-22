// src/Api/wallets.ts

import {
  getWalletTransactions,
  getNativeBalance as sdkGetNativeBalance,
  getTokenBalances as sdkGetTokenBalances,
  getWalletNFTs as sdkGetWalletNFTs,
} from '../../sdk'

/**
 * Fetch all transactions for a wallet
 */
export const fetchTransactions = async (address: string) => {
  return getWalletTransactions(address)
}

/**
 * Fetch native coin balance (ETH, MATIC, etc.)
 */
export const fetchNativeBalance = async (address: string) => {
  const { balance } = await sdkGetNativeBalance(address)
  return balance
}

/**
 * Fetch ERC-20 token balances
 */
export const fetchTokenBalances = async (address: string) => {
  const { tokens } = await sdkGetTokenBalances(address)
  return tokens
}

/**
 * Fetch NFTs (ERC-721 and ERC-1155)
 */
export const fetchNFTs = async (address: string) => {
  const { erc721, erc1155 } = await sdkGetWalletNFTs(address)
  return { erc721, erc1155 }
}