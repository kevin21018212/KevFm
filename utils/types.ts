import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
export interface User {
  id: string;
  name: string;
  displayName: string;
  profileURL: string;
  image: string;
  followers: number;
  country: string | null;
}
export interface Artist {
  name: string;
  playcount: number;
  imageURL: string;
  url: string;
}

export interface Track {
  name: string;
  artist: string;
  imageURL: string;
  url: string;
  playedAt?: string;
  nowplaying?: boolean;
}
export interface TrackData {
  name: string;
  artist: string;
  imageSrc: string;
  albumArtSrc: string;
  bgColor: string;
  bgColor2: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
