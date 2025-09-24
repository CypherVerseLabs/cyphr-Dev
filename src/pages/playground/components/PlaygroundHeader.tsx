// components/PlaygroundHeader.tsx
import { Box, Heading, Divider, HStack, Text } from '@chakra-ui/react'

interface PlaygroundHeaderProps {
  title?: string
}

export default function PlaygroundHeader({ title = 'Playground' }: PlaygroundHeaderProps) {
  return (
    <Box mb={8}>
      <HStack justify="space-between">
        <Heading size="lg">{title}</Heading>
        <Text fontSize="sm" color="gray.500">
          For internal dev use
        </Text>
      </HStack>
      <Divider mt={2} />
    </Box>
  )
}
