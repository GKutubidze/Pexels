import { useMediaContext } from '@/app/Context/MediaContext'
import React, { useMemo } from 'react'
import Image from 'next/image';
import { handleDownload } from '@/app/utils/handleDownload';
import styles from "./Liked.module.css"
import download from "../../../../public/download.svg";
import heart from "../../../../public/heart.svg"
import redHeart from "../../../../public/heartred.svg"

export const Liked = () => {

    const toggleLike = (id: number) => {

        context.setPhotos((prevPhotos) => {
          const updatedPhotos = prevPhotos.photos.map((photo) => {
            if (photo.id === id) {
              return { ...photo, liked: !photo.liked };
            }
            return photo;
          });
          console.log(context.photos.photos[id])
    
          return { ...prevPhotos, photos: updatedPhotos };
    
        });
      };
      const handleImageLoad = () => {
        console.log("Image loaded successfully");
      };
    
    const context=useMediaContext();
    const filtered = context.photos.photos.filter(item => item.liked);
    console.log(filtered);

     const memoizedPhotos = useMemo(() => {
        return filtered.map((photo, index) => (
             
          <div key={index} className={styles.photoWrapper}>
            <div className={styles.overlay}>
              <Image
                src={download}
                alt=""
                onClick={() => handleDownload(photo.src.original,photo.photographer)}
              />
            </div>
            <div className={styles.heart} onClick={() => toggleLike(photo.id)}>
            <Image src={photo.liked ? redHeart : heart} alt="like" key={index} />
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
      }, [context.photos.photos]);
    
  
    return (
        <div className={styles.photosContainer}>
          {memoizedPhotos}
          {/* {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>} */}
        </div>
      );
}
