// sdk/utils/receiveCrypto.ts
import type { WalletClient } from 'viem'

export function getReceiveAddress(walletClient: WalletClient): `0x${string}` {
  if (!walletClient?.account?.address) {
    throw new Error('No wallet address available')
  }

  return walletClient.account.address
}
