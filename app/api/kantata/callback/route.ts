import { NextRequest, NextResponse } from "next/server";
import { getToken, encode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { routes } from "@/lib/routes";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code from Kantata" },
      { status: 400 },
    );
  }

  const res = await fetch(process.env.KANTATA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.KANTATA_CLIENT_ID,
      client_secret: process.env.KANTATA_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_KANTATA_CALLBACK_URL,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Failed to exchange code for token:", data);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }

  const kantataAccessToken = data.access_token;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    const updatedToken = {
      ...token,
      kantataAccessToken,
    };

    const newSessionToken = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    (await cookies()).set(cookieName, newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return NextResponse.redirect(new URL(routes.hub, req.url));
}
