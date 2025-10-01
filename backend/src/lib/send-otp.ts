import type { Request, Response } from 'express'
import { prisma } from './prisma' // Adjust path to your prisma client
import { randomInt } from 'crypto'

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone } = req.body

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Phone number is required' })
  }

  try {
    // Generate 6-digit OTP as string
    const otp = (randomInt(100000, 999999)).toString()

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000) // OTP valid 5 minutes

    // Upsert phoneLogin record: create or update with new OTP & expiration
    await prisma.phoneLogin.upsert({
      where: { phoneNumber: phone },
      update: {
        otp,
        otpExpires,
        failedAttempts: 0,
        verified: false,
      },
      create: {
        phoneNumber: phone,
        otp,
        otpExpires,
        failedAttempts: 0,
        verified: false,
      },
    })

    // TODO: Integrate SMS sending service here (Twilio, etc)
    console.log(`Sending OTP ${otp} to phone ${phone}`)

    res.status(200).json({ message: 'OTP sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
