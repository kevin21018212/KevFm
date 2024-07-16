"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/head.module.scss"; // Ensure path matches your project structure
import { getCurrentTrack } from "@/utils/getCurrentTrack"; // Adjust import path as necessary
import {
  containerVariants,
  textVariants,
  h1Variants,
  bounceVariants,
} from "@/utils/animations";


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
    <motion.div
      className={styles.layout}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.headerContent}>
        <motion.h2 variants={textVariants}>Right Now Kev is Bumpin</motion.h2>
        <motion.h1 variants={h1Variants}>{name}</motion.h1>
      </motion.div>

      <motion.div className={styles.headerImage}>
        <div className={styles.headerImageStack}>
          <motion.div
            className={styles.headerImageStackCover}
            whileHover="hover"
            variants={bounceVariants(0.4)}
            initial="hidden"
            animate="visible"
          >
            <img src={imageSrc} alt="Cover" />
          </motion.div>
          <motion.div
            className={styles.headerImageStackArtist}
            whileHover="hover"
            variants={bounceVariants(0.5)}
            initial="hidden"
            animate="visible"
          >
            <img id="coverid" src={albumArtSrc} alt="Cover" />
          </motion.div>
          <motion.div
            className={styles.headerImageStackStreams}
            variants={bounceVariants(0.8)}
            initial="hidden"
            animate="visible"
          >
            <p>{artist}</p>
          </motion.div>
          <motion.div
            className={styles.headerImageStackPlatform}
            variants={bounceVariants(0.6)}
            initial="hidden"
            animate="visible"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Head;
