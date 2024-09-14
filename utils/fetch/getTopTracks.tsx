import axios from "axios";
import { Track } from "../types";

export const getTopTracks = async (spotifyAccessToken: string): Promise<Track[] | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Fetch top tracks from Spotify API
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=short_term", // Get top 3 tracks (short_term for last 4 weeks)
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    // Log the API response

    // Extract the top 3 track information
    const tracks: Track[] = response.data.items.map((track: any) => ({
      name: track.name, // Track name
      artist: { name: track.artists[0].name }, // First artist's name
      imageURL: track.album.images[0].url, // Album image (first image is usually the largest)
      url: track.external_urls.spotify, // Spotify track URL
      nowPlaying: false, // Set nowPlaying to false for top tracks
    }));

    return tracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return null;
  }
};
