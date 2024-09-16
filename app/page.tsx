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

  useEffect(() => {
    const fetchSpotifyToken = async () => {
      try {
        const tokenResponse = await axios.get("/api/getSpotifyToken");
        setSpotifyAccessToken(tokenResponse.data.accessToken);

        // Refresh the token every 55 minutes (tokens expire in 60 minutes)
        const refreshInterval = setInterval(async () => {
          const tokenResponse = await axios.get("/api/getSpotifyToken");
          setSpotifyAccessToken(tokenResponse.data.accessToken);
        }, 55 * 60 * 1000);

        return () => clearInterval(refreshInterval); // Clean up the interval on unmount
      } catch (err) {
        console.error("Error fetching Spotify token:", err);
        setError("Failed to fetch Spotify token.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyToken();
  }, []);

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
