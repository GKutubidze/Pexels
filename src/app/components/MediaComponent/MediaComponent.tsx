import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "./MediaComponent.module.css";
import MediaHeader from "./MediaHeader";
import MediaNavigaton from "./MediaNavigaton";
import { MediaContext } from "@/app/Context/MediaContext";
import ImagesContainer from "./ImagesContainer";
import VideosContainer from "./VideosContainer";

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
  }

  return (
    <div className={styles.main}>
      <MediaNavigaton />

      {mediaContent}

      {context.loading && (
        <div className={styles.loadingIndicator}>Loading...</div>
      )}
    </div>
  );
}
