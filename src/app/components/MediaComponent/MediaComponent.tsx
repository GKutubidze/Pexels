import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "./MediaComponent.module.css";
import MediaHeader from "./MediaHeader";
import MediaNavigaton from "./MediaNavigaton";
import {  useMediaContext } from "@/app/Context/MediaContext";
import ImagesContainer from "./ImagesContainer";
import VideosContainer from "./VideosContainer";
import { SearchMedia } from "../SearchComponent/SearchMedia";
import SearchVideo from "../SearchComponent/SearchVideo";

export default function MediaComponent() {
  const context=useMediaContext()
  let mediaContent = null;

  if (context.mediaType === "Home" && context.query!=" ") {
    mediaContent = (
      <>
        <MediaHeader title="Free Stock Photos" />
        <ImagesContainer photos={context.photos} />;
      </>
    );
  } else if (context.mediaType === "Videos" && context.query!=" ") {
    // Assuming VideosContainer takes similar props as ImagesContainer
    mediaContent = <VideosContainer />;
  } else if (context.mediaType === "" && context.searchType==="Photos") {
    mediaContent = <SearchMedia />;
  }

  else if (context.mediaType === "" && context.searchType==="Videos"){
    mediaContent = <SearchVideo />;

  }

  

  return (
    <div className={styles.main}>
      <MediaNavigaton />

      {mediaContent}
    </div>
  );
}
