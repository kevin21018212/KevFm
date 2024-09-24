// getRecentMoods.ts

import axios from "axios";
import { determineMood, moodColors } from "../determineMood";
import {
  TrackInfo,
  UserTopTracksResponse,
  UserRecentTracksResponse,
  TrackTag,
  TrackTopTagsResponse,
  MoodData,
} from "../types";
import { getServerSideProps } from "../getSSR";

const getTopTracks = async (
  userName: string,
  apiKey: string,
  period: "7day" | "1month",
  limit: number = 50
): Promise<TrackInfo[]> => {
  try {
    const response = await axios.get<UserTopTracksResponse>("http://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "user.gettoptracks",
        user: userName,
        api_key: apiKey,
        format: "json",
        period,
        limit,
      },
    });

    // Check if the response contains toptracks
    if (!response.data.toptracks || !response.data.toptracks.track) {
      console.warn(`No top tracks found for period ${period}.`);
      return [];
    }

    const tracks: TrackInfo[] = response.data.toptracks.track.map((t) => ({
      name: t.name,
      artist: t.artist.name,
      tags: [], // To be populated later
    }));

    return tracks;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching top tracks for period ${period}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching top tracks for period ${period}:`, error);
    }
    return [];
  }
};

const getRecentTracks = async (userName: string, apiKey: string, limit: number = 50): Promise<TrackInfo[]> => {
  try {
    const response = await axios.get<UserRecentTracksResponse>("http://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "user.getrecenttracks",
        user: userName,
        api_key: apiKey,
        format: "json",
        limit,
      },
    });

    // Check if the response contains recenttracks
    if (!response.data.recenttracks || !response.data.recenttracks.track) {
      console.warn("No recent tracks found.");
      return [];
    }

    const tracks: TrackInfo[] = response.data.recenttracks.track.map((t) => ({
      name: t.name,
      artist: t.artist["#text"] || t.artist.name,
      tags: [],
      date: t.date ? parseInt(t.date.uts, 10) : undefined, // UNIX timestamp
    }));

    return tracks;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching recent tracks:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error fetching recent tracks:", error);
    }
    return [];
  }
};

const getTrackTopTags = async (
  userName: string,
  apiKey: string,
  trackName: string,
  artistName: string
): Promise<TrackTag[]> => {
  try {
    const response = await axios.get<TrackTopTagsResponse>("http://ws.audioscrobbler.com/2.0/", {
      params: {
        method: "track.gettoptags",
        artist: artistName,
        track: trackName,
        api_key: apiKey,
        format: "json",
      },
    });

    // Check if the response contains toptags
    if (response.data.toptags && response.data.toptags.tag) {
      return response.data.toptags.tag.map((tag) => ({
        name: tag.name.toLowerCase(),
        count: tag.count,
        url: tag.url,
      }));
    }

    return [];
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching tags for ${artistName} - ${trackName}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error fetching tags for ${artistName} - ${trackName}:`, error);
    }
    return [];
  }
};

/**
 * Aggregates tags from multiple tracks.
 * @param tracks - An array of TrackInfo objects.
 * @returns An object mapping tag names to their aggregated counts.
 */
const aggregateTags = (tracks: TrackInfo[]): { [tag: string]: number } => {
  const tagCounts: { [tag: string]: number } = {};

  tracks.forEach((track) => {
    track.tags.forEach((tag) => {
      const tagName = tag.name.toLowerCase();
      if (tagCounts[tagName]) {
        tagCounts[tagName] += tag.count;
      } else {
        tagCounts[tagName] = tag.count;
      }
    });
  });

  return tagCounts;
};

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAndAssignTags = async (userName: string, apiKey: string, tracks: TrackInfo[]): Promise<void> => {
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    track.tags = await getTrackTopTags(userName, apiKey, track.name, track.artist);
    // Respect rate limiting: Last.fm allows ~5 requests per second
    await delay(200); // 5 requests per second
  }
};

export const getRecentMoods = async (): Promise<MoodData | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;

    if (!userName || !apiKey) {
      console.error("Missing userName or apiKey from server-side props.");
      return null;
    }

    // Fetch top tracks for the week and month
    const [topTracksWeek, topTracksMonth] = await Promise.all([
      getTopTracks(userName, apiKey, "7day", 50),
      getTopTracks(userName, apiKey, "1month", 50),
    ]);

    // Fetch recent tracks for current and day moods
    const recentTracks = await getRecentTracks(userName, apiKey, 50);

    // Define timeframes
    const now = new Date();
    const startOfToday = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000); // UNIX timestamp

    // Filter recent tracks listened to today for day mood
    const dayTracks: TrackInfo[] = recentTracks.filter((track) => {
      if (!track.date) return false; // Exclude if date is undefined
      return track.date >= startOfToday;
    });

    // For current mood, consider the most recent 20 tracks
    const currentTracks: TrackInfo[] = recentTracks.slice(0, 20);

    // Combine all tracks
    const allTracks: {
      current: TrackInfo[];
      day: TrackInfo[];
      week: TrackInfo[];
      month: TrackInfo[];
    } = {
      current: currentTracks,
      day: dayTracks,
      week: topTracksWeek,
      month: topTracksMonth,
    };

    // Log aggregated tracks for debugging
    console.log("All Tracks:", allTracks);

    // Fetch and assign tags to all track categories in parallel
    await Promise.all([
      fetchAndAssignTags(userName, apiKey, allTracks.current),
      fetchAndAssignTags(userName, apiKey, allTracks.day),
      fetchAndAssignTags(userName, apiKey, allTracks.week),
      fetchAndAssignTags(userName, apiKey, allTracks.month),
    ]);

    // Aggregate tags for each category
    const aggregatedTags = {
      current: aggregateTags(allTracks.current) || {},
      day: aggregateTags(allTracks.day) || {},
      week: aggregateTags(allTracks.week) || {},
      month: aggregateTags(allTracks.month) || {},
    };

    // Log aggregated tags for debugging
    console.log("Aggregated Tags:", aggregatedTags);

    // Determine mood for each category
    const moodData: MoodData = {
      current: determineMood(aggregatedTags.current),
      day: determineMood(aggregatedTags.day),
      week: determineMood(aggregatedTags.week),
      month: determineMood(aggregatedTags.month),
    };

    console.log("Mood Data:", moodData);

    return moodData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error determining recent moods:", error.message);
    } else {
      console.error("Unknown error determining recent moods.");
    }
    return null;
  }
};
