import axios from "axios";
import { User } from "../types";

export const getUserInfo = async (spotifyAccessToken: string): Promise<User | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Fetch the user's information from Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const user = response.data;

    return {
      id: user.id,
      name: user.display_name || user.id, // Use display_name if available, fallback to id
      displayName: user.display_name || "N/A", // If no displayName is available
      profileURL: user.external_urls.spotify,
      image: user.images?.[0]?.url || "", // Get the first image or return empty string
      followers: user.followers.total || 0,
      country: user.country || "N/A",
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};
