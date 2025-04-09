"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  console.log(session?.kantataAccessToken);

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <>
        <button className="z-20" onClick={() => signOut()}>
          Sign out
        </button>
        <div>
          <p>
            Signed in as {session.user?.email} / {JSON.stringify(session)}
          </p>
          <pre className="break-words break-all w-full"></pre>
        </div>
      </>
    );
  }

  return (
    <button
      className="z-20"
      onClick={() => {
        console.log("clicked it!");
        signIn("google", { callbackUrl: "/auth-redirect" });
      }}
    >
      Sign in with Google
    </button>
  );
}
