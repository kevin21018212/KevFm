import React from "react";

import styles from "./page.module.css";
import Body from "@/components/body";

import Head from "@/components/head";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <div className={styles.head}>
        {" "}
        <Head />
      </div>
      <div className={styles.body}>
        <Body />
      </div>
    </div>
  );
};

export default App;
