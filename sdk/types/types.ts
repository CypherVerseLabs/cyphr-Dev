// src/types.ts

// Wallet types handled by your system
export type WalletType = 'embedded' | 'smart' | 'external'

/**
 * Represents a wallet stored in the backend
 */
export interface Wallet {
  id: string
  userEmail: string
  walletAddress: string
  walletType: WalletType
}

/**
 * API response for creating a wallet
 */
export interface CreateWalletResponse {
  token?: string
  success: boolean
  message?: string
}

/**
 * Response for fetching wallets (paginated)
 */
export interface WalletListResponse {
  wallets: Wallet[]
  total: number
  page: number
  pageSize: number
}

/**
 * API error format (optional — if your backend standardizes errors)
 */
export interface ApiError {
  message: string
  statusCode?: number
}

/**
 * Input data for creating a wallet
 */
export interface CreateWalletInput {
  email: string
  walletAddress: string
  walletType: WalletType
}
