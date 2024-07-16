"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/body.module.scss"; // Make sure the path matches your project structure
import { getTopAlbum } from "../utils/getTopAlbum"; // Adjust the import path as necessary
import { getTopTracks } from "../utils/getTopTracks"; // Adjust the import path as necessary

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
    const fetchTopAlbum = async () => {
      const album = await getTopAlbum();
      if (album) {
        setTopAlbum(album);
      } else {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    const fetchTopTracks = async () => {
      const tracks = await getTopTracks();
      if (tracks) {
        setTopTracks(tracks);
      } else {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    fetchTopAlbum();
    fetchTopTracks();
  }, []);

  if (error) return <p>{error}</p>;
  if (!topAlbum || !topTracks) return <></>;

  return (
    <div className={styles.body}>
      <div className={styles.sidebar}>
        <p>Sidebar</p>
      </div>

      <div className={styles.bodyMain}>
        <div className={styles.bodyMainTop}>
          <div className={styles.bodyMainTopContent}>
            <div className={styles.bodyMainTopText}>
              Top Artist: <p>{topAlbum.name}</p>
            </div>
            <div className={styles.bodyMainTopPlaycount}>
              Playcount: <p>{topAlbum.playcount}</p>
            </div>
          </div>
          <div className={styles.bodyMainTopCover}>
            <img src={topAlbum.imageURL} alt={topAlbum.name} />
          </div>
        </div>

        <div className={styles.bodyMainMiddle}>
          <div className={styles.bodyMainMiddleCoverRight}>
            <div className={styles.middleStuff}>
              <div className={styles.img}>
                <img src={topTracks[0].imageURL} alt={topTracks[0].name} />
              </div>
              <div className={styles.text}>
                <p>{topTracks[0].name}</p>
              </div>
            </div>
          </div>
          <div className={styles.bodyMainMiddleCoverMiddle}>
            <div className={styles.middleStuff}>
              <div className={styles.img}>
                <img src={topTracks[1].imageURL} alt={topTracks[1].name} />
              </div>
              <div className={styles.text}>
                <p>{topTracks[1].name}</p>
              </div>
            </div>
          </div>
          <div className={styles.bodyMainMiddleCoverLeft}>
            <div className={styles.middleStuff}>
              <div className={styles.img}>
                <img src={topTracks[2].imageURL} alt={topTracks[2].name} />
              </div>
              <div className={styles.text}>
                <p>{topTracks[2].name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bodyMainBottom}>
          <div className={styles.bodyMainBottomCover}>
            <img src={"playlist.png"} alt="Playlist" />
          </div>
          <div className={styles.bodyMainBottomContent}>
            <a
              href="https://open.spotify.com/playlist/5pLSoW36SKxvWNivMPpSzz?si=158b467efa0f473f"
              rel="noopener noreferrer"
              target="_blank"
            >
              Checkout my Playlists
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
