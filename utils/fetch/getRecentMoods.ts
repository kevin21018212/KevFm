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
  fifteenMinutes: string; // Added for 15-minute mood
  hour: string;
  day: string;
  week: string;
}

export const getRecentMoods = async (spotifyAccessToken: string): Promise<MoodData | null> => {
  try {
    // Fetch the Spotify access token from your API route

    if (!spotifyAccessToken) {
      console.error("No access token available.");
      return null;
    }

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago

    const processTracksWithFeatures = async (since: Date): Promise<string> => {
      const tracks = await fetchRecentlyPlayedTracks(spotifyAccessToken, since);

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

    // Process moods for all time frames, including 15 minutes
    const [moodFifteenMinutes, moodHour, moodDay, moodWeek] = await Promise.all([
      processTracksWithFeatures(fifteenMinutesAgo),
      processTracksWithFeatures(oneHourAgo),
      processTracksWithFeatures(oneDayAgo),
      processTracksWithFeatures(oneWeekAgo),
    ]);

    return {
      fifteenMinutes: moodFifteenMinutes, // Include 15-minute mood
      hour: moodHour,
      day: moodDay,
      week: moodWeek,
    };
  } catch (error) {
    console.error("Error fetching recent moods:", error);
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

    const filteredItems = items.filter((item) => {
      const playedAt = new Date(item.played_at);
      return playedAt >= since;
    });

    return filteredItems;
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return [];
  }
};

const fetchAudioFeatures = async (
  spotifyAccessToken: string,
  trackIds: string[]
): Promise<{ [trackId: string]: AudioFeatures }> => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });

    const audioFeaturesArray: any[] = response.data.audio_features;
    const audioFeaturesMap: { [trackId: string]: AudioFeatures } = {};

    audioFeaturesArray.forEach((features) => {
      if (features) {
        audioFeaturesMap[features.id] = {
          danceability: features.danceability,
          energy: features.energy,
          valence: features.valence,
        };
      }
    });

    return audioFeaturesMap;
  } catch (error) {
    console.error("Error fetching audio features:", error);
    return {};
  }
};
