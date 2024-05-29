'use client'
import React, { useState } from "react";
import Image from "next/image";
import styles from "./ImagePopup.module.css";
import { handleDownload } from "@/app/utils/handleDownload";
import { Photo } from "pexels/dist/types";

interface ImagePopupProps {
  photo: Photo | null;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}

const Data = [
  { key: "original", label: "Original 8192x5464" },
  { key: "large", label: "Large 1920x1281" },
  { key: "medium", label: "Medium 1280x854" },
  { key: "small", label: "Small 640x427" },
] as const;

type DataKeys = (typeof Data)[number]['key'];

const ImagePopup: React.FC<ImagePopupProps> = ({ photo, setIsPopupOpen }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  if (!photo) return null;

  return (
    <div
      className={styles.popupBackdrop}
      onClick={() => {
        setIsPopupOpen(false);
      }}
    >
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.info}>
          <div className={styles.authorContainer}>
            <p>Photographer:</p>
            <p className={styles.photographer}>{photo.photographer}</p>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={() =>
                handleDownload(photo.src.original, photo.photographer)
              }
              className={styles.button}
            >
              Free Download
            </button>
            <Image
              src={"/images/arrow-down.svg"}
              alt=""
              width={30}
              height={30}
              className={`${styles.icon} ${isDropdownOpen ? styles.rotate : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />


            {
                isDropdownOpen && <div className={styles.conditional}>
                {Data.map((item, key) => (
                  <p
                    key={key}
                    onClick={() => {
                      handleDownload(photo.src[item.key as DataKeys], photo.photographer);
                    }}
                  >
                    {item.label}
                  </p>
                ))}
              </div>
            }
            
          </div>
        </div>

        <Image
          src={photo.src.original}
          alt={photo.alt || ""}
          width={500}
          height={500}
          className={styles.photo}
        />
      </div>
    </div>
  );
};

export default ImagePopup;
