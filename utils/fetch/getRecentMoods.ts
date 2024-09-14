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

export const getRecentMoods = async (spotifyAccessToken: string): Promise<MoodData | null> => {
  try {
    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    const now = new Date();

    // Time frames adjusted for Spotify API limitations (last 24 hours)
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = oneDayAgo; // Since Spotify's API only provides data for the last 24 hours

    const processTracksWithFeatures = async (since: Date): Promise<string> => {
      const tracks = await fetchRecentlyPlayedTracks(spotifyAccessToken, since);
      console.log(`Tracks since ${since.toISOString()}: ${tracks.length}`);

      if (tracks.length === 0) {
        return "Neutral";
      }

      const trackIds = Array.from(new Set(tracks.map((item) => item.track.id)));

      const audioFeaturesMap = await fetchAudioFeatures(spotifyAccessToken, trackIds);

      const aggregatedFeatures: AudioFeatures = {
        danceability: 0,
        energy: 0,
        valence: 0,
      };

      let count = 0;

      tracks.forEach((item) => {
        const features = audioFeaturesMap[item.track.id];
        if (features) {
          aggregatedFeatures.danceability += features.danceability;
          aggregatedFeatures.energy += features.energy;
          aggregatedFeatures.valence += features.valence;
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

    // Process moods for all time frames
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
    console.error("Error fetching recent moods:", error.response ? error.response.data : error.message);
    return null;
  }
};

const fetchRecentlyPlayedTracks = async (spotifyAccessToken: string, since: Date): Promise<RecentlyPlayedItem[]> => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const items: RecentlyPlayedItem[] = response.data.items;

    // Convert 'since' to UTC for accurate comparison
    const sinceUTC = new Date(since.getTime() + since.getTimezoneOffset() * 60000);

    const filteredItems = items.filter((item) => {
      const playedAt = new Date(item.played_at); // This is in UTC
      return playedAt.getTime() >= sinceUTC.getTime();
    });

    console.log(`Filtered ${filteredItems.length} tracks since ${sinceUTC.toISOString()}`);

    return filteredItems;
  } catch (error: any) {
    console.error("Error fetching recently played tracks:", error.response ? error.response.data : error.message);
    return [];
  }
};

const fetchAudioFeatures = async (
  spotifyAccessToken: string,
  trackIds: string[]
): Promise<{ [trackId: string]: AudioFeatures }> => {
  try {
    if (trackIds.length === 0) {
      return {};
    }

    // Split trackIds into chunks of 100 (API limit per request)
    const chunkSize = 100;
    const chunks = [];
    for (let i = 0; i < trackIds.length; i += chunkSize) {
      chunks.push(trackIds.slice(i, i + chunkSize));
    }

    const audioFeaturesMap: { [trackId: string]: AudioFeatures } = {};

    for (const chunk of chunks) {
      const response = await axios.get(`https://api.spotify.com/v1/audio-features`, {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
        params: {
          ids: chunk.join(","),
        },
      });

      const audioFeaturesArray: any[] = response.data.audio_features;

      audioFeaturesArray.forEach((features) => {
        if (features) {
          audioFeaturesMap[features.id] = {
            danceability: features.danceability,
            energy: features.energy,
            valence: features.valence,
          };
        }
      });
    }

    return audioFeaturesMap;
  } catch (error: any) {
    console.error("Error fetching audio features:", error.response ? error.response.data : error.message);
    return {};
  }
};
