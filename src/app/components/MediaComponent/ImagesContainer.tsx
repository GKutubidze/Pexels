"use client";
import React, { useContext, useEffect, useState, useMemo, lazy } from "react";
import styles from "./ImagesContainer.module.css";
import Image from "next/image";
import { MediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import { handleDownload } from "@/app/utils/handleDownload";
import { getUniquePhotos } from "@/app/utils/getUniquePhotos";
import LazyLoad from "react-lazyload";
import { Photo } from "pexels/dist/types";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { toggleLike } from "@/app/utils/ toggleLike";

const LazyImage = lazy(() => import("next/image"));

const ImagesContainer = () => {
  const { photos, setPhotos } = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const client = getPexelsClient();
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const fetchPhotos = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await client.photos.curated({ page, per_page: 15 });
      if ("photos" in response) {
        const newPhotos = response.photos.filter(
          (newPhoto) =>
            !photos.photos.some(
              (existingPhoto) => existingPhoto.id === newPhoto.id
            )
        );
        setPhotos((prevPhotos) => {
          const allPhotos = [...prevPhotos.photos, ...newPhotos];
          return { ...prevPhotos, photos: getUniquePhotos(allPhotos) };
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPhotos(); // Initial fetch on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loadingMore &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
      ) {
        fetchPhotos();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore]);

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    photos.photos.forEach((photo, index) => {
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
    <div>
      {memoizedPhotos}
      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};

export default ImagesContainer;
