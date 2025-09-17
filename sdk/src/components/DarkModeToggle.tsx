import { HStack, Switch, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  // Use gold for dark mode, gray for light mode
  const iconColor = useColorModeValue('gray.600', '#FFD700')
  const switchColorScheme = colorMode === 'dark' ? 'yellow' : 'blue'

  return (
    <HStack spacing={3} align="center">
      <SunIcon color={iconColor} />
      <Switch
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        colorScheme={switchColorScheme}
        sx={{
          // Make switch thumb gold in dark mode
          'input:checked + .chakra-switch__track': {
            bg: colorMode === 'dark' ? '#FFD700' : undefined,
          },
          'input:checked + .chakra-switch__track > .chakra-switch__thumb': {
            bg: colorMode === 'dark' ? '#222' : undefined,
          },
        }}
      />
      <MoonIcon color={iconColor} />
    </HStack>
  )
}
