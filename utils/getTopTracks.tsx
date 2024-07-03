"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const albumArt = require("album-art");

interface Track {
  name: string;
  artist: { name: string };
}

interface Props {
  imgorcover: string;
  userName: string;
  apiKey: string;
}

const GetTopTracks = ({ imgorcover, userName, apiKey }: Props) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}&limit=3&period=1day&format=json`;

    axios
      .get(url)
      .then((response) => setTracks(response.data.toptracks.track))
      .catch((error) => setError("Whoops! Something went wrong with Last.fm"));
  }, [imgorcover, userName, apiKey]);

  if (error) return <p>{error}</p>;
  if (!tracks.length) return <></>;

  return (
    <div>
      {tracks.map((track, index) => {
        if (index + 1 === parseInt(imgorcover)) {
          albumArt(
            track.artist.name,
            { album: track.name },
            (err: any, res: any) => {
              const imgElement = document.getElementById(
                `imgid${index}`
              ) as HTMLImageElement | null;
              if (imgElement) {
                imgElement.src = res || "";
              }
            }
          );

          return (
            <div key={index} className="middlestuff">
              <div className="middlestuff-p">{track.name}</div>
              <img id={`imgid${index}`} src="" alt={track.name}></img>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default GetTopTracks;
