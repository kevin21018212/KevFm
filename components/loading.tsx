// components/Loading.tsx
import React from "react";
import styles from "../styles/loading.module.scss"; // Ensure path matches your project structure

const Loading: React.FC = () => {
  return (
    <div className={styles.loading}>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
