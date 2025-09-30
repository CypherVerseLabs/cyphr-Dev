'use client'

import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { WelcomeRightContent } from '../cards/WelcomeRightContent'
import WalletActionsTabs from './WalletActionsModal'

export interface ConnectModalRightPaneProps {
  rightPaneWidth?: string
  panePadding?: string | number
  resolvedRightBg?: string
  rightContent?: ReactNode
  isLoggedIn?: boolean // <- make optional for flexibility
}

export default function ConnectModalRightPane({
  rightPaneWidth = '50%',
  panePadding = 8,
  resolvedRightBg = 'transparent',
  rightContent,
  isLoggedIn = false, // <- fallback default
}: ConnectModalRightPaneProps) {
  return (
    <Box
      width={rightPaneWidth}
      p={panePadding}
      overflowY="auto"
      bg={resolvedRightBg}
      role="region"
      aria-label="Modal right pane content"
    >
      {isLoggedIn ? (
        <WalletActionsTabs />
      ) : (
        rightContent ?? (
          <WelcomeRightContent
            imageUrl="https://avatars.githubusercontent.com/u/143012744?v=4&size=64"
            title="Welcome!"
            subtitle="Let’s get started"
            imageSize="250px"
            titleFontSize="3xl"
            subtitleFontSize="lg"
            subtitleColor="gray.600"
            spacing={4}
            paddingX={8}
          />
        )
      )}
    </Box>
  )
}
