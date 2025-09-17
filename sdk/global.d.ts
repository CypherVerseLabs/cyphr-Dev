export {}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      // You can extend this type as needed for other methods
    }
  }
}
