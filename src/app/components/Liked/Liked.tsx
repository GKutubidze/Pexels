import { useMediaContext } from "@/app/Context/MediaContext";
import React, { useMemo } from "react";
import Image from "next/image";
import { handleDownload } from "@/app/utils/handleDownload";
import styles from "./Liked.module.css";
import { toggleLike } from "@/app/utils/ toggleLike";

export const Liked = () => {
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const { photos, searchedPhotos, setPhotos, setSearchedPhotos } =
    useMediaContext();
  const filtered = photos.photos.filter((item) => item.liked);
  const fillteredSearch = searchedPhotos.photos.filter((item) => item.liked);
  const memoizedPhotos = useMemo(() => {
    return filtered.map((photo, index) => (
      <div key={index} className={styles.photoWrapper}>
        <div className={styles.overlay}>
          <Image
            src={"images/download.svg"}
            alt=""
            onClick={() =>
              handleDownload(photo.src.original, photo.photographer)
            }
            width={25}
            height={25}
          />
        </div>
        <div
          className={styles.heart}
          onClick={() => toggleLike(photo.id, setPhotos)}
        >
          <Image
            src={photo.liked ? "/images/heartred.svg" : "/images/heart.svg"}
            alt="like"
            key={index}
            width={25}
            height={25}
          />
        </div>
        <Image
          src={photo.src.original}
          alt={photo.alt || ""}
          width={500}
          height={500}
          className={styles.photo}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);

  const memoizedPhoto = useMemo(() => {
    return fillteredSearch.map((photo, index) => (
      <div key={index} className={styles.photoWrapper}>
        <div className={styles.overlay}>
          <Image
            src={"images/download.svg"}
            alt=""
            onClick={() =>
              handleDownload(photo.src.original, photo.photographer)
            }
            width={25}
            height={25}
          />
        </div>
        <div
          className={styles.heart}
          onClick={() => toggleLike(photo.id, setSearchedPhotos)}
        >
          <Image
            src={photo.liked ? "/images/heartred.svg" : "/images/heart.svg"}
            alt="like"
            key={index}
            width={25}
            height={25}
          />
        </div>
        <Image
          src={photo.src.original}
          alt={photo.alt || ""}
          width={500}
          height={500}
          className={styles.photo}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);

  return (
    <div className={styles.photosContainer}>
      {memoizedPhotos}
      {memoizedPhoto}
      {/* {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>} */}
    </div>
  );
};
