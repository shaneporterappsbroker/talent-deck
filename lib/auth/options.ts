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
          scope:
            "openid email profile https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
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
      }

      if (trigger === "update" && session?.kantataAccessToken) {
        token.kantataAccessToken = session.kantataAccessToken;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.kantataAccessToken = token.kantataAccessToken as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
