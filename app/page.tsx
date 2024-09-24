// app/page.tsx or app/App.tsx
"use client";

import React from "react";
import styles from "./page.module.css";
import Body from "@/components/body";
import MoodDisplay from "@/components/mood";
import { useSession } from "next-auth/react";
import SignIn from "@/components/signIn";
import { Head } from "@/components/head";

const App: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className={styles.app}></div>;
  }

  if (!session) {
    return <SignIn />;
  }

  const spotifyAccessToken = session.user.accessToken;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Head spotifyAccessToken={spotifyAccessToken} />
      </header>
      <main className={styles.mainContent}>
        <MoodDisplay spotifyAccessToken={spotifyAccessToken} />
        <Body spotifyAccessToken={spotifyAccessToken} />
      </main>
    </div>
  );
};

export default App;
