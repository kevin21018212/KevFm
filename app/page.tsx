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
    console.log("Fetching Spotify token...");
    setLoading(true);
    try {
      const tokenResponse = await axios.get("/api/getSpotifyToken");
      const { accessToken, expiresIn } = tokenResponse.data;

      if (!accessToken || !expiresIn) {
        throw new Error("Invalid token response from Spotify.");
      }

      setSpotifyAccessToken(accessToken);
      const expiryTime = Date.now() + expiresIn * 1000;
      setTokenExpiryTime(expiryTime);
      setError(null);
      console.log(`Spotify token fetched successfully. Expires in ${expiresIn} seconds.`);
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
    const refreshTime = tokenExpiryTime - currentTime - 60 * 1000; // 1 minute before expiry

    console.log(`Setting up token refresh in ${refreshTime / 1000} seconds.`);

    // If refreshTime is negative, token is about to expire or already expired
    if (refreshTime <= 0) {
      console.log("Token is about to expire or has expired. Fetching a new token now.");
      fetchSpotifyToken();
    } else {
      const timer = setTimeout(() => {
        console.log("Refreshing Spotify token...");
        fetchSpotifyToken();
      }, refreshTime);

      // Cleanup the timer on unmount or when expiryTime changes
      return () => {
        console.log("Clearing existing token refresh timer.");
        clearTimeout(timer);
      };
    }
  }, [tokenExpiryTime, fetchSpotifyToken]);

  if (error) {
    return <div className={styles.app}></div>;
  }

  if (loading && !spotifyAccessToken) {

    return <div className={styles.app}><div>;
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
