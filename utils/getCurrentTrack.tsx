'use client';
import {useState, useEffect} from 'react';
import {average} from 'color.js';
import {getServerSideProps} from './getSSR';
const albumArt = require('album-art');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {userName, apiKey}: any = (await getServerSideProps()).props;

        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        const fetchedTrack = data.recenttracks.track[0];
        setTrack(fetchedTrack);
      } catch (error) {
        setError('Whoops! Something went wrong with Last.fm');
      }
    };

    fetchData();
  }, []);

  const setImageSrc = (elementId: string, src: string | null) => {
    const element = document.getElementById(elementId) as HTMLImageElement | null;
    if (element) element.src = src || '';
  };

  if (error) return <p>{error}</p>;
  if (!track) return <></>;

  const {name, artist, image} = track;
  const imageSrc = image[3]['#text'];

  const handleImageArt = async () => {
    try {
      const res = await albumArt(artist['#text']);
      setImageSrc('coverid', res || '');

      const color = (await average(res, {format: 'hex'})).toString();
      const color2 = (await average(imageSrc, {format: 'hex'})).toString();

      console.log(color, color2);
      if (color) {
        document.documentElement.style.setProperty('--bg', color);
      }
      if (color2) {
        document.documentElement.style.setProperty('--bg2', color2);
      }
    } catch (err) {
      console.error('Error fetching album art:', err);
    }
  };

  if (imgorcover === '1') {
    return <h1>{name}</h1>;
  } else if (imgorcover === '2') {
    handleImageArt();
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
