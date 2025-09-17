import { useState } from 'react'
import { loginWithEmail } from '../../../../src/Api/api'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export function EmailLogin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { saveToken } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      toast.warning('⚠️ Please enter a valid email.')
      return
    }

    setIsLoading(true)
    try {
      const { token } = await loginWithEmail(email)

      if (!token) {
        throw new Error('No token received')
      }

      saveToken(token)

      // 🚀 Invalidate and refetch wallet queries
      queryClient.invalidateQueries({ queryKey: ['wallets'] })

      toast.success('✅ Logged in successfully!')

      // 🚀 Redirect to dashboard or wallet manager
      navigate('/dashboard') // or '/wallets' or whatever route you use

    } catch (err: any) {
      toast.error(err?.message || '❌ Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        onClick={handleEmailLogin}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Continue with Email'}
      </button>
    </div>
  )
}
