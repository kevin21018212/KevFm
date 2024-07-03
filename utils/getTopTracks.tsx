'use client';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export const Gettoptracks = ({imgorcover, userName, apiKey}: any) => {
  const [data, updateData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}&limit=3&period=1day&format=json`
        );
        updateData(response.data);
      } catch (error) {
        updateData({error: 'Whoops! Something went wrong with Last.fm'});
      }
    };

    fetchData();
  }, [apiKey, userName]);

  const buildLastFmData = () => {
    const topTracks = data?.toptracks?.track || []; // Use empty array if track is missing

    return (
      <div className='toptracks-container'>
        {topTracks.map(
          (track: any, index: number) =>
            index < 3 && ( // Limit to 3 tracks
              <div key={index} className='middlestuff'>
                <div className='middlestuff-p'>{track.name}</div>
                {imgorcover === '1' && <img id={`imgid${index}`} src='' alt={`${track.name} by ${track.artist.name}`} />}
                {/* Consider using a dedicated image fetching library for other cases */}
                {imgorcover === '2' && <img id={`imgid${index}`} src='' alt='' />}
                {imgorcover === '3' && <p>{track.playcount}</p>}
              </div>
            )
        )}
        {topTracks.length === 0 && <p>No tracks found</p>}
      </div>
    );
  };

  return buildLastFmData();
};

export default Gettoptracks;
