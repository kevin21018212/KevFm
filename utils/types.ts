interface User {
  id: string;
  name: string;
  realname: string;
  url: string;
  image: string;
  country: string;
  age: number;
  gender: string;
  subscriber: boolean;
  playcount: number;
  playlists: number;
  registered: string;
}

interface Track {
  name: string;
  artist: string;
  url: string;
  nowplaying: boolean;
  date?: string;
}
interface TrackData {
  name: string;
  artist: string;
  imageSrc: string;
  albumArtSrc: string;
  bgColor: string;
  bgColor2: string;
}
