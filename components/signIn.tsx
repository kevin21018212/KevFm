// components/SignIn/SignIn.tsx
"use client";

import React from "react";
import { signIn } from "next-auth/react";
import styles from "../styles/signIn.module.scss";

const SignIn: React.FC = () => {
  return (
    <div className={styles.signInContainer}>
      <h2 className={styles.title}>KevFm</h2>
      <button className={styles.signInButton} onClick={() => signIn("spotify")}>
        Sign in with Spotify
      </button>
    </div>
  );
};

export default SignIn;
