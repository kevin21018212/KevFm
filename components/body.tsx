"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/body.module.scss";
// Adjust the import path as necessary
import {
  bounceVariants,
  containerVariants,
  linkVariants,
} from "@/utils/animations";
import { getTopAlbum } from "@/utils/getTopAlbum";
import { getTopTracks } from "@/utils/getTopTracks";
import { ImageCard } from "@/utils/imageCard";
import Sidebar from "./sidebar";

interface Artist {
  name: string;
  playcount: number;
  imageURL: string;
}

interface Track {
  name: string;
  artist: { name: string };
  imageURL: string;
}

const Body: React.FC = () => {
  const [topAlbum, setTopAlbum] = useState<Artist | null>(null);
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [album, tracks] = await Promise.all([
          getTopAlbum(),
          getTopTracks(),
        ]);
        if (album) setTopAlbum(album);
        if (tracks) setTopTracks(tracks);
        if (!album || !tracks) throw new Error();
      } catch {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!topAlbum || !topTracks) return <></>;

  return (
    <motion.div
      className={styles.body}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      <motion.div className={styles.bodyMain}>
        <motion.div className={styles.bodyMainTop} variants={containerVariants}>
          <motion.div className={styles.bodyMainTopContent}>
            <motion.div
              className={styles.bodyMainTopText}
              variants={bounceVariants(0.2)}
            >
              Top Artist: <p>{topAlbum.name}</p>
            </motion.div>
            <motion.div
              className={styles.bodyMainTopPlaycount}
              variants={bounceVariants(0.3)}
            >
              Playcount: <p>{topAlbum.playcount}</p>
            </motion.div>
          </motion.div>
          <div className={styles.bodyMainTopCover}>
            <img src={topAlbum.imageURL} alt={topAlbum.name} />
          </div>
        </motion.div>

        <motion.div className={styles.bodyMainMiddle}>
          {topTracks.slice(0, 3).map((track, index) => (
            <motion.div
              key={index}
              className={
                styles[
                  `bodyMainMiddleCover${["Right", "Middle", "Left"][index]}`
                ]
              }
            >
              <ImageCard
                src={track.imageURL}
                alt={track.name}
                delay={0.4 + index * 0.2}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.bodyMainBottom}
          variants={containerVariants}
        >
          <div className={styles.bodyMainBottomCover}>
            <motion.img
              variants={bounceVariants(0.9)}
              src={"playlist.png"}
              alt="Playlist"
              initial="hidden"
              animate="visible"
            />
          </div>
          <motion.div
            className={styles.bodyMainBottomContent}
            whileHover="hover"
            variants={linkVariants}
          >
            <a
              href="https://open.spotify.com/playlist/5pLSoW36SKxvWNivMPpSzz?si=158b467efa0f473f"
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
