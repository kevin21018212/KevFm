// utils/getCurrentTrack.ts
import { getServerSideProps } from "./getSSR";
const albumArt = require("album-art");
import { average } from "color.js";

interface Track {
  name: string;
  artist: {
    "#text": string;
  };
  image: { "#text": string }[];
}

interface TrackData {
  name: string;
  artist: string;
  imageSrc: string;
  albumArtSrc: string;
  bgColor: string;
  bgColor2: string;
}

export const getCurrentTrack = async (): Promise<TrackData | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    const track: Track = data.recenttracks.track[0];


    
    const imageSrc = track.image[3]["#text"];
    const albumArtSrc = await albumArt(track.artist["#text"]);
    const bgColor = (await average(albumArtSrc, { format: "hex" })).toString();
    const bgColor2 = (await average(imageSrc, { format: "hex" })).toString();

    return {
      name: track.name,
      artist: track.artist["#text"],
      imageSrc,
      albumArtSrc,
      bgColor,
      bgColor2,
    };
  } catch (error) {
    console.error("Error fetching track data:", error);
    return null;
  }
};
