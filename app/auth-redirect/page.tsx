"use client";

import { Loader } from "@/components/loader";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const redirectToKantata = async () => {
        const redirectUri = encodeURIComponent(
          process.env.NEXT_PUBLIC_KANTATA_CALLBACK_URL,
        );

        const state = encodeURIComponent(session.user?.email || "init");
        const url = `https://appsbroker.mavenlink.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KANTATA_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = url;
      };

      redirectToKantata();
    }
  }, [session?.user?.email, status]);

  return <Loader />;
}
