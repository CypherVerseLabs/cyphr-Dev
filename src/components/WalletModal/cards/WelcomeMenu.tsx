'use client'

import {  Image, Text, VStack } from '@chakra-ui/react'

interface WelcomeRightContentProps {
  imageUrl: string
  title: string
  subtitle?: string
}

export const WelcomeMenu = ({
  imageUrl,
  title,
  subtitle,
}: WelcomeRightContentProps) => {
  return (
    <VStack
      spacing={6} // Increased spacing between elements
      align="center"
      textAlign="center"
      px={4}
      py={6}
      height="100%"
      justify="start"
    >
      <Image
        src={imageUrl}
        alt="Welcome"
        boxSize="400px"
        objectFit="cover"
        borderRadius="md"
        mt={-4} // Lift image slightly
      />

      <Text fontSize="2xl" fontWeight="bold">
        {title}
      </Text>

      {subtitle && (
        <Text fontSize="md" color="gray.500">
          {subtitle}
        </Text>
      )}
    </VStack>
  )
}
