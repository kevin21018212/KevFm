// services/lastfm.ts
import axios from "axios";
import { User } from "../types";
import { getServerSideProps } from "../getSSR";

export const getUserInfo = async (): Promise<User | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;
    if (!apiKey || !userName) {
      console.error("Missing Last.fm API key or username in environment variables.");
      return null;
    }

    const url = `https://ws.audioscrobbler.com/2.0/`;
    const params = {
      method: "user.getinfo",
      user: userName,
      api_key: apiKey,
      format: "json",
    };

    const response = await axios.get(url, { params });

    // Log the API response for debugging
    console.log("API Response for getUserInfo:", response.data);

    const user = response.data.user;

    return {
      id: user.id,
      name: user.name,
      realname: user.realname || "N/A",
      url: user.url,
      image: user.image?.find((img: any) => img.size === "medium")?.["#text"] || "",
      country: user.country || "N/A",
      age: user.age || 0, // Ensure to handle cases where age might not be provided
      gender: user.gender || "N/A",
      subscriber: user.subscriber === "1",
      playcount: parseInt(user.playcount, 10) || 0,
      playlists: parseInt(user.playlists, 10) || 0,
      registered: new Date(parseInt(user.registered.unixtime, 10) * 1000).toDateString(),
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching user info from Last.fm:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return null;
  }
};
