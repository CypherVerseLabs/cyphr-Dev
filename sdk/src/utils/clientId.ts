// utils/clientId.ts

const CLIENT_ID_KEY = 'myapp-client-id'

export function saveClientId(id: string) {
  localStorage.setItem(CLIENT_ID_KEY, id)
}

export function getClientId(): string | null {
  return localStorage.getItem(CLIENT_ID_KEY)
}

export function clearClientId() {
  localStorage.removeItem(CLIENT_ID_KEY)
}
