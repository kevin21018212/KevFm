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
  const [imageURL, setImageURL] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${userName}&api_key=${apiKey}&limit=1&format=json`;
        const response = await axios.get(url);
        const fetchedArtist = response.data.topartists.artist[0];
        setArtist(fetchedArtist);

        if (imgorcover === "2") {
          const image = await albumArt(fetchedArtist.name, { size: "large" });
          setImageURL(image);
        }
      } catch (error) {
        setError("Whoops! Something went wrong with Last.fm");
      }
    };

    fetchArtist();
  }, [imgorcover, apiKey, userName]);

  if (error) return <p>{error}</p>;
  if (!artist) return <></>;

  return (
    <>
      {imgorcover === "1" && <p>{artist.name}</p>}
      {imgorcover === "2" && (
        <img id="imgid" src={imageURL} alt={artist.name} />
      )}
      {imgorcover === "3" && <p>{artist.playcount}</p>}
    </>
  );
};

export default GetTopAlbum;
