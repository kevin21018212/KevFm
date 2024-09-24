/* sidebar.tsx */
"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/sidebar.module.scss";
import { FaGithub } from "react-icons/fa";
import { containerVariants, linkVariants, imageVariants, bounceVariants } from "@/utils/animations";
import { User, Track } from "@/utils/types";

interface SidebarProps {
  userInfo: User | null;
  recentTracks: Track[] | null;
}

const Sidebar: React.FC<SidebarProps> = ({ userInfo, recentTracks }) => {
  if (!userInfo || !recentTracks) {
    return (
      <motion.div
        className={styles.sidebar}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      ></motion.div>
    );
  }

  return (
    <motion.div className={styles.sidebar} variants={containerVariants} initial="hidden" animate="visible">
      {/* User Info Section */}
      <motion.div className={styles.infoSection} variants={bounceVariants(0.1)}>
        <h2>User Info</h2>
        <motion.img
          src={"profile.jpg"}
          alt={userInfo.name}
          variants={imageVariants}
          className={styles.profileImage} // Ensure you have this class in your SCSS
        />
        <p>
          <a href={userInfo.url} target="_blank" rel="noopener noreferrer">
            {userInfo.name} ({userInfo.name})
          </a>
        </p>
        <p>Country: {userInfo.country}</p>
        <p>PlayCount: {userInfo.playcount}</p>
      </motion.div>

      {/* Recent Tracks Section */}
      <motion.div className={styles.recentSection} variants={bounceVariants(0.1)}>
        <h2>Recent Tracks</h2>
        {recentTracks.map((track, index) => (
          <a key={index} href={track.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <motion.div className={styles.track} variants={bounceVariants(0.1 + index * 0.1)} whileHover="hover">
              <p>
                <span className={styles.trackName}>{track.name}</span> by {track.artist}
              </p>
              {track.nowplaying && <span className={styles.nowPlaying}>Now Playing</span>}
              {!track.nowplaying && track.playedAt && <span>{track.playedAt}</span>}
            </motion.div>
          </a>
        ))}
      </motion.div>

      {/* GitHub Link Section */}
      <motion.div className={styles.githubLink} variants={linkVariants}>
        <a href="https://github.com/kevin21018212/KevFm" target="_blank" rel="noopener noreferrer">
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
