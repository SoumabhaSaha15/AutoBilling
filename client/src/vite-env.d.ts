/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CORS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
