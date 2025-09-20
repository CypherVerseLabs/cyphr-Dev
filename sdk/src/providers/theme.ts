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
    500: '#2d66e6',
    600: '#214fb4',
    700: '#163882',
    800: '#0b2251',
    900: '#010b21',
  },
  gold: {
    50: '#fffbea',
    100: '#fff3c4',
    200: '#fce588',
    300: '#fadb5f',
    400: '#f7c948',
    500: '#FFD700',
    600: '#e6c200',
    700: '#ccac00',
    800: '#b39600',
    900: '#997f00',
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

// 5. Custom spacing and shadows
const shadows = {
  gold: '0 0 0 3px rgba(255, 215, 0, 0.6)',
  subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  xl: '0 10px 25px rgba(0, 0, 0, 0.25)',
}

const space = {
  section: '4rem',
  cardPadding: '1.5rem',
}

// 6. Semantic tokens (for color mode–aware overrides)
const semanticTokens = {
  colors: {
    'bg.page': {
      default: 'gray.900',
      _light: 'white',
    },
    'text.heading': {
      default: 'whiteAlpha.900',
      _light: 'gray.800',
    },
    'button.gold.bg': {
      default: 'gold.500',
      _light: 'gold.500',
    },
    'button.gold.hover': {
      default: 'gold.600',
      _light: 'gold.400',
    },
  },
}

// 7. Component customizations
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
      gold: {
        bg: 'gold.500',
        color: 'black',
        _hover: {
          bg: 'gold.600',
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

// 8. Create the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  shadows,
  space,
  semanticTokens,
  components,
})

export default theme
