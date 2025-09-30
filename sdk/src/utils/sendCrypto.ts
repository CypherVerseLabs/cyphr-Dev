// sdk/utils/sendCrypto.ts
import type { WalletClient } from 'viem'

export async function sendCrypto({
  walletClient,
  to,
  amount,
}: {
  walletClient: WalletClient
  to: `0x${string}`
  amount: string
}) {
  if (!walletClient) {
    throw new Error('No wallet client provided')
  }

  const account = walletClient.account
  if (!account) {
    throw new Error('No account found on wallet client')
  }

  const value = BigInt(Math.floor(parseFloat(amount) * 1e18)) // Convert ETH to wei

  const txHash = await walletClient.sendTransaction({
      to,
      value,
      account,
      chain: undefined
  })

  return txHash
}
