"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/head.module.scss"; // Ensure path matches your project structure
import { getCurrentTrack } from "@/utils/getCurrentTrack"; // Adjust import path as necessary

interface TrackData {
  name: string;
  artist: string;
  imageSrc: string;
  albumArtSrc: string;
  bgColor: string;
  bgColor2: string;
}

const Head: React.FC = () => {
  const [trackData, setTrackData] = useState<TrackData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCurrentTrack();
      if (data) {
        setTrackData(data);
        document.documentElement.style.setProperty("--bg", data.bgColor);
        document.documentElement.style.setProperty("--bg2", data.bgColor2);
      } else {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!trackData) return <></>;

  const { name, artist, imageSrc, albumArtSrc } = trackData;

  return (
    <div className={styles.layout}>
      <div className={styles.headerContent}>
        <h2>Right Now Kev is Bumpin</h2>

        <h1>{name}</h1>
      </div>

      <div className={styles.headerImage}>
        <div className={styles.headerImageStack}>
          <div className={styles.headerImageStackCover}>
            <img src={imageSrc} alt="Cover"></img>
          </div>
          <div className={styles.headerImageStackArtist}>
            <img id="coverid" src={albumArtSrc} alt="Cover"></img>
          </div>
          <div className={styles.headerImageStackStreams}>
            <p>{artist}</p>
          </div>
          <div className={styles.headerImageStackPlatform}></div>
        </div>
      </div>
    </div>
  );
};

export default Head;
