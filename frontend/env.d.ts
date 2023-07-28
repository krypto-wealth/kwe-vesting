/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_DEBUG: string
  readonly VITE_OFF_STORE: string
  readonly VITE_FORK: string
  readonly VITE_MODE?: 'qa' | 'dev' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
