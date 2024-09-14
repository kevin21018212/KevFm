import { NextResponse } from "next/server";

const clientId = process.env.CLIENT_ID!;
const redirectUri = "http://localhost:3000/api/spotify/callback";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

export async function GET() {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
