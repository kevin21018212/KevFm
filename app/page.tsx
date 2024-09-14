"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import Body from "@/components/body";
import HeadComponent from "@/components/head";
import MoodDisplay from "@/components/mood";

const App: React.FC = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpotifyToken = async () => {
      try {
        const tokenResponse = await axios.get("/api/getSpotifyToken");
        setSpotifyAccessToken(tokenResponse.data.accessToken);
      } catch (err) {
        console.error("Error fetching Spotify token:", err);
        setError("Failed to fetch Spotify token.");
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyToken();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !spotifyAccessToken) {
    return <div className={styles.error}>Error: {error || "No access token available."}</div>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.head}>
        <HeadComponent spotifyAccessToken={spotifyAccessToken} />
      </div>
      <MoodDisplay spotifyAccessToken={spotifyAccessToken} />
      <div className={styles.body}>
        <Body spotifyAccessToken={spotifyAccessToken} />
      </div>
    </div>
  );
};

export default App;
