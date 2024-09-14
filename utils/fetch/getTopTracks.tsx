import axios from "axios";
import { Track } from "../types";

export const getTopTracks = async (spotifyAccessToken: string): Promise<Track[] | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Fetch top tracks from Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=short_term", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    if (response.status !== 200 || !response.data.items) {
      console.error("Invalid response from Spotify API", response);
      return null;
    }

    // Extract the top 3 track information
    const tracks: Track[] = response.data.items
      .map((track: any) => {
        if (!track.name || !track.artists || !track.album) {
          console.error("Missing track information", track);
          return null;
        }

        return {
          name: track.name,
          artist: { name: track.artists[0].name },
          imageURL: track.album.images[0].url,
          url: track.external_urls.spotify, // Spotify track URL
          nowPlaying: false,
        };
      })
      .filter((track: Track | null) => track !== null);
    return tracks.length > 0 ? tracks : null;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return null;
  }
};
