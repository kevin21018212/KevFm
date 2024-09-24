/* Body.tsx */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/body.module.scss";
import { bounceVariants, containerVariants, linkVariants } from "@/utils/animations";
import { ImageCard } from "@/utils/imageCard";
import Sidebar from "./sidebar";
import { Artist, Track, User } from "@/utils/types";
import { getTopArtist } from "@/utils/fetch/getTopArtist";
import { getTopTracks } from "@/utils/fetch/getTopTracks";
import { getUserInfo } from "@/utils/fetch/getUserInfo";
import { getRecentTracks } from "@/utils/fetch/getRecentTracks";

interface BodyProps {
  spotifyAccessToken: any;
}

const Body: React.FC<BodyProps> = ({ spotifyAccessToken }: BodyProps) => {
  const [topArtist, setTopArtist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [recentTracks, setRecentTracks] = useState<Track[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!spotifyAccessToken) {
      setError("No Spotify access token provided.");
      return;
    }

    const fetchData = async () => {
      try {
        const [artist, tracks, user, recent] = await Promise.all([
          getTopArtist(spotifyAccessToken),
          getTopTracks(spotifyAccessToken),
          getUserInfo(spotifyAccessToken),
          getRecentTracks(spotifyAccessToken),
        ]);

        if (artist) setTopArtist(artist);
        if (tracks) setTopTracks(tracks);
        if (user) setUserInfo(user);
        if (recent) setRecentTracks(recent);

        // Check if any data is missing
        if (!artist || !tracks || !user || !recent) {
          throw new Error("Failed to fetch all required data from Spotify.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Whoops! Something went wrong with Spotify.");
      }
    };

    fetchData();
  }, [spotifyAccessToken]);

  // Handle error state
  if (error) return <p>{error}</p>;

  // Handle loading state
  if (!topArtist || !topTracks || !userInfo || !recentTracks)
    return (
      <motion.div className={styles.body} variants={containerVariants} initial="hidden" animate="visible">
        <div className={styles.sidebar}>
          <Sidebar spotifyAccessToken={spotifyAccessToken} userInfo={null} recentTracks={null} />
        </div>
        <motion.div className={styles.bodyMain}></motion.div>
      </motion.div>
    );

  return (
    <motion.div className={styles.body} variants={containerVariants} initial="hidden" animate="visible">
      <div className={styles.sidebar}>
        <Sidebar spotifyAccessToken={spotifyAccessToken} userInfo={userInfo} recentTracks={recentTracks} />
      </div>

      <motion.div className={styles.bodyMain}>
        <motion.div className={styles.bodyMainTop} variants={containerVariants}>
          <motion.div className={styles.bodyMainTopContent}>
            <motion.div className={styles.bodyMainTopText} variants={bounceVariants(0.2)}>
              <p>Top Artist: {topArtist.name}</p>
            </motion.div>
            <motion.div className={styles.bodyMainTopPlaycount} variants={bounceVariants(0.3)}>
              <p>Playcount: {topArtist.playcount}</p>
            </motion.div>
          </motion.div>
          <div className={styles.bodyMainTopCover}>
            <motion.img
              src={topArtist.imageURL}
              alt={topArtist.name}
              variants={bounceVariants(0.5)}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            />
          </div>
        </motion.div>

        <motion.div className={styles.bodyMainMiddle}>
          {topTracks.slice(0, 3).map((track, index) => (
            <motion.div key={index} className={styles[`bodyMainMiddleCover${["Right", "Middle", "Left"][index]}`]}>
              <ImageCard src={track.imageURL} alt={track.name} delay={0.4 + index * 0.2} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div className={styles.bodyMainBottom} variants={containerVariants}>
          <div className={styles.bodyMainBottomCover}>
            <motion.img
              variants={bounceVariants(0.9)}
              src={"playlist.png"}
              alt="Playlist"
              initial="hidden"
              animate="visible"
            />
          </div>
          <motion.div className={styles.bodyMainBottomContent} whileHover="hover" variants={linkVariants}>
            <a
              href="https://open.spotify.com/playlist/6p9ZGJXs8QvV5U4yEHxo0V?si=311ab1edfa46420e"
              rel="noopener noreferrer"
              target="_blank"
            >
              Checkout my Playlists
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Body;
