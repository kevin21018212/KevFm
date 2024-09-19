// components/App.tsx

"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styles from "./page.module.css";
import Body from "@/components/body";
import MoodDisplay from "@/components/mood";
import { Head } from "@/components/head";

const App: React.FC = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null);
  const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null); // Unix timestamp in ms
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the Spotify token
  const fetchSpotifyToken = useCallback(async () => {
    setLoading(true);
    try {
      const tokenResponse = await axios.get("/api/getSpotifyToken");
      const { accessToken, expiresIn } = tokenResponse.data;

      if (!accessToken || !expiresIn) {
        throw new Error("Invalid token response from Spotify.");
      }

      setSpotifyAccessToken(accessToken);
      const expiryTime = Date.now() + expiresIn * 1000; // Current time + expiresIn seconds
      setTokenExpiryTime(expiryTime);
      setError(null);
      console.log("Spotify token fetched successfully.");
    } catch (err: any) {
      console.error("Error fetching Spotify token:", err);
      setError("Failed to fetch Spotify token.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial token fetch on component mount
  useEffect(() => {
    fetchSpotifyToken();
  }, [fetchSpotifyToken]);

  // Setup a timer to refresh the token before it expires
  useEffect(() => {
    if (!tokenExpiryTime) return;

    const currentTime = Date.now();
    const refreshTime = tokenExpiryTime - currentTime - 5 * 60 * 1000; // 5 minutes before expiry

    // If refreshTime is negative, token is about to expire or already expired
    if (refreshTime <= 0) {
      fetchSpotifyToken();
    } else {
      const timer = setTimeout(() => {
        fetchSpotifyToken();
      }, refreshTime);

      // Cleanup the timer on unmount or when expiryTime changes
      return () => clearTimeout(timer);
    }
  }, [tokenExpiryTime, fetchSpotifyToken]);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (loading && !spotifyAccessToken) {
    // Optionally, display a loader or placeholder
    return <div className={styles.loading}>Loading...</div>;
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
