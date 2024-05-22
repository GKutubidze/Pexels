"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { lazy, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./SearchMedia.module.css";
import download from "../../../../public/images/download.svg";
import { handleDownload } from "@/app/utils/handleDownload";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { Photo } from "pexels/dist/types";
const LazyImage = lazy(() => import("next/image"));

export const SearchMedia = () => {
  const {searchedPhotos,setSearchedPhotos,query} = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const [loadingMorePicture, setLoadingMorePicture] = useState<boolean>(false);
  const client = getPexelsClient();
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Error loading image");
  };

  const toggleLike = (id: number) => {
    setSearchedPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.photos.map((photo) => {
        if (photo.id === id) {
          return { ...photo, liked: !photo.liked };
        }
        return photo;
      });
      return { ...prevPhotos, photos: updatedPhotos };
    });
  };

  const searchPhotos = async (newQuery: string, newPage: number) => {
    setLoadingMorePicture(true);
    try {
      const response = await client.photos.search({
        query: newQuery,
        page: newPage,
        per_page: 10,
      });

      if ("photos" in response) {
        if (newPage === 1) {
          setSearchedPhotos({
            photos: response.photos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          });
        } else {
          setSearchedPhotos((prevPhotos) => ({
            ...prevPhotos,
            photos: [...prevPhotos.photos, ...response.photos],
            page: response.page,
            next_page: response.next_page,
          }));
        }
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMorePicture(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== "") {
      setPage(1); // Reset page to 1 when query changes
      setSearchedPhotos({
        photos: [], // Clear searched photos when query changes
        page: 0,
        per_page: 0,
        total_results: 0,
        next_page: 0
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query ]);

  useEffect(() => {
    if ( query.trim() !== "") {
      searchPhotos( query, page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ query, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    searchedPhotos.photos.forEach((photo, index) => {
      columns[index % numberOfColumns].push(photo);
    });

    return (
      <div className={styles.photosContainer}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoColumn}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoWrapper}>
                <div className={styles.overlay}>
                  <Image
                    src={download}
                    alt="Download"
                    onClick={() => handleDownload(photo.src.original, photo.photographer)}
                  />
                </div>
                <div className={styles.heart} onClick={() => toggleLike(photo.id)}>
                  <Image
                    src={photo.liked ? "/images/heartred.svg" : "/images/heart.svg"}
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>
                <LazyImage
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedPhotos.photos, numberOfColumns]);

  return (
    <div  >
      {memoizedPhotos}
      {loadingMorePicture && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};
