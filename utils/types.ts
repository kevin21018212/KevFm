import { DefaultSession, DefaultUser } from "next-auth";
export interface User {
  id: string;
  name: string;
  realname: string;
  url: string;
  image: string;
  country: string;
  age: number;
  gender: string;
  subscriber: boolean;
  playcount: number;
  playlists: number;
  registered: string;
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

export interface TrackTag {
  name: string;
  count: number;
  url: string;
}

export interface TrackInfo {
  name: string;
  artist: string;
  date?: number;
  tags: TrackTag[];
}

export interface UserTopTracksResponse {
  toptracks: {
    track: Array<{
      name: string;
      artist: { name: string };
      playcount: string;
      url: string;
    }>;
  };
}

export interface UserRecentTracksResponse {
  recenttracks: {
    track: Array<{
      name: string;
      artist: { "#text": string; name: string };
      url: string;
      date?: { uts: string; "#text": string };
      "@attr"?: { nowplaying: string };
    }>;
  };
}

export interface TrackTopTagsResponse {
  toptags: {
    tag: TrackTag[];
  };
}

export interface MoodData {
  current: string;
  day: string;
  week: string;
  month: string;
}
