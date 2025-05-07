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

    ALLOWED_LOGIN_DOMAIN: string;
  }
}
