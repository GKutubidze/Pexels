"use client";
import React, { useState } from "react";
import styles from "./VideoPopup.module.css";
import Video from "react-player";
import Image from "next/image";
import { Video as VideoType } from "@/app/Types";

interface VideoPopupProps {
  video: VideoType | null;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoPopup: React.FC<VideoPopupProps> = ({ video, setIsPopupOpen }) => {
  const [selectedQuality, setSelectedQuality] = useState<string>("hd");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  if (!video) return null;

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
            <p>User:</p>
            <p className={styles.uploader}>{video.user.name}</p>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={() => window.open(video.video_files[2].link)}
              className={styles.button}
            >
              Free Download
            </button>
            <Image
              src={"/images/arrow-down.svg"}
              alt=""
              width={30}
              height={30}
              className={`${styles.icon} ${
                isDropdownOpen ? styles.rotate : ""
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />

            {isDropdownOpen && (
              <div className={styles.conditional}>
                {video.video_files.map((item, key) => (
                  <p
                    key={key}
                    onClick={() => {
                      window.open(item.link, "_blank");
                    }}
                  >
                    {` ${item.quality} ${item.width}x${item.height} `}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <Video
          url={
            video.video_files.find((file) => file.quality === selectedQuality)
              ?.link || ""
          }
          controls
          width="100%"
          height="auto"
          className={styles.video}
        />
      </div>
    </div>
  );
};

export default VideoPopup;
