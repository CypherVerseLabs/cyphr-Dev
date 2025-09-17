// backend/utils/ipfsHelper.ts
export function resolveIPFS(uri: string): string {
  if (!uri) return ''
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  return uri
}
