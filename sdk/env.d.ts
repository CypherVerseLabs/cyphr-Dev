// env.d.ts

// For Vite or import.meta.env usage
interface ImportMetaEnv {
  [x: string]: string
  readonly VITE_WC_PROJECT_ID: string
  readonly VITE_RPC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// For Node.js or Next.js process.env usage
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_WC_PROJECT_ID: string
  }
}
