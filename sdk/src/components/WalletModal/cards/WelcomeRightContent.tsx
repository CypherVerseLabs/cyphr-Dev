'use client'

import { Box, Image, Text, VStack } from '@chakra-ui/react'

interface WelcomeRightContentProps {
  imageUrl: string
  title: string
  subtitle?: string

  // 🆕 Customizable props
  imageSize?: string | number
  imageRadius?: string | number
  titleFontSize?: string
  titleFontWeight?: string | number
  subtitleFontSize?: string
  subtitleColor?: string
  spacing?: number
  paddingX?: number
  paddingY?: number
}

export const WelcomeRightContent = ({
  imageUrl,
  title,
  subtitle,
  imageSize = '200px',
  imageRadius = 'md',
  titleFontSize = '2xl',
  titleFontWeight = 'bold',
  subtitleFontSize = 'md',
  subtitleColor = 'gray.500',
  spacing = 2,
  paddingX = 4,
  paddingY = 6,
}: WelcomeRightContentProps) => {
  return (
    <VStack
      spacing={spacing}
      align="center"
      textAlign="center"
      px={paddingX}
      py={paddingY}
      height="100%"
      justify="start"
    >
      <Image
        src={imageUrl}
        alt="Welcome"
        boxSize={imageSize}
        objectFit="cover"
        borderRadius={imageRadius}
        mt={-4}
      />

      

      <Box mt={6}>
        <Text fontSize={titleFontSize} fontWeight={titleFontWeight}>
          {title}
        </Text>

        {subtitle && (
          <Text fontSize={subtitleFontSize} color={subtitleColor} mt={2}>
            {subtitle}
          </Text>
        )}
      </Box>
    </VStack>
  )
}
