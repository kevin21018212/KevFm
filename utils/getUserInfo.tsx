import axios from "axios";
import { getServerSideProps } from "./getSSR";

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

export const getUserInfo = async (): Promise<User | null> => {
  try {
    const { userName, apiKey }: any = (await getServerSideProps()).props;
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${userName}&api_key=${apiKey}&format=json`;

    const response = await axios.get(url);

    // Log the API response
    console.log("API Response for getUserInfo:", response.data);

    const user = response.data.user;

    return {
      id: user.id,
      name: user.name,
      realname: user.realname,
      url: user.url,
      image: user.image,
      country: user.country,
      age: user.age,
      gender: user.gender,
      subscriber: user.subscriber === "1",
      playcount: user.playcount,
      playlists: user.playlists,
      registered: new Date(user.registered.unixtime * 1000).toDateString(),
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};
