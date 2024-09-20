// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

// Define the required scopes
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

// Configure NextAuth options
const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${encodeURIComponent(scopes)}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        if (account.expires_at) {
          token.expiresAt = account.expires_at * 1000; // Convert to milliseconds
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.expiresAt = token.expiresAt as number;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Initialize NextAuth with the defined options
const handler = NextAuth(authOptions);

// Export only the handler functions
export { handler as GET, handler as POST };
