import React from 'react';
import styles from '../styles/body.module.css';
import Gettopalbum from '@/utils/getTopAlbum';
import Gettoptracks from '@/utils/getTopTracks';

const Body = () => {
  return (
    <div className={styles.Body}>
      <div className={styles.Sidebar}>
        <p>Sidebar</p>
      </div>

      <div className={styles.BodyMain}>
        <div className={styles.BodyMainTop}>
          <div className={styles.BodyMainTopContent}>
            <div className={styles.BodyMainTopText}>
              Top Artist: <Gettopalbum imgorcover='1' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
            </div>
            <div className={styles.BodyMainTopPlaycount}>
              <span className={styles.text2}>
                Playcount: <Gettopalbum imgorcover='3' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
              </span>
            </div>
          </div>
          <div className={styles.BodyMainTopCover}>
            <Gettopalbum imgorcover='2' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
          </div>
        </div>

        <div className={styles.BodyMainMiddle}>
          <div className={styles.BodyMainMiddleCoverRight}>
            <Gettoptracks imgorcover='1' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
          </div>
          <div className={styles.BodyMainMiddleCoverMiddle}>
            <Gettoptracks imgorcover='2' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
          </div>
          <div className={styles.BodyMainMiddleCoverLeft}>
            <Gettoptracks imgorcover='3' userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' />
          </div>
        </div>

        <div className={styles.BodyMainBottom}>
          <div className={styles.BodyMainBottomCover}>
            <img src={''} alt='Playlist' />
          </div>
          <div className={styles.BodyMainBottomContent}>
            <div className={styles.BodyMainBottomContent}>
              <a href='https://open.spotify.com/playlist/5pLSoW36SKxvWNivMPpSzz?si=158b467efa0f473f' rel='noopener noreferrer' target='_blank'>
                Checkout my Playlists
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
