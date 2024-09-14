// utils/getTopAlbum.ts
import axios from "axios";
import { Artist } from "../types";

export const getTopArtist = async (spotifyAccessToken: string): Promise<Artist | null> => {
  try {
    // Fetch the access token from the API route

    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Make request to Spotify API for top artist
    const response = await axios.get("https://api.spotify.com/v1/me/top/artists?limit=1", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const fetchedArtist = response.data.items[0];

    // Estimate playcount based on artist's top tracks
    const topTracksResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${fetchedArtist.id}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    const totalPlaycount = topTracksResponse.data.tracks.reduce((sum: number, track: any) => sum + track.popularity, 0);

    return {
      name: fetchedArtist.name,
      playcount: totalPlaycount,
      imageURL: fetchedArtist.images[0].url,
      url: fetchedArtist.external_urls.spotify,
    };
  } catch (error) {
    console.error("Error fetching top album:", error);
    return null;
  }
};
