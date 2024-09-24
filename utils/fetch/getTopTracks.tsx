import axios from "axios";
import { getServerSideProps } from "../getSSR";
import { Track } from "../types";
const albumArt = require("album-art");
export const getTopTracks = async (): Promise<Track[] | null> => {
  try {
    // Retrieve userName and apiKey from server-side props
    const { userName, apiKey }: any = (await getServerSideProps()).props;

    if (!apiKey || !userName) {
      console.error("Missing Last.fm API key or username in environment variables.");
      return null;
    }

    const url = `https://ws.audioscrobbler.com/2.0/`;
    const params = {
      method: "user.gettoptracks",
      user: userName,
      api_key: apiKey,
      format: "json",
      period: "7day", // Set the period to 7 days (1 week)
      limit: 3, // Fetch the top 3 tracks
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    // Log the API response for debugging
    console.log("API Response for getTopTracks:", data);

    if (!data.toptracks || !data.toptracks.track) {
      console.log("No top tracks found.");
      return null;
    }

    const tracks: Track[] = await Promise.all(
      data.toptracks.track.map(async (track: any) => {
        // Fetch the image URL using the albumArt helper
        const imageURL = await albumArt(track.artist.name, { size: "large" });

        return {
          name: track.name,
          playcount: parseInt(track.playcount, 10) || 0,
          imageURL,
          url: track.url, // Last.fm URL for the track
          artistName: track.artist.name,
        };
      })
    );

    return tracks;
  } catch (error: any) {
    console.error("Unexpected error:", error);

    return null;
  }
};
