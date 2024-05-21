"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { lazy, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./SearchMedia.module.css";
import download from "../../../../public/images/download.svg";
import { handleDownload } from "@/app/utils/handleDownload";
const LazyImage = lazy(() => import("next/image"));

export const SearchMedia = () => {
  const context = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const [loadingMorePicture, setLoadingMorePicture] = useState<boolean>(false);
  const client = getPexelsClient();

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Error loading image");
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
          context.setSearchedPhotos({
            photos: response.photos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          });
        } else {
          context.setSearchedPhotos((prevPhotos) => ({
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
    if (context.query.trim() !== "") {
      setPage(1); // Reset page to 1 when query changes
    }
  }, [context.query]);

  useEffect(() => {
    if (context.query.trim() !== "") {
      searchPhotos(context.query, page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.query, page]);

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
    return context.searchedPhotos.photos.map((photo, index) => (
      <div key={index} className={styles.photoWrapper}>
        <div className={styles.overlay}>
          <Image
            src={download}
            alt="Download"
            onClick={() => handleDownload(photo.src.original,photo.photographer)}
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
    ));
  }, [context.searchedPhotos.photos]);

  return (
    <div className={styles.photosContainer}>
      {memoizedPhotos}
      {loadingMorePicture && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};
