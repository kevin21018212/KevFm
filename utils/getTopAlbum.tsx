'use client';

import React, {useState, useEffect} from 'react';
import axios from 'axios';

export const Gettopalbum = ({userName, apiKey, imgorcover}: any) => {
  const [data, updateData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userName}&api_key=${apiKey}&limit=1&format=json`
        );
        updateData(response.data);
      } catch (error) {
        updateData({error: 'Whoops! Something went wrong with Last.fm'});
      }
    };

    fetchData();
  }, [apiKey, userName]);

  const buildLastFmData = () => {
    const topArtist = data?.topartists?.artist?.[0];

    if (!topArtist) {
      return <p>Loading</p>;
    }

    if (imgorcover === '1') {
      const name = topArtist.name;
      return name;
    } else if (imgorcover === '2') {
      const name = topArtist.name;
      // Consider using a dedicated image fetching library instead of albumArt
      console.warn('albumArt library might not be suitable for image fetching in React');
      return <img id='imgid' src='' alt='cover' />;
    } else if (imgorcover === '3') {
      const playcount = topArtist.playcount;
      return playcount;
    } else {
      return <p>Loading</p>;
    }
  };

  return buildLastFmData();
};

export default Gettopalbum;
