import express from 'express'
import {
  fetchNativeBalance,
  fetchTokenBalances,
  fetchNFTs,
} from '../controllers/blockchainController'

const router = express.Router()

// ✅ Use consistent route names
router.get('/native/:address', fetchNativeBalance)
router.get('/tokens/:address', fetchTokenBalances)
router.get('/nfts/:address', fetchNFTs)

// Optional aliases for backward compatibility
router.get('/balance/:address', fetchNativeBalance)
router.get('/token-balances/:address', fetchTokenBalances)

export default router