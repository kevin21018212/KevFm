"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/head.module.scss";
import { containerVariants, textVariants, h1Variants, bounceVariants, slideDownVariants } from "@/utils/animations";
import { getCurrentTrack } from "@/utils/fetch/getCurrentTrack";
import { TrackData } from "@/utils/types";

export const Head = () => {
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
  if (!trackData)
    return (
      <motion.div
        className={styles.layout}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      ></motion.div>
    );

  const { name, artist, imageSrc, albumArtSrc } = trackData;

  return (
    <motion.div className={styles.layout} variants={containerVariants} initial="hidden" animate="visible">
      {/* Header Text Section */}
      <motion.div className={styles.headerContent}>
        <motion.h2 variants={textVariants} initial="hidden" animate="visible">
          Right Now Kev is Bumpin
        </motion.h2>
        <motion.h1 variants={h1Variants} initial="hidden" animate="visible">
          {name}
        </motion.h1>
      </motion.div>

      {/* Header Image Section */}
      <motion.div
        className={styles.headerImage}
        variants={slideDownVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.5 }}
      >
        <motion.div className={styles.headerImageStack}>
          {/* Header Image comes in with bounce */}
          <motion.div
            className={styles.headerImageStackCover}
            whileHover="hover"
            variants={bounceVariants(0.4)} // Bounce effect with a delay
            transition={{ duration: 1 }}
            initial="hidden"
            animate="visible"
          >
            <img src={imageSrc} alt="Cover" />
          </motion.div>

          {/* Staggered bounce animations with different delays */}
          <motion.div
            className={styles.headerImageStackArtist}
            whileHover="hover"
            variants={bounceVariants(0.5)} // Bounce with slight delay
            initial="hidden"
            animate="visible"
          >
            <img id="coverid" src={albumArtSrc} alt="Cover" />
          </motion.div>

          <motion.div
            className={styles.headerImageStackStreams}
            variants={bounceVariants(0.6)} // Bounce with larger delay
            initial="hidden"
            animate="visible"
          >
            <p>{artist}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
