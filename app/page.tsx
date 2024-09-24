// app/page.tsx or app/App.tsx
"use client";

import React from "react";
import styles from "./page.module.css";
import Body from "@/components/body";
import MoodDisplay from "@/components/mood";
import { Head } from "@/components/head";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Head />
      </header>
      <main className={styles.mainContent}>
        <MoodDisplay />
        <Body />
      </main>
    </div>
  );
};

export default App;
