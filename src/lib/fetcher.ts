// src/lib/fetcher.ts

export type Fetcher = (url: string, options?: RequestInit) => Promise<any>

let fetcher: Fetcher | null = null

export function setFetcher(fn: Fetcher) {
  fetcher = fn
}

export function getFetcher(): Fetcher {
  if (!fetcher) {
    throw new Error('Fetcher not set. Please call setFetcher() before using SDK APIs.')
  }
  return fetcher
}
