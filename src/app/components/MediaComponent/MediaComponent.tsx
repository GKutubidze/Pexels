import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "./MediaComponent.module.css";
import { Photo, PhotosWithTotalResults } from "pexels";
import Image from "next/image";
import MediaHeader from "./MediaHeader";
import MediaNavigaton from "./MediaNavigaton";
import { MyContext } from "@/app/Context";

export default function MediaComponent() {
  const context=useContext(MyContext);
 
  const handleImageLoad = () => {
    context.setLoading(false); // Update loading state when image is loaded
    console.log("Image loaded successfully");
  };
  return (
    <div className={styles.main}>
      <MediaNavigaton/>
      <MediaHeader/>
      <div className={styles.photosContainer}>
        {context.photos.photos.map((photo) => (
          <div key={photo.id} className={styles.photoWrapper}>
            <Image
              src={photo.src.original}
              alt=""
              width={photo.width}
              height={photo.height}
              className={styles.photo}
              layout="responsive"
              onLoad={handleImageLoad}
              priority
            />
          </div>
        ))}
      </div>
      {context.loading && <div className={styles.loadingIndicator}>Loading...</div>}

    </div>
  );
}
