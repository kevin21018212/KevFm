'use client';
import {useState, useEffect} from 'react';
import axios from 'axios';
import styles from '../styles/head.module.scss';
const albumArt = require('album-art');

import {average} from 'color.js'; // Assuming color.js has TypeScript support

interface Track {
  name: string;
  artist: {
    '#text': string;
  };
  image: {'#text': string}[];
}

interface Props {
  imgorcover: string;
}

const GetCurrentTrack = ({imgorcover}: Props) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string>('');

  let userName = process.env.REACT_APP_LASTFM_USERNAME;
  let apiKey = process.env.REACT_APP_LASTFM_API_KEY;

  useEffect(() => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const fetchedTrack = data.recenttracks.track[0];
        setTrack(fetchedTrack);
      })
      .catch(() => setError('Whoops! Something went wrong with Last.fm'));
  }, [apiKey, userName]);

  const setImageSrc = (elementId: string, src: string | null) => {
    const element = document.getElementById(elementId) as HTMLImageElement | null;
    if (element) element.src = src || '';
  };

  if (error) return <p>{error}</p>;
  if (!track) return <></>;

  const {name, artist, image} = track;
  const imageSrc = image[3]['#text'];

  if (imgorcover === '1') {
    return <h1>{name}</h1>;
  } else if (imgorcover === '2') {
    albumArt(artist['#text'], async (err: any, res: string) => {
      setImageSrc('coverid', res || '');

      const color: string = (await average(res, {format: 'hex'})).toString();
      const color2: string = (await average(imageSrc, {format: 'hex'})).toString();

      console.log(color, color2);
      if (color) {
        document.documentElement.style.setProperty('--bg', color);
      }
      if (color2) {
        document.documentElement.style.setProperty('--bg2', color2);
      }
    });
    return <img id='coverid' src='' alt='Cover'></img>;
  } else if (imgorcover === '3') {
    return <p>{artist['#text']}</p>;
  } else if (imgorcover === '4') {
    return <img src={imageSrc} alt='Cover'></img>;
  } else {
    return <p>Loading...</p>;
  }
};

export default GetCurrentTrack;
