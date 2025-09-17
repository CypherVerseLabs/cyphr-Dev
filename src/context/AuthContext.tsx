// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  token: string | null
  user: { address: string; userId: number } | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
  const [user, setUser] = useState<{ address: string; userId: number } | null>(null)

  const login = (token: string) => {
    localStorage.setItem('authToken', token)
    setToken(token)

    const decoded = JSON.parse(atob(token.split('.')[1]))
    setUser({ address: decoded.address, userId: decoded.userId })
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
    navigate('/home')
  }

  // Refresh token every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return
      fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data?.token) login(data.token)
          else logout()
        })
        .catch(() => logout())
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
