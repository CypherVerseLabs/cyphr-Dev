import { useAccount, useSignMessage } from 'wagmi'
import { useState } from 'react'

export function useSession() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [token, setToken] = useState<string | null>(null)

  const login = async () => {
    const nonce = await fetch('/api/auth/nonce').then(res => res.text())
    const signature = await signMessageAsync({ message: nonce })
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ address, signature }),
    })
    const { token } = await response.json()
    setToken(token)
  }

  return { address, token, login }
}
