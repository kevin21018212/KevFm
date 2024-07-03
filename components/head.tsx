import Getcurrenttrack from '@/utils/getCurrentTrack';
import styles from '../styles/head.module.css';

function Head() {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.HeaderContent}>
          <div className={styles.HeaderContentTop}>
            <div className={styles.HeaderContentTopText}>Right Now Kev is Bumpin</div>
          </div>
          <div className={styles.HeaderContentBottom}>
            <div className={styles.HeaderContentBottomText} id='songinfo'>
              <Getcurrenttrack userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' imgorcover='1' />
            </div>
          </div>
        </div>

        <div className={styles.HeaderImage}>
          <div className={styles.HeaderImageStack}>
            <div className={styles.HeaderImageStackCover}>
              <Getcurrenttrack userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' imgorcover='4' />
            </div>
            <div className={styles.HeaderImageStackArtist}>
              <Getcurrenttrack userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' imgorcover='2' />
            </div>
            <div className={styles.HeaderImageStackStreams}>
              <span>
                <Getcurrenttrack userName='Kevin21012' apiKey='b6937c7c238176d6899dc83bf146337f' imgorcover='3' />
              </span>
            </div>
            <div className={styles.HeaderImageStackPlatform}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Head;
