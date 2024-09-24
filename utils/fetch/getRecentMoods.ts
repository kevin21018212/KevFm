import axios from "axios";
import { AudioFeatures, determineMood } from "../determineMood";

interface RecentlyPlayedItem {
  track: {
    id: string;
    name: string;
    artists: { name: string; id: string }[];
    album: { images: { url: string }[] };
  };
  played_at: string;
}

export interface MoodData {
  fifteenMinutes: string;
  hour: string;
  day: string;
  week: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRecentMoods = async (spotifyAccessToken: string): Promise<MoodData | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = oneDayAgo;

    const processTracksWithFeatures = async (since: Date): Promise<string> => {
      const tracks = await fetchRecentlyPlayedTracks(spotifyAccessToken, since);

      if (tracks.length === 0) {
        return "Neutral";
      }

      const trackIds = Array.from(new Set(tracks.map((item) => item.track.id)));
      const audioFeaturesMap = await throttledFetchAudioFeatures(spotifyAccessToken, trackIds);

      const aggregatedFeatures: AudioFeatures = {
        danceability: 0,
        energy: 0,
        valence: 0,
        genres: [],
      };

      let count = 0;
      tracks.forEach((item) => {
        const features = audioFeaturesMap[item.track.id];
        if (features) {
          aggregatedFeatures.danceability += features.danceability;
          aggregatedFeatures.energy += features.energy;
          aggregatedFeatures.valence += features.valence;
          aggregatedFeatures.genres = Array.from(
            new Set([...(aggregatedFeatures.genres || []), ...(features.genres || [])])
          );
          count += 1;
        }
      });

      if (count === 0) {
        return "Neutral";
      }

      aggregatedFeatures.danceability /= count;
      aggregatedFeatures.energy /= count;
      aggregatedFeatures.valence /= count;

      return determineMood(aggregatedFeatures);
    };

    const [moodFifteenMinutes, moodHour, moodDay, moodWeek] = await Promise.all([
      processTracksWithFeatures(fifteenMinutesAgo),
      processTracksWithFeatures(oneHourAgo),
      processTracksWithFeatures(oneDayAgo),
      processTracksWithFeatures(oneWeekAgo),
    ]);

    return {
      fifteenMinutes: moodFifteenMinutes,
      hour: moodHour,
      day: moodDay,
      week: moodWeek,
    };
  } catch (error: any) {
    console.error("Error fetching recent moods:", error.message);
    return null;
  }
};

const fetchRecentlyPlayedTracks = async (spotifyAccessToken: string, since: Date): Promise<RecentlyPlayedItem[]> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
      headers: { Authorization: `Bearer ${spotifyAccessToken}` },
    });

    const items: RecentlyPlayedItem[] = response.data.items;
    const sinceUTC = new Date(since.getTime() + since.getTimezoneOffset() * 60000);

    return items.filter((item) => new Date(item.played_at).getTime() >= sinceUTC.getTime());
  } catch (error: any) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      console.warn(`Rate limit hit. Retrying after ${retryAfter} seconds.`);
      await delay(retryAfter * 1000);
      return fetchRecentlyPlayedTracks(spotifyAccessToken, since);
    } else {
      console.error("Error fetching recently played tracks:", error.message);
      return [];
    }
  }
};

const throttledFetchAudioFeatures = async (
  spotifyAccessToken: string,
  trackIds: string[]
): Promise<{ [trackId: string]: AudioFeatures }> => {
  const audioFeaturesMap: { [trackId: string]: AudioFeatures } = {};
  const chunkSize = 50;

  for (let i = 0; i < trackIds.length; i += chunkSize) {
    const chunk = trackIds.slice(i, i + chunkSize);
    try {
      const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${chunk.join(",")}`, {
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      });
      const audioFeaturesArray = response.data.audio_features;

      for (const features of audioFeaturesArray) {
        if (features) {
          audioFeaturesMap[features.id] = {
            danceability: features.danceability,
            energy: features.energy,
            valence: features.valence,
            genres: await fetchGenres(spotifyAccessToken, features.id),
          };
        }
      }
      await delay(1000); // Throttle requests
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        console.warn(`Rate limit hit. Retrying after ${retryAfter} seconds.`);
        await delay(retryAfter * 1000);
        i -= chunkSize; // Retry the same chunk
      } else {
        console.error("Error fetching audio features:", error.message);
      }
    }
  }

  return audioFeaturesMap;
};

const fetchGenres = async (spotifyAccessToken: string, trackId: string): Promise<string[]> => {
  try {
    // Fetch track details to get the artist ID
    const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const artistId = trackResponse.data.artists[0].id; // Get the first artist ID from the track

    // Fetch artist details to get genres
    const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    // Return the genres for the artist
    return artistResponse.data.genres || [];
  } catch (error: any) {
    console.error("Error fetching genres:", error.response ? error.response.data : error.message);
    return [];
  }
};
