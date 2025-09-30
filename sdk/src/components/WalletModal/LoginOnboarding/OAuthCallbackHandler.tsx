import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function OAuthCallbackHandler() {
  const { saveToken } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Example: parse ?token=xxx or #token=xxx from URL
    const params = new URLSearchParams(location.search)
    let token = params.get('token')

    // Also check hash fragment if needed
    if (!token && location.hash) {
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''))
      token = hashParams.get('token')
    }

    if (token) {
      saveToken(token)
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('✅ Logged in successfully!')

      // Redirect after login - customize as needed
      navigate('/dashboard', { replace: true })
    } else {
      toast.error('❌ OAuth login failed: missing token')
      navigate('/login', { replace: true })
    }
  }, [location, navigate, saveToken, queryClient])

  return null // or loading spinner if you want
}
