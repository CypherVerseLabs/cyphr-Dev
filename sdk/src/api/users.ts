// sdk/src/api/users.ts
import { authFetch } from '../lib/authFetch'

export interface UserProfile {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
}

export async function fetchUserProfile(): Promise<UserProfile> {
  return authFetch('/users/me', {
    method: 'GET',
  }) as Promise<UserProfile>
}
