'use client'

import { Avatar, Box, Flex, Heading, useColorModeValue } from '@chakra-ui/react'

interface ModalHeaderProps {
  displayName: string
  logo?: string | React.ReactNode
  isDark: boolean
  titleText?: string // Optional override for header text
  showAvatar?: boolean // Toggle avatar-style logo display
}

export default function ModalHeader({
  displayName,
  logo,
  isDark,
  titleText,
  showAvatar = true,
}: ModalHeaderProps) {
  const fallbackLogo = (
    <Box
      boxSize="32px"
      bg="yellow.400"
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="bold"
      color="black"
      aria-label="Wallet logo"
      role="img"
    >
      C
    </Box>
  )

  const renderLogo = () => {
    if (!showAvatar) return null

    if (typeof logo === 'string') {
      return <Avatar src={logo} size="sm" name={displayName || 'Logo'} />
    } else if (logo) {
      return <Box>{logo}</Box>
    } else {
      return fallbackLogo
    }
  }

  // Theme-aware title text color
  const textColor = useColorModeValue(
    isDark ? 'yellow.300' : 'gray.800',
    isDark ? 'yellow.300' : 'gray.100'
  )

  return (
    <Flex align="center" gap={3} mb={2}>
      {renderLogo()}

      <Heading
        id="wallet-modal-title"
        as="h2"
        fontSize="md"
        fontWeight="bold"
        color={textColor}
      >
        {titleText ?? (displayName ? `Welcome ${displayName}` : 'Connect Wallet')}
      </Heading>
    </Flex>
  )
}
