import { getServerSideProps } from "./getSSR";
const albumArt = require("album-art");

interface Track {
  name: string;
  artist: { name: string };
  imageURL: string;
}

export const getTopTracks = async (): Promise<Track[] | null> => {
  try {
    const { userName, apiKey } = (await getServerSideProps()).props;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}&limit=3&period=1day&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    // Log the API response
    console.log("API Response for getTopTracks:", data);

    const tracks = await Promise.all(
      data.toptracks.track.map(async (track: any) => {
        const imageURL = await albumArt(track.artist.name, {
          album: track.name,
        });
        return {
          ...track,
          imageURL,
          url: track.url, // New field
        };
      })
    );

    return tracks;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return null;
  }
};
