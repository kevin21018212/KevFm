"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "../styles/sidebar.module.scss";
import { getUserInfo } from "@/utils/getUserInfo";
import { getRecentTracks } from "@/utils/getRecentTracks";
import { FaGithub } from "react-icons/fa";
import {
  containerVariants,
  textVariants,
  linkVariants,
  imageVariants,
  bounceVariants,
} from "@/utils/animations";

const Sidebar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [recentTracks, setRecentTracks] = useState<Track[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, tracks] = await Promise.all([
          getUserInfo(),
          getRecentTracks(),
        ]);
        if (user) setUserInfo(user);
        if (tracks) setRecentTracks(tracks);
        if (!user || !tracks) throw new Error();
      } catch {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    fetchData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!userInfo || !recentTracks) return <></>;

  return (
    <motion.div
      className={styles.sidebar}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.infoSection} variants={bounceVariants(0.1)}>
        <h2>User Info</h2>
        <motion.img src={"profile.jpg"} variants={imageVariants} />
        <p>
          <a href={userInfo.url} target="_blank" rel="noopener noreferrer">
            {userInfo.name} ({userInfo.realname})
          </a>
        </p>
        <p>Country: {userInfo.country}</p>

        <p>Playcount: {userInfo.playcount}</p>
      </motion.div>
      <motion.div
        className={styles.recentSection}
        variants={bounceVariants(0.1)}
      >
        <h2>Recent Tracks</h2>
        {recentTracks.map((track, index) => (
          <a
            key={index}
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <motion.div
              className={styles.track}
              variants={bounceVariants(index + 1 * 0.1)}
              whileHover="hover"
            >
              <p>
                <span className={styles.trackName}>{track.name}</span> by{" "}
                {track.artist}
              </p>
              {track.nowplaying && (
                <span className={styles.nowPlaying}>Now Playing</span>
              )}
              {!track.nowplaying && track.date && <span>{track.date}</span>}
            </motion.div>
          </a>
        ))}
      </motion.div>
      <motion.div className={styles.githubLink} variants={linkVariants}>
        <a
          href="https://github.com/kevin21018212/KevFm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.githubBubble}>
            <FaGithub size={50} />
            <span>Visit my GitHub</span>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
