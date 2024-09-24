// utils/getTopArtist.ts

import axios from "axios";
import { Artist } from "../types";
import { getServerSideProps } from "../getSSR";
const albumArt = require("album-art");

export const getTopArtist = async (): Promise<Artist | null> => {
  try {
    // Retrieve userName and apiKey from server-side props
    const { userName, apiKey }: any = (await getServerSideProps()).props;

    if (!apiKey || !userName) {
      console.error("Missing Last.fm API key or username in environment variables.");
      return null;
    }

    const url = `https://ws.audioscrobbler.com/2.0/`;
    const params = {
      method: "user.gettopartists",
      user: userName,
      api_key: apiKey,
      format: "json",
      period: "1month", // Set the period to 1 month
      limit: 1, // Fetch only the top artist
    };

    const response = await axios.get(url, { params });

    // Log the API response for debugging
    console.log("API Response for getTopArtist:", response.data);

    const topArtists = response.data.topartists?.artist;

    if (!topArtists || topArtists.length === 0) {
      console.log("No top artists found.");
      return null;
    }

    const fetchedArtist = topArtists[0];

    // Use the albumArt helper to get the image URL
    const imageURL = await albumArt(fetchedArtist.name, { size: "large" });

    return {
      name: fetchedArtist.name,
      playcount: parseInt(fetchedArtist.playcount, 10) || 0,
      imageURL: imageURL,
      url: fetchedArtist.url,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching top artist from Last.fm:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};
