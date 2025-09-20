// ModalHeader.tsx
'use client'

import { Flex, Text } from '@chakra-ui/react'

interface ModalHeaderProps {
  displayName: string
  logo?: string | React.ReactNode
  isDark: boolean
}

export default function ModalHeader({ displayName, logo, isDark }: ModalHeaderProps) {
  const fallbackLogo = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FFD700" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="12"
        fill="black"
        fontWeight="bold"
      >
        C
      </text>
    </svg>
  )

  return (
    <Flex align="center" gap={2}>
      {typeof logo === 'string' ? (
        <img src={logo} alt="Logo" width={24} height={24} />
      ) : logo ? (
        logo
      ) : (
        fallbackLogo
      )}
      <Text
  id="wallet-modal-title"
  fontSize="sm"
  fontWeight="bold"
  color={isDark ? 'yellow.300' : 'gray.800'} // ✅ use isDark here
>
  {displayName ? `Welcome ${displayName}` : 'Connect'}
</Text>
    </Flex>
  )
}
