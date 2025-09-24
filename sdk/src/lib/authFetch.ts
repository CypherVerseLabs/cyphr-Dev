let clientId: string | undefined

export function setClientId(id: string | undefined) {
  clientId = id
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('authToken')

  const headers = new Headers(init.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (clientId) {
    headers.set('X-Client-Id', clientId)
  }
  headers.set('Content-Type', 'application/json')

  const response = await fetch(input, { ...init, headers })

  // If unauthorized, try refresh token once
  if (response.status === 401) {
    const refreshSuccess = await refreshToken()
    if (refreshSuccess) {
      // Retry original request with new token
      const newToken = localStorage.getItem('authToken')
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`)
        const retryResponse = await fetch(input, { ...init, headers })
        return handleResponse(retryResponse)
      }
    }
    // If refresh fails, logout user
    logout()
    throw new Error('Unauthorized - Please login again.')
  }

  return handleResponse(response)
}

async function refreshToken(): Promise<boolean> {
  const token = localStorage.getItem('authToken')
  if (!token) return false

  try {
    const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) return false

    const data = await response.json()
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      return true
    }
  } catch (err) {
    console.error('Refresh token failed', err)
  }
  return false
}

function logout() {
  localStorage.removeItem('authToken')
  window.location.href = '/login' // or wherever your login page is
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'API request failed')
  }
  // Assuming JSON response
  return response.json()
}
