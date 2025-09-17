import { useState, useEffect } from 'react'
import { JsonRpcProvider, Contract } from 'ethers'

interface NFT {
  tokenId: string
  metadataUri: string
  metadata?: {
    name?: string
    description?: string
    image?: string
  }
}

interface UseUserNFTsArgs {
  rpcUrl: string
  nftContractAddress: string
  userAddress?: string
  abi: any
}

export function useUserNFTs({
  rpcUrl,
  nftContractAddress,
  userAddress,
  abi,
}: UseUserNFTsArgs) {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userAddress) {
      setNfts([])
      return
    }

    const provider = new JsonRpcProvider(rpcUrl)
    const contract = new Contract(nftContractAddress, abi, provider)

    async function fetchNFTs() {
      setLoading(true)
      setError(null)

      try {
        const balance = await contract.balanceOf(userAddress)
        const balanceNum = balance.toNumber()

        const tokenIds = await Promise.all(
          Array.from({ length: balanceNum }, (_, i) => contract.tokenOfOwnerByIndex(userAddress, i))
        )

        const userNFTs = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const tokenUri = await contract.tokenURI(tokenId)
            let metadata = {}
            try {
              const res = await fetch(tokenUri)
              if (res.ok) metadata = await res.json()
            } catch {
              // Ignore metadata fetch errors
            }
            return {
              tokenId: tokenId.toString(),
              metadataUri: tokenUri,
              metadata,
            }
          })
        )

        setNfts(userNFTs)
      } catch (e: any) {
        setError(e.message || 'Failed to load NFTs')
        setNfts([])
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [userAddress, rpcUrl, nftContractAddress, abi])

  return { nfts, loading, error }
}
