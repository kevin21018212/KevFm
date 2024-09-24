// services/lastfm.ts

import axios from "axios";
import { Track } from "../types";
import { getUserInfo } from "./getUserInfo";
import { getServerSideProps } from "../getSSR";

/**
 * Fetches a list of recent tracks listened to by the user.
 */
export const getRecentTracks = async (limit: number = 7): Promise<Track[] | null> => {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      console.error("Failed to retrieve user info.");
      return null;
    }

    const { userName, apiKey }: any = (await getServerSideProps()).props;
    if (!apiKey || !userName) {
      console.error("Missing Last.fm API key or username in environment variables.");
      return null;
    }

    const url = `https://ws.audioscrobbler.com/2.0/`;
    const params = {
      method: "user.getrecenttracks",
      user: userName,
      api_key: apiKey,
      format: "json",
      limit,
    };

    const response = await axios.get(url, { params });
    const tracks = response.data.recenttracks?.track;

    if (!tracks || tracks.length === 0) {
      console.log("No recently played tracks available.");
      return null;
    }

    // Map Last.fm tracks to your Track interface
    const formattedTracks: Track[] = tracks.map((track: any) => {
      const isNowPlaying = track["@attr"]?.nowplaying === "true";
      const artistName = track.artist["#text"] || "Unknown Artist";
      const trackName = track.name || "Unknown Track";
      const trackUrl = track.url || "";
      const playedAt = track.date ? track.date["#text"] : undefined;

      return {
        name: trackName,
        artist: artistName,
        url: trackUrl,
        nowplaying: isNowPlaying,
        playedAt: isNowPlaying ? undefined : playedAt, // Currently playing track may not have 'playedAt'
      };
    });

    return formattedTracks;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching recent tracks from Last.fm:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};
