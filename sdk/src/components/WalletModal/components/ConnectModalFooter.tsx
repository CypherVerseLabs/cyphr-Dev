import { Box } from '@chakra-ui/react'
import React from 'react'
import Footer from './Footer'

interface ConnectModalFooterProps {
  footerContent?: React.ReactNode
}

export default function ConnectModalFooter({ footerContent }: ConnectModalFooterProps) {
  return (
    <Box role="contentinfo" aria-label="Wallet modal footer" p={4} borderTop="1px solid" borderColor="gray.200">
      {footerContent ?? <Footer />}
    </Box>
  )
}
