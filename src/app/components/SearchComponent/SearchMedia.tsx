"use client";
import { MediaContext, useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./SearchMedia.module.css";
import download from "../../../../public/download.svg";
import { handleDownload } from "@/app/utils/handleDownload";

export const SearchMedia = () => {
  const context = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const client = getPexelsClient();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Error loading image");
  };

  const searchPhotos = async () => {
    setLoadingMore(true);
    try {
      const response = await client.photos.search({
        query: context.query,
        page: page,
        per_page: 10,
      });
      if ("photos" in response) {
        if (page === 1) {
          // Clear previously loaded photos when it's the first page of a new query
          context.setSearchedPhotos({
            photos: [],
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          });
        }
        // Add new photos to the state
        context.setSearchedPhotos((prevPhotos) => ({
          photos: [...prevPhotos.photos, ...response.photos],
          page: response.page,
          per_page: response.per_page,
          total_results: response.total_results,
          next_page: response.next_page,
        }));
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
    setPage(1); // Reset page to 1 when query changes
  }, [context.query]);

  useEffect(() => {
    searchPhotos();
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
            onClick={() => handleDownload(photo.src.original)}
          />
        </div>
        <Image
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.searchedPhotos, context.query]);

  return (
    <div className={styles.photosContainer}>
      {memoizedPhotos}
      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};
