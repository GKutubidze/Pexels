import { useMediaContext } from "@/app/Context/MediaContext";
import React, { useMemo } from "react";
import Image from "next/image";
import { handleDownload } from "@/app/utils/handleDownload";
import styles from "./Liked.module.css";
import { toggleLike } from "@/app/utils/ toggleLike";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { Photo } from "pexels";

export const Liked = () => {
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const { photos, searchedPhotos, setPhotos, setSearchedPhotos } =
    useMediaContext();
  const filtered = photos.photos.filter((item) => item.liked);
  const fillteredSearch = searchedPhotos.photos.filter((item) => item.liked);


  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    filtered.forEach((photo, index) => {
      columns[index % numberOfColumns].push(photo);
    });
    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoWrapper}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoContainer}>
                <div className={styles.overlay}>
                  <Image
                    src={"/images/download.svg"}
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
                    src={
                      photo.liked ? "/images/heartred.svg" : "/images/heart.svg"
                    }
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>

                <Image
                  key={index}
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);


  const memoizedPhoto = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    fillteredSearch.forEach((photo, index) => {
      columns[index % numberOfColumns].push(photo);
    });
    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoWrapper}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoContainer}>
                <div className={styles.overlay}>
                  <Image
                    src={"/images/download.svg"}
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
                    src={
                      photo.liked ? "/images/heartred.svg" : "/images/heart.svg"
                    }
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>

                <Image
                  key={index}
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);

  return (
    <div  >
      {memoizedPhotos}
      {memoizedPhoto}
      {/* {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>} */}
    </div>
  );
};
