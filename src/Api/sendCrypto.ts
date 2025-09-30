import { parseEther } from 'viem'

export async function sendCrypto({
  walletClient,
  to,
  amount,
}: {
  walletClient: any
  to: `0x${string}`
  amount: string
}) {
  if (!walletClient) throw new Error('Wallet client not available')

  const [account] = walletClient.account ? [walletClient.account] : await walletClient.getAddresses()

  const hash = await walletClient.sendTransaction({
    account,
    to,
    value: parseEther(amount),
  })

  return hash
}
