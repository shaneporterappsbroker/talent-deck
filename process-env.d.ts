namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_KANTATA_CALLBACK_URL: string;
    NEXT_PUBLIC_KANTATA_CLIENT_ID: string;

    KANTATA_TOKEN_URL: string;
    KANTATA_CLIENT_SECRET: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;

    KANTATA_API_BASE_URL: string;

    GEMINI_API_KEY: string;
    GEMINI_MODEL: string;
    GEMINI_LOG_PROMPT: string;

    SOURCE_PRESENTATION_ID: string;
    SOURCE_SLIDE_ID: string;

    ALLOWED_LOGIN_DOMAIN: string;
  }
}
