"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import styles from "./PhotosGrid.module.css";
import { Photo, PhotosWithTotalResults } from "pexels/dist/types";
import { handleDownload } from "@/app/utils/handleDownload";
import ImagePopup from "../ImagePopup/ImagePopup";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import useLikedPhotos from "@/app/hooks/useLikedPhotos";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import { handleLike } from "@/app/utils/handleLike";

interface PhotosGridProps {
  photos: Photo[];
  likedPhotoIds: number[];
  loadingMore: boolean;
  setPhotos: React.Dispatch<React.SetStateAction<PhotosWithTotalResults>>;
  photoss: PhotosWithTotalResults;
  setLikedPhotoIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const PhotosGrid: React.FC<PhotosGridProps> = ({
  photos,
  likedPhotoIds,
  setPhotos,
  setLikedPhotoIds,
  loadingMore,
  photoss,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const user = useAuth();
  const supabase = supabaseBrowser();
  const { setLikedPhotos } = useLikedPhotos();

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    photos.forEach((photo, index) => {
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
                  onClick={() =>
                    handleLike(
                      photo.id,
                      photoss,
                      user,
                      supabase,
                      setLikedPhotos,
                      setPhotos,
                      setLikedPhotoIds
                    )
                  }
                >
                  <Image
                    src={
                      likedPhotoIds.includes(photo.id)
                        ? "/images/heartred.svg"
                        : "/images/heart.svg"
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
                  priority
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setIsPopupOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, likedPhotoIds, numberOfColumns]);

  return (
    <>
      {isPopupOpen && (
        <ImagePopup photo={selectedPhoto} setIsPopupOpen={setIsPopupOpen} />
      )}
      {memoizedPhotos}

      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </>
  );
};

export default PhotosGrid;
