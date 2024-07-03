"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const albumArt = require("album-art");
interface Artist {
  name: string;
  playcount: number;
}

interface Props {
  userName: string;
  apiKey: string;
  imgorcover: string;
}

const GetTopAlbum = ({ userName, apiKey, imgorcover }: Props) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userName}&api_key=${apiKey}&limit=1&format=json`;

    axios
      .get(url)
      .then((response) => setArtist(response.data.topartists.artist[0]))
      .catch(() => setError("Whoops! Something went wrong with Last.fm"));
  }, [imgorcover, apiKey, userName]);

  if (error) return <p>{error}</p>;
  if (!artist) return <p>Loading...</p>;

  return (
    <>
      {imgorcover === "1" && <p>{artist.name}</p>}
      {imgorcover === "2" && (
        <img id="imgid" src={albumArt(artist.name)} alt="artist"></img>
      )}
      {imgorcover === "3" && <p>{artist.playcount}</p>}
    </>
  );
};

export default GetTopAlbum;
