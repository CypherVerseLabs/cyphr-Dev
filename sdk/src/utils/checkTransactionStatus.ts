import type { PublicClient, Transport, Chain } from 'viem'

export async function checkTransactionStatus({
  txHash,
  client,
}: {
  txHash: `0x${string}`
  client: PublicClient<Transport, Chain>
}) {
  const receipt = await client.getTransactionReceipt({ hash: txHash })

  if (!receipt) {
    return { status: 'pending', confirmed: false }
  }

  return {
    status: receipt.status === 'success' ? 'confirmed' : 'failed',
    confirmed: receipt.status === 'success',
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed,
  }
}
