import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "./MediaComponent.module.css";
import MediaHeader from "./MediaHeader";
import MediaNavigaton from "./MediaNavigaton";
import { MediaContext } from "@/app/Context/MediaContext";
import ImagesContainer from "./ImagesContainer";
import VideosContainer from "./VideosContainer";
import { SearchMedia } from "../SearchComponent/SearchMedia";

export default function MediaComponent() {
  const context = useContext(MediaContext);
  let mediaContent = null;

  if (context.mediaType === "Home") {
    mediaContent = (
      <>
        <MediaHeader />
        <ImagesContainer photos={context.photos} />;
      </>
    );
  } else if (context.mediaType === "Videos") {
    // Assuming VideosContainer takes similar props as ImagesContainer
    mediaContent = <VideosContainer />;
  } else if (context.mediaType === "") {
    mediaContent = <SearchMedia />;
  }

  return (
    <div className={styles.main}>
      <MediaNavigaton />

      {mediaContent}
    </div>
  );
}
