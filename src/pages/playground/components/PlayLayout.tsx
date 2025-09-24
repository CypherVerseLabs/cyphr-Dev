// components/PlaygroundLayout.tsx
import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import PlaygroundNav from './playgroundNav'
import PlaygroundHeader from './PlaygroundHeader'
import PlaygroundSecondaryNav from './PlayNav2'




export default function PlayLayout() {
  return (
    <Box minH="100vh" px={6} py={4}>
      <PlaygroundHeader />

      <Flex gap={10}>
        {/* First Sidebar */}
        <Box flexShrink={0}>
          <PlaygroundNav />
        </Box>

        {/* Second Sidebar */}
        <Box flexShrink={0}>
          <PlaygroundSecondaryNav />
        </Box>

        {/* Main content */}
        <Box flex="1">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}
