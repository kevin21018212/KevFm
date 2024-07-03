'use client';
import Head from '@/components/head';
import React, {useState, useEffect} from 'react';

const Getcurrenttrack = ({userName, apiKey, imgorcover}: any) => {
  const [lfmData, updateLfmData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&limit=1&nowplaying=true&format=json`
        );
        const data = await response.json();
        updateLfmData(data);
      } catch (error) {
        updateLfmData({error: 'Whoops! Something went wrong with Last.fm'});
      }
    };

    fetchData();
  }, [apiKey, userName]);

  const buildLastFmData = () => {
    const track = lfmData?.recenttracks?.track;

    if (!track) {
      return <p>Loading</p>;
    }

    const {
      name: songName,
      artist: {'#text': artistName},
      image: [{'#text': image}] = {},
    } = track;

    const imageUrl = image ? `https://lastfm.freetls.fastly.net/i/u/300x300/${image.slice(42)}` : '';

    if (imgorcover === '1') {
      return songName;
    } else if (imgorcover === '2') {
      // Consider using a dedicated library for color extraction instead of document manipulation
      console.warn('Color extraction functionality is not implemented for Next.js environment');
      return <img id='coverid' src='' alt='cover' />;
    } else if (imgorcover === '3') {
      return artistName;
    } else if (imgorcover === '4') {
      return <img src={imageUrl} alt='cover' />;
    } else {
      return <p>Loading</p>;
    }
  };

  return (
    <div>
      <Head />
      {buildLastFmData()}
    </div>
  );
};

export default Getcurrenttrack;
