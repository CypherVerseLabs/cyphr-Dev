'use client'

import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'

interface PhoneLoginProps {
  onStart?: () => void
  onFinish?: () => void
  onError?: (message: string) => void
  onSuccess?: (token: string, user: any) => void
}

export default function PhoneLogin({
  onStart,
  onFinish,
  onError,
  onSuccess,
}: PhoneLoginProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const isValidPhone = (phone: string) => /^\+\d{10,15}$/.test(phone.trim())

  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      const message =
        'Please enter a valid phone number starting with + and country code'
      onError?.(message)
      toast({
        title: 'Invalid phone number',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    onStart?.()
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send OTP')
      }

      setStep('otp')
      toast({
        title: 'OTP sent!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err: any) {
      onError?.(err.message || 'Failed to send OTP')
      toast({
        title: 'Error',
        description: err.message || 'Failed to send OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
      onFinish?.()
    }
  }

  const verifyOtp = async () => {
    if (otp.trim().length !== 6) {
      const message = 'OTP must be 6 digits'
      onError?.(message)
      toast({
        title: 'Invalid OTP',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    onStart?.()
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Invalid OTP')
      }

      const data = await res.json()
      toast({
        title: 'Logged in via phone!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onSuccess?.(data.token, data.user)
    } catch (err: any) {
      onError?.(err.message || 'Invalid OTP')
      toast({
        title: 'Error',
        description: err.message || 'Invalid OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
      onFinish?.()
    }
  }

  return (
    <Box>
      {step === 'phone' ? (
        <VStack spacing={3}>
          <Input
            placeholder="Enter phone number (e.g. +1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            disabled={isSubmitting}
          />
          <Button
            colorScheme="blue"
            width="100%"
            onClick={sendOtp}
            isLoading={isSubmitting}
            isDisabled={!phone.trim()}
          >
            Send OTP
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3}>
          <Text fontSize="sm" color="gray.500">
            Code sent to {phone}
          </Text>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="text"
            disabled={isSubmitting}
          />
          <HStack width="100%">
            <Button variant="ghost" onClick={() => setStep('phone')} size="sm">
              Change number
            </Button>
            <Button
              colorScheme="blue"
              width="100%"
              onClick={verifyOtp}
              isLoading={isSubmitting}
              isDisabled={!otp.trim()}
            >
              Verify
            </Button>
          </HStack>
        </VStack>
      )}
    </Box>
  )
}
