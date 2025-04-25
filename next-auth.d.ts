/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    kantataAccessToken?: string;
    accessToken?: string;
  }

  interface JWT {
    kantataAccessToken?: string;
    accessToken?: string;
  }
}
