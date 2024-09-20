// app/api/refreshToken/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });
    }

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Spotify client ID or secret is missing.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const tokenUrl = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await axios.post(tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = response.data;
    const accessToken: string = data.access_token;
    const expiresIn: number = data.expires_in; // in seconds

    if (!accessToken || !expiresIn) {
      console.error("Invalid response from Spotify:", data);
      return NextResponse.json({ error: "Invalid response from Spotify" }, { status: 500 });
    }

    const newRefreshToken: string | undefined = data.refresh_token;

    return NextResponse.json({
      accessToken,
      expiresIn,
      refreshToken: newRefreshToken || refreshToken,
    });
  } catch (error: any) {
    // Handle errors from Spotify or network issues
    console.error("Error refreshing Spotify token:", error.response?.data || error.message);

    // Determine the error message to send back
    const errorMessage =
      error.response?.data?.error_description || error.response?.data?.error || "Failed to refresh Spotify token";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
