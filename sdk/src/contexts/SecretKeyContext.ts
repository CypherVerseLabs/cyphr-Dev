// src/context/SecretKeyContext.ts
import { createContext, useContext } from 'react'

export const SecretKeyContext = createContext<string | undefined>(undefined)

export function useSecretKey(): string | undefined {
  return useContext(SecretKeyContext)
}
