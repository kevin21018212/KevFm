'use client';
import {useEffect, useState} from 'react';
import styles from '../styles/body.module.scss';
import {getServerSideProps} from './getSSR';
const albumArt = require('album-art');

interface Track {
  name: string;
  artist: {name: string};
}

interface Props {
  imgorcover: string;
}

const GetTopTracks = ({imgorcover}: Props) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>('');
  const [images, setImages] = useState<{[key: string]: string}>({});
  let userName = process.env.LASTFM_USERNAME;
  let apiKey = process.env.LASTFM_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {userName, apiKey} = (await getServerSideProps()).props;

        let url = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}&limit=3&period=1day&format=json`;
        console.log(url);

        let response = await fetch(url);
        let data = await response.json();

        setTracks(data.toptracks.track);

        data.toptracks.track.forEach((track: Track, index: number) => {
          albumArt(track.artist.name, {album: track.name}, (err: any, res: string) => {
            if (!err && res) {
              setImages((prev) => ({...prev, [index]: res}));
            }
          });
        });
      } catch (error) {
        setError('Whoops! Something went wrong with Last.fm');
      }
    };

    fetchData();
  }, [imgorcover]);

  if (error) return <p>{error}</p>;
  if (!tracks.length) return <></>;

  return (
    <div>
      {tracks.map((track, index) => {
        if (index + 1 === parseInt(imgorcover)) {
          return (
            <div key={index} className={styles.middleStuff}>
              <div className={styles.img}>
                <img id={`imgid${index}`} src={images[index] || ''} alt={track.name} />
              </div>
              <div className={styles.text}>
                <p>{track.name}</p>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default GetTopTracks;
