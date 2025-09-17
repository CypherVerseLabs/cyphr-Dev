// backend/services/nftService.ts
import { ethers } from 'ethers'
import fetch from 'node-fetch' // npm i node-fetch
import ERC721_ABI from '../abis/erc721.json'
import { resolveIPFS } from '../utils/ipfsHelper'

const RPC_URL = process.env.RPC_URL!
const provider = new ethers.JsonRpcProvider(RPC_URL)

const NFT_CONTRACTS = [
  '0xYour721NFTAddress1',
  '0xYour721NFTAddress2',
]

const tokenURICache = new Map<string, any>()

interface NFT {
  contractAddress: string
  tokenId: string
  tokenURI: string
  metadata?: any
}

export async function getNFTs(userAddress: string): Promise<NFT[]> {
  const nfts: NFT[] = []

  for (const contractAddress of NFT_CONTRACTS) {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider)

    try {
      const balance = await contract.balanceOf(userAddress)

      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i)
        let tokenURI = ''

        try {
          tokenURI = await contract.tokenURI(tokenId)
          tokenURI = resolveIPFS(tokenURI)

          let metadata
          if (tokenURICache.has(tokenURI)) {
            metadata = tokenURICache.get(tokenURI)
          } else {
            const res = await fetch(tokenURI)
            metadata = await res.json()
            tokenURICache.set(tokenURI, metadata)
          }

          nfts.push({
            contractAddress,
            tokenId: tokenId.toString(),
            tokenURI,
            metadata,
          })
        } catch (err) {
          nfts.push({
            contractAddress,
            tokenId: tokenId.toString(),
            tokenURI: '',
            metadata: null,
          })
        }
      }
    } catch (err) {
      console.warn(`Skipping ERC-721 contract ${contractAddress}:`, (err as Error).message)
    }
  }

  return nfts
}
