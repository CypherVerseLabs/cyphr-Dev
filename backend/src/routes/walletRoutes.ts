import { Router, Request, Response } from 'express'
import { verifyMessage } from 'ethers'
import { InfuraProvider } from 'ethers';

import prisma from '../lib/prisma'
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware'
import { body, validationResult } from 'express-validator'

const provider = new InfuraProvider('mainnet', process.env.INFURA_API_KEY);

const challengeStore: Record<string, string> = {}
const router = Router()

// Custom validator for metadata object
const isValidMetadata = (value: any) => {
  if (value === undefined) return true
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    throw new Error('Metadata must be a JSON object')
  }
  return true
}

/**
 * GET /api/wallets
 * Public route to fetch wallets with optional pagination
 */
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || '1', 10)
  const limit = parseInt((req.query.limit as string) || '20', 10)

  try {
    const wallets = await prisma.wallet.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    const total = await prisma.wallet.count()

    res.json({
      success: true,
      data: wallets,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  } catch (err) {
    console.error('GET /wallets error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

/**
 * GET /api/wallets/user
 * Authenticated route to fetch wallets for the logged-in user
 */
router.get('/user', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.jwtUser?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const wallets = await prisma.wallet.findMany({ where: { userId } })
    res.json({ success: true, data: wallets })
  } catch (err) {
    console.error('GET /wallets/user error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

/**
 * GET /api/wallets/:address
 * Public route to fetch a specific wallet by address
 */
router.get('/:address', async (req: Request, res: Response) => {
  const address = req.params.address.toLowerCase()

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address },
      include: { user: true },
    })

    if (!wallet) {
      return res.status(404).json({ success: false, error: 'Wallet not found' })
    }

    res.json({ success: true, data: wallet })
  } catch (err) {
    console.error('GET /wallets/:address error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

router.post('/verify-challenge', async (req: Request, res: Response) => {
  const { address } = req.body

  if (!address) return res.status(400).json({ error: 'Address is required' })

  const nonce = Math.floor(100000 + Math.random() * 900000).toString()
  const message = `Cyph Verification Code: ${nonce}`

  challengeStore[address.toLowerCase()] = message

  res.json({ message })
})

router.post('/verify', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { address, message, signature } = req.body
  const userId = req.jwtUser?.userId;

  if (!address || !message || !signature) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const expected = challengeStore[address.toLowerCase()]
  if (!expected || expected !== message) {
    return res.status(400).json({ error: 'Invalid or expired challenge message' })
  }

  try {
    const recovered = verifyMessage(message, signature)


    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature does not match address' })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { address: address.toLowerCase() },
    })

    if (!wallet || wallet.userId !== userId) {
      return res.status(403).json({ error: 'Wallet not found or not yours' })
    }

    const updatedWallet = await prisma.wallet.update({
      where: { address: address.toLowerCase() },
      data: {
        metadata: {
  ...(typeof wallet.metadata === 'object' && wallet.metadata !== null ? wallet.metadata : {}),
  verified: true,
  verifiedAt: new Date().toISOString(),
},
      },
    })

    delete challengeStore[address.toLowerCase()]
    res.json({ success: true, data: updatedWallet })
  } catch (error) {
    console.error('Wallet verification error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})


/**
 * POST /api/wallets
 * Authenticated route to add a new wallet
 */

router.post(
  '/',
  authenticateJWT,
  [
    body('address').notEmpty().withMessage('Wallet address is required'),
    // other validators...
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userId = req.jwtUser?.userId;
    let { address, walletType, label, metadata, chainId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      address = address.toLowerCase();

      const existingWallet = await prisma.wallet.findUnique({ where: { address } });
      if (existingWallet) {
        return res.status(409).json({ success: false, error: 'Wallet already linked' });
      }

      // ENS lookup (optional)
      let ensName = null;
      try {
        ensName = await provider.lookupAddress(address);
      } catch (e) {
        console.warn('ENS lookup failed:', e);
      }

      const wallet = await prisma.wallet.create({
        data: {
          address,
          walletType: walletType || 'external',
          userId,
          label,
          metadata,
          chainId,
          ensName,  // Save ENS name if found
        },
      });

      res.status(201).json({ success: true, data: wallet });
    } catch (err) {
      console.error('POST /wallets error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

/**
 * PATCH /api/wallets/:address
 * Authenticated route to update wallet info
 */
router.patch(
  '/:address',
  authenticateJWT,
  [
    body('label').optional().isString().isLength({ max: 64 }),
    body('walletType').optional().isString(),
    body('metadata').optional().custom(isValidMetadata),
    body('chainId').optional().isNumeric(),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const userId = req.jwtUser?.userId;
    const addressParam = req.params.address.toLowerCase()

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    try {
      const wallet = await prisma.wallet.findUnique({ where: { address: addressParam } })

      if (!wallet || wallet.userId !== userId) {
        return res.status(404).json({ success: false, error: 'Wallet not found or unauthorized' })
      }

      const { label, walletType, metadata, chainId } = req.body

      const updatedWallet = await prisma.wallet.update({
        where: { address: addressParam },
        data: {
          label: label ?? wallet.label,
          walletType: walletType ?? wallet.walletType,
          metadata: metadata ?? wallet.metadata,
          chainId: chainId ?? wallet.chainId,
        },
      })

      res.json({ success: true, data: updatedWallet })
    } catch (err) {
      console.error('PATCH /wallets/:address error:', err)
      res.status(500).json({ success: false, error: 'Internal server error' })
    }
  }
)

/**
 * DELETE /api/wallets/:address
 * Authenticated route to unlink/remove a wallet
 */
router.delete('/:address', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.jwtUser?.userId;
  const addressParam = req.params.address.toLowerCase()

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: addressParam },
    })

    if (!wallet || wallet.userId !== userId) {
      return res.status(404).json({ success: false, error: 'Wallet not found or unauthorized' })
    }

    await prisma.wallet.delete({ where: { address: addressParam } })
    res.status(204).send()
  } catch (err) {
    console.error('DELETE /wallets/:address error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

/**
 * PATCH /api/wallets/:address/refresh-ens
 * Authenticated route to manually refresh ENS name for a wallet
 */
router.patch('/:address/refresh-ens', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.jwtUser?.userId;
  const addressParam = req.params.address.toLowerCase()

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const wallet = await prisma.wallet.findUnique({ where: { address: addressParam } })

    if (!wallet || wallet.userId !== userId) {
      return res.status(404).json({ success: false, error: 'Wallet not found or unauthorized' })
    }

    let ensName = null
    try {
      ensName = await provider.lookupAddress(addressParam)
    } catch (err) {
      console.warn(`ENS lookup failed for ${addressParam}:`, err)
    }

    const updated = await prisma.wallet.update({
      where: { address: addressParam },
      data: { ensName },
    })

    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('PATCH /wallets/:address/refresh-ens error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})


export default router
