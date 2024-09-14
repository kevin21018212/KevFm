import axios from "axios";
import { average } from "color.js";

interface TrackData {
  name: string;
  artist: string;
  imageSrc: string;
  albumArtSrc: string;
  bgColor: string;
  bgColor2: string;
}

// Helper function to get the most recently played track
const getRecentlyPlayedTrack = async (spotifyAccessToken: string): Promise<TrackData | null> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const data = response.data;

    if (!data || !data.items || data.items.length === 0) {
      console.log("No recently played tracks available.");
      return null;
    }

    const track = data.items[0].track;
    const artistName = track.artists[0].name;
    const trackName = track.name;
    const albumArtSrc = track.album.images[0].url;
    const imageSrc = track.album.images[1]?.url || albumArtSrc;

    const bgColor = (await average(albumArtSrc, { format: "hex" })).toString();
    const bgColor2 = (await average(imageSrc, { format: "hex" })).toString();

    return {
      name: trackName,
      artist: artistName,
      imageSrc,
      albumArtSrc,
      bgColor,
      bgColor2,
    };
  } catch (error) {
    console.error("Error fetching recently played track:", error);
    return null;
  }
};

export const getCurrentTrack = async (spotifyAccessToken: string): Promise<TrackData | null> => {
  try {

 

    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    // Fetch currently playing track from Spotify API
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const data = response.data;

    // If there's no currently playing track, fetch the most recently played track
    if (!data || !data.item) {
      console.log("No track is currently playing. Fetching the most recently played track...");
      return await getRecentlyPlayedTrack(spotifyAccessToken);
    }

    const track = data.item;
    const artistName = track.artists[0].name;
    const trackName = track.name;
    const albumArtSrc = track.album.images[0].url;
    const imageSrc = track.album.images[1]?.url || albumArtSrc;

    // Calculate average colors from album art and image
    const bgColor = (await average(albumArtSrc, { format: "hex" })).toString();
    const bgColor2 = (await average(imageSrc, { format: "hex" })).toString();

    return {
      name: trackName,
      artist: artistName,
      imageSrc,
      albumArtSrc,
      bgColor,
      bgColor2,
    };
  } catch (error) {
    console.error("Error fetching current track data:", error);
    return null;
  }
};
