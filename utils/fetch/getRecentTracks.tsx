import axios from "axios";
import { Track } from "../types";

// Fetch recent tracks using the Spotify API
export const getRecentTracks = async (spotifyAccessToken: string): Promise<Track[] | null> => {
  try {
    // Fetch the Spotify access token from your API route (this needs to be set up separately)

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

    // Log the API response
    console.log("API Response for getRecentTracks:", response.data);

    // Extract track information from the response
    const tracks = response.data.items.map((item: any) => ({
      name: item.track.name,
      artist: item.track.artists[0].name, // Get the first artist's name
      url: item.track.external_urls.spotify, // Track URL on Spotify
      nowplaying: false, // Spotify's recently played endpoint doesn't return `nowplaying`, so set this to false
      playedAt: item.played_at, // When the track was played
    }));

    return tracks;
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    return null;
  }
};
