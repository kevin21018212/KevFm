"use server";
interface ServerSideProps {
  userName: string | undefined;
  apiKey: string | undefined;
}

export async function getServerSideProps(): Promise<{ props: ServerSideProps }> {
  // Access environment variables securely on the server-side
  const userName = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;

  // Validate environment variables here (optional)

  return {
    props: {
      userName,
      apiKey,
    },
  };
}
