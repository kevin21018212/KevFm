// components/Head.tsx
import React from "react";
import styles from "../styles/head.module.scss"; // Ensure path matches your project structure
import GetCurrentTrack from "@/utils/getCurrentTrack"; // Adjust import path as necessary

const Head: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.headerContent}>
        <h2>Right Now Kev is Bumpin</h2>

        <GetCurrentTrack
          userName="Kevin21012"
          apiKey="b6937c7c238176d6899dc83bf146337f"
          imgorcover="1"
        />
      </div>

      <div className={styles.headerImage}>
        <div className={styles.headerImageStack}>
          <div className={styles.headerImageStackCover}>
            <GetCurrentTrack
              userName="Kevin21012"
              apiKey="b6937c7c238176d6899dc83bf146337f"
              imgorcover="4"
            />
          </div>
          <div className={styles.headerImageStackArtist}>
            <GetCurrentTrack
              userName="Kevin21012"
              apiKey="b6937c7c238176d6899dc83bf146337f"
              imgorcover="2"
            />
          </div>
          <div className={styles.headerImageStackStreams}>
            <GetCurrentTrack
              userName="Kevin21012"
              apiKey="b6937c7c238176d6899dc83bf146337f"
              imgorcover="3"
            />
          </div>
          <div className={styles.headerImageStackPlatform}></div>
        </div>
      </div>
    </div>
  );
};

export default Head;
