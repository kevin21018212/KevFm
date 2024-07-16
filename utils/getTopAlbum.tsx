// utils/getTopAlbum.ts
import axios from "axios";
import { getServerSideProps } from "./getSSR";
const albumArt = require("album-art");

interface Artist {
  name: string;
  playcount: number;
  imageURL: string;
}

export const getTopAlbum = async (): Promise<Artist | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userName}&api_key=${apiKey}&limit=1&format=json`;
    const response = await axios.get(url);
    const fetchedArtist = response.data.topartists.artist[0];

    const imageURL = await albumArt(fetchedArtist.name, { size: "large" });

    return {
      name: fetchedArtist.name,
      playcount: fetchedArtist.playcount,
      imageURL,
    };
  } catch (error) {
    console.error("Error fetching top album:", error);
    return null;
  }
};
