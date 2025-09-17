// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken')
  })

  const saveToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken)
    setToken(newToken)
  }

  const clearToken = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    navigate('/home')
  }

  // Auto-refresh token every X minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      const storedToken = localStorage.getItem('authToken')
      if (storedToken) {
        // 👇 Replace this with your real refresh logic
        fetch('http://localhost:5000/api/refresh-token', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data?.token) {
              saveToken(data.token)
            } else {
              clearToken()
            }
          })
          .catch(() => clearToken())
      }
    }, 5 * 60 * 1000) // every 5 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  return { token, saveToken, clearToken }
}
