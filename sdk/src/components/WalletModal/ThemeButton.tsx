'use client'

// components/ThemedButton.tsx
import { Button, ButtonProps } from '@chakra-ui/react'

interface ThemedButtonProps extends ButtonProps {
  color?: string
}

export default function ThemedButton({ color = 'gold.500', ...props }: ThemedButtonProps) {
  // Fallback hover color if color string format unexpected
  const hoverColor = color.includes('.500')
    ? color.replace('.500', '.600')
    : color

  return (
    <Button
      bg={color}
      color="black"
      _hover={{ bg: hoverColor }}
      fontWeight="bold"
      {...props}
    />
  )
}
