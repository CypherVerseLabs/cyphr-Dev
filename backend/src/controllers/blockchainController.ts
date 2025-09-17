import { Request, Response } from 'express'
import { getNativeBalance } from '../services/etherscanService'
import { fetchDynamicTokenBalances } from '../services/tokenService' // ✅ Correct import
import { getNFTs } from '../services/nftService'
import { fetchDynamicERC1155NFTs } from '../services/erc1155Service' // ✅ Correct import

export async function fetchNativeBalance(req: Request, res: Response) {
  const { address } = req.params
  if (!address) return res.status(400).json({ error: 'Wallet address is required' })

  try {
    const balance = await getNativeBalance(address)
    res.json({ balance })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function fetchTokenBalances(req: Request, res: Response) {
  const { address } = req.params
  if (!address) return res.status(400).json({ error: 'Wallet address is required' })

  try {
    const tokens = await fetchDynamicTokenBalances(address) // ✅ Updated usage
    res.json({ tokens })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export async function fetchNFTs(req: Request, res: Response) {
  const { address } = req.params
  if (!address) return res.status(400).json({ error: 'Wallet address is required' })

  try {
    const [erc721, erc1155] = await Promise.all([
      getNFTs(address),
      fetchDynamicERC1155NFTs(address), // ✅ Updated usage
    ])

    res.json({ erc721, erc1155 })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
