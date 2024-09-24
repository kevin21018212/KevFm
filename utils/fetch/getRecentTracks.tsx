import axios from "axios";
import { Track } from "../types";

// Fetch recent tracks using the Spotify API
export const getRecentTracks = async (spotifyAccessToken: string): Promise<Track[] | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Spotify API endpoint to get the user's recently played tracks
    const url = "https://api.spotify.com/v1/me/player/recently-played?limit=7";

    // Fetch recent tracks from Spotify API
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    // Extract track information from the response
    const tracks = response.data.items.map((item: any) => {
      // Parse the played_at timestamp into a Date object
      const playedAtDate = new Date(item.played_at);

      // Format the date as needed
      const formattedPlayedAt = playedAtDate.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return {
        name: item.track.name,
        artist: item.track.artists[0].name,
        url: item.track.external_urls.spotify,
        nowplaying: false,
        playedAt: formattedPlayedAt,
      };
    });

    return tracks;
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    return null;
  }
};
