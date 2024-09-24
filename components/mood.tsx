"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/mood.module.scss";

import { containerVariants, bounceVariants } from "@/utils/animations";
import { moodColors } from "@/utils/determineMood";
import { MoodData } from "@/utils/types";
import { getRecentMoods } from "@/utils/fetch/getRecentMoods";

const MoodComponent = () => {
  const [moodData, setMoodData] = useState<MoodData>({
    current: "",
    day: "",
    week: "",
    month: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const res = await fetch("/api/moods"); // Calls the API route created earlier
        const moods = await res.json();
        if (moods) {
          setMoodData(moods);
        } else {
          setError("Failed to retrieve moods.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  if (loading) {
    return (
      <div className={styles.moodContainer}>
        <h2>Kev's Recent Moods</h2>

        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.moodContainer}>
        <h2>Kev's Recent Moods</h2>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  const getMoodBackgroundColor = (mood: string) => {
    return moodColors[mood] || moodColors["Neutral"];
  };

  return (
    <motion.div className={styles.moodContainer} variants={containerVariants} initial="hidden" animate="visible">
      <h2>Kev's Recent Moods</h2>
      <div className={styles.cardsContainer}>
        {/* 15 Minutes Card */}
        <motion.div
          className={`${styles.card} ${styles.card15}`}
          style={{ backgroundColor: getMoodBackgroundColor(moodData.current) }}
          variants={bounceVariants(0.2)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Current</h3>
            <p>{moodData.current}</p>
          </div>
        </motion.div>

        {/* 1 Hour Card */}
        <motion.div
          className={`${styles.card} ${styles.card1h}`}
          style={{ backgroundColor: getMoodBackgroundColor(moodData.day) }}
          variants={bounceVariants(0.4)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>Today</h3>
            <p>{moodData.day}</p>
          </div>
        </motion.div>

        {/* Day Card */}
        <motion.div
          className={`${styles.card} ${styles.cardDay}`}
          style={{ backgroundColor: getMoodBackgroundColor(moodData.week) }}
          variants={bounceVariants(0.6)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>This Week</h3>
            <p>{moodData.week}</p>
          </div>
        </motion.div>

        {/* Week Card */}
        <motion.div
          className={`${styles.card} ${styles.cardWeek}`}
          style={{ backgroundColor: getMoodBackgroundColor(moodData.month) }}
          variants={bounceVariants(0.8)}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <div className={styles.cardContent}>
            <h3>This Month</h3>
            <p>{moodData.month}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodComponent;
