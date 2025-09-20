'use client'

// components/ThemedButton.tsx
import { Button, ButtonProps } from '@chakra-ui/react'

interface ThemedButtonProps extends ButtonProps {
  color?: string
}

export default function ThemedButton({ color = 'gold.500', ...props }: ThemedButtonProps) {
  return (
    <Button
      bg={color}
      color="black"
      _hover={{ bg: `${color.replace('.500', '.600')}` }}
      fontWeight="bold"
      {...props}
    />
  )
}
