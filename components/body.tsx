import React from 'react';
import styles from '../styles/body.module.scss'; // Make sure the path matches your project structure
import GetTopAlbum from '../utils/getTopAlbum'; // Adjust the import path as necessary
import GetTopTracks from '../utils/getTopTracks'; // Adjust the import path as necessary

const Body: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.sidebar}>
        <p>Sidebar</p>
      </div>

      <div className={styles.bodyMain}>
        <div className={styles.bodyMainTop}>
          <div className={styles.bodyMainTopContent}>
            <div className={styles.bodyMainTopText}>
              Top Artist: <GetTopAlbum imgorcover='1' />
            </div>
            <div className={styles.bodyMainTopPlaycount}>
              Playcount: <GetTopAlbum imgorcover='3' />
            </div>
          </div>
          <div className={styles.bodyMainTopCover}>
            <GetTopAlbum imgorcover='2' />
          </div>
        </div>

        <div className={styles.bodyMainMiddle}>
          <div className={styles.bodyMainMiddleCoverRight}>
            <GetTopTracks imgorcover='1' />
          </div>
          <div className={styles.bodyMainMiddleCoverMiddle}>
            <GetTopTracks imgorcover='2' />
          </div>
          <div className={styles.bodyMainMiddleCoverLeft}>
            <GetTopTracks imgorcover='3' />
          </div>
        </div>

        <div className={styles.bodyMainBottom}>
          <div className={styles.bodyMainBottomCover}>
            <img src={'playlist.png'} alt='Playlist' />
          </div>
          <div className={styles.bodyMainBottomContent}>
            <a href='https://open.spotify.com/playlist/5pLSoW36SKxvWNivMPpSzz?si=158b467efa0f473f' rel='noopener noreferrer' target='_blank'>
              Checkout my Playlists
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
