import axios from "axios";
import { determineMood, moodColors } from "../determineMood";
import {
  TrackInfo,
  UserTopTracksResponse,
  UserRecentTracksResponse,
  TrackTag,
  MoodData,
  TrackTopTagsResponse,
} from "../types";
import { getServerSideProps } from "../getSSR";

// Fetch top tracks for a given period
const getTopTracks = async (
  userName: string,
  apiKey: string,
  period: "7day" | "1month",
  limit: number = 50
): Promise<TrackInfo[]> => {
  try {
    const response = await axios.get<UserTopTracksResponse>("http://ws.audioscrobbler.com/2.0/", {
      params: { method: "user.gettoptracks", user: userName, api_key: apiKey, format: "json", period, limit },
    });

    return (
      response.data.toptracks?.track.map((t) => ({
        name: t.name,
        artist: t.artist.name,
        tags: [],
      })) || []
    );
  } catch (error) {
    console.error(`Error fetching top tracks for period ${period}:`, error);
    return [];
  }
};

// Fetch recent tracks
const getRecentTracks = async (userName: string, apiKey: string, limit: number = 50): Promise<TrackInfo[]> => {
  try {
    const response = await axios.get<UserRecentTracksResponse>("http://ws.audioscrobbler.com/2.0/", {
      params: { method: "user.getrecenttracks", user: userName, api_key: apiKey, format: "json", limit },
    });

    return (
      response.data.recenttracks?.track.map((t) => ({
        name: t.name,
        artist: t.artist["#text"] || t.artist.name,
        tags: [],
        date: t.date ? parseInt(t.date.uts, 10) : undefined,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    return [];
  }
};

// Fetch top tags for a track
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

    // Check if the response contains toptags and tag array
    if (response.data.toptags && response.data.toptags.tag) {
      // Explicitly type the 'tag' as TrackTag
      return response.data.toptags.tag.map((tag: TrackTag) => ({
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

// Batch fetch and assign tags to tracks in parallel
const fetchAndAssignTags = async (userName: string, apiKey: string, tracks: TrackInfo[]): Promise<void> => {
  const fetchTagPromises = tracks.map((track) =>
    getTrackTopTags(userName, apiKey, track.name, track.artist).then((tags) => {
      track.tags = tags;
    })
  );

  await Promise.allSettled(fetchTagPromises); // Process all tag-fetching promises in parallel
};

// Aggregate tags from multiple tracks
const aggregateTags = (tracks: TrackInfo[]): { [tag: string]: number } => {
  return tracks.reduce((acc, track) => {
    track.tags.forEach((tag) => {
      acc[tag.name] = (acc[tag.name] || 0) + tag.count;
    });
    return acc;
  }, {} as { [tag: string]: number });
};

// Main function to get recent moods
export const getRecentMoods = async (): Promise<MoodData | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;

    if (!userName || !apiKey) {
      console.error("Missing userName or apiKey from server-side props.");
      return null;
    }

    // Fetch top tracks for the week and month in parallel
    const [topTracksWeek, topTracksMonth] = await Promise.all([
      getTopTracks(userName, apiKey, "7day", 50),
      getTopTracks(userName, apiKey, "1month", 50),
    ]);

    // Fetch recent tracks for current and day moods
    const recentTracks = await getRecentTracks(userName, apiKey, 50);

    // Filter today's tracks for day mood
    const startOfToday = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    const dayTracks = recentTracks.filter((track) => track.date && track.date >= startOfToday);
    const currentTracks = recentTracks.slice(0, 20); // Use the most recent 20 tracks for current mood

    // Aggregate all tracks
    const allTracks = { current: currentTracks, day: dayTracks, week: topTracksWeek, month: topTracksMonth };

    // Fetch and assign tags to all tracks in parallel
    await Promise.all([
      fetchAndAssignTags(userName, apiKey, allTracks.current),
      fetchAndAssignTags(userName, apiKey, allTracks.day),
      fetchAndAssignTags(userName, apiKey, allTracks.week),
      fetchAndAssignTags(userName, apiKey, allTracks.month),
    ]);

    // Aggregate tags for each timeframe
    const aggregatedTags = {
      current: aggregateTags(allTracks.current),
      day: aggregateTags(allTracks.day),
      week: aggregateTags(allTracks.week),
      month: aggregateTags(allTracks.month),
    };

    // Determine mood for each timeframe
    return {
      current: determineMood(aggregatedTags.current),
      day: determineMood(aggregatedTags.day),
      week: determineMood(aggregatedTags.week),
      month: determineMood(aggregatedTags.month),
    };
  } catch (error) {
    console.error("Error determining recent moods:", error);
    return null;
  }
};
