"use client";
import Header from "./components/Header/Header";
import styles from "./page.module.css";
import {
  Photo,
  PhotosWithTotalResults,
  ErrorResponse,
  createClient,
} from "pexels";
 
import { useState, useEffect, useRef, useContext } from "react";
import MediaComponent from "./components/MediaComponent/MediaComponent";
import { MediaContext } from "./Context/MediaContext";

export default function Home() {
  const context=useContext(MediaContext)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;


 
  // Attach scroll event listener when component mounts
  

  return (
    <main className={styles.main}>
      <Header  />
      <MediaComponent />
    </main>
  );
}
