import { Router, Response, Request } from 'express'
import { InfuraProvider } from 'ethers'
import prisma from '../lib/prisma'
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware'

const router = Router()
const provider = new InfuraProvider('mainnet', process.env.INFURA_API_KEY)

// Middleware to enforce admin access
function requireAdmin(req: AuthenticatedRequest, res: Response, next: Function) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' })
  }
  next()
}

/**
 * POST /admin/refresh-ens-all
 * Admin-only endpoint to refresh ENS names for all wallets
 */
router.post('/refresh-ens-all', authenticateJWT, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const wallets = await prisma.wallet.findMany()

    let updated = 0

    for (const wallet of wallets) {
      try {
        const ensName = await provider.lookupAddress(wallet.address)

        if (ensName !== wallet.ensName) {
          await prisma.wallet.update({
            where: { address: wallet.address },
            data: { ensName },
          })
          updated++
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.warn(`Failed to fetch ENS for ${wallet.address}:`, message)
      }
    }

    res.json({ success: true, updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Admin ENS refresh failed:', message)
    res.status(500).json({ success: false, error: message })
  }
})


export default router
