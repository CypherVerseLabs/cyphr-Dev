// src/api/users.ts

import { authFetch, setClientId as setAuthClientId } from '../lib/authFetch'

export interface UserProfile {
  id: string
  displayName: string
  email: string
  avatarUrl?: string
}

export function setClientId(id: string | undefined) {
  setAuthClientId(id)
}

export async function fetchUserProfile(): Promise<UserProfile> {
  return authFetch('/users/me', {
    method: 'GET',
  }) as Promise<UserProfile>
}
