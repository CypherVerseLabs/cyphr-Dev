import { useState } from 'react'
import { loginWithEmail } from '../../Api/api'
import { useAuth } from '../../../sdk/src/hooks/useAuth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

interface EmailLoginProps {
  onError?: (message: string) => void
  onLoginSuccess?: () => void
  onLoginError?: (error: string) => void
  onStart?: () => void         // NEW
  onFinish?: () => void        // NEW
}

export function EmailLogin({
  onError,
  onLoginSuccess,
  onLoginError,
  onStart,
  onFinish,
}: EmailLoginProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { saveToken } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      const msg = '⚠️ Please enter a valid email.'
      toast.warning(msg)
      onError?.(msg)
      return
    }

    setIsLoading(true)
    onStart?.()  // Notify parent that loading started

    try {
      const { token } = await loginWithEmail(email)

      if (!token) {
        throw new Error('No token received')
      }

      saveToken(token)
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('✅ Logged in successfully!')
      onLoginSuccess?.()
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err?.message || '❌ Login failed'
      toast.error(errorMessage)
      onError?.(errorMessage)
      onLoginError?.(errorMessage)
    } finally {
      setIsLoading(false)
      onFinish?.()  // Notify parent that loading finished
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
