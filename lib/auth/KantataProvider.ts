import { OAuthConfig } from "next-auth/providers/oauth";

export interface KantataProfile {
  id: string;
  full_name: string;
  email_address: string;
  avatar_url?: string;
}

const KantataProvider = (
  options: Partial<OAuthConfig<KantataProfile>> = {},
): OAuthConfig<KantataProfile> => ({
  id: "kantata",
  name: "Kantata",
  type: "oauth",
  version: "2.0",
  scope: "read",
  authorization: {
    url: "https://api.mavenlink.com/oauth/authorize",
    params: {
      scope: "read",
      response_type: "code",
    },
  },
  token: "https://api.mavenlink.com/oauth/token",
  userinfo: {
    url: "https://api.mavenlink.com/api/v1/users/me.json",
    async request({ tokens }) {
      const res = await fetch(
        "https://api.mavenlink.com/api/v1/users/me.json",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      );

      const data = await res.json();

      // Kantata returns user data nested under a user ID key
      const userId = Object.keys(data.results)[0];
      const user = data.results[userId];

      return {
        id: user.id,
        full_name: user.full_name,
        email_address: user.email_address,
        avatar_url: user.avatar_url,
      };
    },
  },
  profile(profile: KantataProfile) {
    return {
      id: profile.id,
      name: profile.full_name,
      email: profile.email_address,
      image: profile.avatar_url,
    };
  },
  ...options,
});

export default KantataProvider;
