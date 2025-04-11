import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
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
      session,
    }: {
      token: JWT;
      trigger?: "signUp" | "signIn" | "update";
      session?: Session;
    }) {
      if (trigger === "update" && session?.kantataAccessToken) {
        token.kantataAccessToken = session.kantataAccessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.kantataAccessToken = token.kantataAccessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
