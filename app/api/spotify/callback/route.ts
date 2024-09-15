import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const redirectUri = "http://localhost:3000/api/spotify/callback";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Authorization code not provided" }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    });

    const { access_token, refresh_token } = response.data;

    return new NextResponse("Tokens have been logged in the console. Update your .env.local file.");
  } catch (error: any) {
    console.error("Error obtaining tokens:", error.response?.data || error.message);
    return NextResponse.json({ error: "Error obtaining tokens" }, { status: 500 });
  }
}
