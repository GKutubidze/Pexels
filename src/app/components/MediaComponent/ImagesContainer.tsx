"use client";
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import styles from "./ImagesContainer.module.css";
import Image from "next/image";
import download from "../../../../public/download.svg";
import { MediaContext } from "@/app/Context/MediaContext";
import { PhotosWithTotalResults } from "pexels";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import { handleDownload } from "@/app/utils/handleDownload";

type Props = {
  photos: PhotosWithTotalResults;
};

const ImagesContainer = ({ photos }: Props) => {
  const context = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const client = getPexelsClient();
  const observer = useRef<IntersectionObserver | null>(null);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        context.setPhotos((prevPhotos) => ({
          ...prevPhotos,
          photos: [...prevPhotos.photos, ...newPhotos],
        }));
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
  }, [loadingMore, page]);

  const memoizedPhotos = useMemo(() => {
    return photos.photos.map((photo,key) => (
      <div key={key} className={styles.photoWrapper}>
        <div className={styles.overlay}
 >
          <Image
            src={download}
            alt=""
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
          priority
        />
      </div>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);

  return (
    <>
      <div className={styles.photosContainer}>{memoizedPhotos}</div>
      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </>
  );
};

export default ImagesContainer;
