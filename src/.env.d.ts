interface ImportMetaEnv {
  readonly VITE_HASURA_HTTP: string
  readonly VITE_HASURA_WS: string
  readonly VITE_HASURA_ROLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}