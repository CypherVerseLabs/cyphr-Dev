// components/PlaygroundSecondaryNav.tsx
import {
  VStack,
  Heading,
  Divider,
  Link as ChakraLink,
  Box,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { playgroundLinks } from './playgroundNav'

export default function PlaygroundSecondaryNav() {
  const location = useLocation()
  const currentPath = location.pathname

  // Find the active group based on matching child paths
  const activeGroup = playgroundLinks.find((link) =>
    link.children?.some((child) => currentPath.startsWith(child.href))
  )

  if (!activeGroup || !activeGroup.children) {
    return (
      <Box minW="220px" mt={2}>
        <Heading size="sm" mb={2}>Details</Heading>
        <Divider />
        <Box mt={4} fontSize="sm" color="gray.500">
          Select a category from the left sidebar to see more options.
        </Box>
      </Box>
    )
  }

  return (
    <VStack align="start" spacing={2} minW="220px" mt={2}>
      <Heading size="sm">{activeGroup.label} Details</Heading>
      <Divider />

      {activeGroup.children.map((child) => {
        const isActive = currentPath === child.href

        return (
          <ChakraLink
            key={child.href}
            as={Link}
            to={child.href}
            px={2}
            py={1}
            fontWeight="medium"
            borderLeft={isActive ? '3px solid' : '3px solid transparent'}
            borderColor={isActive ? 'blue.500' : 'transparent'}
            color={isActive ? 'blue.500' : 'gray.700'}
            _hover={{
              color: 'blue.400',
              textDecoration: 'none',
            }}
          >
            {child.label}
          </ChakraLink>
        )
      })}
    </VStack>
  )
}
