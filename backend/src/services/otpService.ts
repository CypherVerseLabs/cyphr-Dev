import { customAlphabet } from 'nanoid';
import prisma from '../lib/prisma';

const generateOTP = customAlphabet('0123456789', 6);

export async function sendOtpToPhone(phoneNumber: string): Promise<void> {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  await prisma.phoneLogin.upsert({
    where: { phoneNumber },
    update: { otp, otpExpires: expires, verified: false },
    create: { phoneNumber, otp, otpExpires: expires },
  });

  // Send via SMS provider here in production
  console.log(`[DEBUG] Sending OTP ${otp} to ${phoneNumber}`);
}

export async function verifyOtp(phoneNumber: string, inputOtp: string) {
  const record = await prisma.phoneLogin.findUnique({ where: { phoneNumber } });

  if (!record || record.otp !== inputOtp || !record.otpExpires || record.otpExpires < new Date()) {
    return { valid: false, user: null };
  }

  let user = null;

  if (record.userId) {
    user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) return { valid: false, user: null };
  } else {
    user = await prisma.user.create({ data: { email: `${phoneNumber}@phone` } });
    await prisma.phoneLogin.update({
      where: { phoneNumber },
      data: { userId: user.id, verified: true },
    });
  }

  return { valid: true, user };
}
