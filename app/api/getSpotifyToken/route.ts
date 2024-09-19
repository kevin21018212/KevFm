// pages/api/getSpotifyToken.ts

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      { error: "Missing CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN in environment variables." },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in; // Typically 3600 seconds

    return NextResponse.json(
      { accessToken, expiresIn },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching Spotify access token:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error fetching Spotify access token." }, { status: 500 });
  }
}
