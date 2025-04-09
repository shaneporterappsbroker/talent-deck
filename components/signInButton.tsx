"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export const SignInButton = () => (
  <Button
    className="z-20 px-4 py-3 text-lg font-semibold text-white mt-12 cursor-pointer"
    variant="ghost"
    onClick={() => {
      signIn("google", { callbackUrl: "/auth-redirect" });
    }}
  >
    Sign in with Google
  </Button>
);
