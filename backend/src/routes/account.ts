import express from 'express'
import multer from 'multer'
import { authenticateJWT, AuthenticatedRequest } from '../middleware/authMiddleware'
import prisma from '../lib/prisma'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// PATCH /api/account
router.patch(
  '/',
  authenticateJWT,
  upload.single('avatar'),
  async (req: AuthenticatedRequest, res) => {
    const { displayName, email } = req.body
    const avatarFile = req.file
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const updateData: any = {
        displayName,
        email,
      }

      if (avatarFile) {
        updateData.avatar = avatarFile.filename
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      })

      res.json({ success: true, user: updatedUser, message: 'Profile updated' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Failed to update profile' })
    }
  }
)

// DELETE /api/account
router.delete('/', authenticateJWT, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    await prisma.user.delete({ where: { id: userId } })
    res.json({ success: true, message: 'Account deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

export default router
