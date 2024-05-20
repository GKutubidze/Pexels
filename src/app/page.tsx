"use client";
import Header from "./components/Header/Header";
import styles from "./page.module.css";
import MediaComponent from "./components/MediaComponent/MediaComponent";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <MediaComponent />
    </main>
  );
}
