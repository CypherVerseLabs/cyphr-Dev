// sdk/src/hooks/useUserProfile.ts
import { useEffect, useState } from 'react'
import { fetchUserProfile, UserProfile } from '../api'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const data = await fetchUserProfile()
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  return { profile, loading, error }
}
