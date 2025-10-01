'use client'

import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'

interface ConnectModalFooterProps {
  footerContent?: React.ReactNode
  backgroundColor?: string // optional override
  borderColor?: string
}

export default function ConnectModalFooter({
  footerContent,
  backgroundColor,
  borderColor,
}: ConnectModalFooterProps) {
  const resolvedBg = backgroundColor ?? useColorModeValue('white', 'black') // ✅ black in dark
  const resolvedBorder = borderColor ?? useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      role="contentinfo"
      aria-label="Wallet modal footer"
      p={4}
      borderTop="1px solid"
      borderColor={resolvedBorder}
      bg={resolvedBg} // ✅ apply theme-based or custom
    >
      {footerContent ?? <Footer />}
    </Box>
  )
}
