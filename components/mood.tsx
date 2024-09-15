"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/mood.module.scss";
import { getRecentMoods, MoodData } from "@/utils/fetch/getRecentMoods";
import { containerVariants, bounceVariants } from "@/utils/animations";
import { moodColors } from "@/utils/determineMood";

const MoodComponent = ({ spotifyAccessToken }: any) => {
  const [moodData, setMoodData] = useState<MoodData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const moods = await getRecentMoods(spotifyAccessToken);
        if (moods) {
          setMoodData(moods);
        } else {
          setError("Unable to fetch moods.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, [spotifyAccessToken]);

  if (!moodData) {
    return (
      <div className={styles.moodContainer}>
        <h2>kevs Recent Moods</h2>
        <div className={styles.cardsContainer}></div>
      </div>
    );
  }

  // Helper function to get dynamic color for each mood
  const getMoodColor = (mood: string) => moodColors[mood] || moodColors["Neutral"];

  return (
    <motion.div className={styles.moodContainer} variants={containerVariants} initial="hidden" animate="visible">
      <h2>kevs Recent Moods</h2>
      <div className={styles.cardsContainer}>
        {/* 15 Minutes Card */}
        <motion.div
          className={`${styles.card}`}
          style={{ backgroundColor: getMoodColor(moodData.fifteenMinutes) }} // Set background color dynamically
          variants={bounceVariants(0.2)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Last 15 Minutes</h3>
            <p>{moodData.fifteenMinutes}</p>
          </div>
        </motion.div>

        {/* 1 Hour Card */}
        <motion.div
          className={`${styles.card}`}
          style={{ backgroundColor: getMoodColor(moodData.hour) }}
          variants={bounceVariants(0.4)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Last Hour</h3>
            <p>{moodData.hour}</p>
          </div>
        </motion.div>

        {/* Day Card */}
        <motion.div
          className={`${styles.card}`}
          style={{ backgroundColor: getMoodColor(moodData.day) }}
          variants={bounceVariants(0.6)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Last Day</h3>
            <p>{moodData.day}</p>
          </div>
        </motion.div>

        {/* Week Card */}
        <motion.div
          className={`${styles.card}`}
          style={{ backgroundColor: getMoodColor(moodData.week) }}
          variants={bounceVariants(0.8)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Last Week</h3>
            <p>{moodData.week}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodComponent;
