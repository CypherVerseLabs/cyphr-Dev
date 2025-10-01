import type { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

export default async function verifyOtpHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, otp } = req.body

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' })
  }

  try {
    const record = await prisma.phoneLogin.findUnique({
      where: { phoneNumber: phone },
      include: { user: true },
    })

    if (
      !record ||
      record.otp !== otp ||
      !record.otpExpires ||
      record.otpExpires < new Date()
    ) {
      if (record) {
        await prisma.phoneLogin.update({
          where: { phoneNumber: phone },
          data: { failedAttempts: { increment: 1 } },
        })
      }
      return res.status(401).json({ error: 'Invalid or expired OTP' })
    }

    // OTP is valid - reset failed attempts, mark verified and clear OTP fields
    await prisma.phoneLogin.update({
      where: { phoneNumber: phone },
      data: { failedAttempts: 0, verified: true, otp: null, otpExpires: null },
    })

    let user = record.user

    if (!user) {
      user = await prisma.user.create({
        data: { email: `${phone}@phone.example` },
      })
      await prisma.phoneLogin.update({
        where: { phoneNumber: phone },
        data: { userId: user.id },
      })
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({ token, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
