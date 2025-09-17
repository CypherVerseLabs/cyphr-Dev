// theme.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react'

// 1. Color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 2. Custom colors
const colors = {
  brand: {
    50: '#e8f0ff',
    100: '#c0d4ff',
    200: '#97b8ff',
    300: '#6f9cff',
    400: '#477fff',
    500: '#2d66e6', // primary
    600: '#214fb4',
    700: '#163882',
    800: '#0b2251',
    900: '#010b21',
  },
}

// 3. Custom fonts
const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
}

// 4. Global styles
const styles = {
  global: {
    body: {
      bg: 'gray.900',
      color: 'whiteAlpha.900',
      lineHeight: 'base',
    },
    a: {
      color: 'brand.400',
      _hover: {
        textDecoration: 'underline',
      },
    },
  },
}

// 5. Component customizations (optional examples)
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
      outline: {
        borderColor: 'brand.500',
        color: 'brand.500',
        _hover: {
          bg: 'brand.500',
          color: 'white',
        },
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          bg: 'gray.800',
          borderColor: 'gray.700',
          _hover: {
            borderColor: 'brand.500',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
}

// 6. Create the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
})

export default theme

