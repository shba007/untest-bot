declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server Configuration
      NODE_ENV: 'development' | 'production' | 'test'

      // Database Configuration
      DATABASE_URL: string

      // API Keys
      GEMINI_API_KEY: string

      // Feature Flags
      DEBUG_MODE?: boolean

      // Logging
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error'

      [key: string]: string | undefined
    }
  }
}

export {}
