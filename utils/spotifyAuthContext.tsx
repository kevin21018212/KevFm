// context/SpotifyAuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

interface SpotifyAuthContextProps {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextProps>({
  accessToken: null,
  loading: true,
  error: null,
  setAccessToken: () => {},
});

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null); // Unix timestamp in ms
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpotifyToken = useCallback(async () => {
    console.log("Fetching Spotify token...");
    setLoading(true);
    try {
      const tokenResponse = await axios.get("/api/getSpotifyToken");
      const { accessToken, expiresIn } = tokenResponse.data;

      if (!accessToken || !expiresIn) {
        throw new Error("Invalid token response from Spotify.");
      }

      setAccessToken(accessToken);
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
    const refreshTime = tokenExpiryTime - currentTime - 5 * 60 * 1000; // 5 minutes before expiry

    console.log(`Setting up token refresh in ${refreshTime / 1000} seconds.`);

    if (refreshTime <= 0) {
      console.log("Token is about to expire or has expired. Fetching a new token now.");
      fetchSpotifyToken();
    } else {
      const timer = setTimeout(() => {
        console.log("Refreshing Spotify token...");
        fetchSpotifyToken();
      }, refreshTime);

      return () => {
        console.log("Clearing existing token refresh timer.");
        clearTimeout(timer);
      };
    }
  }, [tokenExpiryTime, fetchSpotifyToken]);

  return (
    <SpotifyAuthContext.Provider value={{ accessToken, loading, error, setAccessToken }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};
