'use client'

import React from 'react'
import { Box, ModalCloseButton, useColorModeValue } from '@chakra-ui/react'
import ModalHeader from './ModalHeader'

interface ConnectModalHeaderProps {
  headerContent?: React.ReactNode
  displayName: string
  logo?: string | React.ReactNode
  isDark?: boolean
}

export default function ConnectModalHeader({
  headerContent,
  displayName,
  logo,
  isDark,
}: ConnectModalHeaderProps) {
  const bgColor = useColorModeValue('white', 'black') // ✅ black in dark mode, white in light

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={6}
      pt={6}
      bg={bgColor} // ✅ set background
    >
      {headerContent ?? (
        <ModalHeader displayName={displayName} logo={logo} isDark={!!isDark} />
      )}
      <ModalCloseButton position="relative" top="0" right="0" />
    </Box>
  )
}
