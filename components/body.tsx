"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/body.module.scss";
import { bounceVariants, containerVariants, linkVariants } from "@/utils/animations";
import { ImageCard } from "@/utils/imageCard";
import Sidebar from "./sidebar";
import { Artist, Track } from "@/utils/types";
import { getTopArtist } from "@/utils/fetch/getTopArtist";
import { getTopTracks } from "@/utils/fetch/getTopTracks";
const Body = ({ spotifyAccessToken }: any) => {
  const [topartist, setTopartist] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artist, tracks] = await Promise.all([
          getTopArtist(spotifyAccessToken),
          getTopTracks(spotifyAccessToken),
        ]);
        if (artist) setTopartist(artist);
        if (tracks) setTopTracks(tracks);
        if (!artist || !tracks) throw new Error("Failed to fetch data from Spotify");
      } catch (err: any) {
        console.error(err);
        setError("Whoops! Something went wrong with Spotify.");
      }
    };

    fetchData();
  }, [[spotifyAccessToken]]);

  if (error) return <p>{error}</p>;
  if (!topartist || !topTracks) return <></>;

  if (!spotifyAccessToken) {
    return <p>Loading...</p>;
  }
  return (
    <motion.div className={styles.body} variants={containerVariants} initial="hidden" animate="visible">
      <div className={styles.sidebar}>
        <Sidebar spotifyAccessToken={spotifyAccessToken} />
      </div>

      <motion.div className={styles.bodyMain}>
        <motion.div className={styles.bodyMainTop} variants={containerVariants}>
          <motion.div className={styles.bodyMainTopContent}>
            <motion.div className={styles.bodyMainTopText} variants={bounceVariants(0.2)}>
              <p> Top Artist: {topartist.name}</p>
            </motion.div>
            <motion.div className={styles.bodyMainTopPlaycount} variants={bounceVariants(0.3)}>
              <p> Playcount: {topartist.playcount}</p>
            </motion.div>
          </motion.div>
          <div className={styles.bodyMainTopCover}>
            <motion.img
              src={topartist.imageURL}
              alt={topartist.name}
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
