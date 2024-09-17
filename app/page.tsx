"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import Body from "@/components/body";
import MoodDisplay from "@/components/mood";
import { Head } from "@/components/head";

const App: React.FC = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyToken = async () => {
    try {
      const tokenResponse = await axios.get("/api/getSpotifyToken");
      setSpotifyAccessToken(tokenResponse.data.accessToken);
    } catch (err) {
      console.error("Error fetching Spotify token:", err);
      setError("Failed to fetch Spotify token.");
    }
  };

  const refreshSpotifyToken = async () => {
    try {
      const refreshResponse = await axios.get("/api/refreshSpotifyToken");
      setSpotifyAccessToken(refreshResponse.data.accessToken);
    } catch (err) {
      console.error("Error refreshing Spotify token:", err);
      setError("Failed to refresh Spotify token.");
    }
  };

  useEffect(() => {
    fetchSpotifyToken();

    // Refresh the token every 55 minutes
    const refreshInterval = setInterval(async () => {
      await refreshSpotifyToken();
    }, 55 * 60 * 1000);

    return () => clearInterval(refreshInterval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (spotifyAccessToken) {
      // Check for token expiration on API calls (you might do this in other API calls)
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response && error.response.status === 401) {
            console.log("Access token expired, refreshing...");
            await refreshSpotifyToken();
          }
          return Promise.reject(error);
        }
      );
    }
  }, [spotifyAccessToken]);

  if (error) {
    return <div className={styles.error}>Error: {error || "No access token available."}</div>;
  }
  if (loading) {
    return <></>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.head}>
        <Head spotifyAccessToken={spotifyAccessToken} />
      </div>
      <MoodDisplay spotifyAccessToken={spotifyAccessToken} />
      <div className={styles.body}>
        <Body spotifyAccessToken={spotifyAccessToken || ""} />
      </div>
    </div>
  );
};

export default App;
