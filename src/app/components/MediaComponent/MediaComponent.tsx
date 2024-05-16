import React, { Dispatch, SetStateAction } from "react";
import styles from "./MediaComponent.module.css";
import { Photo, PhotosWithTotalResults } from "pexels";
import Image from "next/image";
import MediaHeader from "./MediaHeader";
import MediaNavigaton from "./MediaNavigaton";

type Props = {
  photos: PhotosWithTotalResults
  loading: boolean;
  error: any;
  setLoading:Dispatch<SetStateAction<boolean>>
};
export default function MediaComponent(props: Props) {
  const { photos, loading, error,setLoading} = props;
 
  const handleImageLoad = () => {
    setLoading(false); // Update loading state when image is loaded
    console.log("Image loaded successfully");
  };
  return (
    <div className={styles.main}>
      <MediaNavigaton/>
      <MediaHeader/>
      <div className={styles.photosContainer}>
        {photos.photos.map((photo) => (
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
      {loading && <div className={styles.loadingIndicator}>Loading...</div>}

    </div>
  );
}
