import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // adjust if your entry file is elsewhere
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'wagmi', '@chakra-ui/react'], // these won't be bundled
})
