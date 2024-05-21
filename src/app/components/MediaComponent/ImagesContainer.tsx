"use client";
import React, { useContext, useEffect, useState, useMemo, lazy } from "react";
import styles from "./ImagesContainer.module.css";
import Image from "next/image";
import download from "../../../../public/images/download.svg";
import { MediaContext } from "@/app/Context/MediaContext";
 import { getPexelsClient } from "@/app/utils/getPexelsClient";
import { handleDownload } from "@/app/utils/handleDownload";
 

const LazyImage = lazy(() => import("next/image"));

const ImagesContainer = () => {
  const {photos,setPhotos} = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const client = getPexelsClient();

  const toggleLike = (id: number) => {
     setPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.photos.map((photo) => {
        if (photo.id === id) {
          return { ...photo, liked: !photo.liked };
        }
        return photo;
      });
      return { ...prevPhotos, photos: updatedPhotos };
    });
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  // Function to ensure unique photos based on their IDs
  const getUniquePhotos = (photos: any[]) => {
    const uniquePhotosMap = new Map();
    photos.forEach((photo) => uniquePhotosMap.set(photo.id, photo));
    return Array.from(uniquePhotosMap.values());
  };


  useEffect(() => {
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
  
    
    const handleScroll = () => {
      if (
        !loadingMore &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
      ) {
        fetchPhotos(); // Trigger API call when reaching near bottom
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore]); // Re-run effect when loadingMore changes
  

 
  

  const memoizedPhotos = useMemo(() => {
    return  photos.photos.map((photo, index) => (
      <div key={index} className={styles.photoWrapper}>
        <div className={styles.overlay}>
          <Image
            src={download}
            alt=""
            onClick={() => handleDownload(photo.src.original, photo.photographer)}
          />
        </div>
        <div className={styles.heart} onClick={() => toggleLike(photo.id)}>
          <Image src={photo.liked ? "/images/heartred.svg" : "/images/heart.svg"} alt="like" key={index} width={25} height={25}/>
        </div>
        <LazyImage
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
  }, [ photos.photos]);

  return (
    <div className={styles.photosContainer}>
      {memoizedPhotos}
      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};

export default ImagesContainer;
