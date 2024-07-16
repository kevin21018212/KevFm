import axios from "axios";
import { getServerSideProps } from "./getSSR";

export const getRecentTracks = async (): Promise<Track[] | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${userName}&api_key=${apiKey}&limit=6&format=json`;

    const response = await axios.get(url);

    // Log the API response
    console.log("API Response for getRecentTracks:", response.data);

    const tracks = response.data.recenttracks.track.map((track: any) => ({
      name: track.name,
      artist: track.artist["#text"],
      url: track.url,
      nowplaying: track["@attr"]?.nowplaying === "true",
      date: track.date?.["#text"],
    }));

    return tracks;
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    return null;
  }
};
