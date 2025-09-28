'use client'

import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

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
    >
      C
    </Box>
  )

  const renderLogo = () => {
    if (!showAvatar) return null

    if (typeof logo === 'string') {
      return <Avatar src={logo} size="sm" name="Logo" />
    } else if (logo) {
      return <Box>{logo}</Box>
    } else {
      return fallbackLogo
    }
  }

  const textColor = useColorModeValue(
    isDark ? 'yellow.300' : 'gray.800',
    isDark ? 'yellow.300' : 'gray.100'
  )

  return (
    <Flex align="center" gap={3} mb={2}>
      {renderLogo()}
      <Text
        id="wallet-modal-title"
        role="heading"
        aria-level={2}
        fontSize="md"
        fontWeight="bold"
        color={textColor}
      >
        {titleText ?? (displayName ? `Welcome ${displayName}` : 'Connect Wallet')}
      </Text>
    </Flex>
  )
}
