import React from "react";
import styles from "./VideoPopup.module.css";
import { Video } from "@/app/Types";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";
import Link from "next/link";

interface Props {
  video: Video;
  setIsVideoCklicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoPopup: React.FC<Props> = ({ video, setIsVideoCklicked }) => {
  const bestVideoFile = getHighestResolutionVideo(video.video_files);

  const handleOverlayClick = () => {
    setIsVideoCklicked(false);
  };

  const handlePopupClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup} onClick={handlePopupClick}>
        <div className={styles.downloadButton}>
          <Link href={bestVideoFile.link} download>
            Download
          </Link>
        </div>
        <div className={styles.videoContainer}>
          <video
            src={bestVideoFile.link}
            className={styles.video}
            controls
            autoPlay={false}
            controlsList="nodownload"
            disablePictureInPicture
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
