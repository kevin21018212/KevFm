"use client";

import React from "react";
import { SpotifyAuthProvider } from "./spotifyAuthContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <SpotifyAuthProvider>{children}</SpotifyAuthProvider>;
};

export default Providers;
