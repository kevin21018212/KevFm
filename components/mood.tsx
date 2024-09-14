// components/MoodComponent.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/mood.module.scss";
import { MoodData, getRecentMoods } from "@/utils/fetch/getRecentMoods";

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

  if (loading) {
    return <div className={styles.loading}>Loading moods...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!moodData) {
    return <div className={styles.noData}>No mood data available.</div>;
  }

  // Helper function to get mood class based on mood value
  const getMoodClass = (mood: string) => {
    switch (mood) {
      case "Pumped Up":
        return styles.pumpedUp;
      case "Slutty":
        return styles.slutty;
      case "Blissful":
        return styles.blissful;
      case "Vibin":
        return styles.vibin;
      case "Down Bad":
        return styles.downBad;
      case "Fighting Demons":
        return styles.fightingDemons;
      case "Trappin'":
        return styles.trappin;
      case "Chilling":
        return styles.chilling;
      case "In the Trenches":
        return styles.inTheTrenches;
      case "Sassy":
        return styles.sassy;
      case "Petty":
        return styles.petty;
      case "Dailed In":
        return styles.dailedIn;
      case "White Woman":
        return styles.whiteWoman;
      case "Neutral":
      default:
        return styles.neutral;
    }
  };

  return (
    <div className={styles.moodContainer}>
      <h2>kevs Recents moods</h2>
      <div className={styles.cardsContainer}>
        {/* 15 Minutes Card */}
        <div className={`${styles.card} ${styles.card15} ${getMoodClass(moodData.fifteenMinutes)}`}>
          <div className={styles.cardContent}>
            <h3>Last 15 Minutes</h3>
            <p>{moodData.fifteenMinutes}</p>
          </div>
        </div>

        {/* 1 Hour Card */}
        <div className={`${styles.card} ${styles.card1h} ${getMoodClass(moodData.hour)}`}>
          <div className={styles.cardContent}>
            <h3>Last Hour</h3>
            <p>{moodData.hour}</p>
          </div>
        </div>

        {/* Day Card */}
        <div className={`${styles.card} ${styles.cardDay} ${getMoodClass(moodData.day)}`}>
          <div className={styles.cardContent}>
            <h3>Last Day</h3>
            <p>{moodData.day}</p>
          </div>
        </div>

        {/* Week Card */}
        <div className={`${styles.card} ${styles.cardWeek} ${getMoodClass(moodData.week)}`}>
          <div className={styles.cardContent}>
            <h3>Last Week</h3>
            <p>{moodData.week}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodComponent;
