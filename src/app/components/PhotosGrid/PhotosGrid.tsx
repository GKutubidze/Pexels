import React from "react";
import Image from "next/image";
import styles from "./PhotosGrid.module.css";
import { Photo } from "pexels/dist/types";
import { handleDownload } from "@/app/utils/handleDownload";
import ImagePopup from "../ImagePopup/ImagePopup";

interface PhotosGridProps {
  photos: Photo[];
  likedPhotoIds: number[];
  handleLike: (photo_id: number) => void;
  numberOfColumns: number;
}

const PhotosGrid: React.FC<PhotosGridProps> = ({
  photos,
  likedPhotoIds,
  handleLike,
  numberOfColumns,
}) => {
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState<boolean>(false);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Error loading image");
  };

  const columns: Photo[][] = Array.from({ length: numberOfColumns }, () => []);

  photos.forEach((photo, index) => {
    columns[index % numberOfColumns].push(photo);
  });

  return (
    <div>
      {isPopupOpen && (
        <ImagePopup photo={selectedPhoto} setIsPopupOpen={setIsPopupOpen} />
      )}
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
                <div className={styles.heart} onClick={() => handleLike(photo.id)}>
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
                  onLoad={handleImageLoad}
                  onError={handleImageError}
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
    </div>
  );
};

export default PhotosGrid;
