'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { ReactNode } from 'react'
import theme from '../theme' // 👈 this imports your theme.ts

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Ensures the initial color mode is applied correctly */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </>
  )
}
