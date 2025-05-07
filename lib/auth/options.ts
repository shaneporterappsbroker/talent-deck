import { Account, AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hd: process.env.ALLOWED_LOGIN_DOMAIN,
          scope:
            "openid email profile https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowedDomain = process.env.ALLOWED_LOGIN_DOMAIN;
      const emailDomain = profile?.email?.split("@")[1];

      console.log("Allowed domain check on login:", {
        allowedDomain,
        emailDomain,
      });

      return emailDomain === allowedDomain;
    },
    async jwt({
      token,
      trigger,
      account,
      session,
    }: {
      token: JWT;
      trigger?: "signUp" | "signIn" | "update";
      account?: Account | null;
      session?: Session;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at! * 1000;
      }

      if (trigger === "update" && session?.kantataAccessToken) {
        token.kantataAccessToken = session.kantataAccessToken;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.kantataAccessToken = token.kantataAccessToken as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      });

    const res = await fetch(url, { method: "POST" });
    const refreshedTokens = await res.json();

    if (!res.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Keep old one if not returned
    };
  } catch (error) {
    console.error("Failed to refresh access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};
