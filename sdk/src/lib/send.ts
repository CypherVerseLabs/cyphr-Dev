import { Signer, parseEther } from 'ethers'

export async function sendCrypto({
  signer,
  to,
  amount,
}: {
  signer: Signer
  to: string
  amount: string
}) {
  const tx = await signer.sendTransaction({
    to,
    value: parseEther(amount),
  })

  return tx
}
