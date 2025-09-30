import React from 'react'
import { Box, ModalCloseButton } from '@chakra-ui/react'
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
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" px={6} pt={6}>
      {headerContent ?? (
        <ModalHeader displayName={displayName} logo={logo} isDark={!!isDark} />
      )}
      <ModalCloseButton position="relative" top="0" right="0" />
    </Box>
  )
}
